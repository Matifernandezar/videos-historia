import React from "react";
import { Lienzo, PALETA as P, useSegundos, useIdSvg, type PropsIlustracion } from "./comun";

// Estrella simple (símbolo del premio en los rodillos).
const Estrella: React.FC<{ x: number; y: number; r: number; color: string }> = ({ x, y, r, color }) => {
  const puntos = Array.from({ length: 10 }, (_, i) => {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.45;
    return `${x + rr * Math.cos(ang)},${y + rr * Math.sin(ang)}`;
  }).join(" ");
  return <polygon points={puntos} fill={color} />;
};

// Tragamonedas genérica de dos rodillos: a la izquierda la estrella quedó en la línea de pago;
// a la derecha se frenó justo arriba (un "casi acierto"). La línea de pago titila.
export const Tragamonedas: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  const clip = useIdSvg("rodillos");
  const temblor = Math.sin(s * 10) * 2 * Math.exp(-((s % 3) * 1.5));
  const brillo = 0.55 + 0.45 * Math.abs(Math.sin(s * 3));
  return (
    <Lienzo tamano={tamano}>
      {/* palanca */}
      <rect x={168} y={70} width={8} height={56} rx={4} fill={P.grisOscuro} />
      <circle cx={172} cy={66} r={11} fill={P.rojo} />
      {/* cuerpo */}
      <rect x={22} y={34} width={146} height={150} rx={22} fill={P.violeta} />
      <rect x={22} y={150} width={146} height={34} rx={16} fill="#7A69E0" />
      <rect x={40} y={20} width={110} height={26} rx={13} fill={P.ambar} />
      {/* ventana de rodillos */}
      <defs>
        <clipPath id={clip}>
          <rect x={38} y={56} width={114} height={84} rx={12} />
        </clipPath>
      </defs>
      <rect x={38} y={56} width={114} height={84} rx={12} fill={P.blanco} />
      <g clipPath={`url(#${clip})`}>
        <line x1={95} y1={56} x2={95} y2={140} stroke={P.gris} strokeWidth={3} />
        {/* rodillo izquierdo: estrella en la línea */}
        <Estrella x={66} y={98} r={20} color={P.ambar} />
        <circle cx={66} cy={58} r={9} fill={P.rojo} />
        <circle cx={66} cy={138} r={9} fill={P.verde} />
        {/* rodillo derecho: estrella apenas arriba de la línea */}
        <g transform={`translate(0 ${temblor})`}>
          <Estrella x={124} y={66} r={20} color={P.ambar} />
          <circle cx={124} cy={106} r={10} fill={P.verde} />
          <circle cx={124} cy={142} r={9} fill={P.rojo} />
        </g>
      </g>
      {/* línea de pago */}
      <line x1={34} y1={98} x2={156} y2={98} stroke={P.rojo} strokeWidth={4} strokeDasharray="8 6" opacity={brillo} />
      {/* bandeja */}
      <rect x={60} y={160} width={70} height={12} rx={6} fill="#2E3A4F" />
    </Lienzo>
  );
};

// Pila de monedas; una moneda cae y se va (la plata que se pierde).
export const Monedas: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  const t = (s % 2.4) / 2.4;
  const caida = 30 + t * 150;
  const opacidad = t < 0.75 ? 1 : 1 - (t - 0.75) / 0.25;
  return (
    <Lienzo tamano={tamano}>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <ellipse cx={86} cy={170 - i * 18} rx={44} ry={13} fill="#C99520" />
          <rect x={42} y={158 - i * 18} width={88} height={12} fill="#C99520" />
          <ellipse cx={86} cy={158 - i * 18} rx={44} ry={13} fill={P.ambar} />
        </g>
      ))}
      <ellipse cx={86} cy={86} rx={26} ry={6} fill="#FFE08A" opacity={0.6} />
      <g opacity={opacidad} transform={`translate(150 ${caida}) rotate(${t * 200})`}>
        <circle cx={0} cy={0} r={18} fill={P.ambar} stroke="#C99520" strokeWidth={4} />
        <circle cx={0} cy={0} r={10} fill="none" stroke="#C99520" strokeWidth={3} />
      </g>
    </Lienzo>
  );
};

// Gráfico de saldo que baja (línea coral que se dibuja) mientras una flecha lima sigue subiendo (las ganas).
export const SaldoBaja: React.FC<PropsIlustracion> = ({ tamano }) => {
  const s = useSegundos();
  const avance = Math.min(1, s / 1.6);
  const largo = 260;
  return (
    <Lienzo tamano={tamano}>
      <rect x={20} y={28} width={160} height={150} rx={20} fill="#1B2638" />
      {[60, 96, 132].map((y) => (
        <line key={y} x1={34} y1={y} x2={166} y2={y} stroke="#2E3A4F" strokeWidth={2} />
      ))}
      <path
        d="M 36 54 L 70 76 L 96 68 L 124 112 L 146 104 L 164 154"
        stroke={P.rojo}
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={largo}
        strokeDashoffset={largo * (1 - avance)}
      />
      <circle cx={164} cy={154} r={8} fill={P.rojo} opacity={avance >= 1 ? 1 : 0} />
    </Lienzo>
  );
};
