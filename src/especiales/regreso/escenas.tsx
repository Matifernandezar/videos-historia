// Escenas del video "¿Cómo describe la Biblia el regreso de Jesús?" (Versículo Oculto).
// Pasajes: Mateo 24:27-39, Apocalipsis 1:7, 1 Corintios 15:52, Mateo 25:31-32 y Apocalipsis 21:4. Ilustraciones originales.
// No se representa a Dios: el trono es luz sin figura. El Hijo del Hombre aparece como figura luminosa.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { useEscena } from "../../video/contexto";
import type { EscenaAnimada } from "../../video/tipos";
import { FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { Sfx, useMomento } from "../comun";
import { Persona, type Brazo, type Quien } from "../jesus-12-30/personas";
import { Camara, lerp, LibroAntiguo, PAL, Renglones, TapaLibro, Textura } from "../jesus-12-30/escenarios";
import { Fig, FigCabeza, manoDe, osc } from "../jesus-12-30/escenas";
import { Angel } from "../senaquerib/escenas";
import { Arbol, azar, CasaAdobe, Montes, Polvo, RayosDeLuz } from "../ambiente";
import { cl, Dato, Lluvia, mezcla } from "../manila/piezas";

type PropsEscena = { escena: EscenaAnimada };
const SUAVE = Easing.inOut(Easing.cubic);

const Estrellas: React.FC<{ n?: number; alto?: number; op?: number }> = ({ n = 60, alto = 800, op = 1 }) => {
  const f = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={azar(i * 3) * 1400 - 160} cy={azar(i * 5) * alto} r={0.8 + azar(i) * 1.8} fill="#F7F1E3" opacity={op * (0.25 + 0.5 * azar(i * 2)) * (0.65 + 0.35 * Math.sin(f / 18 + i))} />
      ))}
    </svg>
  );
};

// ---------- reloj de arena antiguo, con granos dorados que se detienen en el aire ----------
const HX = 540;
const HY = 930;
const HS = 1.3;
const VIDRIO = "M -140 -250 C -160 -120 -40 -60 -16 0 C -40 60 -160 130 -140 250 L 140 250 C 160 130 40 60 16 0 C 40 -60 160 -120 140 -250 Z";
const NG = 190;
const FR = 44; // frame en que el tiempo se detiene

// Posición de cada grano (en pantalla): los primeros caen por el cuello; los demás flotan alrededor.
export const posGrano = (i: number, f: number): [number, number, number, number] => {
  if (i < 50) {
    const h = 150 * HS;
    const y = HY + ((azar(i * 5) * h + Math.min(f, FR) * (3 + azar(i) * 3)) % h);
    return [HX + (azar(i * 3) - 0.5) * 26, y, 2.6 + azar(i * 7) * 2, 1];
  }
  const ang = azar(i * 7 + 1) * Math.PI * 2;
  const rad = 110 + azar(i * 11 + 2) * 400;
  const bx = HX + Math.cos(ang) * rad * 0.95;
  const by = HY + Math.sin(ang) * rad * 1.05 - 30;
  const t = SUAVE(cl((f - 8 - azar(i * 17) * 30) / 32));
  const bob = Math.sin(f / (22 + (i % 9)) + i) * 4 * t;
  return [HX + (bx - HX) * t, HY + (by - HY) * t + bob, 2.4 + azar(i * 13) * 4.2, t];
};

const Granos: React.FC<{ puntos: [number, number, number, number][]; op?: number }> = ({ puntos, op = 1 }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
    <defs>
      <radialGradient id="grano-oro">
        <stop offset="0%" stopColor="#FFF3C8" stopOpacity={1} />
        <stop offset="35%" stopColor="#F2C14E" stopOpacity={0.85} />
        <stop offset="100%" stopColor="#E3A030" stopOpacity={0} />
      </radialGradient>
    </defs>
    {puntos.map(([x, y, r, a], i) => (a > 0.01 ? <circle key={i} cx={x} cy={y} r={r * 2.4} fill="url(#grano-oro)" opacity={a * op} /> : null))}
  </svg>
);

const RelojArena: React.FC<{ op?: number }> = ({ op = 1 }) => {
  const f = useCurrentFrame();
  const anillo = SUAVE(cl((f - FR) / 36));
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: op }} width={10} height={10}>
      <defs>
        <clipPath id="ra-vid">
          <path d={VIDRIO} />
        </clipPath>
        <linearGradient id="ra-arena" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE9A8" />
          <stop offset="0.6" stopColor="#E3B04B" />
          <stop offset="1" stopColor="#B8862A" />
        </linearGradient>
        <linearGradient id="ra-madera" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8A5A32" />
          <stop offset="1" stopColor="#4A2E18" />
        </linearGradient>
        <linearGradient id="ra-vidrio" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(190,215,255,0.32)" />
          <stop offset="1" stopColor="rgba(120,160,230,0.12)" />
        </linearGradient>
      </defs>
      <circle cx={HX} cy={HY} r={40 + anillo * 760} fill="none" stroke="#F2C14E" strokeWidth={8 * (1 - anillo)} opacity={anillo > 0 ? 0.7 * (1 - anillo) : 0} />
      <g transform={`translate(${HX} ${HY}) scale(${HS})`}>
        {[-179, 165].map((x) => (
          <g key={x}>
            <rect x={x} y={-262} width={14} height={524} rx={6} fill="url(#ra-madera)" stroke="#2A1A0E" strokeWidth={3} />
            {[-150, -50, 50, 150].map((y) => (
              <rect key={y} x={x - 3} y={y} width={20} height={8} rx={4} fill="#E3B04B" />
            ))}
          </g>
        ))}
        <path d={VIDRIO} fill="url(#ra-vidrio)" />
        <g clipPath="url(#ra-vid)">
          <path d="M -160 -110 Q 0 -86 160 -110 L 160 0 L -160 0 Z" fill="url(#ra-arena)" />
          <path d="M -170 250 L -170 190 Q -60 172 0 150 Q 60 172 170 190 L 170 250 Z" fill="url(#ra-arena)" />
          <rect x={-3} y={0} width={6} height={150} fill="#FFE9A8" opacity={0.9} />
        </g>
        <path d={VIDRIO} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={5} />
        <path d="M -118 -220 C -134 -120 -62 -70 -34 -12" stroke="rgba(255,255,255,0.55)" strokeWidth={7} fill="none" strokeLinecap="round" />
        <path d="M 118 220 C 134 130 70 80 34 18" stroke="rgba(255,255,255,0.3)" strokeWidth={6} fill="none" strokeLinecap="round" />
        <rect x={-200} y={-294} width={400} height={46} rx={14} fill="url(#ra-madera)" stroke="#2A1A0E" strokeWidth={4} />
        <rect x={-200} y={248} width={400} height={46} rx={14} fill="url(#ra-madera)" stroke="#2A1A0E" strokeWidth={4} />
        <rect x={-200} y={-262} width={400} height={8} fill="#E3B04B" />
        <rect x={-200} y={254} width={400} height={8} fill="#E3B04B" />
      </g>
    </svg>
  );
};

