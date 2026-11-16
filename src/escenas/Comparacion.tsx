import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Fondo } from "../componentes/Fondo";
import { TextoDestacado } from "../componentes/TextoDestacado";
import { Etiqueta } from "../componentes/Etiqueta";
import { Barra } from "../componentes/Barra";
import { Ilustracion } from "../ilustraciones";
import { COLOR } from "../marca/tema";
import { FUENTE_TEXTO, FUENTE_TITULO } from "../marca/fuentes";
import { useDisparador } from "../video/contexto";
import type { EscenaComparacion, LadoComparacion } from "../video/tipos";
import { useDisposicion } from "./disposicion";
import { PersonajeColocado } from "./PersonajeColocado";

const TONO = { positivo: COLOR.lima, alerta: COLOR.coral, neutro: COLOR.celeste } as const;

const Columna: React.FC<{ lado: LadoComparacion; x: number; inicio: number; ancho: number }> = ({ lado, x, inicio, ancho }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = useDisposicion();
  const e = spring({ frame: frame - inicio, fps, config: { damping: 13, stiffness: 150, mass: 0.7 } });
  const tono = TONO[lado.tono ?? "neutro"];
  const acento = lado.tono === "positivo" ? "lima" : lado.tono === "alerta" ? "coral" : "celeste";
  const r = d.escenarioAmplio;
  const tamIlu = Math.min(ancho * 0.72, 300 * d.k);
  if (frame < inicio) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - ancho / 2,
        top: r.y0,
        width: ancho,
        height: r.y1 - r.y0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 22 * d.k,
        opacity: Math.min(1, e * 1.5),
        translate: `0px ${(1 - e) * 60 * d.k}px`,
      }}
    >
      <Etiqueta texto={lado.etiqueta} acento={acento} tamano={44 * d.k} />
      <Ilustracion nombre={lado.ilustracion} tamano={tamIlu} />
      {typeof lado.valor === "number" ? <Barra valor={lado.valor} color={tono} desde={inicio + 6} alto={170 * d.k} ancho={ancho * 0.5} /> : null}
      {lado.textoValor ? (
        <div style={{ fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 60 * d.k, color: tono, textShadow: "0 6px 0 rgba(0,0,0,0.35)" }}>{lado.textoValor}</div>
      ) : null}
      {lado.nota ? (
        <div style={{ fontFamily: FUENTE_TEXTO, fontWeight: 600, fontSize: 38 * d.k, color: COLOR.tintaSuave, textAlign: "center", lineHeight: 1.2 }}>{lado.nota}</div>
      ) : null}
    </div>
  );
};

// COMPARACIÓN: A vs B (mito vs dato, opción 1 vs opción 2) con barras opcionales.
export const Comparacion: React.FC<{ escena: EscenaComparacion }> = ({ escena }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = useDisposicion();
  const iz = useDisparador(escena.izquierda, 0.05);
  const de = useDisparador(escena.derecha, 0.35);
  const inicioDer = Math.max(de, iz + 6);
  const ancho = (d.W - 2 * d.lateral) * 0.46;
  const xIz = d.lateral + ancho / 2;
  const xDe = d.W - d.lateral - ancho / 2;
  const vs = spring({ frame: frame - inicioDer + 4, fps, config: { damping: 10, stiffness: 200, mass: 0.5 } });
  const r = d.escenarioAmplio;
  return (
    <AbsoluteFill>
      <Fondo acento="violeta" />
      {escena.titulo ? (
        <div style={{ position: "absolute", left: d.lateral, right: d.lateral, top: d.titulo.top, display: "flex", justifyContent: d.vertical ? "center" : "flex-start" }}>
          <TextoDestacado texto={escena.titulo} tamano={d.tamTituloEscena} acento="ambar" alineacion={d.titulo.alineacion} anchoMax={d.titulo.anchoMax} />
        </div>
      ) : null}
      <Columna lado={escena.izquierda} x={xIz} inicio={iz} ancho={ancho} />
      <Columna lado={escena.derecha} x={xDe} inicio={inicioDer} ancho={ancho} />
      <div
        style={{
          position: "absolute",
          left: d.W / 2 - 60 * d.k,
          top: r.y0 + 300 * d.k,
          width: 120 * d.k,
          height: 120 * d.k,
          borderRadius: "50%",
          background: COLOR.ambar,
          display: frame < inicioDer - 4 ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FUENTE_TITULO,
          fontWeight: 900,
          fontSize: 50 * d.k,
          color: COLOR.tintaOscura,
          scale: String(vs),
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        VS
      </div>
      {escena.personaje && !escena.personaje.oculto ? (
        <PersonajeColocado conf={escena.personaje} defecto={{ pose: "encoge", expresion: "pensativa", lado: "centro" }} escala={0.8} base={d.H + 60 * d.k} />
      ) : null}
    </AbsoluteFill>
  );
};
