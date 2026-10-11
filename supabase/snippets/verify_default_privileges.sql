-- Verificación manual para Supabase local.
-- Ejecutar el bloque completo: ROLLBACK elimina los objetos de prueba.
-- Esperado:
-- anon y authenticated: todos los permisos consultados = false.
-- service_role: todos los permisos consultados = true.

begin;

create table public._permissions_probe (
  id integer
);

create function public._permissions_probe_fn()
returns integer
language sql
security invoker
set search_path = ''
as $$ select 1; $$;

select
  role_name,
  has_table_privilege(
    role_name, 'public._permissions_probe', 'SELECT'
  ) as can_select,
  has_table_privilege(
    role_name, 'public._permissions_probe', 'INSERT'
  ) as can_insert,
  has_table_privilege(
    role_name, 'public._permissions_probe', 'TRUNCATE'
  ) as can_truncate,
  has_function_privilege(
    role_name, 'public._permissions_probe_fn()', 'EXECUTE'
  ) as can_execute
from (
  values ('anon'), ('authenticated'), ('service_role')
) as roles(role_name);

rollback;
