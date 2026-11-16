// Escenas del video "¿Por qué San Pedro pidió morir boca abajo?" (Versículo Oculto).
// Pasajes: Lucas 22:54-62 (negaciones), Juan 21:15-17 (tres preguntas). Tradición: Hechos de Pedro (Quo vadis, cruz invertida).
// Historia: Circo de Nerón, obelisco vaticano (Heliópolis → Roma hacia el 40 → trasladado en 1586), basílica de San Pedro.
// Ilustraciones originales; sobrias y respetuosas (no se muestra violencia).
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { useEscena } from "../../video/contexto";
import type { EscenaAnimada } from "../../video/tipos";
import { FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { Sfx, useMomento } from "../comun";
import type { Brazo } from "../jesus-12-30/personas";
import { Camara, lerp, LibroAntiguo, PAL, Renglones, TapaLibro, Textura } from "../jesus-12-30/escenarios";
import { Fig, gestoEnsenar, osc } from "../jesus-12-30/escenas";
import { mezclarBrazo } from "../amen/escenas";
import { Arbol, azar, Montes, Polvo, RayosDeLuz } from "../ambiente";
import { cl, Dato, mezcla } from "../manila/piezas";

type PropsEscena = { escena: EscenaAnimada };
const SUAVE = Easing.inOut(Easing.cubic);
const B_REPOSO: Brazo = { hombro: 8, codo: -15 };

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

// ---------- piedra: muro de sillares ----------
export const Muro: React.FC<{ x: number; y: number; w: number; h: number; base?: string; id?: string }> = ({ x, y, w, h, base = "#7A736A", id = "m" }) => {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "") + id;
  const tono = (i: number) => mezcla(base, "#000000", 0.04 + azar(i * 7) * 0.2);
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={w} height={h}>
      <defs>
        <pattern id={`mu${uid}`} width={160} height={90} patternUnits="userSpaceOnUse">
          <rect width={160} height={90} fill={mezcla(base, "#000000", 0.45)} />
          {[[2, 2], [82, 2], [-38, 47], [42, 47], [122, 47]].map(([bx, by], i) => (
            <rect key={i} x={bx} y={by} width={76} height={41} rx={5} fill={tono(i)} />
          ))}
        </pattern>
      </defs>
      <rect width={w} height={h} fill={`url(#mu${uid})`} />
    </svg>
  );
};

// ---------- fuego ----------
const Chispas: React.FC<{ x: number; y: number; n?: number; alto?: number; ancho?: number; op?: number }> = ({ x, y, n = 26, alto = 420, ancho = 160, op = 1 }) => {
  const f = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      {Array.from({ length: n }, (_, i) => {
        const u = azar(i * 7);
        const c = ((f * (0.7 + u * 0.8) + i * 37) % 100) / 100;
        return <circle key={i} cx={x + (azar(i * 3) - 0.5) * ancho + Math.sin(c * 6 + i) * 18} cy={y - c * alto * (0.5 + u * 0.5)} r={1.8 + azar(i * 5) * 3} fill="#FFD27A" opacity={(1 - c) * 0.95 * op} />;
      })}
    </svg>
  );
};

const Brasero: React.FC<{ x: number; y: number; e?: number; cuerpo?: number }> = ({ x, y, e = 1, cuerpo = 1 }) => {
  const f = useCurrentFrame();
  const fl = 0.85 + 0.15 * Math.sin(f / 3) * Math.sin(f / 7);
  return (
    <>
      <div style={{ position: "absolute", left: x - 520, top: y - 640, width: 1040, height: 1040, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,170,80,0.55) 0%, rgba(255,140,60,0.2) 35%, rgba(255,120,40,0) 68%)", opacity: fl, mixBlendMode: "screen" }} />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: cuerpo }} width={10} height={10}>
        <g transform={`translate(${x} ${y}) scale(${e})`}>
          <path d="M -70 0 L -96 130 M 70 0 L 96 130 M 0 0 L 0 140" stroke="#1A1A1E" strokeWidth={12} strokeLinecap="round" />
          <path d="M -110 -20 Q -100 44 0 50 Q 100 44 110 -20 Z" fill="#26262C" stroke="#0E0E12" strokeWidth={5} />
          <ellipse cx={0} cy={-20} rx={110} ry={24} fill="#3A2A22" />
          <ellipse cx={0} cy={-22} rx={92} ry={17} fill="#FF8A3A" opacity={0.95} />
          {[[-34, 1.0, 0], [0, 1.45, 2], [36, 1.1, 4]].map(([dx, h, ph], i) => (
            <g key={i} transform={`translate(${dx} -24) scale(${1 + 0.1 * Math.sin(f / 3 + (ph as number))} ${(h as number) * (0.9 + 0.12 * Math.sin(f / 2.5 + (ph as number)))})`}>
              <path d="M 0 0 Q -30 -44 0 -126 Q 34 -44 0 0 Z" fill="#F2822E" />
              <path d="M 0 0 Q -19 -34 0 -92 Q 21 -34 0 0 Z" fill="#FFC15A" />
              <path d="M 0 0 Q -8 -20 0 -52 Q 10 -20 0 0 Z" fill="#FFF3C8" />
            </g>
          ))}
        </g>
      </svg>
      <Chispas x={x} y={y - 120 * e} alto={460} ancho={150} op={cuerpo} />
    </>
  );
};

