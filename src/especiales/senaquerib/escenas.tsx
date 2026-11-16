// Escenas del Short "¿Cómo un solo ángel derrotó a 185.000 soldados?" (Versículo Oculto).
// 2 Reyes 18–19, Isaías 37, 2 Crónicas 32 y el Prisma de Taylor. Ilustraciones originales.
import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from "remotion";
import { useEscena } from "../../video/contexto";
import type { EscenaAnimada } from "../../video/tipos";
import { FUENTE_SERIFA, FUENTE_TEXTO } from "../../marca/fuentes";
import { Sfx, useMomento } from "../comun";
import { Camara, lerp, PAL, Referencia, Textura } from "../jesus-12-30/escenarios";
import { Cierre as CierreCanal, Fig, manoDe } from "../jesus-12-30/escenas";
import type { Brazo } from "../jesus-12-30/personas";

type PropsEscena = { escena: EscenaAnimada };
const cl = (v: number) => Math.max(0, Math.min(1, v));
const azar = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ---------- piezas ----------

// Cielo nocturno con estrellas (dia 0..1 lo lleva al amanecer).
export const CieloNoche: React.FC<{ dia?: number; estrellas?: number }> = ({ dia = 0, estrellas = 1 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: -1500, top: -2500, width: 4080, height: 4000, background: `linear-gradient(180deg, ${dia > 0 ? `rgb(${11 + 60 * dia},${20 + 70 * dia},${38 + 100 * dia})` : "#0B1426"} 0%, ${dia > 0 ? `rgb(${36 + 180 * dia},${57 + 120 * dia},${95 + 40 * dia})` : "#24395F"} 70%, ${dia > 0 ? `rgb(${60 + 190 * dia},${70 + 130 * dia},${90 + 40 * dia})` : "#2C3F66"} 100%)` }} />
      <svg style={{ position: "absolute", left: -1500, top: -2500, overflow: "visible", opacity: estrellas * (1 - dia) }} width={4080} height={3400}>
        {Array.from({ length: 220 }, (_, i) => (
          <circle key={i} cx={azar(i) * 4080} cy={azar(i + 500) * 3300} r={1.5 + azar(i + 900) * 2.5} fill="#F7F1E3" opacity={0.35 + 0.65 * (0.5 + 0.5 * Math.sin(f / (8 + (i % 7)) + i))} />
        ))}
      </svg>
    </>
  );
};

// Jerusalén amurallada sobre la colina. (x, y) = centro de la base de la muralla; w = ancho.
export const Murallas: React.FC<{ x: number; y: number; w: number; luz?: number; noche?: number }> = ({ x, y, w, luz = 0, noche = 1 }) => {
  const k = w / 700;
  const piedra = noche > 0.5 ? "#4A5878" : "#D9C49A";
  const sombra = noche > 0.5 ? "#36435E" : "#B8A276";
  const casa = noche > 0.5 ? "#3E4A66" : "#CDB58C";
  return (
    <svg style={{ position: "absolute", left: x - w / 2 - 100 * k, top: y - 420 * k, overflow: "visible" }} width={w + 200 * k} height={520 * k} viewBox="-100 -420 900 520">
      {/* colina */}
      <path d="M -300 100 Q 350 -120 1000 100 Z" fill={noche > 0.5 ? "#1E2A44" : "#A8946E"} />
      {/* casas y templo detrás */}
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={40 + i * 72} y={-210 - (i % 3) * 26} width={58} height={120} fill={casa} stroke={sombra} strokeWidth={3} />
      ))}
      <rect x={460} y={-330} width={190} height={130} fill={noche > 0.5 ? "#52628A" : "#E6D8B6"} />
      <path d="M 450 -330 L 555 -380 L 660 -330 Z" fill={noche > 0.5 ? "#5E6E96" : "#EFE3C4"} />
      {[480, 520, 590, 630].map((cx) => (
        <rect key={cx} x={cx} y={-320} width={12} height={110} fill={sombra} />
      ))}
      {/* ventanitas con luz */}
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={`v${i}`} x={60 + i * 90} y={-180 - (i % 3) * 26} width={14} height={18} fill="#F2C14E" opacity={0.5 * noche} />
      ))}
      {/* muralla con almenas y torres */}
      <rect x={0} y={-120} width={700} height={140} fill={piedra} />
      {Array.from({ length: 23 }, (_, i) => (
        <rect key={`a${i}`} x={i * 31} y={-146} width={18} height={28} fill={piedra} />
      ))}
      {[0, 230, 470, 680].map((tx) => (
        <g key={tx}>
          <rect x={tx - 30} y={-190} width={70} height={210} fill={piedra} stroke={sombra} strokeWidth={4} />
          {[0, 1, 2].map((j) => (
            <rect key={j} x={tx - 30 + j * 26} y={-212} width={18} height={24} fill={piedra} />
          ))}
          <rect x={tx - 2} y={-150} width={12} height={30} fill={sombra} />
        </g>
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <line key={`l${i}`} x1={0} y1={-90 + i * 20} x2={700} y2={-90 + i * 20} stroke={sombra} strokeWidth={2} opacity={0.6} />
      ))}
      {/* puerta cerrada */}
      <path d="M 320 20 L 320 -60 Q 350 -96 380 -60 L 380 20 Z" fill={noche > 0.5 ? "#2A2E3A" : "#6E4528"} />
      <line x1={350} y1={-80} x2={350} y2={20} stroke="#1E140E" strokeWidth={3} />
      {luz > 0 ? <rect x={0} y={-146} width={700} height={166} fill="#FFE2A0" opacity={0.22 * luz} /> : null}
    </svg>
  );
};

// Antorcha (punto de fuego con halo). a = 1 encendida, 0 apagada (queda un hilo de humo).
const Antorcha: React.FC<{ x: number; y: number; s: number; a: number; i: number }> = ({ x, y, s, a, i }) => {
  const f = useCurrentFrame();
  const parpadeo = 0.75 + 0.25 * Math.sin(f / 3 + i * 1.3) * Math.sin(f / 7 + i);
  return (
    <>
      {a > 0 ? (
        <>
          <circle cx={x} cy={y} r={18 * s * a} fill="rgba(255,160,60,0.22)" opacity={parpadeo} />
          <circle cx={x} cy={y} r={5 * s * a} fill="#FFD27A" opacity={parpadeo} />
        </>
      ) : null}
      {a < 1 && a > 0 ? <path d={`M ${x} ${y} q ${5 * s} ${-12 * s} 0 ${-24 * s} t 0 ${-24 * s}`} stroke="rgba(210,210,220,0.45)" strokeWidth={2 * s} fill="none" opacity={Math.sin(a * Math.PI) * 0.9} /> : null}
    </>
  );
};

