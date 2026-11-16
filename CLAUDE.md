# Canal de videos de historia

Sistema para producir videos animados de **historia general desde el año 1000 hasta hoy** (Remotion + ElevenLabs): hechos, personajes, épocas, mitos y curiosidades, con mirada mundial y atención a Argentina y Latinoamérica. **Sin límite de duración.**
Para producir un video usar la skill **`producir-videos-historia`** (`.claude/skills/producir-videos-historia/SKILL.md`); guías detalladas en `guia-produccion/`.
Repositorio: **github.com/Matifernandezar/videos-historia** (en los comandos, `REPO=Matifernandezar/videos-historia`). La base técnica viene de `Videos-cristianos` (que viene de `Videos-nutrici-n`); son canales separados. Camino principal: sesión de Claude Code en la nube + render en GitHub Actions → MP4 en Releases (`guia-produccion/nube.md`).

## Cómo trabajar (leer primero)
Matías (el usuario) pega prompts largos con guion, estilo, escenas, voz, sonido, subtítulos y entregables, y espera que se produzca el video de punta a punta **sin preguntas innecesarias**. Un chat por video. Pedí algo solo ante un bloqueo real.

1. **El guion es del usuario: no cambiar el texto.** Antes de generar la voz, contar palabras: la voz del canal rinde ≈ 0,43–0,44 s por palabra (≈ 2,3 palabras/s). Total = voz + pausas + cola de 0,9 s (`COLA_FINAL_SEG`).
   - **No hay duración mínima ni máxima.** El video dura lo que pide el guion: respetarlo completo y avisar la duración final en el resumen. No recortar texto salvo que el usuario lo pida.
   - Nunca acelerar la voz. Las pausas pedidas se agregan con `pausas` en `video.json`.
   - Si el guion lo escribe Claude, la duración la define el contenido: cada bloque aporta algo nuevo, sin relleno. Si el tema da para más de un video, ofrecer dividirlo en partes, pero producir lo pedido.
2. **Datos verificados con fuentes que se puedan abrir** (ver Red). Registrarlas en `fuentes.md` como `[F#]`; separar hecho comprobado, testimonio de la época, leyenda e interpretación; anotar lo que no se pudo abrir. Detalle en `guia-produccion/fuentes-historicas.md`.
3. **Ahorrar tokens** (el usuario gastó mucho): reutilizar la biblioteca visual (abajo) y copiar patrones en vez de inventar; escribir cada archivo de escenas una sola vez; **una sola pasada de revisión visual** (cuadros a baja resolución + capturas solo de lo corregido, máximo dos vueltas); no re-leer archivos grandes; no repetir generaciones de voz; commits frecuentes y resumen final corto.
   - Video largo: trabajar **por capítulos** (un archivo de escenas por capítulo, commit por capítulo) y revisar por muestreo.
4. **Entregables de cada video** (en `producciones/<fecha-tema>/`): MP4 en Release, `recursos/narracion.mp3`, `recursos/subtitulos.srt`, `portada.jpg`, proyecto editable, `fuentes.md`, `guion.md`, `youtube.md` (con capítulos y fuentes). Verificar el MP4 descargado (duración, audio) y enviarlo con SendUserFile junto con la portada.
5. **Resumen final** breve: enlace del release, duración final, qué cambió respecto del pedido, qué fuentes no se pudieron abrir, qué datos están discutidos entre historiadores, y que las releases viejas hay que borrarlas a mano (no se pueden borrar desde la sesión).