// ---------- agua que sube (en coordenadas de pantalla) ----------
const Agua: React.FC<{ nivel: number; opacidad?: number }> = ({ nivel, opacidad = 1 }) => {
  const f = useCurrentFrame();
  if (nivel > 2000 || opacidad <= 0) return null;
  const pts: string[] = [];
  for (let x = -60; x <= 1140; x += 30) {
    const y = nivel + Math.sin((x + f * 7) / 80) * 16 + Math.sin((x - f * 4) / 37) * 7;
    pts.push(`${x} ${y.toFixed(1)}`);
  }
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: opacidad }}>
      <defs>
        <linearGradient id="agua-g" gradientUnits="userSpaceOnUse" x1="0" y1={nivel} x2="0" y2={nivel + 800}>
          <stop offset="0" stopColor="#3C74B8" stopOpacity={0.96} />
          <stop offset="0.5" stopColor="#1B3F7A" stopOpacity={0.98} />
          <stop offset="1" stopColor="#0E2349" stopOpacity={1} />
        </linearGradient>
      </defs>
      <path d={`M -60 2100 L ${pts.join(" L ")} L 1140 2100 Z`} fill="url(#agua-g)" />
      <path d={`M ${pts.join(" L ")}`} stroke="#CFE6FF" strokeWidth={6} fill="none" opacity={0.75} strokeLinecap="round" />
      {Array.from({ length: 12 }, (_, i) => {
        const yy = nivel + 60 + i * 90;
        return <path key={i} d={`M -40 ${yy} q 40 -12 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0`} transform={`translate(${((f * (1 + (i % 3) * 0.4)) % 160) - 80} 0)`} stroke="#8EB8EE" strokeWidth={3} fill="none" opacity={0.22} />;
      })}
    </svg>
  );
};

// ================= 1. EL DÍA QUE NADIE CONOCE =================
const Apertura: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fNadie = useMomento("Nadie", 0.68);
  const fAngeles = useMomento("ángeles", 0.92);
  const aparece = lerp(f, 0, 18, 0, 1);
  const puntos: [number, number, number, number][] = Array.from({ length: NG }, (_, i) => posGrano(i, f));
  const ang = (d: number) => lerp(f, 24 + d, 64 + d, 0, 0.62);
  return (
    <AbsoluteFill style={{ background: "#0B1426" }}>
      <Camara tomas={[{ f: 0, x: 540, y: 960, z: 1.0 }, { f: duracion, x: 540, y: 940, z: 1.14 }]}>
        <div style={{ position: "absolute", left: -600, top: -600, width: 2280, height: 3200, background: "radial-gradient(ellipse at 50% 46%, #1F3566 0%, #14223F 48%, #0A1124 100%)" }} />
        <Estrellas n={70} alto={1500} />
        <Angel x={160} y={860} e={0.5} o={ang(0)} />
        <Angel x={920} y={880} e={0.5} o={ang(10)} />
        <Angel x={330} y={640} e={0.32} o={ang(20) * 0.8} />
        <Angel x={760} y={650} e={0.32} o={ang(30) * 0.8} />
        <RelojArena op={aparece} />
        <Granos puntos={puntos} op={aparece} />
        <Polvo x={140} y={300} ancho={800} alto={1200} n={20} semilla={5} />
      </Camara>
      <Dato texto="Mateo 24:36" aparece={fNadie - 4} y={330} tam={42} />
      <Textura />
      <Sfx archivo="brillo" en={4} volumen={0.16} />
      <Sfx archivo="whoosh" en={FR - 4} volumen={0.16} />
      <Sfx archivo="tension" en={Math.max(0, fAngeles - 40)} volumen={0.1} />
    </AbsoluteFill>
  );
};

// ================= 2. COMO EN LOS TIEMPOS DE NOÉ: la aldea, la lluvia y el agua =================
const LUCES_ALDEA: [number, number][] = [
  [250, 1010], [150, 1030], [330, 1040], [880, 1000], [790, 1020], [960, 1040], [540, 975], [500, 1000], [590, 1010], [110, 1150], [420, 1120], [725, 1115], [1010, 1130],
  [540, 1385], [380, 1380], [700, 1380], [230, 1400], [850, 1400], [540, 1300],
];

const Aldea: React.FC<{ lluvia: number; mira: number; brinda: number }> = ({ lluvia, mira, brinda }) => {
  const f = useCurrentFrame();
  const llama = 0.85 + 0.15 * Math.sin(f / 4) * Math.sin(f / 9);
  const gente: { q: Quien; x: number; s: number }[] = [
    { q: "vecino", x: 200, s: 1560 },
    { q: "vecina", x: 430, s: 1566 },
    { q: "oyente2", x: 660, s: 1560 },
    { q: "oyente1", x: 890, s: 1566 },
  ];
  return (
    <>
      <div style={{ position: "absolute", left: -600, top: -900, width: 2280, height: 2000, background: `linear-gradient(180deg, ${mezcla("#0A1226", "#0B1220", lluvia)} 0%, ${mezcla("#16264A", "#1A2742", lluvia)} 55%, ${mezcla("#2A2F52", "#2C3550", lluvia)} 100%)` }} />
      <Estrellas n={50} alto={900} op={1 - lluvia * 0.9} />
      <div style={{ position: "absolute", left: 800, top: 310, width: 110, height: 110, borderRadius: "50%", background: "radial-gradient(circle at 40% 38%, #FFFBEA, #E8E2CC)", boxShadow: "0 0 80px rgba(255,248,214,0.6)", opacity: 1 - lluvia * 0.85 }} />
      <Montes y={1040} color="#17223F" bruma="#1E2A4A" amp={70} paso={300} semilla={4} />
      <CasaAdobe x={540} suelo={1075} w={250} h={300} noche={1} luz={1} toldo={false} tinajas={false} />
      <CasaAdobe x={190} suelo={1112} w={340} h={330} noche={1} luz={1} />
      <CasaAdobe x={880} suelo={1105} w={360} h={330} noche={1} luz={1} />
      <div style={{ position: "absolute", left: -600, top: 1110, width: 2280, height: 1100, background: "linear-gradient(180deg,#2A2230 0%,#1B1722 100%)" }} />
      {[{ x: 40, y: 1180, e: 1.05 }, { x: 395, y: 1150, e: 0.72 }, { x: 700, y: 1146, e: 0.72 }, { x: 1040, y: 1180, e: 1.05 }].map((a, i) => (
        <Arbol key={i} x={a.x} y={a.y} e={a.e} tipo="olivo" semilla={i} tono={0.55} />
      ))}
      {/* salpicaduras sobre las copas de los árboles */}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        {lluvia > 0.05
          ? Array.from({ length: 26 }, (_, i) => {
              const cx = [40, 395, 700, 1040][i % 4] + (azar(i * 3) - 0.5) * 140;
              const cy = [1030, 1060, 1060, 1030][i % 4] + (azar(i * 5) - 0.5) * 60;
              const p = ((f / 14 + azar(i * 7)) % 1);
              return <ellipse key={i} cx={cx} cy={cy} rx={4 + p * 22} ry={1.5 + p * 7} fill="none" stroke="#BFD8FF" strokeWidth={2} opacity={lluvia * (1 - p) * 0.8} />;
            })
          : null}
        {/* luces cálidas de la aldea (nacen de los granos de arena) */}
      </svg>
      {LUCES_ALDEA.map(([x, y], i) => (
        <div key={i} style={{ position: "absolute", left: x - 70, top: y - 70, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,214,140,0.85) 0%, rgba(255,190,100,0.35) 38%, rgba(255,190,100,0) 70%)", mixBlendMode: "screen", opacity: 0.55 * llama }} />
      ))}
      {/* mesa y comensales */}
      {gente.map((g, i) => (
        <Fig
          key={g.q}
          quien={g.q}
          sentado
          x={g.x}
          suelo={g.s}
          ancho={300}
          giro={(i < 2 ? 0.3 : -0.3) * (1 - mira)}
          mirada={[0, -8 * mira]}
          cabeza={-5 * mira + (osc(f, 30, i) - 0.5) * 3 * (1 - mira)}
          cejas={{ y: -8 * mira }}
          boca={{ curva: 10 - 14 * mira, apertura: (1 - mira) * (0.25 + 0.3 * osc(f, 9 + i * 2, i * 0.4)) }}
          brazoIzq={i === 1 ? { hombro: 38 + 6 * brinda, codo: -95, mano: "puno" } : { hombro: 14, codo: -40, mano: "abierta" }}
          brazoDer={i === 2 ? { hombro: 38 + 6 * brinda, codo: -95, mano: "puno" } : { hombro: 14 + 10 * osc(f, 24, i), codo: -40, mano: "abierta" }}
          semilla={i + 3}
        />
      ))}
      <div style={{ position: "absolute", left: 20, top: 1400, width: 1040, height: 40, borderRadius: 12, background: "linear-gradient(180deg,#9A6A3A,#6E4526)", boxShadow: "0 14px 24px rgba(0,0,0,0.45)" }} />
      <div style={{ position: "absolute", left: 40, top: 1440, width: 1000, height: 420, background: "linear-gradient(180deg,#6E4526,#3E2614)" }} />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        {/* panes, jarra, copas y fruta */}
        <ellipse cx={250} cy={1394} rx={58} ry={15} fill="#C98A4A" />
        <ellipse cx={790} cy={1394} rx={58} ry={15} fill="#B87A3E" />
        <path d="M 420 1396 Q 410 1340 440 1330 L 470 1330 Q 500 1340 490 1396 Z" fill="#8E4A2E" stroke="#5A2E1A" strokeWidth={3} />
        <path d="M 640 1396 Q 630 1350 650 1340 L 690 1340 Q 710 1350 700 1396 Z" fill="#A8603A" stroke="#5A2E1A" strokeWidth={3} />
        {[330, 560, 900].map((x) => (
          <path key={x} d={`M ${x - 18} 1396 L ${x - 14} 1362 L ${x + 14} 1362 L ${x + 18} 1396 Z`} fill="#D9B25A" stroke="#8A6420" strokeWidth={2.5} />
        ))}
        {[950, 970, 990].map((x, i) => (
          <circle key={x} cx={x} cy={1384 - (i % 2) * 12} r={16} fill={["#8A3A6A", "#6A2A5A", "#9A4A7A"][i]} />
        ))}
        {/* lámpara de aceite en el centro de la mesa */}
        <path d="M 524 1396 Q 520 1368 540 1362 Q 566 1366 562 1396 Z" fill="#B8663E" stroke="#5A2E1A" strokeWidth={3} />
        <path d={`M 548 1360 Q ${545 + Math.sin(f / 3) * 2} ${1334 - llama * 8} 553 ${1322 - llama * 8} Q 560 1344 554 1360 Z`} fill="#FFD27A" />
      </svg>
    </>
  );
};

