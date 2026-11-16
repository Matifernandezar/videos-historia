// Convierte escenas + sincronía (duración real de la voz) en frames.
// Sin narración todavía, estima la duración por cantidad de palabras para poder previsualizar.
import type { Caption } from "@remotion/captions";
import type { Escena, Sincronia } from "./tipos";
import { palabrasVisibles } from "./texto";

export const PALABRAS_POR_SEG_ESTIMADO = 2.6;
export const COLA_FINAL_SEG = 0.9; // respiro al final, después de la última palabra
export const MIN_ESCENA_SEG = 1.6;

export type EscenaEnTiempo = {
  id: string;
  desde: number; // frame global
  duracion: number; // frames
};

export type LineaDeTiempo = {
  total: number;
  escenas: EscenaEnTiempo[];
  subtitulos: Caption[];
  origen: "audio" | "estimado";
};

const estimarSegundos = (texto: string) =>
  Math.max(MIN_ESCENA_SEG, palabrasVisibles(texto).length / PALABRAS_POR_SEG_ESTIMADO + 0.35);

const subtitulosEstimados = (escenas: Escena[]): Caption[] => {
  const salida: Caption[] = [];
  let t = 0;
  for (const e of escenas) {
    const dur = estimarSegundos(e.narracion);
    const palabras = palabrasVisibles(e.narracion);
    const util = dur - 0.35;
    const letras = palabras.reduce((a, p) => a + p.length + 1, 0) || 1;
    let cursor = t;
    palabras.forEach((p, i) => {
      const d = (util * (p.length + 1)) / letras;
      salida.push({
        text: (i === 0 && salida.length === 0 ? "" : " ") + p,
        startMs: Math.round(cursor * 1000),
        endMs: Math.round((cursor + d) * 1000),
        timestampMs: Math.round((cursor + d / 2) * 1000),
        confidence: null,
      });
      cursor += d;
    });
    t += dur;
  }
  return salida;
};

export const calcularLineaDeTiempo = (
  escenas: Escena[],
  sincronia: Sincronia | null | undefined,
  fps: number,
): LineaDeTiempo => {
  if (sincronia && sincronia.escenas.length === escenas.length) {
    const total = Math.ceil((sincronia.duracionSeg + COLA_FINAL_SEG) * fps);
    const inicios = sincronia.escenas.map((s, i) => (i === 0 ? 0 : Math.round((s.inicioSeg + (escenas[i].desfaseInicioSeg ?? 0)) * fps)));
    const salida: EscenaEnTiempo[] = escenas.map((e, i) => {
      const desde = inicios[i];
      const hasta = i + 1 < inicios.length ? inicios[i + 1] : total;
      return { id: e.id, desde, duracion: Math.max(1, hasta - desde) };
    });
    return { total, escenas: salida, subtitulos: sincronia.subtitulos, origen: "audio" };
  }

  let desde = 0;
  const salida: EscenaEnTiempo[] = escenas.map((e) => {
    const duracion = Math.round(estimarSegundos(e.narracion) * fps);
    const item = { id: e.id, desde, duracion };
    desde += duracion;
    return item;
  });
  const total = desde + Math.round(COLA_FINAL_SEG * fps);
  if (salida.length > 0) {
    salida[salida.length - 1].duracion += Math.round(COLA_FINAL_SEG * fps);
  }
  return { total: Math.max(1, total), escenas: salida, subtitulos: subtitulosEstimados(escenas), origen: "estimado" };
};