## Flujo de una producción (comandos)
1. Carpeta `producciones/<AAAA-MM-DD-tema>/recursos` + `video.json` (una escena por bloque de guion; `componente: "<tema>/<escena>"`; cierre con `subtitulos: "ocultos"`, `lema`, `desfaseInicioSeg` (puede ser negativo); `destacarSubtitulos`, `reemplazosSubtitulos`, `musica`, `pausas`).
2. Voz: `export NODE_USE_ENV_PROXY=1; node scripts/narrar-api.mjs <video>` → `node scripts/sincronizar.mjs <video>`. Tiempos por palabra en `recursos/palabras.json`. Los videos largos necesitan `narrar-api.mjs` con trozos (`ajustes-al-codigo/` de la skill). Si el usuario ya entregó el guion final y pidió producir, no hace falta pedir OK antes de generar la voz.
3. Sonido: `python3 herramientas/audio/sintetizar.py <recursos> --duracion <s> --calma-desde <s>` → `ffmpeg -i musica.wav -b:a 160k musica.mp3` y borrar el wav. Efectos disponibles: paso, pagina, sierra, madera, cincel, marca, tabla, piedra, whoosh, brillo, tela, coro, canon, mar, remo, cuenta, disparo, monitor, multitud, viento, fuego, apagar, tension, tambor, semillas, grillos, campanilla, banco, apagon, expansion, lluvia, aplauso, trueno, trompeta, agua, llama, gallo. Útiles para historia: tambor, trompeta, multitud, mar, remo, disparo, fuego, viento, tension, pagina, marca. Los que falten (cañón, espadas, caballos, campanas, sirenas, motores…) se agregan en `herramientas/audio/sintetizar.py`, siempre sintetizados (sin audio de terceros).
4. Escenas: `src/especiales/<tema>/escenas.tsx` (exporta `ESCENAS_X`, se registra en `src/especiales/index.tsx`); portada `<tema>/Portada.tsx` + `Composition id="Portada-<video>"` en `src/Root.tsx`.
5. Documentos: `fuentes.md`, `guion.md`, `youtube.md` (sin ellos `renderizar` no corre; `fuentes.md` y `youtube.md` no pueden tener "PENDIENTE"). Los avisos "la primera escena no es un gancho / la última no es un cierre" son normales en escenas a medida.
6. QA: `node scripts/renderizar.mjs <video> --solo-qa` (arma `.build/props.json`). Cuadros: `npx remotion still src/index.ts VideoCanal x.png --frame=N --props=<prod>/.build/props.json --public-dir=<prod>/recursos --scale=0.4`. Vista previa corta (gancho y primeros capítulos): `npx remotion render src/index.ts VideoCanal $S/prev.mp4 --props=… --public-dir=… --frames=0-1799 --scale=0.5 --crf=24 --log=error < /dev/null`. Hoja de cuadros: `ffmpeg -i prev.mp4 -vf "fps=1.5,scale=180:-1,tile=12x3" hoja%02d.png` (en videos largos, `fps=0.25` sobre cada tramo). **Siempre `< /dev/null`.** Portada: `npx remotion still src/index.ts Portada-<video> <prod>/portada.jpg --image-format=jpeg --jpeg-quality=92 --public-dir=<prod>/recursos`.
7. Entrega: `node scripts/exportar-srt.mjs <video>` → `node scripts/entregar.mjs <video>` (`--rehacer` si solo cambió código) → commit + push a la rama de la sesión (no abrir PR salvo que se pida) → GitHub Actions deja el MP4 en el Release `entrega-<video>-<hash>`. Esperar en segundo plano con `until gh api repos/$REPO/releases/tags/$T --jq '.assets[].name' | grep -q mp4; do sleep 30; done` y bajar con `gh api …/releases/assets/$ID -H "Accept: application/octet-stream"`. Si el run falla sin jobs: `gh api -X POST repos/$REPO/actions/runs/<id>/rerun`.
8. El contenedor se reinicia: **commit + push seguido**.

## Biblioteca visual (reutilizar, no reescribir)
Viene del canal bíblico; en `guia-produccion/visual.md` está qué sirve para historia y qué hay que crear.
- **Cámara y marco** (`src/especiales/jesus-12-30/escenarios.tsx`): `Camara tomas=[{f,x,y,z}]` (frames estrictamente crecientes), `Capa` (paralaje), `Textura`, `Referencia`, `LibroAntiguo/TapaLibro/Renglones` (cierre), `PAL`, `lerp`. Encuadres cerrados (z 1.2–1.4) para que se vean los personajes.
- **Ambiente** (`src/especiales/ambiente.tsx`): `CieloV2`, `Astro`, `Montes` (prop `idx` si se repite), `Arbol`, `Pasto`, `Suelo`, `CasaAdobe`, `RayosDeLuz`, `Polvo`, `Gradacion`, `azar`.
- **Piezas por tema**: `manila/piezas.tsx` (`GenteEspalda`, `Dato` = pastilla de dato en pantalla, `Contador`, `Reloj`, `MapaFilipinas` como patrón de mapa, `Lluvia`, `MarDeLuces`, `mezcla` tolerante, `hexDe`); `regreso/escenas.tsx` (`Nube`, reloj de arena, agua); `pedro/escenas.tsx` (`Muro`, `Brasero`, `Chispas`, `Obelisco`, `FondoViaApia`, `Basilica`, `Cierre`); `cizana/escenas.tsx` (campo, casa, calle).
- **Personajes** (`jesus-12-30/personas.tsx`, componente `Persona`; `Fig` los ubica por los pies; `manoDe` da la posición de la mano): los hay bíblicos y de hoy; **no hay personajes de época**: crearlos sobre la base de `Persona` (ver `visual.md`). Props: `giro`, `mirada`, `cejas`, `boca`, `brazoIzq/brazoDer {hombro,codo,mano}`, `caminando+paso`, `sentado`, `espejo`, `ojos`, `bocaAuto`. Poses en `amen/poses.ts` y `misa/poses.ts`; `mezclarBrazo`, `gestoEnsenar`, `osc`.
- **Tiempos con la voz** (`comun.tsx`): `useMomento("palabra", fracción)` = frame local en que se dice esa palabra (elegir palabras que aparezcan una sola vez en la escena); `Sfx`, `Rotulo`, `tramo`, `useResorte`. Cierre del canal: copiar `Cierre` de `pedro/escenas.tsx` (luz → libro → título → lema).
- **Piezas de historia por crear una sola vez** (mapa con ruta animada, línea de tiempo, año grande, tarjeta de capítulo, documento/carta, estandarte, barco, ejército): especificadas en `visual.md`; guardarlas en `src/especiales/historia/` y reutilizarlas en todos los videos.