// ---------- gallo (silueta, mira a la izquierda) ----------
const Gallo: React.FC<{ x: number; y: number; e: number; canta: number }> = ({ x, y, e, canta }) => {
  const fl = "#5A3426";
  const f = useCurrentFrame();
  const pico = canta * (0.5 + 0.5 * Math.sin(f / 2.2));
  return (
    <g transform={`translate(${x} ${y}) scale(${e})`}>
      <circle cx={-20} cy={-120} r={230} fill="url(#gallo-luz)" opacity={0.85} />
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M ${-170 - k * 36} ${-130 - k * 12} Q ${-210 - k * 50} ${-130 - k * 40} ${-228 - k * 56} ${-168 - k * 30}`} stroke="#E3B04B" strokeWidth={4} fill="none" strokeLinecap="round" opacity={canta * (0.9 - k * 0.2)} transform={`scale(-1 1) rotate(${(k - 1) * 14} 0 -130)`} />
      ))}
      <path d="M 70 -70 Q 140 -150 110 -230 Q 92 -170 78 -150 Q 118 -210 96 -262 Q 70 -190 54 -150 Q 74 -190 60 -230 Q 38 -160 34 -120 Z" fill={fl} stroke="#FFB45A" strokeWidth={3} />
      <ellipse cx={0} cy={-62} rx={66} ry={50} fill={fl} stroke="#FFB45A" strokeWidth={3} />
      <path d="M -46 -80 Q -62 -150 -40 -176 Q -20 -190 -4 -172 L -10 -120 Z" fill={fl} stroke="#FFB45A" strokeWidth={3} />
      <circle cx={-42} cy={-184} r={26} fill={fl} stroke="#FFB45A" strokeWidth={3} />
      <path d="M -50 -206 Q -46 -228 -38 -210 Q -34 -232 -26 -208 Q -20 -224 -16 -204 Z" fill="#B0281E" />
      <path d="M -66 -184 L -92 -184 + 0 L -66 -176 Z" fill="#E3A030" />
      <path d={`M -66 -188 L -98 ${-192 - pico * 8} L -68 -184 Z M -66 -180 L -96 ${-174 + pico * 10} L -68 -184 Z`} fill="#E3A030" />
      <path d="M -52 -166 Q -56 -150 -44 -146 Z" fill="#B0281E" />
      <circle cx={-46} cy={-188} r={3.4} fill="#FFE9B0" />
      <path d="M -10 -14 L -10 30 M 14 -14 L 14 30" stroke="#E3A030" strokeWidth={5} strokeLinecap="round" />
      {canta > 0 ? [1, 2, 3].map((k) => <path key={k} d={`M ${-120 - k * 34} ${-210 - k * 18} Q ${-140 - k * 40} ${-186} ${-120 - k * 34} ${-162 + k * 18}`} stroke="#FFE9B0" strokeWidth={5} fill="none" strokeLinecap="round" opacity={canta * (0.9 - k * 0.2) * (0.6 + 0.4 * Math.sin(f / 3 + k))} />) : null}
    </g>
  );
};

// ---------- obelisco egipcio ----------
export const Obelisco: React.FC<{ x: number; y: number; h: number; brillo?: number }> = ({ x, y, h, brillo = 0 }) => {
  const w0 = h * 0.075;
  const w1 = h * 0.046;
  const ytop = y - h * 0.9;
  const glifos = Array.from({ length: 16 }, (_, i) => y - 40 - i * (h * 0.052));
  return (
    <g>
      <rect x={x - h * 0.13} y={y - h * 0.05} width={h * 0.26} height={h * 0.05} fill="#9A8C7A" stroke="#5A4E40" strokeWidth={3} />
      <rect x={x - h * 0.1} y={y - h * 0.1} width={h * 0.2} height={h * 0.05} fill="#A89A88" stroke="#5A4E40" strokeWidth={3} />
      <path d={`M ${x - w0} ${y - h * 0.1} L ${x - w1} ${ytop} L ${x} ${ytop} L ${x} ${y - h * 0.1} Z`} fill="#C9A29A" stroke="#7A5A52" strokeWidth={3} />
      <path d={`M ${x} ${y - h * 0.1} L ${x} ${ytop} L ${x + w1} ${ytop} L ${x + w0} ${y - h * 0.1} Z`} fill="#A07C74" stroke="#7A5A52" strokeWidth={3} />
      <path d={`M ${x - w1} ${ytop} L ${x} ${y - h} L ${x + w1} ${ytop} Z`} fill="#E0B8A8" stroke="#7A5A52" strokeWidth={3} />
      {glifos.slice(2).map((gy, i) => {
        const t = (y - h * 0.1 - gy) / (h * 0.8);
        const ww = (w0 + (w1 - w0) * t) * 0.5;
        return <path key={i} d={`M ${x - ww} ${gy} h ${ww * 0.5} M ${x - ww * 0.4} ${gy - 8} h ${ww * 0.5} M ${x + ww * 0.1} ${gy} h ${ww * 0.7}`} stroke="#6A4A44" strokeWidth={2.6} opacity={0.65} fill="none" strokeLinecap="round" />;
      })}
      <path d={`M ${x - w0 + 8} ${y - h * 0.12} L ${x - w1 + 4} ${ytop}`} stroke="#FFE9B0" strokeWidth={5} opacity={0.35 + 0.5 * brillo} />
    </g>
  );
};

// ---------- dos escenarios de piedra: sombra de la cruz invertida ----------
const SombraCruz: React.FC<{ x: number; y: number; e: number; rot: number; op: number; plana?: boolean }> = ({ x, y, e, rot, op, plana = false }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: op }} width={10} height={10}>
    <defs>
      <filter id="sombra-cruz" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation={plana ? 5 : 7} />
      </filter>
    </defs>
    <g transform={`translate(${x} ${y}) ${plana ? "scale(1 0.34)" : ""} rotate(${rot}) scale(${e})`} filter="url(#sombra-cruz)">
      <rect x={-30} y={-300} width={60} height={600} fill="#06080F" opacity={0.86} />
      <rect x={-130} y={-190} width={260} height={56} fill="#06080F" opacity={0.86} />
    </g>
  </svg>
);

// ================= 1. LA PEOR NOCHE Y EL CANTO DEL GALLO =================
const Noche: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fAbajo = useMomento("abajo", 0.17);
  const fArrest = useMomento("arrestaron", 0.46);
  const fJuro = useMomento("juró", 0.6);
  const fVeces = useMomento("veces", 0.55);
  const fGallo = useMomento("gallo", 0.85);
  const fLloro = useMomento("lloró", 0.9);
  const rot = lerp(f, fAbajo - 14, fAbajo + 16, 0, 180, SUAVE);
  const gente = lerp(f, fArrest - 52, fArrest - 14, 0, 1);
  const sombra = 1 - lerp(f, fArrest - 50, fArrest - 6, 0, 1);
  const pts = [fArrest + 10, fJuro - 14, fVeces + 14];
  const cortejo = lerp(f, fArrest - 8, fArrest + 120, 0, 1, Easing.linear);
  const miedo = lerp(f, pts[0], pts[0] + 22, 0, 1);
  const aClara = lerp(f, fGallo - 6, fGallo + 30, 0, 1);
  const canta = lerp(f, fGallo - 4, fGallo + 4, 0, 1) * (1 - lerp(f, fGallo + 34, fGallo + 44, 0, 1));
  const cara = lerp(f, fLloro - 8, fLloro + 8, 0, 1);
  const sale = lerp(f, fLloro + 18, duracion, 0, 1);
  const px = 480 + 50 * lerp(f, pts[0], pts[2] + 20, 0, 1) - 330 * sale;
  const señala = (i: number) => lerp(f, pts[i], pts[i] + 10, 0, 1) * (1 - lerp(f, pts[i] + 34, pts[i] + 44, 0, 1));
  const defensa = mezclarBrazo(B_REPOSO, { hombro: 46, codo: -24, mano: "abierta" }, miedo * (1 - cara));
  const rostro = { hombro: 0, codo: -158, mano: "abierta" as const };
  const brazoP = mezclarBrazo(defensa, rostro, cara);
  const k = 360 / 600;
  const cabY = 1420 - 1.5 * 360;
  const llora = lerp(f, fGallo + 6, fGallo + 20, 0, 1);
  return (
    <AbsoluteFill style={{ background: "#0B1426" }}>
      <Camara tomas={[{ f: 0, x: 330, y: 830, z: 2.3 }, { f: 36, x: 330, y: 830, z: 2.3 }, { f: fArrest + 10, x: 540, y: 1000, z: 1.0 }, { f: duracion, x: 540, y: 1010, z: 1.04 }]} vaiven={0.6}>
        <div style={{ position: "absolute", left: -600, top: -700, width: 2280, height: 1300, background: `linear-gradient(180deg, ${mezcla("#050A1C", "#1C2C56", aClara)} 0%, ${mezcla("#0E1A3A", "#3A4A78", aClara)} 60%, ${mezcla("#1E2A4C", "#C98A5A", aClara * 0.8)} 100%)` }} />
        <Estrellas n={60} alto={500} op={1 - aClara * 0.6} />
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          <defs>
            <radialGradient id="gallo-luz">
              <stop offset="0%" stopColor="#FFB45A" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#FFB45A" stopOpacity={0} />
            </radialGradient>
          </defs>
          <g opacity={lerp(f, fGallo - 24, fGallo - 6, 0, 1)}>
            <Gallo x={880} y={528} e={0.95} canta={canta} />
          </g>
        </svg>
        <Muro x={-200} y={520} w={1500} h={760} base="#6B655E" id="a" />
        <div style={{ position: "absolute", left: -200, top: 520, width: 1500, height: 30, background: "linear-gradient(180deg,#3A3630,#24211E)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          {Array.from({ length: 14 }, (_, i) => (
            <rect key={i} x={-190 + i * 108} y={486} width={64} height={40} fill="#4A453F" stroke="#24211E" strokeWidth={3} />
          ))}
          <path d="M 930 1280 L 930 800 Q 1010 730 1090 800 L 1090 1280 Z" fill="#0E0A0C" stroke="#4A453F" strokeWidth={14} />
        </svg>
        {/* el arresto: soldados con antorchas llevan a Jesús por lo alto del muro */}
        {cortejo > 0 && cortejo < 1 ? (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
            {[0, 1, 2, 3].map((i) => {
              const x = 1240 - 1050 * cortejo + i * 70;
              const jesus = i === 1;
              return (
                <g key={i} transform={`translate(${x} 522) scale(0.95)`}>
                  <path d="M -24 0 Q -28 -80 -12 -118 L 12 -118 Q 28 -80 24 0 Z" fill={jesus ? "#D9CBAE" : "#120E14"} stroke={jesus ? "#8E7A52" : "#FFB45A"} strokeWidth={jesus ? 2 : 1.5} />
                  <circle cx={jesus ? 4 : 0} cy={-136} r={17} fill={jesus ? "#B98260" : "#120E14"} stroke={jesus ? "none" : "#FFB45A"} strokeWidth={1.5} />
                  {!jesus ? <path d="M 30 -8 L 30 -190" stroke="#2A1E14" strokeWidth={6} /> : null}
                  {i === 0 || i === 3 ? (
                    <>
                      <circle cx={-34} cy={-126} r={46} fill="url(#antorcha-luz)" />
                      <ellipse cx={-34} cy={-126} rx={11} ry={24 + 4 * Math.sin(f / 3 + i)} fill="#FFB45A" />
                    </>
                  ) : null}
                </g>
              );
            })}
            <defs>
              <radialGradient id="antorcha-luz">
                <stop offset="0%" stopColor="#FFB45A" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#FFB45A" stopOpacity={0} />
              </radialGradient>
            </defs>
          </svg>
        ) : null}
        <div style={{ position: "absolute", left: -200, top: 1270, width: 1500, height: 900, background: "linear-gradient(180deg,#2E2A30,#16141A)" }} />
        <SombraCruz x={300} y={820} e={0.95} rot={rot} op={sombra * (0.8 + 0.2 * Math.sin(f / 4))} />
        <Brasero x={720} y={1330} e={1.15} cuerpo={gente} />
        <div style={{ opacity: gente }}>
        <Fig quien="vecina" x={150} suelo={1420} ancho={310} giro={0.5} mirada={[8, 0]} cejas={{ y: -3 * señala(0) }} boca={{ apertura: 0.28 * señala(0), curva: 2 }} brazoIzq={B_REPOSO} brazoDer={mezclarBrazo(B_REPOSO, { hombro: 100, codo: -8, mano: "senala" }, señala(0))} semilla={5} />
        <Fig quien="vecino" x={970} suelo={1420} ancho={310} giro={-0.5} mirada={[-8, 0]} boca={{ apertura: 0.28 * señala(1), curva: 2 }} brazoDer={B_REPOSO} brazoIzq={mezclarBrazo(B_REPOSO, { hombro: 100, codo: -8, mano: "senala" }, señala(1))} semilla={6} />
        <Fig quien="obrero2" x={820} suelo={1390} ancho={280} giro={-0.5} mirada={[-8, 0]} boca={{ apertura: 0.28 * señala(2), curva: 2 }} brazoDer={B_REPOSO} brazoIzq={mezclarBrazo(B_REPOSO, { hombro: 100, codo: -8, mano: "senala" }, señala(2))} semilla={7} />
        <Fig
          quien="pedro"
          x={px}
          suelo={1420}
          ancho={360}
          giro={sale > 0 ? -0.8 : 0.2}
          caminando={sale > 0 ? 0.7 * Math.min(1, sale * 6) : 0}
          paso={sale > 0 ? f / 20 : 0}
          cabeza={-4 * miedo + 10 * cara}
          mirada={[0, f > fGallo && f < fLloro ? -8 : miedo * 2]}
          cejas={{ rot: 8 * miedo, y: -5 * miedo }}
          boca={{ apertura: 0.25 * miedo * (1 - cara), curva: -2 - 4 * miedo }}
          brazoIzq={brazoP}
          brazoDer={brazoP}
          semilla={2}
        />
        </div>
        {llora > 0 ? (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
            {[-1, 1].map((l) =>
              [0, 1, 2].map((d) => {
                const c = ((f * 1.3 + d * 12 + (l > 0 ? 6 : 0)) % 36) / 36;
                return <ellipse key={`${l}${d}`} cx={px + l * 38 * k + l * c * 4} cy={cabY + 18 * k + c * 150 * k} rx={3.4} ry={5.6} fill="rgba(200,230,255,0.9)" opacity={llora * (1 - c) * (1 - 0.6 * cara)} />;
              }),
            )}
          </svg>
        ) : null}
      </Camara>
      <Dato texto="3 negaciones — Lucas 22:61-62" aparece={fJuro - 2} y={720} tam={38} />
      <Textura />
      <Sfx archivo="fuego" en={2} volumen={0.12} />
      <Sfx archivo="fuego" en={140} volumen={0.1} />
      <Sfx archivo="fuego" en={280} volumen={0.1} />
      <Sfx archivo="viento" en={20} volumen={0.1} />
      <Sfx archivo="tension" en={fAbajo - 6} volumen={0.12} />
      <Sfx archivo="gallo" en={fGallo - 6} volumen={0.3} />
      <Sfx archivo="tela" en={pts[0]} volumen={0.14} />
      <Sfx archivo="tela" en={pts[1]} volumen={0.14} />
      <Sfx archivo="tela" en={pts[2]} volumen={0.14} />
      <Sfx archivo="paso" en={fLloro + 22} volumen={0.16} />
      <Sfx archivo="paso" en={fLloro + 34} volumen={0.16} />
    </AbsoluteFill>
  );
};

// ================= 2. TRES PREGUNTAS EN LA ORILLA =================
const Orilla: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fResu = useMomento("resucitó", 0.05);
  const fPregunto = useMomento("preguntó", 0.3);
  const fQuer = useMomento("querés", 0.55);
  const fCada = useMomento("cada", 0.62);
  const fDijo = useMomento("dijo", 0.7);
  const fOvejas = useMomento("ovejas", 0.95);
  const alba = lerp(f, 0, 46, 0, 1);
  const paz = lerp(f, 50, 200, 0, 1);
  const habla1 = f > fPregunto - 6 && f < fQuer + 16 ? 1 : 0;
  const habla2 = f > fDijo - 2 && f < fOvejas + 38 ? 1 : 0;
  const ondas = [fPregunto + 2, fPregunto + 26, fPregunto + 52];
  const brillo = 0.85 + 0.15 * Math.sin(f / 3) * Math.sin(f / 8);
  const ovejas = lerp(f, fOvejas - 6, fOvejas + 20, 0, 1);
  return (
    <AbsoluteFill style={{ background: "#0B1426" }}>
      <Camara tomas={[{ f: 0, x: 540, y: 1180, z: 1.12 }, { f: duracion, x: 540, y: 1150, z: 1.24 }]} vaiven={0.6}>
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          <defs>
            <radialGradient id="llamita-luz">
              <stop offset="0%" stopColor="#FFD98A" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#FFD98A" stopOpacity={0} />
            </radialGradient>
          </defs>
        </svg>
        <div style={{ position: "absolute", left: -600, top: -900, width: 2280, height: 1900, background: `linear-gradient(180deg, ${mezcla("#10193A", "#3A4F86", alba)} 0%, ${mezcla("#1C2A52", "#F0A862", alba)} 55%, ${mezcla("#243258", "#FBE6C0", alba)} 100%)` }} />
        <Estrellas n={40} alto={500} op={1 - alba} />
        <div style={{ position: "absolute", left: 780 - 420, top: 880 - 420, width: 840, height: 840, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,240,190,0.95) 0%, rgba(255,200,120,0.45) 34%, rgba(255,200,120,0) 68%)", opacity: alba }} />
        <div style={{ position: "absolute", left: 780 - 70, top: 880 - 70, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle at 40% 38%, #FFFBEA, #FFD27A)", opacity: alba }} />
        <Montes y={960} color={mezcla("#1C2A52", "#8E7A9A", alba)} bruma={mezcla("#1C2A52", "#E8B88A", alba)} amp={70} paso={300} semilla={3} />
        <Montes y={1000} color={mezcla("#16224A", "#6E7A6E", alba)} bruma={mezcla("#16224A", "#D9B58A", alba)} amp={44} paso={220} semilla={8} />
        {/* ovejas en la colina */}
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          {[[860, 1010], [930, 1022], [990, 1008], [820, 1026], [1040, 1026]].map(([ox, oy], i) => (
            <g key={i} transform={`translate(${ox} ${oy}) scale(${0.8 + (i % 3) * 0.12})`} opacity={ovejas}>
              <ellipse cx={0} cy={-12} rx={26} ry={17} fill="#F4EEDC" />
              <circle cx={-24} cy={-14} r={9} fill="#4A3A2E" />
              <path d="M -12 -2 L -12 8 M 12 -2 L 12 8" stroke="#4A3A2E" strokeWidth={3} strokeLinecap="round" />
            </g>
          ))}
        </svg>
        {/* mar de Galilea */}
        <div style={{ position: "absolute", left: -600, top: 1040, width: 2280, height: 500, background: `linear-gradient(180deg, ${mezcla("#1B2E5A", "#E8B88A", alba)} 0%, ${mezcla("#14264C", "#5A86B4", alba)} 100%)` }} />
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: alba }} width={10} height={10}>
          {Array.from({ length: 22 }, (_, i) => (
            <path key={i} d={`M ${700 + (azar(i) - 0.5) * 200 + Math.sin(f / 16 + i) * 12} ${1060 + i * 20} h ${80 - i * 2 + azar(i * 3) * 50}`} stroke="#FFE9B0" strokeWidth={3 + (i % 3)} strokeLinecap="round" opacity={0.35 + 0.4 * Math.sin(f / 9 + i * 1.4) ** 2} />
          ))}
          {/* barca lejana */}
          <path d="M 180 1066 Q 260 1100 360 1066 L 340 1050 L 200 1050 Z" fill="#5A3A22" />
          <path d="M 270 1050 L 270 990 L 330 1046 Z" fill="#F4EEDC" opacity={0.9} />
        </svg>
        {/* orilla */}
        <div style={{ position: "absolute", left: -600, top: 1360, width: 2280, height: 700, background: "linear-gradient(180deg,#D9B98A 0%,#B8946A 100%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          <path d="M -50 1362 Q 200 1330 540 1366 T 1130 1350" stroke="#FFF1D2" strokeWidth={10} fill="none" opacity={0.6} />
          {Array.from({ length: 40 }, (_, i) => (
            <ellipse key={i} cx={azar(i * 3) * 1200 - 60} cy={1420 + azar(i * 5) * 400} rx={6 + azar(i) * 9} ry={4 + azar(i * 7) * 4} fill={azar(i * 9) < 0.5 ? "#9A7A56" : "#E3CFA4"} opacity={0.7} />
          ))}
          {/* ondas de luz cálida: tres preguntas */}
          {ondas.map((t0, i) => {
            const p = cl((f - t0) / 36);
            return p > 0 && p < 1 ? <ellipse key={i} cx={545} cy={1560} rx={80 + p * 520} ry={22 + p * 130} fill="none" stroke="#FFD98A" strokeWidth={9 * (1 - p)} opacity={0.85 * (1 - p)} /> : null;
          })}
        </svg>
        {/* fogata junto al agua */}
        <div style={{ position: "absolute", left: 545 - 380, top: 1560 - 440, width: 760, height: 760, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,190,100,0.5) 0%, rgba(255,160,70,0.2) 38%, rgba(255,160,70,0) 68%)", opacity: brillo, mixBlendMode: "screen" }} />
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          <g transform="translate(545 1560)">
            <path d="M -70 8 L 70 -6 M -66 -6 L 66 10" stroke="#4A2E18" strokeWidth={14} strokeLinecap="round" />
            {[[-36, 0.9, 0], [0, 1.3, 2], [34, 1.0, 4]].map(([dx, h, ph], i) => (
              <g key={i} transform={`translate(${dx} -6) scale(${1} ${(h as number) * (0.9 + 0.12 * Math.sin(f / 2.6 + (ph as number)))})`}>
                <path d="M 0 0 Q -26 -40 0 -112 Q 30 -40 0 0 Z" fill="#F2822E" />
                <path d="M 0 0 Q -16 -30 0 -80 Q 18 -30 0 0 Z" fill="#FFC15A" />
                <path d="M 0 0 Q -7 -18 0 -46 Q 8 -18 0 0 Z" fill="#FFF3C8" />
              </g>
            ))}
            {/* pescados en el fuego */}
            <path d="M -100 -40 Q -60 -60 -20 -40 Q -60 -22 -100 -40 Z" fill="#A8A8B4" stroke="#6A6A78" strokeWidth={2} transform="rotate(-8)" />
          </g>
        </svg>
        <Chispas x={545} y={1440} n={34} alto={380} ancho={110} op={1 - 0.4 * alba} />
        {/* una llama de luz por cada negación perdonada */}
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        {[380, 545, 710].map((tx, i) => {
          const t = lerp(f, fCada + i * 16, fCada + i * 16 + 14, 0, 1) * (1 - lerp(f, fDijo - 4, fDijo + 12, 0, 1));
          return t > 0 ? (
            <g key={i} transform={`translate(${tx} 790) scale(${0.5 + 0.5 * t})`} opacity={t}>
              <circle cx={0} cy={-40} r={110} fill="url(#llamita-luz)" />
              <path d="M 0 0 Q -20 -30 0 -86 Q 22 -30 0 0 Z" fill="#F2B84A" />
              <path d="M 0 0 Q -10 -22 0 -58 Q 12 -22 0 0 Z" fill="#FFF3C8" />
            </g>
          ) : null;
        })}
        </svg>
        <Fig quien="jesus" edad={1} x={300} suelo={1590} ancho={390} giro={0.5} mirada={[8, 1]} cejas={{ y: -2 }} boca={{ curva: 6 }} bocaAuto={0.3 * habla1 * osc(f, 9) + 0.3 * habla2 * osc(f, 8)} brazoDer={mezclarBrazo(gestoEnsenar(f), { hombro: 24, codo: 52, mano: "abierta" }, habla2)} brazoIzq={{ hombro: 10, codo: -40 }} semilla={1} />
        <Fig
          quien="pedro"
          x={790}
          suelo={1590}
          ancho={390}
          giro={-0.5}
          mirada={[-6 * (1 - paz), 2 - 3 * paz]}
          cabeza={6 * (1 - paz) - 3 * Math.sin(f / 26) * paz}
          cejas={{ rot: 6 * (1 - paz), y: 2 * (1 - paz) - 3 * paz }}
          boca={{ curva: -4 + 14 * paz }}
          brazoIzq={B_REPOSO}
          brazoDer={mezclarBrazo({ hombro: 12, codo: -35 }, { hombro: 4, codo: -128, mano: "abierta" }, lerp(f, fQuer + 4, fQuer + 24, 0, 1))}
          semilla={2}
        />
      </Camara>
      <Dato texto="Juan 21:15-17 — Cuidá de mis ovejas" aparece={fOvejas - 4} y={330} tam={38} />
      <Textura />
      <Sfx archivo="viento" en={4} volumen={0.1} />
      <Sfx archivo="fuego" en={4} volumen={0.1} />
      <Sfx archivo="brillo" en={ondas[0]} volumen={0.16} />
      <Sfx archivo="brillo" en={ondas[1]} volumen={0.16} />
      <Sfx archivo="brillo" en={ondas[2]} volumen={0.2} />
      <Sfx archivo="coro" en={fDijo - 10} volumen={0.1} />
      {void fResu}
    </AbsoluteFill>
  );
};

// ================= 3. LA HUIDA DE ROMA =================
const Adoquines: React.FC<{ y0: number; alto: number; e: number; id: string }> = ({ y0, alto, e, id }) => {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "") + id;
  return (
    <svg style={{ position: "absolute", left: -300, top: y0, overflow: "visible" }} width={1680} height={alto}>
      <defs>
        <pattern id={`ad${uid}`} width={120 * e} height={70 * e} patternUnits="userSpaceOnUse">
          <rect width={120 * e} height={70 * e} fill="#22273A" />
          {[[4, 4, 52, 30], [62, 6, 54, 28], [-24, 38, 56, 28], [36, 40, 54, 26], [94, 36, 50, 30]].map(([bx, by, bw, bh], i) => (
            <rect key={i} x={bx * e} y={by * e} width={bw * e} height={bh * e} rx={10 * e} fill={["#3E445E", "#353B54", "#464C66"][i % 3]} />
          ))}
        </pattern>
      </defs>
      <rect width={1680} height={alto} fill={`url(#ad${uid})`} />
    </svg>
  );
};

// Fondo nocturno de Roma: muralla con puerta y antorchas, ciudad detrás, cipreses y calzada. `fuego` = resplandor rojo del horizonte.
const FondoViaApia: React.FC<{ fuego?: number }> = ({ fuego = 0.2 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: -600, top: -700, width: 2280, height: 1900, background: `linear-gradient(180deg,#03060F 0%,#0B1530 44%,${mezcla("#1A2A50", "#7A2E2E", fuego)} 80%,${mezcla("#2A3558", "#C24A32", fuego)} 100%)` }} />
      <Estrellas n={80} alto={900} op={1 - 0.5 * fuego} />
      <div style={{ position: "absolute", left: 840 - 160, top: 300 - 160, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(235,240,255,0.5) 0%, rgba(235,240,255,0) 70%)" }} />
      <div style={{ position: "absolute", left: 840 - 62, top: 300 - 62, width: 124, height: 124, borderRadius: "50%", background: "radial-gradient(circle at 38% 36%, #FDFBF0, #CFD3E0)" }} />
      <Montes y={1080} color="#101A3A" bruma="#0A1128" amp={60} paso={300} semilla={6} />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        {/* la ciudad detrás de la muralla */}
        {Array.from({ length: 9 }, (_, i) => {
          const h = 120 + azar(i * 5) * 160;
          return (
            <g key={i}>
              <rect x={-30 + i * 56} y={640 - h} width={50} height={h + 10} fill="#171C34" />
              {Array.from({ length: Math.floor(h / 40) }, (_, k) => (
                <rect key={k} x={-18 + i * 56 + (k % 2) * 18} y={640 - h + 14 + k * 36} width={8} height={12} fill="#FFB45A" opacity={0.5 + 0.4 * azar(i * 11 + k)} />
              ))}
            </g>
          );
        })}
      </svg>
      <Muro x={-60} y={640} w={470} h={470} base="#4E4A58" id="r" />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={-52 + i * 78} y={606} width={46} height={40} fill="#3E3A48" stroke="#201E28" strokeWidth={3} />
        ))}
        <path d="M 110 1110 L 110 860 Q 190 780 270 860 L 270 1110 Z" fill="#0A0810" stroke="#2E2A38" strokeWidth={12} />
      </svg>
      {[96, 284].map((x) => (
        <div key={x} style={{ position: "absolute", left: x - 90, top: 880 - 90, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,190,100,0.7) 0%, rgba(255,160,70,0) 70%)", opacity: 0.8 + 0.2 * Math.sin(f / 4 + x), mixBlendMode: "screen" }} />
      ))}
      <div style={{ position: "absolute", left: -100, top: 300, width: 900, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(220,80,50,0.7) 0%, rgba(220,80,50,0) 70%)", opacity: fuego * (0.8 + 0.2 * Math.sin(f / 5)), mixBlendMode: "screen" }} />
      {[520, 740, 930, 1050].map((x, i) => (
        <Arbol key={x} x={x} y={1120} e={1.1 + (i % 2) * 0.4} tipo="cipres" semilla={i} tono={0.9} />
      ))}
      <Adoquines y0={1110} alto={200} e={0.5} id="a" />
      <Adoquines y0={1300} alto={700} e={1.0} id="b" />
      <div style={{ position: "absolute", left: -300, top: 1300, width: 1680, height: 3, background: "rgba(255,255,255,0.1)" }} />
      <div style={{ position: "absolute", left: -300, top: 1110, width: 1680, height: 900, background: "linear-gradient(180deg, rgba(5,8,20,0.55) 0%, rgba(5,8,20,0) 40%)" }} />
    </>
  );
};

