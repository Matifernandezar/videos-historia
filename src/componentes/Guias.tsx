import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { zonas } from "../marca/tema";

// Superposición para revisar márgenes en Studio (activar con mostrarGuias: true).
// Rojo: zonas que tapa la interfaz de YouTube. Líneas: título, escenario y subtítulos.
export const Guias: React.FC = () => {
  const { width, height } = useVideoConfig();
  const z = zonas(width, height);
  const linea = (y: number, color: string, texto: string) => (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, borderTop: `3px dashed ${color}`, color, fontSize: 26, fontFamily: "sans-serif", paddingLeft: 12 }}>{texto}</div>
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: z.inferiorUI, background: "rgba(255,0,0,0.18)" }} />
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: z.lateralDerechoUI, background: "rgba(255,0,0,0.12)" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: z.lateral, borderLeft: "2px dashed rgba(255,255,255,0.4)" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, right: z.lateral, borderRight: "2px dashed rgba(255,255,255,0.4)" }} />
      {linea(z.superior, "#7CF", "título")}
      {linea(z.escenarioArriba, "#9F9", "escenario")}
      {linea(z.escenarioAbajo, "#9F9", "fin escenario")}
      {linea(z.subtitulosCentroY, "#FF9", "subtítulos (centro)")}
    </AbsoluteFill>
  );
};
