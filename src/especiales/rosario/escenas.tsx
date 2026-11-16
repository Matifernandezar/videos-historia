// Escenas del Short "El rosario de tu abuela y la batalla de Lepanto" (Versículo Oculto).
// Reutiliza personajes, escenarios y cámara de los videos anteriores (continuidad del canal).
import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from "remotion";
import { useEscena } from "../../video/contexto";
import type { EscenaAnimada } from "../../video/tipos";
import { FUENTE_SERIFA, FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { Sfx, useMomento } from "../comun";
import { Persona, paletaDe, type Brazo } from "../jesus-12-30/personas";
import { Camara, CLAMP, Colinas, lerp, PAL, Referencia, Textura } from "../jesus-12-30/escenarios";
import { Cierre as CierreCanal, Fig, manoDe, osc } from "../jesus-12-30/escenas";
import { Iglesia, mezclarBrazo } from "../amen/escenas";

type PropsEscena = { escena: EscenaAnimada };

// ---------- piezas ----------

// Rosario: cuentas a lo largo de una curva (puntos), con cruz al final.
// `iluminadas`: cuántas cuentas (desde `desde`) brillan en dorado; `progreso` 0..1 dibuja el collar.
export type Punto = [number, number];
const puntoEn = (pts: Punto[], t: number): Punto => {
  const n = pts.length - 1;
  const x = Math.max(0, Math.min(0.9999, t)) * n;
  const i = Math.floor(x);
  const u = x - i;
  return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u];
};
export const Rosario: React.FC<{ pts: Punto[]; cuentas: number; r?: number; progreso?: number; iluminadas?: number; desde?: number; cruz?: boolean; color?: string }> = ({
  pts,
  cuentas,
  r = 14,
  progreso = 1,
  iluminadas = 0,
  desde = 0,
  cruz = true,
  color = "#7A2E3A",
}) => {
  const visibles = Math.floor(cuentas * progreso);
  const ultimo = puntoEn(pts, 1);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="#B9A07A" strokeWidth={r * 0.18} opacity={progreso > 0 ? 0.9 : 0} />
      {Array.from({ length: visibles }, (_, i) => {
        const [x, y] = puntoEn(pts, i / Math.max(1, cuentas - 1));
        const brilla = i >= desde && i < desde + iluminadas;
        return (
          <g key={i}>
            {brilla ? <circle cx={x} cy={y} r={r * 2.1} fill="rgba(242,193,78,0.35)" /> : null}
            <circle cx={x} cy={y} r={r} fill={brilla ? PAL.dorado : color} />
            <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.32} fill="#FFFFFF" opacity={0.55} />
          </g>
        );
      })}
      {cruz && progreso >= 1 ? (
        <g transform={`translate(${ultimo[0]} ${ultimo[1] + r})`}>
          <rect x={-r * 0.35} y={0} width={r * 0.7} height={r * 4.2} rx={r * 0.2} fill={PAL.doradoOscuro} />
          <rect x={-r * 1.3} y={r * 1.0} width={r * 2.6} height={r * 0.7} rx={r * 0.2} fill={PAL.doradoOscuro} />
        </g>
      ) : null}
    </svg>
  );
};

// Rosario colgando de un punto (mano): lazo de cuentas que se balancea.
export const RosarioColgante: React.FC<{ x: number; y: number; escala?: number; balanceo?: number }> = ({ x, y, escala = 1, balanceo = 0 }) => {
  const pts: Punto[] = [];
  for (let i = 0; i <= 20; i++) {
    const a = (i / 20) * Math.PI * 2;
    pts.push([x + Math.sin(a) * 70 * escala + balanceo * Math.sin(a / 2) * 10, y + (1 - Math.cos(a)) * 90 * escala]);
  }
  return (
    <>
      <Rosario pts={pts} cuentas={22} r={9 * escala} cruz={false} />
      <Rosario pts={[[x + balanceo * 6, y + 180 * escala], [x + balanceo * 9, y + 240 * escala]]} cuentas={3} r={9 * escala} />
    </>
  );
};

const Caramelo: React.FC<{ color?: string }> = ({ color = "#D9654B" }) => (
  <svg width={120} height={60} style={{ overflow: "visible" }}>
    <path d="M 0 10 L 30 30 L 0 50 Z" fill={color} opacity={0.85} />
    <path d="M 120 10 L 90 30 L 120 50 Z" fill={color} opacity={0.85} />
    <ellipse cx={60} cy={30} rx={34} ry={24} fill={color} />
    <path d="M 40 22 Q 60 12 80 22" stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={0.7} />
  </svg>
);

const Panuelitos: React.FC = () => (
  <svg width={170} height={110} style={{ overflow: "visible" }}>
    <path d="M 60 20 Q 85 -20 110 20 Z" fill="#FFFFFF" />
    <rect x={0} y={20} width={170} height={90} rx={14} fill="#7FB3D9" />
    <rect x={55} y={14} width={60} height={14} rx={7} fill="#5A8AB2" />
    <path d="M 20 70 Q 85 50 150 70" stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={0.7} />
  </svg>
);

// Bolso abierto en dos capas: `atras` (manija e interior oscuro) y frente (la mano queda entre ambas).
const Bolso: React.FC<{ ancho?: number; atras?: boolean }> = ({ ancho = 520, atras = false }) => (
  <svg width={ancho} height={ancho * 0.62} viewBox="0 0 520 320" style={{ overflow: "visible" }}>
    {atras ? (
      <>
        <path d="M 120 60 Q 260 -110 400 60" stroke="#5A3A22" strokeWidth={22} fill="none" />
        <path d="M 30 40 L 490 40 L 500 90 L 20 90 Z" fill="#3A2416" />
      </>
    ) : (
      <>
        <path d="M 20 80 L 500 80 L 470 320 L 50 320 Z" fill="#7A4E2E" />
        <path d="M 20 80 L 500 80 L 494 120 L 26 120 Z" fill="#8E5E38" />
        <rect x={238} y={100} width={44} height={30} rx={6} fill={PAL.doradoOscuro} />
        <path d="M 70 300 Q 260 280 450 300" stroke="#5A3A22" strokeWidth={4} fill="none" strokeDasharray="10 8" />
      </>
    )}
  </svg>
);