const Huida: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fTreinta = useMomento("treinta", 0.04);
  const fNeron = useMomento("Nerón", 0.4);
  const fAmigos = useMomento("amigos", 0.58);
  const fHuyera = useMomento("huyera", 0.78);
  const fSalio = useMomento("salió", 0.86);
  const año = lerp(f, fTreinta - 4, fTreinta + 14, 0, 1, Easing.out(Easing.back(1.6))) * (1 - lerp(f, fTreinta + 74, fTreinta + 90, 0, 1));
  const fuego = lerp(f, fNeron - 12, fNeron + 40, 0.15, 1);
  const soldados = lerp(f, fNeron - 4, fNeron + 24, 0, 1);
  const ruegan = lerp(f, fAmigos - 4, fAmigos + 16, 0, 1);
  const duda = lerp(f, fAmigos + 12, fHuyera + 18, 0, 1);
  const sale = lerp(f, fSalio - 10, duracion, 0, 1, Easing.linear);
  const px = 520 + 230 * sale;
  const ruego: Brazo = { hombro: 24, codo: 46, mano: "abierta" };
  const alcanza: Brazo = { hombro: 64, codo: 14, mano: "abierta" };
  const amigos: { q: "vecina" | "oyente3" | "criado"; x: number; s: number }[] = [
    { q: "vecina", x: 110, s: 1560 },
    { q: "oyente3", x: 255, s: 1575 },
    { q: "criado", x: 395, s: 1560 },
  ];
  return (
    <AbsoluteFill style={{ background: "#05080F" }}>
      <Camara tomas={[{ f: 0, x: 540, y: 1130, z: 1.0 }, { f: duracion, x: 600, y: 1150, z: 1.1 }]} vaiven={0.5}>
        <FondoViaApia fuego={fuego} />
        <Chispas x={560} y={720} n={30} alto={520} ancho={800} op={fuego} />
        {/* guardias de Nerón sobre la muralla, con antorchas */}
        {[{ x: 330, g: -0.3 }, { x: 70, g: 0.3 }].map((c, i) => (
          <div key={i} style={{ opacity: soldados }}>
            <Fig quien="centurion" x={c.x} suelo={648} ancho={150} giro={c.g} mirada={[c.g * 10, 0]} boca={{ curva: 0 }} semilla={9 + i} />
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
              <line x1={c.x + 80} y1={380} x2={c.x + 80} y2={652} stroke="#3A2E22" strokeWidth={7} />
              <path d={`M ${c.x + 72} 384 L ${c.x + 80} 356 L ${c.x + 88} 384 Z`} fill="#B9BCC8" />
            </svg>
            <div style={{ position: "absolute", left: c.x - 100 - 40, top: 430 - 100, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,170,80,0.6) 0%, rgba(255,170,80,0) 70%)", mixBlendMode: "screen" }} />
          </div>
        ))}
        {amigos.map((a, i) => (
          <Fig
            key={a.q}
            quien={a.q}
            x={a.x}
            suelo={a.s}
            ancho={330}
            giro={0.5}
            mirada={[8, -1]}
            cejas={{ rot: 6 * ruegan, y: -4 * ruegan }}
            boca={{ apertura: 0.28 * ruegan * (0.5 + 0.5 * osc(f, 8 + i * 2, i * 0.3)), curva: -3 }}
            brazoIzq={mezclarBrazo(B_REPOSO, sale > 0 ? alcanza : ruego, ruegan)}
            brazoDer={mezclarBrazo(B_REPOSO, sale > 0 ? alcanza : ruego, ruegan)}
            semilla={i + 11}
          />
        ))}
        <Fig
          quien="pedro2"
          x={px}
          suelo={1570}
          ancho={380}
          giro={sale > 0 ? 0.8 : -0.4}
          caminando={sale > 0 ? 0.9 * Math.min(1, sale * 8) : 0}
          paso={f / 14}
          mirada={[sale > 0 ? 6 : -6, duda * 2]}
          cabeza={sale > 0 ? 0 : Math.sin(f / 7) * 5 * duda}
          cejas={{ rot: 6 * duda, y: -2 * duda }}
          boca={{ curva: -3 }}
          brazoIzq={sale > 0 ? undefined : mezclarBrazo(B_REPOSO, { hombro: 4, codo: -128, mano: "abierta" }, duda)}
          brazoDer={sale > 0 ? undefined : mezclarBrazo(B_REPOSO, { hombro: 4, codo: -128, mano: "abierta" }, duda)}
          semilla={2}
        />
      </Camara>
      {año > 0.01 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", opacity: año, transform: `scale(${0.7 + 0.3 * año})` }}>
          <div style={{ padding: "16px 54px 20px", borderRadius: 999, background: "rgba(11,20,38,0.92)", border: `5px solid ${PAL.dorado}`, boxShadow: "0 14px 34px rgba(0,0,0,0.55)", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 96, color: PAL.dorado, letterSpacing: 3, whiteSpace: "nowrap" }}>+30 años</div>
        </div>
      ) : null}
      <Textura />
      <Sfx archivo="viento" en={4} volumen={0.12} />
      <Sfx archivo="brillo" en={fTreinta} volumen={0.14} />
      <Sfx archivo="tambor" en={fNeron - 6} volumen={0.16} />
      <Sfx archivo="multitud" en={fNeron + 10} volumen={0.14} />
      <Sfx archivo="fuego" en={fNeron} volumen={0.1} />
      <Sfx archivo="tela" en={fAmigos + 6} volumen={0.16} />
      <Sfx archivo="tension" en={fHuyera - 10} volumen={0.1} />
      {[fSalio, fSalio + 14, fSalio + 28, fSalio + 42].map((t) => (
        <Sfx key={t} archivo="paso" en={t} volumen={0.15} />
      ))}
    </AbsoluteFill>
  );
};

