# Voz (ElevenLabs) y sincronía

## Voz del canal
- Se guarda en `config/canal.json → voz` (`voiceId`, `nombre`, `modelo`, `elegida`). Un video puede usar otra con `video.json → voz`.
- Por defecto es la voz heredada del canal bíblico ("Anciano sabio rioplatense", barítono cálido, narrador pausado), que encaja con un narrador documental. Si el usuario pide otra: proponer las `candidatas`, compartir los `preview_url` y guardar la elegida. No generar audio sin voz elegida.
- Modelo: `eleven_v4` (`modeloApi`). Si la API no lo acepta con tiempos, `narrar-api.mjs` usa `modeloApiAlternativo` (`eleven_multilingual_v2`) y lo anota en `narracion.meta.json`.
- Comprobar acceso y buscar voces sin gastar créditos: `node scripts/voces.mjs`.

## Reutilizar antes de generar
Huella = sha256 de `{"texto","voiceId","modelo"}` (16 primeros hex), con `texto` = las `narracion` de las escenas, recortadas y unidas por un espacio. El audio es vigente si coincide texto, voz y modelo.
`npm run narracion:estado -- <video>` la calcula, escribe `recursos/narracion.texto.txt` y dice:
- **VIGENTE** → no generar (0 créditos).
- **PENDIENTE DE DESCARGA** → ya está generada; solo falta bajarla.
- **FALTA / DESACTUALIZADA** → generar.
Cambiar solo cosas visuales (mapas, ilustraciones, títulos) NO cambia la huella. Cada retoque del texto sí: confirmar el guion antes de generar.

## Generar con la API (camino principal: nube y PC)
`node scripts/narrar-api.mjs <video>` (= `npm run narracion:api -- <video>`):
- **En la nube**: la clave es un secreto de red del entorno (host `api.elevenlabs.io`, encabezado `xi-api-key`). El script manda el pedido sin clave y el proxy la agrega; la sesión nunca la ve. Si responde 401, el secreto no está configurado (ver `nube.md`).
- **En la PC**: `ELEVENLABS_API_KEY` en `.env` (o `.env.txt`).
- Genera el MP3 y los tiempos por carácter (se convierten a palabras en `palabras.json`) en una sola llamada por trozo; no hace falta transcribir.
- La voz tiene que estar en "My Voices" de la cuenta. `--forzar` rehace la narración; `--simular` muestra qué mandaría (caracteres, trozos) sin gastar nada.

## Videos largos: narración en trozos
ElevenLabs limita el texto por pedido. La versión original de `narrar-api.mjs` manda todo el guion en un solo pedido, así que **un video largo necesita la versión con trozos** (`ajustes-al-codigo/scripts/narrar-api.mjs` de la skill, que reemplaza a `scripts/narrar-api.mjs`):
- Parte el texto **por escenas** (nunca a mitad de una frase si se puede evitar), hasta `voz.maxCaracteresPorPedido` caracteres por pedido (3.500 por defecto). Si el guion entra en un pedido, se comporta igual que la versión original.
- Une los MP3 y desplaza los tiempos de cada trozo para que `palabras.json` y `sincronia.json` queden como si fuera una sola grabación. La huella y los archivos son los mismos de siempre: lo demás del flujo no cambia.
- Guarda cada trozo en `recursos/.trozos/`: si un trozo falla a mitad de camino, al reintentar **no se pagan de nuevo** los que ya salieron, y si se retoca el texto de una escena solo se regenera el trozo que la contiene.
- Si la API rechaza un trozo por exceso de caracteres, el script lo vuelve a partir en trozos más cortos (los pedidos rechazados no se cobran).
- Costo en créditos ≈ cantidad de caracteres del guion (un video de 10 min son unos 6.000–7.000). Generar **una sola vez** con el guion confirmado.
- Entre trozos puede haber un cambio mínimo de entonación: por eso los cortes van en límites de escena y se envía el texto vecino como contexto (`previous_text`/`next_text`).

## Nombres extranjeros, años y siglas
La voz lee lo que está escrito en `narracion`. Si pronuncia mal un nombre propio:
1. Probar escribirlo como suena en español en `narracion` (p. ej. con tilde o separado en sílabas) y escuchar el resultado. No gastar más de dos intentos por nombre: cada intento cuesta créditos.
2. Corregir lo que se ve en pantalla con `video.json → reemplazosSubtitulos: [{ "de": "<como suena>", "a": "<grafía correcta>" }]`.
3. Años y números en palabras en `narracion` ("mil quinientos diez"); en los subtítulos se pueden mostrar con cifras usando `reemplazosSubtitulos`.
4. Anotar en `fuentes.md → Datos clave` la grafía correcta de cada nombre y de dónde sale.

## Sincronía
`npm run sincronizar -- <video>` (lo hace `producir`): alinea las palabras del guion con las de la voz (tolera números escritos distinto u omisiones) y escribe `recursos/sincronia.json` con:
- inicio/fin real de cada escena (la escena empieza cuando arranca su primera palabra),
- subtítulos palabra por palabra con el texto exacto del guion,
- `calidad.cobertura` (% de palabras emparejadas; < 85 % = revisar que la voz diga el guion).
La duración del video = duración real de la voz + pausas + 0,9 s. Sin `palabras.json` se puede `--estimar`, solo como último recurso. Con `pausas` (en `video.json`) se agregan silencios dramáticos sin acelerar nada. La **duración final no tiene tope**: se informa al usuario, no se ajusta.

## Camino alternativo: conexión de ElevenLabs
Si no hay secreto de red ni clave, se puede usar la conexión con `creative_generate_speech` (con el contenido exacto de `recursos/narracion.texto.txt`, `voice_id` y `model_id` de la config; nunca repetir la llamada para "reintentar"), `creative_transcribe_audio` (`eleven_scribe_v1`) para obtener `palabras.json`, `creative_get_generations` para el enlace del MP3 y `node scripts/descargar-narracion.mjs <video>` para bajarlo. Sirve para guiones cortos; los largos conviene hacerlos con la API en trozos.
