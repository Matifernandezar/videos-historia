// Herramientas compartidas por las escenas animadas a medida.
import React from "react";
import { Audio } from "@remotion/media";
import { Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useAperturaBoca, useDisparador, useEscena } from "../video/contexto";
import { FUENTE_TEXTO } from "../marca/fuentes";

// Frame local (en la escena) en que la voz dice `palabra` (o la fracción de respaldo).
export const useMomento = (palabra: string, fraccion = 0) => useDisparador({ entraEn: palabra, entraEnFraccion: fraccion }, fraccion);

// Frame local en que TERMINA de decirse `palabra` (para gestos que esperan a que acabe).
export const useFinDePalabra = (palabra: string, fraccion = 0) => {
  const inicio = useMomento(palabra, fraccion);
  const { palabras } = useEscena();
  const p = palabras.find((w) => w.desde >= inicio && w.desde <= inicio + 4);
  return p ? p.hasta : inicio + 10;
};

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 0→1 suave entre dos frames.
export const tramo = (frame: number, desde: number, hasta: number, easing = Easing.inOut(Easing.cubic)) =>
  interpolate(frame, [desde, Math.max(desde + 1, hasta)], [0, 1], { ...CLAMP, easing });

// Resorte que arranca en `desde` (0→1, con rebote leve).
export const useResorte = (desde: number, config: { damping?: number; stiffness?: number; mass?: number } = {}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - desde, fps, config: { damping: 14, stiffness: 120, mass: 0.8, ...config } });
};

// Boca: se mueve con la voz solo entre dos frames locales (para que hable un personaje y no otro).
export const useBocaEntre = (desde: number, hasta: number) => {
  const frame = useCurrentFrame();
  const abierta = useAperturaBoca();
  return frame >= desde && frame <= hasta ? abierta : 0;
};

// Efecto de sonido que suena en el frame local `en` (archivos en recursos/sfx/).
export const Sfx: React.FC<{ archivo: string; en: number; volumen?: number }> = ({ archivo, en, volumen = 0.3 }) => (
  <Sequence from={Math.max(0, Math.round(en))} layout="none" name={`sfx ${archivo}`}>
    <Audio src={staticFile(`sfx/${archivo}.wav`)} volume={volumen} />
  </Sequence>
);

// Rótulo tipo píldora (mismo lenguaje visual que las etiquetas del canal).
export const Rotulo: React.FC<{
  texto: string;
  x: number;
  y: number;
  aparece: number;
  color?: string;
  tamano?: number;
  ancla?: "centro" | "izquierda" | "derecha";
}> = ({ texto, x, y, aparece, color = "#B6F23E", tamano = 52, ancla = "centro" }) => {
  const e = useResorte(aparece, { damping: 12 });
  const frame = useCurrentFrame();
  if (frame < aparece) return null;
  const desplazamiento = ancla === "centro" ? "-50%" : ancla === "derecha" ? "-100%" : "0%";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: `${desplazamiento} -50%`,
        scale: String(0.6 + 0.4 * e),
        opacity: Math.min(1, e * 1.5),
        padding: `${tamano * 0.22}px ${tamano * 0.5}px`,
        borderRadius: 999,
        background: "rgba(10,18,32,0.92)",
        border: `${Math.max(3, tamano * 0.07)}px solid ${color}`,
        color: "#F4F7FB",
        fontFamily: FUENTE_TEXTO,
        fontWeight: 800,
        fontSize: tamano,
        letterSpacing: 0.5,
        whiteSpace: "nowrap",
        boxShadow: `0 10px 30px rgba(0,0,0,0.45), 0 0 24px ${color}44`,
      }}
    >
      {texto}
    </div>
  );
};
