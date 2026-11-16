import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Fondo } from "../componentes/Fondo";
import { TextoDestacado } from "../componentes/TextoDestacado";
import { Flecha } from "../componentes/Flecha";
import { Etiqueta } from "../componentes/Etiqueta";
import { Camara } from "../componentes/Camara";
import { Ilustracion } from "../ilustraciones";
import { COLOR } from "../marca/tema";
import { useDisparador } from "../video/contexto";
import type { Elemento, EscenaExplicacion } from "../video/tipos";
import { posicionesPasos, useDisposicion } from "./disposicion";
import { PersonajeColocado } from "./PersonajeColocado";
import { personajeVisible } from "./visibilidad";

// Un paso del diagrama: ilustración + etiqueta, aparece cuando la voz dice su palabra.
const Paso: React.FC<{ el: Elemento; x: number; y: number; tamano: number; inicio: number; tamEtiqueta: number }> = ({ el, x, y, tamano, inicio, tamEtiqueta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - inicio, fps, config: { damping: 12, stiffness: 170, mass: 0.6 } });
  if (frame < inicio) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - tamano / 2,
        top: y - tamano / 2,
        width: tamano,
        height: tamano,
        scale: String(0.3 + 0.7 * e),
        opacity: Math.min(1, e * 1.6),
      }}
    >
      <Ilustracion nombre={el.ilustracion} tamano={tamano} />
      {el.etiqueta ? (
        <div style={{ position: "absolute", left: -200, right: -200, top: tamano * 0.98, display: "flex", justifyContent: "center" }}>
          <Etiqueta texto={el.etiqueta} acento={el.acento ?? "celeste"} tamano={tamEtiqueta} />
        </div>
      ) : null}
    </div>
  );
};

// EXPLICACIÓN: mecanismo paso a paso con flechas y acercamiento opcional.
export const Explicacion: React.FC<{ escena: EscenaExplicacion }> = ({ escena }) => {
  const d = useDisposicion();
  const pasos = escena.pasos.slice(0, 4);
  const conPersonaje = personajeVisible(escena);
  const r = conPersonaje ? d.escenario : d.escenarioAmplio;
  const pos = posicionesPasos(pasos.length, r, d.vertical);
  const n = pasos.length;
  // Disparadores (hooks en orden fijo: siempre 4).
  const fracciones = [0.02, 0.3, 0.55, 0.75];
  const i0 = useDisparador(pasos[0], fracciones[0]);
  const i1 = useDisparador(pasos[1], fracciones[1]);
  const i2 = useDisparador(pasos[2], fracciones[2]);
  const i3 = useDisparador(pasos[3], fracciones[3]);
  const inicios = [i0, i1, i2, i3].slice(0, n).map((v, i, arr) => (i > 0 ? Math.max(v, arr[i - 1] + 4) : v));
  const zoomEn = useDisparador(escena.acercarA, 0.7);
  const objetivo = escena.acercarA ? pos[Math.min(n - 1, Math.max(0, escena.acercarA.paso))] : null;
  const tamEtiqueta = (n >= 3 ? 40 : 46) * d.k;
  const acento = escena.acento ?? "celeste";
  const tieneTitulo = Boolean(escena.titulo);

  return (
    <AbsoluteFill>
      <Fondo acento={acento} />
      <Camara
        foco={objetivo ? [objetivo.x, objetivo.y] : [d.W / 2, d.H / 2]}
        tramos={objetivo ? [[0, 1], [zoomEn, 1], [zoomEn + 18, 1.55]] : [[0, 1]]}
      >
        {pos.slice(1).map((p, i) => {
          const a = pos[i];
          const dx = p.x - a.x;
          const dy = p.y - a.y;
          const largo = Math.hypot(dx, dy) || 1;
          const recorte = a.tamano * 0.55;
          if (escena.conectar === false) return null;
          return (
            <Flecha
              key={i}
              de={[a.x + (dx / largo) * recorte, a.y + (dy / largo) * recorte]}
              a={[p.x - (dx / largo) * recorte, p.y - (dy / largo) * recorte]}
              desde={inicios[i + 1] - 10}
              duracion={12}
              curva={(i % 2 === 0 ? -1 : 1) * 60 * d.k}
              color={COLOR.tinta}
              grosor={11 * d.k}
            />
          );
        })}
        {pasos.map((el, i) => (
          <Paso key={i} el={el} x={pos[i].x} y={pos[i].y} tamano={pos[i].tamano} inicio={inicios[i]} tamEtiqueta={tamEtiqueta} />
        ))}
        {conPersonaje ? (
          <PersonajeColocado conf={escena.personaje} defecto={{ pose: "explica", expresion: "feliz", lado: "centro" }} />
        ) : null}
      </Camara>
      {tieneTitulo ? (
        <div style={{ position: "absolute", left: d.lateral, right: d.lateral, top: d.titulo.top, display: "flex", justifyContent: d.vertical ? "center" : "flex-start" }}>
          <TextoDestacado texto={escena.titulo ?? ""} tamano={d.tamTituloEscena} acento={acento} alineacion={d.titulo.alineacion} anchoMax={d.titulo.anchoMax} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