const Noe: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fGente = useMomento("gente", 0.32);
  const fEsper = useMomento("esperaban", 0.72);
  const fDiluvio = useMomento("diluvio", 0.9);
  const tr = SUAVE(cl(f / 52));
  const lluvia = lerp(f, fEsper - 22, fEsper + 30, 0, 1);
  const mira = lerp(f, fEsper - 2, fEsper + 14, 0, 1);
  const brinda = lerp(f, fGente + 6, fGente + 30, 0, 1);
  const nivel = lerp(f, fEsper + 6, duracion - 2, 1980, -150, Easing.in(Easing.cubic));
  const puntos: [number, number, number, number][] = Array.from({ length: NG }, (_, i) => {
    const [x0, y0, r, a] = posGrano(i, 9999);
    const [tx, ty] = LUCES_ALDEA[i % LUCES_ALDEA.length];
    const q = SUAVE(cl((f - azar(i * 19) * 14) / 40));
    const px = tx + (azar(i * 23) - 0.5) * 26;
    const py = ty + (azar(i * 29) - 0.5) * 26;
    return [x0 + (px - x0) * q, y0 + (py - y0) * q, r * (1 - 0.5 * q), a * (1 - SUAVE(cl((f - 34) / 26)))];
  });
  return (
    <AbsoluteFill style={{ background: "#0B1426" }}>
      <Camara tomas={[{ f: 0, x: 540, y: 960, z: 1.0 }, { f: 60, x: 540, y: 960, z: 1.0 }, { f: duracion, x: 540, y: 1180, z: 1.2 }]} vaiven={0.5}>
        <div style={{ opacity: tr }}>
          <Aldea lluvia={lluvia} mira={mira} brinda={brinda} />
        </div>
        <RelojArena op={1 - SUAVE(cl(f / 24))} />
        <Granos puntos={puntos} />
      </Camara>
      <Lluvia fuerza={lluvia} />
      <AbsoluteFill style={{ background: "rgba(20,40,80,0.28)", opacity: lluvia, mixBlendMode: "multiply" }} />
      <Agua nivel={nivel} />
      <Textura />
      <Sfx archivo="tela" en={fGente} volumen={0.1} />
      <Sfx archivo="lluvia" en={fEsper - 22} volumen={0.22} />
      <Sfx archivo="agua" en={fDiluvio - 6} volumen={0.3} />
      <Sfx archivo="trueno" en={fDiluvio - 10} volumen={0.16} />
    </AbsoluteFill>
  );
};

// ================= 3. EL RELÁMPAGO Y EL CIELO OSCURECIDO =================
const rayoPts = (): [number, number][] => {
  const pts: [number, number][] = [];
  for (let x = -40; x <= 1120; x += 58) {
    pts.push([x, 520 + Math.sin(x / 140) * 70 + (azar(x * 0.37 + 5) - 0.5) * 120]);
  }
  return pts;
};
const RAYO = rayoPts();

