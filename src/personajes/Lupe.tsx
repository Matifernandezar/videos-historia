// Lupe: presentadora original del canal, dibujada por capas en SVG.
// Cada parte (pelo, cara, cejas, ojos, anteojos, boca, torso, brazos, manos) es un grupo
// independiente con su propio pivote, así se anima por frames y se mantiene igual en todas las escenas.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useAperturaBoca } from "../video/contexto";

export type Pose =
  | "neutral"
  | "explica"
  | "senala"
  | "saluda"
  | "celebra"
  | "encoge"
  | "sorprendida"
  | "preocupada"
  | "pulgar";

export type Expresion = "feliz" | "sorprendida" | "pensativa" | "preocupada" | "seria";

export type Mirada = "frente" | "izquierda" | "derecha" | "arriba" | "abajo";

type Mano = "puno" | "palma" | "indice" | "pulgar";
type Brazo = { hombro: number; codo: number; mano: Mano };
type DefPose = { izq: Brazo; der: Brazo; inclinacion: number; hombros: number };

// Ángulos en grados (0 = brazo colgando). Positivo gira en sentido horario.
const POSES: Record<Pose, DefPose> = {
  neutral: { izq: { hombro: 8, codo: -12, mano: "puno" }, der: { hombro: -8, codo: 12, mano: "puno" }, inclinacion: 0, hombros: 0 },
  explica: { izq: { hombro: 8, codo: -12, mano: "puno" }, der: { hombro: -42, codo: -68, mano: "palma" }, inclinacion: -3, hombros: 0 },
  senala: { izq: { hombro: 8, codo: -12, mano: "puno" }, der: { hombro: -120, codo: -6, mano: "indice" }, inclinacion: -4, hombros: 0 },
  saluda: { izq: { hombro: 8, codo: -12, mano: "puno" }, der: { hombro: -150, codo: -12, mano: "palma" }, inclinacion: -3, hombros: 0 },
  celebra: { izq: { hombro: 150, codo: 14, mano: "puno" }, der: { hombro: -150, codo: -14, mano: "puno" }, inclinacion: 0, hombros: -6 },
  encoge: { izq: { hombro: 30, codo: 62, mano: "palma" }, der: { hombro: -30, codo: -62, mano: "palma" }, inclinacion: 5, hombros: -10 },
  sorprendida: { izq: { hombro: 35, codo: 95, mano: "palma" }, der: { hombro: -35, codo: -95, mano: "palma" }, inclinacion: 0, hombros: -6 },
  preocupada: { izq: { hombro: -14, codo: -62, mano: "puno" }, der: { hombro: 14, codo: 62, mano: "puno" }, inclinacion: 4, hombros: 2 },
  pulgar: { izq: { hombro: 8, codo: -12, mano: "puno" }, der: { hombro: -35, codo: -110, mano: "pulgar" }, inclinacion: -3, hombros: 0 },
};

type DefExpresion = {
  cejaIzq: { y: number; rot: number };
  cejaDer: { y: number; rot: number };
  ojos: number; // escala de apertura
  boca: { ancho: number; curva: number; abiertaMin: number };
};

const EXPRESIONES: Record<Expresion, DefExpresion> = {
  feliz: { cejaIzq: { y: 0, rot: 0 }, cejaDer: { y: 0, rot: 0 }, ojos: 1, boca: { ancho: 34, curva: 26, abiertaMin: 0 } },
  sorprendida: { cejaIzq: { y: -14, rot: 4 }, cejaDer: { y: -14, rot: -4 }, ojos: 1.12, boca: { ancho: 20, curva: 8, abiertaMin: 0.7 } },
  pensativa: { cejaIzq: { y: -14, rot: -6 }, cejaDer: { y: 2, rot: 4 }, ojos: 0.95, boca: { ancho: 22, curva: 4, abiertaMin: 0 } },
  preocupada: { cejaIzq: { y: -4, rot: -14 }, cejaDer: { y: -4, rot: 14 }, ojos: 1, boca: { ancho: 26, curva: -16, abiertaMin: 0 } },
  seria: { cejaIzq: { y: 2, rot: 6 }, cejaDer: { y: 2, rot: -6 }, ojos: 0.95, boca: { ancho: 26, curva: 2, abiertaMin: 0 } },
};

const MIRADA: Record<Mirada, [number, number]> = {
  frente: [0, 0],
  izquierda: [-9, 1],
  derecha: [9, 1],
  arriba: [0, -8],
  abajo: [0, 7],
};

const C = {
  piel: "#C98B64",
  pielSombra: "#A8704D",
  mejilla: "#E9846C",
  pelo: "#2A1A14",
  peloBrillo: "#4A2F23",
  buzo: "#2FBF9B",
  buzoSombra: "#22977B",
  buzoLuz: "#45D3AF",
  cordon: "#EAF8F3",
  hoja: "#B6F23E",
  marco: "#16161B",
  iris: "#3B2416",
  boca: "#5A1F22",
  lengua: "#E0716C",
};

