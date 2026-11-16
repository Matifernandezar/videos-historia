// "La repartición de África" · escenas 1 a 4: gancho (regla y compás), revolución industrial,
// penetración al interior y Conferencia de Berlín. Ilustraciones originales, animadas por frames.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import type { EscenaAnimada } from "../../video/tipos";
import { useEscena } from "../../video/contexto";
import { FUENTE_SERIFA, FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { Camara, Capa, Textura, lerp, type Toma } from "../jesus-12-30/escenarios";
import { Polvo, RayosDeLuz, azar } from "../ambiente";
import { Sfx, useMomento, useResorte } from "../comun";
import { Caballero, Chispas, Compas, H, Humo, ManoGala, MapaAfrica, Placa, Regla, Rotulito, cl } from "../historia/piezas";

export type PropsEscena = { escena: EscenaAnimada };
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fuera = Easing.out(Easing.cubic);

// Tomas con frames estrictamente crecientes aunque dos disparadores caigan juntos.
export const tomasSeguras = (t: Toma[]): Toma[] => {
  const s: Toma[] = [];
  t.forEach((p, i) => s.push(i === 0 ? p : { ...p, f: Math.max(p.f, s[i - 1].f + 2) }));
  return s;
};
// Recorrido por puntos clave [frame, x, y] con suavizado.
const ruta = (f: number, k: [number, number, number][]): [number, number] => {
  if (f <= k[0][0]) return [k[0][1], k[0][2]];
  for (let i = 0; i < k.length - 1; i++) {
    if (f <= k[i + 1][0]) {
      const t = Easing.inOut(Easing.cubic)(cl((f - k[i][0]) / Math.max(1, k[i + 1][0] - k[i][0])));
      return [k[i][1] + (k[i + 1][1] - k[i][1]) * t, k[i][2] + (k[i + 1][2] - k[i][2]) * t];
    }
  }
  const u = k[k.length - 1];
  return [u[1], u[2]];
};
// Color pleno que tapa o destapa la pantalla (para los cortes por coincidencia entre escenas).
export const Fundido: React.FC<{ color: string; o: number }> = ({ color, o }) => (o <= 0 ? null : <AbsoluteFill style={{ background: color, opacity: cl(o), pointerEvents: "none" }} />);
export const METAL = "radial-gradient(ellipse 120% 80% at 50% 55%, #FFE9A8 0%, #FFB23A 30%, #F0641E 62%, #B3202F 100%)";
export const HUMO_GRIS = "linear-gradient(180deg, #4B4F58 0%, #6A6A6E 50%, #5A554F 100%)";
export const PAPEL = "radial-gradient(ellipse at 50% 45%, #F4ECD8 0%, #E3D2A6 70%, #CDB888 100%)";

// ================= 1. GANCHO: REGLA Y COMPÁS =================
const Comensal: React.FC<{ x: number; y: number; rot: number; pelo?: string; semilla?: number; luz?: number }> = ({ x, y, rot, pelo = "#2A1F18", semilla = 0, luz = 1 }) => {
  const f = useCurrentFrame();
  const m = Math.sin(f / 37 + semilla * 3) * 4;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={10} height={10}>
      <g transform={`rotate(${rot}) translate(${m} 0)`}>
        <ellipse cx={0} cy={34} rx={128} ry={74} fill="#0E111C" />
        <path d="M -118 14 Q 0 -44 118 14" stroke="#E8A45A" strokeWidth={5} fill="none" opacity={0.5 * luz} />
        <path d="M -24 -30 L 0 14 L 24 -30 Z" fill="#E9E4D6" opacity={0.9} />
        <ellipse cx={-74} cy={-84 + Math.sin(f / 23 + semilla) * 3} rx={28} ry={19} fill="#D8A988" />
        <rect x={-100} y={-70} width={50} height={22} rx={6} fill="#EDE8DA" />
        <ellipse cx={78} cy={-80} rx={28} ry={19} fill="#D8A988" />
        <rect x={54} y={-66} width={50} height={22} rx={6} fill="#EDE8DA" />
        <circle cx={0} cy={0} r={48} fill={pelo} />
        <ellipse cx={0} cy={-20} rx={30} ry={20} fill="#D8A988" opacity={0.85} />
      </g>
    </svg>
  );
};

const SillaVacia: React.FC<{ x: number; y: number; luz: number }> = ({ x, y, luz }) => (
  <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={10} height={10}>
    <defs>
      <radialGradient id="sv-luz" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFE2A6" stopOpacity={0.75} />
        <stop offset="100%" stopColor="#FFE2A6" stopOpacity={0} />
      </radialGradient>
    </defs>
    <ellipse cx={0} cy={10} rx={300} ry={230} fill="url(#sv-luz)" opacity={luz} />
    <rect x={-104} y={-84} width={208} height={190} rx={26} fill="#3A1810" stroke="#1E0B07" strokeWidth={6} />
    <rect x={-84} y={-66} width={168} height={140} rx={18} fill={H.carmesiOscuro} />
    <rect x={-84} y={-66} width={168} height={140} rx={18} fill={H.carmesi} opacity={0.35 + 0.5 * luz} />
    {[-50, 0, 50].map((dx) => [-30, 20].map((dy) => <circle key={`${dx}${dy}`} cx={dx} cy={dy} r={5} fill="#2A0A0F" opacity={0.6} />))}
    <rect x={-116} y={92} width={232} height={44} rx={18} fill="#4A2014" stroke="#1E0B07" strokeWidth={6} />
    <path d="M -100 112 L 100 112" stroke={H.dorado} strokeWidth={3} opacity={0.5 + 0.5 * luz} />
  </svg>
);

const LineaRoja: React.FC<{ p0: [number, number]; p1: [number, number]; t: number; pulso?: number }> = ({ p0, p1, t, pulso = 0 }) => {
  if (t <= 0) return null;
  const x = p0[0] + (p1[0] - p0[0]) * t;
  const y = p0[1] + (p1[1] - p0[1]) * t;
  return (
    <g>
      <line x1={p0[0]} y1={p0[1]} x2={x} y2={y} stroke="#FF3B2E" strokeWidth={22 + pulso * 16} strokeLinecap="round" opacity={0.35 + pulso * 0.3} filter="url(#g-brillo)" />
      <line x1={p0[0]} y1={p0[1]} x2={x} y2={y} stroke={H.carmesi} strokeWidth={9} strokeLinecap="round" />
      <line x1={p0[0]} y1={p0[1]} x2={x} y2={y} stroke="#FF8A6B" strokeWidth={3} strokeLinecap="round" opacity={0.9} />
    </g>
  );
};

const A0: [number, number] = [180, 870];
const A1: [number, number] = [900, 985];
const B0: [number, number] = [548, 600];
const B1: [number, number] = [575, 1300];
const EXTRA: [[number, number], [number, number]][] = [
  [[330, 690], [820, 1130]],
  [[240, 1050], [770, 1160]],
  [[700, 640], [860, 900]],
  [[380, 1220], [660, 700]],
];