// Tienda de campaña asiria (silueta).
const Tienda: React.FC<{ x: number; y: number; e: number; color?: string }> = ({ x, y, e, color = "#2A2433" }) => (
  <path d={`M ${x - 60 * e} ${y} L ${x - 40 * e} ${y - 60 * e} L ${x} ${y - 80 * e} L ${x + 40 * e} ${y - 60 * e} L ${x + 60 * e} ${y} Z`} fill={color} />
);

// Campamento: filas de tiendas y antorchas delante de la muralla. apagado(i) 0..1 → antorchas que se apagan.
const PUNTOS_CAMPO = Array.from({ length: 260 }, (_, i) => {
  const fila = Math.floor(i / 26);
  const t = (i % 26) / 25;
  const y = 1010 + fila * 46 + azar(i) * 20;
  const ancho = 700 + fila * 160;
  const x = 540 - ancho / 2 + t * ancho + (azar(i + 77) - 0.5) * 40;
  return { x, y, s: 0.8 + fila * 0.12 };
});
export const Campamento: React.FC<{ encendida: (x: number, y: number) => number; tiendas?: string }> = ({ encendida, tiendas = "#1E1A28" }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
    {PUNTOS_CAMPO.map((p, i) => (i % 3 === 0 ? <Tienda key={`t${i}`} x={p.x + 14} y={p.y + 8} e={0.45 + p.s * 0.25} color={tiendas} /> : null))}
    {PUNTOS_CAMPO.map((p, i) => (
      <Antorcha key={i} x={p.x} y={p.y} s={p.s} a={encendida(p.x, p.y)} i={i} />
    ))}
  </svg>
);

// Arquero asirio en silueta con el arco tenso (o bajo). (x, y) = pies. baja 0..1.
const Arquero: React.FC<{ x: number; y: number; e: number; baja: number; luz?: number }> = ({ x, y, e, baja, luz = 0.6 }) => {
  const rot = -18 + 48 * baja;
  const tension = 1 - baja;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={10} height={10}>
      <g transform={`scale(${e})`}>
        {/* cuerpo en silueta */}
        <path d="M -60 0 L -40 -260 Q -40 -300 0 -310 Q 40 -300 46 -260 L 60 0 Z" fill="#141A2A" stroke="#5A6A94" strokeWidth={6} />
        <circle cx={0} cy={-350} r={44} fill="#141A2A" stroke="#5A6A94" strokeWidth={6} />
        <path d="M -44 -360 L 0 -440 L 44 -360 Z" fill="#1C2336" stroke="#7A88AE" strokeWidth={6} strokeLinejoin="round" />
        <path d="M -30 -330 Q 0 -260 30 -330 L 26 -300 Q 0 -250 -26 -300 Z" fill="#0E1220" />
        {/* brazos y arco */}
        <g transform={`translate(10 -270) rotate(${rot})`}>
          <path d="M 0 0 L 230 -10" stroke="#5A6A94" strokeWidth={40} strokeLinecap="round" />
          <path d="M 0 0 L 230 -10" stroke="#141A2A" strokeWidth={30} strokeLinecap="round" />
          <path d={`M 0 0 L ${120 - 60 * tension} 20`} stroke="#5A6A94" strokeWidth={36} strokeLinecap="round" />
          <path d={`M 0 0 L ${120 - 60 * tension} 20`} stroke="#141A2A" strokeWidth={26} strokeLinecap="round" />
          {/* arco compuesto */}
          <path d="M 230 -150 Q 300 -60 245 -10 Q 300 40 230 130" stroke="#6E4528" strokeWidth={14} fill="none" strokeLinecap="round" />
          <path d="M 230 -150 Q 300 -60 245 -10 Q 300 40 230 130" stroke="#C08A55" strokeWidth={5} fill="none" opacity={luz} />
          {/* cuerda */}
          <path d={`M 230 -150 L ${230 - 150 * tension} -10 L 230 130`} stroke="#D8CDB5" strokeWidth={3} fill="none" />
          {/* flecha */}
          <g transform={`translate(${230 - 150 * tension} -10)`}>
            <line x1={0} y1={0} x2={260} y2={0} stroke="#8A6A44" strokeWidth={7} />
            <path d="M 260 -12 L 300 0 L 260 12 Z" fill="#B8B0A0" stroke="#6E6A60" strokeWidth={2} />
            <path d="M 0 0 L -24 -14 L 20 0 L -24 14 Z" fill="#B0281E" />
          </g>
        </g>
      </g>
    </svg>
  );
};

// Carro de guerra asirio (lateral) con caballo. (x, y) = piso.
const Carro: React.FC<{ x: number; y: number; e: number; rueda?: number; espejo?: boolean; color?: string }> = ({ x, y, e, rueda = 0, espejo = false, color = "#6E4528" }) => (
  <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={10} height={10}>
    <g transform={`scale(${espejo ? -e : e} ${e})`}>
      {/* caballo */}
      <path d="M 70 -120 Q 120 -150 190 -130 L 230 -190 L 250 -180 L 232 -120 Q 220 -90 190 -90 L 80 -88 Z" fill="#4A3424" />
      {[90, 120, 170, 200].map((lx, i) => (
        <line key={lx} x1={lx} y1={-92} x2={lx + Math.sin(rueda / 20 + i) * 10} y2={0} stroke="#4A3424" strokeWidth={10} strokeLinecap="round" />
      ))}
      <line x1={0} y1={-60} x2={110} y2={-100} stroke="#3A2618" strokeWidth={6} />
      {/* caja */}
      <path d="M -110 -50 L -110 -130 L 10 -130 L 20 -50 Z" fill={color} stroke="#3A2618" strokeWidth={4} />
      <rect x={-104} y={-120} width={110} height={10} fill={PAL.doradoOscuro} />
      {/* rueda */}
      <g transform={`translate(-50 -40) rotate(${rueda})`}>
        <circle r={40} fill="none" stroke="#3A2618" strokeWidth={8} />
        {[0, 1, 2, 3, 4, 5].map((r) => (
          <line key={r} x1={0} y1={0} x2={40 * Math.cos((r * Math.PI) / 3)} y2={40 * Math.sin((r * Math.PI) / 3)} stroke="#3A2618" strokeWidth={5} />
        ))}
      </g>
    </g>
  </svg>
);

// Estandarte asirio (asta con disco y cintas). caido 0..1 lo tumba.
const Estandarte: React.FC<{ x: number; y: number; e: number; caido?: number }> = ({ x, y, e, caido = 0 }) => {
  const f = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={10} height={10}>
      <g transform={`scale(${e}) rotate(${-84 * caido})`}>
        <line x1={0} y1={0} x2={0} y2={-300} stroke="#5A3E22" strokeWidth={10} />
        <circle cx={0} cy={-330} r={34} fill={PAL.doradoOscuro} stroke="#7A5A2E" strokeWidth={4} />
        <circle cx={0} cy={-330} r={14} fill="#B0281E" />
        <path d={`M 0 -296 q ${20 + Math.sin(f / 8) * 8 * (1 - caido)} 30 ${10} 70`} stroke="#B0281E" strokeWidth={8} fill="none" />
        <path d={`M 0 -296 q ${-20 - Math.sin(f / 9) * 8 * (1 - caido)} 30 ${-10} 70`} stroke="#B0281E" strokeWidth={8} fill="none" />
      </g>
    </svg>
  );
};