// Galera (vista lateral): casco, remos que bogan, vela latina y bandera.
const Galera: React.FC<{ x: number; y: number; escala?: number; espejo?: boolean; bando: "cristiana" | "otomana"; fase?: number }> = ({ x, y, escala = 1, espejo = false, bando, fase = 0 }) => {
  const f = useCurrentFrame();
  const remo = Math.sin(f / 9 + fase) * 16;
  const casco = bando === "cristiana" ? "#5A3A22" : "#4A2E2A";
  const vela = bando === "cristiana" ? "#EFE6D2" : "#E7D2B0";
  const bandera = bando === "cristiana" ? "#F7F4EE" : "#B0281E";
  const balanceo = Math.sin(f / 30 + fase) * 1.5;
  return (
    <svg style={{ position: "absolute", left: x - 260 * escala, top: y - 300 * escala, overflow: "visible" }} width={520 * escala} height={360 * escala} viewBox="-260 -300 520 360">
      <g transform={`${espejo ? "scale(-1 1) " : ""}rotate(${balanceo})`}>
        {/* remos */}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={-170 + i * 30} y1={8} x2={-170 + i * 30 - 26 + remo} y2={70} stroke="#3A2618" strokeWidth={5} />
        ))}
        {/* casco */}
        <path d="M -240 -10 L 220 -10 L 260 -40 L 230 20 Q 0 40 -200 20 Z" fill={casco} />
        <rect x={-210} y={-26} width={420} height={18} fill={PAL.doradoOscuro} opacity={0.8} />
        {/* mástil y vela latina */}
        <rect x={-6} y={-270} width={12} height={262} fill="#3A2618" />
        <path d="M -150 -40 L 120 -260 Q 40 -120 -150 -40 Z" fill={vela} />
        <line x1={-160} y1={-34} x2={130} y2={-268} stroke="#3A2618" strokeWidth={6} />
        {/* bandera */}
        <path d={`M 6 -270 L 70 ${-262 + Math.sin(f / 6 + fase) * 6} L 6 -246 Z`} fill={bandera} />
        {bando === "cristiana" ? <path d="M 22 -264 L 22 -250 M 16 -258 L 30 -258" stroke="#B0281E" strokeWidth={4} /> : <circle cx={30} cy={-258} r={6} fill="#F7F4EE" />}
      </g>
    </svg>
  );
};

const Mar: React.FC<{ y?: number }> = ({ y = 1150 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: -1500, top: -1200, width: 5000, height: y + 1200, background: "linear-gradient(180deg,#24395F 0%,#6E87A8 60%,#C9B48A 100%)" }} />
      <div style={{ position: "absolute", left: -1500, top: y, width: 5000, height: 1800, background: "linear-gradient(180deg,#2C4C72,#1B3354)" }} />
      <svg style={{ position: "absolute", left: -1500, top: y, overflow: "visible" }} width={5000} height={600}>
        {Array.from({ length: 6 }, (_, r) => (
          <path
            key={r}
            d={`M 0 ${30 + r * 90} ${Array.from({ length: 50 }, (_, i) => `q 50 ${i % 2 ? 10 : -10} 100 0`).join(" ")}`}
            transform={`translate(${((f * (1.2 + r * 0.3)) % 200) - 200} 0)`}
            stroke="#8EA9C8"
            strokeWidth={4}
            fill="none"
            opacity={0.35 - r * 0.04}
          />
        ))}
      </svg>
    </>
  );
};

// Imagen de la Virgen del Rosario (cuadro pintado con marco dorado; no es una aparición).
const VirgenRosario: React.FC<{ ancho?: number; brillo?: number }> = ({ ancho = 320, brillo = 0 }) => {
  const alto = ancho * 1.5;
  return (
    <div style={{ position: "relative", width: ancho, height: alto }}>
      <div style={{ position: "absolute", inset: -ancho * 0.25, borderRadius: "50%", background: `radial-gradient(circle, rgba(242,193,78,${0.45 * brillo}), rgba(242,193,78,0) 70%)` }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: `${ancho / 2}px ${ancho / 2}px 12px 12px`, border: `${ancho * 0.04}px solid ${PAL.dorado}`, overflow: "hidden", background: "linear-gradient(180deg,#24395F,#4D6A8E)", boxShadow: "0 16px 40px rgba(0,0,0,0.45)" }}>
        <div style={{ position: "absolute", left: ancho / 2, top: ancho * 0.18 }}>
          <Persona quien="maria" ancho={ancho * 0.95} ojos={0.6} boca={{ curva: 8 }} brazoIzq={{ hombro: 10, codo: -110, mano: "abierta" }} brazoDer={{ hombro: 10, codo: -110, mano: "abierta" }} semilla={6} />
        </div>
        {/* corona y rosario */}
        <svg style={{ position: "absolute", left: ancho / 2 - ancho * 0.16, top: ancho * 0.1 }} width={ancho * 0.32} height={ancho * 0.14} viewBox="0 0 100 44">
          <path d="M 0 44 L 6 10 L 26 28 L 50 0 L 74 28 L 94 10 L 100 44 Z" fill={PAL.dorado} />
        </svg>
        <Rosario pts={[[ancho * 0.5, ancho * 0.92], [ancho * 0.42, ancho * 1.12], [ancho * 0.5, ancho * 1.25], [ancho * 0.58, ancho * 1.12], [ancho * 0.5, ancho * 0.92]]} cuentas={14} r={ancho * 0.018} cruz={false} />
      </div>
    </div>
  );
};

// Retrato enmarcado (papas).
const Retrato: React.FC<{ children: React.ReactNode; ancho?: number; rotulo?: string }> = ({ children, ancho = 300, rotulo }) => (
  <div style={{ position: "relative", width: ancho, height: ancho * 1.25 }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 14, border: `${ancho * 0.04}px solid ${PAL.doradoOscuro}`, overflow: "hidden", background: "linear-gradient(180deg,#5A3A2E,#2A1E1A)", boxShadow: "0 14px 36px rgba(0,0,0,0.45)" }}>{children}</div>
    {rotulo ? (
      <div style={{ position: "absolute", left: 0, right: 0, top: ancho * 1.25 + 14, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: ancho * 0.14, color: PAL.crema, textShadow: "0 4px 12px rgba(0,0,0,0.6)" }}>{rotulo}</div>
    ) : null}
  </div>
);