const Gancho: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fB = Math.max(96, useMomento("dividido", 0.22));
  const fSala = Math.max(fB + 50, useMomento("sala", 0.42));
  const fSin = Math.max(fSala + 44, useMomento("presencia", 0.58) - 8);
  const fFront = Math.max(fSin + 50, useMomento("creando", 0.74));
  const fConf = useMomento("conflictos", 0.9);
  const fSale = fB + 56;
  const angA = (Math.atan2(A1[1] - A0[1], A1[0] - A0[0]) * 180) / Math.PI;
  const angB = (Math.atan2(B1[1] - B0[1], B1[0] - B0[0]) * 180) / Math.PI;
  const punta = ruta(f, [
    [0, A0[0] + 300, A0[1] - 420],
    [9, A0[0], A0[1]],
    [15, A0[0], A0[1]],
    [58, A1[0], A1[1]],
    [64, A1[0], A1[1]],
    [fB - 8, B0[0] + 40, B0[1] - 60],
    [fB, B0[0], B0[1]],
    [fB + 5, B0[0], B0[1]],
    [fB + 44, B1[0], B1[1]],
    [fSale, B1[0], B1[1]],
    [fSale + 30, 1700, 900],
  ]);
  const alzada = f < 9 ? 1 - f / 9 : f > 60 && f < fB ? Math.sin((Math.PI * (f - 60)) / Math.max(1, fB - 60)) : 0;
  const tA = lerp(f, 15, 58, 0, 1);
  const tB = lerp(f, fB + 5, fB + 44, 0, 1);
  const rAng = interpolate(f, [64, fB - 12], [angA, angB], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  const rPos = ruta(f, [
    [0, A0[0] - 700, A0[1] + 260],
    [8, A0[0] - 60, A0[1] - 2],
    [64, A0[0] - 60, A0[1] - 2],
    [fB - 12, B0[0] - 6, B0[1] - 60],
    [fSale, B0[0] - 6, B0[1] - 60],
    [fSale + 30, -900, 1500],
  ]);
  const luzSilla = lerp(f, fSin, fSin + 24, 0, 1) * (1 - lerp(f, fFront, fFront + 20, 0, 0.6));
  const pulso = f > fConf ? 0.5 + 0.5 * Math.sin((f - fConf) / 3.2) : 0;
  const parpadeo = 0.9 + 0.1 * Math.sin(f / 3.1) * Math.sin(f / 7.3);
  const zFin = Math.max(fFront + 60, duracion - 18);
  const tomas = tomasSeguras([
    { f: 0, x: 540, y: 930, z: 1.34 },
    { f: 70, x: 540, y: 930, z: 1.2 },
    { f: fSala, x: 540, y: 930, z: 1.16 },
    { f: fSala + 40, x: 540, y: 960, z: 0.84 },
    { f: fSin, x: 540, y: 1000, z: 0.86 },
    { f: fSin + 30, x: 540, y: 1600, z: 1.12 },
    { f: fFront, x: 540, y: 1580, z: 1.14 },
    { f: fFront + 26, x: 540, y: 930, z: 1.12 },
    { f: zFin, x: 540, y: 930, z: 1.22 },
    { f: duracion, x: 540, y: 930, z: 7 },
  ]);
  return (
    <AbsoluteFill style={{ background: "#07080F" }}>
      <Camara tomas={tomas} vaiven={0.6}>
        {/* piso de la sala */}
        <Capa k={0.92}>
          <div style={{ position: "absolute", left: -700, top: -700, width: 2480, height: 3320, background: "repeating-linear-gradient(90deg, #15101A 0 118px, #110D15 118px 122px)" }} />
        </Capa>
        {/* mesa de caoba */}
        <div style={{ position: "absolute", left: -70, top: 150, width: 1220, height: 1640, borderRadius: 80, background: `linear-gradient(100deg, ${H.caoba} 0%, ${H.caobaClara} 46%, ${H.caoba} 100%)`, boxShadow: "0 0 0 14px #2A100A, 0 40px 120px rgba(0,0,0,0.8)" }} />
        <svg style={{ position: "absolute", left: -70, top: 150, opacity: 0.35 }} width={1220} height={1640}>
          {Array.from({ length: 30 }, (_, i) => (
            <path key={i} d={`M ${30 + i * 40} 40 Q ${30 + i * 40 + (azar(i) - 0.5) * 70} 820 ${30 + i * 40 + (azar(i + 7) - 0.5) * 40} 1600`} stroke="#2A0F08" strokeWidth={2 + azar(i + 3) * 3} fill="none" />
          ))}
        </svg>
        {/* lámparas de gas: charcos de luz cálida */}
        {[[90, 330], [990, 330], [90, 1620], [990, 1620]].map(([lx, ly], i) => (
          <div key={i} style={{ position: "absolute", left: lx - 430, top: ly - 430, width: 860, height: 860, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,190,110,0.5) 0%, rgba(255,160,80,0.16) 42%, rgba(255,150,70,0) 70%)", mixBlendMode: "screen", opacity: parpadeo * (0.85 + 0.15 * Math.sin(f / 11 + i * 2)) }} />
        ))}
        {[[90, 330], [990, 330], [90, 1620], [990, 1620]].map(([lx, ly], i) => (
          <div key={`l${i}`} style={{ position: "absolute", left: lx - 34, top: ly - 34, width: 68, height: 68, borderRadius: "50%", background: "radial-gradient(circle, #FFF6D8 0%, #FFC870 45%, #B08D57 62%, #5E4520 100%)", boxShadow: "0 0 50px rgba(255,200,120,0.9)" }} />
        ))}
        {/* diplomáticos alrededor */}
        <Comensal x={250} y={92} rot={180} semilla={1} />
        <Comensal x={545} y={84} rot={180} pelo="#8A8A8A" semilla={2} />
        <Comensal x={840} y={92} rot={180} pelo="#3A2A1A" semilla={3} />
        <Comensal x={-128} y={560} rot={90} pelo="#5A5048" semilla={4} />
        <Comensal x={-128} y={960} rot={90} semilla={5} />
        <Comensal x={-128} y={1360} rot={90} pelo="#9A9A9A" semilla={6} />
        <Comensal x={1208} y={560} rot={-90} semilla={7} />
        <Comensal x={1208} y={960} rot={-90} pelo="#6A5A4A" semilla={8} />
        <Comensal x={1208} y={1360} rot={-90} semilla={9} />
        <Comensal x={210} y={1850} rot={0} pelo="#3A2A1A" semilla={10} luz={0.6} />
        <Comensal x={870} y={1850} rot={0} pelo="#7A7A7A" semilla={11} luz={0.6} />
        <SillaVacia x={540} y={1850} luz={luzSilla} />
        {/* mapa en pergamino */}
        <div style={{ position: "absolute", left: 96, top: 462, width: 888, height: 920, transform: "rotate(-1.4deg)", background: PAPEL, borderRadius: 6, boxShadow: "0 18px 50px rgba(0,0,0,0.65), inset 0 0 90px rgba(107,74,43,0.45)" }} />
        <MapaAfrica x={172} y={540} escala={0.8} estilo="pergamino" rios={0.55} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <defs>
            <filter id="g-brillo" x="-30%" y="-300%" width="160%" height="700%">
              <feGaussianBlur stdDeviation={10} />
            </filter>
          </defs>
          {/* rosa de los vientos */}
          <g transform="translate(860 1270)" opacity={0.55} stroke={H.sepia} fill="none" strokeWidth={3}>
            <circle r={44} />
            <path d="M 0 -62 L 10 0 L 0 62 L -10 0 Z M -62 0 L 0 10 L 62 0 L 0 -10 Z" fill={H.sepia} fillOpacity={0.4} />
          </g>
          <LineaRoja p0={A0} p1={A1} t={tA} pulso={pulso} />
          <LineaRoja p0={B0} p1={B1} t={tB} pulso={pulso} />
          {EXTRA.map(([p0, p1], i) => (
            <LineaRoja key={i} p0={p0} p1={p1} t={lerp(f, fFront + 16 + i * 9, fFront + 34 + i * 9, 0, 1, fuera)} pulso={pulso} />
          ))}
          {/* marca del pinchazo */}
          {f >= 9 ? <circle cx={A0[0]} cy={A0[1]} r={7} fill="#2A0A0F" /> : null}
          {f >= fB ? <circle cx={B0[0]} cy={B0[1]} r={7} fill="#2A0A0F" /> : null}
        </svg>
        {/* herramientas y manos */}
        <Capa k={1.05}>
          <div style={{ position: "absolute", left: rPos[0], top: rPos[1], transform: `rotate(${rAng}deg)`, transformOrigin: "0 0" }}>
            <div style={{ position: "absolute", left: 0, top: 8 }}>
              <Regla largo={800} />
            </div>
            <div style={{ position: "absolute", left: 230, top: 44 }}>
              <ManoGala rot={158 - rAng} />
            </div>
          </div>
          <div style={{ position: "absolute", left: punta[0], top: punta[1], transform: `translate(${alzada * 14}px, ${-alzada * 26}px) scale(${1 + alzada * 0.1})`, transformOrigin: "0 0" }}>
            <div style={{ position: "absolute", left: 14, top: 12, width: 60, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.4)", filter: "blur(6px)", opacity: 1 - alzada }} />
            <div style={{ transform: "rotate(14deg)", transformOrigin: "0 0", position: "absolute", left: 0, top: 0 }}>
              <Compas apertura={30} largo={330} />
              <div style={{ position: "absolute", left: 86, top: -350 }}>
                <ManoGala rot={-52} />
              </div>
            </div>
          </div>
        </Capa>
        {/* primer plano desenfocado: tulipa de una lámpara y humo de cigarro */}
        <Capa k={1.35}>
          <div style={{ position: "absolute", left: -260, top: -160, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,214,150,0.5) 0%, rgba(255,180,100,0.18) 50%, rgba(0,0,0,0) 72%)", filter: "blur(22px)" }} />
          <Humo x={1010} y={1500} n={6} alto={900} ancho={70} color="#9A8E84" semilla={4} fuerza={0.35} viento={-0.1} />
        </Capa>
      </Camara>
      <Polvo x={60} y={200} ancho={960} alto={1400} n={22} color="#FFE2B0" semilla={2} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 95% 75% at 50% 48%, rgba(0,0,0,0) 45%, rgba(4,4,10,0.72) 100%)", pointerEvents: "none" }} />
      <Textura fuerza={0.8} />
      <Fundido color={METAL} o={lerp(f, duracion - 12, duracion - 2, 0, 1)} />
      <Sfx archivo="marca" en={8} volumen={0.5} />
      <Sfx archivo="tabla" en={16} volumen={0.3} />
      <Sfx archivo="marca" en={fB - 1} volumen={0.42} />
      <Sfx archivo="tabla" en={fB + 6} volumen={0.26} />
      <Sfx archivo="tension" en={fSin} volumen={0.2} />
      <Sfx archivo="whoosh" en={duracion - 18} volumen={0.3} />
    </AbsoluteFill>
  );
};

