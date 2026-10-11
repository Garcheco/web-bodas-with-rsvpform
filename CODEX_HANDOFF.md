# CODEX_HANDOFF — web-bodas-with-rsvpform

Actualizado: **11 de octubre de 2026**, zona de la sesión America/Mexico_City.
Repositorio: **Garcheco/web-bodas-with-rsvpform**. Rama de continuidad: **dev**.
Conversación fuente: **Tips web boda**, ID `6abdd1f1-d1b8-83e8-8b2a-38aad7adcdbd`.
Referencia: chatgpt-conversation://6abdd1f1-d1b8-83e8-8b2a-38aad7adcdbd

## 0. Leer primero: punto exacto de continuidad

**La etapa de seguridad y seed local fue reportada como exitosa por el usuario. El siguiente trabajo técnico acordado es la lectura segura de invitaciones mediante token en Next.js. Todavía no se ha implementado en GitHub dev. Antes hay que reconciliar la copia local con GitHub: faltan archivos locales recientes en la rama publicada.**

Este documento transfiere el contexto técnico disponible; no promete una transcripción ilimitada de chats anteriores ni memoria automática. Se leyó la conversación referenciada mediante read_thread: devolvió cinco turnos, sin cursor adicional ni adjuntos. Se integraron también el handoff anterior completo, el contexto del proyecto y archivos reales. El texto de un asistente que propone una tarea no acredita ejecución. No inferir contenido de adjuntos inexistentes.

### Fuentes y niveles de evidencia

- **Verificado en GitHub:** contenido leído en dev el 11 de octubre; commit base `7e6ff067a68d0010b3daf56f157e7a19043f834d`; árbol real `044d87930e11173729cec27486d32a716d0a9320`. Lectura de archivos y árbol recursivo, no ejecución de la app.
- **Reportado por el usuario:** resultados locales pegados en Tips web boda, estructura local y confirmación «Todo ha funcionado correctamente».
- **Histórico:** contexto del 1 de octubre y handoff anterior. Se preservan decisiones, pero sus comprobaciones no son comprobaciones nuevas.
- **Plan:** endpoints, escritura transaccional, integración visual, Sheets y dashboard. No marcar como implementado.
- **No comprobado en esta transferencia:** estado actual de Docker, base local, Supabase Cloud, despliegue, lint/build, secretos, árbol de trabajo local o git status.

La única modificación autorizada y realizada en esta transferencia es **CODEX_HANDOFF.md en dev**, más una copia descargable del mismo contenido. No se cambiaron código, migraciones, configuración ni bases de datos.

### Matriz de estado y diferencias que NO deben perderse

| Elemento | GitHub dev inspeccionado | Evidencia local / conversación | Consecuencia |
| --- | --- | --- | --- |
| `20261002023537_initial_schema.sql` | Existe; blob `105edf54d6284795c5a73ae9e7f3739654c61076` | Figura aplicada en migration list --local | Archivo verificado; aplicación local solo reportada |
| `20261011092114_harden_default_privileges.sql` | No aparece en árbol; fetch 404 | Usuario compartió SQL, ruta local y aplicación en historial | Recuperar/comparar copia local; no afirmar que está publicada |
| `supabase/seed.sql` | Ausente; fetch 404 | Figura en estructura local; usuario confirmó éxito tras instrucciones de reset/consulta | Seed local reportado exitoso; filas actuales no consultadas |
| `supabase/snippets/verify_default_privileges.sql` | Ausente | SQL de prueba y resultado explícitos en chat; figura en estructura | Conservar evidencia; revisar archivo local antes de versionarlo |
| `ESTRUCTURA.md` | Ausente; fetch 404 | Figura en estructura del usuario | No se pudo leer contenido; no se creó en esta transferencia |
| `Untitled query 414.sql` | Ausente | Figura local; contenido no disponible | No atribuirle SQL inventado |
| `Untitled query 499.sql` | Existe | Verificado: enumera tablas public/private | No equivale a prueba de permisos o datos |
| RLS | Initial_schema habilita cinco tablas public y jobs private | Diez filas reales reportadas: RLS true, permisos false para anon/authenticated | Prueba local de cinco tablas; private no incluido en esa salida |
| Advisors | No hay ejecución nueva | `Connecting to local database... No issues found` | Resultado local histórico, no auditoría global ni remota |
| Triggers updated_at | Helper private y cuatro triggers presentes | No se aportó prueba funcional separada | Definición verificada; funcionamiento pendiente de evidencia |
| Backend token | Sin rutas nuevas ni cliente en árbol GitHub | Acordado como siguiente etapa | Pendiente |
| SDK Supabase | No declarado en package.json | Se propuso comprobar e instalar | No asumir instalación local |
| Storage unhealthy | Bloqueo del handoff anterior | Después hubo list/advisors y confirmación de éxito | Incidente histórico superado según continuidad; causa exacta no documentada |

