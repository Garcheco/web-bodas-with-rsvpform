-- ============================================================
-- 1. PROTECT RSVP SUBMISSION TIMESTAMP
-- ============================================================

-- Prevent modifications to submitted_at after RSVP creation.
-- submitted_at must always represent the first submission.

create function private.prevent_rsvp_submitted_at_change()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin

  if new.submitted_at is distinct from old.submitted_at then

    raise exception
      'RSVP submitted_at cannot be modified after creation';

  end if;

  return new;

end;
$$;


-- Restrict direct execution privileges.

revoke all
on function private.prevent_rsvp_submitted_at_change()
from public;


-- Automatically enforce the rule before every RSVP update.

create trigger prevent_rsvps_submitted_at_change
before update on public.rsvps
for each row
execute function private.prevent_rsvp_submitted_at_change();

-- ============================================================
-- RSVP MESSAGE LENGTH CONSTRAINT
-- ============================================================

alter table public.rsvps
add constraint rsvps_message_length
check (
  message is null
  or char_length(message) <= 1000
);

-- ============================================================
-- 2. SUBMIT RSVP
-- ============================================================

create function public.submit_rsvp(
  p_token_hash text,
  p_status public.rsvp_status,
  p_guest_names text[],
  p_message text,
  p_expected_version integer
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare

  -- Invitation and wedding information.
  v_invitation record;
  v_wedding record;

  -- Normalized guest information.
  v_guest_name text;
  v_guest_names text[] := array[]::text[];
  v_guest_count integer := 0;

    -- Existing RSVP.
  v_rsvp record;

  -- Current RSVP version (0 means no response).
  v_current_version integer := 0;

  -- Normalized message.
  v_normalized_message text;

  -- Guest arrays used for comparison.
  v_existing_guest_names text[] := array[]::text[];
  v_sorted_guest_names text[] := array[]::text[];

  -- Whether the submitted information matches the current RSVP.
  v_is_noop boolean := false;


begin

  -- ----------------------------------------------------------
  -- 1. Validate input
  -- ----------------------------------------------------------

  if p_token_hash is null
     or p_token_hash !~ '^[a-f0-9]{64}$' then

    raise exception 'Invalid invitation token';

  end if;

  if p_expected_version is null
     or p_expected_version < 0 then

    raise exception 'Invalid expected version';

  end if;

  if p_status is null then

    raise exception 'RSVP status is required';

  end if;


  -- ----------------------------------------------------------
  -- 2. Find and lock invitation
  -- ----------------------------------------------------------

  select
    i.id,
    i.wedding_id,
    i.max_guests,
    i.is_active
  into v_invitation
  from public.invitations as i
  where i.access_token_hash = p_token_hash
  for update;

  if not found then

    raise exception 'Invitation not found';

  end if;


  -- ----------------------------------------------------------
  -- 3. Validate invitation activity
  -- ----------------------------------------------------------

  if not v_invitation.is_active then

    raise exception 'Invitation is inactive';

  end if;


  -- ----------------------------------------------------------
  -- 4. Load wedding
  -- ----------------------------------------------------------

  select
    w.id,
    w.is_active,
    w.rsvp_deadline
  into v_wedding
  from public.weddings as w
  where w.id = v_invitation.wedding_id;

  if not found then

    raise exception 'Wedding not found';

  end if;


  -- ----------------------------------------------------------
  -- 5. Validate wedding activity and deadline
  -- ----------------------------------------------------------

  if not v_wedding.is_active then

    raise exception 'Wedding is inactive';

  end if;

  if clock_timestamp() > v_wedding.rsvp_deadline then

    raise exception 'RSVP deadline has passed';

  end if;

  -- ----------------------------------------------------------
  -- 6. Validate and normalize guests
  -- ----------------------------------------------------------

  -- Require an explicit guest list.
  if p_guest_names is null then
    raise exception 'Guest list is required';
  end if;

  -- Reject multidimensional arrays.
  if coalesce(array_ndims(p_guest_names), 1) > 1 then
    raise exception 'Guest list must be one-dimensional';
  end if;

  -- Count guests before normalization.
  v_guest_count := cardinality(p_guest_names);

  -- Validate attendance rules.
  if p_status = 'accepted' then

    if v_guest_count < 1 then
      raise exception
        'Accepted RSVP requires at least one guest';
    end if;

    if v_guest_count > v_invitation.max_guests then
      raise exception
        'Guest count exceeds invitation limit';
    end if;

  elsif p_status = 'declined' then

    if v_guest_count > 0 then
      raise exception
        'Declined RSVP cannot contain guests';
    end if;

  end if;


  -- Normalize and validate each guest name.
  foreach v_guest_name in array p_guest_names
  loop

    -- Reject NULL elements.
    if v_guest_name is null then
      raise exception 'Guest name cannot be null';
    end if;

    -- Normalize whitespace.
    v_guest_name := trim(
      regexp_replace(
        v_guest_name,
        '[[:space:]]+',
        ' ',
        'g'
      )
    );

    -- Reject empty names.
    if length(v_guest_name) = 0 then
      raise exception 'Guest name cannot be empty';
    end if;

    -- Enforce maximum name length.
    if length(v_guest_name) > 120 then
      raise exception
        'Guest name exceeds 120 characters';
    end if;

    -- Add normalized name to the result array.
    v_guest_names := array_append(
      v_guest_names,
      v_guest_name
    );

  end loop;

  -- ----------------------------------------------------------
  -- 7. Load existing RSVP
  -- ----------------------------------------------------------

  select
    r.id,
    r.status,
    r.version,
    r.message,
    r.submitted_at,
    r.updated_at
  into v_rsvp
  from public.rsvps as r
  where r.invitation_id = v_invitation.id;

  if found then

    v_current_version := v_rsvp.version;

  else

    -- No RSVP exists yet.
    v_current_version := 0;

  end if;
  
  -- ----------------------------------------------------------
  -- 8. Normalize message and prepare guest comparison
  -- ----------------------------------------------------------

  -- Convert empty messages to NULL.
  v_normalized_message := nullif(
    btrim(p_message),
    ''
  );

  -- Limit message length.
  if v_normalized_message is not null
     and char_length(v_normalized_message) > 1000 then

    raise exception
      'RSVP message exceeds 1000 characters';

  end if;

  -- Sort submitted guests for comparison.
  select coalesce(
    array_agg(
      x.guest_name
      order by x.guest_name collate "C"
    ),
    array[]::text[]
  )
  into v_sorted_guest_names
  from unnest(v_guest_names) as x(guest_name);


  -- Load and sort previously stored guests.
  if v_current_version > 0 then

    select coalesce(
      array_agg(
        g.full_name
        order by g.full_name collate "C"
      ),
      array[]::text[]
    )
    into v_existing_guest_names
    from public.guests as g
    where g.rsvp_id = v_rsvp.id;

  end if;

  -- ----------------------------------------------------------
  -- 9. Detect effective changes
  -- ----------------------------------------------------------

  if v_current_version > 0 then

    if
      v_rsvp.status = p_status

      and v_rsvp.message is not distinct from
          v_normalized_message

      and v_existing_guest_names = v_sorted_guest_names

    then

      -- The submitted RSVP matches the current state.
      v_is_noop := true;

    end if;

  end if;

  -- ----------------------------------------------------------
  -- 10. Validate optimistic concurrency
  -- ----------------------------------------------------------

  if not v_is_noop
     and p_expected_version <> v_current_version then

    raise exception
      'RSVP version conflict'
      using errcode = 'P4090';

  end if;

  -- ----------------------------------------------------------
  -- 11. Persist RSVP and guests
  -- ----------------------------------------------------------

  -- Only write when the submitted information differs
  -- from the current database state.

  if not v_is_noop then

    -- --------------------------------------------------------
    -- CASE A: First RSVP submission
    -- --------------------------------------------------------

    if v_current_version = 0 then

      insert into public.rsvps (
        invitation_id,
        status,
        message
      )
      values (
        v_invitation.id,
        p_status,
        v_normalized_message
      )
      returning
        id,
        status,
        version,
        message,
        submitted_at,
        updated_at
      into v_rsvp;


    -- --------------------------------------------------------
    -- CASE B: Update existing RSVP
    -- --------------------------------------------------------

    else

      update public.rsvps as r
      set
        status = p_status,
        message = v_normalized_message,
        version = r.version + 1
      where
        r.id = v_rsvp.id
        and r.version = v_current_version
      returning
        r.id,
        r.status,
        r.version,
        r.message,
        r.submitted_at,
        r.updated_at
      into v_rsvp;

      -- Defensive concurrency check.
      if not found then

        raise exception
          'RSVP version conflict'
          using errcode = 'P4090';

      end if;


      -- Replace previously stored guests.
      delete from public.guests as g
      where g.rsvp_id = v_rsvp.id;

    end if;


    -- --------------------------------------------------------
    -- Insert the current guest list
    -- --------------------------------------------------------

    insert into public.guests (
      rsvp_id,
      full_name
    )
    select
      v_rsvp.id,
      guest.full_name
    from unnest(v_guest_names) as guest(full_name);

  end if;

  -- ----------------------------------------------------------
  -- 12. Create synchronization job
  -- ----------------------------------------------------------

  -- Generate a sync job only when the RSVP actually changed.

  if not v_is_noop then

    insert into private.sheet_sync_jobs (
        rsvp_id,
        rsvp_version
    )
    values (
        v_rsvp.id,
        v_rsvp.version
    );

  end if;

  -- ----------------------------------------------------------
  -- 13. Return RSVP result
  -- ----------------------------------------------------------

  return jsonb_build_object(

    'result',
      case

        when v_is_noop then
          'unchanged'

        when v_current_version = 0 then
          'created'

        else
          'updated'

      end,

    'rsvp_id', v_rsvp.id,

    'status', v_rsvp.status,

    'version', v_rsvp.version,

    'submitted_at', v_rsvp.submitted_at,

    'updated_at', v_rsvp.updated_at

  );

end;
$$;

-- ============================================================
-- 3. SUBMIT RSVP PRIVILEGES
-- ============================================================

-- Prevent public clients from executing submit_rsvp.

revoke all
on function public.submit_rsvp(
  text,
  public.rsvp_status,
  text[],
  text,
  integer
)
from public, anon, authenticated;


-- Allow execution only from the privileged server role.

grant execute
on function public.submit_rsvp(
  text,
  public.rsvp_status,
  text[],
  text,
  integer
)
to service_role;


-- ============================================================
-- 4. PRIVATE SYNC JOB PRIVILEGES
-- ============================================================

-- Allow service_role to reference objects in private schema.

grant usage
on schema private
to service_role;


-- Allow service_role to create synchronization jobs.
-- No SELECT, UPDATE or DELETE permissions are granted here.

grant insert
on table private.sheet_sync_jobs
to service_role;

