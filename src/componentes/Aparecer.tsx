import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Envoltura de entrada/salida controlada por frames (sin CSS animations).
export const Aparecer: React.FC<{
  desde?: number;
  hasta?: number; // frame local en que empieza a salir (opcional)
  tipo?: "pop" | "subir" | "fundido" | "izquierda" | "derecha";
  distancia?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ desde = 0, hasta, tipo = "pop", distancia = 80, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - desde, fps, config: { damping: 14, stiffness: 160, mass: 0.7 } });
  const s = hasta === undefined ? 0 : interpolate(frame, [hasta, hasta + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const v = e * (1 - s);
  const dx = tipo === "izquierda" ? -(1 - e) * distancia : tipo === "derecha" ? (1 - e) * distancia : 0;
  const dy = tipo === "subir" ? (1 - e) * distancia : 0;
  const escala = tipo === "pop" ? 0.4 + 0.6 * e : 1;
  return (
    <div
      style={{
        opacity: frame < desde ? 0 : Math.min(1, v * 1.5),
        translate: `${dx}px ${dy}px`,
        scale: String(escala * (1 - s * 0.15)),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