// Rollo con sellos de arcilla (carta de amenaza). abierto 0..1.
const Carta: React.FC<{ x: number; y: number; w: number; abierto?: number; rot?: number; plano?: number }> = ({ x, y, w, abierto = 0, rot = 0, plano = 0 }) => {
  const largo = w * (0.18 + 0.82 * abierto);
  return (
    <div style={{ position: "absolute", left: x - largo / 2, top: y - w * 0.16, width: largo, height: w * 0.32, rotate: `${rot}deg`, transform: plano > 0 ? `perspective(800px) rotateX(${62 * plano}deg)` : undefined }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#F1E2BE,#D9C392)", borderRadius: 6, boxShadow: "0 8px 20px rgba(0,0,0,0.35)" }} />
      {abierto > 0.3
        ? Array.from({ length: 5 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: "12%", right: "12%", top: `${20 + i * 14}%`, height: 3, background: "rgba(59,42,26,0.55)", opacity: (abierto - 0.3) / 0.7 }} />
          ))
        : null}
      <div style={{ position: "absolute", left: -10, top: -6, width: 22, height: "calc(100% + 12px)", borderRadius: 11, background: "#B89A68" }} />
      <div style={{ position: "absolute", right: -10, top: -6, width: 22, height: "calc(100% + 12px)", borderRadius: 11, background: "#B89A68" }} />
      {/* sellos */}
      <div style={{ position: "absolute", right: "8%", bottom: -14, width: w * 0.09, height: w * 0.09, borderRadius: "50%", background: "#9A3A24", border: "3px solid #6E2414" }} />
      <div style={{ position: "absolute", right: "20%", bottom: -10, width: w * 0.07, height: w * 0.07, borderRadius: "50%", background: "#9A3A24", border: "3px solid #6E2414" }} />
    </div>
  );
};

// Ángel: figura luminosa y sobria (silueta de luz difusa, sin rostro).
export const Angel: React.FC<{ x: number; y: number; e: number; o: number }> = ({ x, y, e, o }) => {
  const f = useCurrentFrame();
  const vaiven = Math.sin(f / 18) * 6;
  return (
    <div style={{ position: "absolute", left: x, top: y + vaiven, opacity: o }}>
      <div style={{ position: "absolute", left: -420 * e, top: -520 * e, width: 840 * e, height: 1040 * e, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,236,190,0.45) 0%, rgba(255,236,190,0.12) 45%, rgba(255,236,190,0) 70%)" }} />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        <defs>
          <linearGradient id="angelCuerpo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFBEF" stopOpacity={0.95} />
            <stop offset="0.6" stopColor="#FFEFC8" stopOpacity={0.7} />
            <stop offset="1" stopColor="#FFE2A0" stopOpacity={0} />
          </linearGradient>
          <filter id="angelBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={6} />
          </filter>
        </defs>
        <g transform={`scale(${e})`} filter="url(#angelBlur)">
          {/* alas de luz, muy tenues */}
          <path d="M -40 -190 Q -260 -260 -300 -20 Q -200 -120 -60 -110 Z M 40 -190 Q 260 -260 300 -20 Q 200 -120 60 -110 Z" fill="rgba(255,240,205,0.35)" />
          {/* túnica */}
          <path d="M 0 -230 Q 54 -230 66 -160 L 110 260 Q 0 290 -110 260 L -66 -160 Q -54 -230 0 -230 Z" fill="url(#angelCuerpo)" />
          <path d="M -20 -150 L -40 240 M 20 -150 L 36 240" stroke="rgba(255,226,170,0.5)" strokeWidth={6} />
          {/* cabeza: solo luz */}
          <circle cx={0} cy={-280} r={46} fill="rgba(255,252,240,0.95)" />
          <circle cx={0} cy={-280} r={80} fill="rgba(255,240,200,0.25)" />
        </g>
      </svg>
    </div>
  );
};

// Prisma hexagonal de arcilla con escritura cuneiforme (se ven 3 caras).
const Prisma: React.FC<{ x: number; y: number; h: number; resalto?: number }> = ({ x, y, h, resalto = 0 }) => {
  const w = h * 0.42;
  const cara = (dx: number, ancho: number, tono: string, semilla: number) => (
    <g>
      <rect x={dx} y={0} width={ancho} height={h} fill={tono} />
      {Array.from({ length: 30 }, (_, fila) =>
        Array.from({ length: Math.max(2, Math.round(ancho / 22)) }, (_, c) => {
          const px = dx + 8 + c * (ancho - 16) / Math.max(2, Math.round(ancho / 22)) + azar(fila * 31 + c + semilla) * 4;
          const py = 14 + fila * (h - 28) / 30;
          const tipo = Math.floor(azar(fila * 17 + c * 3 + semilla) * 3);
          return tipo === 0 ? (
            <path key={`${fila}-${c}`} d={`M ${px} ${py} l 10 4 l -10 4 Z`} fill="rgba(60,30,14,0.55)" />
          ) : tipo === 1 ? (
            <path key={`${fila}-${c}`} d={`M ${px} ${py} l 3 10 l 3 -10 Z`} fill="rgba(60,30,14,0.5)" />
          ) : (
            <line key={`${fila}-${c}`} x1={px} y1={py + 4} x2={px + 12} y2={py + 4} stroke="rgba(60,30,14,0.45)" strokeWidth={2} />
          );
        }),
      )}
      {Array.from({ length: 31 }, (_, fila) => (
        <line key={`r${fila}`} x1={dx + 4} y1={10 + fila * (h - 28) / 30} x2={dx + ancho - 4} y2={10 + fila * (h - 28) / 30} stroke="rgba(60,30,14,0.18)" strokeWidth={1.5} />
      ))}
    </g>
  );
  return (
    <svg style={{ position: "absolute", left: x - w, top: y - h, overflow: "visible" }} width={w * 2} height={h}>
      <ellipse cx={w} cy={h} rx={w * 1.1} ry={w * 0.18} fill="rgba(0,0,0,0.35)" />
      {cara(0, w * 0.45, "#9A5A3A", 1)}
      {cara(w * 0.45, w * 1.1, "#C07A50", 2)}
      {cara(w * 1.55, w * 0.45, "#8A4E32", 3)}
      <rect x={w * 0.45} y={0} width={w * 1.1} height={h} fill="#FFE2A0" opacity={0.18 * resalto} />
      <path d={`M 0 0 L ${w * 0.45} ${-w * 0.12} L ${w * 1.55} ${-w * 0.12} L ${w * 2} 0 L ${w * 1.55} ${w * 0.1} L ${w * 0.45} ${w * 0.1} Z`} fill="#B06A44" />
    </svg>
  );
};