// ================= 4. EL CAMINO FUERA DE ROMA (QUO VADIS) =================
const Camino: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fCruzo = useMomento("cruzó", 0.3);
  const fDonde = useMomento("dónde", 0.45);
  const fCruci = useMomento("crucifiquen", 0.7);
  const fEntendio = useMomento("entendió", 0.82);
  const fVuelta = useMomento("vuelta", 0.9);
  const jIn = lerp(f, fCruzo - 56, fCruzo + 8, 0, 1, Easing.linear);
  const jx = 1300 - 470 * jIn;
  const jMueve = jIn > 0 && jIn < 1 ? 1 : 0;
  const jOp = lerp(f, fCruzo - 56, fCruzo - 34, 0, 1) * (1 - lerp(f, fVuelta - 6, fVuelta + 26, 0, 1));
  const camina = lerp(f, 6, fCruzo + 10, 0, 1, Easing.linear);
  const gira = lerp(f, fVuelta - 6, fVuelta + 12, 0, 1, SUAVE);
  const vuelve = lerp(f, fVuelta + 12, duracion, 0, 1, Easing.linear);
  const px = f < fVuelta + 12 ? 200 + 380 * camina : 580 - 140 * vuelve;
  const camP = (f > 6 && f < fCruzo + 10) || vuelve > 0 ? 1 : 0;
  const entiende = lerp(f, fEntendio - 4, fEntendio + 24, 0, 1);
  const hablaP = f > fDonde - 2 && f < fDonde + 44 ? 1 : 0;
  const hablaJ = f > fCruci - 36 && f < fCruci + 36 ? 1 : 0;
  const escala = Math.cos(gira * Math.PI);
  const pasos: number[] = [];
  for (let t = 10; t < fCruzo + 10; t += 14) pasos.push(t);
  return (
    <AbsoluteFill style={{ background: "#05080F" }}>
      <Camara tomas={[{ f: 0, x: 540, y: 1130, z: 1.0 }, { f: duracion, x: 560, y: 1150, z: 1.08 }]} vaiven={0.5}>
        <FondoViaApia fuego={0.25} />
        <div style={{ position: "absolute", left: jx - 360, top: 1290 - 600, width: 720, height: 900, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,236,190,0.55) 0%, rgba(255,226,160,0) 70%)", opacity: jOp, mixBlendMode: "screen" }} />
        <div style={{ opacity: jOp, filter: "drop-shadow(0 0 40px rgba(255,226,160,0.95))" }}>
          <Fig quien="jesus2" edad={1} x={jx} suelo={1540} ancho={380} giro={-0.7} caminando={jMueve * 0.7} paso={f / 20} mirada={[-6, 0]} boca={{ curva: 6 }} bocaAuto={0.3 * hablaJ * osc(f, 8)} brazoDer={hablaJ ? gestoEnsenar(f) : undefined} brazoIzq={hablaJ ? { hombro: 10, codo: -50 } : undefined} semilla={1} />
        </div>
        <div style={{ position: "absolute", left: px - 540, top: 0, width: 1080, transform: `scaleX(${escala})`, transformOrigin: `540px 0` }}>
          <Fig
            quien="pedro2"
            x={540}
            suelo={1570}
            ancho={380}
            giro={0.8}
            caminando={camP * 0.9}
            paso={f / 14}
            mirada={[hablaP ? 0 : 6, -1 * hablaP]}
            cabeza={-4 * hablaP + 10 * entiende}
            cejas={{ y: -8 * hablaP * (1 - entiende), rot: 5 * entiende }}
            boca={{ apertura: 0.25 * hablaP * osc(f, 8), curva: -2 }}
            brazoIzq={camP ? undefined : hablaP ? { hombro: 26, codo: 40, mano: "abierta" } : B_REPOSO}
            brazoDer={camP ? undefined : hablaP ? { hombro: 26, codo: 40, mano: "abierta" } : B_REPOSO}
            semilla={2}
          />
        </div>
      </Camara>
      <Textura />
      <Sfx archivo="viento" en={6} volumen={0.12} />
      {pasos.map((t) => (
        <Sfx key={t} archivo="paso" en={t} volumen={0.14} />
      ))}
      <Sfx archivo="coro" en={fCruzo - 30} volumen={0.1} />
      <Sfx archivo="brillo" en={fCruzo - 20} volumen={0.16} />
      <Sfx archivo="tension" en={fCruci - 20} volumen={0.1} />
      {[fVuelta + 14, fVuelta + 28, fVuelta + 42, fVuelta + 56].map((t) => (
        <Sfx key={t} archivo="paso" en={t} volumen={0.16} />
      ))}
    </AbsoluteFill>
  );
};

