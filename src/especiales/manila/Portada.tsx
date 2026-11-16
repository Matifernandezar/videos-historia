// Portada vertical: "¿Dónde fue la misa más grande de la historia?"
import React from "react";
import { AbsoluteFill } from "remotion";
import { FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { PAL, Textura } from "../jesus-12-30/escenarios";
import { Explanada } from "./escenas";
import { AltarDeEspaldas } from "./piezas";

export const PortadaManila: React.FC = () => (
  <AbsoluteFill style={{ background: "#0B1426" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: "translateY(120px)" }}>
      <Explanada />
      <AltarDeEspaldas luz={1} />
    </div>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,20,38,0.96) 0%, rgba(11,20,38,0.78) 32%, rgba(11,20,38,0) 52%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 40, color: PAL.dorado, letterSpacing: 4 }}>VERSÍCULO OCULTO</div>
    <div style={{ position: "absolute", left: 50, right: 50, top: 150, textAlign: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 100, lineHeight: 1.04, color: PAL.crema, textShadow: "0 8px 24px rgba(0,0,0,0.6)" }}>
      ¿Dónde fue la <span style={{ color: PAL.dorado }}>misa más grande</span> de la historia?
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 660, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 44, color: PAL.pergamino, textShadow: "0 4px 12px rgba(0,0,0,0.6)" }}>Parque Rizal, Manila · 1995 y 2015</div>
    <Textura />
  </AbsoluteFill>
);
