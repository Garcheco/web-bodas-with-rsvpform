-- Futuras tablas creadas por postgres en public:
-- sin permisos automáticos para visitantes ni usuarios autenticados.
alter default privileges for role postgres
in schema public
revoke all privileges on tables
from anon, authenticated;

-- Futuras funciones creadas por postgres:
-- quitar el permiso global de ejecución que PostgreSQL concede a PUBLIC.
alter default privileges for role postgres
revoke execute on functions
from public;

-- Quitar también las concesiones explícitas de Supabase
-- para futuras funciones del esquema public.
alter default privileges for role postgres
in schema public
revoke execute on functions
from anon, authenticated;