// ================= 5. EL CIRCO DE NERÓN Y LA CRUZ INVERTIDA =================
const OBX = 540;
const OBY = 1330;
const Circo: React.FC<{ op?: number }> = ({ op = 1 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: op }}>
      <div style={{ position: "absolute", left: -600, top: -700, width: 2280, height: 1900, background: "linear-gradient(180deg,#1A1838 0%,#4A3A66 40%,#C98A5A 74%,#E8B07A 100%)" }} />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        <rect x={-100} y={820} width={1300} height={420} fill="#5A4A58" />
        {Array.from({ length: 13 }, (_, i) => (
          <g key={i}>
            <path d={`M ${-80 + i * 100} 1240 L ${-80 + i * 100} 1110 Q ${-50 + i * 100} 1060 ${-20 + i * 100} 1110 L ${-20 + i * 100} 1240 Z`} fill="#241E2E" />
            <path d={`M ${-80 + i * 100} 1040 L ${-80 + i * 100} 930 Q ${-50 + i * 100} 884 ${-20 + i * 100} 930 L ${-20 + i * 100} 1040 Z`} fill="#241E2E" />
          </g>
        ))}
        <rect x={-100} y={800} width={1300} height={26} fill="#7A6A72" />
        <rect x={-100} y={1044} width={1300} height={14} fill="#7A6A72" />
        {Array.from({ length: 70 }, (_, i) => (
          <circle key={i} cx={azar(i * 3) * 1100} cy={830 + azar(i * 5) * 200} r={9 + azar(i) * 5} fill={["#3A2A34", "#4A3A44", "#2E2430"][i % 3]} opacity={0.8} />
        ))}
      </svg>
      {[120, 420, 720, 1000].map((x, i) => (
        <div key={x} style={{ position: "absolute", left: x - 100, top: 1060 - 100, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,190,100,0.6) 0%, rgba(255,160,70,0) 70%)", opacity: 0.8 + 0.2 * Math.sin(f / 4 + i), mixBlendMode: "screen" }} />
      ))}
      <div style={{ position: "absolute", left: -300, top: 1240, width: 1680, height: 900, background: "linear-gradient(180deg,#C8A878 0%,#A8845A 40%,#8A6A44 100%)" }} />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        {Array.from({ length: 36 }, (_, i) => (
          <path key={i} d={`M ${azar(i * 3) * 1200 - 60} ${1300 + azar(i * 5) * 560} h ${40 + azar(i * 7) * 100}`} stroke="#6E5230" strokeWidth={3} opacity={0.4} strokeLinecap="round" />
        ))}
        <rect x={OBX - 330} y={OBY - 34} width={660} height={40} rx={8} fill="#8A7A6A" stroke="#4A3E34" strokeWidth={4} />
        <rect x={OBX - 360} y={OBY + 4} width={720} height={26} fill="#6E6054" />
        <Obelisco x={OBX} y={OBY - 30} h={770} brillo={0} />
      </svg>
    </div>
  );
};

