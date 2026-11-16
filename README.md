# Videos de historia

Sistema para producir videos animados de **historia general desde el año 1000 hasta hoy** (Remotion + narración de ElevenLabs): hechos, personajes, épocas, mitos y curiosidades, con mirada mundial y atención a Argentina y Latinoamérica. **Sin límite de duración.** Base técnica heredada de `Videos-cristianos`; son canales separados.

## En la nube (recomendado: sin la PC prendida)
1. Configurá una vez el entorno de Claude Code en la nube: **[guia-produccion/nube.md](guia-produccion/nube.md)** (red con los sitios de fuentes históricas, clave de ElevenLabs como secreto, setup script).
2. Desde la pestaña **Code** de la app de Claude (o claude.ai/code), con este repositorio, pedí: *"Hacé un video sobre &lt;tema&gt; con la skill producir-videos-historia"* y pegá tu guion, estilo, escenas, voz y entregables.
3. Claude lee las fuentes, genera la voz, revisa los cuadros y marca el video para entrega.
4. GitHub Actions renderiza el MP4 y lo deja en **[Releases](../../releases)** con el título y la descripción para YouTube. Lo descargás y lo subís vos: nada se publica solo.

> **Importante:** el MP4 queda en los *Releases* del repositorio. Si el repositorio es **público**, esos videos serían descargables por cualquiera antes de que los subas. Conviene dejarlo **privado** (Settings → General → Danger Zone → Change visibility).

## En la PC (Windows)
1. Doble clic en **`INSTALAR-Y-PROBAR.cmd`**: comprueba Node.js, instala las dependencias y renderiza una prueba de 3 segundos (`producciones/0000-prueba-render/`). Todo queda registrado en `logs/`.
2. Para producir: `node scripts/<script>.mjs <video>` (ver los comandos en [CLAUDE.md](CLAUDE.md)). La voz usa la clave de `.env` (copiá `.env.example`).
3. **`ABRIR-STUDIO.cmd`** abre Remotion Studio para ver y retocar.

## Cada video
Queda en `producciones/AAAA-MM-DD-tema/`: `video.json` (proyecto editable), `guion.md` (gancho y guion con citas `[F#]`), `fuentes.md` (fuentes leídas y datos verificados), `youtube.md` (título, descripción, capítulos y fuentes; no se publica nada solo), `recursos/` (narración y tiempos), `entrega.json` (marca de "listo para renderizar").

## Skill y guías
- Skill: `.claude/skills/producir-videos-historia/` (`SKILL.md`, `LEEME.md`, ajustes de código y script de instalación).
- Guías en `guia-produccion/`: fuentes históricas, guion, visual, voz y sincronía, QA y entrega, nube.
- Configuración del canal (nombre, voz, formatos, fuentes): `config/canal.json`. **Pendiente:** nombre, lema y usuario del canal.
