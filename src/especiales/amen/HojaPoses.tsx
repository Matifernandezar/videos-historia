// Hoja de referencia del video del amén: personajes nuevos y sus poses.
import React from "react";
import { AbsoluteFill } from "remotion";
import { FUENTE_TEXTO } from "../../marca/fuentes";
import { Persona, type PropsPersona } from "../jesus-12-30/personas";
import { POSES } from "./poses";

type Pose = Omit<PropsPersona, "ancho"> & { rotulo: string };
const LISTA: Pose[] = [
  { rotulo: "reza (manos juntas)", quien: "fiel", sentado: true, ojos: 0, ...POSES.rezar },
  { rotulo: "piensa (ceja)", quien: "fiel", sentado: true, cejaUna: 14, mirada: [8, -6], ...POSES.pensar },
  { rotulo: "abre las manos", quien: "fiel", sentado: true, ojos: 0.2, boca: { curva: 10 }, ...POSES.abrir },
  { rotulo: "comulga", quien: "fiel", giro: -0.6, mirada: [-8, 0], ...POSES.recibir },
  { rotulo: "presenta la hostia", quien: "sacerdote", giro: 0.6, mirada: [8, 0], ...POSES.hostia },
  { rotulo: "lee el rollo", quien: "maestro", ...POSES.leer },
  { rotulo: "alzan las manos", quien: "oyente2", ...POSES.alzar },
  { rotulo: "Jesús: gesto", quien: "jesus", edad: 1, ...POSES.gesto },
];

export const HojaPosesAmen: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#14223F,#0B1426)" }}>
    {LISTA.map(({ rotulo, ...p }, i) => (
      <div key={i} style={{ position: "absolute", left: 140 + (i % 4) * 270, top: 120 + Math.floor(i / 4) * 900 }}>
        <Persona {...p} ancho={240} semilla={i} />
        <div style={{ position: "absolute", left: -135, width: 270, top: 470, textAlign: "center", color: "#F7F1E3", fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 28 }}>{rotulo}</div>
      </div>
    ))}
  </AbsoluteFill>
);
