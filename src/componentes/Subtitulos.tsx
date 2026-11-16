import React, { useMemo } from "react";
import type { Caption } from "@remotion/captions";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FUENTE_TEXTO } from "../marca/fuentes";

export type PaginaSubtitulo = {
  desdeMs: number;
  hastaMs: number;
  palabras: { texto: string; desdeMs: number; hastaMs: number }[];
};

const MAX_CARACTERES = 24;
const MAX_PALABRAS = 5;
const PAUSA_CORTE_MS = 550;
const RETENCION_MS = 350;

// Agrupa palabras en páginas cortas (1–2 líneas) y corta en puntuación o pausas.
export const paginarSubtitulos = (subs: Caption[], maxCaracteres = MAX_CARACTERES): PaginaSubtitulo[] => {
  const paginas: PaginaSubtitulo[] = [];
  let actual: PaginaSubtitulo | null = null;
  let largo = 0;
  subs.forEach((c, i) => {
    const texto = c.text.trim();
    if (!texto) return;
    const previo = subs[i - 1];
    const pausa = previo ? c.startMs - previo.endMs : 0;
    const lleno = actual && (largo + texto.length + 1 > maxCaracteres || actual.palabras.length >= MAX_PALABRAS);
    if (!actual || lleno || pausa > PAUSA_CORTE_MS) {
      if (actual) paginas.push(actual);
      actual = { desdeMs: c.startMs, hastaMs: c.endMs, palabras: [] };
      largo = 0;
    }
    actual.palabras.push({ texto, desdeMs: c.startMs, hastaMs: c.endMs });
    actual.hastaMs = c.endMs;
    largo += texto.length + 1;
    if (/[.!?…;:]$/.test(texto) || (/,$/.test(texto) && largo > maxCaracteres * 0.5)) {
      paginas.push(actual);
      actual = null;
    }
  });
  if (actual) paginas.push(actual);
  return paginas.map((p, i) => {
    const siguiente = paginas[i + 1];
    const fin = siguiente ? Math.min(siguiente.desdeMs, p.hastaMs + RETENCION_MS) : p.hastaMs + RETENCION_MS;
    return { ...p, hastaMs: fin };
  });
};

// Palabra clave (sin acentos ni puntuación) para comparar con la lista `destacar`.
const clave = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9ñ]/g, "");

const Pagina: React.FC<{ pagina: PaginaSubtitulo; tamano: number; anchoMax: number; destacar?: string[] }> = ({ pagina, tamano, anchoMax, destacar }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = pagina.desdeMs + (frame / fps) * 1000;
  const entrada = interpolate(frame, [0, 4], [0.86, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        maxWidth: anchoMax,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: `0 ${tamano * 0.28}px`,
        scale: String(entrada),
        fontFamily: FUENTE_TEXTO,
        fontWeight: 700,
        fontSize: tamano,
        lineHeight: 1.18,
        textAlign: "center",
      }}
    >
      {pagina.palabras.map((p, i) => {
        // palabras clave: una palabra suelta o una frase de varias ("sí, creo")
        const marcada = !!destacar?.some((d) => {
          const partes = d.split(/\s+/).map(clave).filter(Boolean);
          // una frase que el reemplazo unió en una sola palabra en pantalla ("13 de mayo")
          if (partes.length > 1 && partes.join("") === clave(p.texto)) return true;
          if (partes.length === 1) return partes[0] === clave(p.texto);
          // frase larga partida entre páginas: alcanza con que el tramo visible coincida y toque un borde de la página
          for (let k = 0; k < partes.length; k++) {
            const ini = i - k;
            const a = Math.max(0, ini);
            const b = Math.min(pagina.palabras.length, ini + partes.length);
            // un solo término visible alcanza si es una palabra larga (p. ej. "diecisiete," sola al empezar la página)
            if (b - a < Math.min(2, partes.length) && !(b - a === 1 && partes[a - ini].length >= 7)) continue;
            if (ini < 0 && a !== 0) continue;
            let ok = true;
            for (let j = a; j < b; j++) if (clave(pagina.palabras[j].texto) !== partes[j - ini]) { ok = false; break; }
            if (ok) return true;
          }
          return false;
        });
        // Una sola palabra activa por vez: si dos se solapaban, las dos se agrandaban y se comían el espacio.
        const siguiente = pagina.palabras[i + 1];
        const activa = ms >= p.desdeMs && ms < Math.min(p.hastaMs + 60, siguiente ? siguiente.desdeMs : Infinity);
        const dicha = ms >= p.desdeMs;
        return (
          <span
            key={i}
            style={{
              // Con lista de palabras clave: solo esas van en color; la activa se marca con escala.
              color: destacar ? (marcada ? "#D4AF37" : "#FFFFFF") : activa ? "#D4AF37" : "#FFFFFF",
              opacity: dicha ? 1 : 0.92,
              WebkitTextStroke: `${tamano * 0.16}px rgba(6,10,20,0.92)`,
              paintOrder: "stroke fill",
              textShadow: "0 6px 18px rgba(0,0,0,0.6)",
              scale: activa ? "1.06" : "1",
              display: "inline-block",
            }}
          >
            {p.texto}
          </span>
        );
      })}
    </div>
  );
};

export const Subtitulos: React.FC<{
  subtitulos: Caption[];
  centroY: number | ((ms: number) => number); // fijo o según la escena
  tamano?: number;
  anchoMax?: number;
  destacar?: string[];
}> = ({
  subtitulos,
  centroY,
  tamano = 66,
  anchoMax = 880,
  destacar,
}) => {
  const { fps } = useVideoConfig();
  const paginas = useMemo(() => paginarSubtitulos(subtitulos), [subtitulos]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {paginas.map((p, i) => {
        const desde = Math.round((p.desdeMs / 1000) * fps);
        const dur = Math.max(1, Math.round((p.hastaMs / 1000) * fps) - desde);
        return (
          <Sequence key={i} from={desde} durationInFrames={dur} name={`Subtítulo ${i + 1}`} layout="none">
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: typeof centroY === "number" ? centroY : centroY(p.desdeMs),
                translate: "0px -50%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Pagina pagina={p} tamano={tamano} anchoMax={anchoMax} destacar={destacar} />
            </div>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
