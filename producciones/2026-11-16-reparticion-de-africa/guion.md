# Guion — La repartición de África

- **Formato de video:** vertical 1080×1920 · **duración final: 2 min 50 s** (voz 163,1 s + pausas + cierre)
- **Tipo:** causas y consecuencias
- **Época y lugar:** 1870–1914 · África y Europa (Berlín)
- **Público:** hispanohablante general · voseo suave
- **Idea central:** en treinta años Europa se repartió casi toda África sin africanos en la mesa, y esas fronteras siguen pesando.
- **Palabras totales del guion:** 378 (≈ 0,437 s por palabra → ≈ 165 s de voz + cierre de 5 s)
- **Guion entregado por el usuario: no se cambió ni una palabra.**

## Gancho (primeros segundos)
El del usuario: "En apenas treinta años, un continente entero fue dividido con regla y compás…". Imagen: mesa de caoba vista desde arriba, el compás se clava en el mapa y traza una línea roja desde el primer segundo.

## Guion locutado
1. **Gancho** — En apenas treinta años, un continente entero fue dividido con regla y compás en una sala de reuniones en Europa, sin la presencia de un solo líder africano, creando fronteras artificiales que siguen provocando conflictos hoy en día. [F1] [F3]
2. **Revolución Industrial** — Finales del siglo diecinueve, entre mil ochocientos ochenta y mil novecientos catorce. Impulsado por la Segunda Revolución Industrial, las potencias europeas necesitaban desesperadamente materias primas baratas como caucho, minerales y aceite de palma, y nuevos mercados para sostener su crecimiento económico y prestigio imperial. [F3]
3. **Del 10 % al interior** — Hasta mil ochocientos setenta, los europeos solo controlaban cerca del diez por ciento de África, principalmente puestos comerciales costeros. El avance de la medicina, como el uso de la quinina contra la malaria, los barcos a vapor y la ametralladora Maxim permitieron penetrar hacia el interior. [F4]
4. **Conferencia de Berlín** — La Conferencia de Berlín, entre mil ochocientos ochenta y cuatro y mil ochocientos ochenta y cinco, fue convocada por el canciller alemán Otto von Bismarck para evitar que las potencias europeas entraran en guerra entre sí por el control africano. Participaron catorce naciones, incluyendo Reino Unido, Francia, Alemania, Bélgica, Portugal y Estados Unidos, pero ningún representante africano fue invitado. [F1] [F2] [F3]
5. **Ocupación Efectiva** — En Berlín se acordó el principio de Ocupación Efectiva: una potencia solo podía reclamar un territorio si demostraba que lo controlaba administrativamente y militarmente en el terreno, y no solo dibujándolo en un mapa. Esto desató una carrera frenética de invasiones y tratados desiguales firmados con jefes locales que no entendían los documentos europeos. [F1] [F3]
6. **El Congo** — El rey Leopoldo Segundo de Bélgica logró que le reconocieran la cuenca del río Congo como su propiedad privada, el Estado Libre del Congo, instaurando un régimen de trabajos forzados para extraer caucho que causó la muerte de millones de personas. [F5] [F6]
7. **1914** — Para mil novecientos catorce, al inicio de la Primera Guerra Mundial, el noventa por ciento de África estaba bajo dominio europeo; solo Etiopía, que derrotó militarmente a Italia en la batalla de Adua en mil ochocientos noventa y seis, y Liberia, fundada por esclavos liberados de Estados Unidos, mantuvieron su independencia. [F4]
8. **Fronteras** — Las fronteras trazadas con líneas rectas ignoraron por completo las divisiones étnicas, lingüísticas y religiosas previas, separando pueblos unidos y encerrando a grupos rivales dentro de los mismos países, la raíz directa de gran parte de las guerras civiles africanas del siglo veinte y veintiuno. [F3]
9. **Cierre de marca** (sin voz, ≈ 5 s) — el hilo dorado teje "El pasado del pasado · el hilo de la historia".

## Hecho, testimonio, leyenda e interpretación
Ver `fuentes.md → Notas de lectura`. Lo principal: la conferencia fijó reglas y la mayoría de las fronteras se trazó después; las muertes del Congo se estiman entre 1 y 15 millones; el peso de las fronteras en las guerras posteriores es una interpretación extendida, no la única causa.

## Notas de producción
- **Voz:** "Anciano sabio rioplatense" (`eleven_v4`), generada en un solo pedido; coincidencia 100 %. Pausa marcada en "sin la presencia de un solo líder africano" (0,35 s antes y 0,4 s después, con `pausas`); la pausa final de 4,6 s es el cierre de marca.
- Placas: las del prompt, partidas en dos renglones en el "|" para que entren en el ancho seguro.
- Mapa: contornos de Natural Earth [F7]; las colonias de 1914 usan **fronteras actuales como aproximación** (rotulado en pantalla). Enclaves de 1880 aproximados.
- Dibujado por convención: banderas de época simplificadas (Reino Unido, Francia, Imperio alemán negro-blanco-rojo, Bélgica, Portugal monárquico azul y blanco, Estados Unidos); Bismarck y Leopoldo II como siluetas (sin retrato); "El Coloso de Rodas" como recreación original de una caricatura de época, rotulada como tal.
- Violencia del Congo: sin cuerpos ni sangre; luces de aldeas que se apagan y lianas que se vuelven cadenas.
- Piezas nuevas reutilizables en `src/especiales/historia/` (mapa de África por potencias, placa, humo, chispas, caballeros de época, compás, regla, cierre del canal).
