// Portada vertical: "El día que dividieron África con regla y compás".
import React from "react";
import { AbsoluteFill } from "remotion";
import { FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { Textura } from "../jesus-12-30/escenarios";
import { Caballero, Compas, H, ManoGala, MapaAfrica, Regla } from "../historia/piezas";
import { PAPEL } from "./escenas-1";

const LINEAS: [number, number, number, number][] = [
  [150, 1180, 930, 1330],
  [560, 870, 590, 1640],
  [300, 960, 860, 1500],
  [240, 1420, 800, 1010],
];

export const PortadaRepartoAfrica: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(100deg, ${H.caoba} 0%, ${H.caobaClara} 50%, ${H.caoba} 100%)` }}>
    <div style={{ position: "absolute", left: 70, top: 760, width: 940, height: 1000, transform: "rotate(-2deg)", background: PAPEL, borderRadius: 6, boxShadow: "0 24px 70px rgba(0,0,0,0.75), inset 0 0 100px rgba(107,74,43,0.5)" }} />
    <MapaAfrica x={130} y={810} escala={0.9} estilo="pergamino" rios={0.5} />
    {/* la sombra de Bismarck cae sobre el mapa */}
    <div style={{ position: "absolute", left: 0, top: 0, opacity: 0.42, filter: "blur(5px)" }}>
      <Caballero x={700} y={1990} e={2.5} calvo bigote charreteras color="#05060C" luz="#05060C" />
    </div>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id="po-brillo" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={12} />
        </filter>
      </defs>
      {LINEAS.map(([x1, y1, x2, y2], i) => (
        <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FF3B2E" strokeWidth={30} strokeLinecap="round" opacity={0.5} filter="url(#po-brillo)" />
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={H.carmesi} strokeWidth={13} strokeLinecap="round" />
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FF8A6B" strokeWidth={4} strokeLinecap="round" />
        </g>
      ))}
    </svg>
    <div style={{ position: "absolute", left: 90, top: 1196, transform: "rotate(10.9deg)", transformOrigin: "0 0" }}>
      <Regla largo={860} ancho={70} />
    </div>
    <div style={{ position: "absolute", left: 590, top: 1250, transform: "rotate(22deg) scale(1.55)", transformOrigin: "0 0" }}>
      <Compas apertura={32} largo={330} />
      <div style={{ position: "absolute", left: 90, top: -350 }}>
        <ManoGala rot={-60} />
      </div>
    </div>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,19,43,0.98) 0%, rgba(11,19,43,0.94) 30%, rgba(11,19,43,0) 46%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 100% 80% at 50% 62%, rgba(0,0,0,0) 50%, rgba(4,4,10,0.7) 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 66, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 36, color: H.dorado, letterSpacing: 3 }}>EL PASADO DEL PASADO</div>
    <div style={{ position: "absolute", left: 50, right: 50, top: 140, textAlign: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 106, lineHeight: 1.03, color: H.pergamino, textShadow: "0 8px 24px rgba(0,0,0,0.7)" }}>
      EL DÍA QUE DIVIDIERON <span style={{ color: H.carmesi, WebkitTextStroke: "2px #FF8A6B" }}>ÁFRICA</span> CON <span style={{ color: H.dorado }}>REGLA Y COMPÁS</span>
    </div>
    <Textura />
  </AbsoluteFill>
);
