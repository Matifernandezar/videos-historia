// Escenas del Short "¿Por qué hay una bala en la corona de Fátima?" (Versículo Oculto).
// Recorrido de la bala: atentado → supervivencia → agradecimiento → corona.
// Reutiliza personajes, cámara y cierre de los videos anteriores (continuidad del canal).
import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from "remotion";
import { useEscena } from "../../video/contexto";
import type { EscenaAnimada } from "../../video/tipos";
import { FUENTE_SERIFA, FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { Sfx, useMomento } from "../comun";
import { Camara, lerp, PAL, Referencia, Textura } from "../jesus-12-30/escenarios";
import { Cierre as CierreCanal, Fig, manoDe, osc } from "../jesus-12-30/escenas";
import { RosarioColgante } from "../rosario/escenas";

type PropsEscena = { escena: EscenaAnimada };

// ---------- piezas ----------

// Proyectil (vista lateral, punta hacia la derecha; rot -90 = punta arriba). Centrado en (x, y).
// `luz` 0..1 desplaza un reflejo a lo largo del metal (sugiere que la cámara gira alrededor).
let idBala = 0;
const CUERPO_BALA = "M 2 5 L 52 5 Q 98 8 99 23 Q 98 38 52 41 L 2 41 Q 0 23 2 5 Z";
export const Bala: React.FC<{ x: number; y: number; largo: number; rot?: number; brillo?: number; luz?: number }> = ({ x, y, largo, rot = 0, brillo = 0, luz }) => {
  const id = React.useMemo(() => `bala${idBala++}`, []);
  const alto = largo * 0.46;
  return (
    <svg style={{ position: "absolute", left: x - largo / 2, top: y - alto / 2, overflow: "visible", rotate: `${rot}deg` }} width={largo} height={alto} viewBox="0 0 100 46">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3C894" />
          <stop offset="0.3" stopColor="#D39556" />
          <stop offset="0.7" stopColor="#A86C38" />
          <stop offset="1" stopColor="#5E3A1E" />
        </linearGradient>
        <radialGradient id={`${id}h`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFE6AA" stopOpacity={0.5 * brillo} />
          <stop offset="1" stopColor="#FFE6AA" stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}r`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
          <stop offset="0.5" stopColor="#FFF4DC" stopOpacity={0.75} />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
        <clipPath id={`${id}c`}>
          <path d={CUERPO_BALA} />
        </clipPath>
      </defs>
      {brillo > 0 ? <ellipse cx={50} cy={23} rx={85} ry={55} fill={`url(#${id}h)`} /> : null}
      <path d={CUERPO_BALA} fill={`url(#${id}g)`} />
      <g clipPath={`url(#${id}c)`}>
        {/* base y ranura */}
        <rect x={0} y={0} width={9} height={46} fill="#7A4A26" opacity={0.7} />
        <rect x={30} y={0} width={2.5} height={46} fill="#6E4424" opacity={0.45} />
        {/* reflejo fijo superior */}
        <path d="M 4 10 L 52 10 Q 82 12 93 17" stroke="#FFE7C2" strokeWidth={3.2} strokeLinecap="round" fill="none" opacity={0.75} />
        {/* reflejo que recorre el metal */}
        {luz !== undefined ? <rect x={-30 + 150 * luz} y={-5} width={22} height={56} fill={`url(#${id}r)`} transform={`skewX(-18)`} /> : null}
      </g>
      <path d={CUERPO_BALA} fill="none" stroke="#3E2412" strokeWidth={1.1} />
    </svg>
  );
};

// Corona de la imagen de Fátima (ilustración original simplificada): aro con piedras, arcos con perlas
// que se unen arriba (ahí está la bala, bajo el orbe) y cruz. viewBox 600 × 600; la bala va en (300, 152).
// `dibujo` 0..1: la corona se dibuja desde la bala hacia afuera (anillo y orbe → arcos y perlas → aro y piedras).
// La bala se dibuja aparte (componente Bala) para que se vea igual en todos los planos.
export const BALA_EN_CORONA = { x: 300, y: 152 };
const cl = (v: number) => Math.max(0, Math.min(1, v));
export const Corona: React.FC<{ w: number; bala?: boolean; brillo?: number; vacia?: boolean; dibujo?: number }> = ({ w, bala = true, brillo = 0, vacia = false, dibujo = 1 }) => {
  const f = useCurrentFrame();
  const arcos = [70, 175, 300, 425, 530];
  const piedras = ["#B0281E", "#2E7D4F", "#2F5DA8", "#B0281E", "#2E7D4F", "#2F5DA8", "#B0281E"];
  const destello = (i: number) => 0.5 + 0.5 * Math.sin(f / 9 + i * 1.7);
  const centro = cl(dibujo * 5); // anillo, orbe y cruz
  const arco = cl((dibujo - 0.12) / 0.55); // los arcos bajan desde la bala
  const aro = cl((dibujo - 0.62) / 0.3); // aro con piedras
  const ctrl = (x: number) => [x + (300 - x) * 0.12, x === 300 ? 300 : 175];
  return (
    <svg width={w} height={w} viewBox="0 0 600 600" style={{ overflow: "visible", display: "block" }}>
      <defs>
        <linearGradient id="oroCorona" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE7A3" />
          <stop offset="0.5" stopColor="#E3B04B" />
          <stop offset="1" stopColor="#A9741F" />
        </linearGradient>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFE9B0" stopOpacity={0.8} />
          <stop offset="1" stopColor="#FFE9B0" stopOpacity={0} />
        </radialGradient>
      </defs>
      {brillo > 0 ? <circle cx={300} cy={300} r={360} fill="url(#halo)" opacity={brillo * Math.max(arco, 0.3)} /> : null}
      {/* arcos de atrás (más oscuros) */}
      {[120, 480].map((x, i) => (
        <path key={`b${i}`} d={`M 300 158 Q ${x + (300 - x) * 0.15} 190 ${x} 450`} stroke="#9C6A1C" strokeWidth={16} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - arco} />
      ))}
      {/* arcos de adelante con perlas */}
      {arcos.map((x, i) => {
        const [cx1, cy1] = ctrl(x);
        return (
          <g key={i}>
            <path d={`M 300 158 Q ${cx1} ${cy1} ${x} 455`} stroke="url(#oroCorona)" strokeWidth={x === 300 ? 20 : 24} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - arco} opacity={arco > 0 ? 1 : 0} />
            {Array.from({ length: 6 }, (_, k) => {
              const t = (k + 0.7) / 7; // desde la bala (0) hacia el aro (1)
              const px = (1 - t) * (1 - t) * 300 + 2 * (1 - t) * t * cx1 + t * t * x;
              const py = (1 - t) * (1 - t) * 158 + 2 * (1 - t) * t * cy1 + t * t * 455;
              const s = cl((arco - t) * 8);
              return s > 0 ? <circle key={k} cx={px} cy={py} r={7 * s} fill="#FBF6EA" stroke="#D8CDB5" strokeWidth={1.5} /> : null;
            })}
          </g>
        );
      })}
      {/* unión de los arcos: el hueco donde quedó la bala */}
      <g opacity={centro}>
        <circle cx={300} cy={152} r={30} fill="#2A1E0C" opacity={0.45} />
        {bala && !vacia ? (
          <g transform="translate(300 152) rotate(-90) translate(-24 -11)">
            <path d="M 1 2 L 25 2 Q 47 4 48 11 Q 47 18 25 20 L 1 20 Z" fill="#B87A40" stroke="#4A2C16" strokeWidth={1} />
            <path d="M 3 5 L 25 5 Q 38 6 44 9" stroke="#FFE2B8" strokeWidth={2} fill="none" opacity={0.8} />
          </g>
        ) : null}
        <circle cx={300} cy={152} r={30} fill="none" stroke="url(#oroCorona)" strokeWidth={8} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - centro} />
        {/* orbe y cruz */}
        <g opacity={cl(dibujo * 4 - 0.3)}>
          <circle cx={300} cy={98} r={26} fill="url(#oroCorona)" stroke="#A9741F" strokeWidth={3} />
          <path d="M 274 98 L 326 98" stroke="#A9741F" strokeWidth={3} />
          <rect x={293} y={22} width={14} height={52} rx={3} fill="url(#oroCorona)" />
          <rect x={278} y={36} width={44} height={13} rx={3} fill="url(#oroCorona)" />
        </g>
      </g>
      {/* aro con piedras */}
      <g opacity={aro}>
        <path d="M 50 440 Q 300 400 550 440 L 556 520 Q 300 488 44 520 Z" fill="url(#oroCorona)" stroke="#A9741F" strokeWidth={3} />
        {piedras.map((c, i) => {
          const x = 90 + i * 70;
          const y = 466 - Math.sin((i / 6) * Math.PI) * 14;
          const s = cl((aro - Math.abs(i - 3) * 0.1) * 2.5);
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
              <ellipse cx={0} cy={0} rx={17} ry={14} fill={c} stroke="#FFE7A3" strokeWidth={3} />
              <circle cx={-5} cy={-4} r={4} fill="#FFFFFF" opacity={0.4 + 0.5 * destello(i)} />
            </g>
          );
        })}
        {Array.from({ length: 14 }, (_, i) => (
          <circle key={i} cx={70 + i * 35} cy={508 - Math.sin((i / 13) * Math.PI) * 14} r={5} fill="#FBF6EA" />
        ))}
      </g>
    </svg>
  );
};

