// Portada vertical del video: "¿Qué hizo Jesús entre los 12 y los 30 años?"
import React from "react";
import { AbsoluteFill } from "remotion";
import { FUENTE_TITULO, FUENTE_TEXTO } from "../../marca/fuentes";
import { Persona } from "./personas";
import { PAL, Templo, Taller, Textura } from "./escenarios";

export const PortadaJesus1230: React.FC = () => (
  <AbsoluteFill style={{ background: PAL.noche }}>
    {/* mitad izquierda: templo (12 años) · mitad derecha: taller (adulto) */}
    <AbsoluteFill style={{ clipPath: "polygon(0 0, 58% 0, 42% 100%, 0 100%)" }}>
      <Templo />
    </AbsoluteFill>
    <AbsoluteFill style={{ clipPath: "polygon(58% 0, 100% 0, 100% 100%, 42% 100%)" }}>
      <Taller />
    </AbsoluteFill>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <line x1={626} y1={0} x2={454} y2={1920} stroke={PAL.dorado} strokeWidth={10} />
    </svg>
    <div style={{ position: "absolute", left: 270, top: 760 }}>
      <Persona quien="jesus" edad={0} ancho={560} mirada={[6, 0]} giro={0.3} sinBrazos />
    </div>
    <div style={{ position: "absolute", left: 800, top: 700 }}>
      <Persona quien="jesus" edad={1} ancho={600} mirada={[-6, 0]} giro={-0.3} sinBrazos />
    </div>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,20,38,0.92) 0%, rgba(11,20,38,0.75) 26%, rgba(11,20,38,0) 42%)" }} />
    <div style={{ position: "absolute", left: 60, right: 60, top: 150, textAlign: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 104, lineHeight: 1.04, color: PAL.crema, textShadow: "0 8px 24px rgba(0,0,0,0.6)" }}>
      ¿Qué hizo Jesús entre los <span style={{ color: PAL.dorado }}>12</span> y los <span style={{ color: PAL.dorado }}>30</span> años?
    </div>
    {/* rótulos de edad */}
    <div style={{ position: "absolute", left: 120, top: 1540, padding: "12px 30px", borderRadius: 999, background: PAL.pergamino, color: PAL.tinta, fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 56 }}>12</div>
    <div style={{ position: "absolute", right: 120, top: 1540, padding: "12px 30px", borderRadius: 999, background: PAL.dorado, color: PAL.tinta, fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 56 }}>30</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 40, color: PAL.dorado, letterSpacing: 4 }}>VERSÍCULO OCULTO</div>
    <Textura />
  </AbsoluteFill>
);