// Mano de perfil (primer plano) que sostiene una cuenta entre el pulgar y el índice.
// (x, y) = posición de la cuenta. La mano viene desde abajo a la derecha, con la manga del saco.
const ManoCuenta: React.FC<{ x: number; y: number; empuje?: number; escala?: number }> = ({ x, y, empuje = 0, escala = 1 }) => {
  const c = paletaDe("abuela");
  return (
    <svg style={{ position: "absolute", left: x - 60 * escala, top: y - 40 * escala, overflow: "visible" }} width={10} height={10}>
      <g transform={`scale(${escala}) translate(60 40)`}>
        {/* manga */}
        <path d="M 120 210 L 250 330 L 330 250 L 190 150 Z" fill={c.tunica} />
        <path d="M 120 210 L 190 150 L 205 162 L 134 224 Z" fill={c.tunicaSombra} />
        {/* palma y dedos doblados */}
        <path d="M 40 70 Q 10 120 50 175 Q 100 225 160 195 Q 200 165 185 120 Q 160 60 100 50 Z" fill={c.piel} />
        <path d="M 60 150 Q 90 170 130 160 M 70 175 Q 100 192 140 182" stroke={c.pielSombra} strokeWidth={5} fill="none" />
        {/* índice debajo de la cuenta */}
        <path d={`M 50 80 Q 10 ${40 - 6 * empuje} -14 ${20 - 6 * empuje}`} stroke={c.piel} strokeWidth={30} strokeLinecap="round" fill="none" />
        {/* pulgar sobre la cuenta */}
        <path d={`M 110 60 Q 60 ${-10 + 8 * empuje} 6 ${-22 + 10 * empuje}`} stroke={c.piel} strokeWidth={30} strokeLinecap="round" fill="none" />
        <ellipse cx={8} cy={-20 + 10 * empuje} rx={11} ry={8} fill="#F0D9C8" />
      </g>
    </svg>
  );
};

// Las dos flotas en formación (de atrás hacia adelante, sin superponerse entre bandos).
// `acercan` 0..1 las acerca al centro. Se usa igual al final de la escena 1 y en la escena 2:
// misma toma de cámara, así el paso entre escenas es continuo.
const FLOTA: { x: number; y: number; e: number; t: number }[] = [
  { x: 140, y: 960, e: 0.5, t: 50 },
  { x: 330, y: 975, e: 0.52, t: 50 },
  { x: 190, y: 1130, e: 0.72, t: 60 },
  { x: 215, y: 1390, e: 0.98, t: 55 },
];
const TOMA_FLOTAS = { x: 540, y: 1080, z: 1.0 };
// x de cada galera según el avance (t = recorrido máximo; ninguna cruza el centro)
const xFlota = (b: { x: number; t: number }, acercan: number, lado: 0 | 1) => (lado === 0 ? b.x + acercan * b.t : 1080 - b.x - acercan * b.t);
const Flotas: React.FC<{ acercan: number; humo?: (i: number) => number }> = ({ acercan, humo }) => (
  <>
    <Mar y={860} />
    {FLOTA.map((b, i) => (
      <React.Fragment key={i}>
        <Galera x={xFlota(b, acercan, 0)} y={b.y} escala={b.e} bando="cristiana" fase={i * 0.7} />
        <Galera x={xFlota(b, acercan, 1)} y={b.y + 14} escala={b.e} espejo bando="otomana" fase={i * 0.7 + 0.4} />
        {humo
          ? ([0, 1] as const).map((lado) => {
              const h = humo(i * 2 + lado);
              if (h <= 0) return null;
              const x = xFlota(b, acercan, lado) + (lado === 0 ? 1 : -1) * 200 * b.e;
              const w = 360 * b.e;
              return (
                <div key={lado} style={{ position: "absolute", left: x - w / 2, top: b.y - 150 * b.e, width: w, height: w * 0.62, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(226,219,206,0.95) 0%, rgba(196,188,174,0.65) 45%, rgba(196,188,174,0) 72%)", opacity: h, scale: String(1 + 1.2 * (1 - h)), translate: `${(lado === 0 ? 1 : -1) * (1 - h) * 50}px ${-(1 - h) * 50}px` }} />
              );
            })
          : null}
      </React.Fragment>
    ))}
  </>
);

// ---------- 1. EL BOLSO Y LOS BARCOS ----------
const ABU = { x: 540, suelo: 1500, ancho: 560 };
const BOLSO = { x: 290, y: 1166, ancho: 480 }; // borde superior del frente del bolso ≈ y 1240, centrado en la mano
const Bolso1: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fCaramelos = useMomento("caramelos", 0.3);
  const fPanuelitos = useMomento("panuelitos", 0.45);
  const fTambien = useMomento("tambien", 0.55);
  const fBarcos = useMomento("barcos", 0.82);
  const fCanones = useMomento("canones", 0.92);
  // tres "sacadas": cada una sube la mano desde el bolso con un objeto
  const sube = (a: number) => lerp(f, a - 8, a + 2, 0, 1, Easing.out(Easing.cubic)) * (1 - lerp(f, a + 10, a + 18, 0, 1));
  const tira = (a: number) => lerp(f, a + 6, a + 22, 0, 1, Easing.out(Easing.quad));
  const s1 = sube(fCaramelos);
  const s2 = sube(fPanuelitos);
  const s3 = lerp(f, fTambien - 8, fTambien + 6, 0, 1, Easing.out(Easing.cubic));
  const revuelve = f < fCaramelos - 8 ? osc(f, 9) * 0.35 : 0;
  const alto = Math.max(s1, s2, s3, revuelve);
  const dentro: Brazo = { hombro: 4, codo: -60, mano: "puno" }; // mano ≈ (533, 1261): dentro del bolso
  const arriba: Brazo = { hombro: 20, codo: -120, mano: "puno" }; // mano ≈ (547, 1128): a la altura del pecho
  const bDer = mezclarBrazo(dentro, arriba, alto);
  const mano = manoDe(ABU.x, ABU.suelo, ABU.ancho, bDer, 1, false, true);
  // objetos: viajan con la mano y después se dejan a un costado
  const objeto = (a: number, s: number, destino: Punto): Punto => {
    const t = tira(a);
    if (t <= 0) return [mano.x - 40, mano.y - 20 - 10 * s];
    return [mano.x - 40 + (destino[0] - mano.x + 40) * t, mano.y - 20 + (destino[1] - mano.y + 20) * t - Math.sin(Math.PI * t) * 50];
  };
  const caramelo = objeto(fCaramelos, s1, [80, 1250]);
  const panuelos = objeto(fPanuelitos, s2, [990, 1330]);
  const encontro = lerp(f, fTambien - 2, fTambien + 8, 0, 1);
  // una cuenta ocupa el encuadre y se vuelve bala de cañón
  const bala = lerp(f, fCanones - 2, fCanones + 10, 0, 1);
  const abreMar = lerp(f, fCanones + 6, duracion, 0, 1);
  const cuentaPos: Punto = [mano.x + 10, mano.y + 170];
  return (
    <AbsoluteFill style={{ background: PAL.noche }}>
      <AbsoluteFill style={{ opacity: 1 - bala }}>
        <Camara tomas={[{ f: 0, x: 540, y: 1000, z: 1.3 }, { f: fTambien, x: 540, y: 1020, z: 1.38 }, { f: fBarcos - 6, x: cuentaPos[0] - 60, y: cuentaPos[1] - 120, z: 1.6 }, { f: fCanones + 4, x: cuentaPos[0], y: cuentaPos[1], z: 9 }]}>
          {/* living con luz de tarde */}
          <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 3800, background: "linear-gradient(180deg,#3A2E46 0%,#5C4A44 60%,#4A3826 100%)" }} />
          <div style={{ position: "absolute", left: 660, top: 330, width: 300, height: 380, borderRadius: 12, background: "linear-gradient(160deg,#F2D49A,#C9A26A)", opacity: 0.55 }} />
          <div style={{ position: "absolute", left: 806, top: 330, width: 10, height: 380, background: "#5E452E", opacity: 0.6 }} />
          <div style={{ position: "absolute", left: 40, top: 1050, width: 1000, height: 560, borderRadius: 40, background: "#6E3C4A" }} />
          <div style={{ position: "absolute", left: BOLSO.x, top: BOLSO.y }}>
            <Bolso ancho={BOLSO.ancho} atras />
          </div>
          <Fig
            quien="abuela"
            sentado
            x={ABU.x}
            suelo={ABU.suelo}
            ancho={ABU.ancho}
            mirada={encontro > 0.5 ? [6, 2] : [-2, 10]}
            cabeza={encontro > 0.5 ? 2 : 6 + Math.sin(f / 9) * 2}
            cejas={{ y: encontro > 0.5 ? -4 : -2, rot: encontro > 0.5 ? 0 : 6 }}
            boca={{ curva: encontro > 0.5 ? 11 : 2 + 4 * Math.max(s1, s2) }}
            giro={encontro * 0.25}
            brazoIzq={{ hombro: 16, codo: -45, mano: "abierta" }}
            brazoDer={bDer}
            semilla={2}
          />
          {/* objetos */}
          {f >= fCaramelos - 8 ? (
            <div style={{ position: "absolute", left: caramelo[0] - 50, top: caramelo[1] - 25, rotate: `${-260 * tira(fCaramelos)}deg`, scale: "0.8" }}>
              <Caramelo />
            </div>
          ) : null}
          {f >= fPanuelitos - 8 ? (
            <div style={{ position: "absolute", left: panuelos[0] - 70, top: panuelos[1] - 45, rotate: `${180 * tira(fPanuelitos)}deg`, scale: "0.75" }}>
              <Panuelitos />
            </div>
          ) : null}
          {/* frente del bolso: tapa la mano cuando está adentro */}
          <div style={{ position: "absolute", left: BOLSO.x, top: BOLSO.y }}>
            <Bolso ancho={BOLSO.ancho} />
          </div>
          {/* el rosario sale en la mano y queda colgando */}
          {f >= fTambien - 8 ? <RosarioColgante x={mano.x + 6} y={mano.y - 4} escala={0.95} balanceo={Math.sin(f / 8)} /> : null}
        </Camara>
      </AbsoluteFill>
      {/* bala de cañón → se abre el plano sobre las flotas (misma toma que la escena siguiente) */}
      {bala > 0 ? (
        <AbsoluteFill style={{ opacity: bala }}>
          <Camara tomas={[{ f: fCanones, x: 560, y: 1040, z: 3.0 }, { f: duracion, ...TOMA_FLOTAS }]} vaiven={0}>
            <Flotas acercan={0} />
            <div style={{ position: "absolute", left: 560 - 60 - abreMar * 160, top: 1040 - 60 - abreMar * 260, width: 120, height: 120, borderRadius: 60, background: "radial-gradient(circle at 35% 35%, #6A6A70, #1E1E22)", opacity: 1 - abreMar, scale: String(1 - 0.6 * abreMar) }} />
          </Camara>
        </AbsoluteFill>
      ) : null}
      <Textura />
      {[0, 1, 2].map((i) => (
        <Sfx key={i} archivo="tela" en={4 + i * 14} volumen={0.22} />
      ))}
      <Sfx archivo="marca" en={fCaramelos - 6} volumen={0.3} />
      <Sfx archivo="tela" en={fPanuelitos - 6} volumen={0.35} />
      <Sfx archivo="cuenta" en={fTambien - 6} volumen={0.3} />
      <Sfx archivo="cuenta" en={fTambien - 2} volumen={0.25} />
      <Sfx archivo="whoosh" en={fBarcos} volumen={0.2} />
      <Sfx archivo="canon" en={fCanones + 2} volumen={0.22} />
      <Sfx archivo="mar" en={fCanones} volumen={0.2} />
    </AbsoluteFill>
  );
};

