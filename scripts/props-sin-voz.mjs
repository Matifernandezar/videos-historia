// Arma .build/props.json SIN narración, con tiempos estimados al ritmo real de la voz del canal
// (≈ 0,437 s por palabra), para revisar la animación antes de gastar créditos de voz.
// Uso: node scripts/props-sin-voz.mjs <video> [--seg-por-palabra 0.437]
import { argumentos, escribirJSON, fallar, leerJSON, resolverProduccion, rutasVideo } from "./lib/comun.mjs";
import { sincronizarEstimado } from "./lib/alinear.mjs";
import { aplicarPausas } from "./lib/render.mjs";

const { opciones, sueltos } = argumentos();
try {
  const rutas = rutasVideo(resolverProduccion(sueltos[0]));
  const video = leerJSON(rutas.video);
  const porPalabra = Number(opciones["seg-por-palabra"] ?? 0.437);
  const palabras = video.escenas.reduce((a, e) => a + String(e.narracion ?? "").split(/\s+/).filter(Boolean).length, 0);
  const sinc = { hash: "sin-voz", metodo: "estimado", ...sincronizarEstimado({ escenas: video.escenas, duracionSeg: palabras * porPalabra + 0.4 }) };
  const props = { ...video, sincronia: sinc, audio: null };
  if (Array.isArray(video.pausas) && video.pausas.length) Object.assign(props, aplicarPausas(sinc, video.pausas));
  delete props.voz;
  escribirJSON(rutas.props, props);
  const total = props.sincronia.duracionSeg + 0.9;
  console.log(`✔ props sin voz · ${palabras} palabras · voz estimada ${sinc.duracionSeg.toFixed(1)} s · video ${total.toFixed(1)} s (${Math.ceil(total * 30)} frames)`);
  props.sincronia.escenas.forEach((e, i) => console.log(`  ${i + 1}. ${e.id.padEnd(12)} ${e.inicioSeg.toFixed(2)}s (f ${Math.round(e.inicioSeg * 30)}) → ${e.finSeg.toFixed(2)}s`));
} catch (e) {
  fallar(e.message);
}
