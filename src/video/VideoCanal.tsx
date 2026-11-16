// Composición principal: arma el video completo a partir de video.json (+ sincronía con la voz real).
import React, { useMemo } from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, type CalculateMetadataFunction } from "remotion";
import canal from "../../config/canal.json";
import "../marca/fuentes";
import { COLOR } from "../marca/tema";
import { Subtitulos } from "../componentes/Subtitulos";
import { Guias } from "../componentes/Guias";
import { EscenaPorTipo, personajeVisible } from "../escenas";
import { useDisposicion } from "../escenas/disposicion";
import { ProveedorEscena, ProveedorNarracion } from "./contexto";
import { calcularLineaDeTiempo } from "./linea-de-tiempo";
import type { Escena, VideoProps } from "./tipos";
import type { Caption } from "@remotion/captions";
import { normalizar } from "./texto";

// Pequeño "golpe" de cámara al empezar cada escena (marca el corte sin distraer).
const EntradaEscena: React.FC<{ primera: boolean; children: React.ReactNode }> = ({ primera, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        scale: primera ? "1" : String(interpolate(frame, [0, 8], [1.045, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })),
        opacity: primera ? 1 : interpolate(frame, [0, 3], [0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// "te hache ce" → "THC": une las palabras del subtítulo que forman la frase y muestra el reemplazo.
const aplicarReemplazos = (subs: Caption[], reemplazos: { de: string; a: string }[] | undefined): Caption[] => {
  if (!reemplazos?.length) return subs;
  const limpiar = (s: string) => normalizar(s).replace(/[^\p{L}\p{N} ]/gu, "");
  const salida: Caption[] = [];
  for (let i = 0; i < subs.length; i++) {
    let hecho = false;
    for (const r of reemplazos) {
      const partes = limpiar(r.de).split(" ").filter(Boolean);
      const tramo = subs.slice(i, i + partes.length);
      if (tramo.length === partes.length && tramo.every((c, j) => limpiar(c.text) === partes[j])) {
        const ultimo = tramo[tramo.length - 1].text.trim();
        const signo = ultimo.match(/[^\p{L}\p{N}]+$/u)?.[0] ?? "";
        salida.push({ ...tramo[0], text: (subs[i].text.startsWith(" ") ? " " : "") + r.a + signo, endMs: tramo[tramo.length - 1].endMs });
        i += partes.length - 1;
        hecho = true;
        break;
      }
    }
    if (!hecho) salida.push(subs[i]);
  }
  return salida;
};

// Música de fondo con entrada y salida suaves, siempre por debajo de la voz.
const Musica: React.FC<{ archivo: string; volumen: number }> = ({ archivo, volumen }) => {
  const { durationInFrames, fps } = useVideoConfig();
  return (
    <Audio
      src={staticFile(archivo)}
      volume={(f) =>
        volumen *
        interpolate(f, [0, fps * 1.2, durationInFrames - fps * 2.5, durationInFrames - 2], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
};

export const VideoCanal: React.FC<VideoProps> = ({ escenas, sincronia, audio, mostrarSubtitulos = true, mostrarGuias = false, reemplazosSubtitulos, segmentosAudio, musica, destacarSubtitulos }) => {
  const { fps } = useVideoConfig();
  const d = useDisposicion();
  const linea = useMemo(() => calcularLineaDeTiempo(escenas, sincronia, fps), [escenas, sincronia, fps]);
  const subtitulosPantalla = useMemo(() => aplicarReemplazos(linea.subtitulos, reemplazosSubtitulos), [linea.subtitulos, reemplazosSubtitulos]);
  // Subtítulos: entre escenario y cabeza si Lupe está en cuadro; más abajo si no.
  const ySubtitulo = (ms: number) => {
    const f = (ms / 1000) * fps + 1; // un frame de tolerancia: la escena arranca redondeada a su primera palabra
    const i = linea.escenas.findIndex((t) => f >= t.desde && f < t.desde + t.duracion);
    const e = escenas[i < 0 ? escenas.length - 1 : i];
    if (e?.tipo === "animada" && e.subtitulos === "ocultos") return -9999;
    return e && personajeVisible(e) ? d.subtitulosYConPersonaje : d.subtitulosY;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.fondo }}>
      <ProveedorNarracion subtitulos={linea.subtitulos}>
        {escenas.map((e: Escena, i: number) => {
          const t = linea.escenas[i];
          return (
            <Sequence key={e.id} from={t.desde} durationInFrames={t.duracion} name={`${i + 1}. ${e.tipo} · ${e.id}`} premountFor={fps}>
              <ProveedorEscena inicio={t.desde} duracion={t.duracion} subtitulos={linea.subtitulos}>
                <EntradaEscena primera={i === 0 || e.tipo === "animada"}>
                  <EscenaPorTipo escena={e} />
                </EntradaEscena>
              </ProveedorEscena>
            </Sequence>
          );
        })}
      </ProveedorNarracion>
      {audio && segmentosAudio?.length
        ? segmentosAudio.map((s, i) => (
            <Sequence key={`voz-${i}`} from={Math.round(s.enSeg * fps)} name={`Voz ${i + 1}`} layout="none">
              <Audio
                src={staticFile(audio)}
                trimBefore={Math.round(s.desdeSeg * fps)}
                trimAfter={Math.round(s.hastaSeg * fps)}
              />
            </Sequence>
          ))
        : audio
          ? <Audio src={staticFile(audio)} />
          : null}
      {musica?.archivo ? <Musica archivo={musica.archivo} volumen={musica.volumen ?? 0.15} /> : null}
      {mostrarSubtitulos ? (
        <Subtitulos subtitulos={subtitulosPantalla} centroY={ySubtitulo} tamano={d.tamSubtitulo} anchoMax={d.anchoSubtitulo} destacar={destacarSubtitulos} />
      ) : null}
      {mostrarGuias ? <Guias /> : null}
    </AbsoluteFill>
  );
};

// Duración y tamaño según formato y voz real (si ya hay sincronía).
export const calcularMetadatos: CalculateMetadataFunction<VideoProps> = ({ props }) => {
  const f = canal.formatos[props.formato === "largo" ? "largo" : "short"];
  const linea = calcularLineaDeTiempo(props.escenas, props.sincronia, f.fps);
  return {
    durationInFrames: linea.total,
    width: f.ancho,
    height: f.alto,
    fps: f.fps,
    defaultOutName: props.id,
  };
};