// ================= 2. SEGUNDA REVOLUCIÓN INDUSTRIAL =================
const Engranaje: React.FC<{ x: number; y: number; r: number; giro: number; color?: string; dientes?: number }> = ({ x, y, r, giro, color = "#141821", dientes = 12 }) => (
  <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={10} height={10}>
    <g transform={`rotate(${giro})`}>
      {Array.from({ length: dientes }, (_, i) => (
        <rect key={i} x={-r * 0.13} y={-r * 1.18} width={r * 0.26} height={r * 0.36} rx={4} fill={color} transform={`rotate(${(i * 360) / dientes})`} />
      ))}
      <circle r={r} fill={color} />
      <circle r={r * 0.62} fill="none" stroke="#2B313D" strokeWidth={r * 0.12} />
      {[0, 60, 120].map((a) => (
        <rect key={a} x={-r * 0.07} y={-r * 0.9} width={r * 0.14} height={r * 1.8} fill="#2B313D" transform={`rotate(${a})`} />
      ))}
      <circle r={r * 0.2} fill="#3B434D" />
    </g>
  </svg>
);

const Fabricas: React.FC<{ y: number; color: string; semilla: number; ventanas?: boolean; escala?: number }> = ({ y, color, semilla, ventanas, escala = 1 }) => {
  const f = useCurrentFrame();
  const bloques = Array.from({ length: 9 }, (_, i) => ({ x: -380 + i * 230 + azar(semilla + i) * 60, w: 170 + azar(semilla + i * 3) * 90, h: 150 + azar(semilla + i * 5) * 170, chim: azar(semilla + i * 7) > 0.35 }));
  return (
    <svg style={{ position: "absolute", left: 0, top: y, overflow: "visible" }} width={10} height={10}>
      <g transform={`scale(${escala})`}>
        {bloques.map((b, i) => (
          <g key={i}>
            {b.chim ? <path d={`M ${b.x + b.w * 0.3 - 16} ${-b.h} L ${b.x + b.w * 0.3 - 11} ${-b.h - 250} L ${b.x + b.w * 0.3 + 11} ${-b.h - 250} L ${b.x + b.w * 0.3 + 16} ${-b.h} Z`} fill={color} /> : null}
            <path d={`M ${b.x} 0 L ${b.x} ${-b.h} L ${b.x + b.w / 3} ${-b.h - 46} L ${b.x + b.w / 3} ${-b.h} L ${b.x + (2 * b.w) / 3} ${-b.h - 46} L ${b.x + (2 * b.w) / 3} ${-b.h} L ${b.x + b.w} ${-b.h - 46} L ${b.x + b.w} 0 Z`} fill={color} />
            {ventanas
              ? Array.from({ length: 6 }, (_, k) => (
                  <rect key={k} x={b.x + 18 + (k % 3) * (b.w / 3.4)} y={-b.h + 30 + Math.floor(k / 3) * 60} width={24} height={36} fill="#FFB347" opacity={0.45 + 0.4 * Math.sin(f / 9 + i * 3 + k)} />
                ))
              : null}
          </g>
        ))}
      </g>
    </svg>
  );
};

