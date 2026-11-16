# Animación: identidad, piezas y escenas

## Identidad (original del canal, provisional)
- Género de referencia: explicativos 2D con fondos oscuros, texto grande, palabras destacadas, mapas, flechas y acercamientos. **No copiar** personajes, logos, paletas ni encuadres de otros canales, películas o series.
- Base heredada en `src/marca/tema.ts`: azul profundo, pergamino y dorado. Para historia sumar **acentos por tono** y fijarlos de una vez (no cambiarlos entre videos): ocre/sepia para época, carmesí para conflicto, azul acero para mar y comercio, dorado para el dato clave. La paleta definitiva la decide el usuario (pendiente).
- Tipografía local: Inter Display Black/ExtraBold para títulos, Inter Bold/SemiBold para subtítulos y etiquetas (`src/marca/fuentes.ts`); DejaVu serif para textos de documento.
- Palabra destacada: color de acento + subrayado a mano que se dibuja solo. Cierre del canal: libro que se abre con luz cálida (copiar `Cierre` de `pedro/escenas.tsx`) + nombre y lema de `config/canal.json`.

## Zonas (vertical 1080×1920)
- Título desde y≈170, ancho 920. Datos (`Dato`) en y≈330–420. Subtítulos en y≈1430. YouTube y las plataformas tapan la franja inferior (≈ 400 px) y el lateral derecho (≈ 150 px): nada importante ahí; 80 px de margen a los costados.
- Mínimos de texto: títulos 84 px, apoyo 44 px, créditos 32–36 px. Todo debe leerse en el celular.
- Horizontal (1920×1080): contenido centrado o a la izquierda, subtítulos en y≈960, mapas con margen amplio.

## Escenas a medida (el camino habitual)
`tipo: "animada"`, `componente: "<tema>/<escena>"` en `src/especiales/<tema>/escenas.tsx` (se registra en `src/especiales/index.tsx`). Campos de `video.json`: ver la plantilla. En cada escena: `narracion` (texto exacto locutado), `subtitulos` (`abajo` | `medio` | `ocultos`), `lema` (cierre), `desfaseInicioSeg`. Los tipos genéricos (`gancho`, `explicacion`, `comparacion`, `matiz`, `cierre`) siguen existiendo, pero el canal usa escenas a medida.
Disparadores con la voz: `useMomento("palabra", fracción)` (frame local en que se dice esa palabra; elegir palabras que aparezcan una sola vez en la escena).

## Piezas propias de historia (crear una sola vez, en `src/especiales/historia/`, y reutilizar)
Construirlas con SVG y frames, con parámetros, para no repetir trabajo en cada video. Orden sugerido: mapa, año, línea de tiempo, tarjeta de capítulo, documento, personajes.
| Pieza | Qué hace |
|---|---|
| **`Mapa`** | Región en SVG vectorial propio (contornos simplificados, mar, ríos, relieve estilizado). Props: región, marcadores (ciudad, batalla), `rutas`, zonas coloreadas, rótulos, `camara`. Patrón de partida: `MapaFilipinas` en `manila/piezas.tsx`. |
| **`Ruta`** | Línea o flecha que se dibuja sobre el mapa (`strokeDashoffset` por frames): viajes, invasiones, rutas comerciales, avance de ejércitos. |
| **`Frontera`** | Zona coloreada que crece, se achica o cambia de dueño; rotular "fronteras aproximadas" cuando lo sean. Nunca usar las fronteras actuales para épocas anteriores. |
| **`Anio`** | Año grande como ancla de escena (a veces con el contador que pasa de un año a otro). Puede acompañarse del lugar. |
| **`LineaDeTiempo`** | Eje con hitos que aparecen cuando la voz los nombra; marca la posición actual. |
| **`TarjetaCapitulo`** | Número, título y año; separa capítulos en videos largos y resetea la atención. |
| **`Documento`** | Pergamino, carta o tratado con texto que se escribe o se resalta (para citas breves verificadas, con autor y año). |
| **`Estandarte`** | Pendón o escudo de la época y del bando correcto (sin banderas nacionales modernas en épocas anteriores). |
| **`Barco`, `Ejercito`, `Ciudad`** | Nave con mar y estela; bloques o siluetas que avanzan, chocan o se retiran; skyline por época (castillo, ciudad amurallada, puerto, fábrica). |
| **`Dato` / `Contador`** | Ya existen en `manila/piezas.tsx`: pastilla de dato en pantalla y contador de cifras. |

