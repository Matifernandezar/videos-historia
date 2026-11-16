// Descarga la narración generada con ElevenLabs (enlace firmado guardado por Claude en
// recursos/narracion.pendiente.json) y registra su huella para reutilizarla.
// Uso: npm run narracion:descargar -- <video>
import fs from "node:fs";
import { argumentos, duracionMP3, escribirJSON, fallar, leerJSON, resolverProduccion, rutasVideo } from "./lib/comun.mjs";

export const descargarPendiente = async (rutas) => {
  const p = leerJSON(rutas.pendiente, null);
  if (!p) return { hecho: false, motivo: "no hay narración pendiente" };
  if (!p.url) throw new Error("narracion.pendiente.json no tiene `url`.");
  const r = await fetch(p.url);
  if (!r.ok) {
    throw new Error(
      `No se pudo descargar la narración (HTTP ${r.status}). Si el enlace venció, pedile a Claude un enlace nuevo de la misma toma (no gasta créditos).`,
    );
  }
  const datos = Buffer.from(await r.arrayBuffer());
  if (datos.length < 2000) throw new Error("El archivo descargado es demasiado chico; no parece un audio.");
  fs.mkdirSync(rutas.recursos, { recursive: true });
  fs.writeFileSync(rutas.audio, datos);
  const duracionSeg = duracionMP3(rutas.audio);
  escribirJSON(rutas.meta, {
    hash: p.hash,
    voiceId: p.voiceId,
    vozNombre: p.vozNombre ?? null,
    modelo: p.modelo,
    origen: p.origen ?? "elevenlabs-mcp",
    flowId: p.flowId ?? null,
    generationId: p.generationId ?? null,
    duracionSeg,
    bytes: datos.length,
    fecha: new Date().toISOString(),
  });
  fs.unlinkSync(rutas.pendiente);
  return { hecho: true, duracionSeg, bytes: datos.length };
};

const esPrincipal = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop());
if (esPrincipal) {
  const { sueltos } = argumentos();
  let nombre;
  try {
    nombre = resolverProduccion(sueltos[0]);
  } catch (e) {
    fallar(e.message);
  }
  try {
    const r = await descargarPendiente(rutasVideo(nombre));
    if (!r.hecho) console.log(`Nada para descargar (${r.motivo}).`);
    else console.log(`✔ Narración guardada: ${r.duracionSeg?.toFixed(2)} s, ${(r.bytes / 1024).toFixed(0)} KB`);
  } catch (e) {
    fallar(e.message);
  }
}