const Medallon: React.FC<{ x: number; y: number; aparece: number; texto: string; children: React.ReactNode }> = ({ x, y, aparece, texto, children }) => {
  const f = useCurrentFrame();
  const e = useResorte(aparece, { damping: 13 });
  if (f < aparece) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(0.5 + 0.5 * e), opacity: Math.min(1, e * 1.6), textAlign: "center" }}>
      <svg width={190} height={190} viewBox="-95 -95 190 190">
        <circle r={88} fill={H.pergamino} stroke={H.dorado} strokeWidth={8} />
        <circle r={74} fill="none" stroke={H.sepia} strokeWidth={2} strokeDasharray="3 6" />
        <g stroke={H.tinta} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round">
          {children}
        </g>
      </svg>
      <div style={{ marginTop: 4, fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 32, color: H.pergamino, textShadow: "0 3px 10px rgba(0,0,0,0.9)", whiteSpace: "nowrap" }}>{texto}</div>
    </div>
  );
};

const Industria: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fAnios = useMomento("entre", 0.12);
  const fRev = useMomento("Impulsado", 0.3);
  const fMat = Math.max(fRev + 40, useMomento("materias", 0.52));
  const fCaucho = useMomento("caucho", 0.6);
  const fMin = useMomento("minerales", 0.65);
  const fAceite = useMomento("aceite", 0.7);
  const fMerc = useMomento("mercados", 0.8);
  const mapa = lerp(f, fMat - 10, fMat + 30, 0, 1);
  const tomas = tomasSeguras([
    { f: 0, x: 600, y: 1690, z: 3.2 },
    { f: 56, x: 540, y: 1300, z: 1.3 },
    { f: fMat - 12, x: 540, y: 1260, z: 1.22 },
    { f: fMat + 34, x: 540, y: 960, z: 1 },
    { f: duracion, x: 540, y: 950, z: 1.04 },
  ]);
  const flujo = (f * 7) % 240;
  return (
    <AbsoluteFill style={{ background: H.noche }}>
      <Camara tomas={tomas} vaiven={0.7}>
        <Capa k={0.3}>
          <div style={{ position: "absolute", left: -600, top: -500, width: 2280, height: 2700, background: `linear-gradient(180deg, #060A18 0%, ${H.noche} 40%, #3A1F2E 68%, #8A3A24 86%, #D9703A 100%)` }} />
          <Chispas x={-200} y={-200} ancho={1500} alto={1400} n={40} color="#F4ECD8" semilla={3} sube={false} tam={1.6} />
        </Capa>
        <Capa k={0.55}>
          <Fabricas y={1300} color="#1B2238" semilla={11} escala={0.8} />
          <Humo x={150} y={880} n={8} alto={700} ancho={90} color="#4A4F60" semilla={1} fuerza={0.8} />
          <Humo x={640} y={900} n={8} alto={760} ancho={100} color="#4A4F60" semilla={2} fuerza={0.8} />
        </Capa>
        {/* el humo se funde con el mapa de África */}
        <Capa k={0.8}>
          <MapaAfrica x={172} y={420} escala={0.8} estilo="noche" opacidad={mapa * 0.92} rios={0.5} />
        </Capa>
        <Fabricas y={1480} color="#0F1322" semilla={4} ventanas />
        <Humo x={110} y={1010} n={9} alto={640} ancho={80} color="#59606B" semilla={5} />
        <Humo x={560} y={1040} n={9} alto={620} ancho={85} color="#59606B" semilla={6} />
        <Humo x={990} y={1020} n={9} alto={640} ancho={80} color="#59606B" semilla={7} />
        <Engranaje x={170} y={1500} r={150} giro={f * 1.1} />
        <Engranaje x={398} y={1560} r={84} giro={-f * 1.96 + 12} color="#1A1F2B" dientes={8} />
        {/* flechas: materias primas hacia Europa, productos hacia África */}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d="M 420 1010 C 300 1150 260 1260 300 1400" stroke={H.dorado} strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray="26 20" strokeDashoffset={-f * 4} opacity={lerp(f, fMat + 20, fMat + 40, 0, 0.95)} />
          <path d="M 760 1400 C 840 1260 800 1130 690 1020" stroke={H.pergamino} strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray="26 20" strokeDashoffset={-f * 4} opacity={lerp(f, fMerc, fMerc + 20, 0, 0.9)} />
          <path d="M 690 1020 l 44 6 m -44 -6 l 14 42" stroke={H.pergamino} strokeWidth={9} fill="none" strokeLinecap="round" opacity={lerp(f, fMerc, fMerc + 20, 0, 0.9)} />
          <path d="M 300 1400 l -30 -34 m 30 34 l 34 -28" stroke={H.dorado} strokeWidth={9} fill="none" strokeLinecap="round" opacity={lerp(f, fMat + 20, fMat + 40, 0, 0.95)} />
        </svg>
        <Medallon x={230} y={600} aparece={fCaucho} texto="Caucho">
          <path d="M -10 50 L -10 -40 M 14 50 L 14 -40 M -10 -6 L 14 10 M -10 -26 L 14 -10" />
          <path d="M -44 -36 Q 0 -78 48 -36 Q 20 -50 2 -40 Q -20 -52 -44 -36 Z" fill={H.selva} />
          <path d="M 14 14 Q 34 18 36 34 a 9 9 0 1 0 0.1 0" fill={H.tinta} />
        </Medallon>
        <Medallon x={540} y={520} aparece={fMin} texto="Minerales">
          <path d="M -40 -12 L -18 -40 L 18 -40 L 40 -12 L 0 46 Z M -40 -12 L 40 -12 M -18 -40 L -6 -12 L 0 46 L 6 -12 L 18 -40" fill="#BFE3F2" />
        </Medallon>
        <Medallon x={850} y={600} aparece={fAceite} texto="Aceite de palma">
          <path d="M 0 52 Q -6 0 2 -22" />
          <path d="M 2 -22 Q -40 -52 -58 -18 M 2 -22 Q 40 -56 58 -20 M 2 -22 Q -18 -66 -40 -56 M 2 -22 Q 22 -66 44 -54 M 2 -22 Q 0 -62 4 -70" stroke={H.selva} strokeWidth={7} />
          <circle cx={-8} cy={-8} r={7} fill={H.ocre} />
          <circle cx={10} cy={-4} r={7} fill={H.ocre} />
        </Medallon>
        {/* colada de metal fundido en primer plano */}
        <Capa k={1.2}>
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <defs>
              <linearGradient id="in-metal" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FFE9A8" />
                <stop offset="45%" stopColor="#FFB23A" />
                <stop offset="100%" stopColor="#E0491A" />
              </linearGradient>
              <filter id="in-brillo" x="-20%" y="-60%" width="140%" height="220%">
                <feGaussianBlur stdDeviation={26} />
              </filter>
            </defs>
            <path d="M -300 1560 L 1380 1700 L 1380 2100 L -300 2100 Z" fill="#0A0C14" />
            <path d="M -300 1620 L 1380 1740 L 1380 1850 L -300 1740 Z" fill="#FF7A2A" filter="url(#in-brillo)" opacity={0.85} />
            <path d="M -300 1640 L 1380 1756 L 1380 1830 L -300 1722 Z" fill="url(#in-metal)" />
            {Array.from({ length: 9 }, (_, i) => {
              const px = -300 + ((i * 240 + flujo) % 1900);
              return <path key={i} d={`M ${px} ${1668 + px * 0.068} l 110 8`} stroke="#FFF6D0" strokeWidth={7} strokeLinecap="round" opacity={0.75} />;
            })}
          </svg>
          <Chispas x={-100} y={1380} ancho={1300} alto={360} n={34} color="#FFC25A" semilla={9} />
        </Capa>
      </Camara>
      {/* años que nombra la voz */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", opacity: lerp(f, fAnios, fAnios + 12, 0, 1) * (1 - lerp(f, fMat - 26, fMat - 12, 0, 1)), translate: `0px ${lerp(f, fAnios, fAnios + 16, 30, 0, fuera)}px`, fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 124, color: H.pergamino, textShadow: "0 8px 30px rgba(0,0,0,0.8)" }}>
        1880 <span style={{ color: H.dorado }}>—</span> 1914
      </div>
      <Rotulito texto="Segunda Revolución Industrial" x={540} y={430} aparece={fRev + 20} hasta={fMat - 14} tam={38} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(0,0,0,0) 50%, rgba(4,6,14,0.6) 100%)", pointerEvents: "none" }} />
      <Textura fuerza={0.8} />
      <Fundido color={METAL} o={lerp(f, 2, 16, 1, 0)} />
      <Sfx archivo="fuego" en={2} volumen={0.22} />
      <Sfx archivo="cuenta" en={fRev} volumen={0.2} />
      <Sfx archivo="brillo" en={fCaucho} volumen={0.14} />
      <Sfx archivo="brillo" en={fMin} volumen={0.14} />
      <Sfx archivo="brillo" en={fAceite} volumen={0.14} />
    </AbsoluteFill>
  );
};

