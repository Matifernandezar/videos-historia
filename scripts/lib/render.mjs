// Armado de props y llamadas al CLI de Remotion (render de cuadros de revisión y del MP4).
import fs from "node:fs";
import path from "node:path";
import { ejecutar, escribirJSON, estadoNarracion, leerJSON, sondear } from "./comun.mjs";

// Misma lógica que src/video/linea-de-tiempo.ts (para elegir cuadros de revisión).
const PALABRAS_POR_SEG = 2.6;
const COLA = 0.9;
const MIN_ESCENA = 1.6;
export const lineaDeTiempo = (video, sincronia, fps) => {
  if (sincronia && sincronia.escenas?.length === video.escenas.length) {
    const total = Math.ceil((sincronia.duracionSeg + COLA) * fps);
    const inicios = sincronia.escenas.map((s, i) => (i === 0 ? 0 : Math.round((s.inicioSeg + (video.escenas[i].desfaseInicioSeg ?? 0)) * fps)));
    return { total, escenas: inicios.map((d, i) => ({ id: video.escenas[i].id, desde: d, hasta: i + 1 < inicios.length ? inicios[i + 1] : total })) };
  }
  let d = 0;
  const escenas = video.escenas.map((e) => {
    const n = String(e.narracion ?? "").split(/\s+/).filter(Boolean).length;
    const dur = Math.round(Math.max(MIN_ESCENA, n / PALABRAS_POR_SEG + 0.35) * fps);
    const item = { id: e.id, desde: d, hasta: d + dur };
    d += dur;
    return item;
  });
  const total = d + Math.round(COLA * fps);
  escenas[escenas.length - 1].hasta = total;
  return { total, escenas };
};

// Pausas dramáticas: `video.pausas = [{ enSeg, duracionSeg }]` (tiempos de la voz original).
// Corre todo lo que viene después (subtítulos y escenas) y arma los tramos de audio para reproducir
// la narración en partes, con silencio entre ellas. Una pausa en el final alarga la cola.
export const aplicarPausas = (sinc, pausas) => {
  const lista = [...pausas].filter((p) => p.duracionSeg > 0).sort((a, b) => a.enSeg - b.enSeg);
  const correr = (seg) => seg + lista.filter((p) => seg >= p.enSeg).reduce((a, p) => a + p.duracionSeg, 0);
  const correrMs = (ms) => Math.round(correr(ms / 1000) * 1000);
  const total = lista.reduce((a, p) => a + p.duracionSeg, 0);
  const sincronia = {
    ...sinc,
    duracionSeg: sinc.duracionSeg + total,
    escenas: sinc.escenas.map((e, i) => ({
      ...e,
      inicioSeg: i === 0 ? 0 : correr(e.inicioSeg),
      finSeg: correr(e.finSeg),
    })),
    subtitulos: sinc.subtitulos.map((c) => ({
      ...c,
      startMs: correrMs(c.startMs),
      endMs: correrMs(c.endMs),
      timestampMs: c.timestampMs == null ? c.timestampMs : correrMs(c.timestampMs),
    })),
  };
  const cortes = [0, ...lista.map((p) => p.enSeg).filter((s) => s < sinc.duracionSeg), sinc.duracionSeg + 30];
  const segmentosAudio = cortes.slice(0, -1).map((desde, i) => ({ desdeSeg: desde, hastaSeg: cortes[i + 1], enSeg: correr(desde) }));
  return { sincronia, segmentosAudio };
};

export const construirProps = (rutas, video, canal, { sinAudio = false } = {}) => {
  const est = estadoNarracion(rutas, video, canal);
  const sinc = leerJSON(rutas.sincronia, null);
  const usarAudio = !sinAudio && est.estado === "vigente";
  const props = {
    ...video,
    sincronia: usarAudio && sinc && sinc.hash === est.hash ? sinc : null,
    audio: usarAudio ? "narracion.mp3" : null,
  };
  if (props.sincronia && Array.isArray(video.pausas) && video.pausas.length) {
    Object.assign(props, aplicarPausas(props.sincronia, video.pausas));
  }
  delete props.voz;
  escribirJSON(rutas.props, props);
  return { props, est };
};

