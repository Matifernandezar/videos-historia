import React from "react";
import { Lienzo, PALETA as P, useSegundos, type PropsIlustracion } from "./comun";

export const Cerebro: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  const pulso = 0.5 + 0.5 * Math.sin(s * 4);
  return (
    <Lienzo tamano={tamano}>
      <path d="M 100 40 C 70 26 36 40 34 72 C 16 86 20 120 38 132 C 40 158 70 170 92 160 L 100 158 L 108 160 C 130 170 160 158 162 132 C 180 120 184 86 166 72 C 164 40 130 26 100 40 Z" fill={P.rosa} />
      <path d="M 100 40 L 100 158" stroke={P.rosaOscuro} strokeWidth={6} strokeLinecap="round" />
      <g stroke={P.rosaOscuro} strokeWidth={6} strokeLinecap="round" fill="none">
        <path d="M 52 70 Q 70 64 76 80 Q 84 96 66 104" />
        <path d="M 46 120 Q 62 116 72 128" />
        <path d="M 84 52 Q 90 66 82 74" />
        <path d="M 148 70 Q 130 64 124 80 Q 116 96 134 104" />
        <path d="M 154 120 Q 138 116 128 128" />
        <path d="M 116 52 Q 110 66 118 74" />
        <path d="M 84 126 Q 90 140 80 148" />
        <path d="M 116 126 Q 110 140 120 148" />
      </g>
      <path d="M 90 160 Q 96 182 112 186" stroke={P.rosaOscuro} strokeWidth={14} strokeLinecap="round" fill="none" />
      <circle cx={140} cy={56} r={8} fill={P.ambar} opacity={pulso} />
      <circle cx={58} cy={150} r={6} fill={P.ambar} opacity={1 - pulso} />
    </Lienzo>
  );
};

export const Estomago: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  const e = 1 + Math.sin(s * 2.4) * 0.025;
  return (
    <Lienzo tamano={tamano}>
      <path d="M 92 14 L 92 52" stroke={P.rosaOscuro} strokeWidth={22} strokeLinecap="round" />
      <g transform={`translate(110 110) scale(${e}) translate(-110 -110)`}>
        <path d="M 82 46 C 82 30 104 30 106 46 C 108 66 112 74 132 74 C 170 74 180 116 164 144 C 146 176 92 186 64 164 C 50 154 48 138 60 132 C 72 126 84 138 96 136 C 110 134 92 100 86 86 C 82 76 82 60 82 46 Z" fill={P.rosa} />
        <path d="M 132 74 C 170 74 180 116 164 144 C 150 168 112 180 84 172 C 120 170 156 150 150 112 C 148 96 140 82 132 74 Z" fill={P.rosaOscuro} opacity={0.55} />
        <g stroke={P.rosaOscuro} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.8}>
          <path d="M 108 100 Q 124 94 136 106" />
          <path d="M 104 120 Q 124 114 144 126" />
          <path d="M 96 146 Q 116 140 134 150" />
        </g>
      </g>
      <path d="M 66 162 Q 50 178 40 186" stroke={P.rosaOscuro} strokeWidth={16} strokeLinecap="round" fill="none" />
    </Lienzo>
  );
};

export const Intestino: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  const desplaz = (s * 30) % 60;
  return (
    <Lienzo tamano={tamano}>
      <path d="M 52 176 L 52 64 Q 52 36 80 36 L 120 36 Q 148 36 148 64 L 148 160" stroke="#E8957A" strokeWidth={28} strokeLinecap="round" fill="none" />
      <path d="M 52 176 L 52 64 Q 52 36 80 36 L 120 36 Q 148 36 148 64 L 148 160" stroke="#F3B49C" strokeWidth={10} strokeLinecap="round" fill="none" strokeDasharray="6 22" />
      <path
        d="M 76 70 Q 100 56 124 70 Q 132 86 110 90 Q 80 92 80 108 Q 82 124 110 122 Q 132 122 124 140 Q 112 156 86 150"
        stroke="#F6B2A0"
        strokeWidth={16}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 76 70 Q 100 56 124 70 Q 132 86 110 90 Q 80 92 80 108 Q 82 124 110 122 Q 132 122 124 140 Q 112 156 86 150"
        stroke="#FFFFFF"
        strokeOpacity={0.35}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
        strokeDasharray="10 50"
        strokeDashoffset={-desplaz}
      />
    </Lienzo>
  );
};

export const Corazon: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  const fase = (s * 1.2) % 1;
  const latido = 1 + (fase < 0.15 ? Math.sin((fase / 0.15) * Math.PI) * 0.08 : fase < 0.3 ? Math.sin(((fase - 0.15) / 0.15) * Math.PI) * 0.05 : 0);
  return (
    <Lienzo tamano={tamano}>
      <g transform={`translate(100 108) scale(${latido}) translate(-100 -108)`}>
        <path d="M 100 172 C 40 130 20 100 26 70 C 32 40 70 30 100 62 C 130 30 168 40 174 70 C 180 100 160 130 100 172 Z" fill={P.rojo} />
        <path d="M 150 50 C 172 62 178 96 152 124 C 140 138 122 150 100 168 C 140 130 160 100 150 50 Z" fill={P.rojoOscuro} opacity={0.6} />
        <ellipse cx={62} cy={74} rx={12} ry={18} fill="#FFFFFF" opacity={0.35} transform="rotate(-30 62 74)" />
      </g>
    </Lienzo>
  );
};

export const Pesa: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  const y = Math.sin(s * 3) * 6;
  return (
    <Lienzo tamano={tamano}>
      <g transform={`translate(0 ${y}) rotate(-12 100 110)`}>
        <rect x={40} y={102} width={120} height={16} rx={8} fill={P.grisOscuro} />
        <rect x={22} y={70} width={26} height={80} rx={8} fill="#2E3A4F" />
        <rect x={152} y={70} width={26} height={80} rx={8} fill="#2E3A4F" />
        <rect x={8} y={82} width={18} height={56} rx={6} fill="#43536E" />
        <rect x={174} y={82} width={18} height={56} rx={6} fill="#43536E" />
        <rect x={26} y={76} width={6} height={60} rx={3} fill="#FFFFFF" opacity={0.2} />
      </g>
    </Lienzo>
  );
};
