# Revisión y entrega

## Antes de renderizar
`npm run verificar -- <video>` (también corre dentro de `render`/`producir`). Bloquea si: faltan campos, narración desactualizada, falta la sincronía, `fuentes.md` con PENDIENTE o citas `[F#]` del guion que no están en `fuentes.md`, `youtube.md` incompleto o con título > 100. Avisa por: títulos largos, ritmo de voz fuera de 2,0–3,3 palabras/s, escenas < 1,2 s, palabras de riesgo, disparadores `entraEn` que no están en la narración. **No hay aviso por duración**: el video puede durar lo que dure.

## Revisión de contenido (contra `fuentes.md`, antes de mirar imágenes)
Una pasada, con el guion en la mano:
- **Fechas y años**: cada una aparece en `Datos clave verificados`; calendario aclarado si hace falta.
- **Cifras**: con fuente moderna o con rango y quién las estima; ninguna cifra exacta de un cronista antiguo.
- **Nombres y lugares**: grafía única en todo el video (voz, pantalla, subtítulos, `youtube.md`); nombre de época + actual cuando cambió.
- **Citas**: solo las verificadas; las dudosas dicen "se le atribuye" o salieron.
- **Hecho / testimonio / leyenda / interpretación**: cada afirmación está en su categoría; los debates están presentados como debates.
- **Perspectivas y tono**: no hay glorificación ni justificación de atrocidades, ni consignas partidarias, ni lenguaje de odio; los temas sensibles se tratan con sobriedad.
- **Alcance**: el tema está dentro del 1000 en adelante (o el usuario pidió lo contrario).
Cualquier hallazgo se corrige en `video.json`/escenas y se anota en `fuentes.md`. Si cambia el texto locutado, volver a confirmar antes de regenerar la voz.

## Revisión visual (una sola pasada, máximo dos vueltas)
`node scripts/renderizar.mjs <video> --solo-qa` arma `.build/props.json`; los cuadros se sacan con `npx remotion still` y las vistas previas con `npx remotion render --scale=0.5` (comandos en `CLAUDE.md`, siempre `< /dev/null`).
- **Video corto o mediano** (hasta ~3 min): una vista previa completa a escala 0,5 y una hoja de cuadros (`fps=1,5`).
- **Video largo**: vista previa corta del gancho y del primer capítulo (`--frames=0-1799`), y un cuadro por escena (inicio y mitad) a escala 0,3–0,4; hojas con `fps=0,25` por tramos. No renderizar la vista previa entera salvo que haga falta.
Comprobar:
- **Legibilidad**: ningún texto cortado ni montado; títulos ≥ 84 px; subtítulos de 1–2 líneas; contraste suficiente.
- **Márgenes**: nada importante en la franja inferior (≈ 400 px) ni en el lateral derecho (≈ 150 px); 80 px a los costados.
- **Exactitud visual**: sin anacronismos (armas, ropa, edificios, banderas, mapas); fronteras de la época; los mapas muestran lo que dice la voz (rutas, ciudades, direcciones).
- **Continuidad**: los personajes iguales en todas las escenas (tamaño, ropa, estilo); colores de acento coherentes.
- **Sincronía**: cada elemento aparece cuando se nombra; el cambio de escena coincide con el cambio de tema; los subtítulos muestran el texto del guion (`sincronia.json → calidad.cobertura` ≥ 90 % ideal).
- **Sobriedad**: sin sangre ni cuerpos; atrocidades sin espectáculo.
- **Portada**: el cuadro 0 funciona solo (título/año + imagen).
- **Gancho**: sin un solo error de animación; si falla, se reemplaza por una escena más simple.
Corregir lo que falle y repetir **solo** lo corregido.

## Exportar y entregar
**En la nube** (camino principal):
1. `node scripts/exportar-srt.mjs <video>` → `node scripts/entregar.mjs <video>` (comprueba voz vigente, sincronía, verificación y cuadros de QA; escribe `entrega.json`).
2. Commit de la carpeta del video (sin `qa/` ni MP4, que están en `.gitignore`) y push a la rama de la sesión. No abrir PR salvo que el usuario lo pida.
3. GitHub Actions ("Renderizar y entregar") renderiza, controla el MP4 (tamaño, fps, duración, audio) y crea el release `entrega-<video>-<huella>` con el MP4, la portada y el texto de `youtube.md`. Si el control falla, no crea el release.
4. `node scripts/entregar.mjs <video> --estado` hasta que diga "MP4 listo"; bajar el MP4, verificar duración y audio con `ffprobe` y enviarlo con `SendUserFile` junto con la portada (si pesa demasiado, dar el enlace del release).
- **Videos largos**: el render tarda mucho más (ver `nube.md`: tiempo máximo del workflow y minutos de Actions). Dejar `entrega.json` solo cuando el video está completo; para ver avances, usar cuadros y vistas previas, no releases intermedios.

**En la PC**: `node scripts/producir.mjs <video>` y revisar `qa/informe-render.json → control` (resolución, 30 fps, duración = voz + pausas + 0,9 s, pista de audio).

Nunca anunciar un MP4 que no se renderizó. Un release en el repositorio privado no es una publicación: el usuario lo descarga y lo sube a mano. Las releases viejas se borran a mano.

## youtube.md
- **Título** ≤ 100 caracteres (ideal ≤ 60), con el hecho, la pregunta o el año clave; sin clickbait engañoso.
- **Descripción**: 2–3 frases, **capítulos con tiempos** (de `sincronia.json`; en todo video de más de 3 min, empezando en 0:00), **lista de fuentes con enlaces** y `avisoDescripcion` de `config/canal.json` (ilustraciones y recreaciones, no fotografías de la época), hashtags (`#Historia` y del tema; `#Shorts` solo en verticales de duración corta: confirmar el límite vigente de YouTube).
- **Etiquetas** y **portada sugerida** (cuadro 0 o `portada.jpg`).
- No publicar ni programar nada: solo dejar el texto listo.
