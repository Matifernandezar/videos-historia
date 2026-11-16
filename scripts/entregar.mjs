// Marca un video como LISTO PARA ENTREGAR (escribe producciones/<video>/entrega.json).
// Al hacer push a GitHub, el flujo "Renderizar y entregar" (GitHub Actions) renderiza el MP4
// y lo deja en la sección Releases del repositorio. No se publica en ninguna red social.
//
// Uso: node scripts/entregar.mjs <video>             marca la entrega (pide voz vigente, sincronía, verificación y cuadros de QA)
//      node scripts/entregar.mjs <video> --rehacer   nueva revisión: vuelve a renderizar aunque video.json no cambió
//                                                    (por ejemplo, después de arreglar un componente en src/)
//      node scripts/entregar.mjs <video> --estado    consulta en GitHub si el MP4 ya está listo
import fs from "node:fs";
import path from "node:path";
import { argumentos, escribirJSON, estadoNarracion, fallar, leerCanal, leerJSON, resolverProduccion, rutasVideo } from "./lib/comun.mjs";
import { etiquetaEntrega, ghApi, huellaEntrega, repositorio, tituloYoutube } from "./lib/entrega.mjs";
import { imprimirVerificacion, verificarProduccion } from "./lib/verificacion.mjs";

const { opciones, sueltos } = argumentos();
let nombre;
try {
  nombre = resolverProduccion(sueltos[0]);
} catch (e) {
  fallar(e.message);
}
const rutas = rutasVideo(nombre);

const consultarEstado = async () => {
  const entrega = leerJSON(rutas.entrega, null);
  if (!entrega) fallar(`${nombre} todavía no está marcado para entrega (node scripts/entregar.mjs ${nombre}).`);
  const repo = await repositorio();
  if (!repo) fallar("No encontré el repositorio de GitHub (git remote origin).");
  const etiqueta = etiquetaEntrega(nombre, entrega);
  const rel = await ghApi(`repos/${repo}/releases/tags/${etiqueta}`);
  if (rel.ok && rel.datos?.html_url) {
    const mp4 = (rel.datos.assets ?? []).find((a) => a.name.endsWith(".mp4"));
    console.log(`✔ MP4 listo en GitHub: ${rel.datos.html_url}`);
    if (mp4) console.log(`  ${mp4.name} · ${(mp4.size / 1048576).toFixed(1)} MB · descarga: ${mp4.browser_download_url}`);
    return;
  }
  const runs = await ghApi(`repos/${repo}/actions/runs?per_page=10`);
  const run = (runs.datos?.workflow_runs ?? []).find((r) => r.name === "Renderizar y entregar");
  if (run) console.log(`… Todavía no está el MP4. Último render: ${run.status}${run.conclusion ? ` (${run.conclusion})` : ""} · ${run.html_url}`);
  else console.log(`… Todavía no está el MP4 (${etiqueta}). ¿Ya hiciste push de entrega.json?${runs.ok ? "" : ` (GitHub: ${runs.error.slice(0, 160)})`}`);
};

if (opciones.estado) {
  await consultarEstado();
  process.exit(0);
}

const video = leerJSON(rutas.video);
const canal = leerCanal();
const est = estadoNarracion(rutas, video, canal);
if (est.estado !== "vigente") fallar(`La narración está ${est.estado.toUpperCase()}: generala (node scripts/narrar-api.mjs ${nombre}) antes de entregar.`);
const sinc = leerJSON(rutas.sincronia, null);
if (!sinc || sinc.hash !== est.hash) fallar(`Falta la sincronía con la voz actual: node scripts/sincronizar.mjs ${nombre}`);

const ver = verificarProduccion(rutas, video, canal, {});
imprimirVerificacion(ver, nombre);
if (ver.errores.length) fallar("Corregí los errores de verificación antes de entregar.");

const indiceQa = path.join(rutas.qa, "cuadros", "indice.json");
if (!fs.existsSync(indiceQa) && !opciones["sin-qa"]) {
  fallar(`Primero generá y revisá los cuadros de QA: node scripts/renderizar.mjs ${nombre} --solo-qa`);
}

const previa = leerJSON(rutas.entrega, null);
let revision = previa?.revision ?? 1;
if (opciones.rehacer && previa) revision += 1;
const huella = huellaEntrega(rutas, video, canal, revision);
const entrega = {
  video: nombre,
  revision,
  huella,
  titulo: tituloYoutube(rutas) ?? video.titulo ?? nombre,
  formato: video.formato === "largo" ? "largo" : "short",
  narracion: est.hash,
  voz: est.voz.nombre ?? est.voz.voiceId,
  duracionVozSeg: sinc.duracionSeg,
  fecha: new Date().toISOString(),
};
const etiqueta = etiquetaEntrega(nombre, entrega);
if (previa && previa.huella === huella) {
  console.log(`\n= ${nombre} ya estaba marcado con este mismo contenido (${etiqueta}).`);
  console.log(`  Para renderizar de nuevo sin cambios en video.json: node scripts/entregar.mjs ${nombre} --rehacer`);
  process.exit(0);
}
escribirJSON(rutas.entrega, { ...entrega, etiqueta });
console.log(`\n✔ Marcado para entrega: producciones/${nombre}/entrega.json (${etiqueta})`);
console.log("  Siguiente: commit + push. GitHub Actions renderiza el MP4 y lo deja en Releases (no se publica en redes).");
console.log(`  Ver el estado: node scripts/entregar.mjs ${nombre} --estado\n`);