// Imagen de la Virgen de Fátima (talla blanca con borde dorado, manos juntas, rosario) sobre columna.
const MANOS_JUNTAS = { hombro: 10, codo: -110, mano: "abierta" as const };
export const VirgenFatima: React.FC<{ x: number; suelo: number; ancho: number; corona?: boolean; brillo?: number; columna?: boolean }> = ({ x, suelo, ancho, corona = false, brillo = 0, columna = true }) => {
  const f = useCurrentFrame();
  const m = manoDe(x, suelo, ancho, MANOS_JUNTAS, 1);
  const cabezaY = suelo - 1.5 * ancho;
  return (
    <>
      {brillo > 0 ? (
        <div style={{ position: "absolute", left: x - ancho * 1.3, top: cabezaY - ancho * 0.9, width: ancho * 2.6, height: ancho * 2.6, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,233,176,${0.6 * brillo}) 0%, rgba(255,233,176,0) 68%)` }} />
      ) : null}
      {columna ? <div style={{ position: "absolute", left: x - ancho * 0.32, top: suelo - 10, width: ancho * 0.64, height: ancho * 1.4, background: "linear-gradient(90deg,#BBA982,#E6D8B6 45%,#A8946E)", borderRadius: 6 }} /> : null}
      <Fig quien="fatima" x={x} suelo={suelo} ancho={ancho} ojos={0.72} mirada={[0, 4]} boca={{ curva: 9 }} brazoIzq={MANOS_JUNTAS} brazoDer={MANOS_JUNTAS} semilla={8} />
      {/* borde dorado del manto y estrella */}
      <svg style={{ position: "absolute", left: x - ancho / 2, top: suelo - ancho * 1.85, overflow: "visible" }} width={ancho} height={ancho * 1.85} viewBox="0 0 600 1110">
        <path d="M 170 240 Q 120 600 130 1020 M 430 240 Q 480 600 470 1020" stroke={PAL.dorado} strokeWidth={10} fill="none" opacity={0.85} />
        <path d="M 300 905 l 12 26 28 3 -21 19 6 28 -25 -14 -25 14 6 -28 -21 -19 28 -3 Z" fill={PAL.dorado} />
      </svg>
      <RosarioColgante x={m.x - 4} y={m.y + 6} escala={0.32 * (ancho / 300)} balanceo={Math.sin(f / 20) * 0.3} />
      {corona ? (
        <div style={{ position: "absolute", left: x - ancho * 0.19, top: cabezaY - ancho * 0.47 }}>
          <Corona w={ancho * 0.38} />
        </div>
      ) : null}
    </>
  );
};

// Plaza de San Pedro: cúpula, fachada, columnatas y obelisco (siluetas por capas).
const Plaza: React.FC<{ y?: number; silueta?: number; tono?: number }> = ({ y = 980, silueta = 0, tono = 1 }) => {
  const piedra = silueta > 0.5 ? "#33497A" : "#D9CBA8";
  const sombra = silueta > 0.5 ? "#26395F" : "#B6A57F";
  return (
    <svg style={{ position: "absolute", left: -300, top: y - 700, overflow: "visible", opacity: tono }} width={1680} height={800}>
      {/* cúpula */}
      <path d="M 640 330 Q 640 170 840 160 Q 1040 170 1040 330 Z" fill={piedra} />
      <rect x={828} y={110} width={24} height={56} fill={piedra} />
      <circle cx={840} cy={100} r={14} fill={piedra} />
      <rect x={660} y={320} width={360} height={40} fill={sombra} />
      {/* fachada */}
      <rect x={560} y={350} width={560} height={330} fill={piedra} />
      <path d="M 560 350 L 1120 350 L 1120 380 L 560 380 Z" fill={sombra} />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={585 + i * 62} y={392} width={18} height={288} fill={sombra} />
      ))}
      <path d="M 760 350 L 840 300 L 920 350 Z" fill={piedra} />
      {/* columnatas en curva */}
      {[-1, 1].map((l) => (
        <g key={l}>
          <path d={l < 0 ? "M 560 560 Q 260 560 0 700 L 0 760 Q 260 620 560 620 Z" : "M 1120 560 Q 1420 560 1680 700 L 1680 760 Q 1420 620 1120 620 Z"} fill={piedra} />
          {Array.from({ length: 12 }, (_, i) => {
            const t = i / 11;
            const xx = l < 0 ? 560 - t * 540 : 1120 + t * 540;
            const yy = 600 + t * t * 130;
            return <rect key={i} x={xx - 7} y={yy - 30} width={14} height={60} fill={sombra} />;
          })}
        </g>
      ))}
      {/* obelisco */}
      <path d="M 832 700 L 840 420 L 848 700 Z" fill={silueta > 0.5 ? "#22345A" : "#C8B68F"} />
      <rect x={824} y={690} width={32} height={30} fill={sombra} />
    </svg>
  );
};

// Multitud simple (cabezas y hombros) en filas, con brazos que saludan.
const Multitud: React.FC<{ y: number; filas?: number; escala?: number; susto?: number; semilla?: number }> = ({ y, filas = 3, escala = 1, susto = 0, semilla = 0 }) => {
  const f = useCurrentFrame();
  const ropa = ["#7A4A5E", "#4F6E5A", "#5A6E96", "#B8643F", "#8A7A5A", "#3E4E72", "#A3242A", "#6E5A8A"];
  const pieles = ["#D2A383", "#B98260", "#C99470", "#A97352", "#E0B796"];
  return (
    <>
      {Array.from({ length: filas }, (_, r) => {
        const e = escala * (0.75 + r * 0.18);
        const n = Math.round(1500 / (90 * e));
        return Array.from({ length: n }, (_, i) => {
          const k = (i * 7 + r * 13 + semilla) % 97;
          const x = -200 + i * (1480 / n) + (k % 5) * 6;
          const yy = y + r * 70 * escala + (k % 3) * 6;
          const sacude = Math.sin(f / (9 + (k % 4)) + k) * 3 * (1 - susto);
          const saluda = k % 4 === 0 && susto < 0.5;
          const brazo = saluda ? -70 - 30 * Math.sin(f / 6 + k) : 0;
          const vuelta = susto * ((k % 2) * 2 - 1) * 6;
          return (
            <div key={`${r}-${i}`} style={{ position: "absolute", left: x + vuelta, top: yy + sacude * 0.3 }}>
              <svg width={80 * e} height={130 * e} viewBox="0 0 80 130" style={{ overflow: "visible" }}>
                {saluda ? <line x1={62} y1={70} x2={62 + Math.cos((brazo * Math.PI) / 180) * 40} y2={70 + Math.sin((brazo * Math.PI) / 180) * 40} stroke={pieles[k % 5]} strokeWidth={9} strokeLinecap="round" /> : null}
                <path d="M 6 130 Q 6 70 40 66 Q 74 70 74 130 Z" fill={ropa[k % ropa.length]} />
                <circle cx={40 + vuelta * 0.6} cy={44} r={22} fill={pieles[k % 5]} />
                <path d={`M ${18 + vuelta * 0.6} 40 Q 40 ${12 - (k % 3) * 2} ${62 + vuelta * 0.6} 40 Q 40 ${28} ${18 + vuelta * 0.6} 40 Z`} fill={["#2A1B13", "#5B4A3C", "#9A948C", "#3A2418"][k % 4]} />
              </svg>
            </div>
          );
        });
      })}
    </>
  );
};

// Vehículo abierto (todoterreno blanco, ilustración original), vista lateral. (x, suelo) = centro sobre el piso.
const Papamovil: React.FC<{ x: number; suelo: number; e?: number; rueda?: number }> = ({ x, suelo, e = 1, rueda = 0 }) => (
  <svg style={{ position: "absolute", left: x - 300 * e, top: suelo - 300 * e, overflow: "visible" }} width={600 * e} height={300 * e} viewBox="0 0 600 300">
    <g transform="translate(600 0) scale(-1 1)">
    <path d="M 20 250 L 20 150 L 120 140 L 150 100 L 230 96 L 240 140 L 580 140 L 585 250 Z" fill="#F4F2EC" stroke="#B9B4A8" strokeWidth={4} />
    <path d="M 160 106 L 226 102 L 232 138 L 140 140 Z" fill="#9FB6C8" opacity={0.85} />
    <rect x={250} y={60} width={10} height={86} fill="#C9C4B8" />
    <rect x={250} y={60} width={300} height={10} rx={5} fill="#C9C4B8" />
    <rect x={540} y={60} width={10} height={86} fill="#C9C4B8" />
    <rect x={20} y={196} width={565} height={14} fill="#E3DFD4" />
    <rect x={10} y={232} width={40} height={18} rx={6} fill="#9A958A" />
    {[130, 470].map((cx) => (
      <g key={cx} transform={`translate(${cx} 252) rotate(${rueda})`}>
        <circle r={48} fill="#2A2A2E" />
        <circle r={24} fill="#C9C4B8" />
        <rect x={-3} y={-24} width={6} height={48} fill="#8A857A" />
      </g>
    ))}
    </g>
  </svg>
);

// Ambulancia (traslado), vista lateral.
const Ambulancia: React.FC<{ x: number; suelo: number; f: number }> = ({ x, suelo, f }) => (
  <svg style={{ position: "absolute", left: x - 260, top: suelo - 250, overflow: "visible" }} width={520} height={250} viewBox="0 0 520 250">
    <path d="M 10 210 L 10 40 L 360 40 L 380 40 L 450 110 L 510 130 L 510 210 Z" fill="#F7F5EF" stroke="#BDB8AC" strokeWidth={4} />
    <path d="M 372 52 L 436 112 L 372 112 Z" fill="#9FB6C8" />
    <rect x={10} y={140} width={500} height={22} fill="#B0281E" />
    <rect x={150} y={70} width={20} height={60} fill="#B0281E" />
    <rect x={130} y={90} width={60} height={20} fill="#B0281E" />
    <rect x={300} y={22} width={40} height={18} rx={4} fill={Math.floor(f / 4) % 2 ? "#5A8BEA" : "#2A4A9A"} />
    {[100, 410].map((cx) => (
      <g key={cx} transform={`translate(${cx} 212) rotate(${f * 40})`}>
        <circle r={38} fill="#2A2A2E" />
        <circle r={18} fill="#C9C4B8" />
        <rect x={-3} y={-18} width={6} height={36} fill="#8A857A" />
      </g>
    ))}
  </svg>
);

// Habitación de hospital: pared, ventana con luz, cama con almohadas, monitor.
const HABITACION = { cama: { x: 540, y: 1180 } };
const Habitacion: React.FC<{ luz?: number }> = ({ luz = 0.5 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 3800, background: "linear-gradient(180deg,#5E7088 0%,#7A8A9E 55%,#6A6A70 100%)" }} />
      <div style={{ position: "absolute", left: -900, top: 1330, width: 2900, height: 1400, background: "linear-gradient(180deg,#8E8A84,#6E6A64)" }} />
      {/* ventana */}
      <div style={{ position: "absolute", left: 640, top: 380, width: 300, height: 380, background: `linear-gradient(180deg, rgba(255,226,170,${0.6 + 0.3 * luz}), rgba(242,193,78,${0.3 + 0.3 * luz}))`, border: "16px solid #D8D4CA", boxShadow: "0 0 80px rgba(255,220,150,0.35)" }}>
        <div style={{ position: "absolute", left: 126, top: 0, width: 16, height: 348, background: "#D8D4CA" }} />
        <div style={{ position: "absolute", left: 0, top: 166, width: 268, height: 16, background: "#D8D4CA" }} />
      </div>
      <div style={{ position: "absolute", left: 600, top: 760, width: 520, height: 700, background: "linear-gradient(200deg, rgba(255,226,170,0.25), rgba(255,226,170,0))", clipPath: "polygon(10% 0, 70% 0, 100% 100%, 0 100%)" }} />
      {/* monitor */}
      <div style={{ position: "absolute", left: 110, top: 640, width: 220, height: 170, borderRadius: 14, background: "#2A3340", border: "8px solid #C9C4B8" }}>
        <svg width={204} height={154} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d={`M 0 80 ${Array.from({ length: 12 }, (_, i) => { const x = i * 18 - ((f * 3) % 18); return i % 4 === 1 ? `L ${x} 80 L ${x + 5} 40 L ${x + 10} 110 L ${x + 14} 80` : `L ${x + 14} 80`; }).join(" ")}`} stroke="#7EE0A0" strokeWidth={4} fill="none" />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 210, top: 810, width: 16, height: 520, background: "#B9B4A8" }} />
      {/* cabecera de la cama */}
      <div style={{ position: "absolute", left: 250, top: 860, width: 580, height: 300, borderRadius: "20px 20px 0 0", background: "#D8D4CA", border: "8px solid #B9B4A8" }} />
    </>
  );
};
// Frente de la cama (sábanas) que tapa la parte de abajo de la figura sentada.
const SabanaCama: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: 180, top: 1150, width: 720, height: 200, borderRadius: "40px 40px 10px 10px", background: "linear-gradient(180deg,#F2F0EA,#D6D2C8)", boxShadow: "0 -6px 18px rgba(0,0,0,0.15)" }} />
    <div style={{ position: "absolute", left: 180, top: 1150, width: 720, height: 46, borderRadius: "40px 40px 0 0", background: "#BFD0DE" }} />
    <div style={{ position: "absolute", left: 200, top: 1340, width: 680, height: 30, background: "#9A958A" }} />
  </>
);
const Almohada: React.FC = () => <div style={{ position: "absolute", left: 360, top: 770, width: 360, height: 220, borderRadius: 60, background: "linear-gradient(180deg,#FFFFFF,#E2DED6)" }} />;

// Santuario de Fátima (ilustración original simplificada): basílica con torre alta, columnatas y explanada.
const Santuario: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 2000, background: "linear-gradient(180deg,#2C3F66 0%,#7A8CAA 55%,#F0D9A8 100%)" }} />
    <div style={{ position: "absolute", left: -900, top: 1100, width: 2900, height: 1800, background: "linear-gradient(180deg,#E6DCC8,#C9BCA2)" }} />
    <svg style={{ position: "absolute", left: -300, top: 300, overflow: "visible" }} width={1680} height={820}>
      {/* columnatas */}
      <path d="M 0 700 Q 400 640 700 640 L 700 760 L 0 790 Z" fill="#EFE9DC" />
      <path d="M 1680 700 Q 1280 640 980 640 L 980 760 L 1680 790 Z" fill="#EFE9DC" />
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={20 + i * 48} y={680 - i * 3} width={14} height={80} fill="#CFC6B2" />
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={`d${i}`} x={1646 - i * 48} y={680 - i * 3} width={14} height={80} fill="#CFC6B2" />
      ))}
      {/* basílica */}
      <rect x={650} y={440} width={380} height={330} fill="#F4EFE4" />
      <path d="M 650 440 L 840 380 L 1030 440 Z" fill="#E6DECC" />
      {/* torre */}
      <rect x={800} y={40} width={80} height={420} fill="#F7F3EA" />
      <rect x={790} y={180} width={100} height={18} fill="#E6DECC" />
      <path d="M 800 40 Q 840 -40 880 40 Z" fill="#C9A24A" />
      <rect x={836} y={-110} width={8} height={70} fill="#C9A24A" />
      <rect x={820} y={-90} width={40} height={8} fill="#C9A24A" />
      <rect x={815} y={240} width={50} height={80} rx={25} fill="#9FA8B8" />
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={`p${i}`} x={680 + i * 70} y={560} width={30} height={210} fill="#DCD3BF" />
      ))}
    </svg>
  </>
);

// Capelinha (capilla de las apariciones): techo moderno sobre la columna con la imagen.
const Capilla: React.FC<{ x: number; suelo: number }> = ({ x, suelo }) => (
  <>
    <div style={{ position: "absolute", left: x - 260, top: suelo - 640, width: 520, height: 40, background: "#E9E2D2", borderRadius: 6, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }} />
    {[-230, 210].map((d) => (
      <div key={d} style={{ position: "absolute", left: x + d, top: suelo - 600, width: 20, height: 600, background: "#D9D0BC" }} />
    ))}
  </>
);

// Mano grande (primer plano) con manga blanca. Ángulo en grados; (x, y) = centro de la palma.
const ManoGrande: React.FC<{ x: number; y: number; rot?: number; espejo?: boolean; pinza?: number; escala?: number }> = ({ x, y, rot = 0, espejo = false, pinza = 0, escala = 1 }) => (
  <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={10} height={10}>
    <g transform={`rotate(${rot}) scale(${(espejo ? -1 : 1) * escala} ${escala})`}>
      {/* manga blanca */}
      <path d="M -70 60 L -60 320 L 90 320 L 80 60 Z" fill="#F5F2EB" />
      <path d="M -72 56 L 82 56 L 84 92 L -74 92 Z" fill="#E3DED2" />
      {/* palma */}
      <path d="M -70 60 Q -86 -10 -50 -60 L 60 -60 Q 90 0 80 60 Z" fill="#DDB496" />
      {/* dedos */}
      {[-42, -12, 18].map((dx, i) => (
        <rect key={i} x={dx} y={-140 + i * 6 + pinza * 30} width={26} height={96 - pinza * 20} rx={13} fill="#DDB496" stroke="#BC9274" strokeWidth={2} />
      ))}
      <rect x={46} y={-118 + pinza * 30} width={24} height={78 - pinza * 18} rx={12} fill="#DDB496" stroke="#BC9274" strokeWidth={2} />
      {/* pulgar */}
      <path d={`M -64 10 Q -110 ${-40 + pinza * 30} ${-92 + pinza * 40} ${-96 + pinza * 30}`} stroke="#DDB496" strokeWidth={30} strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

const Fecha: React.FC<{ texto: string; o: number; y?: number; tam?: number }> = ({ texto, o, y = 260, tam = 76 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: o, translate: `0px ${(1 - o) * 20}px`, fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: tam, color: PAL.dorado, textShadow: "0 0 30px rgba(242,193,78,0.45), 0 6px 16px rgba(0,0,0,0.6)" }}>{texto}</div>
);

// Fondo oscuro con terciopelo azul y luz.
const Terciopelo: React.FC<{ luz?: number }> = ({ luz = 1 }) => (
  <div style={{ position: "absolute", left: -1500, top: -1500, width: 4080, height: 4920, background: `radial-gradient(ellipse at 50% 45%, rgba(62,90,134,${0.9 * luz}) 0%, #14223F 35%, #0B1426 70%)` }} />
);

// Corona "de mundo" compartida por las escenas 1 y 5 (mismo tamaño de bala en todos los planos).
const COR = { w: 760, x: 540 - 380, y: 380 };
const balaMundo = { x: COR.x + (BALA_EN_CORONA.x / 600) * COR.w, y: COR.y + (BALA_EN_CORONA.y / 600) * COR.w };

// ---------- 1. DE ROMA A UNA CORONA ----------
// La bala sube en vuelo (punta arriba) con la plaza de San Pedro pasando detrás; frena, y la corona
// se dibuja a su alrededor desde el lugar exacto donde quedó; la cámara se aleja hasta ver la corona entera.
// La bala nunca cambia de lugar ni de orientación: es la misma de la escena 5.
const Apertura: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fRoma = useMomento("roma", 0.3);
  const fCorona = useMomento("corona", 0.65);
  const fFatima = useMomento("fátima", 0.85);
  const vuela = 1 - lerp(f, fCorona - 14, fCorona + 4, 0, 1, Easing.out(Easing.quad));
  const recorrido = lerp(f, 0, fCorona + 4, 0, 1, Easing.out(Easing.quad)) * 2600;
  const plaza = lerp(f, fRoma - 8, fRoma + 6, 0, 1) * (1 - lerp(f, fCorona - 4, fCorona + 12, 0, 1));
  const dibujo = lerp(f, fCorona - 8, fFatima + 10, 0, 1, Easing.inOut(Easing.quad));
  const luz = ((f + 10) % 46) / 46;
  const vib = Math.sin(f * 1.7) * 1.2 * vuela;
  const largo = (COR.w / 600) * 48;
  return (
    <AbsoluteFill style={{ background: "#070C18" }}>
      {/* fondo de vuelo: plaza de San Pedro (silueta) que baja mientras la bala sube */}
      <AbsoluteFill style={{ opacity: plaza }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, background: "linear-gradient(180deg,#0B1426 0%,#132244 45%,#2C3F66 80%,#6E5A4A 100%)" }} />
        <div style={{ position: "absolute", inset: 0, translate: `0px ${recorrido * 0.18 - 120}px` }}>
          <div style={{ position: "absolute", left: -900, top: 1560, width: 2900, height: 1200, background: "#141F38" }} />
          <div style={{ scale: "0.8", transformOrigin: "540px 1560px", position: "absolute", inset: 0 }}>
            <Plaza y={1540} silueta={1} />
          </div>
        </div>
      </AbsoluteFill>
      {/* estelas de aire */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.55 * vuela }}>
        <defs>
          <linearGradient id="estela" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E6EEF8" stopOpacity={0} />
            <stop offset="1" stopColor="#E6EEF8" stopOpacity={0.7} />
          </linearGradient>
        </defs>
        {Array.from({ length: 10 }, (_, i) => {
          const lado = i % 2 ? 1 : -1;
          const x = 540 + lado * (150 + ((i * 53) % 4) * 45);
          const y = ((i * 311 + recorrido * (1.6 + (i % 3) * 0.3)) % 2100) - 300;
          const l = 220 + (i % 3) * 90;
          return <rect key={i} x={x - 4} y={y} width={8} height={l} rx={4} fill="url(#estela)" />;
        })}
      </svg>
      <Camara
        tomas={[
          { f: 0, x: balaMundo.x, y: balaMundo.y + 6, z: 9 },
          { f: fCorona - 10, x: balaMundo.x, y: balaMundo.y + 6, z: 8.2 },
          { f: duracion, x: 540, y: 720, z: 1.05 },
        ]}
        vaiven={0.15}
      >
        <div style={{ position: "absolute", left: COR.x, top: COR.y }}>
          <Corona w={COR.w} vacia dibujo={dibujo} brillo={0.5} />
        </div>
        <Bala x={balaMundo.x + vib * 0.3} y={balaMundo.y} largo={largo} rot={-90 + Math.sin(f / 9) * 2.5 * vuela} brillo={0.7} luz={luz} />
      </Camara>
      <Textura />
      <Sfx archivo="whoosh" en={2} volumen={0.22} />
      <Sfx archivo="whoosh" en={fRoma} volumen={0.18} />
      <Sfx archivo="brillo" en={fCorona - 4} volumen={0.32} />
    </AbsoluteFill>
  );
};

// ---------- 2. EL ATENTADO ----------
const Atentado: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fTrece = useMomento("trece", 0.02);
  const fDisparo = useMomento("disparó", 0.4);
  const fPedro = useMomento("pedro", 0.55);
  const fPapa = useMomento("papa", 0.68);
  const fSobrevivio = useMomento("sobrevivió", 0.75);
  const fTraslado = fPedro + 12;
  const fHospital = fPapa - 4;
  const avance = lerp(f, 0, fDisparo, 0, 1, Easing.linear);
  const xAuto = 250 + 260 * avance;
  const golpe = lerp(f, fDisparo, fDisparo + 6, 0, 1);
  const susto = lerp(f, fDisparo + 2, fDisparo + 12, 0, 1);
  const flash = f >= fDisparo && f < fDisparo + 4 ? 1 - (f - fDisparo) / 4 : 0;
  const temblor = f >= fDisparo && f < fDisparo + 8 ? Math.sin(f * 3) * 8 * (1 - (f - fDisparo) / 8) : 0;
  const saludo = 1 - golpe;
  const brazoSaludo = { hombro: 140 + 15 * Math.sin(f / 6) * saludo - 110 * golpe, codo: 15 - 100 * golpe, mano: "abierta" as const };
  const enTraslado = f >= fTraslado && f < fHospital;
  const enHospital = f >= fHospital;
  const despierta = lerp(f, fSobrevivio - 4, fSobrevivio + 18, 0.15, 0.7);
  return (
    <AbsoluteFill>
      {!enTraslado && !enHospital ? (
        <AbsoluteFill style={{ translate: `${temblor}px 0px` }}>
          <Camara tomas={[{ f: 0, x: 540, y: 980, z: 0.95 }, { f: fDisparo, x: xAuto, y: 1020, z: 1.25 }, { f: fDisparo + 10, x: xAuto, y: 1040, z: 1.3 }]} vaiven={0.6}>
            <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 2000, background: "linear-gradient(180deg,#6E87A8 0%,#B9C6D4 70%,#E8DCC0 100%)" }} />
            <div style={{ position: "absolute", left: -900, top: 1000, width: 2900, height: 1800, background: "linear-gradient(180deg,#CDBEA0,#A8946E)" }} />
            <Plaza y={1020} />
            <Multitud y={950} filas={2} escala={0.75} susto={susto} semilla={3} />
            <Fig quien="jp2" x={xAuto - 105} suelo={1300} ancho={260} giro={0.2} mirada={[4, -2]} cabeza={6 * golpe} ojos={1 - 0.65 * golpe} boca={{ curva: 10 * saludo - 4 * golpe }} cejas={{ rot: 5 * golpe }} brazoDer={brazoSaludo} brazoIzq={{ hombro: 30 - 20 * golpe, codo: 60 - 140 * golpe, mano: "abierta" }} semilla={1} />
            <Papamovil x={xAuto} suelo={1345} e={1.05} rueda={-avance * 220} />
            <Multitud y={1335} filas={1} escala={1.0} susto={susto} semilla={11} />
            {/* palomas que se espantan */}
            {f > fDisparo
              ? Array.from({ length: 7 }, (_, i) => {
                  const t = (f - fDisparo) / 30;
                  const ala = Math.sin(f / 1.6 + i) * 14;
                  return (
                    <svg key={i} style={{ position: "absolute", left: 200 + i * 110 + t * (i % 2 ? 160 : -120), top: 860 - t * (260 + i * 30), overflow: "visible" }} width={10} height={10}>
                      <path d={`M -22 ${ala} Q -10 -6 0 4 Q 10 -6 22 ${ala}`} stroke="#4A5868" strokeWidth={5} fill="none" strokeLinecap="round" />
                    </svg>
                  );
                })
              : null}
          </Camara>
          <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash * 0.5 }} />
        </AbsoluteFill>
      ) : null}
      {enTraslado ? (
        <AbsoluteFill style={{ background: "#2E3A52" }}>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: ((i * 271 - f * 60) % 1400) + 1400 * (((i * 271 - f * 60) % 1400) < -300 ? 1 : 0) - 200, top: 600 + (i % 5) * 140, width: 300, height: 10, borderRadius: 5, background: "rgba(220,230,240,0.35)" }} />
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: 1150, height: 400, background: "#4A4A52" }} />
          <Ambulancia x={540 + Math.sin(f / 3) * 4} suelo={1150} f={f} />
        </AbsoluteFill>
      ) : null}
      {enHospital ? (
        <AbsoluteFill style={{ opacity: lerp(f, fHospital, fHospital + 6, 0, 1) }}>
          <Camara tomas={[{ f: fHospital, x: 540, y: 960, z: 1.05 }, { f: duracion, x: 540, y: 960, z: 1.18 }]}>
            <Habitacion luz={despierta} />
            <Almohada />
            <Fig quien="jp2" sentado x={540} suelo={1290} ancho={340} cabeza={8} giro={0.15} ojos={despierta} boca={{ curva: lerp(f, fSobrevivio, fSobrevivio + 20, 0, 6) }} cejas={{ rot: 4 }} brazoIzq={{ hombro: 12, codo: -60 }} brazoDer={{ hombro: 12, codo: -60 }} semilla={1} />
            <SabanaCama />
          </Camara>
        </AbsoluteFill>
      ) : null}
      <Referencia texto="13 de mayo de 1981" aparece={fTrece + 4} hasta={fTraslado - 4} />
      <Textura />
      <Sfx archivo="multitud" en={0} volumen={0.12} />
      <Sfx archivo="disparo" en={fDisparo} volumen={0.32} />
      <Sfx archivo="whoosh" en={fTraslado} volumen={0.22} />
      <Sfx archivo="monitor" en={fHospital + 4} volumen={0.12} />
    </AbsoluteFill>
  );
};