## Criterio visual del usuario
- **El gancho (primeros segundos) es clave** y no puede tener errores de animación. Si una escena no sale bien, **reemplazarla por una más simple** en vez de dejarla rara.
- Animar con acciones, gestos, objetos, mapas y transiciones conectadas; evitar imágenes quietas con zoom repetido.
- Etiquetas y datos en pantalla discretos (`Dato`, y≈330–420; los subtítulos ocupan y≈1430 y los controles de las plataformas, el borde inferior y superior). Cuidar la legibilidad en el celular.
- Sin anacronismos (armas, ropa, banderas, edificios, mapas de la época). Violencia y atrocidades con sobriedad: sin sangre ni cuerpos; mostrar lugares, objetos, mapas y cifras. Sin símbolos de odio salvo necesidad documental, y siempre en contexto.
- Frases que fijó el usuario: pausas pedidas, palabras destacadas y textos en pantalla tal como los escribe en el prompt.

## Trampas técnicas conocidas
- **SVG**: los `id` de degradados, patrones y `clipPath` deben ser únicos en toda la escena (si dos `Montes` comparten y y semilla, usar `idx`; usar `React.useId`). Un `<g>` fuera de `<svg>` no dibuja nada.
- **Colores**: `mezcla` de `ambiente.tsx` solo acepta `#rrggbb`; si recibe un `rgb(...)` da negro. Usar la de `manila/piezas.tsx` o convertir con `hexDe`.
- `Persona`: la cabeza está en y=150 del viewBox; `giro` solo desplaza rasgos; para dar vuelta usar `espejo` o `scaleX`.
- Los cuadros QA de `renderizar.mjs` y las vistas previas pesan; usar `--scale=0.5` o menos.
- **Red del entorno**: los sitios abiertos dependen del entorno; no asumirlos. Probar cada fuente con `curl` (el subagente web-fetch no sirve). Si el proxy responde 403 a un host, no está permitido: no rodearlo, anotarlo en `fuentes.md` y pedirle al usuario que lo sume al entorno (lista sugerida en `config/canal.json → fuentes.hostsSugeridos`; las páginas de Wikipedia se leen mejor con `index.php?title=…&action=raw`).
- Nunca leer ni mostrar la clave de ElevenLabs. No publicar nada automáticamente.

## Videos hechos
- `2026-11-16-reparticion-de-africa` (reparto de África, ≈ 2 min 51 s): completo con voz (2 min 50 s). Vista previa sin voz o cuadros locales: `node scripts/props-sin-voz.mjs <video>` + `npx remotion render … --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell` (en la nube la descarga del navegador de Remotion da 403).
- Piezas de historia ya creadas en `src/especiales/historia/piezas.tsx`: `MapaAfrica` (enclaves de 1880, colonias de 1914, Etiopía y Liberia en dorado), `Placa` (dos renglones), `Rotulito`, `Humo`, `Chispas`, `Caballero` (silueta de época), `Compas`, `Regla`, `ManoGala`, `CierreCanal` (hilo dorado + nombre y lema), paleta `H`. Cortes por coincidencia entre escenas: `Fundido` en `reparto-africa/escenas-1.tsx`.

