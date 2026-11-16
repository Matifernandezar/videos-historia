import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Fondo } from "../componentes/Fondo";
import { TextoDestacado } from "../componentes/TextoDestacado";
import { Insignia } from "../componentes/Insignia";
import { Camara } from "../componentes/Camara";
import { Ilustracion } from "../ilustraciones";
import { useEscena } from "../video/contexto";
import type { EscenaGancho } from "../video/tipos";
import { useDisposicion } from "./disposicion";
import { PersonajeColocado } from "./PersonajeColocado";

const tamanoPorLargo = (texto: string, base: number) => {
  const n = texto.replace(/\*/g, "").length;
  if (n > 44) return base * 0.8;
  if (n > 34) return base * 0.9;
  return base;
};

// GANCHO: pregunta o dato que frena el scroll. Ya es portada en el frame 0.
export const Gancho: React.FC<{ escena: EscenaGancho }> = ({ escena }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { duracion } = useEscena();
  const d = useDisposicion();
  const r = d.escenario;
  const cx = (r.x0 + r.x1) / 2;
  const cy = (r.y0 + r.y1) / 2;
  const tamIlu = Math.min(r.x1 - r.x0, r.y1 - r.y0) * 0.86;
  const flota = Math.sin((frame / fps) * Math.PI * 2 * 0.4) * 10 * d.k;
  const asentado = interpolate(frame, [0, 14], [1.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const xIlu = cx;

  return (
    <AbsoluteFill>
      <Fondo acento={escena.acento ?? "coral"} brillo={0.2} />
      <Camara foco={[cx, cy]} tramos={[[0, 1], [duracion, 1.07]]}>
        {escena.ilustracion ? (
          <div
            style={{
              position: "absolute",
              left: xIlu - tamIlu / 2,
              top: cy - tamIlu / 2 + flota,
              width: tamIlu,
              height: tamIlu,
              scale: String(asentado),
            }}
          >
            <Ilustracion nombre={escena.ilustracion} tamano={tamIlu} />
          </div>
        ) : null}
        {escena.dato ? (
          <div style={{ position: "absolute", left: 0, right: 0, top: r.y1 - 150 * d.k, display: "flex", justifyContent: "center" }}>
            <TextoDestacado texto={escena.dato} tamano={d.tamTitulo} acento="ambar" desde={6} />
          </div>
        ) : null}
        <PersonajeColocado
          conf={escena.personaje}
          defecto={{ pose: "sorprendida", expresion: "sorprendida", lado: "centro" }}
          visibleDesdeInicio
        />
      </Camara>
      <div
        style={{
          position: "absolute",
          left: d.lateral,
          right: d.lateral,
          top: d.titulo.top,
          display: "flex",
          flexDirection: "column",
          alignItems: d.titulo.alineacion === "center" ? "center" : "flex-start",
          gap: 26 * d.k,
        }}
      >
        <TextoDestacado
          texto={escena.titulo}
          tamano={tamanoPorLargo(escena.titulo, d.tamTitulo)}
          acento={escena.acento ?? "lima"}
          alineacion={d.titulo.alineacion}
          anchoMax={d.titulo.anchoMax}
          visibleDesdeInicio
        />
        <Insignia tamano={34 * d.k} />
      </div>
    </AbsoluteFill>
  );
};