// ---------- 2b. ¿POR QUÉ NO LO MATÓ? (esquema médico ilustrativo, sin imágenes gráficas) ----------
const Medica: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fAtraveso = useMomento("atravesó", 0.12);
  const fIntestino = useMomento("intestino", 0.25);
  const fAorta = useMomento("aorta", 0.33);
  const fArteria = useMomento("arteria", 0.4);
  const fPerdio = useMomento("perdió", 0.55);
  const fTres = useMomento("tres", 0.6);
  const fDesmayo = useMomento("desmayó", 0.72);
  const fOperaron = useMomento("operaron", 0.85);
  const fCinco = useMomento("cinco", 0.9);
  const titulo = lerp(f, 0, 10, 0, 1, Easing.out(Easing.back(1.4)));
  const esquema = lerp(f, 4, 16, 0, 1) * (1 - lerp(f, fPerdio - 6, fPerdio + 4, 0, 1));
  const entra = lerp(f, fAtraveso - 4, fAtraveso + 12, 0, 1, Easing.inOut(Easing.cubic));
  const intest = lerp(f, fIntestino - 4, fIntestino + 8, 0, 1);
  const okAorta = lerp(f, fAorta - 2, fAorta + 8, 0, 1, Easing.out(Easing.back(1.8)));
  const okArteria = lerp(f, fArteria - 2, fArteria + 8, 0, 1, Easing.out(Easing.back(1.8)));
  const sangreParte = lerp(f, fPerdio - 4, fPerdio + 8, 0, 1) * (1 - lerp(f, fOperaron - 6, fOperaron + 4, 0, 1));
  const nivel = 1 - 0.72 * lerp(f, fPerdio, fTres + 20, 0, 1, Easing.inOut(Easing.quad));
  const desmayo = lerp(f, fDesmayo - 4, fDesmayo + 10, 0, 1) * (1 - lerp(f, fOperaron - 8, fOperaron, 0, 1));
  const cirugia = lerp(f, fOperaron - 6, fOperaron + 6, 0, 1);
  const reloj = lerp(f, fOperaron, duracion - 6, 0, 1, Easing.inOut(Easing.quad));
  const pulso = 0.5 + 0.5 * Math.sin(f / 4);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #24395F 0%, #14223F 55%, #0B1426 100%)" }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 230, textAlign: "center", opacity: titulo, scale: String(0.85 + 0.15 * titulo), fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 92, lineHeight: 1.02, color: PAL.crema, textShadow: "0 6px 18px rgba(0,0,0,0.5)" }}>
        ¿Por qué <span style={{ color: PAL.dorado }}>no lo mató</span>?
      </div>
      {/* esquema del abdomen */}
      {esquema > 0 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: esquema }}>
          {/* silueta del torso */}
          <path d="M 330 440 Q 540 400 750 440 Q 800 470 790 560 L 760 1000 Q 750 1200 700 1330 L 380 1330 Q 330 1200 320 1000 L 290 560 Q 280 470 330 440 Z" fill="rgba(234,217,181,0.12)" stroke="rgba(234,217,181,0.55)" strokeWidth={5} />
          {/* intestino (ilustrativo) */}
          <g opacity={0.85}>
            {Array.from({ length: 5 }, (_, i) => (
              <path key={i} d={`M ${400 + (i % 2) * 20} ${930 + i * 52} q 45 -34 90 0 t 90 0 t 90 0`} stroke={intest > 0 ? `rgb(${200 + 30 * intest},${130 - 40 * intest},${120 - 40 * intest})` : "#D99A88"} strokeWidth={26} fill="none" strokeLinecap="round" />
            ))}
          </g>
          {/* aorta (centro, junto a la columna) y arteria principal del intestino */}
          <path d="M 585 470 L 585 1240" stroke="#B0352C" strokeWidth={30} strokeLinecap="round" />
          <path d="M 585 830 Q 560 880 640 960" stroke="#C2453A" strokeWidth={16} fill="none" strokeLinecap="round" />
          {/* entrada de la bala (punto) */}
          {entra > 0 ? (
            <g>
              <circle cx={455} cy={1010} r={18 + 30 * (1 - entra)} fill="none" stroke={PAL.dorado} strokeWidth={6} opacity={entra} />
              <circle cx={455} cy={1010} r={9} fill={PAL.dorado} opacity={entra} />
              <circle cx={455} cy={1010} r={40 + 20 * pulso} fill="none" stroke="rgba(242,193,78,0.35)" strokeWidth={4} opacity={entra} />
            </g>
          ) : null}
          {/* aorta y arteria: intactas */}
          {okAorta > 0 ? (
            <g transform={`translate(640 600) scale(${okAorta})`}>
              <circle r={34} fill="#3E8E5A" />
              <path d="M -14 0 L -4 11 L 15 -10" stroke="#FFFFFF" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ) : null}
          {okArteria > 0 ? (
            <g transform={`translate(700 930) scale(${okArteria})`}>
              <circle r={34} fill="#3E8E5A" />
              <path d="M -14 0 L -4 11 L 15 -10" stroke="#FFFFFF" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ) : null}
        </svg>
      ) : null}
      {esquema > 0 ? (
        <>
          <div style={{ position: "absolute", left: 690, top: 548, opacity: esquema * okAorta, fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 40, color: PAL.crema }}>aorta</div>
          <div style={{ position: "absolute", left: 750, top: 880, width: 300, opacity: esquema * okArteria, fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 36, lineHeight: 1.1, color: PAL.crema }}>arteria del intestino</div>
          <div style={{ position: "absolute", left: 40, top: 1250, width: 300, opacity: esquema * intest, fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 36, lineHeight: 1.1, color: "#F2A08E", textAlign: "left" }}>intestino perforado</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1355, textAlign: "center", opacity: 0.7 * esquema, fontFamily: FUENTE_TEXTO, fontWeight: 600, fontSize: 28, color: PAL.pergamino }}>esquema ilustrativo</div>
        </>
      ) : null}
      {/* sangre: casi tres cuartas partes */}
      {sangreParte > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: sangreParte * (1 - 0.35 * desmayo) }}>
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <clipPath id="gota">
                <path d="M 540 470 Q 690 700 700 860 Q 700 1040 540 1050 Q 380 1040 380 860 Q 390 700 540 470 Z" />
              </clipPath>
            </defs>
            <path d="M 540 470 Q 690 700 700 860 Q 700 1040 540 1050 Q 380 1040 380 860 Q 390 700 540 470 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(234,217,181,0.6)" strokeWidth={6} />
            <rect x={370} y={470 + 580 * (1 - nivel)} width={340} height={600} fill="#A3242A" clipPath="url(#gota)" />
            <path d={`M 370 ${470 + 580 * (1 - nivel)} q 40 ${-10 * pulso} 85 0 t 85 0 t 85 0 t 85 0`} stroke="#C9474C" strokeWidth={6} fill="none" clipPath="url(#gota)" />
          </svg>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1080, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 900, fontSize: 64, color: PAL.crema, opacity: lerp(f, fTres - 4, fTres + 6, 0, 1) }}>
            perdió casi <span style={{ color: PAL.dorado }}>3/4</span> de su sangre
          </div>
        </div>
      ) : null}
      {/* se desmaya camino al hospital: la imagen se nubla y pasa la ambulancia */}
      {desmayo > 0 ? (
        <>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 30%, rgba(5,8,16,0.85) 80%)", opacity: desmayo }} />
          <div style={{ position: "absolute", left: 0, top: 0, opacity: desmayo * 0.9, scale: "0.5", transformOrigin: "0 0" }}>
            <Ambulancia x={-300 + (f - fDesmayo) * 34} suelo={2650} f={f} />
          </div>
        </>
      ) : null}
      {/* quirófano: lámpara y reloj de 5 horas */}
      {cirugia > 0 ? (
        <AbsoluteFill style={{ opacity: cirugia }}>
          <div style={{ position: "absolute", left: 340, top: 400, width: 400, height: 120, borderRadius: "200px 200px 60px 60px", background: "linear-gradient(180deg,#C9C4B8,#8A857A)" }} />
          {[-110, 0, 110].map((d) => (
            <div key={d} style={{ position: "absolute", left: 540 + d - 40, top: 470, width: 80, height: 40, borderRadius: 40, background: "#FFF6DC", boxShadow: "0 0 60px rgba(255,240,200,0.9)" }} />
          ))}
          <div style={{ position: "absolute", left: 240, top: 500, width: 600, height: 800, background: "linear-gradient(180deg, rgba(255,240,200,0.25), rgba(255,240,200,0))", clipPath: "polygon(30% 0, 70% 0, 100% 100%, 0 100%)" }} />
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            <circle cx={540} cy={880} r={210} fill="#F3E6C6" stroke={PAL.doradoOscuro} strokeWidth={14} />
            <path d={`M 540 880 L 540 670 A 210 210 0 ${reloj * 150 > 180 ? 1 : 0} 1 ${540 + 210 * Math.sin((reloj * 150 * Math.PI) / 180)} ${880 - 210 * Math.cos((reloj * 150 * Math.PI) / 180)} Z`} fill="rgba(242,193,78,0.55)" />
            {Array.from({ length: 12 }, (_, i) => (
              <line key={i} x1={540 + 180 * Math.sin((i * Math.PI) / 6)} y1={880 - 180 * Math.cos((i * Math.PI) / 6)} x2={540 + 196 * Math.sin((i * Math.PI) / 6)} y2={880 - 196 * Math.cos((i * Math.PI) / 6)} stroke={PAL.tinta} strokeWidth={6} />
            ))}
            <line x1={540} y1={880} x2={540 + 120 * Math.sin((reloj * 150 * Math.PI) / 180)} y2={880 - 120 * Math.cos((reloj * 150 * Math.PI) / 180)} stroke={PAL.tinta} strokeWidth={14} strokeLinecap="round" />
            <line x1={540} y1={880} x2={540 + 170 * Math.sin((reloj * 1800 * Math.PI) / 180)} y2={880 - 170 * Math.cos((reloj * 1800 * Math.PI) / 180)} stroke={PAL.tinta} strokeWidth={7} strokeLinecap="round" />
            <circle cx={540} cy={880} r={14} fill={PAL.tinta} />
          </svg>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1130, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 900, fontSize: 72, color: PAL.crema, opacity: lerp(f, fCinco - 4, fCinco + 6, 0, 1) }}>
            <span style={{ color: PAL.dorado }}>5 horas</span> de cirugía
          </div>
        </AbsoluteFill>
      ) : null}
      <Textura />
      <Sfx archivo="whoosh" en={2} volumen={0.18} />
      <Sfx archivo="marca" en={fAtraveso} volumen={0.3} />
      <Sfx archivo="brillo" en={fAorta} volumen={0.22} />
      <Sfx archivo="brillo" en={fArteria} volumen={0.22} />
      <Sfx archivo="monitor" en={fOperaron} volumen={0.12} />
    </AbsoluteFill>
  );
};