Cada carpeta tendrá su `entrega.json` (etiqueta del release).
**Pendientes**: usuario/handle, insignia propia (`src/componentes/Insignia.tsx`), paleta definitiva (`src/marca/tema.ts`), personajes de época y piezas de mapa/línea de tiempo (`visual.md`), elegir si la voz heredada se queda.

## Configuración del canal (fuente de verdad: `config/canal.json`)
- **Nombre**: **El pasado del pasado**; lema: **el hilo de la historia** (cierre: `CierreCanal`). Usuario/handle: sin definir (no inventar usuarios ni enlaces).
- **Tema**: historia general desde el año 1000 hasta hoy, mirada mundial, con foco en Argentina y Latinoamérica. Un tema anterior al 1000 solo como antecedente, salvo pedido explícito.
- **Público**: hispanohablante general interesado en historia; sin postura partidaria ni religiosa.
- **Idioma**: español natural para Argentina y Latinoamérica, voseo suave, sin modismos muy locales.
- **Formato por defecto**: vertical 1080×1920, 30 fps, voz en off con subtítulos palabra por palabra (`formato: "short"` en `video.json`). Horizontal 1920×1080 con `formato: "largo"` si el prompt lo pide. **Ninguno de los dos tiene tope de duración.**
- **Voz**: **"Anciano sabio rioplatense (Versículo Oculto)"** (`OIIQfA3O2aiStNo6KD4m` en la cuenta de la clave de este entorno), heredada del canal bíblico: barítono cálido, narrador pausado. Fija salvo que el usuario pida otra. Otras opciones en `voz.candidatas`.
- **Modelo de voz**: `eleven_v4` (si la API lo rechaza con tiempos, usa `eleven_multilingual_v2`).
- **Render**: H.264, CRF 18, preset veryfast, JPEG 95.
- **Cierre**: la voz invita a **comentar y seguir** el canal (si el nombre está definido, decirlo; si no, "seguinos" a secas), sin inventar usuarios ni enlaces. El cierre visual dura 4–6 s; si la frase es más larga, usar `desfaseInicioSeg` en la escena de cierre.
- **Aviso**: ninguno en pantalla (`aviso` vacío); en la descripción de YouTube va `avisoDescripcion` (ilustraciones y recreaciones, no fotografías de la época).

## Identidad visual (provisional)
Base heredada: azul profundo, pergamino y dorado cálido (`src/marca/tema.ts`). Para historia conviene sumar acentos por tono (ocre y sepia para época, carmesí para conflicto, azul acero para mar y comercio); definirlos una vez y no cambiarlos entre videos. Fondos oscuros, títulos grandes en mayúsculas (Inter Display Black) con una palabra destacada y subrayado a mano, flechas y rutas que se dibujan, acercamientos de cámara, subtítulos con la palabra activa resaltada. Cierre del canal: libro que se abre con luz cálida + nombre y lema.
`video.json` admite `musica: { archivo, volumen }`, `destacarSubtitulos: [...]` (en dorado), `reemplazosSubtitulos: [{ de, a }]` y `pausas: [{ enSeg, duracionSeg }]`.
El personaje heredado `src/personajes/Lupe.tsx` es PROVISIONAL; no presentarlo como personaje del canal (`"personaje": { "oculto": true }`).
Todo personaje e ilustración debe ser original. No recrear personajes, estilos ni escenas de otros canales, películas o series; ilustraciones propias, sin fotografías ni retratos copiados.

## Reglas de contenido
1. Leer las fuentes (y su contexto) ANTES de escribir; registrarlas como `[F#]` en `fuentes.md` con enlace abierto y qué dato respaldan. Fechas y cifras clave con dos fuentes que coincidan, o dar el rango.
2. Nunca inventar fechas, cifras, citas, diálogos ni nombres. No agregar detalles presentándolos como históricos; si se dramatiza, que se note. Citas famosas: verificar que no sean apócrifas (si lo son, "se le atribuye" o no usarlas).
3. Separar hecho comprobado, testimonio de la época (el cronista tiene sesgo), leyenda e interpretación. Cuando los historiadores discrepan, mostrarlo. Evitar el presentismo, pero sin relativizar atrocidades ni justificar esclavitud, genocidios o persecuciones.
4. Política contemporánea y temas abiertos (Malvinas, dictaduras, conflictos vigentes…): hechos atribuidos a su fuente, términos precisos, sin consignas ni postura partidaria. Sin negacionismo, sin teorías conspirativas, sin pseudohistoria.
5. Derechos: paráfrasis propia, citas textuales breves de fuentes primarias, ilustraciones y música originales. No copiar la redacción de libros o artículos.
6. No publicar automáticamente. Entregar el MP4 solo si se renderizó de verdad (en la nube: release del repositorio privado, que el usuario descarga y sube a mano).
7. Reutilizar la narración si no cambió el texto/voz/modelo (huella en `recursos/narracion.meta.json`).

