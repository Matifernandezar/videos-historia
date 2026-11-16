// Todo en uno (lo que corre PRODUCIR-VIDEO.cmd): descarga la narración pendiente,
// sincroniza con la voz real, verifica, genera cuadros de revisión y exporta el MP4.
// Uso: npm run producir -- <video>     (sin nombre: la producción más reciente)
import fs from "node:fs";
import path from "node:path";
import { argumentos, estadoNarracion, fallar, leerCanal, leerJSON, resolverProduccion, rutasVideo } from "./lib/comun.mjs";
import { descargarPendiente } from "./descargar-narracion.mjs";
import { sincronizarProduccion } from "./sincronizar.mjs";
import { renderizarProduccion } from "./renderizar.mjs";

const { opciones, sueltos } = argumentos();
let nombre;
try {
  nombre = resolverProduccion(sueltos[0]);
} catch (e) {
  fallar(e.message);
}
const rutas = rutasVideo(nombre);
console.log(`\n■ Produciendo ${nombre}`);
try {
  const d = await descargarPendiente(rutas);
  if (d.hecho) console.log(`✔ Narración descargada (${d.duracionSeg?.toFixed(2)} s)`);

  const video = leerJSON(rutas.video);
  const est = estadoNarracion(rutas, video, leerCanal());
  // Con audio vigente se re-sincroniza siempre: es instantáneo y usa la duración real del MP3.
  if (est.estado === "vigente") {
    const s = sincronizarProduccion(rutas, { estimar: !fs.existsSync(rutas.palabras) });
    console.log(`✔ Sincronía ${s.metodo} (coincidencia ${s.calidad.cobertura}%, voz ${s.duracionSeg.toFixed(2)} s)`);
  }
  const informe = await renderizarProduccion(nombre, opciones);
  if (informe?.mp4) console.log(`\nListo. Revisá qa/cuadros y el MP4 en producciones/${nombre}/. No se publica nada automáticamente.`);
  else console.log(`\nCuadros de revisión listos en ${path.join("producciones", nombre, "qa", "cuadros")}.`);
} catch (e) {
  fallar(e.message);
}