const Relampago: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fRel = useMomento("relámpago", 0.04);
  const fOcc = useMomento("occidente", 0.18);
  const fSol = useMomento("sol", 0.4);
  const fLuna = useMomento("luna", 0.58);
  const fSenal = useMomento("señal", 0.8);
  const fB = Math.max(6, fRel - 6);
  const p = lerp(f, fB, fB + 18, 0, 1, Easing.linear);
  const luzX = lerp(f, fB + 4, fOcc + 14, -60, 1140, Easing.linear);
  const destello = Math.max(0, 0.6 * Math.exp(-(f - fB) / 9) * (f >= fB ? 1 : 0)) + Math.max(0, 0.3 * Math.exp(-(f - fB - 34) / 8) * (f >= fB + 34 ? 1 : 0));
  const montesLuz = (1 - 0.8 * lerp(f, fSol - 10, fSol + 34, 0, 1)) * (f > fB ? 1 : 0);
  const eclipse = lerp(f, fSol + 2, fSol + 44, 0, 1);
  const sol = lerp(f, fSol - 14, fSol - 2, 0, 1);
  const lunaA = lerp(f, fLuna - 14, fLuna - 2, 0, 1);
  const lunaDim = lerp(f, fLuna + 4, fLuna + 50, 0, 1);
  const senal = lerp(f, fSenal - 2, fSenal + 40, 0, 1, Easing.out(Easing.cubic));
  const agua = lerp(f, 0, 30, -150, 1480, SUAVE);
  const aguaOp = 1 - lerp(f, 24, 40, 0, 1);
  const trazo = RAYO.map(([x, y]) => `${x} ${y}`).join(" L ");
  const Cadena: React.FC<{ lit?: boolean }> = ({ lit = false }) => (
    <>
      <Montes y={1330} color={lit ? "#F0B05A" : "#1C2C56"} bruma={lit ? "#5A3E5A" : "#0F1A38"} amp={120} paso={230} semilla={2} idx={lit ? "L" : "D"} />
      <Montes y={1400} color={lit ? "#D89048" : "#14213F"} bruma={lit ? "#4A3250" : "#0A1430"} amp={90} paso={170} semilla={7} idx={lit ? "L" : "D"} />
      <Montes y={1470} color={lit ? "#B87040" : "#0C1630"} bruma={lit ? "#3A2848" : "#070D22"} amp={60} paso={120} semilla={11} idx={lit ? "L" : "D"} />
    </>
  );
  return (
    <AbsoluteFill style={{ background: "#050A1A" }}>
      <Camara tomas={[{ f: 0, x: 540, y: 960, z: 1.0 }, { f: duracion, x: 540, y: 940, z: 1.1 }]} vaiven={0.5}>
        <div style={{ position: "absolute", left: -600, top: -600, width: 2280, height: 2200, background: "linear-gradient(180deg,#040816 0%,#0A1530 38%,#16284C 70%,#243A63 100%)" }} />
        <Estrellas n={90} alto={1100} op={1 - 0.4 * senal} />
        {/* resplandor luminoso en lo alto */}
        <div style={{ position: "absolute", left: 540 - 420, top: 300 - 420, width: 840, height: 840, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,240,200,0.95) 0%, rgba(255,214,140,0.45) 30%, rgba(255,214,140,0) 68%)", opacity: senal, transform: `scale(${0.3 + 0.7 * senal})`, mixBlendMode: "screen" }} />
        <RayosDeLuz x={540} y={300} largo={1200} angulo={90} apertura={80} n={7} color="#FFE9B0" fuerza={0.4 * senal} />
        {/* sol que se cubre de sombra */}
        <div style={{ position: "absolute", left: 200 - 190, top: 560 - 190, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,225,150,0.6) 0%, rgba(255,200,100,0) 70%)", opacity: sol * (1 - 0.7 * eclipse) }} />
        <div style={{ position: "absolute", left: 200 - 110, top: 560 - 110, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle at 40% 38%, #FFF3C8, #F2B84A)", opacity: sol }} />
        <div style={{ position: "absolute", left: 200 - 116 + (1 - eclipse) * 250, top: 560 - 116, width: 232, height: 232, borderRadius: "50%", background: "#04081A", boxShadow: eclipse > 0.7 ? "0 0 40px 6px rgba(255,200,110,0.55)" : undefined, opacity: sol }} />
        {/* luna que pierde su resplandor */}
        <div style={{ position: "absolute", left: 900 - 150, top: 640 - 150, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(235,240,255,0.55) 0%, rgba(235,240,255,0) 70%)", opacity: lunaA * (1 - lunaDim) }} />
        <div style={{ position: "absolute", left: 900 - 80, top: 640 - 80, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle at 38% 36%, ${mezcla("#FDFBF0", "#2C3550", lunaDim)}, ${mezcla("#D6D8E0", "#1C2238", lunaDim)})`, opacity: lunaA }} />
        {/* montes oscuros, y los mismos iluminados de oriente a occidente por el relámpago */}
        <Cadena />
        <div style={{ position: "absolute", left: 0, top: 0, width: Math.max(0, luzX), height: 1920, overflow: "hidden", opacity: montesLuz }}>
          <Cadena lit />
        </div>
        {/* lago: reflejo */}
        <div style={{ position: "absolute", left: -600, top: 1480, width: 2280, height: 700, background: "linear-gradient(180deg,#14264A 0%,#0A1530 100%)" }} />
        <div style={{ position: "absolute", left: 0, top: 1480, width: 1080, height: 440, overflow: "hidden", opacity: 0.42, filter: "blur(2.5px)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, transform: "scaleY(-1) translateY(-1480px)", transformOrigin: "0 0", width: 1080, height: 1920 }}>
            <Cadena />
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, top: 1480, width: Math.max(0, luzX), height: 440, background: "linear-gradient(180deg, rgba(255,170,80,0.5), rgba(255,170,80,0))", opacity: montesLuz, mixBlendMode: "screen", WebkitMaskImage: "linear-gradient(90deg, #000 70%, transparent 100%)" }} />
        <svg width={1080} height={440} style={{ position: "absolute", left: 0, top: 1480, overflow: "hidden" }}>
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M -40 ${40 + i * 44} q 30 -9 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0`} transform={`translate(${((f * (0.5 + (i % 3) * 0.3)) % 120) - 60} 0)`} stroke="#6C93C8" strokeWidth={3} fill="none" opacity={0.28} />
          ))}
        </svg>
        {/* el relámpago dorado cruza la pantalla de lado a lado */}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d={`M ${trazo}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} stroke="#F2B84A" strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.35 * (f > fB ? Math.max(0, 1 - (f - fB - 18) / 22) : 0)} />
          <path d={`M ${trazo}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} stroke="#FFF3C8" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={f > fB ? Math.max(0, 1 - (f - fB - 18) / 22) : 0} />
          {[3, 7, 11, 15].map((k) => (
            <path key={k} d={`M ${RAYO[k][0]} ${RAYO[k][1]} l ${(azar(k) - 0.5) * 90} ${150 + azar(k * 3) * 190}`} stroke="#FFF3C8" strokeWidth={5} fill="none" strokeLinecap="round" opacity={p > k / 20 ? Math.max(0, 1 - (f - fB - k) / 26) : 0} />
          ))}
        </svg>
      </Camara>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 40%, #FFE9B0, #F2B84A 60%, rgba(242,184,74,0.6))", opacity: destello, mixBlendMode: "screen" }} />
      <Agua nivel={agua} opacidad={aguaOp} />
      <Dato texto="Mateo 24:27-30" aparece={10} y={330} tam={42} />
      <Textura />
      <Sfx archivo="brillo" en={fB} volumen={0.22} />
      <Sfx archivo="trueno" en={fB + 6} volumen={0.2} />
      <Sfx archivo="trueno" en={fB + 36} volumen={0.1} />
      <Sfx archivo="tension" en={fSol - 6} volumen={0.12} />
      <Sfx archivo="brillo" en={fSenal} volumen={0.18} />
    </AbsoluteFill>
  );
};

// ================= 4. SOBRE LAS NUBES Y LA ÚLTIMA TROMPETA =================
const Nube: React.FC<{ x: number; y: number; e: number; tono?: number }> = ({ x, y, e, tono = 0 }) => {
  const claro = mezcla("#FFF6DC", "#9FB0D0", tono);
  const oro = mezcla("#F7D27A", "#6E7FA6", tono);
  return (
    <g transform={`translate(${x} ${y}) scale(${e})`}>
      <ellipse cx={0} cy={24} rx={260} ry={64} fill={oro} />
      <ellipse cx={-130} cy={-8} rx={120} ry={74} fill={claro} />
      <ellipse cx={20} cy={-40} rx={150} ry={92} fill={claro} />
      <ellipse cx={150} cy={-6} rx={118} ry={70} fill={claro} />
      <ellipse cx={0} cy={30} rx={250} ry={50} fill={claro} opacity={0.9} />
      <ellipse cx={-30} cy={52} rx={210} ry={26} fill={oro} opacity={0.65} />
    </g>
  );
};

