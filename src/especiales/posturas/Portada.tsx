// Portada vertical: "¿Por qué cambiamos de postura en misa?"
import React from "react";
import { AbsoluteFill } from "remotion";
import { FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { PAL, Textura } from "../jesus-12-30/escenarios";
import { ALT_PIE, ALT_RODILLAS, ALT_SENTADO, B_REPOSO, Pueblo } from "./escenas";

export const PortadaPosturas: React.FC = () => (
  <AbsoluteFill style={{ background: "#0B1426" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: "translate(0px, 190px) scale(1.5)", transformOrigin: "540px 1210px" }}>
      <Pueblo
        altDe={(i) => (i === 12 ? ALT_RODILLAS : i === 13 ? ALT_SENTADO : i < 6 ? ALT_RODILLAS : ALT_SENTADO)}
        rezoDe={(i) => (i === 12 || i < 6 ? 1 : 0)}
        altProta={ALT_PIE}
        vecD={{ mirada: [-9, -6], giro: -0.4, boca: { curva: 9 } }}
        prota={{ mirada: [-9, 2], giro: -0.3, cejas: { y: -8 }, cejaUna: 5, boca: { curva: -5, apertura: 0.15 }, brazoIzq: B_REPOSO, brazoDer: { hombro: 22, codo: 84, mano: "abierta" } }}
      />
    </div>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,20,38,0.96) 0%, rgba(11,20,38,0.8) 28%, rgba(11,20,38,0) 42%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 40, color: PAL.dorado, letterSpacing: 4 }}>VERSÍCULO OCULTO</div>
    <div style={{ position: "absolute", left: 50, right: 50, top: 150, textAlign: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 104, lineHeight: 1.04, color: PAL.crema, textShadow: "0 8px 24px rgba(0,0,0,0.6)" }}>
      ¿Por qué cambiamos de <span style={{ color: PAL.dorado }}>postura</span> en misa?
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 500, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 44, color: PAL.pergamino, textShadow: "0 4px 12px rgba(0,0,0,0.6)" }}>De pie · Sentados · De rodillas</div>
    <Textura />
  </AbsoluteFill>
);