// ================= 3. DEL 10 % COSTERO AL INTERIOR =================
const X_RIO = 2600;
const Hoja: React.FC<{ x: number; y: number; rot: number; e?: number; color?: string; semilla?: number }> = ({ x, y, rot, e = 1, color = H.selvaOscura, semilla = 0 }) => {
  const f = useCurrentFrame();
  const m = Math.sin(f / 26 + semilla * 2.3) * 4;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={10} height={10}>
      <g transform={`rotate(${rot + m}) scale(${e})`}>
        <path d="M 0 0 Q 90 -150 30 -420 Q -80 -200 0 0 Z" fill={color} />
        <path d="M 0 0 Q 30 -200 30 -420" stroke="#0A2216" strokeWidth={5} fill="none" />
      </g>
    </svg>
  );
};

const BarcoVapor: React.FC<{ x: number; y: number; e?: number }> = ({ x, y, e = 1 }) => {
  const f = useCurrentFrame();
  const cabeceo = Math.sin(f / 19) * 1.2;
  return (
    <div style={{ position: "absolute", left: x, top: y + Math.sin(f / 15) * 4 }}>
      <div style={{ position: "absolute", left: 250 * e, top: -330 * e }}>
        <Humo x={0} y={0} n={8} alto={520} ancho={56} color="#6A6A6E" semilla={8} viento={-0.5} fuerza={0.9} />
      </div>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        <g transform={`scale(${e}) rotate(${cabeceo})`}>
          <path d="M -40 -40 L 560 -40 L 500 40 L 10 40 Z" fill="#2B1C14" />
          <path d="M -40 -40 L 560 -40 L 552 -24 L -32 -24 Z" fill={H.carmesi} />
          <rect x={60} y={-150} width={330} height={110} fill={H.pergaminoOscuro} stroke="#3A2616" strokeWidth={5} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={84 + i * 76} y={-124} width={44} height={50} fill="#1C2541" stroke="#3A2616" strokeWidth={4} />
          ))}
          <rect x={40} y={-170} width={370} height={22} fill="#3A2616" />
          <rect x={230} y={-330} width={44} height={162} fill="#1A1A1E" />
          <rect x={224} y={-338} width={56} height={18} fill={H.carmesi} />
          <path d="M 430 -40 L 430 -170 M 430 -166 L 500 -150 L 430 -134" stroke="#3A2616" strokeWidth={6} fill={H.pergamino} />
          {/* rueda de paletas */}
          <g transform={`translate(20 -10) rotate(${f * 5})`}>
            <circle r={84} fill="none" stroke="#5E3A22" strokeWidth={10} />
            {[0, 30, 60, 90, 120, 150].map((a) => (
              <rect key={a} x={-84} y={-5} width={168} height={10} fill="#7A4E2E" transform={`rotate(${a})`} />
            ))}
          </g>
          <path d="M -70 -10 a 90 90 0 0 1 180 0 Z" fill="#3A2616" />
        </g>
      </svg>
    </div>
  );
};

const Tarjeta: React.FC<{ x: number; y: number; rot: number; aparece: number; titulo: string; children: React.ReactNode }> = ({ x, y, rot, aparece, titulo, children }) => {
  const f = useCurrentFrame();
  const e = useResorte(aparece, { damping: 13 });
  if (f < aparece) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 330, height: 400, translate: "-50% -50%", transform: `rotate(${rot + (1 - e) * 10}deg) scale(${0.5 + 0.5 * e})`, opacity: Math.min(1, e * 1.6), background: PAPEL, borderRadius: 8, border: `5px solid ${H.sepia}`, boxShadow: "0 22px 50px rgba(0,0,0,0.6)" }}>
      <svg width={320} height={310} viewBox="-160 -155 320 310">
        <g stroke={H.tinta} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round">
          {children}
        </g>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 20, textAlign: "center", fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: 32, color: H.tinta }}>{titulo}</div>
    </div>
  );
};