// ---------- 2. LEPANTO Y LA PETICIÓN DEL PAPA ----------
const Lepanto: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fSiete = useMomento("siete", 0.05);
  const fLepanto = useMomento("lepanto", 0.4);
  const fPio = useMomento("pio", 0.48);
  const fRezarlo = useMomento("rezarlo", 0.58);
  const fAtribuyo = useMomento("atribuyo", 0.65);
  const fMaria = useMomento("maria", 0.95);
  const acercan = lerp(f, 0, fLepanto + 10, 0, 1, Easing.linear);
  const enRoma = lerp(f, fPio - 6, fPio + 6, 0, 1);
  const conecta = lerp(f, fAtribuyo, fMaria + 6, 0, 1);
  const humo = (a: number) => (f > a ? Math.max(0, 1 - (f - a) / 30) : 0);
  return (
    <AbsoluteFill>
      {/* las dos flotas se aproximan (vista amplia, continúa la toma de la escena anterior) */}
      <AbsoluteFill style={{ opacity: 1 - enRoma }}>
        <Camara tomas={[{ f: 0, ...TOMA_FLOTAS }, { f: fLepanto, x: 540, y: 1100, z: 1.04 }, { f: fPio, x: 540, y: 1110, z: 1.08 }]} vaiven={0.5}>
          <Flotas acercan={acercan} humo={(i) => humo(fLepanto - 20 + (i % 4) * 9) + humo(fLepanto + 16 + ((i + 2) % 4) * 8)} />
        </Camara>
      </AbsoluteFill>
      {/* Roma: Pío V pide rezar el rosario; el pueblo reza; imagen mariana */}
      {enRoma > 0 ? (
        <AbsoluteFill style={{ opacity: enRoma }}>
          <Camara tomas={[{ f: fPio, x: 400, y: 960, z: 1.2 }, { f: fAtribuyo, x: 540, y: 960, z: 1.0 }, { f: duracion, x: 560, y: 900, z: 1.05 }]}>
            <Iglesia />
            <Fig quien="pio5" x={260} suelo={1460} ancho={380} giro={0.5} mirada={[8, -2]} brazoDer={f < fRezarlo + 10 ? { hombro: 45 + 10 * osc(f, 28), codo: 85, mano: "abierta" } : { hombro: 10, codo: -110, mano: "abierta" }} brazoIzq={{ hombro: 10, codo: f < fRezarlo + 10 ? -30 : -110, mano: "abierta" }} ojos={f > fAtribuyo ? 0.5 : 1} semilla={2} />
            {[
              { q: "oyente1" as const, x: 640, s: 1500, a: 280 },
              { q: "vecina" as const, x: 820, s: 1490, a: 270 },
              { q: "oyente2" as const, x: 980, s: 1510, a: 280 },
            ].map((o, i) => {
              const rezar = lerp(f, fRezarlo + i * 4, fRezarlo + 10 + i * 4, 0, 1);
              const b = mezclarBrazo({ hombro: 8, codo: -15 }, { hombro: 10, codo: -110, mano: "abierta" }, rezar);
              const m = manoDe(o.x, o.s, o.a, b, 1);
              return (
                <React.Fragment key={i}>
                  <Fig quien={o.q} x={o.x} suelo={o.s} ancho={o.a} giro={-0.4} mirada={[-6, -2]} ojos={rezar > 0.5 ? 0.3 : 1} brazoIzq={b} brazoDer={b} semilla={i + 4} />
                  {rezar > 0.5 ? <Rosario pts={[[m.x - 10, m.y], [m.x - 14, m.y + 40], [m.x - 6, m.y + 70]]} cuentas={6} r={6} /> : null}
                </React.Fragment>
              );
            })}
            {/* imagen mariana y líneas de luz que unen papa, oración e imagen */}
            <div style={{ position: "absolute", left: 540 - 140, top: 420, opacity: lerp(f, fAtribuyo - 4, fAtribuyo + 8, 0, 1) }}>
              <VirgenRosario ancho={280} brillo={conecta} />
            </div>
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
              {[
                [260, 980],
                [820, 1040],
              ].map(([x, y], i) => (
                <line key={i} x1={x} y1={y} x2={540 + (x - 540) * (1 - conecta)} y2={y + (760 - y) * conecta} stroke={PAL.dorado} strokeWidth={6} strokeLinecap="round" opacity={0.8 * Math.min(1, conecta * 3)} />
              ))}
            </svg>
          </Camara>
        </AbsoluteFill>
      ) : null}
      {/* Lepanto · 7 de octubre de 1571 */}
      <div style={{ position: "absolute", left: 540, top: 330, translate: "-50% -50%", opacity: lerp(f, fSiete, fSiete + 10, 0, 1) * (1 - lerp(f, fPio - 8, fPio, 0, 1)), padding: "16px 34px", borderRadius: 20, background: "rgba(234,217,181,0.95)", color: PAL.tinta, fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: 52, whiteSpace: "nowrap", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
        Lepanto · 7 de octubre de 1571
      </div>
      <Referencia texto="Pío V" aparece={fPio + 2} hasta={fAtribuyo - 4} />
      <Textura />
      <Sfx archivo="mar" en={0} volumen={0.22} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Sfx key={i} archivo="remo" en={10 + i * 28} volumen={0.14} />
      ))}
      <Sfx archivo="canon" en={fLepanto - 20} volumen={0.16} />
      <Sfx archivo="whoosh" en={fPio - 6} volumen={0.18} />
      <Sfx archivo="brillo" en={fAtribuyo} volumen={0.15} />
    </AbsoluteFill>
  );
};