const Cruz: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fSola = useMomento("sola", 0.3);
  const fAbajo = useMomento("abajo", 0.52);
  const fDigno = useMomento("digno", 0.7);
  const rot = lerp(f, fAbajo - 12, fAbajo + 24, 0, 180, SUAVE);
  const entra = lerp(f, 0, 78, 0, 1, Easing.linear);
  const px = -90 + 380 * entra;
  const camP = entra > 0 && entra < 1 ? 1 : 0;
  const arriba = lerp(f, fSola - 6, fSola + 8, 0, 1) * (1 - lerp(f, fSola + 40, fSola + 54, 0, 1));
  const abajo = lerp(f, fAbajo - 14, fAbajo - 2, 0, 1) * (1 - lerp(f, fDigno - 8, fDigno + 4, 0, 1));
  const pecho = lerp(f, fDigno - 2, fDigno + 16, 0, 1);
  const prepar = Math.sin(f / 9) * 4;
  const b1 = mezclarBrazo(B_REPOSO, { hombro: 150, codo: -10, mano: "senala" }, arriba);
  const b2 = mezclarBrazo(b1, { hombro: 34, codo: 12, mano: "senala" }, abajo);
  const b3 = mezclarBrazo(b2, { hombro: 4, codo: -128, mano: "abierta" }, pecho);
  return (
    <AbsoluteFill style={{ background: "#0B1426" }}>
      <Camara tomas={[{ f: 0, x: 540, y: 1100, z: 1.0 }, { f: duracion, x: 540, y: 1180, z: 1.1 }]} vaiven={0.5}>
        <Circo />
        <SombraCruz x={600} y={1690} e={1.3} rot={rot} op={0.85} plana />
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          <path d="M 760 1500 L 780 1560 M 980 1500 L 960 1560 M 800 1500 L 780 1560 M 940 1500 L 960 1560" stroke="#3A2614" strokeWidth={12} strokeLinecap="round" />
          <rect x={720} y={1470} width={300} height={34} rx={6} fill="#6E4526" stroke="#3A2614" strokeWidth={4} />
          <rect x={846} y={1430} width={44} height={110} rx={6} fill="#7A4E2A" stroke="#3A2614" strokeWidth={4} />
        </svg>
        <Fig quien="centurion" x={720} suelo={1450} ancho={310} giro={-0.4} mirada={[-6, 2]} boca={{ curva: 0 }} brazoIzq={{ hombro: 30 + prepar, codo: -50, mano: "puno" }} brazoDer={B_REPOSO} semilla={3} />
        <Fig quien="centurion" x={990} suelo={1440} ancho={310} giro={-0.5} mirada={[-6, 2]} boca={{ curva: 0 }} brazoIzq={{ hombro: 30 - prepar, codo: -50, mano: "puno" }} brazoDer={B_REPOSO} semilla={4} />
        {/* un guardia lo lleva hasta la arena */}
        <Fig quien="centurion" x={px - 210} suelo={1590} ancho={330} giro={0.4} caminando={camP * 0.8} paso={f / 14} mirada={[6, 1]} boca={{ curva: 0 }} semilla={5} />
        <Fig quien="pedro2" x={px} suelo={1580} ancho={410} giro={0.2} caminando={camP * 0.7} paso={f / 14} mirada={[0, 3 - 8 * arriba]} cabeza={2 + 8 * pecho} cejas={{ y: 1 - 2 * arriba }} boca={{ curva: 2 + 4 * pecho }} brazoIzq={camP ? undefined : B_REPOSO} brazoDer={camP ? undefined : b3} semilla={2} />
      </Camara>
      <Textura />
      <Sfx archivo="viento" en={4} volumen={0.1} />
      {[8, 22, 36, 50, 64].map((t) => (
        <Sfx key={t} archivo="paso" en={t} volumen={0.15} />
      ))}
      <Sfx archivo="madera" en={90} volumen={0.18} />
      <Sfx archivo="madera" en={118} volumen={0.14} />
      <Sfx archivo="tension" en={fAbajo - 12} volumen={0.14} />
      <Sfx archivo="piedra" en={fAbajo + 10} volumen={0.14} />
    </AbsoluteFill>
  );
};

