// Portada vertical: "¿Cómo describe la Biblia el regreso de Jesús?"
import React from "react";
import { AbsoluteFill } from "remotion";
import { FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { PAL, Textura } from "../jesus-12-30/escenarios";
import { RayosDeLuz } from "../ambiente";
import { Fig } from "../jesus-12-30/escenas";
import { Nube } from "./escenas";

export const PortadaRegreso: React.FC = () => (
  <AbsoluteFill style={{ background: "#0B1426" }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#0B1630 0%,#1C3566 38%,#C98A3E 100%)" }} />
    <div style={{ position: "absolute", left: 40, top: 560, width: 1000, height: 1000, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,240,200,1) 0%, rgba(255,214,140,0.6) 32%, rgba(255,214,140,0) 68%)" }} />
    <RayosDeLuz x={540} y={640} largo={1500} angulo={90} apertura={70} n={9} color="#FFE9B0" fuerza={0.6} />
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Nube x={170} y={980} e={1.25} tono={0.35} />
      <Nube x={900} y={1000} e={1.3} tono={0.35} />
    </svg>
    <div style={{ position: "absolute", left: 0, top: 0, filter: "drop-shadow(0 0 50px rgba(255,226,160,0.95))" }}>
      <Fig quien="jesus2" edad={1} x={540} suelo={1420} ancho={470} mirada={[0, 2]} boca={{ curva: 6 }} brazoIzq={{ hombro: 58, codo: 26, mano: "abierta" }} brazoDer={{ hombro: 58, codo: 26, mano: "abierta" }} semilla={1} />
    </div>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Nube x={300} y={1500} e={1.7} tono={0} />
      <Nube x={800} y={1530} e={1.7} tono={0} />
      <Nube x={540} y={1640} e={2.0} tono={0} />
    </svg>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,20,38,0.96) 0%, rgba(11,20,38,0.7) 30%, rgba(11,20,38,0) 46%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 40, color: PAL.dorado, letterSpacing: 4 }}>VERSÍCULO OCULTO</div>
    <div style={{ position: "absolute", left: 50, right: 50, top: 150, textAlign: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 100, lineHeight: 1.04, color: PAL.crema, textShadow: "0 8px 24px rgba(0,0,0,0.6)" }}>
      ¿Cómo describe la Biblia el <span style={{ color: PAL.dorado }}>regreso de Jesús</span>?
    </div>
    <Textura />
  </AbsoluteFill>
);
