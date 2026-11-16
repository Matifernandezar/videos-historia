import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLOR, type Acento } from "../marca/tema";

// Fondo oscuro del canal: degradé azul tinta, resplandor del color de la escena,
// grilla de puntos que deriva muy lento y viñeta. Todo controlado por frame.
export const Fondo: React.FC<{ acento?: Acento; matiz?: boolean; brillo?: number }> = ({ acento = "celeste", matiz = false, brillo = 0.16 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const base = matiz ? COLOR.fondoMatiz : COLOR.fondo;
  const deriva = (frame * 0.35) % 48;
  const color = COLOR[acento];
  return (
    <AbsoluteFill style={{ backgroundColor: base }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 55% at 50% 38%, ${COLOR.fondoAlto} 0%, ${base} 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 52%, ${color} 0%, transparent 55%)`,
          opacity: brillo,
        }}
      />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: 0.09 }}>
        <defs>
          <pattern id="puntos" width={48} height={48} patternUnits="userSpaceOnUse" patternTransform={`translate(0 ${deriva})`}>
            <circle cx={24} cy={24} r={2.4} fill="#FFFFFF" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#puntos)" />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 55%, rgba(0,0,0,0.5) 100%)" }} />
    </AbsoluteFill>
  );
};