// ================= 6. EL OBELISCO Y LA CÚPULA HOY =================
const Basilica: React.FC<{ tono?: number }> = ({ tono = 0 }) => {
  const piedra = mezcla("#D9C8A6", "#E8C98A", tono);
  const sombra = mezcla("#B6A582", "#C9A672", tono);
  const cupula = mezcla("#9AA6B8", "#D8B678", tono);
  return (
    <g>
      {[-1, 1].map((l) => (
        <g key={l}>
          <path d={`M ${540 + l * 130} 1180 Q ${540 + l * 380} 1180 ${540 + l * 500} 1300 L ${540 + l * 500} 1340 Q ${540 + l * 380} 1230 ${540 + l * 130} 1230 Z`} fill={sombra} />
          {Array.from({ length: 14 }, (_, i) => {
            const t = i / 13;
            const xx = 540 + l * (150 + t * 340);
            const yy = 1190 + t * t * 110;
            return <rect key={i} x={xx - 8} y={yy - 38 - t * 10} width={16} height={70 + t * 14} fill={piedra} stroke={sombra} strokeWidth={1.5} />;
          })}
          <path d={`M ${540 + l * 130} 1150 Q ${540 + l * 380} 1150 ${540 + l * 520} 1280 L ${540 + l * 520} 1296 Q ${540 + l * 380} 1170 ${540 + l * 130} 1170 Z`} fill={piedra} />
        </g>
      ))}
      <rect x={350} y={880} width={380} height={300} fill={piedra} stroke={sombra} strokeWidth={3} />
      <rect x={350} y={810} width={380} height={72} fill={sombra} />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={366 + i * 46} y={896} width={18} height={270} fill={mezcla(piedra, "#FFFFFF", 0.35)} stroke={sombra} strokeWidth={1.5} />
      ))}
      {Array.from({ length: 13 }, (_, i) => (
        <rect key={i} x={360 + i * 28} y={792} width={12} height={22} fill={piedra} />
      ))}
      <path d="M 430 880 L 540 834 L 650 880 Z" fill={sombra} />
      <rect x={510} y={1090} width={60} height={90} fill="#2A2018" />
      <rect x={420} y={650} width={240} height={160} fill={piedra} stroke={sombra} strokeWidth={3} />
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i}>
          <rect x={430 + i * 29} y={668} width={12} height={116} fill={mezcla(piedra, "#FFFFFF", 0.35)} />
          {i < 7 ? <path d={`M ${448 + i * 29} 760 L ${448 + i * 29} 692 Q ${454 + i * 29} 678 ${464 + i * 29} 692 L ${464 + i * 29} 760 Z`} fill="#4A3E5A" opacity={0.85} /> : null}
        </g>
      ))}
      <path d="M 414 652 Q 414 430 540 410 Q 666 430 666 652 Z" fill={cupula} stroke={mezcla(cupula, "#000000", 0.25)} strokeWidth={3} />
      {Array.from({ length: 7 }, (_, i) => {
        const a = (-3 + i) * 0.5;
        return <path key={i} d={`M ${540 + Math.sin(a) * 126} 652 Q ${540 + Math.sin(a) * 150} 480 540 412`} stroke={mezcla(cupula, "#FFFFFF", 0.4)} strokeWidth={4} fill="none" opacity={0.8} />;
      })}
      <rect x={524} y={372} width={32} height={50} fill={piedra} stroke={sombra} strokeWidth={2} />
      <path d="M 540 316 L 540 372 M 520 336 L 560 336" stroke="#E3B04B" strokeWidth={8} strokeLinecap="round" />
    </g>
  );
};

// La plaza actual (cielo dorado, basílica, columnatas, fuentes y gente diminuta).
const PlazaFondo: React.FC = () => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>
    <div style={{ position: "absolute", left: -600, top: -700, width: 2280, height: 1900, background: "linear-gradient(180deg,#2A2A5A 0%,#8A6A8A 38%,#F0B070 70%,#F7D49A 100%)" }} />
    <div style={{ position: "absolute", left: 540 - 520, top: 560 - 520, width: 1040, height: 1040, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,226,160,0.5) 0%, rgba(255,226,160,0) 66%)" }} />
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      <Basilica tono={0.5} />
    </svg>
    <div style={{ position: "absolute", left: -300, top: 1240, width: 1680, height: 1100, background: "linear-gradient(180deg,#C9B08A 0%,#A89070 45%,#8A7458 100%)" }} />
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      {Array.from({ length: 60 }, (_, i) => (
        <path key={i} d={`M ${azar(i * 3) * 1200 - 60} ${1280 + azar(i * 5) * 600} h ${30 + azar(i * 7) * 90}`} stroke="#7A6446" strokeWidth={3} opacity={0.35} strokeLinecap="round" />
      ))}
      {[170, 910].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={1480} rx={70} ry={20} fill="#9A8E7A" />
          <path d={`M ${x} 1480 L ${x} 1400 M ${x - 24} 1410 Q ${x} 1370 ${x + 24} 1410`} stroke="#E8F4FF" strokeWidth={5} fill="none" opacity={0.8} />
        </g>
      ))}
      {Array.from({ length: 50 }, (_, i) => (
        <g key={i}>
          <rect x={azar(i * 3) * 1000 + 20} y={1500 + azar(i * 5) * 300} width={10} height={22} rx={4} fill={["#3A2A34", "#6A3A3A", "#2E3A5A", "#F7F1E3"][i % 4]} opacity={0.9} />
          <circle cx={azar(i * 3) * 1000 + 25} cy={1496 + azar(i * 5) * 300} r={5.5} fill="#C99470" />
        </g>
      ))}
    </svg>
  </div>
);

// Corte de la tierra: la tumba bajo el altar mayor. `fiel` 0..1 = intensidad de la luz.
const TumbaCorte: React.FC<{ op: number; fiel: number }> = ({ op, fiel }) => {
  const f = useCurrentFrame();
  const pulso = 0.85 + 0.15 * Math.sin(f / 7);
  if (op <= 0) return null;
  return (
    <>
      <div style={{ position: "absolute", left: 340, top: 1490, width: 400, height: 250, borderRadius: 18, background: "linear-gradient(180deg,#2E2218,#150E0A)", border: "4px solid #5A4630", opacity: op, boxShadow: "0 14px 34px rgba(0,0,0,0.55)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 200 - 180 - 120 * fiel, top: 125 - 180 - 120 * fiel, width: 360 + 240 * fiel, height: 360 + 240 * fiel, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,226,160,0.9) 0%, rgba(255,200,110,0.4) 40%, rgba(255,200,110,0) 70%)", opacity: (0.6 + 0.4 * fiel) * pulso }} />
        <svg width={400} height={250} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M 130 230 L 130 130 Q 200 60 270 130 L 270 230 Z" fill="#6A5A48" stroke="#3A2E22" strokeWidth={5} />
          <path d="M 200 120 L 200 190 M 170 148 L 230 148" stroke="#F2C14E" strokeWidth={10} strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 340, top: 1752, width: 400, textAlign: "center", opacity: op, fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 34, color: PAL.crema, textShadow: "0 3px 10px rgba(0,0,0,0.8)" }}>Tumba de San Pedro</div>
    </>
  );
};

const LineaDomo: React.FC<{ p: number }> = ({ p }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
    <defs>
      <linearGradient id="hoy-linea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFF3C8" />
        <stop offset="1" stopColor="#F2B84A" />
      </linearGradient>
    </defs>
    <path d={`M 540 320 L 540 ${320 + 1240 * p}`} stroke="#F2B84A" strokeWidth={40} strokeLinecap="round" opacity={0.4} />
    <path d={`M 540 320 L 540 ${320 + 1240 * p}`} stroke="url(#hoy-linea)" strokeWidth={14} strokeLinecap="round" />
    <circle cx={540} cy={320 + 1240 * p} r={16} fill="#FFF3C8" opacity={p > 0 && p < 1 ? 1 : 0} />
  </svg>
);

