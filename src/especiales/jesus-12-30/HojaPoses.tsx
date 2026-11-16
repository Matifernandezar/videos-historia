// Hoja de referencia: las poses de brazos que usan las escenas (para revisar que se vean naturales).
import React from "react";
import { AbsoluteFill } from "remotion";
import { FUENTE_TEXTO } from "../../marca/fuentes";
import { Persona, type PropsPersona } from "./personas";

type Pose = Omit<PropsPersona, "ancho"> & { rotulo: string };
const POSES: Pose[] = [
  { rotulo: "levanta la mano", quien: "jesus", edad: 0, sentado: true, brazoDer: { hombro: 160, codo: 20, mano: "abierta" }, brazoIzq: { hombro: 12, codo: -55 } },
  { rotulo: "señala →", quien: "vecino", brazoDer: { hombro: 115, codo: -10, mano: "senala" } },
  { rotulo: "sorpresa", quien: "vecina", brazoIzq: { hombro: 18, codo: -145, mano: "abierta" } },
  { rotulo: "enseña", quien: "jesus", edad: 1, brazoDer: { hombro: 23, codo: 75, mano: "abierta" }, brazoIzq: { hombro: 18, codo: 40 } },
  { rotulo: "busca", quien: "jose", brazoDer: { hombro: 38, codo: -186, mano: "abierta" } },
  { rotulo: "alivio", quien: "maria", brazoIzq: { hombro: 18, codo: -145, mano: "abierta" } },
  { rotulo: "carga viga", quien: "obrero", corta: true, brazoDer: { hombro: 172, codo: 0, mano: "puno" } },
  { rotulo: "golpea", quien: "vecino", corta: true, brazoIzq: { hombro: 95, codo: 40, mano: "puno" } },
  { rotulo: "calcula", quien: "obrero", corta: true, brazoDer: { hombro: 56, codo: 70, mano: "senala" }, brazoIzq: { hombro: 120, codo: 20, mano: "senala" } },
  { rotulo: "maestro habla", quien: "maestro", sentado: true, brazoDer: { hombro: 23, codo: 75, mano: "abierta" } },
  { rotulo: "José alivio", quien: "jose", brazoIzq: { hombro: 25, codo: 40, mano: "abierta" } },
  { rotulo: "camina", quien: "maria", caminando: 1, paso: 0.25 },
];

export const HojaPoses: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#14223F,#0B1426)" }}>
    {POSES.map(({ rotulo, ...p }, i) => (
      <div key={i} style={{ position: "absolute", left: 140 + (i % 4) * 270, top: 70 + Math.floor(i / 4) * 620 }}>
        <Persona {...p} ancho={230} semilla={i} />
        <div style={{ position: "absolute", left: -130, width: 260, top: 450, textAlign: "center", color: "#F7F1E3", fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 30 }}>{rotulo}</div>
      </div>
    ))}
  </AbsoluteFill>
);