const Rostro: React.FC<{ quien: Quien; x: number; y: number; d: number; e: number; semilla?: number }> = ({ quien, x, y, d, e, semilla = 1 }) => {
  const f = useCurrentFrame();
  const ancho = d * 2.15;
  const k = ancho / 600;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${e})`, opacity: e }}>
      <div style={{ width: d, height: d, borderRadius: "50%", overflow: "hidden", position: "relative", border: `6px solid ${PAL.dorado}`, background: "linear-gradient(180deg,#FFE9B0,#C98A3E)", boxShadow: "0 0 40px rgba(255,214,140,0.8), 0 14px 30px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "absolute", left: d / 2, top: d / 2 - 210 * k + 8 }}>
          <Persona quien={quien} ancho={ancho} mirada={[0, -9]} cabeza={-5 + Math.sin(f / 30 + semilla) * 1.5} cejas={{ y: -5 }} boca={{ curva: 6 }} semilla={semilla} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% -10%, rgba(255,236,180,0.7), rgba(255,236,180,0) 62%)" }} />
      </div>
    </div>
  );
};

// Peregrino luminoso (silueta de una persona de cualquier nación). (x, y) = pies.
const TUNICAS = ["#F7F1E3", "#E3B04B", "#7FA6E0", "#C8402F", "#3E8E5A", "#9A6ACD", "#D9703A", "#E9A8B8"];
const PIELES = ["#C99470", "#B98260", "#D2A383", "#A97352", "#8A5A3E", "#E0B796"];
const Peregrino: React.FC<{ x: number; y: number; e: number; i: number; brillo?: number; op?: number }> = ({ x, y, e, i, brillo = 1, op = 1 }) => {
  const f = useCurrentFrame();
  const paso = Math.sin(f / 5 + i) * 2 * e;
  const tipo = i % 4;
  return (
    <g transform={`translate(${x} ${y + paso}) scale(${e})`} opacity={op}>
      <circle cx={0} cy={-62} r={64} fill="url(#per-glow)" opacity={0.8 * brillo} />
      <path d="M -22 0 Q -28 -66 -12 -90 L 12 -90 Q 28 -66 22 0 Z" fill={TUNICAS[(i * 3) % 8]} stroke="rgba(255,255,255,0.55)" strokeWidth={2.5} />
      <circle cx={0} cy={-108} r={15} fill={PIELES[(i * 5) % 6]} />
      {tipo === 1 ? <ellipse cx={0} cy={-118} rx={19} ry={11} fill="#F7F1E3" stroke="#CFC6B0" strokeWidth={1.5} /> : null}
      {tipo === 2 ? <path d="M -17 -106 Q -22 -128 0 -128 Q 22 -128 17 -106 Q 18 -90 0 -86 Q -18 -90 -17 -106 Z" fill={TUNICAS[(i * 3 + 2) % 8]} opacity={0.9} /> : null}
      {tipo === 3 ? <path d="M -16 -116 Q 0 -140 16 -116 Z" fill="#3A2418" /> : null}
      {tipo === 0 ? <path d="M -15 -112 Q 0 -128 15 -112 Q 6 -118 -15 -112 Z" fill="#2A1B13" /> : null}
    </g>
  );
};
const DefsPeregrino: React.FC = () => (
  <defs>
    <radialGradient id="per-glow">
      <stop offset="0%" stopColor="#FFF3C8" stopOpacity={0.9} />
      <stop offset="100%" stopColor="#F2C14E" stopOpacity={0} />
    </radialGradient>
  </defs>
);

const Trompeta: React.FC<{ x: number; y: number; giro: number; e: number }> = ({ x, y, giro, e }) => (
  <g transform={`translate(${x} ${y}) rotate(${giro}) scale(${e})`}>
    <path d="M 0 0 L 300 0" stroke="#8A6420" strokeWidth={30} strokeLinecap="round" />
    <path d="M 0 0 L 300 0" stroke="#F2C14E" strokeWidth={22} strokeLinecap="round" />
    <path d="M 0 -6 L 300 -6" stroke="#FFF3C8" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
    <path d="M 290 -18 Q 380 -34 420 -108 L 450 -108 L 450 108 L 420 108 Q 380 34 290 18 Z" fill="#F2C14E" stroke="#8A6420" strokeWidth={5} />
    <ellipse cx={450} cy={0} rx={22} ry={108} fill="#B8862A" stroke="#8A6420" strokeWidth={5} />
    <ellipse cx={450} cy={0} rx={12} ry={86} fill="#4A2E10" />
    <path d="M 300 -14 Q 380 -26 412 -84" stroke="#FFF3C8" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.7} />
    <rect x={-14} y={-16} width={20} height={32} rx={6} fill="#8A6420" />
    <circle cx={120} cy={0} r={15} fill="#E3B04B" stroke="#8A6420" strokeWidth={3} />
    <circle cx={210} cy={0} r={15} fill="#E3B04B" stroke="#8A6420" strokeWidth={3} />
  </g>
);

const Trono: React.FC<{ x: number; y: number; e: number }> = ({ x, y, e }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${e})`}>
      <defs>
        <linearGradient id="tr-oro" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFBEA" />
          <stop offset="0.5" stopColor="#F6D77A" />
          <stop offset="1" stopColor="#C8922E" />
        </linearGradient>
      </defs>
      <circle cx={0} cy={-80} r={360 + Math.sin(f / 20) * 14} fill="none" stroke="#FFE9B0" strokeWidth={4} opacity={0.5} />
      <circle cx={0} cy={-80} r={290} fill="none" stroke="#FFE9B0" strokeWidth={2} opacity={0.4} />
      {[220, 300, 380].map((w, i) => (
        <rect key={w} x={-w / 2} y={150 - i * 38} width={w} height={38} fill="url(#tr-oro)" stroke="#B8862A" strokeWidth={3} />
      ))}
      <path d="M -92 40 L -92 -190 Q -92 -274 0 -288 Q 92 -274 92 -190 L 92 40 Z" fill="url(#tr-oro)" stroke="#B8862A" strokeWidth={5} />
      <path d="M -60 20 L -60 -180 Q -60 -236 0 -248 Q 60 -236 60 -180 L 60 20 Z" fill="#FFF6D8" opacity={0.85} />
      <rect x={-150} y={-30} width={58} height={70} rx={10} fill="url(#tr-oro)" stroke="#B8862A" strokeWidth={4} />
      <rect x={92} y={-30} width={58} height={70} rx={10} fill="url(#tr-oro)" stroke="#B8862A" strokeWidth={4} />
      <rect x={-92} y={20} width={184} height={50} fill="url(#tr-oro)" stroke="#B8862A" strokeWidth={4} />
    </g>
  );
};

