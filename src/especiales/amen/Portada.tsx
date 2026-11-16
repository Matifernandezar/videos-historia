// Portada vertical: "¿Qué decís cuando decís AMÉN?"
import React from "react";
import { AbsoluteFill } from "remotion";
import { FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { Persona } from "../jesus-12-30/personas";
import { PAL, Textura } from "../jesus-12-30/escenarios";
import { POSES } from "./poses";

export const PortadaAmen: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #2C3F66 0%, #0B1426 75%)" }}>
    <div style={{ position: "absolute", left: 540 - 520, top: 1000 - 520, width: 1040, height: 1040, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,214,140,0.45), rgba(255,214,140,0) 62%)" }} />
    <div style={{ position: "absolute", left: 540, top: 820 }}>
      <Persona quien="fiel" ancho={620} ojos={0} cabeza={4} boca={{ curva: 8 }} {...POSES.rezar} semilla={2} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 210, letterSpacing: 14, color: PAL.dorado, textShadow: "0 0 50px rgba(242,193,78,0.7), 0 10px 24px rgba(0,0,0,0.5)" }}>
      AMÉN
    </div>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,20,38,0.9) 0%, rgba(11,20,38,0.6) 24%, rgba(11,20,38,0) 34%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 40, color: PAL.dorado, letterSpacing: 4 }}>VERSÍCULO OCULTO</div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 160, textAlign: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 108, lineHeight: 1.04, color: PAL.crema, textShadow: "0 8px 24px rgba(0,0,0,0.6)" }}>
      ¿Qué decís cuando decís <span style={{ color: PAL.dorado }}>AMÉN</span>?
    </div>
    <Textura />
  </AbsoluteFill>
);
