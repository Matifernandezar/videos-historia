import React from "react";
import { Lienzo, PALETA as P, useSegundos, type PropsIlustracion } from "./comun";

export const Manzana: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  return (
    <Lienzo tamano={tamano}>
      <path d="M 100 56 C 70 36 30 52 32 104 C 34 152 66 188 100 176 C 134 188 166 152 168 104 C 170 52 130 36 100 56 Z" fill={P.rojo} />
      <path d="M 140 70 C 162 90 164 140 140 168 C 156 140 156 100 140 70 Z" fill={P.rojoOscuro} opacity={0.7} />
      <ellipse cx={66} cy={92} rx={10} ry={20} fill="#FFFFFF" opacity={0.35} transform="rotate(20 66 92)" />
      <path d="M 100 58 Q 98 36 106 22" stroke={P.cafe} strokeWidth={7} strokeLinecap="round" fill="none" />
      <g transform={`rotate(${Math.sin(s * 2) * 6} 106 36)`}>
        <path d="M 106 36 C 120 16 146 18 152 26 C 140 42 118 46 106 36 Z" fill={P.verde} />
      </g>
    </Lienzo>
  );
};

export const PlatoSaludable: React.FC<PropsIlustracion> = ({ tamano }) => (
  <Lienzo tamano={tamano}>
    <rect x={10} y={60} width={8} height={100} rx={4} fill={P.gris} />
    <path d="M 6 60 L 6 84 M 14 60 L 14 84 M 22 60 L 22 84" stroke={P.gris} strokeWidth={4} strokeLinecap="round" />
    <path d="M 186 60 Q 198 96 188 112 L 188 160" stroke={P.gris} strokeWidth={9} strokeLinecap="round" fill="none" />
    <circle cx={100} cy={110} r={78} fill={P.blanco} />
    <circle cx={100} cy={110} r={64} fill="#E6ECF4" />
    <path d="M 100 110 L 100 46 A 64 64 0 0 0 36 110 Z" fill={P.verde} />
    <path d="M 100 110 L 36 110 A 64 64 0 0 0 100 174 Z" fill={P.verdeOscuro} />
    <path d="M 100 110 L 100 174 A 64 64 0 0 0 164 110 Z" fill={P.trigo} />
    <path d="M 100 110 L 164 110 A 64 64 0 0 0 100 46 Z" fill={P.naranja} />
    {[[62, 82], [78, 66], [56, 100], [64, 132], [80, 150], [52, 122]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={7} fill={i % 2 ? P.lima : "#3E9B30"} />
    ))}
    {[[118, 132], [132, 146], [140, 124], [120, 156]].map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx={6} ry={4} fill={P.trigoOscuro} />
    ))}
    <path d="M 116 70 Q 134 64 146 84 Q 132 96 116 88 Z" fill={P.rojoOscuro} opacity={0.6} />
  </Lienzo>
);

export const Pan: React.FC<PropsIlustracion> = ({ tamano }) => (
  <Lienzo tamano={tamano}>
    <path d="M 26 150 C 18 96 50 64 100 64 C 150 64 182 96 174 150 Q 172 176 146 176 L 54 176 Q 28 176 26 150 Z" fill={P.trigo} />
    <path d="M 150 72 C 172 92 180 120 174 150 Q 172 176 146 176 L 130 176 C 156 150 160 110 150 72 Z" fill={P.trigoOscuro} opacity={0.6} />
    {[60, 90, 120].map((x) => (
      <path key={x} d={`M ${x} 84 Q ${x + 14} 100 ${x + 6} 120`} stroke={P.trigoOscuro} strokeWidth={8} strokeLinecap="round" fill="none" />
    ))}
    <ellipse cx={64} cy={96} rx={14} ry={6} fill="#FFFFFF" opacity={0.25} />
  </Lienzo>
);

