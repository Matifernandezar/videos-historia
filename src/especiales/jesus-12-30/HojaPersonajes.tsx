// Hoja de referencia: todos los personajes del video (para revisar continuidad).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Persona, type Quien } from "./personas";

const FILAS: { quien: Quien; edad?: number; sentado?: boolean; corta?: boolean }[][] = [
  [{ quien: "jesus", edad: 0 }, { quien: "jesus", edad: 0.5 }, { quien: "jesus", edad: 1 }, { quien: "maria" }],
  [{ quien: "jose" }, { quien: "maestro", sentado: true }, { quien: "maestro2", sentado: true }, { quien: "vecino" }],
  [{ quien: "vecina" }, { quien: "obrero", corta: true }, { quien: "obrero2", corta: true }, { quien: "oyente2", sentado: true }],
];

export const HojaPersonajes: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#14223F,#0B1426)" }}>
    {FILAS.map((fila, r) =>
      fila.map((c, i) => (
        <div key={`${r}-${i}`} style={{ position: "absolute", left: 135 + i * 270, top: 60 + r * 620 }}>
          <Persona {...c} ancho={250} semilla={i + r} brazoDer={i === 3 && r === 0 ? { hombro: 120, codo: 20, mano: "senala" } : undefined} />
        </div>
      )),
    )}
  </AbsoluteFill>
);