// ---------- 1. EL CERCO Y LA FLECHA QUIETA ----------
const ARQ = { x: 250, y: 1720, e: 1.4 };
const Cerco: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fSoldados = useMomento("soldados", 0.2);
  const fJerusalen = useMomento("jerusalén", 0.35);
  const fNoche = useMomento("noche", 0.65);
  const fFlecha = useMomento("flecha", 0.9);
  const ola = lerp(f, fNoche - 10, fFlecha + 4, 0, 1, Easing.inOut(Easing.quad)); // ráfaga dorada que se expande desde el cielo
  const rOla = ola * 1500;
  const ORIGEN = { x: 540, y: 560 };
  const baja = lerp(f, fNoche, fFlecha + 6, 0, 1, Easing.inOut(Easing.cubic));
  const destello = Math.max(0, 1 - Math.abs(f - (fNoche + 6)) / 14);
  const desenfoque = lerp(f, fSoldados - 4, fJerusalen, 7, 0);
  return (
    <AbsoluteFill style={{ background: "#0B1426" }}>
      <Camara
        tomas={[
          { f: 0, x: 720, y: 1180, z: 3.2 },
          { f: fSoldados - 4, x: 720, y: 1180, z: 3.0 },
          { f: fJerusalen + 6, x: 540, y: 1080, z: 1.0 },
          { f: duracion, x: 540, y: 1060, z: 0.96 },
        ]}
        vaiven={0.4}
      >
        <CieloNoche />
        <div style={{ position: "absolute", left: -900, top: 960, width: 2900, height: 1600, background: "linear-gradient(180deg,#1A2236,#0E1322)" }} />
        {/* profundidad de campo: el fondo desenfocado mientras vemos la flecha de cerca */}
        <div style={{ position: "absolute", inset: 0, filter: desenfoque > 0.3 ? `blur(${desenfoque}px) brightness(${1 - desenfoque / 30})` : undefined }}>
        <Murallas x={540} y={960} w={700} />
        <Campamento encendida={(x, y) => { const d = Math.hypot(x - ORIGEN.x, y - ORIGEN.y); return rOla > d ? cl(1 - (rOla - d) / 260) : 1; }} />
        </div>
        <Arquero x={ARQ.x} y={ARQ.y} e={ARQ.e} baja={baja} />
        {/* ráfaga de luz dorada que baja en silencio */}
        {ola > 0 && ola < 1 ? <div style={{ position: "absolute", left: -900, top: -1600, width: 2900, height: 3600, background: `radial-gradient(ellipse at 50% ${(ORIGEN.y + 1600) / 36}%, rgba(255,236,190,${0.55 * Math.sin(ola * Math.PI)}) 0%, rgba(255,226,160,${0.25 * Math.sin(ola * Math.PI)}) ${10 + ola * 25}%, rgba(255,226,160,0) ${20 + ola * 40}%)` }} /> : null}
      </Camara>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 35%, rgba(255,233,176,0.75), rgba(255,233,176,0) 65%)", opacity: destello }} />
      <Textura />
      <Sfx archivo="viento" en={0} volumen={0.18} />
      <Sfx archivo="fuego" en={0} volumen={0.16} />
      <Sfx archivo="tension" en={4} volumen={0.22} />
      <Sfx archivo="apagar" en={fNoche} volumen={0.3} />
    </AbsoluteFill>
  );
};

