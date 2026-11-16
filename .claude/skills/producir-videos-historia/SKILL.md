---
name: producir-videos-historia
description: Produce un video animado de historia general (desde el año 1000 hasta la actualidad) de punta a punta y sin límite de duración - investigación con fuentes abiertas y verificadas, guion, animación 2D en Remotion con mapas y líneas de tiempo, narración con ElevenLabs, subtítulos sincronizados y MP4. Usar cuando el usuario pida un video, Short o explicación animada sobre un hecho, personaje, época, mito o curiosidad de la historia (Cruzadas, mongoles, Renacimiento, conquistas, revoluciones, guerras mundiales, Guerra Fría, historia argentina y latinoamericana, etc.). No es para relatos de la Biblia.
---

# Producir un video de historia

Antes de empezar leé `CLAUDE.md` (cómo trabajar, comandos, biblioteca visual), `config/canal.json` (voz, formatos, render) y la guía de cada paso en `guia-produccion/` (fuentes-historicas, guion, visual, voz-y-sincronia, qa-y-entrega, nube).

**Formato**: vertical 1080×1920 por defecto (`formato: "short"`), o horizontal 1920×1080 (`formato: "largo"`) si el prompt lo pide; 30 fps, voz en off, español natural para Argentina y Latinoamérica.
**Duración: sin límite.** El video dura lo que dura el guion. Nunca recortar texto ni acelerar la voz para entrar en un tiempo; avisar la duración final en el resumen.
**Alcance**: historia general desde el año 1000 hasta hoy, con mirada mundial (no solo Europa). Un tema anterior al 1000 entra solo como antecedente, o si el usuario lo pide de forma explícita (avisarlo en el resumen).

## 0. Dónde estás (comprobar en silencio)
- **Instalación**: si `config/canal.json` no dice `"canal": "historia"` o falta `guia-produccion/fuentes-historicas.md`, este repositorio todavía tiene la configuración de otro canal. Instalar: mostrarle al usuario qué se va a reemplazar (`CLAUDE.md`, `config/canal.json`, `guia-produccion/`, `producciones/_plantilla/`; queda copia en `.respaldo-antes-de-historia/`) y confirmar, porque es el único paso que pisa configuración existente → `bash .claude/skills/producir-videos-historia/instalar.sh --si` (copia los archivos de `para-la-raiz-del-repo/` y aplica `ajustes-al-codigo/`; detalles en `LEEME.md` de la skill) → commit + push → avisar que abra una sesión nueva para que cargue el `CLAUDE.md` nuevo.
- **Nube de Claude Code** (`CLAUDE_CODE_REMOTE=true`): camino principal. El hook de inicio (`scripts/preparar-nube.mjs`) instala dependencias y navegador; si dice FALTA/FALLÓ, mirá `logs/preparar-nube.log` y corré `node scripts/preparar-nube.mjs`. La voz sale por la API con el secreto de red; el MP4 lo renderiza GitHub Actions y queda en Releases. Ver `guia-produccion/nube.md`.
- **PC del usuario** (Windows): todo local con `node scripts/<script>.mjs <video>`.
- Correr siempre los scripts con `node scripts/...`. Comandos largos en segundo plano.

## 1. Carpeta del video
`node scripts/nuevo-video.mjs <tema-corto>` (o copiar `producciones/_plantilla/`) → `producciones/AAAA-MM-DD-tema/` con `video.json`, `guion.md`, `fuentes.md`, `youtube.md`, `recursos/`, `qa/` (no va a git).

## 2. Investigar y leer ANTES de escribir
Seguir `guia-produccion/fuentes-historicas.md`. Resumen:
- Abrir y leer (con `curl`; el subagente web-fetch no sirve) fuentes primarias y secundarias de calidad. Wikipedia sirve para orientarse, no como única fuente de un dato discutido.
- Cada fecha, nombre, cifra y cita que aparezca en la voz o en pantalla se registra en `fuentes.md` como `[F#]` con enlace abierto. Fechas y cifras clave: cruzar al menos dos fuentes.
- **Separar** hecho comprobado / testimonio de la época / leyenda / interpretación de los historiadores. Citas famosas: verificar que no sean apócrifas. Cifras antiguas: dar rango y quién lo estima.
- Si un sitio responde 403 del proxy, el host no está permitido en el entorno: no rodearlo; anotarlo en `fuentes.md` y pedirle al usuario que lo sume (`read_documentation` → `environment.network`).
- No inventar fechas, cifras, diálogos ni detalles. Si se dramatiza, que se note ("imaginá…").