// Cuadros de revisión: primero, mitad y final de cada escena.
export const cuadrosRevision = (linea) => {
  const set = new Set([0]);
  for (const e of linea.escenas) {
    const dur = e.hasta - e.desde;
    set.add(Math.min(e.hasta - 1, e.desde + Math.round(dur * 0.15)));
    set.add(e.desde + Math.round(dur * 0.55));
    set.add(Math.max(e.desde, e.hasta - 4));
  }
  return [...set].filter((f) => f >= 0 && f < linea.total).sort((a, b) => a - b);
};

// Margen amplio para abrir el navegador interno y cargar el proyecto (la primera vez en Windows puede tardar).
export const TIEMPO_ESPERA_MS = 120000;

export const renderCuadros = async ({ composicion, propsArchivo, publicDir, frames, carpeta, log = "warn" }) => {
  fs.rmSync(carpeta, { recursive: true, force: true });
  fs.mkdirSync(carpeta, { recursive: true });
  const args = ["remotion", "render", "src/index.ts", composicion, carpeta, `--frames=${frames.join(",")}`, "--image-format=png", `--log=${log}`, `--timeout=${TIEMPO_ESPERA_MS}`];
  if (propsArchivo) args.push(`--props=${propsArchivo}`);
  if (publicDir) args.push(`--public-dir=${publicDir}`);
  const r = await ejecutar("npx", args);
  const archivos = fs.existsSync(carpeta) ? fs.readdirSync(carpeta).filter((f) => f.endsWith(".png")).sort() : [];
  escribirJSON(path.join(carpeta, "indice.json"), { composicion, frames, archivos });
  return { ok: r.codigo === 0 && archivos.length > 0, archivos };
};

export const renderVideo = async ({ composicion, propsArchivo, publicDir, salida, canal }) => {
  fs.mkdirSync(path.dirname(salida), { recursive: true });
  const c = canal.render;
  const args = [
    "remotion", "render", "src/index.ts", composicion, salida,
    `--codec=${c.codec}`, `--crf=${c.crf}`, `--x264-preset=${c.x264Preset}`, `--jpeg-quality=${c.jpegCalidad}`,
    `--timeout=${TIEMPO_ESPERA_MS}`,
  ];
  if (propsArchivo) args.push(`--props=${propsArchivo}`);
  if (publicDir) args.push(`--public-dir=${publicDir}`);
  const inicio = Date.now();
  const r = await ejecutar("npx", args);
  return { ok: r.codigo === 0 && fs.existsSync(salida), segundos: Math.round((Date.now() - inicio) / 1000) };
};

// Comprueba el MP4 real: tamaño, fps, duración, pista de audio.
export const inspeccionarMP4 = async (archivo, esperado) => {
  const info = await sondear(archivo);
  const bytes = fs.existsSync(archivo) ? fs.statSync(archivo).size : 0;
  if (!info) return { verificado: false, bytes, nota: "No se pudo leer el MP4 con ffprobe (el archivo existe)." };
  const v = info.streams?.find((s) => s.codec_type === "video");
  const a = info.streams?.find((s) => s.codec_type === "audio");
  const [n, d] = String(v?.r_frame_rate ?? "0/1").split("/").map(Number);
  const fps = d ? n / d : 0;
  const duracion = Number(info.format?.duration ?? 0);
  const problemas = [];
  if (esperado.ancho && v?.width !== esperado.ancho) problemas.push(`ancho ${v?.width} (esperado ${esperado.ancho})`);
  if (esperado.alto && v?.height !== esperado.alto) problemas.push(`alto ${v?.height} (esperado ${esperado.alto})`);
  if (esperado.fps && Math.abs(fps - esperado.fps) > 0.01) problemas.push(`fps ${fps} (esperado ${esperado.fps})`);
  if (esperado.duracion && Math.abs(duracion - esperado.duracion) > 0.15) problemas.push(`duración ${duracion.toFixed(2)} s (esperado ${esperado.duracion.toFixed(2)} s)`);
  if (esperado.audio && !a) problemas.push("no tiene pista de audio");
  return { verificado: true, ok: problemas.length === 0, problemas, ancho: v?.width, alto: v?.height, fps, duracion, audio: Boolean(a), bytes };
};
