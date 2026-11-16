import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Fondo } from "../componentes/Fondo";
import { TextoDestacado } from "../componentes/TextoDestacado";
import { MedidorEvidencia } from "../componentes/MedidorEvidencia";
import { COLOR } from "../marca/tema";
import { FUENTE_TEXTO } from "../marca/fuentes";
import type { EscenaMatiz } from "../video/tipos";
import { useDisposicion } from "./disposicion";
import { PersonajeColocado } from "./PersonajeColocado";

// MATIZ: el versículo clave, una aclaración o una pregunta para pensar. Tono ámbar.
export const Matiz: React.FC<{ escena: EscenaMatiz }> = ({ escena }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = useDisposicion();
  const e = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 140, mass: 0.7 } });
  const anchoTarjeta = d.vertical ? d.W - 2 * d.lateral : 1150 * d.k;
  return (
    <AbsoluteFill>
      <Fondo acento="ambar" matiz brillo={0.14} />
      <div style={{ position: "absolute", left: d.lateral, right: d.lateral, top: d.titulo.top, display: "flex", justifyContent: d.vertical ? "center" : "flex-start" }}>
        <TextoDestacado texto={escena.titulo ?? "PARA *PENSAR*"} tamano={d.tamTitulo} acento="ambar" alineacion={d.titulo.alineacion} />
      </div>
      <div
        style={{
          position: "absolute",
          left: d.lateral,
          top: d.vertical ? 380 * d.k : 260 * d.k,
          width: anchoTarjeta,
          boxSizing: "border-box",
          padding: `${40 * d.k}px ${44 * d.k}px`,
          borderRadius: 36 * d.k,
          background: COLOR.panelFuerte,
          border: `${4 * d.k}px solid ${COLOR.ambar}55`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
          display: "flex",
          flexDirection: "column",
          gap: 34 * d.k,
          opacity: Math.min(1, e * 1.5),
          translate: `0px ${(1 - e) * 50 * d.k}px`,
        }}
      >
        <TextoDestacado
          texto={escena.texto}
          tamano={58 * d.k}
          peso={800}
          mayusculas={false}
          alineacion="left"
          acento="ambar"
          desde={8}
          escalonado={1}
          interlineado={1.16}
        />
        {escena.referencia ? (
          <div style={{ fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 44 * d.k, color: COLOR.ambar }}>— {escena.referencia}</div>
        ) : null}
        {escena.evidencia ? <MedidorEvidencia nivel={escena.evidencia} desde={16} ancho={anchoTarjeta - 88 * d.k} /> : null}
        {escena.fuente ? (
          <div style={{ fontFamily: FUENTE_TEXTO, fontWeight: 600, fontSize: 36 * d.k, color: COLOR.tintaSuave }}>Fuente: {escena.fuente}</div>
        ) : null}
      </div>
      <PersonajeColocado conf={escena.personaje} defecto={{ pose: "encoge", expresion: "pensativa", lado: "centro" }} />
    </AbsoluteFill>
  );
};