**No reiniciar el diagnóstico de Storage como primer paso por leer el handoff viejo.** Solo retomarlo si el estado actual reproduce el fallo. Tampoco asumir que un clone de dev reproduce el entorno local validado: config.toml habilita seed y apunta a ./seed.sql, pero el archivo falta en GitHub.

## 1. Reglas operativas y de aprendizaje vigentes

1. Hablar en español, explicar decisiones relevantes paso a paso. El usuario quiere aprender, no recibir arquitectura opaca.
2. Leer AGENTS.md, CLAUDE.md y contexto antes de código. AGENTS.md exige consultar guías de la versión instalada de Next.js en `node_modules/next/dist/docs/` antes de escribir código; CLAUDE.md contiene `@AGENTS.md`.
3. El usuario realiza personalmente cambios en Supabase. Preparar SQL y explicar pruebas; no ejecutar cambios remotos de esquema, funciones, permisos o datos. Esta transferencia no autorizó ejecución local tampoco.
4. No hacer db push, db reset --linked, borrar volúmenes, stop --no-backup ni publicar a producción automáticamente. Los resets locales eliminan datos; no ejecutarlos por copiar un comando histórico.
5. Conservar FormSubmit y /rsvp y /rsvp/gracias durante transición; decidir corte tras validación, evitando doble envío.
6. Privileged key solo en servidor; jamás NEXT_PUBLIC_, componentes cliente, logs, Git, exportaciones o handoff.
7. No guardar datos reales de invitados ni tokens reales. Los tokens locales de este documento son fixtures públicos deliberadamente predecibles.
8. No añadir policies permisivas para resolver errores. Permisos de objeto, RLS y autorización de negocio son capas distintas. Una credencial privilegiada exige validar explícitamente cada invitación y boda.
9. Verificar branch, git status y diff en la copia correcta. Ruta local reportada: `/Users/chezko/Desktop/VS Code/web-bodas-with-rsvpform`; no confundir con la carpeta de este chat.
10. No reescribir automáticamente migraciones ya aplicadas/compartidas. La vieja práctica de editar initial_schema era previa al despliegue remoto; verificar historial y estabilidad antes de cualquier decisión.

## 2. Estado del esquema comprobado en el archivo inicial

El SQL real define:
- Enums public.rsvp_status: accepted/declined; public.sync_status: pending/processing/synced/failed.
- weddings: UUID, slug único/no vacío, pareja, event_date/rsvp_deadline timestamptz, timezone por defecto America/Mexico_City, is_active, timestamps; cierre anterior al evento.
- wedding_admins: FK boda y auth.users, membership único, owner/admin/viewer; índice user_id.
- invitations: FK boda, household_name no vacío, contactos opcionales, access_token_hash único, max_guests entre 1 y 20, is_active, notes, timestamps; índice wedding_id.
- rsvps: FK invitation_id único, status, version >=1, message, submitted_at y updated_at. Pendiente = ausencia de fila; no valor pending en rsvp_status.
- guests: FK RSVP, full_name recortado no vacío y <=120, timestamps; índice rsvp_id.
- private.sheet_sync_jobs: FK RSVP, rsvp_version >=1, sync status, attempts >=0, tiempos/reintentos/lock/error; UNIQUE(rsvp_id,rsvp_version), índice parcial status/next_attempt_at para pending/failed.
- FKs anteriores con ON DELETE CASCADE. Preferir desactivación de invitaciones en flujo normal; no interpretar cascade como autorización para borrar.
- private.set_updated_at(): SECURITY INVOKER, search_path vacío; BEFORE UPDATE en weddings/invitations/rsvps/guests; EXECUTE revocado de PUBLIC.
- RLS habilitado en las seis tablas; ninguna CREATE POLICY en el archivo inspeccionado.
- REVOKE ALL en las cinco tablas public para anon/authenticated.
- Defaults antiguos dentro de initial_schema: revoca SELECT/INSERT/UPDATE/DELETE en tablas public y EXECUTE en funciones public para PUBLIC. La segunda migración local amplía/endurece este punto.

Las restricciones de cupo, accepted con al menos uno, declined sin asistentes, cierre, aislamiento de familia, incremento de versión y encolado NO están implementadas por tener las tablas. Deben vivir en la operación autorizada y transaccional. El trigger solo actualiza updated_at: no incrementa version automáticamente.

## 3. Seguridad local: evidencia exacta y límites

Resultado que pegó el usuario:

