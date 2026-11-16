// Portada vertical: "¿Por qué Dios no destruye al diablo?"
import React from "react";
import { AbsoluteFill } from "remotion";
import { FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { PAL, Textura } from "../jesus-12-30/escenarios";
import { Campo } from "./escenas";

export const PortadaCizana: React.FC = () => (
  <AbsoluteFill style={{ background: "#0B1426" }}>
    <div style={{ position: "absolute", inset: 0, translate: "0px 200px" }}>
      <Campo crece={1} madura={0.7} />
    </div>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,20,38,0.95) 0%, rgba(11,20,38,0.65) 30%, rgba(11,20,38,0) 46%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 40, color: PAL.dorado, letterSpacing: 4 }}>VERSÍCULO OCULTO</div>
    <div style={{ position: "absolute", left: 50, right: 50, top: 150, textAlign: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 104, lineHeight: 1.04, color: PAL.crema, textShadow: "0 8px 24px rgba(0,0,0,0.6)" }}>
      ¿Por qué Dios <span style={{ color: PAL.dorado }}>no destruye</span> al diablo?
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 44, color: PAL.pergamino, textShadow: "0 4px 12px rgba(0,0,0,0.6)" }}>El trigo y la cizaña · Mateo 13</div>
    <Textura />
  </AbsoluteFill>
);
