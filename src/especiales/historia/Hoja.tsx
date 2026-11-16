// Hoja de referencia de las piezas de historia (para revisar dibujos de un vistazo).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Busto, Corona, Estandarte, Figura, FondoPergamino, H, Hilo, MapaIslas, Lugar, Placa, Gentio } from "./piezas";

export const HojaHistoria: React.FC = () => (
  <AbsoluteFill style={{ background: H.noche }}>
    <div style={{ position: "absolute", left: 0, top: 0, display: "flex" }}>
      {(["carlos1", "cromwell", "carlos2", "richard", "puritano"] as const).map((t) => (
        <Busto key={t} tipo={t} w={216} sombra={t === "cromwell" ? 0.5 : 0} />
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, top: 330, display: "flex", gap: 10 }}>
      {(["piquero", "mosquetero", "puritano", "rey", "richard", "cromwell"] as const).map((t, i) => (
        <Figura key={t} tipo={t} alto={380} paso={i} marcha={1} />
      ))}
    </div>
    <div style={{ position: "absolute", left: 820, top: 420 }}><Corona w={240} /></div>
    <div style={{ position: "absolute", left: 30, top: 800 }}><Estandarte color={H.lacre} emblema="corona" /></div>
    <div style={{ position: "absolute", left: 330, top: 800 }}><Estandarte color={H.azulBando} emblema="cruz" /></div>
    <div style={{ position: "absolute", left: 630, top: 800 }}><Estandarte color="#fff" emblema="mancomunidad" w={340} h={220} /></div>
    <div style={{ position: "absolute", left: 0, top: 1100, width: 1080, height: 820, overflow: "hidden" }}>
      <FondoPergamino />
      <div style={{ position: "absolute", left: 250, top: -40, transform: "scale(0.78)", transformOrigin: "0 0" }}>
        <MapaIslas bandos={1}>
          <Lugar lon={-0.12} lat={51.5} nombre="Londres" aparece={0} />
          <Lugar lon={-6.35} lat={53.72} nombre="Drogheda" aparece={0} rojo lado="izq" />
        </MapaIslas>
      </div>
    </div>
    <Hilo pts={[[0, 1000], [300, 1080], [600, 980], [1080, 1060]]} p={0.8} />
    <Gentio y={1700} n={7} />
    <Placa texto="LORD PROTECTOR · 1653" aparece={-40} y={1500} metal tam={46} />
  </AbsoluteFill>
);