// ---------- 2. EL AVANCE DE SENAQUERIB ----------
// Mapa ilustrativo de Judá: ciudades que van cayendo (46) hasta llegar a Jerusalén.
const JERU_MAPA = { x: 620, y: 760 };
const CIUDADES = Array.from({ length: 46 }, (_, i) => {
  const a = azar(i + 3);
  const b = azar(i + 41);
  return { x: 300 + a * 520, y: 560 + b * 640 };
}).filter((p) => Math.hypot(p.x - JERU_MAPA.x, p.y - JERU_MAPA.y) > 70);
const Avance: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fSetecientos = useMomento("setecientos", 0.08);
  const fArraso = useMomento("arrasó", 0.45);
  const fCerco = useMomento("cercó", 0.82);
  const caen = lerp(f, fArraso - 6, fCerco - 4, 0, 1, Easing.inOut(Easing.quad));
  const n = Math.floor(caen * CIUDADES.length);
  const campo = lerp(f, fCerco - 2, fCerco + 12, 0, 1);
  const cuenta = Math.round(caen * 46);
  return (
    <AbsoluteFill style={{ background: "#14223F" }}>
      <AbsoluteFill style={{ opacity: 1 - campo }}>
        <Camara tomas={[{ f: 0, x: 560, y: 900, z: 1.0 }, { f: fCerco - 6, x: 560, y: 880, z: 1.05 }, { f: fCerco + 12, x: JERU_MAPA.x, y: JERU_MAPA.y, z: 4.5 }]} vaiven={0.3}>
          {/* pergamino */}
          <div style={{ position: "absolute", left: 140, top: 420, width: 800, height: 900, borderRadius: 18, background: "linear-gradient(160deg,#F1E2BE,#DCC594 60%,#C9AE7A)", boxShadow: "0 18px 40px rgba(0,0,0,0.5)" }} />
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
            {/* mar Mediterráneo (oeste) y mar Muerto (este) */}
            <path d="M 140 420 L 300 420 Q 260 700 250 900 Q 230 1100 200 1320 L 140 1320 Z" fill="#8FAAC0" opacity={0.75} />
            <path d="M 790 640 Q 830 760 800 900 Q 770 980 760 900 Q 750 760 790 640 Z" fill="#8FAAC0" opacity={0.75} />
            <path d="M 800 420 Q 790 520 795 640" stroke="#8FAAC0" strokeWidth={6} fill="none" />
            <text x={175} y={1000} fontFamily="DejaVu Serif, serif" fontSize={26} fill="#3B4A5A" transform="rotate(-80 175 1000)">Mar Mediterráneo</text>
            <text x={840} y={1010} fontFamily="DejaVu Serif, serif" fontSize={24} fill="#3B4A5A">Mar Muerto</text>
            {/* ciudades */}
            {CIUDADES.map((c, i) => (
              <g key={i}>
                <circle cx={c.x} cy={c.y} r={9} fill="#7A5A3A" />
                {i < n ? (
                  <g opacity={cl((caen * CIUDADES.length - i) * 2)}>
                    <circle cx={c.x} cy={c.y} r={16} fill="none" stroke="#9A2A1E" strokeWidth={4} />
                    <path d={`M ${c.x - 10} ${c.y - 10} L ${c.x + 10} ${c.y + 10} M ${c.x + 10} ${c.y - 10} L ${c.x - 10} ${c.y + 10}`} stroke="#9A2A1E" strokeWidth={5} />
                  </g>
                ) : null}
              </g>
            ))}
            {/* Jerusalén */}
            <circle cx={JERU_MAPA.x} cy={JERU_MAPA.y} r={26} fill={PAL.dorado} stroke="#7A5A2E" strokeWidth={5} />
            <text x={JERU_MAPA.x + 36} y={JERU_MAPA.y + 10} fontFamily="DejaVu Serif, serif" fontWeight={700} fontSize={36} fill="#3B2A1A">Jerusalén</text>
            {/* flecha del avance asirio desde el norte */}
            <path d={`M 520 440 Q 420 ${560 + 0} 470 ${760}`} stroke="#9A2A1E" strokeWidth={10} fill="none" strokeDasharray="900" strokeDashoffset={900 * (1 - lerp(f, fSetecientos, fArraso, 0, 1))} strokeLinecap="round" opacity={0.8} />
          </svg>
          <div style={{ position: "absolute", left: 160, top: 1240, fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 24, color: "#6E5A3E" }}>mapa ilustrativo</div>
          <div style={{ position: "absolute", left: 640, top: 1150, width: 280, textAlign: "right", fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: 70, color: "#9A2A1E", opacity: cl(caen * 3) }}>{cuenta}</div>
        </Camara>
      </AbsoluteFill>
      {campo > 0 ? (
        <AbsoluteFill style={{ opacity: campo }}>
          <Camara tomas={[{ f: fCerco, x: 540, y: 1000, z: 1.25 }, { f: duracion, x: 540, y: 1020, z: 1.1 }]} vaiven={0.5}>
            <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 2000, background: "linear-gradient(180deg,#3A3248 0%,#8A5A4A 60%,#D9A070 100%)" }} />
            <div style={{ position: "absolute", left: -900, top: 980, width: 2900, height: 1600, background: "linear-gradient(180deg,#9A7A54,#6E5638)" }} />
            <Murallas x={540} y={960} w={720} noche={0} />
            {Array.from({ length: 14 }, (_, i) => (
              <svg key={i} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
                <Tienda x={60 + i * 75} y={1080 + (i % 2) * 20} e={0.8} color="#7A5A44" />
              </svg>
            ))}
            <Estandarte x={260} y={1200} e={0.9} />
            <Estandarte x={830} y={1210} e={0.9} />
            <Carro x={320} y={1330} e={1.0} rueda={f * 3} />
            <Carro x={790} y={1340} e={1.0} rueda={f * 3} espejo color="#5A3A22" />
            <Fig quien="asirio" x={470} suelo={1360} ancho={190} giro={-0.3} brazoDer={{ hombro: 20, codo: 30 }} semilla={2} />
            <Fig quien="asirio2" x={620} suelo={1370} ancho={190} giro={-0.3} semilla={5} />
          </Camara>
        </AbsoluteFill>
      ) : null}
      <Referencia texto="701 a. C. — 46 ciudades tomadas" aparece={fSetecientos} hasta={fCerco - 2} />
      <Textura />
      <Sfx archivo="tambor" en={fArraso} volumen={0.25} />
      <Sfx archivo="whoosh" en={fCerco} volumen={0.2} />
    </AbsoluteFill>
  );
};