// ---------- 3. OCTUBRE Y EL ROSARIO ----------
// Calendario ilustrativo (grilla de 31 días, sin días de la semana). `anio` en el encabezado.
const Calendario: React.FC<{ anio: string; marcar?: number; cuentas?: number }> = ({ anio, marcar = 0, cuentas = 0 }) => {
  const celda = 112;
  return (
    <div style={{ position: "relative", width: 7 * celda + 40, height: 760, borderRadius: 18, background: "linear-gradient(180deg,#F3E6C6,#E2CD9E)", boxShadow: "0 18px 50px rgba(0,0,0,0.45)" }}>
      <div style={{ height: 130, borderRadius: "18px 18px 0 0", background: "#8A2E2A", display: "flex", alignItems: "baseline", justifyContent: "center", gap: 22, paddingTop: 22, boxSizing: "border-box" }}>
        <span style={{ fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 74, letterSpacing: 6, color: PAL.crema }}>OCTUBRE</span>
        <span style={{ fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: 58, color: PAL.dorado }}>{anio}</span>
      </div>
      {Array.from({ length: 31 }, (_, i) => {
        const col = i % 7;
        const fila = Math.floor(i / 7);
        const esSiete = i === 6;
        const conCuenta = i < cuentas;
        return (
          <div key={i} style={{ position: "absolute", left: 20 + col * celda, top: 150 + fila * celda, width: celda - 8, height: celda - 8, borderRadius: 10, background: "rgba(255,255,255,0.4)", padding: 8, boxSizing: "border-box", fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 32, color: PAL.tinta }}>
            {i + 1}
            {esSiete && marcar > 0 ? <div style={{ position: "absolute", inset: -8, borderRadius: 60, border: `8px solid ${PAL.doradoOscuro}`, scale: String(0.6 + 0.4 * marcar), opacity: marcar }} /> : null}
            {conCuenta ? <div style={{ position: "absolute", right: 14, bottom: 14, width: 30, height: 30, borderRadius: 15, background: PAL.dorado, boxShadow: "0 0 14px rgba(242,193,78,0.8)" }} /> : null}
          </div>
        );
      })}
    </div>
  );
};

