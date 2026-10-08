# Codex Handoff --- web-bodas-with-rsvpform

> Estado de transferencia preparado desde una sesión previa de ChatGPT.
>
> **Importante para el siguiente agente:** este documento describe
> decisiones y trabajo realizado durante la sesión, pero el repositorio
> es la fuente definitiva del estado actual. Antes de modificar
> archivos, inspecciona el repo, confirma la branch y compara el
> contenido real de las migraciones con este handoff.

## 1. Objetivo del proyecto

Repositorio:

`Garcheco/web-bodas-with-rsvpform`

Branch de desarrollo usada durante esta sesión:

`dev`

El proyecto es un sitio web de boda construido con Next.js y desplegado
en Vercel. El flujo RSVP existente utiliza FormSubmit.

El objetivo es reemplazar gradualmente ese flujo por una solución basada
en Supabase que permita:

-   invitaciones mediante URL/token único;
-   confirmar o rechazar asistencia;
-   registrar los nombres reales de los asistentes;
-   limitar asistentes según los pases asignados;
-   permitir modificar el RSVP hasta una fecha límite configurable;
-   crear posteriormente un dashboard administrativo para la pareja;
-   sincronizar posteriormente la información hacia Google Sheets;
-   mantener Supabase como source of truth;
-   conservar inicialmente FormSubmit hasta que el nuevo flujo esté
    probado.

Este proyecto también tiene un objetivo educativo. Sergio quiere
entender las decisiones y tecnologías utilizadas, no solamente recibir
cambios automáticos. Explicar las decisiones relevantes antes de
introducir arquitectura o código complejo.

## 2. Arquitectura acordada

Flujo objetivo:

``` text
Invitation URL
      |
      v
/rsvp/<opaque-token>
      |
      v
Server-side validation
      |
      v
Supabase
(source of truth)
      |
      +--------------------+
      |                    |
      v                    v
Dashboard            Sync Job / Worker
                           |
                           v
                     Google Sheets
```

Google Sheets NO debe formar parte de la transacción HTTP que guarda el
RSVP.

Si Google Sheets falla:

``` text
RSVP saved in Supabase = SUCCESS
Google Sheets sync      = RETRY LATER
```

Supabase es la fuente de verdad. Google Sheets será una
proyección/reporting layer inicialmente unidireccional.

## 3. Proyecto Supabase

Proyecto cloud:

-   Name: `Boda Edgard`
-   Project ref: `xbfrwgclwrlzjcxepzbf`
-   Organization: `Garcheco's Org`
-   Region: `us-west-1` (N. California)
-   El proyecto fue confirmado previamente como `ACTIVE_HEALTHY`.

CLI utilizada durante la sesión:

``` text
Supabase CLI 2.119.0
```

El usuario ya había ejecutado:

``` bash
npx supabase init
npx supabase start
npx supabase link
```

No ejecutar operaciones destructivas contra el proyecto remoto sin
autorización explícita.

En particular, NO ejecutar:

``` bash
npx supabase db reset --linked
```

## 4. Estrategia de migraciones

Se creó una migración local:

``` text
supabase/migrations/<timestamp>_initial_schema.sql
```

Comando utilizado:

``` bash
npx supabase migration new initial_schema
```

Mientras esta migración siga sin publicarse/aplicarse remotamente, se ha
estado editando directamente y validando mediante:

``` bash
npx supabase db reset
```

Una vez que `initial_schema` sea aplicada remotamente o compartida como
migración estable, NO debe reescribirse. Los cambios posteriores deberán
ser nuevas migraciones.

No ejecutar todavía:

``` bash
npx supabase db push
```

Primero terminar y validar seguridad, advisors y esquema completo.

## 5. Modelo de datos acordado

Modelo principal:

``` text
auth.users
    |
    v
wedding_admins
    |
    v
weddings
    |
    v
invitations
    |
    v
rsvps
    |
    v
guests
```

Infraestructura:

``` text
rsvps
   |
   v
private.sheet_sync_jobs
   |
   v
Sync Worker
   |
   v
Google Sheets
```

Relaciones:

``` text
weddings      1:N      invitations
invitations   1:0..1   rsvps
rsvps         1:N      guests
rsvps         1:N      sheet_sync_jobs
weddings      1:N      wedding_admins
auth.users    1:N      wedding_admins
```

Una invitación representa una persona, familia o grupo al que se asigna
cierto número de pases.

Un guest representa una persona que realmente asistirá.

No utilizar columnas como:

``` text
guest_1
guest_2
guest_3
```

