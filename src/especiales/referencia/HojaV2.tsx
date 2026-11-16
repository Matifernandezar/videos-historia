// Hoja de referencia de personajes (v2): todos los tipos en varias poses, para revisar el dibujo.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Persona, type Quien } from "../jesus-12-30/personas";

const FILA1: Quien[] = ["jesus", "maria", "jose", "maestro", "sembrador", "padre"];
const FILA2: Quien[] = ["fiel", "fiel2", "abuela", "sacerdote", "centurion", "asirio"];
const FILA3: Quien[] = ["prodigo", "ezequias", "isaias", "obrero", "vecina", "jp2"];

export const HojaV2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#B9C9DA,#E9DCC0)" }}>
      {[FILA1, FILA2, FILA3].map((fila, r) =>
        fila.map((q, i) => (
          <div key={q} style={{ position: "absolute", left: 100 + i * 176, top: 60 + r * 620 }}>
            <Persona
              quien={q}
              ancho={300}
              giro={r === 0 ? 0 : i % 2 ? 0.5 : -0.5}
              corta={q === "obrero"}
              sentado={r === 2 && i === 4}
              caminando={r === 1 && i < 2 ? 1 : 0}
              paso={f / 16}
              brazoDer={r === 0 && i === 3 ? { hombro: 100, codo: 0, mano: "senala" } : r === 2 && i === 1 ? { hombro: 140, codo: 5, mano: "abierta" } : r === 2 && i === 0 ? { hombro: 20, codo: -100, mano: "puno" } : undefined}
              brazoIzq={r === 2 && i === 1 ? { hombro: 140, codo: 5, mano: "abierta" } : r === 0 && i === 1 ? { hombro: 10, codo: -110, mano: "abierta" } : undefined}
              boca={{ curva: i % 3 === 0 ? 10 : 4, apertura: r === 1 && i === 3 ? 0.6 : 0 }}
              semilla={i + r * 6}
            />
          </div>
        )),
      )}
    </AbsoluteFill>
  );
};