const Octubre: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fVinculada = useMomento("vinculada", 0.2);
  const fRosario = useMomento("rosario", 0.4);
  const fTarde = useMomento("tarde", 0.55);
  const fLeon = useMomento("leon", 0.62);
  const fOctubre = useMomento("octubre", 0.9);
  const marca = lerp(f, fVinculada - 4, fVinculada + 8, 0, 1);
  const virgen = lerp(f, fRosario - 8, fRosario + 4, 0, 1);
  // "Más tarde": varias hojas pasan rápido (el tiempo avanza de 1571 a 1883)
  const hojas = lerp(f, fTarde - 4, fLeon + 2, 0, 1, Easing.inOut(Easing.quad));
  const nHoja = Math.floor(hojas * 6);
  const faseHoja = (hojas * 6) % 1;
  const leon = lerp(f, fLeon - 2, fLeon + 10, 0, 1, Easing.out(Easing.back(1.4)));
  const cuentas = Math.floor(lerp(f, fLeon + 12, duracion - 6, 0, 31.99, Easing.linear));
  const CAL = { x: 540 - 412 * 0.82, y: 760, e: 0.82 };
  return (
    <AbsoluteFill>
      <Camara tomas={[{ f: 0, x: 540, y: 960, z: 1.0 }, { f: duracion, x: 540, y: 980, z: 1.05 }]}>
        <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 3800, background: "radial-gradient(ellipse at 50% 45%, #2C3F66 0%, #0B1426 70%)" }} />
        {/* Virgen del Rosario (arriba a la derecha) */}
        <div style={{ position: "absolute", left: 680, top: 250, opacity: virgen, scale: String(0.85 + 0.15 * virgen), rotate: "3deg" }}>
          <VirgenRosario ancho={250} brillo={0.6} />
        </div>
        {/* León XIII (arriba a la izquierda) */}
        <div style={{ position: "absolute", left: 140, top: 250, opacity: Math.min(1, leon), scale: String(0.8 + 0.2 * leon), rotate: "-3deg" }}>
          <Retrato ancho={260}>
            <div style={{ position: "absolute", left: 130, top: 18 }}>
              <Persona quien="leon13" ancho={310} mirada={[6, 0]} giro={0.3} boca={{ curva: 6 }} semilla={3} />
            </div>
          </Retrato>
        </div>
        {/* calendario */}
        <div style={{ position: "absolute", left: CAL.x, top: CAL.y, scale: String(CAL.e), transformOrigin: "0 0" }}>
          <Calendario anio={hojas >= 1 ? "1883" : "1571"} marcar={hojas >= 1 ? 0 : marca} cuentas={cuentas} />
          {/* hojas que se arrancan y vuelan hacia arriba */}
          {hojas > 0 && hojas < 1 ? (
            <div style={{ position: "absolute", left: 0, top: 0, width: 824, height: 760, transformOrigin: "50% 0%", transform: `perspective(1600px) rotateX(${faseHoja * 100}deg) translateY(${-faseHoja * 120}px)`, opacity: 1 - faseHoja * 0.8 }}>
              <Calendario anio={String(1571 + Math.round((nHoja / 6) * 312))} marcar={nHoja === 0 ? marca : 0} />
            </div>
          ) : null}
        </div>
      </Camara>
      <div style={{ position: "absolute", left: 540, top: 690, translate: "-50% -50%", opacity: lerp(f, fOctubre - 6, fOctubre + 4, 0, 1), scale: String(0.85 + 0.15 * lerp(f, fOctubre - 6, fOctubre + 6, 0, 1, Easing.out(Easing.back(2)))), padding: "14px 36px", borderRadius: 999, background: `linear-gradient(180deg, ${PAL.dorado}, ${PAL.doradoOscuro})`, color: PAL.tinta, fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 50, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(0,0,0,0.45)" }}>
        Octubre · Mes del Rosario
      </div>
      <Referencia texto="Virgen del Rosario · 7 de octubre" aparece={fRosario} hasta={fLeon - 4} y={170} />
      <Referencia texto="León XIII · 1883" aparece={fLeon + 4} hasta={fOctubre - 8} y={170} />
      <Textura />
      <Sfx archivo="pagina" en={2} volumen={0.3} />
      <Sfx archivo="marca" en={fVinculada} volumen={0.25} />
      {[0, 1, 2].map((i) => (
        <Sfx key={i} archivo="pagina" en={fTarde - 4 + i * 6} volumen={0.3} />
      ))}
      <Sfx archivo="brillo" en={fOctubre} volumen={0.12} />
    </AbsoluteFill>
  );
};

