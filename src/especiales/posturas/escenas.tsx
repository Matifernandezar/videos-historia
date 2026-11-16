// Escenas del video "¿Por qué cambiamos de postura en misa?" (Versículo Oculto).
// Fuentes: Instrucción General del Misal Romano 29, 43, 60 y 150; Concilio de Nicea (325), canon 20; Lucas 10:38-42.
// La comunidad se ve de frente, detrás del respaldo del banco de adelante: sentarse, pararse y arrodillarse
// es cuánto asoma cada persona por encima del respaldo (`alt`, en unidades del dibujo).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { useEscena } from "../../video/contexto";
import type { EscenaAnimada } from "../../video/tipos";
import { FUENTE_SERIFA, FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { Sfx, useMomento } from "../comun";
import { paletaDe, Persona, type Brazo, type PropsPersona, type Quien } from "../jesus-12-30/personas";
import { Camara, Capa, lerp, PAL, Referencia, Textura } from "../jesus-12-30/escenarios";
import { Arbol, Astro, Bruma, CasaAdobe, CieloV2, Gradacion, Montes, Pasto, Polvo, RayosDeLuz, Suelo } from "../ambiente";
import { Fig, gestoEnsenar, osc } from "../jesus-12-30/escenas";
import { mezclarBrazo } from "../amen/escenas";
import { Interior } from "../cizana/escenas";

type PropsEscena = { escena: EscenaAnimada };
const cl = (v: number) => Math.max(0, Math.min(1, v));
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SUAVE = Easing.inOut(Easing.cubic);
// valor por tramos (frames crecientes) con suavizado en cada tramo
const tramos = (f: number, fs: number[], vs: number[]) => {
  const g = fs.map((v, i) => (i > 0 && v <= fs[i - 1] ? fs[i - 1] + 1 + i * 0.001 : v));
  for (let i = 1; i < g.length; i++) if (g[i] <= g[i - 1]) g[i] = g[i - 1] + 1;
  return interpolate(f, g, vs, { ...CLAMP, easing: SUAVE });
};

// Encuadre de la vista de la comunidad: deja el borde del banco justo encima de los subtítulos.
const vista = (f: number, z: number, x = 540, dy = 0) => ({ f, x, y: 1210 - 380 / z + dy, z });

// Persona sentada en el suelo (de frente): torso normal y falda amplia apoyada en el piso.
const EnSuelo: React.FC<Omit<PropsPersona, "ancho"> & { x: number; suelo: number; ancho: number }> = ({ x, suelo, ancho, ...p }) => {
  const k = ancho / 600;
  const c = paletaDe(p.quien);
  const top = suelo - 840 * k;
  const corte = suelo - 140 * k;
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        <g transform={`translate(${x} ${suelo}) scale(${k})`}>
          <ellipse cx={0} cy={8} rx={310} ry={30} fill="rgba(0,0,0,0.28)" />
          <path d="M -150 -180 Q -310 -120 -296 -30 Q -286 12 -180 10 L 180 10 Q 286 12 296 -30 Q 310 -120 150 -180 Z" fill={c.tunica} stroke="rgba(60,40,20,0.55)" strokeWidth={5} />
          <path d="M -230 -36 Q -130 -112 -24 -46 M 230 -36 Q 130 -112 24 -46" stroke={c.tunicaSombra} strokeWidth={8} fill="none" strokeLinecap="round" />
          <path d="M -200 6 Q 0 -22 200 6" stroke={c.tunicaSombra} strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.8} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: -700, top: top - 300, width: 2600, height: corte - top + 300, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: x + 700, top: 300 }}>
          <Persona ancho={ancho} {...p} />
        </div>
      </div>
    </>
  );
};

// Persona sentada en un banco (de frente): regazo, piernas que cuelgan y pies. `asiento` = y del asiento.
const EnBanco: React.FC<Omit<PropsPersona, "ancho"> & { x: number; asiento: number; suelo: number; ancho: number }> = ({ x, asiento, suelo, ancho, ...p }) => {
  const k = ancho / 600;
  const c = paletaDe(p.quien);
  const top = asiento - 700 * k;
  const corte = asiento + 10 * k;
  const sr = (suelo - asiento) / k;
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        <g transform={`translate(${x} ${asiento}) scale(${k})`}>
          <ellipse cx={0} cy={sr + 6} rx={200} ry={24} fill="rgba(0,0,0,0.28)" />
          <ellipse cx={-62} cy={sr - 4} rx={46} ry={20} fill={c.piel} stroke="rgba(60,40,20,0.55)" strokeWidth={4} />
          <ellipse cx={62} cy={sr - 4} rx={46} ry={20} fill={c.piel} stroke="rgba(60,40,20,0.55)" strokeWidth={4} />
          <path d={`M -138 50 L 138 50 L 130 ${sr - 22} Q 0 ${sr - 4} -130 ${sr - 22} Z`} fill={c.tunicaSombra} stroke="rgba(60,40,20,0.55)" strokeWidth={5} />
          {c.manto ? <path d={`M -30 50 L 126 50 L 120 ${sr - 60} L -22 ${sr - 36} Z`} fill={c.mantoSombra ?? c.manto} /> : null}
          <path d="M -150 -50 L 150 -50 Q 176 10 164 62 Q 0 92 -164 62 Q -176 10 -150 -50 Z" fill={c.tunica} stroke="rgba(60,40,20,0.55)" strokeWidth={5} />
          {c.manto ? <path d="M -40 -50 L 124 -50 Q 150 10 142 66 Q 60 82 -30 80 Z" fill={c.manto} /> : null}
          <path d="M -110 66 Q -70 20 -20 60 M 110 64 Q 70 20 22 60" stroke="rgba(0,0,0,0.16)" strokeWidth={7} fill="none" strokeLinecap="round" />
        </g>
      </svg>
      <div style={{ position: "absolute", left: -700, top: top - 300, width: 2600, height: corte - top + 300, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: x + 700, top: 300 }}>
          <Persona ancho={ancho} {...p} />
        </div>
      </div>
    </>
  );
};