const UPPER = 135;
const LOWER = 120;

const ManoSVG: React.FC<{ tipo: Mano; anguloMundo: number; lado: 1 | -1 }> = ({ tipo, anguloMundo, lado }) => {
  return (
    <g>
      {tipo === "indice" ? (
        <rect x={-9} y={8} width={18} height={58} rx={9} fill={C.piel} />
      ) : null}
      {tipo === "palma"
        ? [-18, -6, 6, 18].map((dx, i) => (
            <rect key={i} x={dx - 7} y={10} width={14} height={i === 0 || i === 3 ? 34 : 42} rx={7} fill={C.piel} />
          ))
        : null}
      <circle cx={0} cy={0} r={32} fill={C.piel} />
      <circle cx={8 * lado} cy={6} r={20} fill={C.pielSombra} opacity={0.25} />
      {tipo === "pulgar" ? (
        <g transform={`rotate(${-anguloMundo})`}>
          <rect x={-10} y={-66} width={22} height={50} rx={11} fill={C.piel} />
        </g>
      ) : null}
    </g>
  );
};

const BrazoSVG: React.FC<{
  x: number;
  y: number;
  brazo: Brazo;
  lado: 1 | -1;
  extraCodo: number;
}> = ({ x, y, brazo, lado, extraCodo }) => {
  const codo = brazo.codo + extraCodo;
  return (
    <g transform={`translate(${x} ${y}) rotate(${brazo.hombro})`}>
      <circle cx={0} cy={0} r={38} fill={C.buzo} />
      <rect x={-34} y={-18} width={68} height={UPPER + 30} rx={34} fill={C.buzo} />
      <rect x={lado === 1 ? -34 : 6} y={-10} width={28} height={UPPER + 10} rx={14} fill={C.buzoSombra} opacity={0.5} />
      <g transform={`translate(0 ${UPPER}) rotate(${codo})`}>
        <rect x={-31} y={-14} width={62} height={LOWER + 6} rx={31} fill={C.buzo} />
        <rect x={-33} y={LOWER - 26} width={66} height={22} rx={11} fill={C.buzoSombra} />
        <g transform={`translate(0 ${LOWER + 18})`}>
          <ManoSVG tipo={brazo.mano} anguloMundo={brazo.hombro + codo} lado={lado} />
        </g>
      </g>
    </g>
  );
};

export type LupeProps = {
  pose?: Pose;
  expresion?: Expresion;
  mirar?: Mirada;
  alto?: number; // alto en px del dibujo completo
  espejo?: boolean; // dar vuelta horizontalmente
  hablando?: boolean; // fuerza movimiento de boca (sin audio)
  semilla?: number; // desfase para parpadeo/respiración
  transicionPose?: number; // frames para pasar de neutral a la pose
};

export const LUPE_ANCHO = 800;
export const LUPE_ALTO = 820;