```text
npx supabase migration list --local
Connecting to local database...

  
   Local            | Remote           | Time (UTC)            
  ------------------|------------------|-----------------------
   `20261002023537` | `20261002023537` | `2026-10-02 02:35:37` 
   `20261011092114` | `20261011092114` | `2026-10-11 09:21:14` 

| tablename      | rls_enabled | role_name     | can_select | can_insert | can_update | can_delete |
| -------------- | ----------- | ------------- | ---------- | ---------- | ---------- | ---------- |
| guests         | true        | anon          | false      | false      | false      | false      |
| guests         | true        | authenticated | false      | false      | false      | false      |
| invitations    | true        | anon          | false      | false      | false      | false      |
| invitations    | true        | authenticated | false      | false      | false      | false      |
| rsvps          | true        | anon          | false      | false      | false      | false      |
| rsvps          | true        | authenticated | false      | false      | false      | false      |
| wedding_admins | true        | anon          | false      | false      | false      | false      |
| wedding_admins | true        | authenticated | false      | false      | false      | false      |
| weddings       | true        | anon          | false      | false      | false      | false      |
| weddings       | true        | authenticated | false      | false      | false      | false      |

npx supabase db advisors
Connecting to local database...
No issues found
```

`migration list --local` compara archivos e historial de la **base local** aunque la columna se llame Remote. NO demuestra aplicación en Supabase Cloud. No issues found solo corresponde a esa ejecución de Advisors, no garantiza endpoint seguro, protección contra abuso o pruebas de negocio.

SQL de segunda migración compartido por el usuario (normalizado para quitar escapes del chat; no leído en GitHub):

```sql
alter default privileges for role postgres
in schema public
revoke all privileges on tables from anon, authenticated;

alter default privileges for role postgres
revoke execute on functions from public;

alter default privileges for role postgres
in schema public
revoke execute on functions from anon, authenticated;
```

El REVOKE de EXECUTE a PUBLIC a nivel del rol (sin IN SCHEMA) elimina el permiso global predeterminado. Estos defaults afectan futuros objetos creados por postgres; no todos los propietarios ni objetos existentes retroactivamente.

Prueba local compartida: BEGIN, crea public._permissions_probe(id integer) y public._permissions_probe_fn() SECURITY INVOKER SET search_path = '' que retorna 1; consulta has_table_privilege SELECT/INSERT/TRUNCATE y has_function_privilege EXECUTE; termina con ROLLBACK. No dejar los objetos de prueba.

| Rol | SELECT | INSERT | TRUNCATE | EXECUTE |
| --- | --- | --- | --- | --- |
| anon | false | false | false | false |
| authenticated | false | false | false | false |
| service_role | true | true | true | true |

Ese resultado prueba esos objetos nuevos y ese creador; no sustituye la prueba de tablas existentes. El usuario también aportó la salida de diez filas de tablas reales arriba. No hay nueva prueba de service_role sobre las seis tablas ni acceso operativo a private.sheet_sync_jobs en esta transferencia.

## 4. Seed local acordado y reportado como funcionando

Propuesta del chat: insertar boda `boda-demo-local`, pareja ficticia **Alex y Sam**, evento **2027-12-20 18:00:00-06**, cierre **2027-12-01 23:59:59-06**. No son fechas de Cecilia y Edgard.

| Invitación ficticia | Token SOLO local | Pases | Estado inicial |
| --- | --- | ---: | --- |
| Familia García | local-test-garcia | 4 | pending |
| Ana López | local-test-ana | 1 | pending |
| Familia Pérez | local-test-perez | 2 | pending |

Hash propuesto: `encode(sha256(convert_to(v.test_token, 'UTF8')), 'hex')`.
Tres invitaciones, siete pases asignados, sin filas en rsvps inicialmente.
Config GitHub verificada: [db.seed], enabled = true, sql_paths = ["./seed.sql"].
El usuario respondió «Todo ha funcionado correctamente» después del paso de reset y consulta; no pegó la salida de las tres filas. Documentar éxito reportado, sin inventar salida ejecutada o UUIDs.
El seed propuesto usa INSERT simples, no ON CONFLICT: no asumir que repetirlo sobre una base poblada sea idempotente.

Reconstrucción de referencia del seed propuesto (NO ejecutarlo automáticamente):

```sql
insert into public.weddings (slug, couple_names, event_date, rsvp_deadline)
values ('boda-demo-local', 'Alex y Sam',
        '2027-12-20 18:00:00-06', '2027-12-01 23:59:59-06');

insert into public.invitations
  (wedding_id, household_name, access_token_hash, max_guests)
select w.id, v.household_name,
       encode(sha256(convert_to(v.test_token, 'UTF8')), 'hex'), v.max_guests
from public.weddings w
cross join (values
  ('Familia García', 'local-test-garcia', 4),
  ('Ana López', 'local-test-ana', 1),
  ('Familia Pérez', 'local-test-perez', 2)
) as v(household_name, test_token, max_guests)
where w.slug = 'boda-demo-local';
```

