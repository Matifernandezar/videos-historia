// Portada vertical: "¿Por qué hay una bala en la corona de Fátima?"
import React from "react";
import { AbsoluteFill } from "remotion";
import { FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { PAL, Textura } from "../jesus-12-30/escenarios";
import { BALA_EN_CORONA, Bala, Corona } from "./escenas";

const W = 940;
const X = 540 - W / 2;
const Y = 760;

export const PortadaFatima: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 62%, #3E5A86 0%, #14223F 45%, #0B1426 80%)" }}>
    <div style={{ position: "absolute", left: X, top: Y }}>
      <Corona w={W} brillo={0.7} vacia />
    </div>
    {/* la bala, grande, entrando en su lugar entre los arcos */}
    <Bala x={X + (BALA_EN_CORONA.x / 600) * W + 150} y={Y + (BALA_EN_CORONA.y / 600) * W - 40} largo={260} rot={153} brillo={1} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,20,38,0.95) 0%, rgba(11,20,38,0.6) 26%, rgba(11,20,38,0) 38%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 40, color: PAL.dorado, letterSpacing: 4 }}>VERSÍCULO OCULTO</div>
    <div style={{ position: "absolute", left: 50, right: 50, top: 150, textAlign: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 100, lineHeight: 1.04, color: PAL.crema, textShadow: "0 8px 24px rgba(0,0,0,0.6)" }}>
      ¿Por qué hay una <span style={{ color: PAL.dorado }}>bala</span> en la corona de <span style={{ color: PAL.dorado }}>Fátima</span>?
    </div>
    <Textura />
  </AbsoluteFill>
);
