# Trabajar en la nube (sin la PC prendida)

Repositorio: **github.com/Matifernandezar/videos-historia** (debe ser privado: los MP4 quedan en sus Releases). Es la copia principal del proyecto.

## Cómo funciona
1. Abrís una **sesión de Claude Code en la nube** con este repositorio (pestaña **Code** de la app de Claude en el celular, **claude.ai/code**, o la app de escritorio con un entorno **Cloud**). La sesión sigue aunque cierres la app o apagues la PC.
2. Claude investiga (lee las fuentes), escribe o recibe el guion, y **te pide OK** antes de gastar créditos de voz solo si el guion lo escribió él.
3. Genera la voz con la API de ElevenLabs (la clave es un secreto de red del entorno: la sesión nunca la ve), sincroniza los subtítulos y revisa los cuadros.
4. Marca el video como listo (`node scripts/entregar.mjs <video>`) y hace push. **GitHub Actions** renderiza el MP4 y lo deja en **Releases** con el título y la descripción para YouTube.
5. Lo descargás desde `github.com/Matifernandezar/videos-historia/releases` y lo subís vos. Nada se publica solo.

## Configurar el entorno (una sola vez, ~5 minutos, desde la web)
En **claude.ai/code**, debajo del cuadro de mensaje, abrí el selector de entorno → **New environment** (o el ajuste de uno existente; puede ser el mismo de los otros canales):
1. **Name**: `Videos` (o el que prefieras).
2. **Network access**: **Trusted** + **los hosts de fuentes históricas** que vayas a usar (lista sugerida en `config/canal.json → fuentes.hostsSugeridos`: Wikipedia en inglés, Wikisource, Britannica, Internet Archive, Project Gutenberg, Fordham Sourcebooks, archivos nacionales, UNESCO, Our World in Data…). Si una fuente responde 403 del proxy, ese host falta: sumarlo en el entorno.
3. **Environment variables** (renders largos): `BASH_DEFAULT_TIMEOUT_MS=600000` y `BASH_MAX_TIMEOUT_MS=1800000`.
4. **Setup script** (librerías de Linux para el navegador; queda en caché):
   ```bash
   #!/bin/bash
   apt-get update -qq && apt-get install -y -qq libnss3 libdbus-1-3 libatk1.0-0 libasound2t64 libxrandr2 libxkbcommon-dev libxfixes3 libxcomposite1 libxdamage1 libgbm-dev libcups2 libcairo2 libpango-1.0-0 libatk-bridge2.0-0 || true
   ```
5. **Network secrets** → **Add secret**: tipo Bearer, nombre `ElevenLabs`, sitio permitido `api.elevenlabs.io`, encabezado `xi-api-key` (borrar el prefijo `Bearer`), la clave en **Value**. Para cambiarla, borrar el secreto y volver a agregarlo.

Las dependencias de npm y el navegador de Remotion los instala el hook de inicio (`.claude/settings.json` → `scripts/preparar-nube.mjs`) en cada sesión (1–2 minutos la primera vez). Si el mensaje de inicio dice FALLÓ la descarga del navegador, mirar `logs/preparar-nube.log` y correr `node scripts/preparar-nube.mjs` antes de renderizar.

## Primera sesión: probar que todo anda
> Probá el entorno de la nube: corré `node scripts/verificar-entorno.mjs`, `node scripts/voces.mjs` y `node scripts/prueba-render.mjs`, y decime qué funciona. Probá también abrir con curl una página de Wikipedia en inglés y una de Internet Archive.

## Para cada video
> Hacé un video sobre **<tema>** con la skill producir-videos-historia. <guion, estilo, escenas, voz, sonido, subtítulos y entregables>

Si el guion es tuyo, Claude sigue solo hasta dejar el MP4 en Releases y te pasa el enlace. Podés cerrar la app y volver después: la sesión sigue en la nube.

## Videos largos: tiempos y límites
- **Render en GitHub Actions**: el workflow `.github/workflows/renderizar.yml` trae `timeout-minutes: 60`, pensado para videos cortos. En el canal bíblico, los Shorts (menos de 1:30) tardaron entre 6 y 30 minutos en total según los runs de Actions. **Un video de varios minutos puede tardar bastante más de una hora**: cambiar a `timeout-minutes: 360` (máximo de GitHub) como indica `ajustes-al-codigo/` de la skill, y esperar con `until … sleep 30`.
- **Minutos de Actions**: los repositorios privados tienen una cuota gratuita mensual (2.000 minutos en el plan gratuito; revisar la del plan actual). Un video largo puede consumir decenas de minutos; planificar cuántos se hacen por mes.
- **Releases**: cada archivo puede pesar hasta 2 GB; un video largo vertical a CRF 18 pesa decenas o cientos de MB.
- **Narración**: se genera en trozos (ver `voz-y-sincronia.md`).
- **ElevenLabs**: los créditos dependen de los caracteres; la narración se reutiliza si el texto no cambió.
- **Sesión de Claude Code**: máquina de 4 núcleos y 16 GB; los comandos largos van en segundo plano y los renders de vista previa conviene hacerlos por tramos (`--frames=a-b`).

## Render sin Claude (opcional)
Pestaña **Actions** del repositorio → **Renderizar y entregar** → **Run workflow**: `video` vacío = todos los marcados para entrega sin release; `video` = `prueba` = render de 3 s; `rehacer` = renderizar de nuevo aunque ya esté entregado.

## Si algo falla
| Síntoma | Qué hacer |
|---|---|
| `voces.mjs` o `narrar-api.mjs` responden 401 | Revisar el secreto de ElevenLabs (host `api.elevenlabs.io`, encabezado `xi-api-key`, sin prefijo). |
| Una fuente responde 403 del proxy (`CONNECT tunnel failed`) | Ese host no está permitido en el entorno: anotarlo en `fuentes.md` y sumarlo al entorno. No rodearlo. |
| El mensaje de inicio dice "FALTAN librerías" | Revisar el setup script; mientras tanto, `node scripts/preparar-nube.mjs`. |
| El render de Actions falla | Mirar **Artifacts → `qa-y-registros`**; si cortó por tiempo, subir `timeout-minutes`. Si falla sin jobs: `gh api -X POST repos/$REPO/actions/runs/<id>/rerun`. |
| "entrega.json no coincide" | Cambió el video después de marcarlo: volver a correr `node scripts/entregar.mjs <video>` y hacer push. |

## Y la PC
Sigue funcionando (`INSTALAR-Y-PROBAR.cmd`, `PRODUCIR-VIDEO.cmd`), pero no hace falta para producir. Para sincronizarla con GitHub, clonar el repositorio con GitHub Desktop en otra carpeta y copiar ahí el `.env.txt`.
