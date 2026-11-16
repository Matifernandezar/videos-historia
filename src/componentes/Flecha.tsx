import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLOR } from "../marca/tema";

type Punto = [number, number];

// Flecha curva que se dibuja sola entre dos puntos (coordenadas en px de la composición).
export const Flecha: React.FC<{
  de: Punto;
  a: Punto;
  desde?: number; // frame local en que empieza a dibujarse
  duracion?: number;
  curva?: number; // desplazamiento perpendicular del control (px), signo = lado
  color?: string;
  grosor?: number;
  discontinua?: boolean;
}> = ({ de, a, desde = 0, duracion = 14, curva = 80, color = COLOR.tinta, grosor = 12, discontinua = false }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const p = interpolate(frame, [desde, desde + duracion], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (p <= 0) return null;
  const [x1, y1] = de;
  const [x2, y2] = a;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const largo = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / largo) * curva;
  const cy = my + (dx / largo) * curva;
  // Punto y tangente al final del tramo dibujado (para que la punta acompañe).
  const t = p;
  const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
  const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
  const tx = 2 * (1 - t) * (cx - x1) + 2 * t * (x2 - cx);
  const ty = 2 * (1 - t) * (cy - y1) + 2 * t * (y2 - cy);
  const ang = (Math.atan2(ty, tx) * 180) / Math.PI;
  const punta = grosor * 2.6;
  return (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
      <path
        d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
        stroke={color}
        strokeWidth={grosor}
        strokeLinecap="round"
        fill="none"
        pathLength={1}
        strokeDasharray={discontinua ? undefined : 1}
        strokeDashoffset={discontinua ? undefined : 1 - p}
        style={discontinua ? { strokeDasharray: `${grosor * 0.2} ${grosor * 2.2}` } : undefined}
        opacity={discontinua ? Math.min(1, p * 2) : 1}
      />
      <g transform={`translate(${px} ${py}) rotate(${ang})`} opacity={Math.min(1, p * 3)}>
        <path d={`M ${-punta} ${-punta * 0.62} L 2 0 L ${-punta} ${punta * 0.62}`} stroke={color} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  );
};
