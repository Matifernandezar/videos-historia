// Ajusta escenas y subtítulos a la duración REAL de la voz.
// Lee recursos/palabras.json (tiempos por palabra) y escribe recursos/sincronia.json.
// Uso: npm run sincronizar -- <video>      (--estimar: sin palabras.json, reparte por duración del audio)
import fs from "node:fs";
import { argumentos, duracionMP3, escribirJSON, estadoNarracion, fallar, leerCanal, leerJSON, resolverProduccion, rutasVideo } from "./lib/comun.mjs";
import { normalizarPalabrasVoz, sincronizar, sincronizarEstimado } from "./lib/alinear.mjs";

export const sincronizarProduccion = (rutas, { estimar = false } = {}) => {
  const video = leerJSON(rutas.video);
  const canal = leerCanal();
  const est = estadoNarracion(rutas, video, canal);
  const duracionAudio = est.meta?.duracionSeg ?? (fs.existsSync(rutas.audio) ? duracionMP3(rutas.audio) : null);
  const crudo = leerJSON(rutas.palabras, null);
  let resultado;
  let metodo;
  if (crudo && !estimar) {
    const palabras = normalizarPalabrasVoz(crudo.palabras ?? crudo.words ?? crudo);
    if (!palabras.length) throw new Error("palabras.json no tiene palabras con tiempos.");
    resultado = sincronizar({ escenas: video.escenas, palabrasVoz: palabras, duracionSeg: duracionAudio ?? undefined });
    metodo = crudo.origen === "elevenlabs-api-alineacion" ? "alineacion-api" : "transcripcion";
  } else {
    if (!duracionAudio) throw new Error("No hay palabras.json ni audio para estimar. Primero hace falta la narración.");
    resultado = sincronizarEstimado({ escenas: video.escenas, duracionSeg: duracionAudio });
    metodo = "estimado";
  }
  const salida = {
    hash: est.hash,
    metodo,
    duracionSeg: resultado.duracionSeg,
    escenas: resultado.escenas,
    subtitulos: resultado.subtitulos,
    calidad: resultado.calidad,
  };
  escribirJSON(rutas.sincronia, salida);
  return salida;
};

const esPrincipal = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop());
if (esPrincipal) {
  const { opciones, sueltos } = argumentos();
  let nombre;
  try {
    nombre = resolverProduccion(sueltos[0]);
  } catch (e) {
    fallar(e.message);
  }
  try {
    const s = sincronizarProduccion(rutasVideo(nombre), { estimar: Boolean(opciones.estimar) });
    console.log(`\n✔ Sincronía (${s.metodo}) · voz ${s.duracionSeg.toFixed(2)} s · coincidencia ${s.calidad.cobertura}%`);
    s.escenas.forEach((e, i) => console.log(`  ${i + 1}. ${e.id.padEnd(16)} ${e.inicioSeg.toFixed(2)}s → ${e.finSeg.toFixed(2)}s`));
    console.log("");
  } catch (e) {
    fallar(e.message);
  }
}
