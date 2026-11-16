// Prueba local de render: 3 segundos, sin voz ni servicios externos.
// Ejercita fondo, título con palabra destacada, personaje por capas (parpadeo, saludo, boca),
// ilustración animada, flecha que se dibuja, etiqueta, insignia, cámara y subtítulos.
import React from "react";
import type { Caption } from "@remotion/captions";
import { AbsoluteFill, useVideoConfig } from "remotion";
import "../marca/fuentes";
import { Fondo } from "../componentes/Fondo";
import { TextoDestacado } from "../componentes/TextoDestacado";
import { Insignia } from "../componentes/Insignia";
import { Flecha } from "../componentes/Flecha";
import { Etiqueta } from "../componentes/Etiqueta";
import { Camara } from "../componentes/Camara";
import { Aparecer } from "../componentes/Aparecer";
import { Subtitulos } from "../componentes/Subtitulos";
import { Ilustracion } from "../ilustraciones";
import { COLOR } from "../marca/tema";
import { Lupe } from "../personajes/Lupe";
import { ProveedorEscena } from "../video/contexto";

const SUBS: Caption[] = ["Esto", " es", " una", " prueba", " de", " render", " local."].map((text, i) => ({
  text,
  startMs: 250 + i * 330,
  endMs: 250 + i * 330 + 300,
  timestampMs: null,
  confidence: null,
}));

export const PruebaRender: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <ProveedorEscena inicio={0} duracion={durationInFrames} subtitulos={SUBS}>
      <AbsoluteFill style={{ backgroundColor: COLOR.fondo }}>
        <Fondo acento="lima" brillo={0.2} />
        <Camara foco={[540, 1000]} tramos={[[0, 1], [durationInFrames, 1.06]]}>
          <Aparecer desde={8} tipo="pop" style={{ position: "absolute", left: 120, top: 640, width: 300, height: 300 }}>
            <Ilustracion nombre="vaso-agua" tamano={300} />
          </Aparecer>
          <Aparecer desde={30} tipo="subir" style={{ position: "absolute", left: 90, top: 975 }}>
            <Etiqueta texto="30 fps · 1080×1920" acento="celeste" tamano={42} />
          </Aparecer>
          <Flecha de={[440, 760]} a={[600, 1010]} desde={22} duracion={16} curva={-60} color={COLOR.lima} grosor={12} />
          <div style={{ position: "absolute", left: 300, top: 980 }}>
            <Lupe pose="saluda" expresion="feliz" alto={660} mirar="izquierda" hablando semilla={2} />
          </div>
        </Camara>
        <div style={{ position: "absolute", left: 80, right: 80, top: 170, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
          <TextoDestacado texto="PRUEBA DE *RENDER*" tamano={110} acento="lima" desde={2} escalonado={4} />
          <Aparecer desde={14} tipo="pop">
            <Insignia tamano={36} />
          </Aparecer>
        </div>
        <Subtitulos subtitulos={SUBS} centroY={1430} />
      </AbsoluteFill>
    </ProveedorEscena>
  );
};