## 3. Gancho y guion
Seguir `guia-produccion/guion.md`. Escribir 3 ganchos, elegir uno y justificar. Elegir el formato (relato, mito vs realidad, causas y consecuencias, cronología, biografía, un día en…). Guion con citas `[F#]` en `guion.md`; el texto que se locuta va limpio en `video.json → escenas[].narracion`.
**Si el usuario entregó el guion final: no cambiarlo** y seguir sin pedir OK. **Si lo escribe Claude:** mostrar gancho, guion y fuentes y esperar el OK antes de gastar créditos de voz (si la sesión está desatendida, dejar todo listo hasta acá y avisar).

## 4. Construir la animación
Seguir `guia-produccion/visual.md` y la biblioteca visual de `CLAUDE.md`. Escenas a medida (`tipo: "animada"`, `componente: "<tema>/<escena>"`) en `src/especiales/<tema>/escenas.tsx`; mapas, líneas de tiempo y personajes de época según `visual.md`. Todo original: nada de recrear personajes, estilos ni escenas de otros canales, películas o series. Gancho sin errores; si una escena no sale bien, reemplazarla por otra más simple.

## 5. Narración con ElevenLabs (reutilizar si no cambió el texto)
Seguir `guia-produccion/voz-y-sincronia.md`:
1. `node scripts/estado-narracion.mjs <video>`: si dice **VIGENTE**, no generar nada.
2. Si falta o está desactualizada: `export NODE_USE_ENV_PROXY=1; node scripts/narrar-api.mjs <video>` (MP3 + tiempos por palabra). Los videos largos necesitan la versión con trozos de `ajustes-al-codigo/`. Nunca repetir una generación para "reintentar" sin entender el error.
3. Nombres extranjeros y años: ver la sección de pronunciación de la guía de voz.
4. Voz fija del canal (`config/canal.json → voz`) salvo que el usuario pida otra.

## 6. Sincronizar, revisar y documentar
- `node scripts/sincronizar.mjs <video>` (cobertura ≥ 90 % ideal) → `node scripts/renderizar.mjs <video> --solo-qa`.
- Revisión visual en **una sola pasada** (máximo dos vueltas) y revisión de contenido contra `fuentes.md`, según `guia-produccion/qa-y-entrega.md` (incluye la lista de anacronismos y mapas). En videos largos revisar por muestreo, no cuadro por cuadro.
- Completar `fuentes.md`, `guion.md` y `youtube.md` (título ≤ 100, capítulos con tiempos, fuentes con enlaces). **No publicar nada.**

## 7. Exportar y entregar
- `node scripts/exportar-srt.mjs <video>` → `node scripts/entregar.mjs <video>` (`--rehacer` si solo cambió código) → commit + push a la rama de la sesión (no abrir PR salvo que se pida). GitHub Actions deja el MP4 en el Release `entrega-<video>-<hash>`.
- Verificar el MP4 descargado (duración, audio) y enviarlo con `SendUserFile` junto con la portada; si pesa demasiado para enviarlo, dar el enlace del release.
- Nunca anunciar un MP4 que no se renderizó. Un release en el repositorio privado no es publicar: el usuario descarga y sube a mano. Las releases viejas se borran a mano.
- El contenedor se reinicia: **commit + push seguido**, por capítulo si el video es largo.

## Videos largos (más de ~3 min)
- Planificar por **capítulos** (60–150 s cada uno); un archivo de escenas por capítulo (`escenas-1.tsx`…), exportados en un único `ESCENAS_X`; commit por capítulo.
- Una tarjeta de capítulo o un cambio visual claro cada 60–90 s, y un "re-gancho" (pregunta, giro) para sostener la atención. Varias fuentes visuales: mapa, personaje, documento, dato, paisaje.
- Narración en trozos, QA por muestreo, vista previa solo del gancho y capítulos con cuadros sueltos. Tiempo de render y minutos de Actions: ver `guia-produccion/nube.md`.

## Reglas que no se negocian
- Fuente no leída = el dato no entra. Fecha, cifra, cita o detalle inventado = no entra.
- Paráfrasis propia; citas textuales solo breves y verificadas en su fuente primaria. No copiar la redacción de libros ni artículos.
- Rigor y respeto: sin glorificar ni justificar atrocidades, sin consignas partidarias, sin teorías conspirativas ni pseudohistoria. Temas sensibles con sobriedad, sin gore.
- Animaciones solo por frames (`interpolate`, `spring`), nunca CSS animations.
- No gastar créditos de ElevenLabs si la narración vigente sirve.
- No publicar automáticamente en YouTube, Instagram, Facebook ni Buffer.
- Nunca leer, mostrar ni subir la clave de ElevenLabs (`.env`, `.env.txt`).