// ---------- 4. QUÉ HACÉS CON CADA DECENA ----------
const ARCO_C: Punto = [540, 920];
const ARCO_R = 340;
const puntoArco = (i: number): Punto => {
  const a = Math.PI * (1.08 - (i / 9) * 1.16); // arco superior de izquierda a derecha
  return [ARCO_C[0] + Math.cos(a) * ARCO_R, ARCO_C[1] - Math.sin(a) * ARCO_R];
};
const MANOS_REZO: Brazo = { hombro: 10, codo: -110, mano: "abierta" };
const Decena: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fDecena = useMomento("decena", 0.3);
  const fDiez = useMomento("diez", 0.38);
  const fMeditas = useMomento("meditas", 0.5);
  const fMisterio = useMomento("misterio", 0.58);
  const fCuentas = useMomento("cuentas", 0.82);
  const pregunta = lerp(f, 2, 12, 0, 1) * (1 - lerp(f, fDecena - 14, fDecena - 6, 0, 1));
  const enManos = lerp(f, fDecena - 8, fDecena + 2, 0, 1);
  const mFiel = manoDe(ABU.x, ABU.suelo, ABU.ancho, MANOS_REZO, 1, false, true);
  // el pulgar avanza cuenta por cuenta: las diez se iluminan
  const avance = lerp(f, fDiez, fCuentas + 16, 0, 9.999, Easing.linear);
  const iluminadas = f < fDiez ? 0 : Math.min(10, Math.floor(avance) + 1);
  const indice = Math.min(9, Math.floor(avance));
  const t = avance - Math.floor(avance);
  const [x0, y0] = puntoArco(indice);
  const [x1, y1] = puntoArco(Math.min(9, indice + 1));
  const deslizar = Easing.inOut(Easing.cubic)(Math.max(0, (t - 0.7) / 0.3));
  const manoX = x0 + (x1 - x0) * deslizar;
  const manoY = y0 + (y1 - y0) * deslizar;
  const foco = lerp(f, fMeditas - 4, fMeditas + 12, 0, 1); // de los dedos a la escena
  const pts = Array.from({ length: 10 }, (_, i) => puntoArco(i));
  return (
    <AbsoluteFill>
      {/* la abuela mira el rosario: ¿para qué tantas avemarías? */}
      <AbsoluteFill style={{ opacity: 1 - enManos }}>
        <Camara tomas={[{ f: 0, x: 540, y: 860, z: 1.6 }, { f: fDecena - 8, x: 540, y: 1000, z: 1.9 }, { f: fDecena + 2, x: mFiel.x, y: mFiel.y + 120, z: 3.2 }]}>
          <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 3800, background: "linear-gradient(180deg,#3A2E46 0%,#5C4A44 60%,#4A3826 100%)" }} />
          <div style={{ position: "absolute", left: 40, top: 1050, width: 1000, height: 560, borderRadius: 40, background: "#6E3C4A" }} />
          <Fig quien="abuela" sentado x={ABU.x} suelo={ABU.suelo} ancho={ABU.ancho} giro={0.2 * pregunta} mirada={[2, 10]} cabeza={6} cejaUna={12 * pregunta} boca={{ curva: 4 + 3 * pregunta }} brazoIzq={MANOS_REZO} brazoDer={MANOS_REZO} semilla={2} />
          <RosarioColgante x={mFiel.x - 8} y={mFiel.y + 6} escala={0.85} balanceo={Math.sin(f / 10) * 0.5} />
        </Camara>
      </AbsoluteFill>
      {/* primer plano: el pulgar recorre la decena alrededor de una escena de la vida de Jesús */}
      {enManos > 0 ? (
        <AbsoluteFill style={{ opacity: enManos }}>
          <Camara tomas={[{ f: fDecena, x: 540, y: 900, z: 1.05 }, { f: fMeditas, x: 540, y: 900, z: 1.0 }, { f: fMisterio + 8, x: 540, y: 1000, z: 1.3 }, { f: duracion, x: 540, y: 980, z: 1.22 }]}>
            <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 3800, background: "radial-gradient(ellipse at 50% 50%, #3A3046 0%, #14182A 75%)" }} />
            {/* escena de la vida de Jesús (se ilumina al meditar) */}
            <div style={{ position: "absolute", left: ARCO_C[0] - 260, top: ARCO_C[1] - 170, width: 520, height: 520, borderRadius: 260, overflow: "hidden", border: `8px solid ${PAL.dorado}`, boxShadow: `0 0 ${30 + 60 * foco}px rgba(242,193,78,${0.35 + 0.45 * foco})`, filter: `saturate(${0.55 + 0.45 * foco}) brightness(${0.75 + 0.25 * foco})` }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#8FA8C4,#EBD9B4)" }} />
              <div style={{ position: "absolute", left: -300, top: 0 }}>
                <Colinas y={300} desde={0} ancho={1100} />
              </div>
              <div style={{ position: "absolute", left: 0, top: 370, width: 520, height: 200, background: "#8E9A72" }} />
              <Fig quien="jesus" edad={1} x={210} suelo={480} ancho={180} brazoDer={{ hombro: 22 + 8 * osc(f, 30), codo: 70, mano: "abierta" }} mirada={[6, 0]} giro={0.4} bocaAuto={0.2 * osc(f, 7) * foco} semilla={1} />
              <Fig quien="oyente1" sentado x={350} suelo={490} ancho={140} giro={-0.6} mirada={[-8, -4]} semilla={4} />
              <Fig quien="maria" sentado x={440} suelo={500} ancho={140} giro={-0.6} mirada={[-8, -4]} semilla={6} />
            </div>
            <Rosario pts={pts} cuentas={10} r={28} cruz={false} iluminadas={iluminadas} />
            {/* pulgar sobre la cuenta actual; al meditar se atenúa */}
            {f >= fDiez - 6 ? (
              <div style={{ opacity: 1 - 0.7 * foco }}>
                <ManoCuenta x={manoX} y={manoY} empuje={osc(f, 10) * (1 - deslizar)} escala={1.05} />
              </div>
            ) : null}
          </Camara>
        </AbsoluteFill>
      ) : null}
      {/* contador de avemarías */}
      {iluminadas > 0 ? (
        <div style={{ position: "absolute", left: 540, top: 310, translate: "-50% -50%", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 70, color: PAL.dorado, textShadow: "0 0 24px rgba(242,193,78,0.6), 0 6px 18px rgba(0,0,0,0.6)", opacity: 1 - lerp(f, duracion - 12, duracion - 4, 0, 1) }}>
          {iluminadas} / 10
        </div>
      ) : null}
      <Textura />
      <Sfx archivo="tela" en={fDecena - 8} volumen={0.2} />
      {Array.from({ length: 10 }, (_, i) => (
        <Sfx key={i} archivo="cuenta" en={fDiez + ((fCuentas + 16 - fDiez) * i) / 10} volumen={0.18} />
      ))}
      <Sfx archivo="brillo" en={fMeditas} volumen={0.12} />
    </AbsoluteFill>
  );
};

