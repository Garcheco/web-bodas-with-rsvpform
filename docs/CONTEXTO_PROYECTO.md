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