// ---------- 3. LA CARTA EN EL TEMPLO ----------
const TemploInterior: React.FC<{ luz: number }> = ({ luz }) => (
  <>
    <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 3800, background: "linear-gradient(180deg,#141A2A 0%,#2A2433 55%,#3A2E2A 100%)" }} />
    <div style={{ position: "absolute", left: -900, top: 1300, width: 2900, height: 900, background: "linear-gradient(180deg,#4A3A2E,#2E241E)" }} />
    {[200, 880].map((x) => (
      <div key={x} style={{ position: "absolute", left: x - 70, top: 300, width: 140, height: 1020, background: "linear-gradient(90deg,#6E5A3E,#B89A68 50%,#6E5A3E)" }} />
    ))}
    {/* altar del incienso (al fondo) */}
    <div style={{ position: "absolute", left: 610, top: 1000, width: 150, height: 190, background: "linear-gradient(180deg,#E3B04B,#A9741F)", borderRadius: 6 }} />
    <div style={{ position: "absolute", left: 596, top: 986, width: 178, height: 26, background: "#C9973F", borderRadius: 5 }} />
    {[600, 750].map((x) => (
      <div key={x} style={{ position: "absolute", left: x, top: 962, width: 20, height: 30, background: "#C9973F", borderRadius: "10px 10px 2px 2px" }} />
    ))}
    {/* luz cálida desde arriba */}
    <div style={{ position: "absolute", left: 200, top: 0, width: 680, height: 1400, background: `linear-gradient(180deg, rgba(255,226,170,${0.45 * luz}), rgba(255,226,170,0))`, clipPath: "polygon(35% 0, 65% 0, 100% 100%, 0 100%)" }} />
  </>
);
const Humo: React.FC<{ x: number; y: number; alto: number; o?: number }> = ({ x, y, alto, o = 1 }) => {
  const f = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", left: x, top: y - alto, overflow: "visible", opacity: o }} width={10} height={alto}>
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M 0 ${alto} ${Array.from({ length: 12 }, (_, i) => `Q ${Math.sin(f / 14 + i + k) * (20 + i * 6)} ${alto - (i + 0.5) * alto / 12} ${Math.sin(f / 11 + i * 1.3 + k) * (14 + i * 5)} ${alto - (i + 1) * alto / 12}`).join(" ")}`} stroke="rgba(230,226,214,0.35)" strokeWidth={14 - k * 3} fill="none" strokeLinecap="round" />
      ))}
    </svg>
  );
};
const Templo3: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fEzequias = useMomento("ezequías", 0.05);
  const fEntro = useMomento("entró", 0.33);
  const fExtendio = useMomento("extendió", 0.42);
  const fOro = useMomento("oró", 0.6);
  const fIsaias = useMomento("isaías", 0.68);
  const fCiudad = useMomento("ciudad", 0.95);
  // A: el rollo pasa del mensajero a Ezequías
  const enTemplo = lerp(f, fEntro - 6, fEntro + 4, 0, 1);
  const extiende = lerp(f, fExtendio, fExtendio + 24, 0, 1, Easing.inOut(Easing.cubic));
  const ora = lerp(f, fOro - 4, fOro + 10, 0, 1);
  const enIsaias = lerp(f, fIsaias - 6, fIsaias + 4, 0, 1);
  const senala = lerp(f, fIsaias + 6, fIsaias + 20, 0, 1, Easing.out(Easing.back(1.4)));
  // A: el mensajero extiende la carta; Ezequías la toma de su mano (sin rollos flotando)
  const extiendeM = lerp(f, fEzequias, fEzequias + 14, 0, 1, Easing.out(Easing.cubic)) * (1 - lerp(f, fEntro - 22, fEntro - 10, 0, 1));
  const tomaE = lerp(f, fEzequias + 10, fEzequias + 24, 0, 1, Easing.inOut(Easing.cubic));
  const recoge = lerp(f, fEzequias + 30, fEzequias + 44, 0, 1, Easing.inOut(Easing.cubic));
  const bMens: Brazo = { hombro: 12 + 62 * extiendeM, codo: -20 + 14 * extiendeM };
  const bEzeA: Brazo = { hombro: 12 + 58 * tomaE - 30 * recoge, codo: -20 + 10 * tomaE - 70 * recoge };
  const MENS = { x: 330, suelo: 1360, a: 300 };
  const EZE = { x: 750, suelo: 1360, a: 300 };
  const mM = manoDe(MENS.x, MENS.suelo, MENS.a, bMens, 1);
  const mE = manoDe(EZE.x, EZE.suelo, EZE.a, bEzeA, -1);
  const tieneE = tomaE > 0.85;
  const carta = tieneE ? mE : mM;
  // B: entra con la carta en la mano, la extiende en el piso y ora
  const EZB = { x: 330, suelo: 1420, a: 300 };
  const bEzeB: Brazo = extiende < 1 ? { hombro: 25 - 10 * extiende, codo: -70 + 50 * extiende, mano: "abierta" } : { hombro: 15 + 130 * ora, codo: -10 + 5 * ora, mano: "abierta" };
  const mB = manoDe(EZB.x, EZB.suelo, EZB.a, { hombro: 25 - 10 * extiende, codo: -70 + 50 * extiende }, 1);
  const PISO = { x: 640, y: 1330 };
  const cartaB = { x: mB.x + (PISO.x - mB.x) * extiende, y: mB.y + (PISO.y - mB.y) * extiende };
  return (
    <AbsoluteFill>
      {enTemplo < 1 ? (
        <AbsoluteFill>
          <Camara tomas={[{ f: 0, x: 540, y: 980, z: 1.2 }, { f: fEntro - 8, x: 600, y: 960, z: 1.3 }]} vaiven={0.5}>
            <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 3800, background: "linear-gradient(180deg,#2A2433,#5A4A44 60%,#6E5A44)" }} />
            <div style={{ position: "absolute", left: -900, top: 1330, width: 2900, height: 900, background: "#4A3A2E" }} />
            {[120, 960].map((x) => (
              <div key={x} style={{ position: "absolute", left: x - 60, top: 360, width: 120, height: 980, background: "linear-gradient(90deg,#8A7454,#C9AE7A 50%,#8A7454)" }} />
            ))}
            <Fig quien="asirio" x={MENS.x} suelo={MENS.suelo} ancho={MENS.a} giro={0.5} mirada={[8, 0]} boca={{ curva: -2 }} brazoDer={bMens} semilla={3} />
            <Fig quien="ezequias" x={EZE.x} suelo={EZE.suelo} ancho={EZE.a} giro={-0.5} mirada={[-8, 2 + 4 * recoge]} cejas={{ rot: 6 }} boca={{ curva: -4 }} brazoIzq={bEzeA} semilla={1} />
            <Carta x={carta.x} y={carta.y} w={150} rot={tieneE ? -10 * recoge : 0} />
          </Camara>
        </AbsoluteFill>
      ) : null}
      {enTemplo > 0 && enIsaias < 1 ? (
        <AbsoluteFill style={{ opacity: enTemplo * (1 - enIsaias) }}>
          <Camara tomas={[{ f: fEntro, x: 520, y: 980, z: 1.05 }, { f: fOro, x: 500, y: 1060, z: 1.2 }, { f: fIsaias, x: 500, y: 1080, z: 1.25 }]} vaiven={0.4}>
            <TemploInterior luz={0.4 + 0.6 * ora} />
            <Humo x={685} y={986} alto={640} />
            <Fig quien="ezequias" x={EZB.x} suelo={EZB.suelo} ancho={EZB.a} cabeza={16 * ora} ojos={1 - 0.85 * ora} giro={0.5} mirada={[8, 8]} brazoIzq={ora > 0 ? bEzeB : { hombro: 12, codo: -20 }} brazoDer={bEzeB} semilla={1} />
            <Carta x={cartaB.x} y={cartaB.y} w={150 + 210 * extiende} abierto={extiende} plano={extiende} />
          </Camara>
        </AbsoluteFill>
      ) : null}
      {enIsaias > 0 ? (
        <AbsoluteFill style={{ opacity: enIsaias }}>
          <Camara tomas={[{ f: fIsaias, x: 540, y: 960, z: 1.15 }, { f: duracion, x: 600, y: 940, z: 1.05 }]} vaiven={0.4}>
            <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 2000, background: "linear-gradient(180deg,#3E5A86 0%,#C98A5A 75%,#E8B070 100%)" }} />
            <div style={{ position: "absolute", left: -900, top: 1050, width: 2900, height: 1500, background: "linear-gradient(180deg,#B89A68,#8A7454)" }} />
            <Murallas x={720} y={1000} w={760} noche={0} luz={0.3} />
            <Fig quien="isaias" x={300} suelo={1380} ancho={340} giro={0.45} mirada={[10, -2]} boca={{ curva: 6 }} brazoDer={{ hombro: 110 * senala, codo: 0, mano: "senala" }} brazoIzq={{ hombro: 10, codo: -60 }} semilla={4} />
          </Camara>
        </AbsoluteFill>
      ) : null}
      <Referencia texto="2 Reyes 19:14-34" aparece={fEntro} hasta={fCiudad + 10} />
      <Textura />
      <Sfx archivo="pagina" en={fExtendio} volumen={0.35} />
      <Sfx archivo="brillo" en={fOro} volumen={0.2} />
    </AbsoluteFill>
  );
};

// ---------- 4. EL ÁNGEL EN LA NOCHE ----------
const AngelNoche: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fAngel = useMomento("ángel", 0.3);
  const fPaso = useMomento("pasó", 0.38);
  const fDerribo = useMomento("derribó", 0.5);
  const fAmanecer = useMomento("amanecer", 0.72);
  const fNinive = useMomento("nínive", 0.95);
  // A: humo del incienso → cielo (paneo vertical)
  const templo = 1 - lerp(f, fAngel - 26, fAngel - 10, 0, 1);
  const baja = lerp(f, fAngel - 12, fPaso + 6, 0, 1, Easing.out(Easing.cubic));
  const ola = lerp(f, fPaso, fDerribo + 24, 0, 1, Easing.inOut(Easing.quad));
  const xOla = -300 + ola * 1800;
  const dia = lerp(f, fAmanecer - 6, fAmanecer + 24, 0, 1);
  const enAlba = dia > 0;
  const retira = lerp(f, fAmanecer + 6, duracion, 0, 1, Easing.in(Easing.quad));
  return (
    <AbsoluteFill style={{ background: "#0B1426" }}>
      <Camara
        tomas={[
          { f: 0, x: 540, y: 220, z: 1.0 },
          { f: fAngel - 10, x: 540, y: 260, z: 1.0 },
          { f: fPaso + 4, x: 540, y: 900, z: 1.0 },
          { f: fAmanecer, x: 540, y: 980, z: 1.05 },
          { f: duracion, x: 600, y: 1000, z: 1.1 },
        ]}
        vaiven={0.3}
      >
        <CieloNoche dia={dia} />
        {/* campamento dormido */}
        <div style={{ position: "absolute", left: -900, top: 1000, width: 2900, height: 1700, background: enAlba ? `linear-gradient(180deg, rgb(${60 + 120 * dia},${60 + 90 * dia},${70 + 50 * dia}), rgb(${40 + 90 * dia},${36 + 70 * dia},${40 + 40 * dia}))` : "linear-gradient(180deg,#1E2A44,#141A2A)" }} />
        <Murallas x={540} y={1010} w={520} noche={dia > 0.5 ? 0 : 1} luz={dia} />
        {!enAlba || dia < 1 ? (
          <div style={{ opacity: 1 - dia }}>
            <Campamento encendida={(x) => (xOla > x ? cl(1 - (xOla - x) / 120) : 1)} tiendas="#141826" />
          </div>
        ) : null}
        {/* armas y estandartes abandonados al amanecer */}
        {enAlba ? (
          <div style={{ opacity: dia }}>
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
              {Array.from({ length: 18 }, (_, i) => {
                const x = 60 + i * 56 + azar(i) * 30;
                const y = 1150 + azar(i + 9) * 230;
                return i % 3 === 0 ? (
                  <ellipse key={i} cx={x} cy={y} rx={30} ry={14} fill="#8A7454" stroke="#5A4630" strokeWidth={3} />
                ) : (
                  <line key={i} x1={x - 50} y1={y} x2={x + 50} y2={y - 10 + azar(i + 4) * 20} stroke="#5A4630" strokeWidth={6} strokeLinecap="round" />
                );
              })}
            </svg>
            <Estandarte x={300} y={1300} e={0.7} caido={1} />
            <Estandarte x={760} y={1340} e={0.7} caido={1} />
            {/* los carros de Senaquerib se retiran hacia Nínive */}
            <div style={{ position: "absolute", left: 0, top: 0, scale: String(1 - 0.6 * retira), transformOrigin: "980px 1060px" }}>
              <Carro x={620 + retira * 260} y={1250} e={0.8} rueda={f * 6} />
              <Carro x={760 + retira * 260} y={1220} e={0.7} rueda={f * 6} color="#5A3A22" />
            </div>
            <div style={{ position: "absolute", left: 760, top: 1000, fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: 44, color: PAL.crema, opacity: lerp(f, fNinive - 8, fNinive + 4, 0, 1), textShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>Nínive →</div>
          </div>
        ) : null}
        {/* el ángel desciende y la luz recorre el campamento */}
        <Angel x={540} y={200 + 700 * baja} e={0.8} o={baja * (1 - dia)} />
        {ola > 0 && ola < 1 ? <div style={{ position: "absolute", left: xOla - 300, top: 900, width: 600, height: 640, background: "radial-gradient(ellipse, rgba(255,226,160,0.5) 0%, rgba(255,226,160,0.18) 40%, rgba(255,226,160,0) 70%)" }} /> : null}
      </Camara>
      {/* comienzo: en el templo, la cámara sigue el humo del incienso hacia arriba y se abre al cielo */}
      {templo > 0 ? (
        <AbsoluteFill style={{ opacity: templo }}>
          <Camara tomas={[{ f: 0, x: 640, y: 1080, z: 1.25 }, { f: fAngel - 10, x: 680, y: 160, z: 1.25 }]} vaiven={0.2}>
            <TemploInterior luz={0.7} />
            <Humo x={685} y={986} alto={1300} />
          </Camara>
        </AbsoluteFill>
      ) : null}
      {/* cartel de la cifra con la referencia */}
      {(() => {
        const o = lerp(f, fDerribo, fDerribo + 8, 0, 1) * (1 - lerp(f, fAmanecer - 4, fAmanecer + 4, 0, 1));
        if (o <= 0) return null;
        return (
          <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", opacity: o, scale: String(0.9 + 0.1 * o) }}>
            <div style={{ fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: 88, color: PAL.dorado, textShadow: "0 0 30px rgba(242,193,78,0.5), 0 6px 16px rgba(0,0,0,0.6)" }}>185.000</div>
            <div style={{ fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 42, color: PAL.crema }}>soldados (2 Reyes 19:35)</div>
          </div>
        );
      })()}
      <Textura />
      <Sfx archivo="viento" en={fAngel - 6} volumen={0.15} />
      <Sfx archivo="brillo" en={fAngel} volumen={0.3} />
      <Sfx archivo="apagar" en={fPaso + 4} volumen={0.25} />
    </AbsoluteFill>
  );
};

// ---------- 5. EL PRISMA DE ARCILLA ----------
const PrismaEscena: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fHallaron = useMomento("hallaron", 0.15);
  const fEscribio = useMomento("escribió", 0.42);
  const fJaula = useMomento("jaula", 0.66);
  const fNunca = useMomento("nunca", 0.75);
  const fConquisto = useMomento("conquistó", 0.9);
  const polvo = 1 - lerp(f, 0, 18, 0, 1);
  const prisma = lerp(f, 6, 22, 0, 1);
  const linea = lerp(f, fHallaron - 4, fHallaron + 16, 0, 1) * (1 - lerp(f, fEscribio - 4, fEscribio + 4, 0, 1));
  const jaula = lerp(f, fJaula - 4, fJaula + 10, 0, 1);
  const aparta = lerp(f, fJaula - 12, fJaula + 4, 0, 1, Easing.inOut(Easing.cubic));
  const intacta = lerp(f, fNunca, fConquisto, 0, 1);
  const manana = lerp(f, fConquisto - 4, duracion - 10, 0, 1);
  return (
    <AbsoluteFill style={{ background: "#14223F" }}>
      <Camara
        tomas={[
          { f: 0, x: 540, y: 900, z: 1.1 },
          { f: fEscribio - 4, x: 540, y: 880, z: 1.0 },
          { f: fEscribio + 10, x: 540, y: 760, z: 2.4 },
          { f: fJaula - 10, x: 540, y: 980, z: 2.4 },
          { f: fJaula + 6, x: 540, y: 900, z: 1.0 },
          { f: duracion, x: 540, y: 900, z: 0.95 },
        ]}
        vaiven={0.3}
      >
        {/* fondo: de la sala oscura a las murallas al sol de la mañana */}
        <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 3800, background: "radial-gradient(ellipse at 50% 40%, #3E5A86 0%, #14223F 50%, #0B1426 90%)" }} />
        <div style={{ opacity: manana }}>
          <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 2100, background: "linear-gradient(180deg,#7A9AC0 0%,#F0D9A8 80%,#F6C98A 100%)" }} />
          <div style={{ position: "absolute", left: -900, top: 1150, width: 2900, height: 1500, background: "#B89A68" }} />
          <div style={{ position: "absolute", left: 540 - 180, top: 420, width: 360, height: 360, borderRadius: 180, background: "radial-gradient(circle, #FFF2C8 0%, rgba(255,242,200,0) 70%)" }} />
          <Murallas x={540} y={1160} w={980} noche={0} luz={0.6} />
        </div>
        {/* polvo que se convierte en arcilla */}
        {polvo > 0 ? (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: polvo }} width={10} height={10}>
            {Array.from({ length: 90 }, (_, i) => (
              <circle key={i} cx={540 + (azar(i) - 0.5) * 900 * (1 - prisma * 0.7)} cy={900 + (azar(i + 3) - 0.5) * 1100 * (1 - prisma * 0.7)} r={3 + azar(i + 7) * 6} fill="#C9A27A" opacity={0.6} />
            ))}
          </svg>
        ) : null}
        <div style={{ opacity: prisma, translate: `0px ${(1 - prisma) * 40}px` }}>
          <div style={{ position: "absolute", inset: 0, translate: `${-300 * aparta}px 0px`, scale: String(1 - 0.32 * aparta), transformOrigin: "540px 1260px" }}>
            <Prisma x={540} y={1260} h={760} resalto={jaula * (1 - aparta)} />
          </div>
        </div>
        {/* jaula simbólica sobre Jerusalén, con la puerta intacta */}
        {jaula > 0 ? (
          <div style={{ position: "absolute", left: 540 - 230 + 180 * aparta, top: 640, width: 460, height: 420, opacity: jaula * (1 - manana * 0.7) }}>
            <div style={{ position: "absolute", left: 0, top: 0, scale: "0.62", transformOrigin: "0 0" }}>
              <Murallas x={370} y={600} w={560} noche={0} luz={intacta} />
            </div>
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={460} height={420}>
              <path d="M 20 400 L 20 140 Q 230 -40 440 140 L 440 400" stroke={PAL.crema} strokeWidth={6} fill="none" opacity={0.9} />
              {Array.from({ length: 9 }, (_, i) => (
                <line key={i} x1={20 + i * 52.5} y1={400} x2={20 + i * 52.5} y2={140 - Math.sin((i / 8) * Math.PI) * 120} stroke={PAL.crema} strokeWidth={4} opacity={0.85} />
              ))}
              <line x1={20} y1={400} x2={440} y2={400} stroke={PAL.crema} strokeWidth={6} />
              <circle cx={230} cy={20} r={14} fill="none" stroke={PAL.crema} strokeWidth={5} />
            </svg>
            <div style={{ position: "absolute", left: 0, right: 0, top: 430, textAlign: "center", fontFamily: FUENTE_SERIFA, fontStyle: "italic", fontSize: 40, color: PAL.crema, textShadow: "0 4px 10px rgba(0,0,0,0.6)" }}>«como a un pájaro en una jaula»</div>
          </div>
        ) : null}
      </Camara>
      {/* línea temporal 701 a. C. → 1830 */}
      {linea > 0 ? (
        <div style={{ position: "absolute", left: 200, top: 1280, width: 680, opacity: linea }}>
          <div style={{ position: "absolute", left: 0, top: 30, width: 680 * cl(linea * 1.4), height: 8, borderRadius: 4, background: PAL.dorado }} />
          <div style={{ position: "absolute", left: -20, top: 14, width: 40, height: 40, borderRadius: 20, background: PAL.dorado }} />
          <div style={{ position: "absolute", left: -160, top: -60, width: 320, textAlign: "center", whiteSpace: "nowrap", fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: 52, color: PAL.crema }}>701 a. C.</div>
          <div style={{ opacity: linea >= 0.7 ? 1 : 0 }}>
            <div style={{ position: "absolute", left: 660, top: 14, width: 40, height: 40, borderRadius: 20, background: PAL.crema }} />
            <div style={{ position: "absolute", left: 540, top: -60, width: 280, textAlign: "center", fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: 52, color: PAL.crema }}>1830</div>
            <div style={{ position: "absolute", left: 520, top: 62, width: 320, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 30, color: PAL.pergamino }}>hallado en Nínive</div>
          </div>
        </div>
      ) : null}
      <Referencia texto="Prisma de Taylor · Museo Británico" aparece={fHallaron} hasta={fJaula - 10} />
      <Textura />
      <Sfx archivo="piedra" en={8} volumen={0.3} />
      <Sfx archivo="brillo" en={fNunca} volumen={0.25} />
    </AbsoluteFill>
  );
};

// ---------- 6. CIERRE: el resplandor sobre las murallas → libro ----------
const Cierre: React.FC<PropsEscena> = (p) => {
  const f = useCurrentFrame();
  const libro = lerp(f, 12, 24, 0, 1);
  const luz = lerp(f, 0, 14, 0, 1);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - libro }}>
        <Camara tomas={[{ f: 0, x: 540, y: 900, z: 0.95 }, { f: 24, x: 540, y: 860, z: 1.4 }]}>
          <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 2100, background: "linear-gradient(180deg,#7A9AC0 0%,#F0D9A8 80%,#F6C98A 100%)" }} />
          <div style={{ position: "absolute", left: -900, top: 1150, width: 2900, height: 1500, background: "#B89A68" }} />
          <Murallas x={540} y={1160} w={980} noche={0} luz={0.8} />
        </Camara>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(255,233,176,1), rgba(255,233,176,0) 70%)", opacity: luz }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: libro }}>
        <Sequence from={-14} layout="none">
          <CierreCanal {...p} />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ESCENAS_SENAQUERIB: Record<string, React.FC<{ escena: EscenaAnimada }>> = {
  "senaquerib/cerco": Cerco,
  "senaquerib/avance": Avance,
  "senaquerib/templo": Templo3,
  "senaquerib/angel": AngelNoche,
  "senaquerib/prisma": PrismaEscena,
  "senaquerib/cierre": Cierre,
};