// Brazo con cinemática inversa (hombro → mano), con el codo hacia afuera. Para la elevación: el brazo
// sube hacia adelante, así que el tramo del hombro se ve corto (escorzo) y el antebrazo, largo.
const BrazoIK: React.FC<{ hombro: [number, number]; mano: [number, number]; lado: 1 | -1; k: number; tela: string; borde: string; piel: string }> = ({ hombro, mano, lado, k, tela, borde, piel }) => {
  const L1 = 112 * k;
  const L2 = 238 * k;
  const dx = mano[0] - hombro[0];
  const dy = mano[1] - hombro[1];
  const d = Math.max(Math.abs(L2 - L1) + 1, Math.min(Math.hypot(dx, dy), (L1 + L2) * 0.995));
  const base = Math.atan2(dy, dx);
  const a = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
  const cands = [base + a, base - a].map((g) => [hombro[0] + Math.cos(g) * L1, hombro[1] + Math.sin(g) * L1] as [number, number]);
  const codo = cands.sort((p1, p2) => p2[0] * lado - p1[0] * lado)[0];
  const g2 = Math.atan2(mano[1] - codo[1], mano[0] - codo[0]);
  const mun: [number, number] = [mano[0] - Math.cos(g2) * 46 * k, mano[1] - Math.sin(g2) * 46 * k];
  const contorno = "rgba(90,50,30,0.75)";
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      <path d={`M ${hombro[0]} ${hombro[1]} L ${codo[0]} ${codo[1]} L ${mun[0]} ${mun[1]}`} stroke={borde} strokeWidth={70 * k} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M ${hombro[0]} ${hombro[1]} L ${codo[0]} ${codo[1]} L ${mun[0]} ${mun[1]}`} stroke={tela} strokeWidth={62 * k} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* mano: palma, cuatro dedos y pulgar hacia adentro */}
      <g transform={`translate(${mano[0]} ${mano[1]}) rotate(${(g2 * 180) / Math.PI + 90}) scale(${k})`}>
        <rect x={-20} y={22} width={40} height={30} rx={8} fill={piel} stroke={contorno} strokeWidth={4} />
        {[-21, -7, 7, 21].map((x, n) => (
          <rect key={n} x={x - 7.5} y={-58 + Math.abs(x) * 0.5} width={15} height={50} rx={7.5} fill={piel} stroke={contorno} strokeWidth={3.5} />
        ))}
        <rect x={-31} y={-20} width={62} height={52} rx={20} fill={piel} stroke={contorno} strokeWidth={4} />
        <rect x={-27} y={-22} width={54} height={16} fill={piel} />
        <ellipse cx={-lado * 34} cy={-6} rx={10} ry={22} fill={piel} stroke={contorno} strokeWidth={3.5} transform={`rotate(${-lado * 28} ${-lado * 34} -6)`} />
      </g>
    </svg>
  );
};

// posturas: unidades del dibujo que quedan por encima del respaldo
const PIE_ = 720;
const SENT = 500;
const ROD = 592;

const B_REPOSO: Brazo = { hombro: 8, codo: -15 };
const B_REZA: Brazo = { hombro: 10, codo: -110, mano: "abierta" };
const B_FRENTE: Brazo = { hombro: 9, codo: -58, mano: "abierta" };

// ---------- piezas de la iglesia ----------
const MADERA = "#7A4E2A";

// Respaldo de un banco (franja de madera con moldura y tablas).
const Respaldo: React.FC<{ y: number; alto: number; tono?: number }> = ({ y, alto, tono = 1 }) => (
  <div style={{ position: "absolute", left: -700, top: y, width: 2480, height: alto, filter: `brightness(${tono})` }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#8A5A32 0%,#6E4526 22%,#5C3A20 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 22, background: "linear-gradient(180deg,#B07A46,#8A5A30)", borderRadius: 10, boxShadow: "0 6px 10px rgba(0,0,0,0.35)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 22, height: 5, background: "rgba(0,0,0,0.3)" }} />
    {Array.from({ length: 9 }, (_, i) => (
      <div key={i} style={{ position: "absolute", left: 40 + i * 300, top: 44, width: 240, height: Math.max(20, alto - 70), border: "5px solid rgba(40,22,10,0.45)", borderRadius: 8, background: "rgba(255,220,170,0.05)" }} />
    ))}
  </div>
);

// Pared del fondo de la nave (vista desde el altar): arcos, ventanales con luz, puerta y lámparas.
const ParedNave: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 3000, background: "linear-gradient(180deg,#131E3A 0%,#22335A 45%,#34466C 100%)" }} />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        {/* columnas y arcos */}
        {[-260, 180, 620, 1060].map((x, i) => (
          <g key={i}>
            <path d={`M ${x} 1100 L ${x} 300 Q ${x + 140} 40 ${x + 280} 300 L ${x + 280} 1100`} fill="none" stroke="#51638A" strokeWidth={46} />
            <path d={`M ${x + 23} 1100 L ${x + 23} 300 Q ${x + 140} 80 ${x + 257} 300`} fill="none" stroke="#6C7FA6" strokeWidth={6} opacity={0.6} />
            <rect x={x - 34} y={640} width={68} height={26} rx={8} fill="#6C7FA6" />
          </g>
        ))}
        {/* ventanales */}
        {[240, 680].map((x) => (
          <g key={x}>
            <path d={`M ${x} 560 L ${x} 300 Q ${x + 80} 170 ${x + 160} 300 L ${x + 160} 560 Z`} fill="#F4CB8C" stroke="#2A1E14" strokeWidth={12} />
            <path d={`M ${x + 80} 215 L ${x + 80} 560 M ${x} 400 L ${x + 160} 400`} stroke="#2A1E14" strokeWidth={8} />
            <path d={`M ${x + 14} 300 Q ${x + 80} 196 ${x + 146} 300 Z`} fill="#E9A64E" opacity={0.7} />
          </g>
        ))}
        {/* puerta del fondo */}
        <path d="M 440 900 L 440 640 Q 540 540 640 640 L 640 900 Z" fill="#4A3424" stroke="#2A1A10" strokeWidth={8} />
        <path d="M 540 592 L 540 900" stroke="#2A1A10" strokeWidth={6} />
        {/* lámparas colgantes */}
        {[130, 950].map((x, i) => (
          <g key={x} transform={`rotate(${Math.sin(f / 50 + i) * 1.2} ${x} -200)`}>
            <path d={`M ${x} -200 L ${x} 250`} stroke="#2A1E14" strokeWidth={4} />
            <path d={`M ${x - 26} 250 L ${x + 26} 250 L ${x + 18} 300 L ${x - 18} 300 Z`} fill="#D9B25A" stroke="#7A5A22" strokeWidth={3} />
            <circle cx={x} cy={292} r={11} fill="#FFE2A0" />
          </g>
        ))}
      </svg>
      {[130, 950].map((x) => (
        <div key={x} style={{ position: "absolute", left: x - 170, top: 292 - 170, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,214,140,0.45) 0%, rgba(255,214,140,0) 68%)", mixBlendMode: "screen" }} />
      ))}
      <RayosDeLuz x={320} y={380} largo={1200} angulo={62} apertura={26} n={3} color="#FFDCA8" fuerza={0.22} />
      <RayosDeLuz x={760} y={380} largo={1200} angulo={118} apertura={26} n={3} color="#FFDCA8" fuerza={0.22} />
    </>
  );
};

// Persona detrás del respaldo. `baranda` = y del borde del respaldo; `alt` = unidades visibles por encima.
const Fiel: React.FC<Omit<PropsPersona, "ancho"> & { x: number; baranda: number; ancho: number; alt: number; rot?: number }> = ({ x, baranda, ancho, alt, rot = 0, ...p }) => {
  const k = ancho / 600;
  return (
    <div style={{ position: "absolute", left: x, top: baranda - alt * k, transform: `rotate(${rot}deg)`, transformOrigin: `0px ${alt * k}px` }}>
      <Persona ancho={ancho} {...p} />
    </div>
  );
};

type Gente = { q: Quien; x: number; s: number };
const FILA3: Gente[] = [
  { q: "fiel5", x: -120, s: 31 },
  { q: "fiel4", x: 150, s: 32 },
  { q: "fiel6", x: 420, s: 33 },
  { q: "abuela", x: 690, s: 34 },
  { q: "fiel", x: 960, s: 35 },
  { q: "fiel5", x: 1230, s: 36 },
];
const FILA2: Gente[] = [
  { q: "fiel6", x: -290, s: 20 },
  { q: "abuela", x: 30, s: 21 },
  { q: "fiel5", x: 365, s: 22 },
  { q: "fiel4", x: 715, s: 23 },
  { q: "fiel6", x: 1050, s: 24 },
  { q: "fiel3", x: 1380, s: 25 },
];
const B1 = 1210; // respaldo delante de la primera fila
const B2 = 1000;
const B3 = 850;
const PROTA = { x: 540, ancho: 430 };
const VEC_I = { x: 175, ancho: 400 };
const VEC_D = { x: 905, ancho: 400 };

// Vista de la comunidad. `altDe(i)` = postura de cada persona (i: 0..11 atrás, 12 vecina izq., 13 vecino der.).
const Pueblo: React.FC<{
  altDe: (i: number) => number;
  rezoDe?: (i: number) => number; // 0..1 manos juntas
  altProta: number;
  prota?: Partial<PropsPersona> & { rot?: number; dx?: number };
  vecI?: Partial<PropsPersona>;
  vecD?: Partial<PropsPersona>;
  canta?: number;
}> = ({ altDe, rezoDe = () => 0, altProta, prota = {}, vecI = {}, vecD = {}, canta = 0 }) => {
  const f = useCurrentFrame();
  const boca = canta > 0 ? { apertura: (0.12 + 0.2 * osc(f, 9)) * canta } : undefined;
  const brazos = (i: number) => {
    const r = rezoDe(i);
    return { brazoIzq: mezclarBrazo(B_REPOSO, B_REZA, r), brazoDer: mezclarBrazo(B_REPOSO, B_REZA, r) };
  };
  const { rot: rotProta = 0, dx: dxProta = 0, ...restoProta } = prota;
  return (
    <>
      <ParedNave />
      <Capa k={0.9}>
        <div style={{ position: "absolute", left: 0, top: 0, filter: "brightness(0.62) saturate(0.8)" }}>
          {FILA3.map((g, i) => (
            <Fiel key={i} quien={g.q} x={g.x} baranda={B3} ancho={236} alt={altDe(i)} semilla={g.s} mirada={[0, -2]} boca={boca} {...brazos(i)} />
          ))}
        </div>
        <Respaldo y={B3} alto={B2 - B3 + 10} tono={0.62} />
      </Capa>
      <Capa k={0.95}>
        <div style={{ position: "absolute", left: 0, top: 0, filter: "brightness(0.8) saturate(0.9)" }}>
          {FILA2.map((g, i) => (
            <Fiel key={i} quien={g.q} x={g.x} baranda={B2} ancho={310} alt={altDe(6 + i)} semilla={g.s} mirada={[0, -2]} boca={boca} {...brazos(6 + i)} />
          ))}
        </div>
        <Respaldo y={B2} alto={B1 - B2 + 10} tono={0.8} />
      </Capa>
      <Fiel quien="fiel" x={VEC_I.x} baranda={B1} ancho={VEC_I.ancho} alt={altDe(12)} semilla={2} mirada={[0, -2]} boca={boca} {...brazos(12)} {...vecI} />
      <Fiel quien="fiel3" x={VEC_D.x} baranda={B1} ancho={VEC_D.ancho} alt={altDe(13)} semilla={7} mirada={[0, -2]} boca={boca} {...brazos(13)} {...vecD} />
      <Fiel quien="fiel2" x={PROTA.x + dxProta} baranda={B1} ancho={PROTA.ancho} alt={altProta} rot={rotProta} semilla={5} mirada={[0, -2]} boca={boca} {...restoProta} />
      <Capa k={1.06}>
        <Respaldo y={B1} alto={1300} />
      </Capa>
      <Polvo x={150} y={200} ancho={800} alto={800} n={16} semilla={9} />
    </>
  );
};

// Cabezas en primer plano (de espaldas, a contraluz) para la vista hacia el altar. `baja` = px que bajan.
const Cabezas: React.FC<{ baja?: number; inclina?: number }> = ({ baja = 0, inclina = 0 }) => {
  const f = useCurrentFrame();
  const C = [
    { x: 60, y: 1560, e: 1.15, pelo: "#2A1D16" },
    { x: 330, y: 1610, e: 1.0, pelo: "#3A3532" },
    { x: 610, y: 1590, e: 1.1, pelo: "#1E1612" },
    { x: 880, y: 1620, e: 1.0, pelo: "#4A3A2E" },
    { x: 1090, y: 1570, e: 1.12, pelo: "#2A2420" },
  ];
  return (
    <Capa k={1.25}>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: "blur(2.5px)" }} width={10} height={10}>
        {C.map((c, i) => {
          const y = c.y + baja + Math.sin(f / 40 + i * 1.7) * 3;
          return (
            <g key={i} transform={`translate(${c.x} ${y}) scale(${c.e})`}>
              <path d="M -190 420 Q -190 170 -70 140 L 70 140 Q 190 170 190 420 Z" fill="#141B30" />
              <g transform={`rotate(${inclina * (i % 2 ? 1 : 0.7)} 0 130)`}>
                <rect x={-34} y={90} width={68} height={70} fill="#2A2018" />
                <ellipse cx={0} cy={30} rx={92} ry={104} fill={c.pelo} />
                <path d="M -80 -10 Q 0 -110 80 -10" stroke="rgba(255,214,150,0.35)" strokeWidth={7} fill="none" strokeLinecap="round" />
              </g>
              <path d="M -180 250 Q -150 160 -70 146" stroke="rgba(255,214,150,0.22)" strokeWidth={6} fill="none" />
            </g>
          );
        })}
      </svg>
    </Capa>
  );
};

const ALTAR = { x: 540, y: 1085, w: 540, h: 325 };
const AMBON = { x: 190, y: 1120 };
const CURA_ALTAR = { x: 540, suelo: 1400, ancho: 360 };
const CURA_AMBON = { x: 196, suelo: 1404, ancho: 360 };

// Presbiterio: ábside con vitral, cruz, altar con velas y ambón. `luz` 0..1 refuerza la luz sobre el altar.
const Presbiterio: React.FC<{ luz?: number; children?: React.ReactNode; enAltar?: React.ReactNode; libro?: number }> = ({ luz = 0, children, enAltar, libro = 0 }) => {
  const f = useCurrentFrame();
  const llama = 0.85 + 0.15 * Math.sin(f / 4) * Math.sin(f / 9);
  return (
    <>
      <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 3000, background: "linear-gradient(180deg,#131E3A 0%,#24365E 50%,#3A4A70 100%)" }} />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        {/* ábside */}
        <path d="M 150 1360 L 150 520 Q 540 60 930 520 L 930 1360 Z" fill="#2B3D66" stroke="#55688F" strokeWidth={34} />
        <path d="M 190 1360 L 190 540 Q 540 130 890 540" fill="none" stroke="#7286AE" strokeWidth={5} opacity={0.6} />
        {/* columnas laterales */}
        {[-120, 1010].map((x) => (
          <g key={x}>
            <rect x={x} y={-200} width={190} height={1600} fill="#3A4C74" />
            <rect x={x + 20} y={-200} width={14} height={1600} fill="#55688F" opacity={0.6} />
            <rect x={x - 16} y={520} width={222} height={30} rx={8} fill="#55688F" />
          </g>
        ))}
        {/* vitral */}
        <path d="M 430 760 L 430 440 Q 540 290 650 440 L 650 760 Z" fill="#2A1E14" />
        {Array.from({ length: 5 }, (_, r) =>
          Array.from({ length: 3 }, (_, c) => <rect key={`${r}-${c}`} x={446 + c * 66} y={452 + r * 60} width={56} height={50} fill={["#C8922E", "#8E3B2E", "#2F5D8A", "#D9B25A", "#4F7A4A"][(r * 3 + c) % 5]} opacity={0.9} />),
        )}
        <path d="M 448 440 Q 540 320 632 440 Z" fill="#F2C14E" opacity={0.9} />
        {/* cruz */}
        <path d="M 540 800 L 540 980 M 480 852 L 600 852" stroke="#D9B25A" strokeWidth={16} strokeLinecap="round" />
      </svg>
      <RayosDeLuz x={540} y={420} largo={1200} angulo={90} apertura={36 + 12 * luz} n={5} color="#FFE2A8" fuerza={0.3 + 0.35 * luz} />
      {/* gradas y piso */}
      <div style={{ position: "absolute", left: -900, top: 1350, width: 2900, height: 60, background: "linear-gradient(180deg,#B9A88A,#9A8A6E)" }} />
      <div style={{ position: "absolute", left: -900, top: 1410, width: 2900, height: 60, background: "linear-gradient(180deg,#A39274,#857660)" }} />
      <div style={{ position: "absolute", left: -900, top: 1470, width: 2900, height: 1300, background: "linear-gradient(180deg,#6A5038,#3E2C1E)" }} />
      <div style={{ position: "absolute", left: 300, top: 1350, width: 480, height: 120, background: "linear-gradient(180deg,#8E2F33,#6E2226)", opacity: 0.9 }} />
      {/* quien está detrás del altar o del ambón */}
      {children}
      {/* altar */}
      <div style={{ position: "absolute", left: ALTAR.x - ALTAR.w / 2, top: ALTAR.y, width: ALTAR.w, height: ALTAR.h, background: "linear-gradient(180deg,#E9E2D2,#CFC6B2)", borderRadius: 6, boxShadow: "0 18px 30px rgba(0,0,0,0.35)" }} />
      <div style={{ position: "absolute", left: ALTAR.x - ALTAR.w / 2 - 14, top: ALTAR.y - 6, width: ALTAR.w + 28, height: 44, background: "linear-gradient(180deg,#FFFFFF,#EDE7DA)", borderRadius: 6, boxShadow: "0 6px 8px rgba(0,0,0,0.2)" }} />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        <path d={`M ${ALTAR.x} ${ALTAR.y + 90} L ${ALTAR.x} ${ALTAR.y + 190} M ${ALTAR.x - 36} ${ALTAR.y + 124} L ${ALTAR.x + 36} ${ALTAR.y + 124}`} stroke="#D9B25A" strokeWidth={10} strokeLinecap="round" />
        {[ALTAR.x - ALTAR.w / 2 + 36, ALTAR.x + ALTAR.w / 2 - 36].map((x) => (
          <g key={x}>
            <rect x={x - 14} y={ALTAR.y - 30} width={28} height={26} rx={4} fill="#D9B25A" stroke="#7A5A22" strokeWidth={2.5} />
            <rect x={x - 9} y={ALTAR.y - 130} width={18} height={102} fill="#F7F3EA" stroke="#CFC6B2" strokeWidth={2} />
            <path d={`M ${x - 7} ${ALTAR.y - 132} Q ${x + Math.sin(f / 3 + x) * 2} ${ALTAR.y - 168 - llama * 8} ${x + 7} ${ALTAR.y - 132} Z`} fill="#FFC870" />
          </g>
        ))}
      </svg>
      {[ALTAR.x - ALTAR.w / 2 + 36, ALTAR.x + ALTAR.w / 2 - 36].map((x) => (
        <div key={x} style={{ position: "absolute", left: x - 80, top: ALTAR.y - 230, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,200,112,0.5) 0%, rgba(255,200,112,0) 70%)", opacity: llama, mixBlendMode: "screen" }} />
      ))}
      {enAltar}
      {/* ambón con paño y libro */}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        <path d={`M ${AMBON.x - 100} ${AMBON.y} L ${AMBON.x + 100} ${AMBON.y} L ${AMBON.x + 84} 1420 L ${AMBON.x - 84} 1420 Z`} fill={MADERA} stroke="#3E2412" strokeWidth={5} />
        <path d={`M ${AMBON.x - 46} ${AMBON.y + 4} L ${AMBON.x + 46} ${AMBON.y + 4} L ${AMBON.x + 46} 1330 L ${AMBON.x} 1362 L ${AMBON.x - 46} 1330 Z`} fill="#4F7A4A" stroke="#33522F" strokeWidth={3} />
        <path d={`M ${AMBON.x} ${AMBON.y + 80} L ${AMBON.x} ${AMBON.y + 150} M ${AMBON.x - 22} ${AMBON.y + 104} L ${AMBON.x + 22} ${AMBON.y + 104}`} stroke="#D9B25A" strokeWidth={7} strokeLinecap="round" />
        <path d={`M ${AMBON.x - 116} ${AMBON.y - 4} L ${AMBON.x + 116} ${AMBON.y - 4} L ${AMBON.x + 108} ${AMBON.y + 18} L ${AMBON.x - 108} ${AMBON.y + 18} Z`} fill="#9A6A3A" stroke="#3E2412" strokeWidth={4} />
        {/* libro abierto */}
        <path d={`M ${AMBON.x - 84} ${AMBON.y - 12} Q ${AMBON.x - 42} ${AMBON.y - 34} ${AMBON.x} ${AMBON.y - 14} Q ${AMBON.x + 42} ${AMBON.y - 34} ${AMBON.x + 84} ${AMBON.y - 12} L ${AMBON.x + 84} ${AMBON.y - 2} L ${AMBON.x - 84} ${AMBON.y - 2} Z`} fill="#FBF6E8" stroke="#8E2F33" strokeWidth={5} />
      </svg>
      {libro > 0 ? <div style={{ position: "absolute", left: AMBON.x - 260, top: AMBON.y - 280, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,226,160,0.85) 0%, rgba(255,226,160,0.25) 40%, rgba(255,226,160,0) 70%)", opacity: libro, mixBlendMode: "screen" }} /> : null}
    </>
  );
};

// Hostia y cáliz.
const Hostia: React.FC<{ x: number; y: number; r?: number; brillo?: number }> = ({ x, y, r = 30, brillo = 0 }) => (
  <>
    {brillo > 0 ? <div style={{ position: "absolute", left: x - 170, top: y - 170, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,244,214,0.75) 0%, rgba(255,244,214,0) 68%)", opacity: brillo, mixBlendMode: "screen" }} /> : null}
    <svg style={{ position: "absolute", left: x - r, top: y - r, overflow: "visible" }} width={r * 2} height={r * 2}>
      <circle cx={r} cy={r} r={r} fill="#FDFBF4" stroke="#D8CFBA" strokeWidth={2.5} />
      <path d={`M ${r} ${r * 0.45} L ${r} ${r * 1.55} M ${r * 0.5} ${r * 0.9} L ${r * 1.5} ${r * 0.9}`} stroke="#D8CFBA" strokeWidth={3} />
    </svg>
  </>
);
const Caliz: React.FC<{ x: number; y: number; e?: number; brillo?: number }> = ({ x, y, e = 1, brillo = 0 }) => (
  <>
    {brillo > 0 ? <div style={{ position: "absolute", left: x - 180, top: y - 230, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,236,180,0.7) 0%, rgba(255,236,180,0) 68%)", opacity: brillo, mixBlendMode: "screen" }} /> : null}
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={10} height={10}>
      <g transform={`scale(${e})`}>
        <path d="M -34 -104 L 34 -104 Q 34 -52 0 -48 Q -34 -52 -34 -104 Z" fill="#E3B04B" stroke="#8A6420" strokeWidth={3} />
        <ellipse cx={0} cy={-104} rx={34} ry={7} fill="#7A2030" stroke="#8A6420" strokeWidth={2.5} />
        <rect x={-6} y={-50} width={12} height={34} fill="#C9973F" stroke="#8A6420" strokeWidth={2.5} />
        <ellipse cx={0} cy={-34} rx={12} ry={7} fill="#E3B04B" stroke="#8A6420" strokeWidth={2.5} />
        <path d="M -30 0 Q -26 -18 0 -18 Q 26 -18 30 0 Z" fill="#E3B04B" stroke="#8A6420" strokeWidth={3} />
        <path d="M -22 -96 Q -20 -64 -6 -56" stroke="#FFF0C0" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.8} />
      </g>
    </svg>
  </>
);

// Rótulo de cada postura: "De pie: respeto y atención".
const Cartel: React.FC<{ fuerte: string; texto: string; aparece: number; hasta: number; y?: number }> = ({ fuerte, texto, aparece, hasta, y = 300 }) => {
  const f = useCurrentFrame();
  const o = lerp(f, aparece, aparece + 9, 0, 1) * (1 - lerp(f, hasta, hasta + 9, 0, 1));
  if (o <= 0) return null;
  const sube = lerp(f, aparece, aparece + 14, 26, 0, Easing.out(Easing.cubic));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y + sube, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ padding: "22px 40px 24px", borderRadius: 26, background: "rgba(11,20,38,0.9)", border: `4px solid ${PAL.dorado}`, boxShadow: "0 14px 36px rgba(0,0,0,0.5)", textAlign: "center", maxWidth: 940 }}>
        <div style={{ fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 98, lineHeight: 1, color: PAL.dorado, textTransform: "uppercase", letterSpacing: 1 }}>{fuerte}</div>
        <div style={{ fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 58, lineHeight: 1.15, color: "#F7F1E3", marginTop: 12 }}>{texto}</div>
      </div>
    </div>
  );
};

// Paneo rápido entre dos vistas (t 0..1) y fundido.
const Paneo: React.FC<{ t: number; a: React.ReactNode; b: React.ReactNode }> = ({ t, a, b }) => {
  const desenfoque = Math.sin(Math.PI * cl(t)) * 16;
  return (
    <AbsoluteFill style={{ background: "#131E3A" }}>
      {t < 1 ? <AbsoluteFill style={{ transform: `translateX(${-t * 1180}px)`, filter: desenfoque > 0.3 ? `blur(${desenfoque}px)` : undefined }}>{a}</AbsoluteFill> : null}
      {t > 0 ? <AbsoluteFill style={{ transform: `translateX(${(1 - t) * 1180}px)`, filter: desenfoque > 0.3 ? `blur(${desenfoque}px)` : undefined }}>{b}</AbsoluteFill> : null}
    </AbsoluteFill>
  );
};
const Fundido: React.FC<{ t: number; a: React.ReactNode; b: React.ReactNode; destello?: boolean }> = ({ t, a, b, destello = false }) => (
  <AbsoluteFill>
    {t < 1 ? <AbsoluteFill>{a}</AbsoluteFill> : null}
    {t > 0 ? <AbsoluteFill style={{ opacity: cl(t) }}>{b}</AbsoluteFill> : null}
    {destello && t > 0 && t < 1 ? <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,236,190,0.95), rgba(255,226,160,0.5) 60%, rgba(255,226,160,0.2))", opacity: Math.sin(Math.PI * t) * 0.8 }} /> : null}
  </AbsoluteFill>
);

// ---------- escenas bíblicas e históricas ----------
// Jesús enseñando a sus discípulos (ilustración).
const Ensenanza: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Camara tomas={[{ f: 0, x: 500, y: 1130, z: 1.36 }, { f: 400, x: 570, y: 1140, z: 1.48 }]}>
        <CieloV2 hora="dia" horizonte={1010} />
        <Capa k={0.3}>
          <Montes y={1010} color="#8FA3B8" amp={90} paso={300} semilla={3} />
        </Capa>
        <Capa k={0.55}>
          <Montes y={1040} color="#7E9070" bruma="#DDE7D0" amp={60} paso={240} semilla={8} />
          <Arbol x={930} y={1070} e={0.7} tipo="cipres" semilla={2} />
        </Capa>
        <Bruma y={1040} alto={160} fuerza={0.35} />
        <Suelo y={1060} c1="#A9A46A" c2="#7C7848" semilla={5} />
        <Capa k={0.85}>
          <Arbol x={110} y={1210} e={1.35} tipo="olivo" semilla={4} />
        </Capa>
        <Pasto x={-200} y={1150} ancho={1500} n={46} semilla={3} />
        <EnSuelo quien="oyente2" x={690} suelo={1390} ancho={270} giro={-0.6} mirada={[-8, -4]} semilla={12} />
        <EnSuelo quien="oyente1" x={930} suelo={1410} ancho={280} giro={-0.6} mirada={[-9, -4]} cabeza={-2} semilla={13} />
        <Fig quien="jesus" edad={1} x={330} suelo={1440} ancho={350} giro={0.5} mirada={[8, 1]} boca={{ curva: 6 }} bocaAuto={0.3 * osc(f, 9)} brazoDer={gestoEnsenar(f)} brazoIzq={{ hombro: 10, codo: -60 }} semilla={1} />
        <EnSuelo quien="oyente3" x={800} suelo={1530} ancho={300} giro={-0.6} mirada={[-9, -5]} semilla={14} />
        <Capa k={1.25}>
          <div style={{ position: "absolute", left: 0, top: 0, filter: "blur(3px)" }}>
            <Pasto x={-300} y={1640} ancho={1700} n={40} h={90} alto={70} color="#4E6238" color2="#6F8448" semilla={7} />
          </div>
        </Capa>
        <Gradacion color="#FFE2B0" fuerza={0.14} modo="soft-light" />
      </Camara>
    </AbsoluteFill>
  );
};

const ORANTE: Brazo = { hombro: 10, codo: 135, mano: "abierta" };
// Primeros cristianos rezando de pie al amanecer. `sol` 0..1.
const Primeros: React.FC<{ sol: number }> = ({ sol }) => {
  const f = useCurrentFrame();
  const G: { q: Quien; x: number; s: number; a: number; d: number }[] = [
    { q: "oyente3", x: 235, s: 1395, a: 270, d: 0 },
    { q: "vecina", x: 850, s: 1400, a: 265, d: 5 },
    { q: "maestro2", x: 390, s: 1450, a: 310, d: 9 },
    { q: "oyente1", x: 705, s: 1455, a: 305, d: 3 },
    { q: "criado", x: 545, s: 1510, a: 330, d: 7 },
  ];
  return (
    <AbsoluteFill>
      <Camara tomas={[{ f: 0, x: 520, y: 1130, z: 1.38 }, { f: 400, x: 560, y: 1120, z: 1.48 }]}>
        <CieloV2 hora="alba" horizonte={1010} />
        <Capa k={0.2}>
          <Astro x={560} y={1030 - 230 * sol} r={84} />
        </Capa>
        <Capa k={0.35}>
          <Montes y={1010} color="#6E6A8A" amp={80} paso={320} semilla={5} />
        </Capa>
        <Capa k={0.6}>
          <Montes y={1040} color="#5A5670" bruma="#F6D9B8" amp={50} paso={260} semilla={9} />
          <CasaAdobe x={90} suelo={1080} w={300} h={250} />
          <Arbol x={980} y={1080} e={0.8} tipo="cipres" semilla={3} tono={0.5} />
          <Arbol x={880} y={1085} e={0.6} tipo="cipres" semilla={5} tono={0.5} />
        </Capa>
        <Bruma y={1050} alto={200} color="#FFE2C0" fuerza={0.3 + 0.3 * sol} />
        <Suelo y={1070} c1="#8E7A66" c2="#5E4E44" semilla={2} />
        <RayosDeLuz x={560} y={1030 - 230 * sol} largo={1500} angulo={90} apertura={150} n={9} color="#FFE2B0" fuerza={0.25 * sol} />
        {G.map((g, i) => {
          const sube = lerp(f, 8 + g.d, 30 + g.d, 0, 1);
          return (
            <Fig
              key={i}
              quien={g.q}
              x={g.x}
              suelo={g.s}
              ancho={g.a}
              mirada={[0, -5]}
              cabeza={-2}
              ojos={i % 2 ? 1 : 0.2}
              boca={{ curva: 5, apertura: 0.08 + 0.12 * osc(f, 11, i * 0.2) }}
              brazoIzq={mezclarBrazo(B_REPOSO, ORANTE, sube)}
              brazoDer={mezclarBrazo(B_REPOSO, ORANTE, sube)}
              semilla={40 + i}
            />
          );
        })}
        <Gradacion color="#3A3460" fuerza={0.28 * (1 - sol)} />
        <Gradacion color="#FFD9A0" fuerza={0.22 * sol} modo="soft-light" />
      </Camara>
    </AbsoluteFill>
  );
};

// Pergamino que se desenrolla: "Nicea · Año 325".
const Pergamino: React.FC<{ aparece: number }> = ({ aparece }) => {
  const f = useCurrentFrame();
  const abre = lerp(f, aparece, aparece + 18, 0, 1, Easing.out(Easing.cubic));
  if (f < aparece) return null;
  const w = 80 + 700 * abre;
  return (
    <div style={{ position: "absolute", left: 540 - w / 2, top: 300, width: w, height: 250, opacity: lerp(f, aparece, aparece + 5, 0, 1) }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 14, bottom: 14, background: "linear-gradient(180deg,#F1E2BC,#E2CD9C)", boxShadow: "0 16px 30px rgba(0,0,0,0.45)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: 30, width: 700, marginLeft: -350, textAlign: "center", opacity: lerp(f, aparece + 8, aparece + 20, 0, 1) }}>
          <div style={{ fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: 72, color: PAL.tinta, lineHeight: 1, whiteSpace: "nowrap" }}>Nicea · Año 325</div>
          <div style={{ fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 34, color: "#6E5232", marginTop: 20, letterSpacing: 1 }}>Concilio · canon 20</div>
        </div>
      </div>
      {[0, 1].map((i) => (
        <div key={i} style={{ position: "absolute", [i ? "right" : "left"]: 0, top: 0, width: 60, height: 250, borderRadius: 30, background: "linear-gradient(90deg,#B99A62,#F1E2BC 45%,#C8AE7D)", boxShadow: "0 10px 20px rgba(0,0,0,0.4)" } as React.CSSProperties} />
      ))}
    </div>
  );
};

// María de Betania sentada a los pies de Jesús, escuchándolo (Lucas 10:39).
const Betania: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Camara tomas={[{ f: 0, x: 530, y: 1150, z: 1.3 }, { f: 300, x: 580, y: 1170, z: 1.44 }]}>
        <Interior />
        {/* banco de piedra donde se sienta Jesús */}
        <div style={{ position: "absolute", left: 150, top: 1215, width: 400, height: 180, borderRadius: 16, background: "linear-gradient(180deg,#B9A88A,#8E7E64)", boxShadow: "0 16px 26px rgba(0,0,0,0.35)" }} />
        <div style={{ position: "absolute", left: 150, top: 1215, width: 400, height: 26, borderRadius: 13, background: "#D2C3A4" }} />
        <EnBanco quien="jesus" edad={1} x={350} asiento={1228} suelo={1410} ancho={370} giro={0.55} mirada={[7, 6]} cabeza={4} boca={{ curva: 7 }} bocaAuto={0.28 * osc(f, 9)} brazoDer={gestoEnsenar(f)} brazoIzq={{ hombro: 8, codo: -50 }} semilla={1} />
        <EnSuelo quien="betania" x={770} suelo={1580} ancho={340} giro={-0.6} mirada={[-8, -7]} cabeza={-5 + 1.5 * Math.sin(f / 26)} boca={{ curva: 9 }} brazoIzq={{ hombro: 6, codo: -70, mano: "abierta" }} brazoDer={{ hombro: 6, codo: -74, mano: "abierta" }} semilla={8} />
      </Camara>
    </AbsoluteFill>
  );
};

// Mano del monaguillo con la campanilla. (x, y) = puño; `giro` en grados.
const Campanilla: React.FC<{ x: number; y: number; giro: number }> = ({ x, y, giro }) => (
  <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={10} height={10}>
    {/* manga (alba blanca sobre sotana roja) que entra desde la derecha */}
    <path d="M 420 150 L 60 34 Q 40 4 62 -26 L 430 -10 Z" fill="#F4F0E6" stroke="#CFC6B2" strokeWidth={4} />
    <path d="M 96 44 Q 74 8 92 -24 L 62 -26 Q 40 4 60 34 Z" fill="#A3242A" stroke="#6E161B" strokeWidth={3} />
    <path d="M 150 60 Q 220 60 300 96" stroke="#D9D2C2" strokeWidth={5} fill="none" strokeLinecap="round" />
    {/* campanilla que cuelga del puño */}
    <g transform={`rotate(${giro} 10 4)`}>
      <rect x={2} y={10} width={16} height={56} rx={8} fill="#7A4E2A" stroke="#3E2412" strokeWidth={3} />
      <path d="M -40 150 Q -42 76 10 64 Q 62 76 60 150 Q 72 162 76 172 L -56 172 Q -52 162 -40 150 Z" fill="#E3B04B" stroke="#8A6420" strokeWidth={4} />
      <path d="M -22 146 Q -22 92 0 80" stroke="#FFF0C0" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.85} />
      <ellipse cx={10} cy={172} rx={66} ry={9} fill="#C9973F" stroke="#8A6420" strokeWidth={3} />
      <circle cx={10 - giro * 0.5} cy={186} r={11} fill="#8A6420" />
    </g>
    {/* puño */}
    <path d="M 62 -26 Q 40 -40 14 -34 Q -16 -30 -18 0 Q -18 30 12 36 Q 40 40 60 34 Z" fill="#C99470" stroke="#8E5E40" strokeWidth={3.5} />
    <path d="M -8 -12 Q 6 -8 4 6 M -10 6 Q 6 10 4 22" stroke="#8E5E40" strokeWidth={3} fill="none" strokeLinecap="round" />
  </svg>
);

// ---------- 1. SIEMPRE UN MOVIMIENTO ATRÁS ----------
const Apertura: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fEsp = useMomento("acomodás", 0.2);
  const fTodos = useMomento("todos", 0.42);
  const fLev = useMomento("levantan", 0.5);
  const fOtra = useMomento("otra", 0.62);
  const fPor = useMomento("cambiamos", 0.78);
  // el protagonista llega, se sienta, se acomoda y se relaja
  const sienta = tramos(f, [3, 15, 21], [PIE_, SENT - 14, SENT]);
  const acomoda = f > fEsp && f < fEsp + 30 ? Math.sin(((f - fEsp) / 30) * Math.PI * 3) * (1 - (f - fEsp) / 30) : 0;
  const relaja = lerp(f, fEsp + 22, fEsp + 40, 0, 1) * (1 - lerp(f, fLev + 4, fLev + 9, 0, 1));
  const sube = lerp(f, fOtra + 8, fOtra + 26, 0, 1, Easing.out(Easing.back(1.4)));
  const altProta = f < fOtra + 8 ? sienta - 16 * relaja + 8 * Math.abs(acomoda) : SENT + (PIE_ - SENT) * sube;
  const sorpresa = cl(lerp(f, fLev + 4, fLev + 9, 0, 1)) * (1 - lerp(f, fOtra + 2, fOtra + 12, 0, 1));
  const mirarX = f < fLev + 8 ? 0 : f < fLev + 21 ? lerp(f, fLev + 8, fLev + 13, 0, -11) : f < fOtra ? lerp(f, fLev + 21, fLev + 27, -11, 11) : lerp(f, fOtra, fOtra + 6, 11, 0);
  const resignado = cl(lerp(f, fOtra, fOtra + 8, 0, 1)) * (1 - lerp(f, fOtra + 24, fOtra + 34, 0, 1));
  const duda = lerp(f, fPor - 4, fPor + 8, 0, 1);
  // la comunidad se levanta junta (con un desfase mínimo entre personas)
  const altDe = (i: number) => lerp(f, fTodos + 2 + (i % 4) * 1.5, fTodos + 18 + (i % 4) * 1.5, SENT, PIE_, Easing.out(Easing.back(1.2)));
  const vecinaMira = cl(lerp(f, fOtra + 4, fOtra + 12, 0, 1)) * (1 - lerp(f, fPor - 6, fPor + 2, 0, 1));
  return (
    <AbsoluteFill>
      <Camara
        tomas={[
          vista(0, 1.62),
          vista(fEsp + 34, 1.74),
          vista(fTodos, 1.74),
          vista(fTodos + 16, 1.3),
          vista(fOtra, 1.32),
          vista(fOtra + 26, 1.5),
          vista(duracion, 1.42),
        ]}
      >
        <Pueblo
          altDe={altDe}
          altProta={altProta}
          vecI={{ mirada: [9 * vecinaMira, -2 + 2 * vecinaMira], giro: 0.35 * vecinaMira, boca: { curva: 4 + 6 * vecinaMira } }}
          prota={{
            dx: acomoda * 7,
            rot: acomoda * 1.6,
            cabeza: -5 * relaja + 3 * resignado,
            ojos: 1 - relaja,
            mirada: [mirarX, -2 + 3 * resignado],
            giro: mirarX / 22,
            cejas: { y: -9 * sorpresa + 2 * resignado, rot: 5 * resignado },
            cejaUna: 6 * duda,
            boca: { curva: 4 + 8 * relaja - 9 * sorpresa - 7 * resignado + 3 * duda, apertura: 0.28 * sorpresa + 0.12 * resignado * osc(f, 16) },
            brazoIzq: B_REPOSO,
            brazoDer: mezclarBrazo(B_REPOSO, { hombro: 22, codo: 84, mano: "abierta" }, duda),
          }}
        />
      </Camara>
      {/* título del gancho */}
      {f > fPor - 8 ? (
        <div style={{ position: "absolute", left: 40, right: 40, top: 215, textAlign: "center", opacity: lerp(f, fPor - 8, fPor + 2, 0, 1), transform: `translateY(${lerp(f, fPor - 8, fPor + 6, 30, 0, Easing.out(Easing.cubic))}px)` }}>
          <div style={{ fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 78, lineHeight: 1.06, color: "#F7F1E3", textTransform: "uppercase", textShadow: "0 8px 26px rgba(0,0,0,0.75), 0 2px 0 rgba(0,0,0,0.5)" }}>
            ¿Por qué cambiamos<br />tanto de <span style={{ color: PAL.dorado }}>postura</span>?
          </div>
        </div>
      ) : null}
      <Textura />
      <Sfx archivo="tela" en={3} volumen={0.3} />
      <Sfx archivo="banco" en={14} volumen={0.3} />
      <Sfx archivo="tela" en={fEsp} volumen={0.22} />
      <Sfx archivo="banco" en={fEsp + 10} volumen={0.16} />
      <Sfx archivo="tela" en={fTodos + 2} volumen={0.4} />
      <Sfx archivo="banco" en={fTodos + 5} volumen={0.3} />
      <Sfx archivo="paso" en={fTodos + 12} volumen={0.25} />
      <Sfx archivo="tela" en={fOtra + 8} volumen={0.3} />
      <Sfx archivo="banco" en={fOtra + 12} volumen={0.2} />
      <Sfx archivo="whoosh" en={fPor - 10} volumen={0.14} />
    </AbsoluteFill>
  );
};

// ---------- 2. REZAMOS CON EL CUERPO: las tres posturas seguidas ----------
const Chip: React.FC<{ x: number; texto: string; activo: number }> = ({ x, texto, activo }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: 300,
      translate: "-50% 0",
      scale: String(0.94 + 0.1 * activo),
      padding: "14px 30px",
      borderRadius: 999,
      background: activo > 0.5 ? `linear-gradient(180deg, ${PAL.dorado}, ${PAL.doradoOscuro})` : "rgba(11,20,38,0.85)",
      border: `4px solid ${PAL.dorado}`,
      color: activo > 0.5 ? "#1B1408" : "#F7F1E3",
      fontFamily: FUENTE_TEXTO,
      fontWeight: 800,
      fontSize: 50,
      whiteSpace: "nowrap",
      boxShadow: "0 10px 26px rgba(0,0,0,0.45)",
    }}
  >
    {texto}
  </div>
);

const Cuerpo: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const a = Math.round(duracion * 0.27);
  const b = Math.round(duracion * 0.6);
  const alt = tramos(f, [a, a + 16, b, b + 16], [PIE_, SENT, SENT, ROD]);
  const rezo = lerp(f, b + 4, b + 18, 0, 1);
  const etapa = f < a + 6 ? 0 : f < b + 6 ? 1 : 2;
  const entra = lerp(f, 0, 10, 0, 1);
  return (
    <AbsoluteFill>
      <Camara tomas={[vista(0, 1.4), vista(duracion, 1.52)]}>
        <Pueblo
          altDe={() => alt}
          rezoDe={() => rezo}
          altProta={alt}
          prota={{ brazoIzq: mezclarBrazo(B_REPOSO, B_REZA, rezo), brazoDer: mezclarBrazo(B_REPOSO, B_REZA, rezo), boca: { curva: 6 }, cabeza: 3 * rezo, ojos: 1 - 0.6 * rezo }}
        />
      </Camara>
      <div style={{ opacity: entra }}>
        <Chip x={150} texto="De pie" activo={etapa === 0 ? 1 : 0} />
        <Chip x={478} texto="Sentados" activo={etapa === 1 ? 1 : 0} />
        <Chip x={862} texto="De rodillas" activo={etapa === 2 ? 1 : 0} />
      </div>
      <Textura />
      <Sfx archivo="tela" en={a} volumen={0.3} />
      <Sfx archivo="banco" en={a + 10} volumen={0.22} />
      <Sfx archivo="tela" en={b} volumen={0.3} />
      <Sfx archivo="banco" en={b + 10} volumen={0.18} />
    </AbsoluteFill>
  );
};

// ---------- 3. DE PIE PARA EL EVANGELIO ----------
const DePie: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const fNos = useMomento("levantamos", 0.4);
  const fEv = useMomento("evangelio", 0.52);
  const fCristo = useMomento("cristo", 0.75);
  const altDe = (i: number) => lerp(f, 2 + (i % 4), 18 + (i % 4), ROD, PIE_, Easing.out(Easing.back(1.2)));
  const rezoDe = () => 1 - lerp(f, 2, 16, 0, 1);
  const altProta = lerp(f, 4, 21, ROD, PIE_, Easing.out(Easing.back(1.2)));
  const tPaneo = lerp(f, fNos - 2, fNos + 13, 0, 1);
  const tJesus = lerp(f, fCristo - 10, fCristo + 8, 0, 1);
  const pueblo = (
    <AbsoluteFill>
      <Camara tomas={[vista(0, 1.52), vista(30, 1.34), vista(fNos, 1.42, 560)]}>
        <Pueblo
          altDe={altDe}
          rezoDe={rezoDe}
          altProta={altProta}
          prota={{ brazoIzq: mezclarBrazo(B_REZA, B_FRENTE, lerp(f, 4, 18, 0, 1)), brazoDer: mezclarBrazo(B_REZA, B_FRENTE, lerp(f, 4, 18, 0, 1)), boca: { curva: 6 }, mirada: [lerp(f, fNos - 14, fNos - 6, 0, -6), -3], cejas: { y: -2 } }}
        />
      </Camara>
    </AbsoluteFill>
  );
  const ambon = (
    <AbsoluteFill>
      <Camara tomas={[{ f: fNos, x: 470, y: 1010, z: 1.16 }, { f: fEv + 10, x: 360, y: 1000, z: 1.42 }, { f: fCristo, x: 300, y: 990, z: 1.62 }]}>
        <Presbiterio libro={lerp(f, fEv + 20, fCristo, 0, 0.9)}>
          <Fig quien="sacerdote" x={CURA_AMBON.x} suelo={CURA_AMBON.suelo} ancho={CURA_AMBON.ancho} giro={0.2} mirada={[2, 5]} cabeza={3} boca={{ curva: 4 }} bocaAuto={0.3 * osc(f, 9)} brazoIzq={{ hombro: 16, codo: -70, mano: "abierta" }} brazoDer={{ hombro: 16, codo: -70, mano: "abierta" }} semilla={3} />
        </Presbiterio>
        <Cabezas />
      </Camara>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill>
      <Fundido destello t={tJesus} a={<Paneo t={tPaneo} a={pueblo} b={ambon} />} b={<Ensenanza />} />
      <Cartel fuerte="De pie" texto="respeto y atención" aparece={10} hasta={fNos - 12} />
      <Textura />
      <Sfx archivo="tela" en={3} volumen={0.4} />
      <Sfx archivo="banco" en={6} volumen={0.3} />
      <Sfx archivo="paso" en={14} volumen={0.22} />
      <Sfx archivo="whoosh" en={fNos - 4} volumen={0.22} />
      <Sfx archivo="pagina" en={fEv - 6} volumen={0.25} />
      <Sfx archivo="brillo" en={fCristo - 10} volumen={0.16} />
    </AbsoluteFill>
  );
};

// ---------- 4. UNA POSTURA CON HISTORIA ----------
const Nicea: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const fResu = useMomento("resurrección", 0.22);
  const fAno = useMomento("año", 0.4);
  const t = lerp(f, 4, 22, 0, 1);
  const sol = lerp(f, 14, fResu + 34, 0, 1, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Fundido t={t} a={<Ensenanza />} b={<Primeros sol={sol} />} />
      <Pergamino aparece={fAno - 6} />
      <Textura />
      <Sfx archivo="viento" en={6} volumen={0.1} />
      <Sfx archivo="brillo" en={fResu - 6} volumen={0.14} />
      <Sfx archivo="pagina" en={fAno - 6} volumen={0.3} />
    </AbsoluteFill>
  );
};

// ---------- 5. SENTARSE PARA ESCUCHAR ----------
const Sentados: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fComo = useMomento("como", 0.3);
  const fPor = useMomento("eso", 0.6);
  const fHom = useMomento("homilía", 0.9);
  const altDe = (i: number) => lerp(f, 6 + (i % 4), 22 + (i % 4), PIE_, SENT);
  const altProta = lerp(f, 6, 22, PIE_, SENT);
  const tBet = lerp(f, fComo - 8, fComo + 8, 0, 1);
  const tIgl = lerp(f, fPor - 12, fPor + 4, 0, 1);
  const fCambio = fHom - 22; // de la lectura a la homilía
  const homilia = lerp(f, fCambio, fCambio + 10, 0, 1);
  const pueblo = (
    <AbsoluteFill>
      <Camara tomas={[vista(0, 1.34), vista(30, 1.5), vista(fComo, 1.64)]}>
        <Pueblo altDe={altDe} altProta={altProta} prota={{ brazoIzq: B_REPOSO, brazoDer: B_REPOSO, boca: { curva: 7 }, cabeza: lerp(f, 30, 50, 0, 3), mirada: [0, -3], cejas: { y: -2 } }} />
      </Camara>
    </AbsoluteFill>
  );
  const lectura = (
    <AbsoluteFill>
      <Camara
        tomas={[
          { f: fPor - 12, x: 430, y: 1030, z: 1.2 },
          { f: fCambio - 2, x: 380, y: 1020, z: 1.34 },
          { f: fCambio + 10, x: 300, y: 985, z: 1.75 },
          { f: duracion, x: 310, y: 985, z: 1.82 },
        ]}
      >
        <Presbiterio>
          <Fig quien="fiel4" x={CURA_AMBON.x} suelo={CURA_AMBON.suelo + 4} ancho={CURA_AMBON.ancho - 16} giro={0.15} mirada={[1, 6]} cabeza={4} boca={{ curva: 4 }} bocaAuto={0.28 * osc(f, 9)} brazoIzq={{ hombro: 16, codo: -70, mano: "abierta" }} brazoDer={{ hombro: 16, codo: -70, mano: "abierta" }} semilla={23} opacidad={1 - homilia} />
          <Fig quien="sacerdote" x={CURA_AMBON.x} suelo={CURA_AMBON.suelo} ancho={CURA_AMBON.ancho} giro={0.3} mirada={[4, 2]} boca={{ curva: 6 }} bocaAuto={0.3 * osc(f, 8)} brazoIzq={{ hombro: 12, codo: -64, mano: "abierta" }} brazoDer={gestoEnsenar(f)} semilla={3} opacidad={homilia} />
        </Presbiterio>
        <Cabezas baja={70} />
      </Camara>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill>
      <Fundido t={tIgl} a={<Fundido t={tBet} a={pueblo} b={<Betania />} />} b={lectura} />
      <Cartel fuerte="Sentados" texto="escuchar y meditar" aparece={16} hasta={fComo - 16} />
      <Referencia texto="Lucas 10:39" aparece={fComo + 6} hasta={fPor - 18} />
      <Textura />
      <Sfx archivo="tela" en={6} volumen={0.4} />
      <Sfx archivo="banco" en={16} volumen={0.32} />
      <Sfx archivo="pagina" en={fPor - 4} volumen={0.25} />
      <Sfx archivo="whoosh" en={fCambio - 4} volumen={0.12} />
    </AbsoluteFill>
  );
};

// ---------- 6. ARRODILLARSE PARA ADORAR ----------

// Sacerdote detrás del altar. `hostia` y `caliz` 0..1 = elevación de cada uno.
const Consagracion: React.FC<{ hostia: number; caliz: number; luz?: number }> = ({ hostia, caliz, luz = 0 }) => {
  const alza = Math.max(hostia, caliz);
  const k = CURA_ALTAR.ancho / 600;
  const top = CURA_ALTAR.suelo - (1110 / 600) * CURA_ALTAR.ancho;
  const yBajo = ALTAR.y - 22;
  const yAlto = top + 92 * k;
  const y = yBajo + (yAlto - yBajo) * alza;
  const sep = 50 - 6 * alza;
  const hostiaAltar: [number, number] = [ALTAR.x - 62, ALTAR.y - 14];
  const calizAltar: [number, number] = [ALTAR.x + 66, ALTAR.y - 4];
  const hx = hostiaAltar[0] + (ALTAR.x - hostiaAltar[0]) * cl(hostia * 4);
  const hy = hostiaAltar[1] + (y - yBajo) - 42 * cl(hostia * 4);
  const kx = calizAltar[0] + (ALTAR.x - calizAltar[0]) * cl(caliz * 4);
  const ky = calizAltar[1] + (y - yBajo) - 16 * cl(caliz * 4);
  const c = paletaDe("sacerdote");
  const brazos = ([-1, 1] as const).map((l) => (
    <BrazoIK key={l} lado={l} k={k} hombro={[CURA_ALTAR.x + 128 * k * l, top + 412 * k]} mano={[CURA_ALTAR.x + sep * l, y]} tela={c.tunica} borde="#B9B2A2" piel={c.piel} />
  ));
  return (
    <Presbiterio
      luz={luz}
      enAltar={
        <>
          <div style={{ position: "absolute", left: ALTAR.x - 130, top: ALTAR.y - 8, width: 260, height: 10, background: "#FFFFFF", borderRadius: 4, boxShadow: "0 2px 3px rgba(0,0,0,0.2)" }} />
          <div style={{ position: "absolute", left: hostiaAltar[0] - 40, top: ALTAR.y - 14, width: 80, height: 12, borderRadius: 6, background: "linear-gradient(180deg,#F0C96A,#C9973F)", border: "2px solid #8A6420" }} />
          {hostia <= 0 ? (
            <svg style={{ position: "absolute", left: hostiaAltar[0] - 30, top: ALTAR.y - 24, overflow: "visible" }} width={60} height={14}>
              <ellipse cx={30} cy={7} rx={30} ry={7} fill="#FDFBF4" stroke="#D8CFBA" strokeWidth={2} />
            </svg>
          ) : null}
          {caliz <= 0 ? <Caliz x={calizAltar[0]} y={calizAltar[1]} e={0.92} /> : null}
          {hostia > 0 ? <Hostia x={hx} y={hy} brillo={0.75 * hostia} /> : null}
          {caliz > 0 ? <Caliz x={kx} y={ky} brillo={0.7 * caliz} /> : null}
        </>
      }
    >
      <Fig quien="sacerdote" sinBrazos x={CURA_ALTAR.x} suelo={CURA_ALTAR.suelo} ancho={CURA_ALTAR.ancho} mirada={[0, 5 - 12 * alza]} cabeza={0} boca={{ curva: 3 }} semilla={3} />
      {brazos}
    </Presbiterio>
  );
};

const Rodillas: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fAdor = useMomento("adoración", 0.2);
  const fDur = useMomento("durante", 0.3);
  const fAdoramos = useMomento("adoramos", 0.46);
  const fBajo = useMomento("bajo", 0.72);
  const fPan = useMomento("pan", 0.84);
  // baja el reclinatorio (se inclina) y se arrodilla con todos
  const inclina = Math.sin(cl(lerp(f, 0, 16, 0, 1, Easing.linear)) * Math.PI);
  const altDe = (i: number) => lerp(f, 16 + (i % 4), 34 + (i % 4), SENT, ROD);
  const rezoDe = (i: number) => lerp(f, 20 + (i % 4), 36 + (i % 4), 0, 1);
  const altProta = f < 16 ? SENT - 26 * inclina : lerp(f, 16, 34, SENT, ROD);
  const rezoP = lerp(f, 20, 36, 0, 1);
  const tPaneo = lerp(f, fDur + 2, fDur + 17, 0, 1);
  const hostia = lerp(f, fAdoramos - 14, fAdoramos + 4, 0, 1) * (1 - lerp(f, fBajo - 2, fBajo + 14, 0, 1));
  const caliz = lerp(f, fPan + 6, fPan + 22, 0, 1);
  const pueblo = (
    <AbsoluteFill>
      <Camara tomas={[vista(0, 1.62), vista(40, 1.42), vista(fDur, 1.54)]}>
        <Pueblo
          altDe={altDe}
          rezoDe={rezoDe}
          altProta={altProta}
          prota={{
            rot: 5 * inclina,
            cabeza: 8 * inclina + 4 * rezoP - 5 * lerp(f, fDur - 12, fDur - 2, 0, 1),
            mirada: [0, 8 * inclina - 2 - 5 * lerp(f, fDur - 12, fDur - 2, 0, 1)],
            ojos: 1 - 0.5 * rezoP + 0.5 * lerp(f, fDur - 12, fDur - 2, 0, 1),
            boca: { curva: 5 },
            brazoIzq: mezclarBrazo(B_REPOSO, B_REZA, rezoP),
            brazoDer: mezclarBrazo(B_REPOSO, B_REZA, rezoP),
          }}
        />
      </Camara>
    </AbsoluteFill>
  );
  const altar = (
    <AbsoluteFill>
      <Camara
        tomas={[
          { f: fDur, x: 540, y: 1020, z: 1.14 },
          { f: fAdoramos, x: 540, y: 960, z: 1.34 },
          { f: fBajo, x: 540, y: 950, z: 1.42 },
          { f: fPan, x: 540, y: 980, z: 1.34 },
          { f: duracion, x: 540, y: 950, z: 1.44 },
        ]}
      >
        <Consagracion hostia={hostia} caliz={caliz} luz={Math.max(hostia, caliz)} />
        <Cabezas baja={40} inclina={5} />
      </Camara>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill>
      <Paneo t={tPaneo} a={pueblo} b={altar} />
      <Cartel fuerte="De rodillas" texto="adoración" aparece={fAdor - 16} hasta={fDur - 8} />
      <Textura />
      <Sfx archivo="madera" en={9} volumen={0.22} />
      <Sfx archivo="tela" en={16} volumen={0.4} />
      <Sfx archivo="banco" en={26} volumen={0.3} />
      <Sfx archivo="whoosh" en={fDur} volumen={0.2} />
      <Sfx archivo="coro" en={fAdoramos - 14} volumen={0.1} />
      <Sfx archivo="tela" en={fPan + 6} volumen={0.16} />
    </AbsoluteFill>
  );
};

// ---------- 7. LA CAMPANILLA ----------
const EscenaCampanilla: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fDirigir = useMomento("dirigir", 0.55);
  const fAltar = useMomento("altar", 0.85);
  const t1 = 5;
  const t2 = 44;
  const sacude = (t0: number) => (f >= t0 && f < t0 + 30 ? Math.sin(((f - t0) / 30) * Math.PI * 5) * 26 * (1 - (f - t0) / 30) : 0);
  const giro = sacude(t1) + sacude(t2);
  const caliz = 1 - lerp(f, fDirigir - 14, fDirigir + 4, 0, 1);
  const ondas = [t1, t1 + 8, t2, t2 + 8];
  return (
    <AbsoluteFill>
      <Camara
        tomas={[
          { f: 0, x: 790, y: 1200, z: 1.75 },
          { f: t2 + 14, x: 770, y: 1180, z: 1.62 },
          { f: fDirigir + 6, x: 540, y: 990, z: 1.3 },
          { f: fAltar, x: 540, y: 970, z: 1.4 },
          { f: duracion, x: 540, y: 960, z: 1.46 },
        ]}
      >
        <Consagracion hostia={0} caliz={caliz} luz={0.6 + 0.4 * lerp(f, fDirigir, fAltar + 10, 0, 1)} />
        {/* ondas del sonido */}
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          {ondas.map((t0, i) => {
            const p = (f - t0) / 26;
            return p > 0 && p < 1 ? <circle key={i} cx={870} cy={1400} r={40 + p * 190} fill="none" stroke={PAL.dorado} strokeWidth={7 * (1 - p)} opacity={0.75 * (1 - p)} /> : null;
          })}
        </svg>
        <Campanilla x={860} y={1230 - Math.abs(giro) * 0.3} giro={giro} />
        <Cabezas baja={60} inclina={5} />
      </Camara>
      <Textura />
      <Sfx archivo="campanilla" en={t1} volumen={0.34} />
      <Sfx archivo="campanilla" en={t2} volumen={0.3} />
      <Sfx archivo="tela" en={fDirigir - 14} volumen={0.14} />
    </AbsoluteFill>
  );
};

// ---------- 8. UNA ORACIÓN COMPARTIDA ----------
const Comunidad: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fComp = useMomento("compartidos", 0.2);
  const fExp = useMomento("expresan", 0.5);
  const fCom = useMomento("comunidad", 0.85);
  const sube = lerp(f, fComp - 4, fComp + 14, 0, 1, Easing.out(Easing.back(1.2)));
  const alt = ROD + (PIE_ - ROD) * sube;
  const rezo = 1 - lerp(f, fComp - 4, fComp + 12, 0, 1);
  const mira = cl(lerp(f, fExp, fExp + 8, 0, 1)) * (1 - lerp(f, fCom - 6, fCom + 2, 0, 1));
  const canta = lerp(f, fCom - 10, fCom, 0, 1);
  const juntas = lerp(f, fComp + 14, fComp + 28, 0, 1);
  return (
    <AbsoluteFill>
      <Camara tomas={[vista(0, 1.2), vista(fExp, 1.3, 560), vista(fExp + 20, 1.56, 650), vista(fCom, 1.5, 630), vista(duracion, 1.3)]}>
        <Pueblo
          altDe={() => alt}
          rezoDe={() => Math.max(rezo, juntas * 0.9)}
          altProta={alt}
          canta={canta}
          vecD={{ mirada: [-9 * mira, -2 + 2 * mira], giro: -0.35 * mira, boca: { curva: 5 + 6 * mira, apertura: canta * (0.12 + 0.2 * osc(f, 9)) } }}
          prota={{
            mirada: [10 * mira, -2 + 2 * mira],
            giro: 0.4 * mira,
            cejas: { y: -3 * mira },
            boca: { curva: 6 + 6 * mira, apertura: canta * (0.12 + 0.2 * osc(f, 9)) },
            brazoIzq: mezclarBrazo(B_REPOSO, B_REZA, Math.max(rezo, juntas * 0.9)),
            brazoDer: mezclarBrazo(B_REPOSO, B_REZA, Math.max(rezo, juntas * 0.9)),
          }}
        />
      </Camara>
      <Textura />
      <Sfx archivo="tela" en={fComp - 4} volumen={0.42} />
      <Sfx archivo="banco" en={fComp} volumen={0.3} />
      <Sfx archivo="paso" en={fComp + 8} volumen={0.22} />
    </AbsoluteFill>
  );
};

// ---------- 9. CIERRE: comentar y seguir ----------
const CierrePosturas: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const altDe = (i: number) => lerp(f, 4 + (i % 4), 20 + (i % 4), PIE_, SENT);
  const nota = cl(lerp(f, 22, 27, 0, 1)) * (1 - lerp(f, 32, 40, 0, 1));
  const altProta = lerp(f, 30, 46, PIE_, SENT);
  const sonrie = lerp(f, 40, 54, 0, 1);
  const mirarX = f < 22 ? 0 : f < 30 ? lerp(f, 22, 26, 0, -10) : f < 38 ? lerp(f, 30, 34, -10, 10) : lerp(f, 38, 46, 10, 0);
  const encoge = Math.sin(cl(lerp(f, 48, 78, 0, 1, Easing.linear)) * Math.PI);
  const velo = lerp(f, 30, 48, 0, 1);
  const aparece = (d: number) => ({ opacity: lerp(f, d, d + 10, 0, 1), transform: `translateY(${lerp(f, d, d + 14, 24, 0, Easing.out(Easing.cubic))}px)` });
  return (
    <AbsoluteFill>
      <Camara tomas={[vista(0, 1.3), vista(50, 1.42), vista(duracion, 1.5)]}>
        <Pueblo
          altDe={altDe}
          altProta={altProta}
          vecI={{ mirada: [8 * sonrie, 0], giro: 0.3 * sonrie, boca: { curva: 5 + 6 * sonrie } }}
          prota={{
            mirada: [mirarX, -1],
            giro: mirarX / 24,
            rot: 0,
            cejas: { y: -8 * nota - 2 * sonrie },
            cabeza: 3 * sonrie,
            boca: { curva: 4 - 6 * nota + 12 * sonrie, apertura: 0.2 * nota + 0.12 * sonrie },
            brazoIzq: mezclarBrazo(B_REPOSO, { hombro: 20, codo: 70, mano: "abierta" }, encoge),
            brazoDer: mezclarBrazo(B_REPOSO, { hombro: 20, codo: 70, mano: "abierta" }, encoge),
          }}
        />
      </Camara>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,20,38,0.96) 0%, rgba(11,20,38,0.9) 30%, rgba(11,20,38,0) 47%)", opacity: velo }} />
      <div style={{ position: "absolute", left: 40, right: 40, top: 230, textAlign: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 92, lineHeight: 1, whiteSpace: "nowrap", color: PAL.dorado, letterSpacing: 2, textShadow: "0 8px 26px rgba(0,0,0,0.6)", ...aparece(34) }}>
        VERSÍCULO OCULTO
      </div>
      <div style={{ position: "absolute", left: 300, right: 300, top: 358, height: 5, borderRadius: 3, background: PAL.dorado, opacity: lerp(f, 42, 52, 0, 0.8), transform: `scaleX(${lerp(f, 42, 58, 0, 1)})` }} />
      <div style={{ position: "absolute", left: 50, right: 50, top: 400, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 60, lineHeight: 1.1, color: "#F7F1E3", textShadow: "0 4px 14px rgba(0,0,0,0.6)", ...aparece(46) }}>
        ¿También te levantás último?
      </div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 492, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 46, color: PAL.pergamino, textShadow: "0 4px 12px rgba(0,0,0,0.6)", ...aparece(58) }}>
        Te leemos en los comentarios
      </div>
      <Textura />
      <Sfx archivo="tela" en={4} volumen={0.4} />
      <Sfx archivo="banco" en={14} volumen={0.3} />
      <Sfx archivo="tela" en={30} volumen={0.26} />
      <Sfx archivo="banco" en={40} volumen={0.24} />
      <Sfx archivo="brillo" en={34} volumen={0.16} />
    </AbsoluteFill>
  );
};

export const ESCENAS_POSTURAS: Record<string, React.FC<{ escena: EscenaAnimada }>> = {
  "posturas/apertura": Apertura,
  "posturas/cuerpo": Cuerpo,
  "posturas/depie": DePie,
  "posturas/nicea": Nicea,
  "posturas/sentados": Sentados,
  "posturas/rodillas": Rodillas,
  "posturas/campanilla": EscenaCampanilla,
  "posturas/comunidad": Comunidad,
  "posturas/cierre": CierrePosturas,
};

export { Pueblo, PIE_ as ALT_PIE, SENT as ALT_SENTADO, ROD as ALT_RODILLAS, B_REZA, B_REPOSO };
