# Fuentes históricas y verificación

## Regla de oro
**Fuente no leída = el dato no entra.** Cada fecha, nombre, cifra, lugar y cita que aparece en la voz o en pantalla se puede rastrear a un `[F#]` de `fuentes.md` con enlace que se abrió de verdad. El canal **parafrasea**: cuenta los hechos con palabras propias y no copia la redacción de libros ni artículos.

## Jerarquía de fuentes
1. **Primarias (P)**: crónicas, cartas, tratados, leyes, diarios, testimonios, inscripciones, censos. Son de la época, pero tienen sesgo (el cronista del vencedor, la propaganda, la hagiografía): decir quién escribe y por qué. Dónde buscarlas: Internet Archive, Project Gutenberg, Wikisource, Internet History Sourcebooks de Fordham, archivos nacionales (Library of Congress, National Archives, The National Archives UK), archivos digitales de bibliotecas.
2. **Secundarias académicas (S)**: libros y artículos de historiadores, museos, universidades, UNESCO, instituciones y academias de historia (para Argentina: Archivo General de la Nación, Biblioteca Nacional, Academia Nacional de la Historia, Museo Histórico Nacional). Son la base del guion.
3. **Enciclopedias y divulgación (T)**: Britannica, World History Encyclopedia, Wikipedia. Sirven para orientarse y para encontrar las fuentes que cita cada artículo; **no alcanzan solas** para un dato discutido, una cifra o una cita.
4. Para datos económicos o demográficos modernos: organismos oficiales y Our World in Data (citando la fuente de origen).

## Cómo trabajar
- Leer con `curl` (el subagente web-fetch no sirve). Para Wikipedia: `https://en.wikipedia.org/w/index.php?title=<Titulo>&action=raw`.
- Si un host responde **403 del proxy**, no está permitido en el entorno: no rodearlo ni insistir; anotarlo en "Fuentes que no se pudieron abrir" y pedirle al usuario que lo sume (lista sugerida: `config/canal.json → fuentes.hostsSugeridos`). Siempre se puede usar otra fuente abierta para el mismo dato.
- Leer el **contexto** (el capítulo o el artículo entero, no solo la línea que sirve) y buscar al menos una fuente que lo cuente distinto.
- Registrar en `fuentes.md`: tabla de fuentes `[F#]` (tipo P/S/T, autor, obra, año, enlace, qué respalda), tabla de datos clave, tabla de citas, notas de lectura, ideas descartadas.

## Cómo se verifica cada tipo de dato
| Dato | Regla |
|---|---|
| **Fechas** | Dos fuentes que coincidan. Si no, decir "hacia el año…" o dar el rango. Cuidar el **calendario**: Juliano vs Gregoriano (Rusia usó el juliano hasta 1918: la "Revolución de Octubre" ocurrió en noviembre del calendario actual); aclararlo si el video usa fechas de esa zona y época. Año nuevo, años de reinado y eras locales: convertir y avisar. |
| **Cifras** (muertos, ejércitos, población, distancias) | Las de cronistas antiguos suelen estar muy infladas. Dar el rango o "según los cronistas… los historiadores calculan…". Nunca una cifra exacta sin fuente moderna seria. |
| **Nombres** | Usar la forma española establecida (Gengis Kan, Saladino, Moctezuma, Pekín, Hernán Cortés) y, si no la hay, la grafía original; la misma en todo el video. Anotar variantes en `fuentes.md`. |
| **Citas textuales** | Solo con fuente primaria verificada: quién, cuándo, dónde y en qué lengua original (si es traducción, decirlo). Si no se encuentra, o es dudosa: "se le atribuye" o no usarla. Hay frases famosas que no son de quien se cree: verificar siempre. |
| **Lugares y mapas** | Nombres de la época + el actual ("Constantinopla, hoy Estambul"). Fronteras de la época, no las de hoy; si son aproximadas, rotularlas "fronteras aproximadas". |
| **Causas y consecuencias** | Es interpretación: atribuirla ("para muchos historiadores…") y mostrar el debate si existe. |

Mitos y errores frecuentes que **hay que verificar igual antes de usarlos o desmontarlos**: "que coman pasteles" y María Antonieta; los cascos con cuernos vikingos; la Edad Media y la "Tierra plana"; la estatura de Napoleón; Cortés "quemando" sus naves; los cinturones de castidad medievales. No afirmar nada de esta lista sin leer la fuente.

## Perspectivas y sesgos
- Contar desde más de un lado (vencedores y vencidos, pueblos originarios, mujeres, personas comunes); no solo desde la corona o el ejército.
- Evitar el presentismo (juzgar el pasado con la ética de hoy como único lente), pero **sin relativizar atrocidades**: esclavitud, genocidios, persecuciones y matanzas se nombran con claridad y sobriedad.
- Evitar el determinismo ("tenía que pasar"): mostrar qué decisiones y contingencias hubo.
- Si hay una versión oficial y otra revisionista, presentar qué sostiene cada una y qué dice la evidencia; no inventar un "equilibrio" entre un hecho y su negación.

## Temas sensibles y de actualidad
- **Argentina y Latinoamérica** (independencias, caudillos, inmigración, peronismo, dictaduras, Malvinas, deuda…), **conflictos vigentes** y política contemporánea: hechos atribuidos a su fuente, términos precisos, sin consignas ni postura partidaria. Ante la duda, citar la fuente y quién lo afirma.
- **Holocausto, esclavitud, genocidios, bombas atómicas, terrorismo**: sobriedad; sin recreación del sufrimiento ni imágenes de cuerpos; cifras con fuente; sin humor ni espectacularización; nunca negacionismo.
- **Religión y culturas**: respeto; sin caricaturas ni estereotipos (musulmanes en las Cruzadas, judíos en la Edad Media, pueblos originarios…).
- Personas reales vivas o recientes: solo hechos públicos y documentados, sin difamación.
- Sin teorías conspirativas ni pseudohistoria (alienígenas, "historia oculta", cronologías inventadas).

## Derechos de autor
- Parafrasear siempre; citas textuales breves.
- Ilustraciones, mapas y música **propios** (SVG de Remotion y audio sintetizado). No usar fotografías, pinturas escaneadas ni archivo fílmico de terceros salvo que el usuario lo pida y con licencia clara.

## Datos que aparecen en pantalla
Año, lugar y cifras clave van en `Dato`/`Contador`/año grande (ver `visual.md`), tal como están en `fuentes.md → Datos clave verificados`. Si un dato está discutido, mostrarlo como "≈" o rango.
