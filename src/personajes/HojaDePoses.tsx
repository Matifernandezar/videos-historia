// Hoja de referencia del personaje: todas las poses y expresiones juntas.
// Sirve para revisar que Lupe se vea igual en cualquier escena.
import React from "react";
import { AbsoluteFill } from "remotion";
import { COLOR } from "../marca/tema";
import { FUENTE_TEXTO } from "../marca/fuentes";
import { Lupe, type Expresion, type Pose } from "./Lupe";

const CELDAS: { pose: Pose; expresion: Expresion }[] = [
  { pose: "neutral", expresion: "feliz" },
  { pose: "explica", expresion: "feliz" },
  { pose: "senala", expresion: "feliz" },
  { pose: "saluda", expresion: "feliz" },
  { pose: "celebra", expresion: "feliz" },
  { pose: "encoge", expresion: "pensativa" },
  { pose: "sorprendida", expresion: "sorprendida" },
  { pose: "preocupada", expresion: "preocupada" },
  { pose: "pulgar", expresion: "seria" },
];

export const HojaDePoses: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.fondo, padding: 40, flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start", gap: 0 }}>
      {CELDAS.map((c, i) => (
        <div key={c.pose} style={{ width: 333, height: 600, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
          <Lupe pose={c.pose} expresion={c.expresion} alto={430} semilla={i} transicionPose={0} />
          <div style={{ fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 34, color: COLOR.tinta, marginTop: 8 }}>
            {c.pose} · {c.expresion}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
