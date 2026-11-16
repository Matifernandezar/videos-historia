// Exporta los subtítulos del video a SRT (mismas páginas que se ven en pantalla: 1–2 líneas,
// cortes en puntuación y pausas, con los reemplazos de video.json, p. ej. "técton" → "tékton").
// Uso: node scripts/exportar-srt.mjs <video>
// Con voz vigente y sincronía: escribe recursos/subtitulos.srt (tiempos reales del audio).
// Sin voz: escribe recursos/subtitulos.estimado.srt (tiempos estimados, solo para revisar).
import fs from "node:fs";
import path from "node:path";
import { argumentos, fallar, leerCanal, leerJSON, resolverProduccion, rutasVideo } from "./lib/comun.mjs";
import { construirProps } from "./lib/render.mjs";

const MAX_CARACTERES = 24;
const MAX_PALABRAS = 5;
const PAUSA_CORTE_MS = 550;
const RETENCION_MS = 350;
const MAX_LINEA = 26; // caracteres por línea en el archivo SRT

const limpiar = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ ]/g, "").trim();

const aplicarReemplazos = (subs, reemplazos = []) => {
  if (!reemplazos.length) return subs;
  const salida = [];
  for (let i = 0; i < subs.length; i++) {
    let hecho = false;
    for (const r of reemplazos) {
      const partes = limpiar(r.de).split(" ").filter(Boolean);
      const tramo = subs.slice(i, i + partes.length);
      if (tramo.length === partes.length && tramo.every((c, j) => limpiar(c.text) === partes[j])) {
        const signo = tramo[tramo.length - 1].text.trim().match(/[^\p{L}\p{N}]+$/u)?.[0] ?? "";
        const inicio = subs[i].text.trim().match(/^[^\p{L}\p{N}]+/u)?.[0] ?? "";
        salida.push({ ...tramo[0], text: " " + inicio + r.a + signo, endMs: tramo[tramo.length - 1].endMs });
        i += partes.length - 1;
        hecho = true;
        break;
      }
    }
    if (!hecho) salida.push(subs[i]);
  }
  return salida;
};

// Igual que src/componentes/Subtitulos.tsx → paginarSubtitulos.
const paginar = (subs) => {
  const paginas = [];
  let actual = null;
  let largo = 0;
  subs.forEach((c, i) => {
    const texto = c.text.trim();
    if (!texto) return;
    const previo = subs[i - 1];
    const pausa = previo ? c.startMs - previo.endMs : 0;
    const lleno = actual && (largo + texto.length + 1 > MAX_CARACTERES || actual.palabras.length >= MAX_PALABRAS);
    if (!actual || lleno || pausa > PAUSA_CORTE_MS) {
      if (actual) paginas.push(actual);
      actual = { desdeMs: c.startMs, hastaMs: c.endMs, palabras: [] };
      largo = 0;
    }
    actual.palabras.push(texto);
    actual.hastaMs = c.endMs;
    largo += texto.length + 1;
    if (/[.!?…;:»]$/.test(texto) || (/,$/.test(texto) && largo > MAX_CARACTERES * 0.5)) {
      paginas.push(actual);
      actual = null;
    }
  });
  if (actual) paginas.push(actual);
  return paginas.map((p, i) => {
    const sig = paginas[i + 1];
    return { ...p, hastaMs: sig ? Math.min(sig.desdeMs, p.hastaMs + RETENCION_MS) : p.hastaMs + RETENCION_MS };
  });
};

// Divide el texto en dos líneas equilibradas si hace falta.
const enLineas = (palabras) => {
  const texto = palabras.join(" ");
  if (texto.length <= MAX_LINEA) return texto;
  let mejor = null;
  for (let k = 1; k < palabras.length; k++) {
    const a = palabras.slice(0, k).join(" ");
    const b = palabras.slice(k).join(" ");
    const dif = Math.abs(a.length - b.length);
    if (!mejor || dif < mejor.dif) mejor = { a, b, dif };
  }
  return `${mejor.a}\n${mejor.b}`;
};

const tiempo = (ms) => {
  const t = Math.max(0, Math.round(ms));
  const h = String(Math.floor(t / 3600000)).padStart(2, "0");
  const m = String(Math.floor((t % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((t % 60000) / 1000)).padStart(2, "0");
  return `${h}:${m}:${s},${String(t % 1000).padStart(3, "0")}`;
};

// Estimación sin audio (misma regla que src/video/linea-de-tiempo.ts).
const estimados = (escenas) => {
  const salida = [];
  let t = 0;
  for (const e of escenas) {
    const palabras = e.narracion.replace(/\*/g, "").split(/\s+/).filter(Boolean);
    const dur = Math.max(1.6, palabras.length / 2.6 + 0.35);
    const util = dur - 0.35;
    const letras = palabras.reduce((a, p) => a + p.length + 1, 0) || 1;
    let cursor = t;
    for (const p of palabras) {
      const d = (util * (p.length + 1)) / letras;
      salida.push({ text: " " + p, startMs: cursor * 1000, endMs: (cursor + d) * 1000, escena: e.id });
      cursor += d;
    }
    t += dur;
  }
  return salida;
};

export const exportarSRT = (rutas) => {
  const video = leerJSON(rutas.video);
  const { props } = construirProps(rutas, video, leerCanal());
  const real = !!props.sincronia;
  let subs = real ? props.sincronia.subtitulos : estimados(video.escenas);
  // Escenas con subtítulos ocultos en pantalla también van al SRT (accesibilidad): se exportan todas.
  subs = aplicarReemplazos(subs, video.reemplazosSubtitulos);
  const paginas = paginar(subs);
  const srt = paginas.map((p, i) => `${i + 1}\n${tiempo(p.desdeMs)} --> ${tiempo(p.hastaMs)}\n${enLineas(p.palabras)}\n`).join("\n");
  const archivo = path.join(rutas.recursos, real ? "subtitulos.srt" : "subtitulos.estimado.srt");
  fs.writeFileSync(archivo, srt, "utf8");
  if (real) fs.rmSync(path.join(rutas.recursos, "subtitulos.estimado.srt"), { force: true });
  return { archivo, real, bloques: paginas.length };
};

const esPrincipal = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop());
if (esPrincipal) {
  const { sueltos } = argumentos();
  if (!sueltos[0]) fallar("Uso: node scripts/exportar-srt.mjs <video>");
  const rutas = rutasVideo(resolverProduccion(sueltos[0]));
  const r = exportarSRT(rutas);
  console.log(`✔ ${path.relative(process.cwd(), r.archivo)} (${r.bloques} bloques${r.real ? ", tiempos reales de la voz" : ", tiempos ESTIMADOS: falta la narración"})`);
}