const Nubes: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fTodo = useMomento("todo", 0.2);
  const fSonara = useMomento("Sonará", 0.34);
  const fMuertos = useMomento("resucitarán", 0.56);
  const fAnte = useMomento("Ante", 0.7);
  const abre = SUAVE(cl(f / 52));
  const baja = lerp(f, 6, 96, 0, 1, SUAVE);
  const aA = 1 - lerp(f, fTodo - 8, fTodo + 2, 0, 1);
  const aRostros = lerp(f, fTodo - 6, fTodo + 6, 0, 1) * (1 - lerp(f, fSonara - 6, fSonara + 4, 0, 1));
  const aB = lerp(f, fSonara - 6, fSonara + 4, 0, 1) * (1 - lerp(f, fAnte - 6, fAnte + 6, 0, 1));
  const aC = lerp(f, fAnte - 6, fAnte + 6, 0, 1);
  const ondas = (f - (fSonara + 8)) / 22;
  const suben = (i: number) => lerp(f, fMuertos - 8 + (i % 7) * 3, fMuertos + 26 + (i % 7) * 3, 0, 1, Easing.out(Easing.cubic));
  const tr = (n: number) => lerp(f, fAnte + 6 + (n % 11) * 2, duracion - 6, 0, 1, Easing.out(Easing.cubic));
  const REUNEN = Array.from({ length: 44 }, (_, i) => i);
  const flash = Math.max(0, 0.5 * Math.exp(-Math.abs(f - (fAnte + 4)) / 5));
  return (
    <AbsoluteFill style={{ background: "#0B1426" }}>
      {/* A. las nubes se abren y desciende el Hijo del Hombre */}
      {aA > 0.01 ? (
        <AbsoluteFill style={{ opacity: aA, transform: `scale(${1 + 0.05 * f / 100})`, transformOrigin: "540px 800px" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#0B1630 0%,#1C3566 40%,#C98A3E 100%)" }} />
          <div style={{ position: "absolute", left: 540 - 500, top: 700 - 500, width: 1000, height: 1000, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,240,200,1) 0%, rgba(255,214,140,0.6) 32%, rgba(255,214,140,0) 68%)", opacity: 0.4 + 0.6 * abre }} />
          <RayosDeLuz x={540} y={480} largo={1500} angulo={90} apertura={70} n={9} color="#FFE9B0" fuerza={0.55 * abre} />
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            <Nube x={170 - abre * 360} y={700} e={1.25} tono={0.35} />
            <Nube x={900 + abre * 360} y={720} e={1.3} tono={0.35} />
            <Nube x={90 - abre * 300} y={980} e={1.5} tono={0.1} />
            <Nube x={980 + abre * 300} y={1000} e={1.5} tono={0.1} />
          </svg>
          <div style={{ position: "absolute", left: 0, top: 0, filter: "drop-shadow(0 0 50px rgba(255,226,160,0.95))" }}>
            <Fig quien="jesus2" edad={1} x={540} suelo={1010 + 220 * baja} ancho={420} mirada={[0, 2]} boca={{ curva: 6 }} brazoIzq={{ hombro: 58 + 6 * Math.sin(f / 20), codo: 26, mano: "abierta" }} brazoDer={{ hombro: 58 + 6 * Math.sin(f / 20), codo: 26, mano: "abierta" }} semilla={1} />
          </div>
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            <Nube x={300} y={1260 + 40 * (1 - abre)} e={1.7} tono={0} />
            <Nube x={800} y={1290 + 40 * (1 - abre)} e={1.7} tono={0} />
            <Nube x={540} y={1380} e={2.0} tono={0} />
          </svg>
        </AbsoluteFill>
      ) : null}
      {/* rostros de todo el mundo, mirando el mismo cielo */}
      {aRostros > 0.01 ? (
        <AbsoluteFill style={{ opacity: aRostros }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#0B1630 0%,#16284C 60%,#2A3A62 100%)" }} />
          <RayosDeLuz x={540} y={-80} largo={1700} angulo={90} apertura={60} n={8} color="#FFE9B0" fuerza={0.45} />
          {[
            { q: "fiel6" as Quien, x: 190, y: 820, s: 1 },
            { q: "oyente1" as Quien, x: 540, y: 700, s: 2 },
            { q: "fiel5" as Quien, x: 890, y: 820, s: 3 },
            { q: "oyente2" as Quien, x: 365, y: 1100, s: 4 },
            { q: "fiel4" as Quien, x: 715, y: 1100, s: 5 },
          ].map((r, i) => (
            <Rostro key={i} quien={r.q} x={r.x} y={r.y} d={300} e={lerp(f, fTodo - 6 + i * 3, fTodo + 12 + i * 3, 0, 1, Easing.out(Easing.back(1.4)))} semilla={r.s} />
          ))}
          <Dato texto="Todo ojo lo verá — Apocalipsis 1:7" aparece={fTodo - 2} y={380} tam={40} />
        </AbsoluteFill>
      ) : null}
      {/* B. la última trompeta: la onda dorada baja a la tierra y los muertos se levantan */}
      {aB > 0.01 ? (
        <AbsoluteFill style={{ opacity: aB }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#07102A 0%,#162C58 46%,#5A4A6A 74%,#C98A3E 100%)" }} />
          <Estrellas n={60} alto={900} />
          <Montes y={1280} color="#101A38" bruma="#0A1226" amp={80} paso={260} semilla={3} />
          <Montes y={1380} color="#0A1228" bruma="#070C1C" amp={60} paso={180} semilla={9} />
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <DefsPeregrino />
            {[0, 1, 2, 3, 4].map((k) => {
              const p = ((ondas + k * 0.22) % 1.1);
              return p > 0 && ondas > 0 ? <circle key={k} cx={640} cy={470} r={80 + p * 1100} fill="none" stroke="#F2C14E" strokeWidth={10 * (1 - p / 1.1)} opacity={0.65 * (1 - p / 1.1)} /> : null;
            })}
            <Trompeta x={250} y={300} giro={22} e={0.9} />
            {Array.from({ length: 22 }, (_, i) => (
              <Peregrino key={i} x={90 + (i % 11) * 90 + (i > 10 ? 40 : 0)} y={1330 + (i > 10 ? 70 : 0) - 70 * suben(i)} e={1.15 + (i > 10 ? 0.25 : 0)} i={i} brillo={suben(i)} op={suben(i)} />
            ))}
          </svg>
          <Dato texto="1 Corintios 15:52" aparece={fSonara + 8} y={800} tam={40} hasta={fMuertos + 40} />
        </AbsoluteFill>
      ) : null}
      {/* C. el trono resplandeciente y las naciones que convergen */}
      {aC > 0.01 ? (
        <AbsoluteFill style={{ opacity: aC }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#0B1630 0%,#24407A 36%,#E3B04B 68%,#7A5A3A 100%)" }} />
          <RayosDeLuz x={540} y={560} largo={1400} angulo={90} apertura={110} n={11} color="#FFF3C8" fuerza={0.5} />
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <DefsPeregrino />
            <circle cx={540} cy={560} r={420} fill="url(#per-glow)" opacity={0.55} />
            <Trono x={540} y={660} e={1.0} />
            {REUNEN.map((i) => {
              const izq = i % 2 === 0;
              const fila = Math.floor(i / 2);
              const xi = izq ? -60 - (fila % 4) * 60 : 1140 + (fila % 4) * 60;
              const yi = 1520 + (fila % 5) * 34;
              const xf = 540 + (izq ? -1 : 1) * (70 + (fila % 9) * 38);
              const yf = 1180 + (fila % 5) * 34 - (fila % 3) * 26;
              const q = tr(i);
              const e = 0.8 + (yi - 1400) / 700;
              return <Peregrino key={i} x={xi + (xf - xi) * q} y={yi + (yf - yi) * q} e={e + 0.5} i={i} brillo={0.7} op={Math.min(1, q * 3)} />;
            })}
          </svg>
          <Dato texto="Mateo 25:31-32" aparece={fAnte + 10} y={380} tam={42} />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #FFF3C8, rgba(255,230,160,0.4) 60%, rgba(255,230,160,0))", opacity: flash, mixBlendMode: "screen" }} />
      <Textura />
      <Sfx archivo="brillo" en={4} volumen={0.2} />
      <Sfx archivo="coro" en={6} volumen={0.1} />
      <Sfx archivo="trompeta" en={fSonara + 8} volumen={0.4} />
      <Sfx archivo="expansion" en={fMuertos - 20} volumen={0.16} />
      <Sfx archivo="brillo" en={fMuertos} volumen={0.16} />
      <Sfx archivo="multitud" en={fAnte + 14} volumen={0.16} />
      <Sfx archivo="brillo" en={fAnte} volumen={0.2} />
    </AbsoluteFill>
  );
};

// ================= 5. NO ES MIEDO, ES UNA PROMESA =================
const Promesa: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fMiedo = useMomento("miedo", 0.16);
  const fProm = useMomento("promesa", 0.3);
  const fDios = useMomento("Dios", 0.41);
  const fLagrima = useMomento("lágrima", 0.55);
  const fMuerte = useMomento("muerte", 0.72);
  const calma = lerp(f, fDios + 2, fLagrima + 20, 0, 1);
  const lluevenSombras = lerp(f, fLagrima + 10, duracion - 14, 0, 1);
  const lagrima = lerp(f, fMiedo + 4, fProm + 40, 0, 1, Easing.inOut(Easing.quad));
  const evapora = lerp(f, fDios + 16, fLagrima + 26, 0, 1);
  const rayo = lerp(f, fDios - 6, fDios + 22, 0, 1);
  const ANCHO = 1750;
  const K = ANCHO / 600;
  const ojoX = 540 + 38 * K;
  const ojoY = 900 + 18 * K;
  const mejillaX = (t: number) => ojoX + 10 * K * t + Math.sin(t * 3) * 3;
  const lx = mejillaX(lagrima);
  const ly = ojoY + lagrima * 150 * K * 0.62;
  const zoom = 1 + 0.06 * (f / duracion);
  return (
    <AbsoluteFill style={{ background: "#0B1426" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, #243C6A 0%, #12203E 60%, #0A1124 100%)" }} />
      <div style={{ position: "absolute", inset: 0, opacity: lluevenSombras, background: "radial-gradient(ellipse at 50% 38%, #FFF4D2 0%, #F1E2BC 45%, #EAD9B5 80%, #D9BE86 100%)" }} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "540px 900px" }}>
        <FigCabeza
          quien="fiel4"
          x={540}
          y={900}
          ancho={ANCHO}
          mirada={[0, -4 - 3 * calma]}
          cabeza={-3 * calma}
          ojos={1 - 0.25 * calma}
          cejas={{ rot: 7 * (1 - calma) - 2 * calma, y: 3 * (1 - calma) - 3 * calma }}
          boca={{ curva: -6 + 18 * calma, apertura: 0.05 }}
          semilla={4}
        />
        {/* la lágrima que caía por la mejilla */}
        {lagrima > 0.01 && evapora < 0.98 ? (
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path d={`M ${ojoX} ${ojoY} Q ${ojoX + 6} ${(ojoY + ly) / 2} ${lx} ${ly}`} stroke="rgba(190,225,255,0.55)" strokeWidth={9} fill="none" strokeLinecap="round" opacity={1 - evapora} />
            <path d={`M ${lx} ${ly - 30} Q ${lx + 17} ${ly + 8} ${lx} ${ly + 20} Q ${lx - 17} ${ly + 8} ${lx} ${ly - 30} Z`} fill="rgba(210,235,255,0.92)" stroke="rgba(255,255,255,0.9)" strokeWidth={3} opacity={1 - evapora} />
          </svg>
        ) : null}
        {evapora > 0 && evapora < 1 ? (
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {Array.from({ length: 26 }, (_, i) => {
              const u = azar(i * 7);
              const p = cl(evapora * 1.2 - u * 0.2);
              return <circle key={i} cx={ojoX + 10 * K + (azar(i * 3) - 0.5) * 90 + Math.sin(p * 6 + i) * 12} cy={ly - p * (160 + u * 260)} r={5 + azar(i * 5) * 7} fill="#FFE9A8" opacity={(1 - p) * 0.9} />;
            })}
          </svg>
        ) : null}
      </div>
      {/* luz cálida que acaricia el rostro */}
      <AbsoluteFill style={{ opacity: rayo * (1 - 0.3 * calma) }}>
        <div style={{ position: "absolute", left: 300, top: -200, width: 1100, height: 1400, transform: "rotate(-28deg)", transformOrigin: "50% 0", background: "linear-gradient(90deg, rgba(255,226,160,0) 0%, rgba(255,226,160,0.55) 45%, rgba(255,226,160,0) 100%)", mixBlendMode: "screen" }} />
      </AbsoluteFill>
      <RayosDeLuz x={940} y={-60} largo={1500} angulo={115} apertura={50} n={6} color="#FFE9B0" fuerza={0.45 * rayo} />
      <Polvo x={140} y={300} ancho={800} alto={1200} n={26} semilla={8} />
      <Dato texto="Apocalipsis 21:4 — Ya no habrá muerte ni dolor" aparece={fMuerte - 6} y={330} tam={36} />
      <Textura />
      <Sfx archivo="brillo" en={fDios - 4} volumen={0.2} />
      <Sfx archivo="coro" en={fDios - 4} volumen={0.12} />
      <Sfx archivo="brillo" en={fLagrima + 10} volumen={0.16} />
    </AbsoluteFill>
  );
};

// ================= 6. EL ENCARGO: ESTAR PREPARADOS =================
const LAMP = { x: 500, y: 1210 };
const Llama: React.FC<{ x: number; y: number; g: number; e?: number }> = ({ x, y, g, e = 1 }) => {
  const f = useCurrentFrame();
  const fl = 1 + 0.08 * Math.sin(f / 3) + 0.05 * Math.sin(f / 7);
  return (
    <g transform={`translate(${x} ${y}) scale(${e * g * fl})`}>
      <path d="M 0 0 Q -26 -36 0 -112 Q 28 -36 0 0 Z" fill="#F2B84A" />
      <path d="M 0 0 Q -17 -28 0 -86 Q 18 -28 0 0 Z" fill="#FFE08A" />
      <path d="M 0 0 Q -8 -18 0 -50 Q 9 -18 0 0 Z" fill="#FFFBEA" />
    </g>
  );
};

const Preparados: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const mano = lerp(f, 0, 22, 1, 0, SUAVE) + lerp(f, 40, 62, 0, 1, SUAVE);
  const g = lerp(f, 22, 46, 0, 1, Easing.out(Easing.cubic));
  const pal = { x: LAMP.x + 92, y: LAMP.y - 70 };
  const hx = pal.x + 430 * mano;
  const hy = pal.y - 160 * mano;
  const zoom = lerp(f, 38, duracion, 1.0, 3.2, Easing.in(Easing.quad));
  const fx = pal.x;
  const fy = pal.y - 40;
  return (
    <AbsoluteFill style={{ background: "#05080F" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${540 - fx * zoom}px, ${960 - fy * zoom}px) scale(${zoom})`, transformOrigin: "0 0" }}>
        <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 3600, background: "#05080F" }} />
        {/* la llama ilumina la oscuridad */}
        <div style={{ position: "absolute", left: pal.x - 760, top: pal.y - 760, width: 1520, height: 1520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,214,140,0.55) 0%, rgba(255,180,90,0.22) 32%, rgba(255,160,70,0) 66%)", opacity: g, mixBlendMode: "screen" }} />
        <div style={{ position: "absolute", left: -900, top: 1260, width: 2900, height: 1400, background: "linear-gradient(180deg,#3A2616 0%,#1A1008 100%)", opacity: 0.4 + 0.6 * g }} />
        <div style={{ position: "absolute", left: -900, top: 1258, width: 2900, height: 6, background: "rgba(255,210,130,0.5)", opacity: g }} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {/* lámpara de aceite de barro */}
          <path d={`M ${LAMP.x - 120} ${LAMP.y + 50} Q ${LAMP.x - 130} ${LAMP.y - 30} ${LAMP.x - 30} ${LAMP.y - 54} L ${LAMP.x + 36} ${LAMP.y - 54} Q ${LAMP.x + 100} ${LAMP.y - 60} ${LAMP.x + 130} ${LAMP.y - 76} L ${LAMP.x + 150} ${LAMP.y - 66} Q ${LAMP.x + 118} ${LAMP.y - 30} ${LAMP.x + 96} ${LAMP.y + 10} Q ${LAMP.x + 40} ${LAMP.y + 70} ${LAMP.x - 40} ${LAMP.y + 70} Q ${LAMP.x - 100} ${LAMP.y + 70} ${LAMP.x - 120} ${LAMP.y + 50} Z`} fill="#B8663E" stroke="#5A2E1A" strokeWidth={5} />
          <path d={`M ${LAMP.x - 96} ${LAMP.y + 30} Q ${LAMP.x - 100} ${LAMP.y - 10} ${LAMP.x - 30} ${LAMP.y - 36}`} stroke="#E0905A" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.7} />
          <path d={`M ${LAMP.x - 120} ${LAMP.y - 10} Q ${LAMP.x - 190} ${LAMP.y - 20} ${LAMP.x - 176} ${LAMP.y + 40} Q ${LAMP.x - 160} ${LAMP.y + 60} ${LAMP.x - 120} ${LAMP.y + 40}`} stroke="#8E4A2E" strokeWidth={16} fill="none" strokeLinecap="round" />
          <ellipse cx={LAMP.x} cy={LAMP.y - 54} rx={34} ry={9} fill="#3A2210" />
          <path d={`M ${LAMP.x + 134} ${LAMP.y - 76} L ${pal.x} ${pal.y}`} stroke="#2A1608" strokeWidth={6} strokeLinecap="round" opacity={0} />
          <Llama x={pal.x + 44} y={pal.y + 4} g={g} e={0.62} />
          {/* mano que enciende la lámpara con una astilla encendida */}
          <g opacity={Math.min(1, 1.2 - mano * 0.6)}>
            <path d={`M ${hx + 560} ${hy - 70} L ${hx + 150} ${hy - 44} L ${hx + 142} ${hy + 44} L ${hx + 560} ${hy + 110} Z`} fill="#C9B48D" stroke="#8E7A52" strokeWidth={4} />
            <path d={`M ${hx + 560} ${hy - 70} L ${hx + 150} ${hy - 44} L ${hx + 146} ${hy - 20} L ${hx + 560} ${hy - 30} Z`} fill="#E3D2AA" opacity={0.7} />
            <rect x={hx + 128} y={hy - 52} width={26} height={104} rx={8} fill="#A99268" stroke="#8E7A52" strokeWidth={3} />
            <path d={`M ${hx + 132} ${hy - 36} Q ${hx + 70} ${hy - 50} ${hx + 36} ${hy - 26} Q ${hx + 14} ${hy - 4} ${hx + 34} ${hy + 22} Q ${hx + 66} ${hy + 44} ${hx + 132} ${hy + 34} Z`} fill="#C99470" stroke="#8E5E40" strokeWidth={4} />
            <path d={`M ${hx + 44} ${hy - 22} Q ${hx + 12} ${hy - 30} ${hx - 2} ${hy - 10} M ${hx + 40} ${hy - 2} Q ${hx + 8} ${hy - 4} ${hx - 4} ${hy + 14} M ${hx + 44} ${hy + 16} Q ${hx + 16} ${hy + 20} ${hx + 4} ${hy + 34}`} stroke="#C99470" strokeWidth={13} fill="none" strokeLinecap="round" />
            <path d={`M ${hx + 44} ${hy - 22} Q ${hx + 12} ${hy - 30} ${hx - 2} ${hy - 10} M ${hx + 40} ${hy - 2} Q ${hx + 8} ${hy - 4} ${hx - 4} ${hy + 14} M ${hx + 44} ${hy + 16} Q ${hx + 16} ${hy + 20} ${hx + 4} ${hy + 34}`} stroke="#8E5E40" strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.6} />
            <path d={`M ${hx + 20} ${hy - 6} L ${hx - 70} ${hy - 12}`} stroke="#6E4526" strokeWidth={8} strokeLinecap="round" />
            <Llama x={hx - 72} y={hy - 10} g={g < 0.05 ? 0.55 : 0.0} e={0.34} />
          </g>
        </svg>
      </div>
      <Textura fuerza={0.8} />
      <Sfx archivo="llama" en={20} volumen={0.3} />
      <Sfx archivo="brillo" en={26} volumen={0.14} />
    </AbsoluteFill>
  );
};

// ================= 7. COMENTAR Y SEGUIR =================
const Cierre: React.FC<PropsEscena> = ({ escena }) => {
  const f = useCurrentFrame();
  const llama = 1 - lerp(f, 8, 40, 0, 1);
  const apertura = lerp(f, 24, 56, 0, 1);
  const titulo = lerp(f, 50, 68, 0, 1, Easing.out(Easing.cubic));
  const lema = lerp(f, 66, 82, 0, 1);
  const luz = lerp(f, 6, 48, 0, 1);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #24395F 0%, #0B1426 70%)" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: luz }}>
        <defs>
          <radialGradient id="cr-luz" cx="50%" cy="58%" r="45%">
            <stop offset="0%" stopColor="#FFE9B0" stopOpacity={0.85} />
            <stop offset="100%" stopColor="#FFE9B0" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={540} cy={1120} r={760} fill="url(#cr-luz)" />
        {Array.from({ length: 9 }, (_, i) => {
          const a = -150 + i * 15 + Math.sin(f / 30 + i) * 2;
          const r = (a * Math.PI) / 180;
          return <path key={i} d={`M 540 1120 L ${540 + Math.cos(r - 0.04) * 1100} ${1120 + Math.sin(r - 0.04) * 1100} L ${540 + Math.cos(r + 0.04) * 1100} ${1120 + Math.sin(r + 0.04) * 1100} Z`} fill="#FFE9B0" opacity={0.12} />;
        })}
      </svg>
      {/* la llama de la lámpara se transforma en luz cálida sobre el libro */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: llama }}>
        <circle cx={540} cy={1000} r={620} fill="url(#cr-luz)" />
        <Llama x={540} y={1100} g={2.2 * (1 - 0.6 * (1 - llama))} />
      </svg>
      <div style={{ position: "absolute", left: 540, top: 1150 + Math.sin(f / 40) * 4, opacity: apertura > 0 ? 1 : 0 }}>
        <LibroAntiguo apertura={apertura} w={330} h={420} tapa={<TapaLibro w={330} h={420} />} izquierda={<Renglones x={40} y={50} ancho={250} n={10} paso={32} />} derecha={<Renglones x={40} y={50} ancho={250} n={10} paso={32} />} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", opacity: titulo, translate: `0px ${(1 - titulo) * 40}px` }}>
        <div style={{ fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 112, lineHeight: 1.0, color: PAL.crema, textShadow: "0 0 40px rgba(242,193,78,0.55), 0 8px 20px rgba(0,0,0,0.5)" }}>
          Versículo
          <br />
          <span style={{ color: PAL.dorado }}>Oculto</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 830, textAlign: "center", opacity: lema, fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 54, whiteSpace: "nowrap", color: PAL.pergamino }}>
        {escena.lema ?? "Comentá AMÉN y seguinos"}
      </div>
      <Textura fuerza={0.7} />
      <Sfx archivo="pagina" en={26} volumen={0.4} />
      <Sfx archivo="brillo" en={48} volumen={0.3} />
    </AbsoluteFill>
  );
};

export const ESCENAS_REGRESO: Record<string, React.FC<{ escena: EscenaAnimada }>> = {
  "regreso/apertura": Apertura,
  "regreso/noe": Noe,
  "regreso/relampago": Relampago,
  "regreso/nubes": Nubes,
  "regreso/promesa": Promesa,
  "regreso/preparados": Preparados,
  "regreso/cierre": Cierre,
};

export { Nube, Trono, Rostro, Peregrino, DefsPeregrino };
void manoDe;
void (null as unknown as Brazo);