Los asistentes están normalizados en `guests`.

## 6. Enums

Se agregaron conceptualmente:

``` sql
create type public.rsvp_status as enum (
  'accepted',
  'declined'
);

create type public.sync_status as enum (
  'pending',
  'processing',
  'synced',
  'failed'
);
```

Nota de diseño: `sync_status` está relacionado con infraestructura
interna. Puede revisarse si conviene moverlo a `private` antes del
primer push remoto. No cambiarlo automáticamente sin evaluar
dependencias y el estado real de la migración.

## 7. Tabla `weddings`

Diseño acordado:

``` sql
create table public.weddings (
  id uuid primary key default gen_random_uuid(),

  slug text not null unique,
  couple_names text not null,

  event_date timestamptz not null,
  rsvp_deadline timestamptz not null,

  timezone text not null default 'America/Mexico_City',

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint weddings_slug_not_empty
    check (length(trim(slug)) > 0),

  constraint weddings_couple_names_not_empty
    check (length(trim(couple_names)) > 0),

  constraint weddings_deadline_before_event
    check (rsvp_deadline < event_date)
);
```

La fecha límite del RSVP debe ser configurable. No asumir una fecha/año
definitivo sin confirmarlo.

## 8. Tabla `wedding_admins`

Diseño acordado:

``` sql
create table public.wedding_admins (
  id uuid primary key default gen_random_uuid(),

  wedding_id uuid not null
    references public.weddings(id)
    on delete cascade,

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  role text not null default 'admin',

  created_at timestamptz not null default now(),

  constraint wedding_admins_unique_membership
    unique (wedding_id, user_id),

  constraint wedding_admins_role_valid
    check (role in ('owner', 'admin', 'viewer'))
);

create index wedding_admins_user_id_idx
  on public.wedding_admins(user_id);
```

Será la base del futuro dashboard autenticado.

No crear una policy genérica `TO authenticated USING (true)`. El acceso
administrativo debe limitarse por membership de la boda.

## 9. Tabla `invitations`

Diseño acordado:

``` sql
create table public.invitations (
  id uuid primary key default gen_random_uuid(),

  wedding_id uuid not null
    references public.weddings(id)
    on delete cascade,

  household_name text not null,
  contact_name text,

  contact_email text,
  contact_phone text,

  access_token_hash text not null unique,

  max_guests smallint not null default 1,

  is_active boolean not null default true,

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint invitations_household_name_not_empty
    check (length(trim(household_name)) > 0),

  constraint invitations_max_guests_valid
    check (max_guests between 1 and 20)
);

create index invitations_wedding_id_idx
  on public.invitations(wedding_id);
```

### Decisiones importantes sobre tokens

La URL futura será aproximadamente:

``` text
/rsvp/<raw-token>
```

No guardar el token secreto en texto plano.

Guardar:

``` text
access_token_hash
```

El servidor recibe el token, calcula su hash y localiza la invitación.

El token debe tener alta entropía criptográfica (mínimo aproximado: 128
bits). No utilizar códigos cortos/predecibles como único mecanismo de
autorización.

SHA-256 es apropiado para lookup de un token aleatorio de alta entropía.
Esto no debe confundirse con hashing de passwords, donde se requieren
algoritmos lentos especializados.

Como solo se guarda el hash, el token original no puede recuperarse. Si
en el futuro se necesita regenerar/re-enviar un acceso, considerar
rotación del token o almacenamiento cifrado deliberado. No introducir
esta funcionalidad sin diseñarla primero.

`notes` es información administrativa y no debe formar parte de la
respuesta pública al invitado.

## 10. Tabla `rsvps`

Diseño actual acordado:

``` sql
create table public.rsvps (
  id uuid primary key default gen_random_uuid(),

  invitation_id uuid not null unique
    references public.invitations(id)
    on delete cascade,

  status public.rsvp_status not null,

  version integer not null default 1,

  message text,

  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint rsvps_version_valid
    check (version >= 1)
);
```

Semántica:

``` text
No RSVP row     = pending
accepted        = aceptó
declined        = rechazó
```

No agregar `pending` al enum solamente para representar ausencia de
respuesta.

`submitted_at` representa la primera respuesta.

Cuando el RSVP se actualice, NO sobrescribir `submitted_at`.

`updated_at` representa la última modificación.

`version` debe incrementarse cuando cambia el RSVP:

``` text
version 1 -> primera respuesta
version 2 -> primera modificación
version 3 -> segunda modificación
...
```

Esto será importante para sincronización idempotente con Google Sheets.