const Interior: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fCtrl = useMomento("controlaban", 0.15);
  const fDiez = useMomento("diez", 0.22);
  const fPan = Math.max(fDiez + 60, useMomento("avance", 0.45) - 4);
  const fQuin = Math.max(fPan + 14, useMomento("quinina", 0.6));
  const fBarcos = useMomento("barcos", 0.72);
  const fMaxim = Math.max(fQuin + 20, useMomento("ametralladora", 0.8));
  const fPen = Math.max(fMaxim + 20, useMomento("penetrar", 0.9));
  const costa = lerp(f, fCtrl, fCtrl + 50, 0, 1);
  const pct = Math.round(lerp(f, fDiez, fDiez + 24, 0, 10));
  const barrido = f >= fPan && f <= fPan + 12 ? Math.sin((Math.PI * (f - fPan)) / 12) : 0;
  const fSube = Math.max(fPen + 30, duracion - 18);
  const tomas = tomasSeguras([
    { f: 0, x: 540, y: 960, z: 1 },
    { f: fPan, x: 540, y: 940, z: 1.1 },
    { f: fPan + 12, x: X_RIO + 540, y: 960, z: 1 },
    { f: fPen, x: X_RIO + 560, y: 960, z: 1.04 },
    { f: fSube, x: X_RIO + 640, y: 930, z: 1.22 },
    { f: duracion, x: X_RIO + 820, y: 250, z: 1.9 },
  ]);
  const xBarco = X_RIO + 40 + lerp(f, fPan, duracion, 0, 420, Easing.linear);
  return (
    <AbsoluteFill style={{ background: "#0A0F22" }}>
      <div style={{ position: "absolute", inset: 0, filter: barrido > 0.05 ? `blur(${barrido * 26}px)` : undefined }}>
        <Camara tomas={tomas} vaiven={0.7}>
          {/* A: escritorio y mapa de 1880 */}
          <div style={{ position: "absolute", left: -400, top: -400, width: 1900, height: 2720, background: `radial-gradient(ellipse at 540px 1200px, #2A3558 0%, ${H.noche} 70%)` }} />
          <div style={{ position: "absolute", left: 96, top: 350, width: 888, height: 920, transform: "rotate(1deg)", background: PAPEL, borderRadius: 6, boxShadow: "0 18px 50px rgba(0,0,0,0.65), inset 0 0 90px rgba(107,74,43,0.45)", opacity: lerp(f, 0, 18, 0, 1) }} />
          <MapaAfrica x={172} y={420} escala={0.8} estilo="noche" opacidad={1 - lerp(f, 4, 20, 0, 1)} rios={0.5} />
          <MapaAfrica x={172} y={420} escala={0.8} estilo="pergamino" opacidad={lerp(f, 0, 18, 0, 1)} costa={costa} rios={0.55} />
          <div style={{ position: "absolute", left: 700, top: 960, opacity: lerp(f, fDiez - 4, fDiez + 8, 0, 1), fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 132, color: H.carmesi, lineHeight: 1 }}>
            {pct}%
            <div style={{ fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 34, color: H.tinta, marginTop: 4 }}>de África</div>
          </div>
          {/* B: el río */}
          <Capa k={0.4}>
            <div style={{ position: "absolute", left: X_RIO - 900, top: -500, width: 3000, height: 1500, background: "linear-gradient(180deg, #27455A 0%, #6E9A8C 55%, #C9D8B8 100%)" }} />
          </Capa>
          <Capa k={0.6}>
            <svg style={{ position: "absolute", left: X_RIO - 500, top: 560, overflow: "visible" }} width={10} height={10}>
              {Array.from({ length: 26 }, (_, i) => (
                <ellipse key={i} cx={i * 90} cy={120 - azar(i) * 80} rx={90 + azar(i + 4) * 50} ry={130 + azar(i + 8) * 90} fill={i % 2 ? "#2C6A4A" : "#245C40"} />
              ))}
            </svg>
          </Capa>
          <svg style={{ position: "absolute", left: X_RIO - 500, top: 640, overflow: "visible" }} width={10} height={10}>
            {Array.from({ length: 22 }, (_, i) => (
              <ellipse key={i} cx={i * 104} cy={140 - azar(i + 30) * 60} rx={100 + azar(i + 34) * 50} ry={150 + azar(i + 38) * 70} fill={i % 2 ? H.selva : "#1A4E32"} />
            ))}
            <rect x={-200} y={180} width={2600} height={560} fill="#3F6E78" />
            <rect x={-200} y={180} width={2600} height={90} fill="#163A2A" opacity={0.55} />
            {Array.from({ length: 40 }, (_, i) => {
              const px = ((i * 137 - f * (1.5 + (i % 3))) % 2400 + 2400) % 2400 - 100;
              return <path key={i} d={`M ${px} ${230 + ((i * 53) % 480)} q 40 -10 80 0`} stroke="#BFE0DA" strokeWidth={4} fill="none" opacity={0.4} strokeLinecap="round" />;
            })}
          </svg>
          <BarcoVapor x={xBarco} y={1060} e={0.92} />
          <svg style={{ position: "absolute", left: X_RIO - 500, top: 1070, overflow: "visible" }} width={10} height={10}>
            {Array.from({ length: 5 }, (_, i) => (
              <ellipse key={i} cx={xBarco - X_RIO + 500 - 60 - i * 70 - ((f * 2) % 70)} cy={46} rx={50 - i * 6} ry={9} fill="#E4F2EE" opacity={0.5 - i * 0.09} />
            ))}
          </svg>
          {/* neblina */}
          <Capa k={0.9}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ position: "absolute", left: X_RIO - 400 + i * 420 + Math.sin(f / 60 + i) * 60, top: 820 + i * 46, width: 900, height: 150, borderRadius: "50%", background: "rgba(232,240,232,0.4)", filter: "blur(40px)" }} />
            ))}
          </Capa>
          {/* orilla cercana */}
          <svg style={{ position: "absolute", left: X_RIO - 500, top: 1330, overflow: "visible" }} width={10} height={10}>
            <path d="M -200 60 Q 500 -30 1100 40 T 2400 20 L 2400 900 L -200 900 Z" fill="#0F2E1F" />
          </svg>
          <Capa k={1.3}>
            <Hoja x={X_RIO - 40} y={1560} rot={-28} e={1.5} semilla={1} />
            <Hoja x={X_RIO + 90} y={1620} rot={8} e={1.3} color="#0C2A1B" semilla={2} />
            <Hoja x={X_RIO + 1010} y={1560} rot={24} e={1.5} semilla={3} />
            <Hoja x={X_RIO + 1130} y={1500} rot={-12} e={1.7} color="#0C2A1B" semilla={4} />
            <Hoja x={X_RIO + 1120} y={420} rot={196} e={1.4} color="#0C2A1B" semilla={5} />
            <Hoja x={X_RIO - 60} y={380} rot={160} e={1.3} semilla={6} />
          </Capa>
          <Tarjeta x={X_RIO + 250} y={560} rot={-5} aparece={fQuin} titulo="Quinina">
            <path d="M -44 120 L -44 -30 Q -44 -62 -20 -70 L -20 -112 L 20 -112 L 20 -70 Q 44 -62 44 -30 L 44 120 Z" fill="#D6ECF2" />
            <rect x={-26} y={-134} width={52} height={24} rx={5} fill={H.ocre} />
            <rect x={-34} y={0} width={68} height={70} fill={H.pergamino} />
            <path d="M -22 22 L 22 22 M -22 40 L 14 40 M -22 56 L 20 56" strokeWidth={3} />
            <path d="M -36 -24 L 36 -24" strokeWidth={3} strokeDasharray="4 6" />
          </Tarjeta>
          <Tarjeta x={X_RIO + 800} y={590} rot={5} aparece={fMaxim} titulo="Ametralladora Maxim">
            <rect x={-120} y={-52} width={150} height={44} rx={20} fill="#59616C" />
            <rect x={-150} y={-38} width={34} height={16} fill="#2B3038" />
            <rect x={30} y={-62} width={78} height={66} fill="#3B434D" />
            <path d="M 108 -46 L 136 -46 M 108 -14 L 136 -14 M 136 -56 L 136 -4" />
            <path d="M 40 4 L -40 100 M 60 4 L 110 100 M 50 4 L 40 100" />
            <circle cx={-40} cy={104} r={8} fill={H.tinta} />
            <circle cx={110} cy={104} r={8} fill={H.tinta} />
            <path d="M -96 -8 L -96 14 L -30 14" strokeWidth={4} />
          </Tarjeta>
        </Camara>
      </div>
      <Placa texto="1870 - 1880" texto2="Del 10% costero al interior" aparece={10} aparece2={fDiez} y={210} />
      <Rotulito texto="Enclaves europeos (aprox.)" x={420} y={1196} aparece={fCtrl + 30} hasta={fPan - 12} tam={30} color={H.sepia} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(4,6,14,0.5) 100%)", pointerEvents: "none" }} />
      <Textura fuerza={0.8} />
      <Fundido color={HUMO_GRIS} o={lerp(f, duracion - 12, duracion - 2, 0, 1)} />
      <Sfx archivo="pagina" en={2} volumen={0.3} />
      <Sfx archivo="whoosh" en={fPan - 2} volumen={0.34} />
      <Sfx archivo="agua" en={fPan + 8} volumen={0.22} />
      <Sfx archivo="remo" en={fBarcos} volumen={0.2} />
      <Sfx archivo="cuenta" en={fMaxim} volumen={0.3} />
      <Sfx archivo="whoosh" en={duracion - 18} volumen={0.22} />
    </AbsoluteFill>
  );
};

