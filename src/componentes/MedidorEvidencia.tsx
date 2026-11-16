import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLOR } from "../marca/tema";
import { FUENTE_TEXTO, FUENTE_TITULO } from "../marca/fuentes";
import type { NivelEvidencia } from "../video/tipos";

export const NIVELES: { id: NivelEvidencia; texto: string; color: string; llenos: number }[] = [
  { id: "insuficiente", texto: "Sin evidencia sólida", color: COLOR.coral, llenos: 1 },
  { id: "limitado", texto: "Evidencia limitada", color: COLOR.ambar, llenos: 2 },
  { id: "moderado", texto: "Evidencia moderada", color: COLOR.celeste, llenos: 3 },
  { id: "demostrado", texto: "Bien demostrado", color: COLOR.lima, llenos: 4 },
];

// Medidor de 4 segmentos que muestra qué tan firme es la evidencia de la afirmación.
export const MedidorEvidencia: React.FC<{ nivel: NivelEvidencia; desde?: number; ancho?: number }> = ({ nivel, desde = 0, ancho = 760 }) => {
  const frame = useCurrentFrame();
  const def = NIVELES.find((n) => n.id === nivel) ?? NIVELES[1];
  const alto = 34;
  return (
    <div style={{ width: ancho, display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: FUENTE_TEXTO, fontWeight: 600, fontSize: 38, color: COLOR.tintaSuave }}>Evidencia</span>
        <span style={{ fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 48, color: def.color }}>{def.texto.toLocaleUpperCase("es")}</span>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        {[0, 1, 2, 3].map((i) => {
          const lleno = i < def.llenos;
          const p = interpolate(frame, [desde + i * 5, desde + i * 5 + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ flex: 1, height: alto, borderRadius: alto / 2, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
              <div style={{ width: lleno ? `${p * 100}%` : "0%", height: "100%", borderRadius: alto / 2, background: def.color }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
