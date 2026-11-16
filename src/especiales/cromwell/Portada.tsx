// Portada vertical: "Inglaterra ejecutó a su rey" (Oliver Cromwell).
import React from "react";
import { AbsoluteFill } from "remotion";
import { FUENTE_SERIFA, FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { RayosDeLuz } from "../ambiente";
import { Textura } from "../jesus-12-30/escenarios";
import { Busto, Corona, H, Hilo } from "../historia/piezas";

export const PortadaCromwell: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, #223A56 0%, ${H.noche} 58%, #050A12 100%)` }}>
    <RayosDeLuz x={540} y={-200} largo={2200} angulo={90} apertura={50} n={6} color="#F6DE8A" fuerza={0.3} />
    <div style={{ position: "absolute", left: 20, top: 560, width: 1040, height: 1040, borderRadius: "50%", background: "radial-gradient(circle, rgba(135,148,168,0.45) 0%, rgba(74,85,104,0.14) 45%, rgba(74,85,104,0) 70%)" }} />
    <div style={{ position: "absolute", left: 60, top: 760 }}>
      <Busto tipo="cromwell" w={960} sombra={0.7} silueta={0.62} respira={false} />
    </div>
    <Hilo pts={[[-80, 1250], [200, 1120], [430, 1010], [640, 1000], [860, 880], [1160, 760]]} p={1} grosor={9} ondula={0} chispa={false} />
    <div style={{ position: "absolute", left: 170, top: 760, transform: "rotate(-16deg)", filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.7))" }}>
      <Corona w={520} mitad="izq" />
    </div>
    <div style={{ position: "absolute", left: 420, top: 800, transform: "rotate(15deg)", filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.7))" }}>
      <Corona w={520} mitad="der" />
    </div>
    <div style={{ position: "absolute", left: 370, top: 760, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,246,208,0.95) 0%, rgba(246,222,138,0.45) 30%, rgba(246,222,138,0) 70%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,10,18,0.96) 0%, rgba(13,27,42,0.8) 26%, rgba(13,27,42,0) 42%, rgba(13,27,42,0) 74%, rgba(5,10,18,0.9) 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 84, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 36, color: H.dorado, letterSpacing: 6 }}>EL PASADO DEL PASADO</div>
    <div style={{ position: "absolute", left: 50, right: 50, top: 160, textAlign: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 124, lineHeight: 1.0, color: H.pergamino, textShadow: "0 8px 24px rgba(0,0,0,0.7)" }}>
      INGLATERRA
      <br />
      <span style={{ color: H.dorado }}>EJECUTÓ</span> A SU REY
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1640, textAlign: "center", fontFamily: FUENTE_SERIFA, fontWeight: 700, fontStyle: "italic", fontSize: 58, color: H.pergamino, textShadow: "0 6px 16px rgba(0,0,0,0.8)" }}>…y prohibió la Navidad</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1740, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 40, color: H.dorado, letterSpacing: 5 }}>OLIVER CROMWELL · 1649</div>
    <Textura />
  </AbsoluteFill>
);