const Hoy: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fObelisco = useMomento("obelisco", 0.1);
  const fPlaza = useMomento("Plaza", 0.46);
  const fCupula = useMomento("cúpula", 0.7);
  const fBasilica = useMomento("Basílica", 0.74);
  const trans = lerp(f, fPlaza - 14, fPlaza + 56, 0, 1, SUAVE);
  const destello = Math.max(0, 0.5 * Math.exp(-Math.abs(f - (fPlaza + 22)) / 10));
  const linea = lerp(f, fCupula - 6, fCupula + 52, 0, 1, Easing.inOut(Easing.quad));
  const tumba = lerp(f, fCupula + 46, fCupula + 70, 0, 1);
  return (
    <AbsoluteFill style={{ background: "#0B1426" }}>
      <Camara tomas={[{ f: 0, x: 540, y: 1000, z: 1.0 }, { f: duracion, x: 540, y: 1040, z: 1.06 }]} vaiven={0.3}>
        <Circo op={1 - trans} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: trans }}>
          <PlazaFondo />
        </div>
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          <rect x={OBX - 330} y={OBY - 34} width={660} height={40} rx={8} fill="#8A7A6A" stroke="#4A3E34" strokeWidth={4} opacity={1 - trans} />
          <Obelisco x={OBX} y={OBY - 30} h={770} brillo={lerp(f, fObelisco - 4, fObelisco + 16, 0, 1)} />
        </svg>
        <LineaDomo p={linea} />
        <TumbaCorte op={tumba} fiel={0.3} />
      </Camara>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #FFF3C8, rgba(255,230,160,0.4) 60%, rgba(255,230,160,0))", opacity: destello, mixBlendMode: "screen" }} />
      <Dato texto="Basílica de San Pedro" aparece={fBasilica - 2} y={400} tam={38} hasta={fBasilica + 80} />
      <Textura />
      <Sfx archivo="coro" en={4} volumen={0.1} />
      <Sfx archivo="brillo" en={fObelisco} volumen={0.14} />
      <Sfx archivo="expansion" en={fPlaza - 8} volumen={0.22} />
      <Sfx archivo="brillo" en={fPlaza + 14} volumen={0.16} />
      <Sfx archivo="brillo" en={fCupula + 4} volumen={0.2} />
      <Sfx archivo="coro" en={fCupula} volumen={0.14} />
    </AbsoluteFill>
  );
};

// ================= 7. NEGÓ POR MIEDO, MURIÓ POR NO NEGARLO =================
const Fiel: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fTres = useMomento("tres", 0.34);
  const fMiedo = useMomento("miedo", 0.5);
  const fMurio = useMomento("murió", 0.66);
  const fNegarlo = useMomento("negarlo", 0.82);
  const apagan = lerp(f, fMiedo + 2, fMiedo + 30, 1, 0);
  const enciende = (i: number) => lerp(f, fTres + i * 8, fTres + i * 8 + 12, 0, 1);
  const fiel = lerp(f, fMurio - 6, fMurio + 20, 0, 1);
  return (
    <AbsoluteFill style={{ background: "#0B1426" }}>
      <Camara tomas={[{ f: 0, x: 540, y: 1580, z: 1.12 }, { f: fMurio, x: 540, y: 1560, z: 1.16 }, { f: duracion, x: 540, y: 760, z: 1.0 }]} vaiven={0.3}>
        <PlazaFondo />
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          <Obelisco x={OBX} y={OBY - 30} h={770} brillo={0.6} />
        </svg>
        <LineaDomo p={1} />
        <TumbaCorte op={1} fiel={0.3 + 0.7 * fiel} />
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          {[130, 200, 270].map((x, i) => (
            <g key={x} transform={`translate(${x} 1640) scale(${1.5 * (0.35 + 0.65 * apagan)})`} opacity={enciende(i) * (0.25 + 0.75 * apagan)}>
              <path d="M 0 0 Q -14 -24 0 -66 Q 16 -24 0 0 Z" fill="#F2822E" transform={`rotate(${Math.sin(f / 3 + i) * 6 * apagan})`} />
              <rect x={-6} y={0} width={12} height={34} fill="#F4EEDC" />
            </g>
          ))}
        </svg>
      </Camara>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 60%, #FFF3C8, rgba(255,230,160,0.35) 55%, rgba(255,230,160,0))", opacity: Math.max(0, 0.45 * Math.exp(-Math.abs(f - (fMurio + 6)) / 14)), mixBlendMode: "screen" }} />
      <Textura />
      <Sfx archivo="fuego" en={fTres} volumen={0.12} />
      <Sfx archivo="apagar" en={fMiedo + 4} volumen={0.2} />
      <Sfx archivo="brillo" en={fMurio} volumen={0.26} />
      <Sfx archivo="coro" en={fMurio - 4} volumen={0.14} />
      <Sfx archivo="trompeta" en={fMurio} volumen={0.1} />
      <Sfx archivo="expansion" en={fNegarlo - 14} volumen={0.16} />
    </AbsoluteFill>
  );
};

// ================= 6. COMENTAR Y SEGUIR =================
const Cierre: React.FC<PropsEscena> = ({ escena }) => {
  const f = useCurrentFrame();
  const fundir = lerp(f, 6, 56, 0, 1, SUAVE);
  const apertura = lerp(f, 30, 62, 0, 1);
  const titulo = lerp(f, 54, 72, 0, 1, Easing.out(Easing.cubic));
  const lema = lerp(f, 70, 86, 0, 1);
  const luz = lerp(f, 10, 52, 0, 1);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #24395F 0%, #0B1426 70%)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: 1 - fundir, transform: `scale(${1 + 0.04 * f / 60})`, transformOrigin: "540px 700px" }}>
        <div style={{ position: "absolute", left: -600, top: -700, width: 2280, height: 1900, background: "linear-gradient(180deg,#2A2A5A 0%,#8A6A8A 38%,#F0B070 70%,#F7D49A 100%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          <Basilica tono={0.6} />
          <path d="M 540 320 L 540 1560" stroke="#FFF3C8" strokeWidth={9} strokeLinecap="round" opacity={0.9} />
        </svg>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: luz }}>
        <defs>
          <radialGradient id="cp-luz" cx="50%" cy="58%" r="45%">
            <stop offset="0%" stopColor="#FFE9B0" stopOpacity={0.85} />
            <stop offset="100%" stopColor="#FFE9B0" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={540} cy={1120} r={760} fill="url(#cp-luz)" />
        {Array.from({ length: 9 }, (_, i) => {
          const a = -150 + i * 15 + Math.sin(f / 30 + i) * 2;
          const r = (a * Math.PI) / 180;
          return <path key={i} d={`M 540 1120 L ${540 + Math.cos(r - 0.04) * 1100} ${1120 + Math.sin(r - 0.04) * 1100} L ${540 + Math.cos(r + 0.04) * 1100} ${1120 + Math.sin(r + 0.04) * 1100} Z`} fill="#FFE9B0" opacity={0.12} />;
        })}
      </svg>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 60 }, (_, i) => {
          const sx = azar(i * 3) * 1100;
          const sy = 400 + azar(i * 5) * 1000;
          const d = azar(i * 7) * 14;
          const e = Easing.inOut(Easing.cubic)(cl((f - 10 - d) / 40));
          return <circle key={i} cx={sx + (540 - sx) * e} cy={sy + (1150 - sy) * e} r={7 - 3 * e} fill="#FFD98A" opacity={(0.9 - 0.9 * cl((e - 0.7) / 0.3)) * (e > 0 ? 1 : 0)} />;
        })}
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
      <Polvo x={140} y={300} ancho={800} alto={1200} n={14} semilla={3} />
      <Textura fuerza={0.7} />
      <Sfx archivo="brillo" en={10} volumen={0.2} />
      <Sfx archivo="pagina" en={32} volumen={0.4} />
      <Sfx archivo="brillo" en={56} volumen={0.3} />
    </AbsoluteFill>
  );
};

export const ESCENAS_PEDRO: Record<string, React.FC<{ escena: EscenaAnimada }>> = {
  "pedro/noche": Noche,
  "pedro/orilla": Orilla,
  "pedro/huida": Huida,
  "pedro/camino": Camino,
  "pedro/circo": Cruz,
  "pedro/hoy": Hoy,
  "pedro/fiel": Fiel,
  "pedro/cierre": Cierre,
};

export { RayosDeLuz };
