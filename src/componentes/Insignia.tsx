import React from "react";
import { COLOR, MARCA } from "../marca/tema";
import { FUENTE_TITULO, FUENTE_TEXTO } from "../marca/fuentes";

// Insignia del canal: píldora con degradé lima→turquesa e ícono de plato con hoja (heredada; rediseñar con la identidad del canal).
export const Insignia: React.FC<{ tamano?: number; conUsuario?: boolean }> = ({ tamano = 40, conUsuario = false }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: tamano * 0.25 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: tamano * 0.35,
          padding: `${tamano * 0.28}px ${tamano * 0.7}px ${tamano * 0.28}px ${tamano * 0.4}px`,
          borderRadius: tamano,
          background: `linear-gradient(90deg, ${COLOR.lima} 0%, ${COLOR.turquesa} 100%)`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        <svg width={tamano * 1.05} height={tamano * 1.05} viewBox="0 0 40 40">
          <circle cx={20} cy={20} r={18} fill={COLOR.tintaOscura} />
          <circle cx={20} cy={20} r={12} fill="none" stroke={COLOR.lima} strokeWidth={2.5} />
          <path d="M 20 27 C 13 22 15 13 25 11 C 26 19 24 24 20 27 Z" fill={COLOR.lima} />
          <path d="M 20 27 L 23 16" stroke={COLOR.tintaOscura} strokeWidth={1.6} strokeLinecap="round" />
        </svg>
        <span
          style={{
            fontFamily: FUENTE_TITULO,
            fontWeight: 900,
            fontSize: tamano,
            lineHeight: 1,
            letterSpacing: "0.02em",
            color: COLOR.tintaOscura,
            whiteSpace: "nowrap",
          }}
        >
          {MARCA.nombre.toLocaleUpperCase("es")}
        </span>
      </div>
      {conUsuario && MARCA.usuario ? (
        <span style={{ fontFamily: FUENTE_TEXTO, fontWeight: 600, fontSize: tamano * 0.6, color: COLOR.tintaSuave }}>{MARCA.usuario}</span>
      ) : null}
    </div>
  );
};
