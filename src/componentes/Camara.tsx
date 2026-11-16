import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

// Acercamiento/alejamiento suave hacia un punto (foco en px de la composición).
// `tramos`: [frameLocal, escala] en orden. Ej: [[0, 1], [40, 1], [60, 1.6]]
export const Camara: React.FC<{
  foco: [number, number];
  tramos: [number, number][];
  deriva?: number; // pequeño desplazamiento continuo para dar vida (px por segundo)
  children: React.ReactNode;
}> = ({ foco, tramos, deriva = 0, children }) => {
  const frame = useCurrentFrame();
  const entradas = tramos.map((t) => t[0]);
  const escalas = tramos.map((t) => t[1]);
  const escala =
    tramos.length >= 2
      ? interpolate(frame, entradas, escalas, {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        })
      : (escalas[0] ?? 1);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transformOrigin: `${foco[0]}px ${foco[1]}px`,
        scale: String(escala),
        translate: `0px ${(-frame * deriva) / 30}px`,
      }}
    >
      {children}
    </div>
  );
};
