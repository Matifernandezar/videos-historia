// Portada vertical: "¿Por qué San Pedro pidió morir boca abajo?"
import React from "react";
import { AbsoluteFill } from "remotion";
import { FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { PAL, Textura } from "../jesus-12-30/escenarios";
import { Fig } from "../jesus-12-30/escenas";
import { Muro, Obelisco } from "./escenas";

export const PortadaPedro: React.FC = () => (
  <AbsoluteFill style={{ background: "#0B1426" }}>
    <Muro x={-100} y={420} w={1300} h={1700} base="#6B655E" id="p" />
    <div style={{ position: "absolute", left: 200, top: 700, width: 900, height: 1100, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,170,80,0.55) 0%, rgba(255,140,60,0.18) 40%, rgba(255,120,40,0) 70%)", mixBlendMode: "screen" }} />
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <filter id="pt-sombra" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={8} />
        </filter>
      </defs>
      <g transform="translate(400 1060) rotate(180) scale(1.45)" filter="url(#pt-sombra)">
        <rect x={-30} y={-300} width={60} height={600} fill="#06080F" opacity={0.88} />
        <rect x={-130} y={-190} width={260} height={56} fill="#06080F" opacity={0.88} />
      </g>
      <Obelisco x={880} y={1500} h={640} brillo={1} />
    </svg>
    <Fig quien="pedro2" x={610} suelo={1960} ancho={620} giro={0.2} mirada={[0, 3]} cejas={{ rot: 5 }} boca={{ curva: -2 }} brazoIzq={{ hombro: 8, codo: -15 }} brazoDer={{ hombro: 8, codo: -15 }} semilla={2} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,20,38,0.96) 0%, rgba(11,20,38,0.78) 28%, rgba(11,20,38,0) 44%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 40, color: PAL.dorado, letterSpacing: 4 }}>VERSÍCULO OCULTO</div>
    <div style={{ position: "absolute", left: 50, right: 50, top: 150, textAlign: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 100, lineHeight: 1.04, color: PAL.crema, textShadow: "0 8px 24px rgba(0,0,0,0.6)" }}>
      ¿Por qué San Pedro pidió morir <span style={{ color: PAL.dorado }}>boca abajo</span>?
    </div>
    <Textura />
  </AbsoluteFill>
);