## 5. Estructuras: GitHub y copia local son diferentes

### Archivos versionados verificados en GitHub dev

```text
.gitignore
AGENTS.md
CLAUDE.md
CODEX_HANDOFF.md
README.md
docs/CONTEXTO_PROYECTO.md
eslint.config.mjs
next.config.ts
package-lock.json
package.json
postcss.config.mjs
public/file.svg
public/globe.svg
public/next.svg
public/vercel.svg
public/window.svg
src/app/contacto/page.tsx
src/app/detalles/page.tsx
src/app/favicon.ico
src/app/galeria/page.tsx
src/app/globals.css
src/app/historia/page.tsx
src/app/hospedaje/page.tsx
src/app/layout.tsx
src/app/page.tsx
src/app/regalos/page.tsx
src/app/rsvp/gracias/page.tsx
src/app/rsvp/page.tsx
src/components/ContactForm.tsx
src/components/Footer.tsx
src/components/Header.tsx
src/components/Hero.tsx
src/components/MapEmbed.tsx
src/components/RsvpForm.tsx
src/components/Section.tsx
supabase/.gitignore
supabase/config.toml
supabase/migrations/20261002023537_initial_schema.sql
supabase/snippets/Untitled query 499.sql
tailwind.config.js
tsconfig.json
```

Git no registra directorios vacíos. No hay API RSVP, /rsvp/[token] ni src/lib/supabase/admin.ts en este árbol.

### Estructura local compartida por el usuario (fuente reportada, no inspección del disco)

me gusta como validaremos, igual antes de seguir te paso como esta la estructura del proyecto para que la guardes en tu memoria:

**# Estructura del proyecto**

