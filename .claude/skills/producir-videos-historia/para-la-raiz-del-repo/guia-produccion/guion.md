# Gancho y guion

## Voz del canal
- Español natural para Argentina y Latinoamérica: cercano, claro, de narrador documental, con voseo suave ("fijate", "imaginá", "mirá").
- Sin modismos muy locales. Frases cortas (≤ 20 palabras). Una idea por frase. Verbos concretos. Datos con contexto ("hace casi mil años", "en pleno invierno").
- Tono riguroso, curioso y con ritmo; sin sensacionalismo, sin tono de vendedor ni de condena. Sobrio con lo doloroso.

## Para la voz: años, números y nombres
- Años y números como se dicen: "en el año mil sesenta y seis", "mil quinientos cuarenta y nueve", "doce mil soldados". Siglos en palabras: "siglo once", "siglo diecinueve". Reyes y papas: "Enrique octavo", "Juan Pablo segundo".
- Siglas y símbolos: "a. C." y "d. C." se dicen "antes de Cristo", "después de Cristo".
- Nombres extranjeros: escribir en `narracion` como suenan en español si la voz los pronuncia mal (ver `voz-y-sincronia.md`) y corregir lo que se lee en pantalla con `reemplazosSubtitulos`.

## Alcance y mapa de temas (desde el año 1000)
Orientativo, para elegir el ángulo y no limitarse a Europa:
| Período | Ejemplos |
|---|---|
| 1000–1250 | Normandos y Hastings (1066), Cruzadas, Imperio bizantino y selyúcidas, dinastía Song, Angkor, Chola, Cahokia, reinos africanos (Ghana, Mali), Gran Cisma (1054), Carta Magna (1215) |
| 1250–1500 | Mongoles, Peste Negra, Guerra de los Cien Años, Imperio otomano y caída de Constantinopla (1453), Ming, mexicas e incas, imprenta, Renacimiento, Mali y Songhai |
| 1500–1700 | Conquista de América, comercio y esclavitud transatlántica, Reforma, Imperio mogol, Japón Edo, Guerra de los Treinta Años, revolución científica |
| 1700–1800 | Ilustración, Revolución Industrial, Revolución Americana y Francesa |
| 1800–1900 | Napoleón, independencias latinoamericanas, imperialismo, unificaciones, Meiji, Guerra Civil de EE. UU., inmigración masiva |
| 1900–1945 | Primera Guerra Mundial, Revolución rusa, entreguerras, Segunda Guerra Mundial, Holocausto |
| 1945–1991 | Guerra Fría, descolonización, Vietnam, dictaduras del Cono Sur, Malvinas (1982), caída del Muro |
| 1991–hoy | Globalización, internet, conflictos recientes |

## Formatos (el canal los mezcla; ninguno tiene duración fija)
| Formato | Para qué | Estructura típica |
|---|---|---|
| **Relato** ("La historia de…") | Contar un hecho con ritmo | gancho (el momento de tensión) → contexto → desarrollo en orden → giro → consecuencias → por qué importa → cierre |
| **Mito vs realidad** | Desmontar una frase o creencia falsa | gancho (el mito) → de dónde viene → qué dicen las fuentes → qué pasó realmente → por qué el mito sobrevive → cierre |
| **Causas y consecuencias** ("Cómo llegamos a…") | Explicar un proceso | gancho (el resultado) → antes → causas una a una → detonante → consecuencias → debate de historiadores → cierre |
| **Cronología** ("Qué pasó en…") | Un año, un día o una etapa | gancho → línea de tiempo con hitos (cada uno con su escena) → hilo conductor → cierre |
| **Biografía** | Una persona y su época | gancho (el momento decisivo) → origen → ascenso → decisiones clave → caída o legado → cierre |
| **Un día en… / Curiosidades** | La vida cotidiana de una época | gancho (una escena concreta) → rutina → sorpresas → qué tiene que ver con hoy → cierre. Si se dramatiza, que se note ("imaginá…") |

## Duración: sin límite
- El video dura lo que dura el guion. No hay mínimo ni máximo. No se recorta ni se acelera la voz para entrar en un tiempo.
- Para estimar: ≈ 2,3 palabras por segundo (0,43–0,44 s por palabra), más pausas y 0,9 s de cola. 1.000 palabras ≈ 7 min 15 s.
- **Que cada bloque sume algo nuevo** (un hecho, un giro, una imagen distinta). Si un tramo solo repite, se quita (si el guion es del usuario, se le sugiere y se produce completo).
- **Ritmo para videos largos**: información o imagen nueva cada 5–12 s; un re-gancho (pregunta, giro, "pero había un problema") cada 60–90 s; un cambio visual claro o tarjeta de capítulo en cada cambio de tema; un resumen breve antes del cierre solo si el video pasa de unos 8–10 minutos.
- Si el tema da para más de un video, ofrecer dividirlo en partes (con gancho de continuidad), pero producir lo pedido.
- Capítulos con marcas de tiempo en `youtube.md` (de `recursos/sincronia.json`) en todo video de más de 3 minutos.

## Gancho
- Escribir 3 opciones y elegir la más fuerte que sea **fiel a las fuentes**. Tipos que funcionan:
  - Momento de tensión con año y lugar: "[Año en palabras]. [Lugar]. [Una imagen concreta de lo que está pasando.]"
  - Dato desconcertante: "[Cifra o contraste verificado que no cuadra con lo que se cree.]"
  - Pregunta: "¿Por qué [hecho verificado que parece contradictorio]?"
  - Mito común: "[Frase famosa] no la dijo [la persona a quien se le atribuye]."
  (Son moldes: todo dato que los complete se verifica antes en `fuentes.md`.)
- Título en pantalla ≤ 40 caracteres, en mayúsculas, con **una** palabra destacada. El frame 0 ya muestra el título completo (sirve de portada).
- El gancho no puede tener errores de animación: si no sale bien, se reemplaza por uno más simple.

## Desarrollo
- Orden claro (cronológico o causal), un hecho por frase. Nombrar cada elemento justo cuando aparece en pantalla (`useMomento`).
- Cada capítulo: una idea, un lugar, un año ancla en pantalla. Máximo 1–2 datos en pantalla a la vez.
- Marcar la certeza: "se sabe que…", "según el cronista…", "los historiadores discuten…".

## Cierre
- Una frase que deje la idea clave (qué cambió, qué quedó) + invitación a **comentar y seguir** (si hay nombre del canal, decirlo; sin inventar usuarios ni enlaces). Cierre visual de 4–6 s con `desfaseInicioSeg` si hace falta.

## Archivo guion.md
Guardar: formato, época y lugar, idea central, los 3 ganchos y el elegido, el guion por capítulo con citas `[F#]`, la sección "Hecho, testimonio, leyenda e interpretación", el texto recortado (solo si el usuario lo pidió) y notas de producción. La plantilla está en `producciones/_plantilla/guion.md`.
