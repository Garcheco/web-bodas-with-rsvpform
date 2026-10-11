select
  table_schema,
  table_name
from information_schema.tables
where table_schema in ('public', 'private')
order by table_schema, table_name;