\`\`\`text
.
├── AGENTS.md
├── CLAUDE.md
├── CODEX_HANDOFF.md
├── ESTRUCTURA.md
├── README.md
├── docs
│   └── CONTEXTO_PROYECTO.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window\.svg
├── src
│   ├── app
│   │   ├── contacto
│   │   │   └── page.tsx
│   │   ├── detalles
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── galeria
│   │   │   └── page.tsx
│   │   ├── galeria-instagram
│   │   ├── globals.css
│   │   ├── historia
│   │   │   └── page.tsx
│   │   ├── hospedaje
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── regalos
│   │   │   └── page.tsx
│   │   └── rsvp
│   │       ├── gracias
│   │       │   └── page.tsx
│   │       └── page.tsx
│   ├── components
│   │   ├── ContactForm.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── MapEmbed.tsx
│   │   ├── RsvpForm.tsx
│   │   ├── Section.tsx
│   │   └── ui
│   ├── hooks
│   ├── lib
│   └── utils
├── supabase
│   ├── config.toml
│   ├── migrations
│   │   ├── 20261002023537_initial_schema.sql
│   │   └── 20261011092114_harden_default_privileges.sql
│   ├── seed.sql
│   └── snippets
│       ├── Untitled query 414.sql
│       ├── Untitled query 499.sql
│       └── verify_default_privileges.sql
├── tailwind.config.js
└── tsconfig.json

22 directories, 45 files
\`\`\`

No afirmar que ESTRUCTURA.md fue actualizado o leído: solo se conoce su nombre en esta lista.
next-env.d.ts puede ser generado y no versionado. La carpeta galeria-instagram vacía no demuestra una ruta funcional.

Stack package.json verificado: Next ^16.3.8, React/React DOM 19.2.8, TypeScript ^5; Tailwind ^3.4.19 con @tailwindcss/postcss ^4. No resolver esa combinación en este trabajo documental. Scripts dev/build/start/lint. @supabase/supabase-js no declarado. Versiones instaladas exactas deben revisarse en lockfile/entorno antes de implementar.
RsvpForm.tsx verificado contiene fetch a formsubmit.co. El README sigue siendo mayormente plantilla y enlaza al contexto; su ejemplo app/page.tsx no reemplaza la estructura real src/app.

## 6. Próximo trabajo: Etapa 4, lectura segura por token (PENDIENTE)

Primero reconciliar archivos locales recientes sin sobrescribir cambios. Explicar discrepancia, revisar git status/diff y contenido local de segunda migración/seed/snippet/ESTRUCTURA.md. Versionarlos corresponde a un trabajo posterior autorizado; no se hizo en esta transferencia.

Después, si se pide continuar implementación:
1. Consultar guías Next instaladas por AGENTS.md; comprobar SDK con npm ls @supabase/supabase-js. Instalar solo si falta, conservar lockfile.
2. Obtener configuración local con supabase status sin compartir claves en chat.
3. Variables privadas propuestas en .env.local: SUPABASE_URL=http://127.0.0.1:54321 y SUPABASE_SECRET_KEY=<clave local privada>. Compatibilidad legacy service_role solo si es la clave disponible. Nombres propuestos, todavía no configuración comprobada.
4. Cliente servidor `src/lib/supabase/admin.ts`, exclusivo de servidor, sin exportación a cliente.
5. Lectura `src/app/api/rsvp/[token]/route.ts`; página futura `src/app/rsvp/[token]/page.tsx`. Mantener rutas actuales.
6. Recibir token opaco, SHA-256 UTF-8 hex consistente con seed; buscar hash único; validar invitación y boda activas; evaluar plazo con reloj de servidor.
7. Respuesta con datos mínimos para el formulario (invitación, cupo, datos públicos necesarios de boda y estado de cierre; respuesta previa solo de esa invitación si se decide incorporarla). No devolver hash, notes administrativas, contactos ajenos, listas de familias o jobs.
8. Definir contrato concreto de errores/JSON, tratamiento del enlace vencido (mostrar cierre frente a rechazar lectura), caché y logs antes de cerrar implementación. No hay códigos HTTP o contrato final acordados.
9. Evitar caché compartida de datos privados; no registrar token/URL secreta; controles de abuso antes de publicación. No tratar RLS como autorización suficiente cuando se usa credencial privilegiada.
10. Solo lectura en esta primera etapa. POST transaccional después; integración visual después de probar cada capa.

### Pruebas de aceptación de lectura

- Fixtures García/4, Ana/1, Pérez/2: cada token devuelve solo su invitación.
- Token inexistente/malformado: error controlado, sin datos ni detalles de BD.
- Invitación inactiva o token rotado: no acceso.
- Boda inactiva: no acceso.
- Deadline vencido y frontera exacta: comportamiento definido y consistente; reloj del navegador no autoriza.
- No secretos/hash/notas en JSON, bundle cliente o logs; no filtración por caché entre familias.
- No escritura accidental, no afectación de FormSubmit.
- Errores de conexión manejados; validar build/lint y flujo real local cuando haya código. Esta transferencia documental no los ejecutó.

## 7. Etapas posteriores y criterios pendientes

**Escritura transaccional:** acordar mecanismo Next backend + operación PostgreSQL/RPC o conexión capaz de transacción; no simular atomicidad con varias llamadas independientes supabase-js. Validar token/actividad/plazo/status/nombres/cupo; accepted entre 1 y max_guests, declined cero; preservar submitted_at; incrementar version en edición; reemplazar guests y encolar job de misma versión en UNA transacción. Rollback completo. Definir locks/control de concurrencia e idempotencia; UNIQUE(invitation_id) solo no resuelve carreras de edición.

**Pruebas de escritura:** primera respuesta, edición, rechazo, cambios accepted↔declined, cupo parcial/excedido, vacío y >120 caracteres, plazo, token inválido, concurrencia/doble envío, rollback y jobs únicos/versiones consistentes. No se hicieron todavía.

**Sheets:** fuera de respuesta HTTP, fuente Supabase, proyección unidireccional, identificador estable invitation UUID; reintentos/backoff/locks, jobs obsoletos no pisan versión nueva, exportar CSV/Excel. Tabla jobs no implica worker construido.

**Dashboard:** Supabase Auth + wedding_admins por boda; métricas, nombres, búsqueda, pases, pendientes/accepted/declined y exportación. Roles owner/admin/viewer deben recibir autorización diseñada, no policy genérica authenticated USING(true).

**UI y contenido:** mantener objetivos originales de vidrio translúcido, pocas animaciones, navegación accesible, idioma ES/EN global persistente, contenido desde código inicialmente y plantilla futura. 100 pases es referencia de pruebas, no límite fijo. El CHECK actual max_guests 1..20 es por invitación.
Fechas históricas: sitio decía 10 abril 2027/recepción 19:00 Mazatlán; cierre 20 febrero 2027 provisional. No adoptar ejemplo 6 marzo. Hora/zona del cierre y zona IANA de evento aún requieren confirmación; America/Mexico_City de sesión/default no confirma zona de Mazatlán.

## 8. Incidente Storage: conservar historia sin tratarlo como bloqueo vigente

Handoff anterior terminaba con `supabase_storage_web-bodas-with-rsvpform container is not ready: unhealthy` durante db reset. No se atribuyó a SQL y se propuso stop/start, status, docker ps/logs/inspect. No se documentó la causa raíz ni el comando que lo resolvió.
Luego el usuario aportó migraciones locales aplicadas, RLS/permisos esperados, Advisors sin hallazgos y éxito del seed. Por continuidad, el bloqueo no es el siguiente objetivo.
Si reaparece, leer salud/logs primero; no cambiar schema por un fallo de servicio, borrar volúmenes o usar stop --no-backup por defecto.

## 9. Comprobaciones al retomar (no ejecutadas en esta transferencia)

- Confirmar dev y git status/diff de la copia local; comparar con origen sin sobrescribir archivos.
- Leer seis documentos solicitados; si ESTRUCTURA.md no está disponible, decirlo.
- Comparar ambas migraciones y seed; comprobar no datos reales ni secretos antes de versionar.
- Comprobar versión CLI y --help antes de comandos; la CLI 2.119.0 es dato histórico del handoff, no versión actual comprobada.
- Comprobar stack local/status y migration list --local (lecturas). No reset automático.
- Validar tablas y seed con consultas de solo lectura; consultar pg_policies si se desea comprobar ausencia actual de policies.
- Revisar RLS y permisos de las seis tablas, en particular private/jobs y acceso del servidor. Repetir Advisors locales cuando cambie esquema, sin inferir resultado de producción.
- La prueba _permissions_probe requiere crear objetos aunque termine en rollback: el usuario debe ejecutarla conforme a la restricción de cambios en Supabase.
- Trigger updated_at necesita prueba funcional controlada por el usuario; definición presente no prueba ejecución.
- No interpretar revisión documental como auditoría end-to-end. No hubo DB push ni prueba remota.

## 10. Prompt de arranque para un nuevo chat

Copiar este bloque y adjuntar este archivo si el nuevo chat no puede abrir el repositorio:

```text
Continuemos el proyecto Garcheco/web-bodas-with-rsvpform en la rama dev.
Lee CODEX_HANDOFF.md completo, incluyendo evidencias y anexos; luego AGENTS.md,
CLAUDE.md, docs/CONTEXTO_PROYECTO.md, ESTRUCTURA.md si está disponible, README.md
y las migraciones/seed reales. No asumas acceso al historial de otros chats.

