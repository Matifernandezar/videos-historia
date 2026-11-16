import React from "react";
import { COLOR, colorAcento, type Acento } from "../marca/tema";
import { FUENTE_TITULO } from "../marca/fuentes";

// Etiqueta tipo "píldora" para nombrar partes de un diagrama.
export const Etiqueta: React.FC<{ texto: string; acento?: Acento; tamano?: number; solida?: boolean }> = ({
  texto,
  acento = "celeste",
  tamano = 46,
  solida = false,
}) => {
  const tono = colorAcento(acento);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: tamano * 0.35,
        padding: `${tamano * 0.26}px ${tamano * 0.55}px`,
        borderRadius: tamano,
        background: solida ? tono : COLOR.panelFuerte,
        border: `${Math.max(3, tamano * 0.07)}px solid ${tono}`,
        fontFamily: FUENTE_TITULO,
        fontWeight: 800,
        fontSize: tamano,
        lineHeight: 1,
        color: solida ? COLOR.tintaOscura : COLOR.tinta,
        whiteSpace: "nowrap",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
      }}
    >
      {!solida ? <span style={{ width: tamano * 0.32, height: tamano * 0.32, borderRadius: "50%", background: tono, flexShrink: 0 }} /> : null}
      {texto}
    </div>
  );
};