export const Azucar: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  const cubo = (x: number, y: number, k: string) => (
    <g key={k} transform={`translate(${x} ${y})`}>
      <path d="M 0 14 L 30 0 L 60 14 L 30 28 Z" fill="#FFFFFF" />
      <path d="M 0 14 L 30 28 L 30 64 L 0 50 Z" fill={P.gris} />
      <path d="M 60 14 L 30 28 L 30 64 L 60 50 Z" fill="#E3E9F2" />
    </g>
  );
  const brillo = 0.5 + 0.5 * Math.sin(s * 5);
  return (
    <Lienzo tamano={tamano}>
      {cubo(40, 112, "a")}
      {cubo(100, 112, "b")}
      {cubo(70, 70, "c")}
      <path d="M 150 50 L 154 62 L 166 66 L 154 70 L 150 82 L 146 70 L 134 66 L 146 62 Z" fill={P.ambar} opacity={brillo} />
      <path d="M 40 60 L 42 66 L 48 68 L 42 70 L 40 76 L 38 70 L 32 68 L 38 66 Z" fill={P.ambar} opacity={1 - brillo} />
    </Lienzo>
  );
};

export const Huevo: React.FC<PropsIlustracion> = ({ tamano }) => (
  <Lienzo tamano={tamano}>
    <path d="M 40 120 C 20 90 50 54 86 64 C 110 40 160 52 162 92 C 190 110 176 160 140 160 C 120 182 70 180 60 160 C 30 160 26 134 40 120 Z" fill={P.blanco} />
    <circle cx={102} cy={112} r={32} fill={P.ambar} />
    <circle cx={102} cy={112} r={32} fill="none" stroke={P.naranja} strokeWidth={6} opacity={0.6} />
    <ellipse cx={92} cy={100} rx={9} ry={6} fill="#FFFFFF" opacity={0.7} />
  </Lienzo>
);

export const Palta: React.FC<PropsIlustracion> = ({ tamano }) => (
  <Lienzo tamano={tamano}>
    <path d="M 100 18 C 130 18 140 60 154 94 C 172 136 150 184 100 184 C 50 184 28 136 46 94 C 60 60 70 18 100 18 Z" fill="#3E6B2A" />
    <path d="M 100 30 C 124 30 132 66 144 96 C 160 132 140 172 100 172 C 60 172 40 132 56 96 C 68 66 76 30 100 30 Z" fill="#CFE58A" />
    <path d="M 100 40 C 120 40 126 70 136 96 C 150 128 134 162 100 162 C 66 162 50 128 64 96 C 74 70 80 40 100 40 Z" fill="#E5F2A8" />
    <circle cx={100} cy={122} r={28} fill={P.cafeClaro} />
    <ellipse cx={92} cy={112} rx={8} ry={5} fill="#FFFFFF" opacity={0.35} />
  </Lienzo>
);

export const Salero: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  const sacudida = Math.sin(s * 9) * 4;
  return (
    <Lienzo tamano={tamano}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const fase = (s * 0.9 + i * 0.17) % 1;
        const x = 40 + (i % 3) * 10 + fase * 6;
        const y = 70 + fase * 100;
        return <rect key={i} x={x} y={y} width={6} height={6} fill="#FFFFFF" opacity={1 - fase} transform={`rotate(45 ${x + 3} ${y + 3})`} />;
      })}
      <g transform={`rotate(${-38 + sacudida} 110 120)`}>
        <path d="M 76 52 Q 110 30 144 52 L 144 66 L 76 66 Z" fill={P.grisOscuro} />
        {[96, 110, 124].map((x) => (
          <circle key={x} cx={x} cy={50} r={3} fill={P.tinta} />
        ))}
        <path d="M 72 66 L 148 66 L 156 172 Q 156 184 144 184 L 76 184 Q 64 184 64 172 Z" fill="rgba(220,235,250,0.3)" stroke="#DDF3FF" strokeWidth={5} />
        <path d="M 68 120 L 152 120 L 155 172 Q 155 182 144 182 L 76 182 Q 65 182 65 172 Z" fill="#FFFFFF" />
      </g>
    </Lienzo>
  );
};