## 11. Tabla `guests`

Diseño acordado:

``` sql
create table public.guests (
  id uuid primary key default gen_random_uuid(),

  rsvp_id uuid not null
    references public.rsvps(id)
    on delete cascade,

  full_name text not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint guests_full_name_not_empty
    check (length(trim(full_name)) > 0),

  constraint guests_full_name_length
    check (length(trim(full_name)) <= 120)
);

create index guests_rsvp_id_idx
  on public.guests(rsvp_id);
```

Reglas de negocio futuras:

``` text
accepted -> entre 1 y invitation.max_guests guests
declined -> 0 guests
```

La regla:

``` text
COUNT(guests) <= invitation.max_guests
```

es cross-row/cross-table y NO debe intentarse resolver con un CHECK
simple.

Debe validarse dentro de la futura operación transaccional de submit
RSVP.

Para actualizar asistentes, se propuso una estrategia simple:

``` text
BEGIN
update RSVP
delete guests anteriores
insert guests actuales
create sync job
COMMIT
```

Dado que cada invitación tendrá pocos asistentes, reemplazar la pequeña
colección completa es más sencillo que calcular diffs individuales.

## 12. Schema `private`

Se acordó separar infraestructura interna:

``` sql
create schema if not exists private;

revoke all on schema private from public;
```

Objetos internos como jobs y helpers no necesitan exponerse por Data
API.

## 13. Tabla `private.sheet_sync_jobs`

Diseño acordado:

``` sql
create table private.sheet_sync_jobs (
  id uuid primary key default gen_random_uuid(),

  rsvp_id uuid not null
    references public.rsvps(id)
    on delete cascade,

  rsvp_version integer not null,

  status public.sync_status not null default 'pending',

  attempts smallint not null default 0,

  next_attempt_at timestamptz not null default now(),
  last_attempt_at timestamptz,
  locked_at timestamptz,

  last_error text,

  created_at timestamptz not null default now(),
  processed_at timestamptz,

  constraint sheet_sync_jobs_rsvp_version_valid
    check (rsvp_version >= 1),

  constraint sheet_sync_jobs_attempts_valid
    check (attempts >= 0),

  constraint sheet_sync_jobs_unique_version
    unique (rsvp_id, rsvp_version)
);
```

Índice:

``` sql
create index sheet_sync_jobs_pending_idx
  on private.sheet_sync_jobs(status, next_attempt_at)
  where status in ('pending', 'failed');
```

Defense in depth:

``` sql
alter table private.sheet_sync_jobs
  enable row level security;
```

### Razón de `rsvp_version`

Evita que un job viejo sobrescriba en Sheets una respuesta nueva.

Ejemplo:

``` text
RSVP v1 = accepted
RSVP v2 = declined

Job v2 se procesa primero -> Sheets = declined
Job v1 llega después       -> debe detectarse como stale y NO escribir
```

Unique:

``` text
(rsvp_id, rsvp_version)
```

evita crear dos jobs equivalentes para la misma versión.

`attempts`, `next_attempt_at`, `last_attempt_at`, `locked_at` y
`last_error` preparan el worker para retries, backoff, locking y
troubleshooting.

## 14. Google Sheets --- decisiones

Supabase será la fuente de verdad.

Google Sheets inicialmente será:

``` text
Supabase -> Google Sheets
```

NO:

``` text
Supabase <-> Google Sheets
```

No permitir inicialmente edición bidireccional para evitar conflictos.

Se propuso una fila de Sheets por invitación/familia y utilizar como
identificador estable oculto:

``` text
invitation UUID
```

No depender del número de fila ni del nombre de la familia.

La sincronización debe tener retries y control de duplicados.

## 15. `updated_at`

Se estaba agregando el siguiente helper:

``` sql
create function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
```

Triggers propuestos:

``` sql
create trigger set_weddings_updated_at
before update on public.weddings
for each row
execute function private.set_updated_at();

create trigger set_invitations_updated_at
before update on public.invitations
for each row
execute function private.set_updated_at();

create trigger set_rsvps_updated_at
before update on public.rsvps
for each row
execute function private.set_updated_at();

create trigger set_guests_updated_at
before update on public.guests
for each row
execute function private.set_updated_at();
```

También:

``` sql
revoke all
on function private.set_updated_at()
from public;
```

Confirmar en el repo si este bloque quedó efectivamente guardado antes
de asumirlo.

## 16. RLS

Antes de cualquier `db push`, todas las tablas dentro del schema
expuesto `public` deben tener RLS habilitado.

Bloque acordado:

``` sql
alter table public.weddings
  enable row level security;

alter table public.wedding_admins
  enable row level security;

alter table public.invitations
  enable row level security;

alter table public.rsvps
  enable row level security;

alter table public.guests
  enable row level security;
```

`private.sheet_sync_jobs` también tiene RLS como defense in depth.

Por ahora NO se habían diseñado las policies definitivas.

Intención actual:

``` text
anon          -> no direct table access
authenticated -> no direct table access initially
```

Guest authorization será mediante el token opaco de la invitación, no
Supabase Auth.

El futuro `/admin` sí utilizará Supabase Auth + `wedding_admins`.

No crear policies amplias solamente para hacer que una consulta
funcione.

## 17. Grants / privileges

Se propuso:

``` sql
revoke all on table public.weddings
  from anon, authenticated;

revoke all on table public.wedding_admins
  from anon, authenticated;

revoke all on table public.invitations
  from anon, authenticated;

revoke all on table public.rsvps
  from anon, authenticated;

revoke all on table public.guests
  from anon, authenticated;
```

Y default privileges:

``` sql
alter default privileges for role postgres
in schema public
revoke select, insert, update, delete
on tables
from anon, authenticated;

alter default privileges for role postgres
in schema public
revoke execute
on functions
from public;
```

IMPORTANTE: verificar el estado real de la migración antes de asumir que
este bloque fue guardado/aplicado.

Grants y RLS son mecanismos diferentes. No confundirlos.

## 18. Service role / privileged server key

Nunca exponer una key privilegiada/service role al navegador.

Nunca colocarla en una variable pública como:

``` text
NEXT_PUBLIC_...
```

El navegador puede utilizar una publishable key. La seguridad real debe
depender de RLS, grants y operaciones controladas.

Si el backend utiliza una key privilegiada, debe existir exclusivamente
server-side.

## 19. Futuro `submit_rsvp`

Todavía NO implementado.

Conceptualmente debe realizar:

``` text
BEGIN

1. Hash incoming invitation token
2. Find invitation
3. Verify invitation exists
4. Verify invitation.is_active
5. Load wedding
6. Verify wedding.is_active
7. Verify now <= rsvp_deadline
8. Validate RSVP status
9. Validate guests against status
10. Validate guest count <= max_guests
11. Insert/update RSVP
12. Increment RSVP version when appropriate
13. Preserve original submitted_at
14. Replace guest rows
15. Create sheet_sync_job for current RSVP version
16. COMMIT
```

Cualquier fallo debe producir rollback completo.

No permitir:

``` text
accepted + 0 guests
declined + guests
guests > max_guests
expired invitation
inactive invitation
```

Hay que decidir cuidadosamente dónde implementar esta operación.

Dos posibilidades discutidas:

1.  Next.js server action/route usando credencial server-only.
2.  RPC/Postgres function.

No crear casualmente funciones `SECURITY DEFINER`. Si se usa una,
revisar search_path, schema, auth checks, EXECUTE grants y exposición.
Mantener helpers privilegiados fuera de schemas expuestos siempre que
sea posible.

## 20. Error actual --- IMPORTANTE

El último `npx supabase db reset` no terminó normalmente.

Error:

``` text
supabase_storage_web-bodas-with-rsvpform container is not ready: unhealthy
```

No se concluyó que fuera un error SQL.

El diagnóstico actual es que el servicio local de Supabase
Storage/Docker quedó unhealthy durante/tras el reset.

Se indicó NO modificar todavía `initial_schema.sql` debido solamente a
este error.

### Siguiente diagnóstico acordado

Primero:

``` bash
npx supabase stop
npx supabase start
```

No utilizar todavía:

``` bash
npx supabase stop --no-backup
```

Si `start` vuelve a fallar:

``` bash
docker ps -a --filter "name=supabase_storage"
```

Después:

``` bash
docker logs supabase_storage_web-bodas-with-rsvpform --tail 100
```

Y:

``` bash
docker inspect \
  --format='{{json .State.Health}}' \
  supabase_storage_web-bodas-with-rsvpform
```

También:

``` bash
npx supabase status
```

Objetivo: determinar si Storage es la causa primaria o si
Database/Auth/REST también están fallando.

NO borrar volumes ni utilizar `--no-backup` antes de revisar logs, salvo
que el usuario lo autorice y exista una razón concreta.

## 21. Después de resolver Storage

Si el stack vuelve a estar healthy:

``` bash
npx supabase db reset
```

Después comprobar RLS:

