// Portada vertical: "La Biblia que repetís en misa"
import React from "react";
import { AbsoluteFill } from "remotion";
import { FUENTE_SERIFA, FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { Persona } from "../jesus-12-30/personas";
import { PAL, Textura } from "../jesus-12-30/escenarios";
import { Iglesia } from "../amen/escenas";
import { POSES_MISA as P } from "./poses";

const Frase: React.FC<{ t: string; x: number; y: number; rot: number; tam: number }> = ({ t, x, y, rot, tam }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", rotate: `${rot}deg`, fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: tam, color: PAL.dorado, whiteSpace: "nowrap", textShadow: "0 0 30px rgba(242,193,78,0.8), 0 6px 16px rgba(0,0,0,0.6)" }}>{t}</div>
);

export const PortadaMisa: React.FC = () => (
  <AbsoluteFill style={{ background: PAL.noche }}>
    <div style={{ position: "absolute", inset: 0, scale: "1.05" }}>
      <Iglesia />
    </div>
    <AbsoluteFill style={{ background: "rgba(11,20,38,0.35)" }} />
    <div style={{ position: "absolute", left: 540, top: 1020 }}>
      <Persona quien="fiel" ancho={560} ojos={0.4} cabeza={4} boca={{ curva: 8 }} {...P.rezar} semilla={2} />
    </div>
    <Frase t="«Cordero de Dios»" x={500} y={720} rot={-4} tam={58} />
    <Frase t="«Santo, santo, santo»" x={560} y={850} rot={3} tam={54} />
    <Frase t="«No soy digno»" x={500} y={980} rot={-2} tam={58} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,20,38,0.92) 0%, rgba(11,20,38,0.65) 26%, rgba(11,20,38,0) 36%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 40, color: PAL.dorado, letterSpacing: 4 }}>VERSÍCULO OCULTO</div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 160, textAlign: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 112, lineHeight: 1.04, color: PAL.crema, textShadow: "0 8px 24px rgba(0,0,0,0.6)" }}>
      La <span style={{ color: PAL.dorado }}>Biblia</span> que repetís en misa
    </div>
    <Textura />
  </AbsoluteFill>
);