export const Lupe: React.FC<LupeProps> = ({
  pose = "neutral",
  expresion = "feliz",
  mirar = "frente",
  alto = 820,
  espejo = false,
  hablando,
  semilla = 0,
  transicionPose = 12,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame + semilla * 37;

  const def = POSES[pose];
  const base = POSES.neutral;
  const p = transicionPose > 0
    ? spring({ frame, fps, config: { damping: 14, stiffness: 140, mass: 0.7 }, durationInFrames: transicionPose * 2 })
    : 1;
  const mezcla = (a: number, b: number) => a + (b - a) * p;
  const brazoMix = (a: Brazo, b: Brazo): Brazo => ({ hombro: mezcla(a.hombro, b.hombro), codo: mezcla(a.codo, b.codo), mano: p > 0.5 ? b.mano : a.mano });
  const izq = brazoMix(base.izq, def.izq);
  const der = brazoMix(base.der, def.der);

  // Vida: respiración, balanceo, parpadeo, saludo.
  const respira = Math.sin((t / fps) * Math.PI * 2 * 0.33);
  const balanceo = Math.sin((t / fps) * Math.PI * 2 * 0.21) * 1.4;
  const ciclo = 96 + (semilla % 3) * 17;
  const fase = (t + 30) % ciclo;
  const parpadeo = fase < 6 ? interpolate(fase, [0, 3, 6], [1, 0.08, 1]) : 1;
  const ondeo = pose === "saluda" ? Math.sin((t / fps) * Math.PI * 2 * 1.8) * 22 : 0;
  const rebote = pose === "celebra" ? Math.abs(Math.sin((t / fps) * Math.PI * 2 * 1.2)) * -10 : 0;

  const ex = EXPRESIONES[expresion];
  const bocaVoz = useAperturaBoca(hablando);
  const apertura = Math.max(ex.boca.abiertaMin, bocaVoz);
  const [mx, my] = MIRADA[mirar];
  const inclinacion = mezcla(base.inclinacion, def.inclinacion) + balanceo;
  const hombros = mezcla(0, def.hombros) + respira * 2;

  // Boca: borde superior + borde inferior (que baja con la apertura).
  const by = 362;
  const w = ex.boca.ancho + apertura * 6;
  const curva = ex.boca.curva;
  const sup = `M ${400 - w} ${by} Q 400 ${by + curva * 0.35} ${400 + w} ${by}`;
  const inf = `Q 400 ${by + curva + apertura * 44} ${400 - w} ${by}`;
  const cerrada = apertura < 0.08;

  return (
    <svg
      viewBox={`0 0 ${LUPE_ANCHO} ${LUPE_ALTO}`}
      width={(alto * LUPE_ANCHO) / LUPE_ALTO}
      height={alto}
      style={{ overflow: "visible", scale: espejo ? "-1 1" : undefined }}
    >
      <g transform={`translate(0 ${rebote})`}>
        {/* Torso: buzo con capucha */}
        <g transform={`translate(400 820) scale(1 ${1 + respira * 0.008}) translate(-400 -820)`}>
          <path d="M 228 610 C 228 548 280 516 330 508 L 470 508 C 520 516 572 548 572 610 L 592 830 L 208 830 Z" fill={C.buzo} />
          <path d="M 520 530 C 552 552 572 580 572 612 L 592 830 L 540 830 Z" fill={C.buzoSombra} opacity={0.55} />
          <path d="M 250 560 C 262 540 285 528 305 522 L 300 600 Z" fill={C.buzoLuz} opacity={0.35} />
          <path d="M 312 700 L 488 700 L 508 830 L 292 830 Z" fill={C.buzoSombra} opacity={0.6} />
          <path d="M 310 506 C 330 470 470 470 490 506 C 462 538 338 538 310 506 Z" fill={C.buzoSombra} />
          <rect x={366} y={372} width={68} height={150} rx={28} fill={C.pielSombra} />
          <path d="M 372 520 C 380 540 420 540 428 520" stroke={C.buzoSombra} strokeWidth={10} fill="none" />
          <path d="M 376 528 L 370 612" stroke={C.cordon} strokeWidth={7} strokeLinecap="round" />
          <path d="M 424 528 L 430 612" stroke={C.cordon} strokeWidth={7} strokeLinecap="round" />
          <circle cx={370} cy={618} r={7} fill={C.cordon} />
          <circle cx={430} cy={618} r={7} fill={C.cordon} />
          {/* Hoja del logo en el pecho */}
          <g transform="translate(498 600) rotate(-25)">
            <path d="M 0 -22 C 18 -12 18 12 0 22 C -18 12 -18 -12 0 -22 Z" fill={C.hoja} />
            <path d="M 0 -16 L 0 18" stroke={C.buzoSombra} strokeWidth={3} strokeLinecap="round" />
          </g>
        </g>

        {/* Brazos (delante del torso, detrás de la cabeza) */}
        <g transform={`translate(0 ${hombros})`}>
          <BrazoSVG x={258} y={546} brazo={izq} lado={1} extraCodo={0} />
          <BrazoSVG x={542} y={546} brazo={der} lado={-1} extraCodo={ondeo} />
        </g>

        {/* Cabeza */}
        <g transform={`translate(0 ${26 + hombros * 0.6 + respira * 1.5}) rotate(${inclinacion} 400 440) translate(400 300) scale(1.07) translate(-400 -300)`}>
          {/* Pelo de atrás */}
          <g fill={C.pelo}>
            <circle cx={300} cy={196} r={72} />
            <circle cx={352} cy={150} r={72} />
            <circle cx={424} cy={142} r={74} />
            <circle cx={486} cy={172} r={72} />
            <circle cx={526} cy={236} r={60} />
            <circle cx={278} cy={248} r={58} />
            <circle cx={536} cy={300} r={44} />
            <circle cx={266} cy={306} r={42} />
          </g>
          {/* Orejas */}
          <circle cx={284} cy={292} r={26} fill={C.piel} />
          <circle cx={516} cy={292} r={26} fill={C.piel} />
          <circle cx={286} cy={294} r={12} fill={C.pielSombra} />
          <circle cx={514} cy={294} r={12} fill={C.pielSombra} />
          {/* Cara */}
          <path d="M 284 262 C 284 182 336 146 400 146 C 464 146 516 182 516 262 C 516 350 468 408 400 408 C 332 408 284 350 284 262 Z" fill={C.piel} />
          <path d="M 470 180 C 500 205 516 235 516 262 C 516 330 488 380 446 400 C 480 360 492 300 470 180 Z" fill={C.pielSombra} opacity={0.35} />
          {/* Mejillas */}
          <ellipse cx={318} cy={340} rx={24} ry={13} fill={C.mejilla} opacity={0.45} />
          <ellipse cx={482} cy={340} rx={24} ry={13} fill={C.mejilla} opacity={0.45} />
          {/* Nariz */}
          <path d="M 402 300 Q 390 326 404 330" stroke={C.pielSombra} strokeWidth={6} strokeLinecap="round" fill="none" />
          {/* Ojos */}
          {[350, 450].map((cx) => (
            <g key={cx} transform={`translate(${cx} 290) scale(1 ${parpadeo * ex.ojos}) translate(${-cx} -290)`}>
              <ellipse cx={cx} cy={290} rx={27} ry={31} fill="#FFFFFF" />
              <circle cx={cx + mx} cy={292 + my} r={16} fill={C.iris} />
              <circle cx={cx + mx} cy={292 + my} r={8} fill="#0E0A08" />
              <circle cx={cx + mx + 6} cy={285 + my} r={5} fill="#FFFFFF" />
            </g>
          ))}
          {/* Anteojos */}
          <g fill="rgba(255,255,255,0.07)" stroke={C.marco} strokeWidth={9}>
            <circle cx={350} cy={290} r={44} />
            <circle cx={450} cy={290} r={44} />
          </g>
          <path d="M 394 284 Q 400 276 406 284" stroke={C.marco} strokeWidth={8} fill="none" />
          <path d="M 306 282 L 286 276" stroke={C.marco} strokeWidth={8} strokeLinecap="round" />
          <path d="M 494 282 L 514 276" stroke={C.marco} strokeWidth={8} strokeLinecap="round" />
          <path d="M 322 266 Q 330 256 342 254" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.55} fill="none" />
          <path d="M 422 266 Q 430 256 442 254" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.55} fill="none" />
          {/* Cejas */}
          <g transform={`translate(0 ${ex.cejaIzq.y}) rotate(${ex.cejaIzq.rot} 350 232)`}>
            <rect x={322} y={226} width={56} height={13} rx={6.5} fill={C.pelo} />
          </g>
          <g transform={`translate(0 ${ex.cejaDer.y}) rotate(${ex.cejaDer.rot} 450 232)`}>
            <rect x={422} y={226} width={56} height={13} rx={6.5} fill={C.pelo} />
          </g>
          {/* Boca */}
          {expresion === "sorprendida" ? (
            <g>
              <ellipse cx={400} cy={by + 8} rx={15 + apertura * 4} ry={14 + apertura * 10} fill={C.boca} />
              <ellipse cx={400} cy={by + 14 + apertura * 5} rx={9} ry={5 + apertura * 3} fill={C.lengua} />
            </g>
          ) : cerrada && curva < 0 ? (
            <path d={`M ${400 - w} ${by + 6} Q 400 ${by + curva} ${400 + w} ${by + 6}`} stroke={C.boca} strokeWidth={8} strokeLinecap="round" fill="none" />
          ) : cerrada ? (
            <path d={`M ${400 - w} ${by} Q 400 ${by + curva} ${400 + w} ${by}`} stroke={C.boca} strokeWidth={8} strokeLinecap="round" fill="none" />
          ) : (
            <g>
              <path d={`${sup} ${inf} Z`} fill={C.boca} stroke={C.boca} strokeWidth={4} strokeLinejoin="round" />
              <ellipse cx={400} cy={by + (curva + apertura * 44) * 0.42} rx={w * 0.45} ry={6 + apertura * 7} fill={C.lengua} opacity={apertura > 0.35 ? 1 : 0} />
              <path d={`M ${400 - w * 0.7} ${by + 3} Q 400 ${by + 3 + curva * 0.2} ${400 + w * 0.7} ${by + 3}`} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" fill="none" opacity={apertura > 0.25 ? 0.9 : 0} />
            </g>
          )}
          {/* Pelo de adelante (flequillo de rulos) */}
          <g fill={C.pelo}>
            <circle cx={332} cy={186} r={40} />
            <circle cx={378} cy={168} r={42} />
            <circle cx={426} cy={166} r={42} />
            <circle cx={470} cy={186} r={40} />
            <circle cx={302} cy={222} r={28} />
            <circle cx={498} cy={222} r={28} />
          </g>
          <g stroke={C.peloBrillo} strokeWidth={6} strokeLinecap="round" fill="none">
            <path d="M 360 150 Q 378 140 396 150" />
            <path d="M 420 146 Q 436 138 452 150" />
            <path d="M 312 176 Q 322 166 336 168" />
          </g>
        </g>

      </g>
    </svg>
  );
};
