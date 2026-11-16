// Portada vertical: "¿Cómo un solo ángel derrotó a 185.000 soldados?"
import React from "react";
import { AbsoluteFill } from "remotion";
import { FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { PAL, Textura } from "../jesus-12-30/escenarios";
import { Angel, Campamento, CieloNoche, Murallas } from "./escenas";

export const PortadaSenaquerib: React.FC = () => (
  <AbsoluteFill style={{ background: "#0B1426" }}>
    <div style={{ position: "absolute", inset: 0, translate: "0px 260px" }}>
      <CieloNoche />
      <div style={{ position: "absolute", left: -900, top: 960, width: 2900, height: 1600, background: "linear-gradient(180deg,#1A2236,#0E1322)" }} />
      <Murallas x={540} y={960} w={700} />
      <Campamento encendida={(x) => (x < 540 ? 0.15 : 1)} />
      <Angel x={540} y={560} e={0.7} o={1} />
    </div>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,20,38,0.95) 0%, rgba(11,20,38,0.6) 26%, rgba(11,20,38,0) 38%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 40, color: PAL.dorado, letterSpacing: 4 }}>VERSÍCULO OCULTO</div>
    <div style={{ position: "absolute", left: 50, right: 50, top: 150, textAlign: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 96, lineHeight: 1.04, color: PAL.crema, textShadow: "0 8px 24px rgba(0,0,0,0.6)" }}>
      ¿Cómo un solo <span style={{ color: PAL.dorado }}>ángel</span> derrotó a <span style={{ color: PAL.dorado }}>185.000</span> soldados?
    </div>
    <Textura />
  </AbsoluteFill>
);