// ---------- 3. LA FE DEL PAPA ----------
const FATIMA3 = { x: 540, suelo: 1260, ancho: 300 };
const Fe: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fAniversario = useMomento("aniversario", 0.12);
  const fFatima = useMomento("fátima", 0.38);
  const fEl = useMomento("juan", 0.45) - 4;
  const fFe = useMomento("expresó", 0.55);
  const fMaria = useMomento("mano", 0.65);
  const fProtegido = useMomento("trayectoria", 0.85);
  const arco = lerp(f, fAniversario, fAniversario + 20, 0, 1);
  const anio1917 = lerp(f, fAniversario + 10, fAniversario + 20, 0, 1);
  const virgen = lerp(f, fFatima - 10, fFatima + 10, 0, 1);
  const enCuarto = lerp(f, fEl - 4, fEl + 6, 0, 1);
  const luz = lerp(f, fMaria - 6, fProtegido + 10, 0, 1);
  const reza = lerp(f, fFe, fFe + 12, 0, 1);
  const bD = { hombro: 12 - 2 * reza, codo: -70 - 40 * reza, mano: "abierta" as const };
  const m = manoDe(400, 1290, 340, bD, 1, false, true);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - enCuarto }}>
        <Camara tomas={[{ f: 0, x: 540, y: 900, z: 1.0 }, { f: fFatima, x: 540, y: 960, z: 1.05 }, { f: fEl, x: 540, y: 1000, z: 1.12 }]} vaiven={0.5}>
          <Terciopelo luz={0.7} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: 110, color: PAL.dorado, textShadow: "0 0 30px rgba(242,193,78,0.45), 0 6px 16px rgba(0,0,0,0.6)" }}>13 de mayo</div>
          {/* 1917 ↔ 1981 */}
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1080} height={10}>
            <path d="M 260 560 Q 540 400 820 560" stroke={PAL.dorado} strokeWidth={6} fill="none" strokeDasharray="700" strokeDashoffset={700 * (1 - arco)} strokeLinecap="round" />
          </svg>
          {[
            { x: 820, t: "1981", s: "Roma", o: 1 },
            { x: 260, t: "1917", s: "Fátima", o: anio1917 },
          ].map((a) => (
            <div key={a.t} style={{ position: "absolute", left: a.x - 150, top: 560, width: 300, textAlign: "center", opacity: a.o }}>
              <div style={{ fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: 84, color: PAL.crema }}>{a.t}</div>
              <div style={{ fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 38, color: PAL.pergamino, opacity: 0.85 }}>{a.s}</div>
            </div>
          ))}
          <div style={{ opacity: virgen, translate: `0px ${(1 - virgen) * 40}px` }}>
            <VirgenFatima x={FATIMA3.x} suelo={FATIMA3.suelo} ancho={FATIMA3.ancho} brillo={virgen} />
          </div>
        </Camara>
      </AbsoluteFill>
      {enCuarto > 0 ? (
        <AbsoluteFill style={{ opacity: enCuarto }}>
          <Camara tomas={[{ f: fEl, x: 560, y: 960, z: 1.05 }, { f: duracion, x: 600, y: 940, z: 1.2 }]}>
            <Habitacion luz={0.4 + 0.6 * luz} />
            {/* imagen mariana enmarcada en la pared */}
            <div style={{ position: "absolute", left: 700, top: 760, width: 230, height: 320, borderRadius: "115px 115px 10px 10px", border: `10px solid ${PAL.doradoOscuro}`, overflow: "hidden", background: "linear-gradient(180deg,#24395F,#4D6A8E)", boxShadow: `0 0 ${60 * luz}px rgba(255,220,150,${0.7 * luz})` }}>
              <div style={{ position: "absolute", left: 0, top: 0 }}>
                <VirgenFatima x={115} suelo={330} ancho={170} columna={false} />
              </div>
            </div>
            {/* luz cálida desde la imagen hacia el papa */}
            <div style={{ position: "absolute", left: 360, top: 760, width: 460, height: 560, background: "linear-gradient(240deg, rgba(255,226,170,0.55), rgba(255,226,170,0))", clipPath: "polygon(78% 0, 100% 14%, 18% 100%, 0 70%)", opacity: luz }} />
            <div style={{ position: "absolute", left: 180, top: 1120, width: 620, height: 230, borderRadius: 30, background: "linear-gradient(180deg,#F2F0EA,#D6D2C8)" }} />
            <Fig quien="jp2" sentado x={400} suelo={1290} ancho={340} giro={0.45} mirada={[10, -6]} cabeza={-4 + 10 * luz} ojos={1 - 0.75 * luz} boca={{ curva: 6 + 4 * luz }} brazoIzq={{ hombro: 10, codo: -110, mano: "abierta" }} brazoDer={bD} semilla={1} />
            <RosarioColgante x={m.x - 6} y={m.y} escala={0.42} balanceo={Math.sin(f / 18) * 0.5} />
            <div style={{ position: "absolute", left: 160, top: 1250, width: 660, height: 100, borderRadius: "30px 30px 0 0", background: "linear-gradient(180deg,#F2F0EA,#D6D2C8)" }} />
          </Camara>
        </AbsoluteFill>
      ) : null}
      <Referencia texto="13 de mayo" aparece={fEl} />
      {/* la frase del papa, en pantalla mientras la voz la dice */}
      {(() => {
        const o = lerp(f, fMaria - 6, fMaria + 6, 0, 1);
        if (o <= 0) return null;
        return (
          <div style={{ position: "absolute", left: 90, right: 90, top: 300, padding: "34px 40px 30px", borderRadius: 22, background: "linear-gradient(180deg,#F3E6C6,#E2CDA0)", boxShadow: "0 18px 40px rgba(0,0,0,0.45)", opacity: o, scale: String(0.94 + 0.06 * o), textAlign: "center" }}>
            <div style={{ fontFamily: FUENTE_SERIFA, fontStyle: "italic", fontSize: 54, lineHeight: 1.22, color: PAL.tinta }}>
              «Una mano materna guió la trayectoria de la bala»
            </div>
            <div style={{ marginTop: 16, fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 34, color: "#7A5A2E" }}>Juan Pablo II</div>
          </div>
        );
      })()}
      <Textura />
      <Sfx archivo="brillo" en={fFatima - 6} volumen={0.25} />
      <Sfx archivo="cuenta" en={fFe + 4} volumen={0.2} />
    </AbsoluteFill>
  );
};

