import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Lupe, LUPE_ALTO, LUPE_ANCHO } from "../personajes/Lupe";
import type { PersonajeEnEscena } from "../video/tipos";
import { useDisposicion } from "./disposicion";

// Ubica a Lupe en la escena (siempre a la misma escala para mantener continuidad).
// Del lado derecho se espeja para que gesticule hacia el centro.
export const PersonajeColocado: React.FC<{
  conf?: PersonajeEnEscena;
  defecto: PersonajeEnEscena;
  escala?: number;
  base?: number;
  visibleDesdeInicio?: boolean;
  hablando?: boolean;
}> = ({ conf, defecto, escala = 1, base, visibleDesdeInicio = false, hablando }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = useDisposicion();
  const c = { ...defecto, ...(conf ?? {}) };
  if (c.oculto) return null;
  // En formato horizontal el contenido va a la izquierda: "centro" pasa a la derecha.
  const lado = !d.vertical && (c.lado ?? "centro") === "centro" ? "derecha" : (c.lado ?? "centro");
  const alto = d.personaje.alto * escala;
  const ancho = (alto * LUPE_ANCHO) / LUPE_ALTO;
  const x = d.personaje.x[lado];
  const y = base ?? d.personaje.base;
  const entrada = visibleDesdeInicio ? 1 : spring({ frame, fps, config: { damping: 15, stiffness: 120, mass: 0.8 } });
  const espejo = lado === "derecha";
  const mirar = c.mirar ?? (lado === "derecha" ? "izquierda" : lado === "izquierda" ? "derecha" : "frente");
  // Al espejar, izquierda/derecha de la mirada se invierten.
  const mirarReal = espejo ? (mirar === "izquierda" ? "derecha" : mirar === "derecha" ? "izquierda" : mirar) : mirar;
  return (
    <div
      style={{
        position: "absolute",
        left: x - ancho / 2,
        top: y - alto,
        width: ancho,
        height: alto,
        translate: `0px ${(1 - entrada) * alto * 0.35}px`,
        opacity: Math.min(1, entrada * 2),
      }}
    >
      <Lupe pose={c.pose} expresion={c.expresion} mirar={mirarReal} alto={alto} espejo={espejo} hablando={hablando} />
    </div>
  );
};