// ================= 4. LA CONFERENCIA DE BERLÍN =================
const Bandera: React.FC<{ x: number; y: number; aparece: number; tipo: "GB" | "FR" | "DE" | "BE" | "PT" | "US" }> = ({ x, y, aparece, tipo }) => {
  const f = useCurrentFrame();
  const e = useResorte(aparece, { damping: 11 });
  if (f < aparece) return null;
  const W = 84;
  const Hh = 56;
  const tela = (() => {
    switch (tipo) {
      case "FR":
        return [<rect key={1} width={28} height={Hh} fill="#2A4B9B" />, <rect key={2} x={28} width={28} height={Hh} fill="#F2EFE6" />, <rect key={3} x={56} width={28} height={Hh} fill="#C8323C" />];
      case "DE":
        return [<rect key={1} width={W} height={19} fill="#111" />, <rect key={2} y={19} width={W} height={18} fill="#F2EFE6" />, <rect key={3} y={37} width={W} height={19} fill="#C8323C" />];
      case "BE":
        return [<rect key={1} width={28} height={Hh} fill="#111" />, <rect key={2} x={28} width={28} height={Hh} fill="#F2CE3E" />, <rect key={3} x={56} width={28} height={Hh} fill="#C8323C" />];
      case "PT":
        return [<rect key={1} width={42} height={Hh} fill="#2A4B9B" />, <rect key={2} x={42} width={42} height={Hh} fill="#F2EFE6" />, <circle key={3} cx={42} cy={28} r={9} fill={H.dorado} stroke="#C8323C" strokeWidth={3} />];
      case "US":
        return [
          <rect key={0} width={W} height={Hh} fill="#F2EFE6" />,
          ...[0, 2, 4, 6, 8, 10, 12].map((i) => <rect key={`s${i}`} y={(i * Hh) / 13} width={W} height={Hh / 13} fill="#C8323C" />),
          <rect key={1} width={36} height={30} fill="#27356A" />,
          ...Array.from({ length: 12 }, (_, i) => <circle key={`e${i}`} cx={5 + (i % 4) * 9} cy={5 + Math.floor(i / 4) * 10} r={1.6} fill="#F2EFE6" />),
        ];
      default:
        return [
          <rect key={0} width={W} height={Hh} fill="#27356A" />,
          <path key={1} d={`M 0 0 L ${W} ${Hh} M ${W} 0 L 0 ${Hh}`} stroke="#F2EFE6" strokeWidth={10} />,
          <path key={2} d={`M 0 0 L ${W} ${Hh} M ${W} 0 L 0 ${Hh}`} stroke="#C8323C" strokeWidth={4} />,
          <path key={3} d={`M ${W / 2} 0 L ${W / 2} ${Hh} M 0 ${Hh / 2} L ${W} ${Hh / 2}`} stroke="#F2EFE6" strokeWidth={16} />,
          <path key={4} d={`M ${W / 2} 0 L ${W / 2} ${Hh} M 0 ${Hh / 2} L ${W} ${Hh / 2}`} stroke="#C8323C" strokeWidth={9} />,
        ];
    }
  })();
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={10} height={10}>
      <g transform={`scale(${0.4 + 0.6 * e})`} opacity={Math.min(1, e * 1.6)}>
        <rect x={-3} y={-96} width={6} height={98} fill={H.bronce} />
        <ellipse cx={0} cy={2} rx={20} ry={6} fill="#5E4520" />
        <g transform={`translate(3 -96) skewY(${Math.sin(f / 13 + x) * 4})`}>
          <svg width={W} height={Hh} overflow="hidden">
            {tela}
          </svg>
          <rect width={W} height={Hh} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
        </g>
      </g>
    </svg>
  );
};

const Ventanal: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={10} height={10}>
    <path d="M 0 720 L 0 110 Q 0 0 90 0 Q 180 0 180 110 L 180 720 Z" fill="#FFE9B8" stroke="#1E1410" strokeWidth={14} />
    <path d="M 90 0 L 90 720 M 0 240 L 180 240 M 0 480 L 180 480" stroke="#1E1410" strokeWidth={8} />
    <path d="M -34 -30 Q 60 60 -20 760 L -70 760 L -70 -30 Z" fill={H.carmesiOscuro} />
    <path d="M 214 -30 Q 130 60 204 760 L 250 760 L 250 -30 Z" fill={H.carmesiOscuro} />
  </svg>
);

