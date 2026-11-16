import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLOR, SOMBRA_TEXTO, colorAcento, type Acento } from "../marca/tema";
import { FUENTE_TITULO } from "../marca/fuentes";
import { palabrasConDestacado } from "../video/texto";

// Texto grande con palabras destacadas: "¿POR QUÉ EL CAFÉ TE MANDA AL *BAÑO*?"
// Las palabras entran una por una (o ya visibles en el frame 0 para que sirva de portada).
export const TextoDestacado: React.FC<{
  texto: string;
  tamano: number;
  desde?: number;
  escalonado?: number;
  acento?: Acento;
  color?: string;
  alineacion?: "center" | "left";
  anchoMax?: number;
  peso?: 800 | 900;
  mayusculas?: boolean;
  interlineado?: number;
  visibleDesdeInicio?: boolean;
  subrayar?: boolean;
}> = ({
  texto,
  tamano,
  desde = 0,
  escalonado = 3,
  acento = "lima",
  color = COLOR.tinta,
  alineacion = "center",
  anchoMax,
  peso = 900,
  mayusculas = true,
  interlineado = 1.04,
  visibleDesdeInicio = false,
  subrayar = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palabras = palabrasConDestacado(mayusculas ? texto.toLocaleUpperCase("es") : texto);
  const tono = colorAcento(acento);

  const asentado = visibleDesdeInicio
    ? interpolate(frame, [0, 12], [1.05, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  return (
    <div
      style={{
        scale: String(asentado),
        display: "flex",
        flexWrap: "wrap",
        justifyContent: alineacion === "center" ? "center" : "flex-start",
        maxWidth: anchoMax,
        fontFamily: FUENTE_TITULO,
        fontWeight: peso,
        fontSize: tamano,
        lineHeight: interlineado,
        letterSpacing: "-0.01em",
        color,
        textShadow: SOMBRA_TEXTO,
        textAlign: alineacion,
      }}
    >
      {palabras.map((p, i) => {
        const inicio = desde + i * escalonado;
        const s = visibleDesdeInicio
          ? 1
          : spring({ frame: frame - inicio, fps, config: { damping: 13, stiffness: 180, mass: 0.6 } });
        const linea = interpolate(frame - inicio, [6, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const latido = p.destacada ? 1 + 0.025 * Math.sin(((frame - inicio) / fps) * Math.PI * 2 * 0.8) : 1;
        return (
          <span
            key={i}
            style={{
              position: "relative",
              display: "inline-block",
              marginRight: "0.24em",
              opacity: Math.min(1, s * 1.4),
              translate: `0px ${(1 - s) * tamano * 0.45}px`,
              scale: String((0.7 + 0.3 * s) * latido),
              color,
              textShadow: SOMBRA_TEXTO,
              whiteSpace: "nowrap",
            }}
          >
            {p.partes.map((parte, j) => (
              <span
                key={j}
                style={parte.destacado ? { color: tono, textShadow: `${SOMBRA_TEXTO}, 0 0 34px ${tono}66` } : undefined}
              >
                {parte.texto}
              </span>
            ))}
            {p.destacada && subrayar ? (
              <svg
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
                style={{ position: "absolute", left: "-2%", bottom: -tamano * 0.1, width: "104%", height: tamano * 0.16, overflow: "visible" }}
              >
                <path
                  d="M 2 8 Q 30 2 52 6 T 98 5"
                  stroke={tono}
                  strokeWidth={4.5}
                  strokeLinecap="round"
                  fill="none"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - (visibleDesdeInicio ? interpolate(frame, [4, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : linea)}
                  vectorEffect="non-scaling-stroke"
                  style={{ strokeWidth: Math.max(6, tamano * 0.07) }}
                />
              </svg>
            ) : null}
          </span>
        );
      })}
    </div>
  );
};