## Estructura
```
.claude/settings.json        hook de inicio en la nube (scripts/preparar-nube.mjs)
.claude/skills/              skill producir-videos-historia
.github/workflows/           renderizar.yml: render en GitHub Actions + MP4 en Releases
config/canal.json            configuración del canal (voz, formatos, render, fuentes)
src/                         proyecto Remotion (React + TypeScript)
  especiales/                escenas a medida por video (<tema>/escenas.tsx + Portada.tsx), ambiente.tsx, comun.tsx, historia/ (piezas propias)
  Root.tsx                   composiciones: VideoCanal, PruebaRender, Referencias/*
  video/ escenas/ componentes/ personajes/ ilustraciones/ marca/   base técnica heredada
scripts/                     comandos npm (Node puro)
producciones/<AAAA-MM-DD-tema>/   un video por carpeta (video.json, guion.md, fuentes.md, youtube.md, recursos/, entrega.json; qa/ y MP4 no van a git)
producciones/_plantilla/     plantilla de video nuevo
guia-produccion/             guías: fuentes-historicas, guion, visual, voz-y-sincronia, qa-y-entrega, nube
herramientas/                lanzadores para Windows, audio sintetizado y vista previa aproximada
```

## Comandos
| Comando | Qué hace |
|---|---|
| `npm run entorno` | revisa Node, npm, Remotion y fuentes |
| `npm run prueba` | render local de 3 s (sin voz) en `producciones/0000-prueba-render/` |
| `npm run nuevo -- <tema>` | crea la carpeta de un video (`--largo` para horizontal) |
| `npm run narracion:estado -- <video>` | ¿la voz guardada sirve o hay que generarla? |
| `npm run narracion:api -- <video>` | genera la voz (API de ElevenLabs; reutiliza si está vigente; en trozos si el guion es largo) |
| `npm run voces [-- <nombre>]` | lista voces de la cuenta y prueba la clave (0 créditos) |
| `npm run sincronizar -- <video>` | ajusta escenas y subtítulos a la voz real |
| `npm run verificar -- <video>` | revisión previa al render |
| `npm run render -- <video>` | cuadros de revisión + MP4 (`--solo-qa`, `--sin-audio`, `--forzar`) |
| `npm run producir -- <video>` | descarga voz pendiente + sincroniza + verifica + render |
| `npm run entregar -- <video>` | marca el video para entrega → push → GitHub Actions deja el MP4 en Releases (`--estado`, `--rehacer`) |
| `npm run studio [-- <video>]` | abre Remotion Studio |
| `npm run srt -- <video>` | exporta los subtítulos a `recursos/subtitulos.srt` |
| `python3 herramientas/audio/sintetizar.py producciones/<video>/recursos --duracion <s>` | música instrumental y efectos ORIGINALES sintetizados |

## Entorno
- **Nube (principal)**: sesión de Claude Code en claude.ai/code o en la app del celular, repo de este canal, red Trusted + los hosts de fuentes que hagan falta, secreto de red de ElevenLabs para `api.elevenlabs.io` con encabezado `xi-api-key`, setup script con librerías de Linux. El hook de inicio instala dependencias y el navegador de Remotion. El MP4 final lo hace GitHub Actions (`renderizar.yml`) al hacer push de `entrega.json`; en videos largos puede tardar bastante (ver `guia-produccion/nube.md`).
- **PC del usuario** (opcional): Windows. Ejecutar con `node scripts/<script>.mjs <video> [--opciones]`. Voz con la clave en `.env` o `.env.txt`.
- Si el guion lo escribe Claude, pedir OK del usuario (gancho + guion + fuentes) antes de generar voz; si el usuario entrega el guion final y pide producir, generar la voz directamente. Nunca leer ni mostrar la clave de ElevenLabs.
- Remotion fijado en 4.0.539 (todos los paquetes `@remotion/*` en la misma versión; actualizar con `npx remotion upgrade`).
