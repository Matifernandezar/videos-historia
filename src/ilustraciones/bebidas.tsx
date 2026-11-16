import React from "react";
import { Lienzo, PALETA as P, useIdSvg, useSegundos, type PropsIlustracion } from "./comun";

export const VasoAgua: React.FC<PropsIlustracion & { nivel?: number }> = ({ tamano, nivel = 0.72 }) => {
  const s = useSegundos();
  const clip = useIdSvg("vaso");
  const tope = 180 - nivel * 140;
  const ola = (x: number) => tope + Math.sin(x / 14 + s * 4) * 3;
  const puntos = Array.from({ length: 13 }, (_, i) => 40 + i * 10);
  const d = `M 40 ${ola(40)} ${puntos.map((x) => `L ${x} ${ola(x)}`).join(" ")} L 160 200 L 40 200 Z`;
  return (
    <Lienzo tamano={tamano}>
      <defs>
        <clipPath id={clip}>
          <path d="M 52 32 L 148 32 L 137 180 Q 136 186 129 186 L 71 186 Q 64 186 63 180 Z" />
        </clipPath>
      </defs>
      <path d="M 52 32 L 148 32 L 137 180 Q 136 186 129 186 L 71 186 Q 64 186 63 180 Z" fill="rgba(200,235,255,0.14)" />
      <g clipPath={`url(#${clip})`}>
        <path d={d} fill={P.agua} opacity={0.88} />
        <path d={`M 40 ${ola(40)} ${puntos.map((x) => `L ${x} ${ola(x)}`).join(" ")}`} stroke={P.aguaClara} strokeWidth={5} fill="none" />
        {[0, 1, 2, 3].map((i) => {
          const fase = (s * 0.6 + i * 0.27) % 1;
          return <circle key={i} cx={78 + i * 14} cy={182 - fase * (182 - tope)} r={3 + (i % 2)} fill="#FFFFFF" opacity={0.55 * (1 - fase)} />;
        })}
      </g>
      <path d="M 52 32 L 148 32 L 137 180 Q 136 186 129 186 L 71 186 Q 64 186 63 180 Z" fill="none" stroke="#DDF3FF" strokeWidth={6} strokeLinejoin="round" />
      <path d="M 66 46 L 74 164" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.45} />
    </Lienzo>
  );
};

export const TazaCafe: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  return (
    <Lienzo tamano={tamano}>
      {[0, 1, 2].map((i) => {
        const fase = (s * 0.5 + i * 0.33) % 1;
        return (
          <path
            key={i}
            d={`M ${72 + i * 22} ${60 - fase * 34} q -10 -12 0 -24 q 10 -12 0 -24`}
            stroke="#FFFFFF"
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
            opacity={0.6 * Math.sin(fase * Math.PI)}
          />
        );
      })}
      <path d="M 148 96 C 186 92 186 150 146 148" stroke={P.blanco} strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d="M 40 74 L 156 74 L 150 168 Q 148 184 132 184 L 64 184 Q 48 184 46 168 Z" fill={P.blanco} />
      <path d="M 128 74 L 156 74 L 150 168 Q 148 184 132 184 L 120 184 Q 134 140 128 74 Z" fill={P.gris} />
      <rect x={44} y={112} width={110} height={18} fill="#2FBF9B" />
      <ellipse cx={98} cy={76} rx={58} ry={11} fill={P.cafe} />
      <ellipse cx={92} cy={74} rx={30} ry={4} fill={P.cafeClaro} opacity={0.7} />
    </Lienzo>
  );
};

export const Gaseosa: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  return (
    <Lienzo tamano={tamano}>
      <rect x={84} y={14} width={32} height={16} rx={4} fill="#2FBF9B" />
      <path d="M 86 30 L 114 30 L 116 52 Q 140 66 140 96 L 140 172 Q 140 186 126 186 L 74 186 Q 60 186 60 172 L 60 96 Q 60 66 84 52 Z" fill="rgba(200,235,255,0.18)" stroke="#DDF3FF" strokeWidth={5} />
      <path d="M 64 84 Q 100 78 136 84 L 136 172 Q 136 182 126 182 L 74 182 Q 64 182 64 172 Z" fill="#6B2A1E" />
      <rect x={60} y={110} width={80} height={38} fill={P.ambar} />
      <circle cx={84} cy={129} r={7} fill="#FFFFFF" opacity={0.85} />
      <circle cx={102} cy={124} r={5} fill="#FFFFFF" opacity={0.85} />
      <circle cx={116} cy={133} r={6} fill="#FFFFFF" opacity={0.85} />
      {[0, 1, 2].map((i) => {
        const fase = (s * 0.8 + i * 0.31) % 1;
        return <circle key={i} cx={78 + i * 20} cy={176 - fase * 80} r={3} fill="#FFFFFF" opacity={0.6 * (1 - fase)} />;
      })}
      <path d="M 70 70 L 72 100" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.4} />
    </Lienzo>
  );
};

export const Gota: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  const e = 1 + Math.sin(s * 3) * 0.03;
  return (
    <Lienzo tamano={tamano}>
      <g transform={`translate(100 110) scale(${e}) translate(-100 -110)`}>
        <path d="M 100 20 C 120 60 150 90 150 126 C 150 158 128 182 100 182 C 72 182 50 158 50 126 C 50 90 80 60 100 20 Z" fill={P.agua} />
        <path d="M 120 120 C 128 140 120 160 104 166" stroke={P.aguaClara} strokeWidth={8} strokeLinecap="round" fill="none" />
        <ellipse cx={80} cy={110} rx={8} ry={16} fill="#FFFFFF" opacity={0.5} />
      </g>
    </Lienzo>
  );
};
