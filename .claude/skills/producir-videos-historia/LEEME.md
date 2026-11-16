# producir-videos-historia

Skill para producir videos animados de **historia general desde el año 1000 hasta hoy, sin límite de duración**. Es la adaptación de `producir-videos-cristianos`, en una **carpeta autocontenida para copiar** a otro repositorio.

## Qué hay adentro
| Archivo / carpeta | Para qué |
|---|---|
| `SKILL.md` | La skill (se carga sola cuando pedís un video de historia). Incluye el paso de instalación y la sección de videos largos. |
| `para-la-raiz-del-repo/` | Lo que va en la raíz del repo nuevo: `CLAUDE.md`, `config/canal.json`, `guia-produccion/` (6 guías) y `producciones/_plantilla/`. |
| `ajustes-al-codigo/` | Cambios de código para que "sin límite de duración" sea cierto: `narrar-api.mjs` con voz en trozos. |
| `instalar.sh` | Copia todo a su lugar, aplica los ajustes y hace respaldo de lo que pisa. |

## Instalar (2 pasos, en el repo nuevo)
El repo nuevo tiene que tener la misma base técnica (`scripts/`, `src/`, `.github/workflows/renderizar.yml`), como `Videos-cristianos` la tomó de nutrición.
1. Copiá esta carpeta entera a `.claude/skills/producir-videos-historia/` del repo nuevo.
2. Desde la raíz del repo: `bash .claude/skills/producir-videos-historia/instalar.sh` (agregá `--si` para no preguntar). O pedile a Claude "instalá la skill de historia": el paso 0 de `SKILL.md` hace lo mismo.
Después: commit + push y abrir una **sesión nueva** (para que cargue el `CLAUDE.md` nuevo).

`instalar.sh` **reemplaza** `CLAUDE.md`, `config/canal.json`, `guia-produccion/` y `producciones/_plantilla/` (copia de lo anterior en `.respaldo-antes-de-historia/`). Si el repo ya dice `"canal": "historia"`, no vuelve a pisar `CLAUDE.md` ni `canal.json`: solo reaplica los ajustes de código.

## Qué cambió respecto de la skill cristiana
- **Contenido**: fuentes históricas verificables en vez de pasajes bíblicos (`[F#]` con tipo primaria/secundaria/enciclopedia, tabla de datos clave y de citas); reglas para fechas y calendarios, cifras de cronistas, grafía de nombres, citas apócrifas, mitos y debates entre historiadores; temas sensibles (atrocidades, política actual, Argentina y Latinoamérica) con sobriedad.
- **Duración**: sin mínimo ni máximo. Se respeta el guion completo y se avisa la duración final. Seis formatos (relato, mito vs realidad, causas y consecuencias, cronología, biografía, un día en…) con pautas de ritmo y capítulos para videos largos.
- **Visual**: mapas con rutas animadas, año grande, línea de tiempo, tarjeta de capítulo, documento, estandarte y personajes de época (especificados en `visual.md`), lista de anacronismos a revisar y criterio de sobriedad.
- **QA y entrega**: revisión de contenido contra `fuentes.md` antes de la visual; QA por muestreo para videos largos; capítulos con tiempos y fuentes en `youtube.md`.
- Se mantienen: flujo de producción, biblioteca visual, voz, subtítulos, entrega por GitHub Actions, "guion del usuario = no se cambia", "no publicar nada".

## Los ajustes de código (por qué hacen falta)
1. **`scripts/narrar-api.mjs`**: la versión original manda todo el guion en un solo pedido a ElevenLabs, que limita el texto por pedido. La nueva parte el guion por escenas en trozos de hasta `voz.maxCaracteresPorPedido` (3.500), une los MP3 y corre los tiempos; guarda cada trozo en `recursos/.trozos/` (no se vuelve a pagar lo ya generado). Un guion corto sigue saliendo en un solo pedido, igual que antes.
2. **`.github/workflows/renderizar.yml`**: `timeout-minutes` de 60 a 360 (máximo de GitHub); un video largo puede tardar más de una hora en renderizar.
3. **`config/canal.json`**: `duracionMaximaSeg` y `palabrasObjetivo` llevan valores enormes porque `verificacion.mjs` los exige como números; así nunca avisa por duración.

**Probado** (sin gastar créditos, con un ElevenLabs simulado y los scripts reales): guion de 1.834 palabras (≈ 13,5 min) en 5 trozos, tiempos por palabra completos y crecientes, `sincronizar.mjs` con cobertura 100 %, reutilización total en la segunda corrida, retoque de una escena (1 trozo regenerado, 4 reutilizados), límite de caracteres de la API (se re-parte solo), rechazo de `previous_text/next_text`, y guion corto idéntico al original. También el instalador y `nuevo-video`/`verificar` con la config y plantilla nuevas.
**No probado**: la API real de ElevenLabs con `eleven_v4` (la clave de esta sesión no puede consultar `/v1/models`, así que no pude medir el límite real por pedido), el render de un video largo en Actions ni ninguna escena de historia (no existen todavía).

## Decisiones que tomé por mi cuenta (confirmalas o cambialas)
- **Nombre, lema y usuario del canal**: `(por definir)`. Hasta que los pases, el cierre dice "seguinos" a secas.
- **Voz**: la heredada del canal bíblico ("Anciano sabio rioplatense"), porque es la única verificada en la cuenta y suena a narrador documental. Se cambia en `config/canal.json → voz`.
- **Formato por defecto**: vertical 1080×1920; horizontal con `formato: "largo"` si el prompt lo pide. Ninguno tiene tope de tiempo (`formatoPorDefecto` en `canal.json`).
- **Alcance**: del año 1000 en adelante, mundial. Un tema anterior solo como antecedente o si lo pedís expresamente.
- **Fuentes y red**: en la sesión donde armé esto, la red devolvía 403 para **todos** los sitios de historia que probé (incluida `en.wikipedia.org`), así que no sé cuáles abre tu entorno. Antes de producir, sumá al entorno los hosts de `config/canal.json → fuentes.hostsSugeridos` (lista sugerida, no verificada).
- **Falta construir** (se hace con el primer video y se reutiliza): personajes de época y las piezas de mapa/línea de tiempo (están especificadas en `guia-produccion/visual.md`), paleta definitiva, insignia propia.
- **Repo nuevo**: `<REPO>` en `CLAUDE.md` y `nube.md` se completa solo con el nombre del remoto; revisá el dueño.
- En este repo la carpeta queda **dentro** de `producir-videos-cristianos/` (como pediste) y no directamente en `.claude/skills/`, así que no debería cargarse como skill acá hasta que la copies (no lo verifiqué).