// ---------- 4. EL AGRADECIMIENTO ----------
const Gracias: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fAgradecer = useMomento("agradecer", 0.3);
  const fMas = useMomento("más", 0.42);
  const fProyectiles = useMomento("entregó", 0.6) + 8;
  const fQuedado = useMomento("quedado", 0.72);
  const fHerido = useMomento("atentado", 0.9);
  const camina = lerp(f, 0, fAgradecer - 12, 0, 1, Easing.out(Easing.quad));
  const xPapa = 150 + 300 * camina;
  const reza = lerp(f, fAgradecer - 12, fAgradecer, 0, 1);
  const otro = lerp(f, fMas - 6, fMas + 8, 0, 1);
  const destello = Math.max(0, 1 - Math.abs(f - fMas) / 8);
  const baja = lerp(f, fMas + 4, fProyectiles, 0, 1, Easing.inOut(Easing.cubic));
  const sube = lerp(f, fHerido - 6, duracion, 0, 1, Easing.inOut(Easing.cubic));
  const bala = { x: 560 + (540 - 560) * baja, y: 520 + (950 - 520) * baja - sube * 600 };
  const brazoCam = { hombro: 10 + 4 * Math.sin(f / 5) * (1 - reza), codo: -20 - 90 * reza, mano: "abierta" as const };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - otro }}>
        <Camara tomas={[{ f: 0, x: 500, y: 900, z: 0.95 }, { f: fAgradecer, x: 560, y: 960, z: 1.12 }]} vaiven={0.5}>
          <Santuario />
          {[
            { q: "fiel3" as const, x: 120, s: 1140, a: 150 },
            { q: "fiel2" as const, x: 980, s: 1150, a: 160 },
            { q: "vecina" as const, x: 330, s: 1130, a: 140 },
          ].map((o, i) => (
            <Fig key={i} quien={o.q} x={o.x} suelo={o.s} ancho={o.a} giro={i === 1 ? -0.5 : 0.4} ojos={0.4} brazoIzq={{ hombro: 10, codo: -110, mano: "abierta" }} brazoDer={{ hombro: 10, codo: -110, mano: "abierta" }} semilla={i + 3} />
          ))}
          <Capilla x={800} suelo={1260} />
          <VirgenFatima x={800} suelo={1000} ancho={170} brillo={0.4 + 0.6 * reza} />
          <Fig quien="jp2" x={xPapa} suelo={1300} ancho={300} caminando={1 - reza} paso={f / 18} giro={0.5} mirada={[8, -4]} cabeza={10 * reza} ojos={1 - 0.8 * reza} boca={{ curva: 6 }} brazoIzq={reza > 0.5 ? { hombro: 10, codo: -110, mano: "abierta" } : brazoCam} brazoDer={reza > 0.5 ? { hombro: 10, codo: -110, mano: "abierta" } : brazoCam} semilla={1} />
        </Camara>
      </AbsoluteFill>
      {otro > 0 ? (
        <AbsoluteFill style={{ opacity: otro }}>
          <Camara tomas={[{ f: fMas, x: 540, y: 960, z: 1.0 }, { f: fHerido - 6, x: 540, y: 940, z: 1.08 }, { f: duracion, x: 540, y: 350, z: 1.4 }]} vaiven={0.4}>
            <Terciopelo luz={0.9} />
            {/* almohadón de terciopelo sostenido por dos manos */}
            <ManoGrande x={300} y={1250} rot={20} escala={1.3} />
            <ManoGrande x={780} y={1250} rot={-20} espejo escala={1.3} />
            <div style={{ position: "absolute", left: 300, top: 990, width: 480, height: 150, borderRadius: 50, background: "linear-gradient(180deg,#3E5A9E,#22386E)", boxShadow: "0 18px 30px rgba(0,0,0,0.45)" }} />
            <div style={{ position: "absolute", left: 330, top: 1000, width: 420, height: 30, borderRadius: 30, background: "rgba(255,255,255,0.15)" }} />
            {/* mano que deja el proyectil */}
            {f < fProyectiles + 16 ? <ManoGrande x={bala.x + 60} y={bala.y - 120 - lerp(f, fProyectiles, fProyectiles + 16, 0, 260)} rot={170} escala={1.0} pinza={1 - lerp(f, fProyectiles, fProyectiles + 6, 0, 1)} /> : null}
            <Bala x={bala.x} y={bala.y} largo={150} rot={-10 + 10 * baja - 90 * sube} brillo={0.4 + 0.6 * sube} luz={sube > 0 ? sube : undefined} />
            {sube > 0 ? <div style={{ position: "absolute", left: bala.x - 200, top: bala.y - 200, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,226,170,0.45), rgba(255,226,170,0) 65%)" }} /> : null}
          </Camara>
          <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,233,176,0.9), rgba(255,233,176,0) 70%)", opacity: destello }} />
        </AbsoluteFill>
      ) : null}
      <Referencia texto="13 de mayo de 1982 · Fátima" aparece={6} hasta={fMas - 8} />
      {/* recuerdo: la bala había quedado en el vehículo del atentado */}
      {(() => {
        const o = lerp(f, fQuedado - 6, fQuedado + 6, 0, 1) * (1 - lerp(f, fHerido + 4, fHerido + 14, 0, 1));
        if (o <= 0) return null;
        return (
          <div style={{ position: "absolute", left: 90, top: 300, width: 420, height: 420, borderRadius: 210, overflow: "hidden", border: `10px solid ${PAL.doradoOscuro}`, opacity: o, scale: String(0.9 + 0.1 * o), boxShadow: "0 14px 34px rgba(0,0,0,0.5)", background: "linear-gradient(180deg,#B9A27A,#8E7552)", filter: "sepia(0.6)" }}>
            <div style={{ position: "absolute", left: 0, top: 0, scale: "0.62", transformOrigin: "0 0" }}>
              <Papamovil x={340} suelo={480} e={1} />
              <Bala x={250} y={445} largo={40} rot={8} brillo={1} />
            </div>
          </div>
        );
      })()}
      <Textura />
      <Sfx archivo="paso" en={4} volumen={0.25} />
      <Sfx archivo="paso" en={20} volumen={0.25} />
      <Sfx archivo="paso" en={36} volumen={0.25} />
      <Sfx archivo="brillo" en={fMas - 4} volumen={0.3} />
      <Sfx archivo="tela" en={fProyectiles} volumen={0.3} />
      <Sfx archivo="whoosh" en={fHerido} volumen={0.22} />
    </AbsoluteFill>
  );
};

