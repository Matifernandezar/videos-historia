import React, { createContext, useContext, useMemo } from "react";
import type { Caption } from "@remotion/captions";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { Disparador } from "./tipos";
import { normalizar } from "./texto";

// ---------- Narración global (para animar la boca del personaje) ----------
type Intervalo = { desde: number; hasta: number };
const NarracionContext = createContext<Intervalo[]>([]);

export const ProveedorNarracion: React.FC<{
  subtitulos: Caption[];
  children: React.ReactNode;
}> = ({ subtitulos, children }) => {
  const { fps } = useVideoConfig();
  const intervalos = useMemo(
    () =>
      subtitulos.map((c) => ({
        desde: Math.round((c.startMs / 1000) * fps),
        hasta: Math.round((c.endMs / 1000) * fps),
      })),
    [subtitulos, fps],
  );
  return <NarracionContext.Provider value={intervalos}>{children}</NarracionContext.Provider>;
};

// ---------- Escena actual ----------
type PalabraLocal = { norm: string; desde: number; hasta: number };
type ValorEscena = { inicio: number; duracion: number; palabras: PalabraLocal[] };
const EscenaContext = createContext<ValorEscena>({ inicio: 0, duracion: 1, palabras: [] });

export const ProveedorEscena: React.FC<{
  inicio: number;
  duracion: number;
  subtitulos: Caption[];
  children: React.ReactNode;
}> = ({ inicio, duracion, subtitulos, children }) => {
  const { fps } = useVideoConfig();
  const valor = useMemo<ValorEscena>(() => {
    const fin = inicio + duracion;
    const palabras: PalabraLocal[] = [];
    for (const c of subtitulos) {
      const d = Math.round((c.startMs / 1000) * fps);
      if (d >= inicio && d < fin) {
        palabras.push({
          norm: normalizar(c.text),
          desde: d - inicio,
          hasta: Math.round((c.endMs / 1000) * fps) - inicio,
        });
      }
    }
    return { inicio, duracion, palabras };
  }, [inicio, duracion, subtitulos, fps]);
  return <EscenaContext.Provider value={valor}>{children}</EscenaContext.Provider>;
};

export const useEscena = () => useContext(EscenaContext);

const coincide = (palabra: string, clave: string) =>
  palabra === clave || (palabra.startsWith(clave) && palabra.length - clave.length <= 3);

// Frame local (dentro de la escena) en el que se dice la palabra disparadora.
export const useDisparador = (d: Disparador | undefined, fraccionPorDefecto = 0): number => {
  const { duracion, palabras } = useEscena();
  return useMemo(() => {
    const respaldo = Math.round(
      Math.min(0.95, Math.max(0, d?.entraEnFraccion ?? fraccionPorDefecto)) * duracion,
    );
    if (!d?.entraEn) return respaldo;
    const claves = normalizar(d.entraEn).split(" ").filter(Boolean);
    if (claves.length === 0) return respaldo;
    for (let i = 0; i + claves.length <= palabras.length; i++) {
      const ok = claves.every((c, j) => {
        const partes = palabras[i + j].norm.split(" ");
        return partes.some((p) => coincide(p, c));
      });
      if (ok) return Math.max(0, palabras[i].desde - 3); // aparece un pelín antes
    }
    return respaldo;
  }, [d?.entraEn, d?.entraEnFraccion, fraccionPorDefecto, duracion, palabras]);
};

// Apertura de boca 0..1 según si la voz está diciendo una palabra en este frame.
export const useAperturaBoca = (forzar?: boolean): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { inicio } = useEscena();
  const intervalos = useContext(NarracionContext);
  const g = frame + inicio;
  const periodo = Math.max(3, Math.round(fps * 0.14));
  if (forzar) {
    return Math.abs(Math.sin((Math.PI * g) / periodo)) * (0.55 + 0.45 * Math.abs(Math.sin(g * 0.37)));
  }
  for (const it of intervalos) {
    if (g >= it.desde && g < it.hasta) {
      return Math.abs(Math.sin((Math.PI * (g - it.desde + 1)) / periodo)) * 0.9 + 0.1;
    }
    if (it.desde > g) break;
  }
  return 0;
};