const Berlin: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fConv = useMomento("convocada", 0.14);
  const fBis = useMomento("Bismarck", 0.22);
  const fGuerra = useMomento("guerra", 0.36);
  const fPart = Math.max(fGuerra + 30, useMomento("Participaron", 0.5));
  const fCatorce = useMomento("catorce", 0.53);
  const nombres: [string, number, "GB" | "FR" | "DE" | "BE" | "PT" | "US"][] = [
    ["Reino", 0.62, "GB"],
    ["Francia", 0.67, "FR"],
    ["Alemania", 0.7, "DE"],
    ["Bélgica", 0.74, "BE"],
    ["Portugal", 0.78, "PT"],
    ["Estados", 0.82, "US"],
  ];
  const fBanderas = nombres.map(([p, fr]) => useMomento(p, fr));
  const fNingun = Math.max(fBanderas[5] + 20, useMomento("ningún", 0.88));
  const luzSilla = lerp(f, fNingun, fNingun + 20, 0, 1);
  const zFin = Math.max(fNingun + 50, duracion - 20);
  const tomas = tomasSeguras([
    { f: 0, x: 540, y: 330, z: 1.5 },
    { f: 30, x: 540, y: 960, z: 1 },
    { f: fBis - 10, x: 560, y: 960, z: 1.06 },
    { f: fBis + 30, x: 690, y: 960, z: 1.34 },
    { f: fPart - 10, x: 680, y: 970, z: 1.38 },
    { f: fPart + 30, x: 540, y: 1010, z: 1.06 },
    { f: fNingun - 6, x: 540, y: 1020, z: 1.1 },
    { f: fNingun + 30, x: 560, y: 1380, z: 1.3 },
    { f: zFin, x: 560, y: 1380, z: 1.34 },
    { f: duracion, x: 540, y: 690, z: 5.5 },
  ]);
  const brazo = 0.5 + 0.5 * Math.sin(f / 21) * lerp(f, fBis, fBis + 20, 0, 1);
  return (
    <AbsoluteFill style={{ background: "#0A0F22" }}>
      <Camara tomas={tomas} vaiven={0.7}>
        {/* fondo: muro empapelado y artesonado */}
        <Capa k={0.7}>
          <div style={{ position: "absolute", left: -700, top: -500, width: 2480, height: 1900, background: "repeating-linear-gradient(90deg, #1B2A44 0 86px, #20304E 86px 92px)" }} />
          <div style={{ position: "absolute", left: -700, top: -500, width: 2480, height: 260, background: "linear-gradient(180deg, #05070F 0%, #101828 100%)" }} />
          <div style={{ position: "absolute", left: -700, top: 1060, width: 2480, height: 360, background: "linear-gradient(180deg, #3A1D12 0%, #2A130B 100%)", borderTop: `10px solid ${H.bronce}` }} />
          <Ventanal x={-170} y={330} />
          {/* mapa mural */}
          <div style={{ position: "absolute", left: 214, top: 316, width: 652, height: 716, background: PAPEL, border: `16px solid ${H.bronce}`, boxShadow: "0 20px 60px rgba(0,0,0,0.7), inset 0 0 60px rgba(107,74,43,0.4)" }} />
          <MapaAfrica x={270} y={388} escala={0.6} estilo="pergamino" rios={0.6} />
        </Capa>
        {/* suelo */}
        <div style={{ position: "absolute", left: -700, top: 1330, width: 2480, height: 1400, background: "linear-gradient(180deg, #24120C 0%, #120906 100%)" }} />
        {/* delegados del fondo y Bismarck */}
        <Capa k={0.86}>
          <Caballero x={120} y={1330} e={0.78} barba mece={1} color="#11162A" />
          <Caballero x={300} y={1330} e={0.74} calvo bigote mece={2} color="#141A2E" />
          <Caballero x={470} y={1330} e={0.78} mece={3} color="#10142A" charreteras />
        </Capa>
        <div style={{ position: "absolute", left: 830, top: 1340, transform: "scaleX(-1)" }}>
          <Caballero x={0} y={0} e={1.16} calvo bigote charreteras brazo={brazo} color="#0C1022" luz="#E8B870" mece={0.4} />
        </div>
        {/* mesa en herradura con tapete verde */}
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          <path d="M -260 1330 Q 540 1210 1340 1330 L 1420 1640 Q 540 1470 -340 1640 Z" fill="#1E4A36" stroke="#3A1D12" strokeWidth={16} />
          <path d="M -260 1330 Q 540 1210 1340 1330" stroke="#5E8A6E" strokeWidth={4} fill="none" opacity={0.6} />
          {[150, 330, 520, 700, 900].map((px, i) => (
            <rect key={i} x={px} y={1330 + (i % 2) * 14} width={86} height={54} fill={H.pergamino} opacity={0.85} transform={`rotate(${(azar(i) - 0.5) * 16} ${px} 1340)`} />
          ))}
        </svg>
        {nombres.map(([, , tipo], i) => (
          <Bandera key={tipo} x={120 + i * 124} y={1322 - (i === 2 || i === 3 ? 12 : i === 1 || i === 4 ? 8 : 0)} aparece={fBanderas[i]} tipo={tipo} />
        ))}
        <RayosDeLuz x={-60} y={520} largo={1500} angulo={24} apertura={34} n={6} fuerza={0.55} />
        <Polvo x={0} y={500} ancho={900} alto={800} n={30} semilla={4} />
        {/* primer plano: espaldas de delegados y la silla vacía */}
        <Capa k={1.18}>
          <Caballero x={110} y={1860} e={1.25} sentado color="#070A14" luz="#3A4468" mece={5} />
          <Caballero x={1010} y={1860} e={1.25} sentado calvo color="#070A14" luz="#3A4468" mece={6} />
          <svg style={{ position: "absolute", left: 560, top: 1860, overflow: "visible" }} width={10} height={10}>
            <defs>
              <radialGradient id="be-silla" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFE2A6" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#FFE2A6" stopOpacity={0} />
              </radialGradient>
            </defs>
            <ellipse cx={0} cy={-200} rx={330} ry={300} fill="url(#be-silla)" opacity={luzSilla} />
            <path d="M -120 60 L -120 -300 Q -120 -360 -60 -372 L 60 -372 Q 120 -360 120 -300 L 120 60 Z" fill="#3A1810" stroke="#1E0B07" strokeWidth={8} />
            <path d="M -92 40 L -92 -290 Q -92 -334 -50 -340 L 50 -340 Q 92 -334 92 -290 L 92 40 Z" fill={H.carmesiOscuro} />
            <path d="M -92 40 L -92 -290 Q -92 -334 -50 -340 L 50 -340 Q 92 -334 92 -290 L 92 40 Z" fill={H.carmesi} opacity={0.2 + 0.6 * luzSilla} />
            {[-46, 0, 46].map((dx) => [-250, -170, -90].map((dy) => <circle key={`${dx}${dy}`} cx={dx} cy={dy} r={6} fill="#2A0A0F" opacity={0.7} />))}
          </svg>
        </Capa>
        <Capa k={1.4}>
          <Humo x={320} y={1700} n={6} alto={1000} ancho={70} color="#8A8A8E" semilla={12} fuerza={0.3} viento={0.12} />
        </Capa>
      </Camara>
      <Placa texto="Berlín, 1884 - 1885" texto2="14 Potencias, 0 Africanos" aparece={34} aparece2={fCatorce} y={210} />
      <Rotulito texto="Otto von Bismarck" x={600} y={500} aparece={fBis + 8} hasta={fPart - 14} tam={36} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(0,0,0,0) 52%, rgba(4,6,14,0.6) 100%)", pointerEvents: "none" }} />
      <Textura fuerza={0.8} />
      <Fundido color={HUMO_GRIS} o={lerp(f, 2, 18, 1, 0)} />
      <Fundido color={PAPEL} o={lerp(f, duracion - 10, duracion - 2, 0, 1)} />
      <Sfx archivo="multitud" en={20} volumen={0.1} />
      <Sfx archivo="banco" en={fConv} volumen={0.36} />
      <Sfx archivo="tension" en={fNingun} volumen={0.2} />
      <Sfx archivo="whoosh" en={duracion - 20} volumen={0.3} />
    </AbsoluteFill>
  );
};

export const ESCENAS_1: Record<string, React.FC<PropsEscena>> = {
  "reparto-africa/gancho": Gancho,
  "reparto-africa/industria": Industria,
  "reparto-africa/interior": Interior,
  "reparto-africa/berlin": Berlin,
};
