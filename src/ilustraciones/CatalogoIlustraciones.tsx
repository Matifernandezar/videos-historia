// Composición de referencia: muestra todas las ilustraciones con su nombre.
import React from "react";
import { AbsoluteFill } from "remotion";
import { COLOR } from "../marca/tema";
import { FUENTE_TEXTO } from "../marca/fuentes";
import { REGISTRO } from "./index";

export const CatalogoIlustraciones: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLOR.fondo, padding: 30, flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start" }}>
    {Object.entries(REGISTRO).map(([nombre, C]) => (
      <div key={nombre} style={{ width: 204, height: 268, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <C tamano={150} />
        <div style={{ fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 26, color: COLOR.tinta, marginTop: 10 }}>{nombre}</div>
      </div>
    ))}
  </AbsoluteFill>
);