## Personajes de época
- Los personajes de `jesus-12-30/personas.tsx` son bíblicos o de hoy. **Crear personajes de época** como variantes del componente `Persona` (mismo rig, mismas poses, ropa y atributos distintos) en `src/especiales/historia/personas.tsx`: rey/reina, noble, caballero, soldado, mercader, campesino, monje, marino, artesano, científico, pueblo originario, conquistador, samurái, soldado moderno, obrero, etc. Crear solo los que el video necesite y dejarlos para los siguientes.
- Siempre **originales y estilizados**; sin retratos fotorrealistas de personas reales y sin copiar pinturas famosas ni fotos. Una figura histórica se reconoce por su ropa, sus atributos y el rótulo con su nombre, no por un parecido facial.
- Variedad real de cuerpos, rasgos y vestimenta según la región y la época; sin caricaturas ni estereotipos.

## Exactitud y anacronismos
Revisar en cada escena (y en el QA): armas y armaduras de la época (estribos, ballestas, pólvora, cañones, fusiles), ropa y calzado, edificios y materiales, barcos, herramientas, instrumentos, banderas, escritura, mapas y fronteras. Si una pieza no es segura, se simplifica (siluetas, objetos genéricos) en lugar de inventar un detalle. Anotar en `guion.md → Notas de producción` lo que se dibujó por convención.

## Temas sensibles
- Batallas y matanzas: esquemáticas (mapa con flechas, siluetas, humo, objetos), **sin sangre, sin cuerpos, sin sufrimiento recreado**. Atrocidades (esclavitud, genocidios, Holocausto, bombas): lugares, objetos, documentos, cifras y testimonios, con sobriedad y música baja o silencio; nunca como espectáculo.
- Símbolos de odio (esvástica, etc.): evitarlos; si el relato lo exige, mostrarlos con contexto documental claro y sin protagonismo.
- No representar figuras religiosas veneradas de manera irrespetuosa; respetar las normas de representación de cada tradición.

## Ritmo visual (clave en videos largos)
- Acciones, gestos, objetos, mapas y transiciones conectadas; evitar imágenes quietas con zoom repetido. Cambio de plano o de tipo de imagen cada 5–12 s.
- Alternar fuentes visuales: mapa → personaje → documento → dato → paisaje/ciudad. Encuadres cerrados (z 1.2–1.4) cuando hay personajes.
- Tarjeta de capítulo o transición clara en cada cambio de tema; el gancho es lo más cuidado del video.
- Etiquetas y datos discretos: 1–2 a la vez, legibles en el celular, tal como están en `fuentes.md → Datos clave verificados`.

## Reglas de animación
- Todo por frames: `useCurrentFrame()`, `interpolate()` con clamp, `spring()`. Nada de CSS transitions/animations.
- Cada escena entra con un pequeño golpe de cámara; los elementos aparecen cuando la voz los nombra.
- `id` de degradados, patrones y `clipPath` únicos por escena (`React.useId`); `Camara` con frames estrictamente crecientes.
- Composiciones de referencia en Studio: `VideoCanal`, `PruebaRender`, `Personajes-V2` (hoja de personajes, `--frame=20`). Sumar una composición de referencia para mapas y personajes de época cuando existan.

## Música y efectos
Siempre sintetizados con `herramientas/audio/sintetizar.py` (sin audio de terceros). Música instrumental baja por debajo de la voz; efectos solo donde suman (ver la lista en `CLAUDE.md`). En temas dolorosos, música casi inaudible o silencio.