// ---------- 5. EL LUGAR DE LA BALA ----------
const LugarBala: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fIncorporada = useMomento("incorporada", 0.12);
  const fRealizada = useMomento("realizada", 0.22);
  const fTreinta = useMomento("treinta", 0.42);
  const fAtentado = useMomento("atentado", 0.6);
  const fQuedo = useMomento("quedó", 0.65);
  const fOfrenda = useMomento("ofrenda", 0.85);
  const entra = lerp(f, 0, fIncorporada + 6, 0, 1, Easing.out(Easing.cubic));
  const balaY = balaMundo.y - 46 * (1 - entra);
  const encajada = entra >= 1;
  const linea = lerp(f, fTreinta - 4, fTreinta + 16, 0, 1);
  const anios = lerp(f, fTreinta + 8, fTreinta + 18, 0, 1);
  const tl = lerp(f, fTreinta - 8, fTreinta, 0, 1) * (1 - lerp(f, fAtentado + 2, fAtentado + 10, 0, 1));
  const imagen = lerp(f, fOfrenda - 4, fOfrenda + 12, 0, 1);
  const destello = encajada ? Math.max(0, 1 - (f - fIncorporada - 6) / 14) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - imagen }}>
        <Camara
          tomas={[
            { f: 0, x: balaMundo.x, y: balaMundo.y - 20, z: 3.4 },
            { f: fIncorporada + 10, x: balaMundo.x, y: balaMundo.y, z: 3.1 },
            { f: fRealizada, x: 540, y: 820, z: 1.0 },
            { f: fRealizada + 26, x: 360, y: 900, z: 1.6 },
            { f: fTreinta - 10, x: 700, y: 900, z: 1.6 },
            { f: fTreinta + 6, x: 540, y: 900, z: 1.0 },
            { f: fAtentado + 6, x: 540, y: 900, z: 1.0 },
            { f: fQuedo + 10, x: balaMundo.x, y: balaMundo.y + 20, z: 3.2 },
            { f: fOfrenda, x: balaMundo.x, y: balaMundo.y + 30, z: 3.0 },
          ]}
          vaiven={0.4}
        >
          <Terciopelo />
          <div style={{ position: "absolute", left: COR.x, top: COR.y }}>
            <div style={{ opacity: lerp(f, 0, 10, 0, 1) }}>
              <Corona w={COR.w} vacia brillo={0.5 + 0.5 * destello} />
            </div>
          </div>
          <Bala x={balaMundo.x} y={balaY} largo={(COR.w / 600) * 48} rot={-90} brillo={0.6} luz={lerp(f, 0, fIncorporada + 14, 0, 1)} />
          {f > fQuedo ? <div style={{ position: "absolute", left: balaMundo.x - 40, top: balaMundo.y - 40, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,244,214,0.75), rgba(255,244,214,0) 70%)", opacity: lerp(f, fQuedo, fQuedo + 12, 0, 1) * (0.6 + 0.4 * Math.sin(f / 7)), mixBlendMode: "screen" }} /> : null}
          {destello > 0 ? <div style={{ position: "absolute", left: balaMundo.x - 120, top: balaMundo.y - 120, width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,240,200,${destello}), rgba(255,240,200,0) 65%)` }} /> : null}
          {/* línea temporal 1942 → 1981 */}
          <div style={{ position: "absolute", left: 120, top: 1080, width: 840, opacity: tl }}>
            <div style={{ position: "absolute", left: 0, top: 50, width: 840 * linea, height: 8, borderRadius: 4, background: PAL.dorado }} />
            <div style={{ position: "absolute", left: -20, top: 34, width: 40, height: 40, borderRadius: 20, background: PAL.dorado }} />
            <div style={{ position: "absolute", left: -100, top: 90, width: 200, textAlign: "center", fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: 64, color: PAL.crema }}>1942</div>
            <div style={{ opacity: linea >= 1 ? 1 : 0 }}>
              <div style={{ position: "absolute", left: 820, top: 34, width: 40, height: 40, borderRadius: 20, background: PAL.crema }} />
              <div style={{ position: "absolute", left: 740, top: 90, width: 200, textAlign: "center", fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: 64, color: PAL.crema }}>1981</div>
            </div>
            <div style={{ position: "absolute", left: 220, top: -50, width: 400, textAlign: "center", opacity: anios, scale: String(0.8 + 0.2 * anios), fontFamily: FUENTE_TEXTO, fontWeight: 900, fontSize: 70, color: PAL.dorado, textShadow: "0 0 24px rgba(242,193,78,0.5)" }}>39 años</div>
          </div>
        </Camara>
      </AbsoluteFill>
      {imagen > 0 ? (
        <AbsoluteFill style={{ opacity: imagen }}>
          <Camara tomas={[{ f: fOfrenda, x: 540, y: 820, z: 1.45 }, { f: duracion, x: 540, y: 860, z: 1.25 }]} vaiven={0.4}>
            <Terciopelo />
            <VirgenFatima x={540} suelo={1360} ancho={460} corona brillo={1} />
          </Camara>
        </AbsoluteFill>
      ) : null}
      <Referencia texto="Corona realizada en 1942" aparece={fRealizada} hasta={fTreinta - 6} />
      <Textura />
      <Sfx archivo="cuenta" en={fIncorporada + 4} volumen={0.35} />
      <Sfx archivo="brillo" en={fIncorporada + 4} volumen={0.3} />
      <Sfx archivo="brillo" en={fQuedo + 6} volumen={0.25} />
    </AbsoluteFill>
  );
};

// ---------- 6. CIERRE: el brillo de la corona → libro abierto ----------
const Cierre: React.FC<PropsEscena> = (p) => {
  const f = useCurrentFrame();
  const libro = lerp(f, 12, 24, 0, 1);
  const luz = lerp(f, 0, 14, 0, 1);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - libro }}>
        <Camara tomas={[{ f: 0, x: 540, y: 860, z: 1.25 }, { f: 24, x: 540, y: 640, z: 2.2 }]}>
          <Terciopelo />
          <VirgenFatima x={540} suelo={1360} ancho={460} corona brillo={1} />
        </Camara>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(255,233,176,1), rgba(255,233,176,0) 70%)", opacity: luz }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: libro }}>
        <Sequence from={-14} layout="none">
          <CierreCanal {...p} />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ESCENAS_FATIMA: Record<string, React.FC<{ escena: EscenaAnimada }>> = {
  "fatima/apertura": Apertura,
  "fatima/atentado": Atentado,
  "fatima/medica": Medica,
  "fatima/fe": Fe,
  "fatima/gracias": Gracias,
  "fatima/corona": LugarBala,
  "fatima/cierre": Cierre,
};

void osc;
void HABITACION;
void Fecha;