Primero revisa el estado real sin modificar archivos ni bases de datos:
confirma rama y git status/diff si tienes la copia local; distingue esa copia de GitHub.
El usuario reportó pruebas locales de migraciones/RLS/permisos/Advisors y seed exitosas,
pero al preparar el handoff en GitHub faltaban la migración 20261011092114,
seed.sql, verify_default_privileges.sql y ESTRUCTURA.md.
Explica cualquier diferencia y no sobrescribas trabajo local ni inventes contenido faltante.

El fallo Storage unhealthy es histórico; solo vuelve a diagnosticarlo si reaparece.
El próximo objetivo técnico acordado es Etapa 4: lectura segura de invitación
por token SHA-256 con cliente exclusivo del servidor y endpoint Next.js.
No se ha implementado aún. Mantén /rsvp, /rsvp/gracias y FormSubmit.

Después del diagnóstico, explícame paso a paso el primer cambio necesario.
Yo aplicaré personalmente los cambios en Supabase. No hagas db push,
db reset --linked, cambios remotos, borrado de volúmenes ni publiques automáticamente.
No expongas claves privilegiadas ni uses tokens ficticios en producción.
La primera implementación será de solo lectura; escritura transaccional,
integración visual, Sheets y dashboard son etapas posteriores.
Si no tienes acceso al repo o a la copia local, pide los archivos concretos que falten
y marca explícitamente lo que no puedes verificar.
```

Para ChatGPT: nuevo chat + archivo adjunto o enlace de GitHub con acceso; pegar prompt.
Para Codex: abrir el repositorio correcto en dev + prompt. No hace falta copiar toda la conversación.
Actualizar este handoff al cerrar futuras sesiones con archivos cambiados, evidencia, límites y siguiente paso.

---

## Anexo A. Decisiones técnicas detalladas preservadas del handoff anterior

**Lectura con estado actualizado:** el siguiente anexo conserva decisiones y DDL explicativo del handoff anterior, no una segunda fuente de ejecución. Los apartados que decían «se propuso», «conceptualmente», «confirmar» o «se estaba agregando» describen el momento histórico. El estado verificado hoy es el de secciones 0–9.
En particular: initial_schema sí contiene enums, tablas, helper/triggers, RLS y revokes; defaults endurecidos nuevos están reportados en segunda migración local; Cloud ACTIVE_HEALTHY y CLI 2.119.0 son datos históricos. Las referencias a reescribir initial_schema no autorizan hacerlo hoy. El detalle del dashboard/FormSubmit sigue siendo plan.

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



## Anexo B. Contexto de producto y planificación preservado (1 octubre 2026)

Documento histórico copiado para conservar decisiones, tareas y límites. Su frase «no se implementaron las sesiones» no niega avances locales reportados el 11 de octubre. Fechas de sesiones y estado TickTick no se revalidaron ni modificaron en esta transferencia. No crear ni reprogramar tareas por leerlo.

# Proyecto-Web Edgard — contexto para retomar en VS Code

Actualizado: 1 de octubre de 2026. Este documento resume decisiones del usuario y propuestas pendientes; no acredita que las funciones estén implementadas.

## Cómo retomar

Abrir este repositorio en VS Code y pedir: «Lee docs/CONTEXTO_PROYECTO.md, revisa el estado actual de la rama y del código, y retomemos la sesión correspondiente. Explícame los cambios paso a paso. Yo aplicaré los cambios en Supabase».

El historial de otros chats no se debe dar por disponible automáticamente. Mantener este documento actualizado al terminar cada sesión con cambios, comprobaciones, pendientes y siguiente paso. No guardar contraseñas, claves, tokens de invitación ni datos reales de invitados aquí. Versionar este archivo en Git permite conservarlo junto al código.

## Objetivo y decisiones del usuario

- Sitio de boda de Cecilia y Edgard; primero esta boda, después plantilla reutilizable.
- Prioridad: interacciones sencillas, navegación siempre accesible y estilo de vidrio translúcido inspirado en liquid glass; pocas animaciones.
- Contenido editado desde código inicialmente. Panel de los novios para textos, fotos e invitados en una fase posterior.
- Español por defecto y botón global ES/EN que recuerde la elección.
- Invitaciones privadas por familia/persona con pases asignados; los invitados escriben sus nombres y los de acompañantes.
- 100 invitados/pases como referencia de pruebas, sin lista real todavía y sin convertirlo en límite fijo del sistema.
- Respuesta editable hasta un cierre configurable. Referencia provisional: 20 de febrero de 2027; hora y zona de cierre pendientes de confirmar.
- El sitio actual indica boda el 10 de abril de 2027, recepción a las 19:00 en Mazatlán. Un ejemplo del otro chat usa 6 de marzo: no adoptar esa fecha sin confirmación. La zona de las sesiones (America/Mexico_City) no implica que deba ser la del evento; confirmar la zona de Mazatlán al implementar fechas.
- Supabase será la fuente principal. Google Sheets en Drive será una copia para seguimiento, con exportación CSV/Excel; inicialmente sin edición bidireccional.
- El usuario quiere aprender: explicar tablas, relaciones, SQL, permisos y pruebas antes de aplicar cambios.
- Instrucción vigente: el usuario hará personalmente los cambios en Supabase. El asistente puede preparar diseño, SQL y código local, pero no ejecutar cambios remotos de esquema, funciones, permisos o datos.

## Estado conocido y límites de verificación

- Repositorio: web-bodas-with-rsvpform. Rama observada: dev. Next.js, React, TypeScript y Tailwind.
- Sitio: https://web-bodas-with-rsvpform.vercel.app
- Se comprobó HTTP 200 de la portada; eso no valida visualmente el sitio ni la entrega del formulario.
- La revisión inicial encontró nombre vacío permitido en RSVP, exigencia de invitados aun al rechazar, idioma separado por componente, enlace inexistente a /galeria-instagram y contenido provisional/inconsistente.
- El lint inicial dio 0 errores y 2 advertencias; volver a verificar contra el código actual cuando haya cambios.
- Durante este hilo se hizo revisión y planificación; no se implementaron las sesiones. No marcar tareas como hechas por estar planificadas.
- Según el chat compartido, Supabase ya tiene el proyecto Boda Edgard, referencia xbfrwgclwrlzjcxepzbf, región us-west-1. Su estado actual y tablas NO se han verificado desde este hilo. El chat decía que aún no había tablas.
- Fuente de diseño: https://chatgpt.com/share/6abe8ad4-5f6c-83e8-9398-cb7a8fa8a6da

## Arquitectura propuesta para revisar, aún no aplicada

Flujo: enlace privado → formulario → validación del servidor → guardado transaccional en Supabase → trabajo de sincronización → Google Sheets.

| Tabla | Responsabilidad |
| --- | --- |
| weddings | Configuración de boda, fecha, zona y cierre de RSVP |
| wedding_admins | Usuarios autorizados y rol por boda, para el futuro panel |
| invitations | Familia/persona, contacto, hash de token, cupo y estado activo |
| rsvps | Una respuesta actual por invitación, accepted o declined; ausencia de respuesta significa pendiente |
| guests | Personas que asistirán, vinculadas al RSVP |
| sheet_sync_jobs | Trabajos pendientes, en proceso, sincronizados o fallidos; intentos y errores |

Relaciones propuestas: boda 1:N invitaciones; invitación 1:0..1 RSVP; RSVP 1:N asistentes y trabajos de sincronización. Wedding_admins relaciona usuarios con bodas.

- Tokens aleatorios de alta entropía; almacenar su hash, sin exponerlos en registros o exportaciones. Definir revocación y regeneración al diseñar.
- UNIQUE en invitation_id del RSVP para evitar múltiples respuestas actuales. Definir FK, CHECK, índices y comportamiento de borrado explícitamente; preferir desactivación de invitaciones cuando convenga.
- Guardar RSVP, asistentes y trabajo de sincronización en una transacción. Validar token, estado, plazo, nombres y cupos; rechazo implica cero asistentes. Revisar concurrencia y rollback, no solo doble clic.
- Activar RLS en tablas expuestas y definir privilegios mínimos. Autenticación sola no autoriza acceso a todas las bodas.
- Pendiente resolver y documentar ruta exacta: backend Next.js y RPC frente a RPC pública. Propuesta de trabajo para S04: backend Next.js con operación transaccional y permisos mínimos. No asumir que una función puede saltarse RLS ni usar privilegios elevados sin diseño explícito.
- La fecha del navegador sirve para interfaz; el servidor debe imponer el cierre.
- La sincronización con Sheets es independiente del éxito del RSVP. Definir reintentos, idempotencia y protección frente a actualizaciones fuera de orden. Hoja de resumen por invitación; personas normalizadas en Supabase.
- Mantener FormSubmit durante la transición hasta verificar el nuevo flujo; decidir el corte para evitar envíos duplicados.

## Plan y seguimiento en TickTick

Lista: 🎉Boda-Edgard. ID: 6a8fd4c58f0804d7210597da. Las tareas están creadas en la columna New; no se han marcado completas.

Sesiones de unas 2 horas, zona America/Mexico_City:

| Sesión | Fecha acordada | Alcance |
| --- | --- | --- |
| S01 | 30 septiembre 2026, sin hora fija | Configuración central y correcciones actuales |
| S02 | 1 octubre, 20:00–22:00 | Navegación persistente y móvil |
| S03 | 2 octubre, 20:00–22:00 | Idioma global y contenido |
| S04 | 3 octubre, 20:00–22:00 | Diseñar y entender modelo de datos y permisos |
| S05 | 4 octubre, 20:00–22:00 | Integrar RSVP con el contrato y validar flujo |

Limitación observada: el complemento guardó inicio y fin de S02–S05 a las 22:00 pese a enviar 20:00–22:00. El horario correcto figura en las descripciones; revisar manualmente la representación en calendario si se necesitan bloques de duración. No desplazar fechas sin acuerdo.

### S04 — Diseño y aprendizaje (120 minutos)

1. 15 min: revisar contexto, proyecto existente y fechas/zona con el usuario.
2. 30 min: dibujar y explicar seis tablas, relaciones, PK, FK, UNIQUE y CHECK.
3. 25 min: revisar hash de token, permisos por boda, RLS y ruta backend/RPC.
4. 30 min: preparar SQL comentado y contrato de lectura/guardado; explicar transacción, cupos, cierre, rechazo y doble envío. No ejecutar SQL.
5. 20 min: revisar juntos y guardar decisiones, SQL propuesto y dudas.

Cierre: diagrama y borrador SQL revisables, contrato documentado y preguntas explícitas. La aplicación en Supabase corresponde al usuario.

### S05 — Integración y pruebas (120 minutos)

1. 15 min: revisar configuración aplicada por el usuario y contrato S04. Si falta, usar adaptador simulado y registrar dependencia.
2. 25 min: cargar invitación privada, pases y respuesta previa; manejar enlaces inválidos e invitaciones inactivas.
3. 35 min: conectar guardado/edición transaccional, validar cupo/plazo/nombres, rechazo con cero asistentes y trabajo de sincronización.
4. 30 min: probar parcial, exceso de cupo, concurrencia, edición, rechazo, token inválido, vencimiento, rollback y ausencia de duplicados.
5. 15 min: guardar evidencia y pendientes. Explicar qué está simulado y qué se verificó contra Supabase.

Cierre ideal: confirmación y modificación persistidas correctamente. Sin BD lista, entregar integración simulada sin afirmar persistencia verificada ni dar por terminadas pruebas reales. Conservar tiempo de pruebas si hay que trasladar trabajo a otra sesión.

### Trabajo posterior sin fecha

- S06: Google Sheets, sincronización y exportación.
- S07: recuperación, reintentos y comprobaciones ante fallas.
- S08: panel privado para los novios y gestión de invitados.
- S09: edición de contenido y plantilla reutilizable.

## Registro para futuras sesiones

- Hecho en este turno: actualización de S04/S05 en TickTick y documentación de continuidad.
- Pendiente: comenzar implementación de sesiones; diseño SQL completo; decisiones de seguridad y fechas; aplicación en Supabase por el usuario.
- Al retomar: leer este documento y revisar git status/diff y código real. Confirmar qué implementó el usuario desde la última sesión; no asumir que el estado descrito sigue vigente.
