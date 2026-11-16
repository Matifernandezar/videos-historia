import React from "react";
import { Lienzo, PALETA as P, useIdSvg, useSegundos, type PropsIlustracion } from "./comun";

// Frasco de kéfir: bebida blanca con nódulos (gránulos) flotando y burbujitas.
export const Kefir: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  const clip = useIdSvg("kefir");
  const nodulo = (x: number, y: number, k: number, i: number) => {
    const sube = Math.sin(s * 1.6 + i) * 2;
    return (
      <g key={i} transform={`translate(${x} ${y + sube}) scale(${k})`}>
        <circle cx={-7} cy={2} r={8} fill="#EADFBE" />
        <circle cx={6} cy={1} r={9} fill="#EADFBE" />
        <circle cx={0} cy={-7} r={8} fill="#F3EBD0" />
        <circle cx={-1} cy={6} r={7} fill="#DCCDA2" />
        <circle cx={2} cy={-8} r={3} fill="#FFFFFF" opacity={0.7} />
      </g>
    );
  };
  return (
    <Lienzo tamano={tamano}>
      <defs>
        <clipPath id={clip}>
          <rect x={46} y={44} width={108} height={140} rx={22} />
        </clipPath>
      </defs>
      <rect x={58} y={24} width={84} height={18} rx={6} fill="#2FBF9B" />
      <rect x={52} y={38} width={96} height={10} rx={5} fill="#22977B" />
      <rect x={46} y={44} width={108} height={140} rx={22} fill="rgba(220,235,250,0.18)" />
      <g clipPath={`url(#${clip})`}>
        <rect x={40} y={76} width={124} height={120} fill="#F4F1E8" />
        <ellipse cx={100} cy={76} rx={60} ry={7} fill="#FFFFFF" />
        <rect x={40} y={150} width={124} height={50} fill="#E7E1D0" opacity={0.6} />
        {[0, 1, 2, 3].map((i) => {
          const fase = (s * 0.5 + i * 0.26) % 1;
          return <circle key={i} cx={66 + i * 20} cy={176 - fase * 96} r={3} fill="#FFFFFF" opacity={0.8 * (1 - fase)} />;
        })}
        {nodulo(74, 80, 1, 0)}
        {nodulo(116, 82, 0.9, 1)}
        {nodulo(96, 78, 0.7, 2)}
      </g>
      <rect x={46} y={44} width={108} height={140} rx={22} fill="none" stroke="#DDF3FF" strokeWidth={6} />
      <path d="M 60 62 L 60 160" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.45} />
    </Lienzo>
  );
};

// Envase de leche genérico (sin marca).
export const Leche: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  const gota = (s * 0.8) % 1;
  return (
    <Lienzo tamano={tamano}>
      <path d="M 60 56 L 100 30 L 140 56 Z" fill="#DCE6F2" />
      <path d="M 140 56 L 160 44 L 160 70 L 140 82 Z" fill="#B9C7DA" />
      <path d="M 100 30 L 120 18 L 160 44 L 140 56 Z" fill="#EEF3F9" />
      <rect x={92} y={22} width={14} height={10} rx={3} fill="#4DD4EC" transform="rotate(-30 99 27)" />
      <rect x={60} y={56} width={80} height={130} fill={P.blanco} />
      <path d="M 140 82 L 160 70 L 160 172 L 140 186 Z" fill="#C9D3E2" />
      <path d="M 140 56 L 160 44 L 160 70 L 140 82 Z" fill="#AEBDD2" opacity={0.6} />
      <rect x={60} y={110} width={80} height={44} fill="#4DD4EC" />
      <path d={`M 100 ${120 + gota * 4} C 110 132 110 142 100 144 C 90 142 90 132 100 ${120 + gota * 4} Z`} fill="#FFFFFF" />
      <rect x={66} y={64} width={8} height={40} rx={4} fill="#FFFFFF" opacity={0.6} />
    </Lienzo>
  );
};

// Microorganismos amigables: bacilos (bastones) y levaduras (esferas con brote).
export const Microbios: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  const bacilo = (x: number, y: number, rot: number, color: string, i: number) => (
    <g key={`b${i}`} transform={`translate(${x} ${y + Math.sin(s * 2 + i) * 4}) rotate(${rot + Math.sin(s * 1.5 + i) * 8})`}>
      <rect x={-30} y={-11} width={60} height={22} rx={11} fill={color} />
      <rect x={-22} y={-6} width={22} height={5} rx={2.5} fill="#FFFFFF" opacity={0.45} />
      <path d={`M 30 0 q 10 ${-6 + Math.sin(s * 6 + i) * 4} 18 0`} stroke={color} strokeWidth={3} strokeLinecap="round" fill="none" />
    </g>
  );
  const levadura = (x: number, y: number, r: number, i: number) => (
    <g key={`l${i}`} transform={`translate(${x} ${y + Math.cos(s * 1.8 + i) * 3})`}>
      <circle cx={0} cy={0} r={r} fill={P.violeta} />
      <circle cx={r * 0.8} cy={-r * 0.7} r={r * 0.45} fill="#B5A8FF" />
      <circle cx={-r * 0.35} cy={-r * 0.35} r={r * 0.25} fill="#FFFFFF" opacity={0.4} />
    </g>
  );
  return (
    <Lienzo tamano={tamano}>
      {bacilo(70, 70, -25, P.lima, 0)}
      {bacilo(128, 112, 20, "#2FBF9B", 1)}
      {bacilo(66, 150, 10, P.lima, 2)}
      {levadura(140, 58, 20, 3)}
      {levadura(116, 168, 14, 4)}
      {[[40, 110], [100, 100], [160, 150], [94, 40]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4} fill="#FFFFFF" opacity={0.3 + 0.3 * Math.abs(Math.sin(s * 2 + i))} />
      ))}
    </Lienzo>
  );
};
