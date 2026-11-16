// Hoja de referencia de los personajes del video de la misa.
import React from "react";
import { AbsoluteFill } from "remotion";
import { FUENTE_TEXTO } from "../../marca/fuentes";
import { Persona, type PropsPersona } from "../jesus-12-30/personas";
import { POSES_MISA as P } from "./poses";

type Pose = Omit<PropsPersona, "ancho"> & { rotulo: string };
const LISTA: Pose[] = [
  { rotulo: "centurión ruega", quien: "centurion", corta: true, cejas: { y: -4, rot: 12 }, giro: 0.5, ...P.ruega },
  { rotulo: "centurión sereno", quien: "centurion", corta: true, boca: { curva: 8 }, ...P.pecho },
  { rotulo: "Juan señala", quien: "juan", giro: 0.5, mirada: [8, 0], ...P.senala },
  { rotulo: "fiel: mano al pecho", quien: "fiel", ojos: 0.5, ...P.pecho },
  { rotulo: "fiel2 canta", quien: "fiel2", boca: { apertura: 0.5 }, ...P.canta },
  { rotulo: "fiel3 canta", quien: "fiel3", boca: { apertura: 0.4 }, ...P.canta },
  { rotulo: "criado", quien: "criado", ojos: 0, ...P.reposo },
  { rotulo: "Jesús escucha", quien: "jesus", edad: 1, giro: -0.5, mirada: [-8, 0], ...P.escucha },
];

export const HojaPosesMisa: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#14223F,#0B1426)" }}>
    {LISTA.map(({ rotulo, ...p }, i) => (
      <div key={i} style={{ position: "absolute", left: 140 + (i % 4) * 270, top: 120 + Math.floor(i / 4) * 900 }}>
        <Persona {...p} ancho={240} semilla={i} />
        <div style={{ position: "absolute", left: -135, width: 270, top: 470, textAlign: "center", color: "#F7F1E3", fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 28 }}>{rotulo}</div>
      </div>
    ))}
  </AbsoluteFill>
);
