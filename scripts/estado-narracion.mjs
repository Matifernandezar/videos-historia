// Dice si la narración guardada sirve (mismo texto + voz + modelo) o hay que generarla.
// También deja en recursos/narracion.texto.txt el texto EXACTO que se manda a ElevenLabs.
// Uso: npm run narracion:estado -- <video>   (agregar --json para salida legible por máquina)
import fs from "node:fs";
import { argumentos, contarPalabras, estadoNarracion, fallar, leerCanal, leerJSON, resolverProduccion, rutasVideo } from "./lib/comun.mjs";

const { opciones, sueltos } = argumentos();
let nombre;
try {
  nombre = resolverProduccion(sueltos[0]);
} catch (e) {
  fallar(e.message);
}
const rutas = rutasVideo(nombre);
const video = leerJSON(rutas.video);
const canal = leerCanal();
const est = estadoNarracion(rutas, video, canal);
fs.mkdirSync(rutas.recursos, { recursive: true });
fs.writeFileSync(rutas.textoNarracion, est.texto + "\n", "utf8");

const palabras = contarPalabras(est.texto);
const MENSAJE = {
  "sin-voz": "Falta elegir la voz del canal (config/canal.json → voz.voiceId).",
  vigente: "VIGENTE: reutilizar el audio guardado. No hace falta generar ni gastar créditos.",
  "pendiente-descarga": "Generada pero falta descargarla: se baja sola al producir (o npm run narracion:descargar).",
  desactualizada: "DESACTUALIZADA: el texto, la voz o el modelo cambiaron. Generar de nuevo.",
  falta: "FALTA: todavía no se generó la narración.",
};
const salida = {
  video: nombre,
  estado: est.estado,
  hash: est.hash,
  voz: est.voz,
  caracteres: est.texto.length,
  palabras,
  segundosEstimados: Math.round(palabras / 2.6),
  hashGuardado: est.meta?.hash ?? null,
  duracionGuardadaSeg: est.meta?.duracionSeg ?? null,
};
if (opciones.json) {
  console.log(JSON.stringify(salida, null, 2));
} else {
  console.log(`\nNarración de ${nombre}`);
  console.log(`  Texto: ${salida.caracteres} caracteres, ${palabras} palabras (≈ ${salida.segundosEstimados} s)`);
  console.log(`  Voz: ${est.voz.nombre ?? "(sin elegir)"} ${est.voz.voiceId ?? ""} · modelo ${est.voz.modelo}`);
  console.log(`  Hash actual: ${est.hash}${est.meta?.hash ? ` · guardado: ${est.meta.hash}` : ""}`);
  console.log(`  → ${MENSAJE[est.estado]}`);
  console.log(`  Texto exacto en: producciones/${nombre}/recursos/narracion.texto.txt\n`);
}