``` sql
select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname in ('public', 'private')
  and tablename in (
    'weddings',
    'wedding_admins',
    'invitations',
    'rsvps',
    'guests',
    'sheet_sync_jobs'
  )
order by schemaname, tablename;
```

Objetivo esperado:

``` text
private | sheet_sync_jobs | true

public  | guests          | true
public  | invitations     | true
public  | rsvps           | true
public  | wedding_admins  | true
public  | weddings        | true
```

También probar el trigger `updated_at` localmente antes del push.

## 22. Database Advisors

Después de tener:

-   reset exitoso;
-   schema validado;
-   RLS confirmado;
-   triggers confirmados;
-   grants revisados;

ejecutar los Database Advisors disponibles en la versión instalada de la
CLI.

Descubrir primero la sintaxis real con:

``` bash
npx supabase db --help
npx supabase db advisors --help
```

No asumir flags de otra versión de CLI.

Revisar warnings antes de `db push`.

## 23. Seed data

Después del hardening y advisors, crear `supabase/seed.sql`.

No usar todavía información real de invitados.

Crear datos ficticios suficientes para probar escenarios como:

``` text
Familia García   max_guests=4
Ana López        max_guests=1
Familia Pérez    max_guests=2
```

Probar:

-   pending;
-   accepted;
-   declined;
-   edición de RSVP;
-   guest count;
-   max_guests;
-   deadline;
-   invitation inactive;
-   version increment;
-   sync job generation.

No asumir la fecha real de la boda ni el deadline definitivo sin
confirmación.

## 24. Dashboard futuro

El dashboard debería permitir eventualmente:

-   total invitations;
-   pending invitations;
-   accepted invitations;
-   declined invitations;
-   total confirmed attendees;
-   assigned passes;
-   used passes;
-   remaining passes;
-   search invitations;
-   inspect guest names;
-   export CSV/Excel;
-   potentially inspect sync status.

No implementar todavía hasta cerrar el flujo RSVP base.

## 25. FormSubmit

El sitio actual todavía utiliza FormSubmit.

No eliminarlo hasta que el nuevo flujo:

``` text
token -> invitation -> RSVP -> guests -> database
```

esté probado de extremo a extremo.

Migración propuesta:

``` text
1. Supabase core
2. New RSVP flow
3. Validate in dev
4. Google Sheets sync
5. Remove FormSubmit
6. Admin dashboard
```

## 26. Reglas para el siguiente agente

Antes de modificar código:

1.  Confirmar branch actual con Git.
2.  Inspeccionar `supabase/migrations`.
3.  Leer el `initial_schema.sql` real.
4.  Compararlo con este documento.
5.  Revisar `git status`.
6.  No asumir que los últimos bloques SQL se guardaron debido al fallo
    de Storage.
7.  Diagnosticar primero el contenedor unhealthy.
8.  No hacer `db push` hasta completar hardening/advisors.
9.  No ejecutar `db reset --linked`.
10. No exponer service-role/secret keys.
11. Mantener RLS en toda tabla expuesta.
12. Explicar cambios relevantes antes de realizarlos cuando el trabajo
    sea educativo.
13. Hacer cambios incrementales y verificarlos.
14. No reemplazar seguridad por policies demasiado permisivas para
    "hacerlo funcionar".
15. Supabase sigue siendo source of truth; Google Sheets no lo
    sustituye.

## 27. Primer prompt recomendado para Codex

Usar algo equivalente a:

``` text
Lee CODEX_HANDOFF.md completo antes de realizar cambios.

Este archivo contiene las decisiones técnicas y el estado de una sesión anterior.
El repositorio real es la fuente definitiva, así que primero:

1. confirma la branch actual;
2. revisa git status;
3. inspecciona supabase/migrations y el initial_schema.sql;
4. compara el estado real con CODEX_HANDOFF.md;
5. no modifiques archivos todavía.

El problema inmediato es:

supabase_storage_web-bodas-with-rsvpform container is not ready: unhealthy

Ayúdame primero a diagnosticar ese fallo usando el estado real del entorno y los
logs de Docker. No hagas db push ni db reset --linked.

Este proyecto es educativo. Explícame la causa y las decisiones relevantes a
medida que avancemos.
```

------------------------------------------------------------------------

## Estado resumido en una línea

**El schema inicial del nuevo RSVP está prácticamente modelado
localmente, pero antes de validarlo, ejecutar advisors o enviarlo al
Supabase remoto hay que resolver el contenedor local
`supabase_storage_web-bodas-with-rsvpform` que quedó `unhealthy` durante
`db reset`.**