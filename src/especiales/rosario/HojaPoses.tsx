// Hoja de referencia de los personajes del video del rosario.
import React from "react";
import { AbsoluteFill } from "remotion";
import { FUENTE_TEXTO } from "../../marca/fuentes";
import { Persona, type PropsPersona } from "../jesus-12-30/personas";

type Pose = Omit<PropsPersona, "ancho"> & { rotulo: string };
const LISTA: Pose[] = [
  { rotulo: "abuela", quien: "abuela", boca: { curva: 9 }, brazoDer: { hombro: 10, codo: -95, mano: "puno" } },
  { rotulo: "abuela sentada", quien: "abuela", sentado: true, ojos: 0.6, brazoIzq: { hombro: 10, codo: -110, mano: "abierta" }, brazoDer: { hombro: 10, codo: -110, mano: "abierta" } },
  { rotulo: "Pío V", quien: "pio5", brazoDer: { hombro: 40, codo: 90, mano: "abierta" } },
  { rotulo: "León XIII", quien: "leon13", brazoDer: { hombro: 18, codo: 70, mano: "abierta" } },
];

export const HojaPosesRosario: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#14223F,#0B1426)" }}>
    {LISTA.map(({ rotulo, ...p }, i) => (
      <div key={i} style={{ position: "absolute", left: 140 + (i % 4) * 270, top: 120 }}>
        <Persona {...p} ancho={240} semilla={i} />
        <div style={{ position: "absolute", left: -135, width: 270, top: 470, textAlign: "center", color: "#F7F1E3", fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 28 }}>{rotulo}</div>
      </div>
    ))}
  </AbsoluteFill>
);
