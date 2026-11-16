import React, { useId } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export type PropsIlustracion = { tamano?: number };

// Lienzo común: viewBox 200×200 y sombra en el piso, para que todo comparta escala y estilo.
export const Lienzo: React.FC<{ tamano?: number; sombra?: boolean; children: React.ReactNode }> = ({ tamano = 300, sombra = true, children }) => (
  <svg viewBox="0 0 200 200" width={tamano} height={tamano} style={{ overflow: "visible" }}>
    {sombra ? <ellipse cx={100} cy={190} rx={62} ry={8} fill="rgba(0,0,0,0.35)" /> : null}
    {children}
  </svg>
);

// Segundos transcurridos (para animaciones cíclicas por frame).
export const useSegundos = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

export const PALETA = {
  blanco: "#F4F7FB",
  gris: "#C9D3E2",
  grisOscuro: "#8E9BB0",
  agua: "#4DD4EC",
  aguaClara: "#9BEAF7",
  cafe: "#5B3420",
  cafeClaro: "#8A5634",
  rojo: "#FF5E5B",
  rojoOscuro: "#D9403D",
  verde: "#7DD957",
  verdeOscuro: "#4FAE3B",
  lima: "#B6F23E",
  ambar: "#FFC53D",
  naranja: "#FF9F43",
  rosa: "#F7A8B8",
  rosaOscuro: "#E07A93",
  piel: "#E9A27F",
  trigo: "#E3B36B",
  trigoOscuro: "#C48A3E",
  violeta: "#9B8AFB",
  tinta: "#0A1220",
};

// Id único y válido para clipPath/gradientes dentro de SVG (useId puede traer símbolos).
export const useIdSvg = (prefijo: string) => `${prefijo}-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
