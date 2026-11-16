import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

// Barra vertical que crece hasta `valor` (0–100).
export const Barra: React.FC<{ valor: number; color: string; desde?: number; alto?: number; ancho?: number }> = ({
  valor,
  color,
  desde = 0,
  alto = 300,
  ancho = 120,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [desde, desde + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const v = Math.max(0, Math.min(100, valor));
  return (
    <div style={{ width: ancho, height: alto, borderRadius: 24, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
      <div style={{ width: "100%", height: `${v * p}%`, borderRadius: 24, background: color, boxShadow: `0 0 30px ${color}55` }} />
    </div>
  );
};
