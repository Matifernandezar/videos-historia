import React from "react";
import { Lienzo, PALETA as P, useSegundos, type PropsIlustracion } from "./comun";

// Copa genérica con líquido ámbar que se mece (bebida alcohólica, sin marca).
export const Copa: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  const ola = Math.sin(s * 3) * 4;
  return (
    <Lienzo tamano={tamano}>
      <rect x={96} y={120} width={8} height={52} rx={4} fill={P.gris} />
      <ellipse cx={100} cy={176} rx={36} ry={8} fill={P.gris} />
      <path d="M 52 30 L 148 30 C 148 86 128 122 100 122 C 72 122 52 86 52 30 Z" fill="rgba(200,225,255,0.22)" stroke={P.blanco} strokeWidth={5} />
      <path d={`M 57 ${62 + ola} Q 100 ${54 - ola} 143 ${62 - ola} C 140 98 124 117 100 117 C 76 117 60 98 57 ${62 + ola} Z`} fill={P.ambar} />
      <circle cx={84} cy={92} r={4} fill="#FFE08A" opacity={0.8} />
      <circle cx={112} cy={80} r={3} fill="#FFE08A" opacity={0.7} />
      <path d="M 66 40 Q 64 70 74 92" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.35} />
    </Lienzo>
  );
};

// Tarjeta de recuerdo: con imagen (sol y montaña) o vacía con borde punteado.
const Tarjeta: React.FC<{ x: number; y: number; giro: number; llena: boolean; opacidad?: number }> = ({ x, y, giro, llena, opacidad = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${giro})`} opacity={opacidad}>
    {llena ? (
      <>
        <rect x={-30} y={-36} width={60} height={72} rx={6} fill={P.blanco} />
        <rect x={-24} y={-30} width={48} height={46} rx={3} fill={P.agua} />
        <circle cx={10} cy={-18} r={7} fill={P.ambar} />
        <path d="M -24 16 L -8 -6 L 4 6 L 12 -2 L 24 16 Z" fill={P.verdeOscuro} />
      </>
    ) : (
      <rect x={-30} y={-36} width={60} height={72} rx={6} fill="rgba(255,255,255,0.08)" stroke={P.gris} strokeWidth={4} strokeDasharray="8 6" />
    )}
  </g>
);

// Laguna parcial: "islas" de recuerdos con huecos entre ellas.
export const RecuerdosIslas: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  const f = 0.5 + 0.5 * Math.sin(s * 2.2);
  return (
    <Lienzo tamano={tamano}>
      <Tarjeta x={40} y={104} giro={-8} llena />
      <Tarjeta x={100} y={96} giro={3} llena={false} opacidad={0.6 + 0.4 * f} />
      <Tarjeta x={160} y={106} giro={9} llena />
    </Lienzo>
  );
};

// Laguna total: todas las tarjetas vacías, que se desvanecen.
export const RecuerdosVacio: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  const f = 0.65 + 0.2 * Math.sin(s * 1.6);
  return (
    <Lienzo tamano={tamano}>
      <Tarjeta x={40} y={104} giro={-8} llena={false} opacidad={f} />
      <Tarjeta x={100} y={96} giro={3} llena={false} opacidad={f + 0.15} />
      <Tarjeta x={160} y={106} giro={9} llena={false} opacidad={f} />
    </Lienzo>
  );
};
