import React from "react";
import { Lienzo, PALETA as P, useSegundos, type PropsIlustracion } from "./comun";

export const Reloj: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  return (
    <Lienzo tamano={tamano}>
      <circle cx={100} cy={102} r={80} fill="#2E3A4F" />
      <circle cx={100} cy={102} r={68} fill={P.blanco} />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={98} y={40} width={4} height={i % 3 === 0 ? 14 : 8} rx={2} fill="#2E3A4F" transform={`rotate(${i * 30} 100 102)`} />
      ))}
      <rect x={96} y={62} width={8} height={44} rx={4} fill="#2E3A4F" transform={`rotate(${s * 30} 100 102)`} />
      <rect x={97.5} y={46} width={5} height={60} rx={2.5} fill={P.rojo} transform={`rotate(${s * 180} 100 102)`} />
      <circle cx={100} cy={102} r={7} fill={P.rojo} />
    </Lienzo>
  );
};

export const Lupa: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  const brillo = 0.3 + 0.3 * Math.sin(s * 3);
  return (
    <Lienzo tamano={tamano}>
      <rect x={118} y={118} width={26} height={70} rx={13} fill="#FFC53D" transform="rotate(-45 131 153)" />
      <circle cx={88} cy={86} r={58} fill="rgba(160,230,255,0.38)" stroke="#E6EDF7" strokeWidth={14} />
      <path d="M 60 70 Q 68 52 88 48" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.4 + brillo} />
    </Lienzo>
  );
};

export const Balanza: React.FC<PropsIlustracion & { valor?: number }> = ({ tamano, valor = 0.6 }) => {
  const s = useSegundos();
  const aguja = -60 + 120 * valor + Math.sin(s * 6) * 4 * Math.exp(-s * 0.8);
  return (
    <Lienzo tamano={tamano}>
      <rect x={24} y={60} width={152} height={124} rx={28} fill={P.blanco} />
      <rect x={24} y={150} width={152} height={34} rx={16} fill={P.gris} />
      <rect x={60} y={74} width={80} height={52} rx={12} fill="#2E3A4F" />
      <path d="M 70 116 A 30 30 0 0 1 130 116" stroke={P.lima} strokeWidth={4} fill="none" />
      <rect x={98.5} y={88} width={3} height={28} rx={1.5} fill={P.rojo} transform={`rotate(${aguja} 100 116)`} />
      <ellipse cx={66} cy={162} rx={22} ry={8} fill={P.grisOscuro} opacity={0.5} />
      <ellipse cx={134} cy={162} rx={22} ry={8} fill={P.grisOscuro} opacity={0.5} />
    </Lienzo>
  );
};

export const Pastilla: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  const giro = Math.sin(s * 1.5) * 6;
  return (
    <Lienzo tamano={tamano}>
      <g transform={`rotate(${-35 + giro} 90 96)`}>
        <rect x={30} y={70} width={120} height={52} rx={26} fill={P.blanco} />
        <path d="M 56 70 L 90 70 L 90 122 L 56 122 A 26 26 0 0 1 56 70 Z" fill={P.rojo} />
        <rect x={40} y={78} width={44} height={8} rx={4} fill="#FFFFFF" opacity={0.45} />
      </g>
      <circle cx={146} cy={150} r={26} fill={P.ambar} />
      <path d="M 128 150 L 164 150" stroke="#C99520" strokeWidth={4} strokeLinecap="round" />
    </Lienzo>
  );
};

export const Luna: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  return (
    <Lienzo tamano={tamano} sombra={false}>
      <path d="M 120 30 C 70 34 40 74 46 120 C 52 164 96 190 140 176 C 100 168 76 136 78 100 C 80 64 100 40 120 30 Z" fill={P.ambar} />
      <path d="M 120 30 C 96 44 82 70 80 100 C 78 130 92 156 120 172 C 90 170 64 146 60 114 C 56 78 84 42 120 30 Z" fill="#FFE08A" opacity={0.5} />
      {[[150, 60, 0], [168, 110, 1], [130, 130, 2]].map(([x, y, i]) => (
        <path
          key={i}
          d={`M ${x} ${y - 10} L ${x + 3} ${y - 3} L ${x + 10} ${y} L ${x + 3} ${y + 3} L ${x} ${y + 10} L ${x - 3} ${y + 3} L ${x - 10} ${y} L ${x - 3} ${y - 3} Z`}
          fill="#FFFFFF"
          opacity={0.4 + 0.6 * Math.abs(Math.sin(s * 2 + i))}
        />
      ))}
    </Lienzo>
  );
};

export const Llama: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  const v = Math.sin(s * 8) * 4;
  return (
    <Lienzo tamano={tamano}>
      <path d={`M 100 ${14 + v} C 130 56 160 86 156 128 C 152 166 128 186 100 186 C 72 186 48 166 44 128 C 40 96 64 76 70 50 C 84 70 86 84 92 92 C 96 70 92 40 100 ${14 + v} Z`} fill={P.naranja} />
      <path d={`M 102 ${76 - v} C 120 100 136 118 132 144 C 128 168 116 178 100 178 C 84 178 70 166 68 146 C 66 126 82 112 88 98 C 94 108 96 116 100 120 C 104 106 100 92 102 ${76 - v} Z`} fill={P.ambar} />
      <ellipse cx={100} cy={160} rx={18} ry={14} fill="#FFF3C4" />
    </Lienzo>
  );
};

export const Check: React.FC<PropsIlustracion> = ({ tamano }) => (
  <Lienzo tamano={tamano} sombra={false}>
    <circle cx={100} cy={100} r={80} fill={P.lima} />
    <path d="M 62 102 L 90 130 L 142 72" stroke={P.tinta} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Lienzo>
);

export const Cruz: React.FC<PropsIlustracion> = ({ tamano }) => (
  <Lienzo tamano={tamano} sombra={false}>
    <circle cx={100} cy={100} r={80} fill={P.rojo} />
    <path d="M 70 70 L 130 130 M 130 70 L 70 130" stroke="#FFFFFF" strokeWidth={18} strokeLinecap="round" fill="none" />
  </Lienzo>
);

export const Interrogacion: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  return (
    <Lienzo tamano={tamano} sombra={false}>
      <g transform={`rotate(${Math.sin(s * 2) * 8} 100 100)`}>
        <circle cx={100} cy={100} r={80} fill={P.violeta} />
        <path d="M 74 78 Q 76 48 102 48 Q 130 50 128 76 Q 126 94 104 104 L 102 118" stroke="#FFFFFF" strokeWidth={16} strokeLinecap="round" fill="none" />
        <circle cx={102} cy={146} r={10} fill="#FFFFFF" />
      </g>
    </Lienzo>
  );
};
