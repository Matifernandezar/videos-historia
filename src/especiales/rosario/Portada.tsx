// Portada vertical: "El rosario de tu abuela y la batalla de Lepanto"
import React from "react";
import { AbsoluteFill } from "remotion";
import { FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { Persona } from "../jesus-12-30/personas";
import { PAL, Textura } from "../jesus-12-30/escenarios";


// Galera simplificada para la portada (silueta sobre el atardecer).
const Galera: React.FC<{ x: number; y: number; s: number; espejo?: boolean }> = ({ x, y, s, espejo }) => (
  <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={520 * s} height={360 * s} viewBox="-260 -300 520 360">
    <g transform={espejo ? "scale(-1 1)" : undefined} fill="#1B2236">
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={-170 + i * 30} y1={8} x2={-190 + i * 30} y2={70} stroke="#1B2236" strokeWidth={5} />
      ))}
      <path d="M -240 -10 L 220 -10 L 260 -40 L 230 20 Q 0 40 -200 20 Z" />
      <rect x={-6} y={-270} width={12} height={262} />
      <path d="M -150 -40 L 120 -260 Q 40 -120 -150 -40 Z" />
    </g>
  </svg>
);

export const PortadaRosario: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#24395F 0%,#B9764A 48%,#E8B070 58%,#2C4C72 62%,#1B3354 100%)" }}>
    <div style={{ position: "absolute", left: 540 - 200, top: 980 - 200, width: 400, height: 400, borderRadius: 200, background: "radial-gradient(circle, #FBE3A4 0%, rgba(251,227,164,0) 70%)" }} />
    <Galera x={-60} y={980} s={0.9} />
    <Galera x={620} y={1000} s={0.8} espejo />
    <div style={{ position: "absolute", left: 540, top: 1060 }}>
      <Persona quien="abuela" ancho={620} ojos={0.5} boca={{ curva: 10 }} brazoIzq={{ hombro: 10, codo: -110, mano: "abierta" }} brazoDer={{ hombro: 10, codo: -110, mano: "abierta" }} semilla={2} />
    </div>
    {/* rosario dorado en las manos */}
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      {Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * Math.PI * 2;
        return <circle key={i} cx={540 + Math.sin(a) * 70} cy={1520 + (1 - Math.cos(a)) * 80} r={10} fill={PAL.dorado} />;
      })}
      <rect x={533} y={1690} width={14} height={70} fill={PAL.doradoOscuro} />
      <rect x={515} y={1708} width={50} height={12} fill={PAL.doradoOscuro} />
    </svg>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,20,38,0.92) 0%, rgba(11,20,38,0.6) 28%, rgba(11,20,38,0) 40%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 40, color: PAL.dorado, letterSpacing: 4 }}>VERSÍCULO OCULTO</div>
    <div style={{ position: "absolute", left: 50, right: 50, top: 150, textAlign: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 98, lineHeight: 1.04, color: PAL.crema, textShadow: "0 8px 24px rgba(0,0,0,0.6)" }}>
      El <span style={{ color: PAL.dorado }}>rosario</span> de tu abuela y la batalla de <span style={{ color: PAL.dorado }}>Lepanto</span>
    </div>
    <Textura />
  </AbsoluteFill>
);