// ---------- 5. UNA VIDA PARA CONTEMPLAR ----------
const Medallon: React.FC<{ x: number; y: number; aparece: number; children: React.ReactNode; titulo: string }> = ({ x, y, aparece, children, titulo }) => {
  const f = useCurrentFrame();
  const e = lerp(f, aparece - 4, aparece + 8, 0, 1, Easing.out(Easing.back(1.4)));
  return (
    <div style={{ position: "absolute", left: x - 300, top: y - 300, width: 600, height: 600, opacity: Math.min(1, e * 1.5), scale: String(0.75 + 0.25 * e) }}>
      <div style={{ position: "absolute", left: -100, right: -100, top: -96, textAlign: "center", fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: 62, color: PAL.crema, textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>{titulo}</div>
      <div style={{ position: "absolute", inset: 0, borderRadius: 300, overflow: "hidden", border: `10px solid ${PAL.dorado}`, boxShadow: "0 0 60px rgba(242,193,78,0.5)" }}>
        <div style={{ position: "absolute", left: 40, top: 40, width: 520, height: 520, scale: "1.154", transformOrigin: "0 0", translate: "-40px -40px" }}>{children}</div>
      </div>
    </div>
  );
};

const Misterios: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fNacimiento = useMomento("nacimiento", 0.2);
  const fCruz = useMomento("cruz", 0.55);
  const fResurreccion = useMomento("resurreccion", 0.8);
  // la cámara viaja siguiendo el rosario de un misterio al siguiente
  const P1: Punto = [540, 900];
  const P2: Punto = [1640, 940];
  const P3: Punto = [2740, 900];
  // el rosario pasa por detrás de los medallones y lleva de un misterio al siguiente
  const camino: Punto[] = [[-300, 700], [P1[0] - 320, P1[1]], [P1[0], P1[1] + 330], [P1[0] + 320, P1[1]], [1090, 760], [P2[0] - 320, P2[1]], [P2[0], P2[1] + 330], [P2[0] + 320, P2[1]], [2190, 760], [P3[0] - 320, P3[1]], [P3[0], P3[1] + 330], [P3[0] + 320, P3[1]], [3300, 700]];
  const tomas = [
    { f: 0, x: P1[0], y: 960, z: 1.0 },
    { f: fCruz - 16, x: P1[0], y: 960, z: 1.0 },
    { f: fCruz - 2, x: P2[0], y: 990, z: 1.0 },
    { f: fResurreccion - 10, x: P2[0], y: 990, z: 1.0 },
    { f: fResurreccion + 2, x: P3[0], y: 960, z: 1.0 },
    { f: duracion, x: P3[0], y: 940, z: 1.06 },
  ];
  return (
    <AbsoluteFill>
      <Camara tomas={tomas}>
        <div style={{ position: "absolute", left: -1200, top: -900, width: 5200, height: 3800, background: "linear-gradient(180deg,#0B1426 0%,#24395F 60%,#2C3F66 100%)" }} />
        <Rosario pts={camino} cuentas={70} r={17} cruz={false} progreso={lerp(f, 0, duracion - 6, 0.22, 1, Easing.linear)} />
        {/* nacimiento: María junto a Jesús recién nacido */}
        <Medallon x={P1[0]} y={P1[1]} aparece={Math.max(4, fNacimiento - 10)} titulo="Nacimiento">
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#2A3A5E,#5A4A3A)" }} />
          <div style={{ position: "absolute", left: 330, top: 40, width: 18, height: 18, borderRadius: 9, background: "#FFF4D6", boxShadow: "0 0 30px 12px rgba(255,244,214,0.7)" }} />
          <div style={{ position: "absolute", left: 0, top: 400, width: 520, height: 140, background: "#6A5038" }} />
          {/* pesebre con el niño envuelto */}
          <svg style={{ position: "absolute", left: 230, top: 300, scale: "1.35", transformOrigin: "0 0" }} width={220} height={120}>
            <path d="M 10 30 L 210 30 L 180 110 L 40 110 Z" fill="#8A5A30" />
            <path d="M 20 30 Q 110 10 200 30" fill="#E2C98A" />
            <ellipse cx={110} cy={26} rx={56} ry={22} fill="#F3EDE0" />
            <circle cx={70} cy={22} r={16} fill="#D0A07E" />
            <path d="M 64 22 Q 70 26 76 22" stroke="#6E4A2C" strokeWidth={2} fill="none" />
          </svg>
          <div style={{ position: "absolute", left: 0, top: 0 }}>
            <Fig quien="maria" sentado x={180} suelo={470} ancho={240} giro={0.6} mirada={[8, 8]} cabeza={10 + Math.sin(f / 30) * 2} ojos={0.7} boca={{ curva: 9 }} brazoDer={{ hombro: 30, codo: 30, mano: "abierta" }} brazoIzq={{ hombro: 10, codo: -60, mano: "abierta" }} semilla={6} />
          </div>
        </Medallon>
        {/* la cruz, con respeto: sin detalles gráficos */}
        <Medallon x={P2[0]} y={P2[1]} aparece={fCruz - 8} titulo="La cruz">
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#3A2E46 0%,#B9764A 70%,#E8B070 100%)" }} />
          <div style={{ position: "absolute", left: -40, top: 380, width: 600, height: 300, borderRadius: "50% 50% 0 0", background: "#2A2030" }} />
          <svg style={{ position: "absolute", left: 200, top: 90 }} width={120} height={320}>
            <rect x={48} y={0} width={24} height={320} fill="#4A3020" />
            <rect x={0} y={60} width={120} height={22} fill="#4A3020" />
          </svg>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 30%, rgba(255,233,176,0.35), rgba(255,233,176,0) 50%)" }} />
        </Medallon>
        {/* resurrección: Jesús luminoso */}
        <Medallon x={P3[0]} y={P3[1]} aparece={fResurreccion - 6} titulo="Resurrección">
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 40%, #FFF4D6 0%, #F2C14E 35%, #8C6A3A 100%)" }} />
          {/* sepulcro abierto */}
          <div style={{ position: "absolute", left: 20, top: 360, width: 160, height: 160, borderRadius: "80px 80px 0 0", background: "#6E6250" }} />
          <div style={{ position: "absolute", left: 50, top: 410, width: 90, height: 110, borderRadius: "45px 45px 0 0", background: "#2A2420" }} />
          <div style={{ position: "absolute", left: 150, top: 420, width: 110, height: 110, borderRadius: 55, background: "#8A7E6A" }} />
          <div style={{ position: "absolute", left: 0, top: 0, filter: "drop-shadow(0 0 24px rgba(255,255,255,0.9))" }}>
            <Fig quien="jesus" edad={1} x={330} suelo={500} ancho={250} mirada={[0, -2]} boca={{ curva: 8 }} brazoIzq={{ hombro: 40, codo: 30, mano: "abierta" }} brazoDer={{ hombro: 40, codo: 30, mano: "abierta" }} semilla={1} />
          </div>
        </Medallon>
      </Camara>
      <Textura fuerza={0.8} />
      <Sfx archivo="cuenta" en={fCruz - 10} volumen={0.15} />
      <Sfx archivo="whoosh" en={fCruz - 8} volumen={0.15} />
      <Sfx archivo="cuenta" en={fResurreccion - 8} volumen={0.15} />
      <Sfx archivo="whoosh" en={fResurreccion - 6} volumen={0.15} />
      <Sfx archivo="brillo" en={fResurreccion} volumen={0.18} />
    </AbsoluteFill>
  );
};

// ---------- 6. CIERRE: el rosario vuelve a las manos de la abuela → libro ----------
const Cierre: React.FC<PropsEscena> = (p) => {
  const f = useCurrentFrame();
  const libro = lerp(f, 16, 26, 0, 1);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - libro }}>
        <Camara tomas={[{ f: 0, x: 540, y: 960, z: 1.6 }, { f: 26, x: 540, y: 1080, z: 2.2 }]}>
          <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 3800, background: "linear-gradient(180deg,#3A2E46 0%,#5C4A44 60%,#4A3826 100%)" }} />
          <div style={{ position: "absolute", left: 80, top: 1050, width: 920, height: 520, borderRadius: 40, background: "#6E3C4A" }} />
          <Fig quien="abuela" sentado x={ABU.x} suelo={ABU.suelo} ancho={ABU.ancho} ojos={0.4} cabeza={4} boca={{ curva: 10 }} brazoIzq={{ hombro: 10, codo: -110, mano: "abierta" }} brazoDer={{ hombro: 10, codo: -110, mano: "abierta" }} semilla={2} />
          {(() => {
            const m = manoDe(ABU.x, ABU.suelo, ABU.ancho, { hombro: 10, codo: -110 }, 1, false, true);
            return <RosarioColgante x={m.x - 10} y={m.y + 10} escala={0.8} balanceo={Math.sin(f / 10) * 0.6} />;
          })()}
        </Camara>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: libro }}>
        <Sequence from={-14} layout="none">
          <CierreCanal {...p} />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ESCENAS_ROSARIO: Record<string, React.FC<{ escena: EscenaAnimada }>> = {
  "rosario/bolso": Bolso1,
  "rosario/lepanto": Lepanto,
  "rosario/octubre": Octubre,
  "rosario/decena": Decena,
  "rosario/misterios": Misterios,
  "rosario/cierre": Cierre,
};

void CLAMP;
