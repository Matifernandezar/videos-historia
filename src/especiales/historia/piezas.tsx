// Piezas propias del canal de historia (reutilizables en todos los videos):
// hilo dorado, placas, pergamino, humo, ceniza, corona, bustos y figuras del siglo XVII,
// estandartes, mapa de las Islas Británicas y cierre de marca.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FUENTE_SERIFA, FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { azar } from "../ambiente";

export const H = {
  noche: "#0D1B2A",
  nocheAlta: "#16283D",
  pergamino: "#E8DCC4",
  pergaminoOscuro: "#C9B68F",
  tinta: "#2B2118",
  dorado: "#D4AF37",
  doradoClaro: "#F6DE8A",
  lacre: "#8B1E24",
  lacreClaro: "#B5333A",
  hierro: "#4A5568",
  hierroClaro: "#8794A8",
  bronce: "#8C6239",
  azulBando: "#2F5D8C",
  piel: "#D9B594",
  pielSombra: "#B58E6E",
};

export const cl = (v: number) => Math.max(0, Math.min(1, v));
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const SUAVE = Easing.inOut(Easing.cubic);
export const SALE = Easing.out(Easing.cubic);
export const rampa = (f: number, a: number, b: number, e: (n: number) => number = SUAVE) => interpolate(f, [a, Math.max(a + 1, b)], [0, 1], { ...CLAMP, easing: e });
export const useIdSvg = () => React.useId().replace(/[^a-zA-Z0-9]/g, "");

export type Pt = [number, number];

// ---------- hilo dorado ----------
// Curva suave (Catmull-Rom) que pasa por los puntos dados.
export const suavizar = (pts: Pt[], porTramo = 12): Pt[] => {
  if (pts.length < 3) return pts;
  const out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < porTramo; k++) {
      const t = k / porTramo;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};

// Tramo [a, b] (fracciones del largo) de una polilínea.
export const cortar = (pts: Pt[], a: number, b: number): Pt[] => {
  const L = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = L[L.length - 1] || 1;
  const la = cl(a) * total;
  const lb = cl(b) * total;
  const en = (l: number): Pt => {
    let i = 1;
    while (i < L.length - 1 && L[i] < l) i++;
    const t = (l - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]);
    return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t];
  };
  const out: Pt[] = [en(la)];
  for (let i = 0; i < pts.length; i++) if (L[i] > la && L[i] < lb) out.push(pts[i]);
  out.push(en(lb));
  return out;
};
export const dDe = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");

// Destello de cuatro puntas (cabeza del hilo, brillos).
export const Destello: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({ x, y, r = 26, o = 1 }) => {
  const f = useCurrentFrame();
  const k = 0.8 + 0.2 * Math.sin(f / 2.3);
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <circle r={r * 1.6} fill="#F6DE8A" opacity={0.16} />
      <circle r={r * 0.8} fill="#F6DE8A" opacity={0.3} />
      <g transform={`rotate(${f * 3}) scale(${k})`}>
        <path d={`M 0 ${-r * 1.5} L ${r * 0.14} ${-r * 0.14} L ${r * 1.5} 0 L ${r * 0.14} ${r * 0.14} L 0 ${r * 1.5} L ${-r * 0.14} ${r * 0.14} L ${-r * 1.5} 0 L ${-r * 0.14} ${-r * 0.14} Z`} fill="#FFF6D0" />
      </g>
      <circle r={r * 0.3} fill="#FFFFFF" />
    </g>
  );
};

// El hilo: se dibuja de 0 a `p`; con `cola` el inicio también avanza (segmento que viaja).
// Va dentro de un <svg>. `ondula` = vaivén vivo en px.
export const HiloG: React.FC<{ pts: Pt[]; p: number; cola?: number; grosor?: number; chispa?: boolean; o?: number; ondula?: number; crudo?: boolean; color?: string }> = ({
  pts,
  p,
  cola = 0,
  grosor = 6,
  chispa = true,
  o = 1,
  ondula = 3,
  crudo = false,
  color = H.dorado,
}) => {
  const f = useCurrentFrame();
  if (p <= 0.001 || o <= 0.001 || cola >= p) return null;
  let base = crudo ? pts : suavizar(pts);
  if (ondula) base = base.map(([x, y], i) => [x + Math.sin(f / 13 + i * 0.21) * ondula, y + Math.cos(f / 11 + i * 0.17) * ondula] as Pt);
  const tramo = cortar(base, cola, p);
  const d = dDe(tramo);
  const cab = tramo[tramo.length - 1];
  const comun = { fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, d };
  return (
    <g opacity={o}>
      <path {...comun} stroke="#F6DE8A" strokeWidth={grosor * 5} opacity={0.1} />
      <path {...comun} stroke="#F6DE8A" strokeWidth={grosor * 2.4} opacity={0.28} />
      <path {...comun} stroke={color} strokeWidth={grosor} />
      <path {...comun} stroke="#FFF6D0" strokeWidth={grosor * 0.3} opacity={0.9} />
      {chispa && p < 0.995 ? <Destello x={cab[0]} y={cab[1]} r={grosor * 3.4} /> : null}
    </g>
  );
};
export const Hilo: React.FC<React.ComponentProps<typeof HiloG>> = (props) => (
  <svg width={10} height={10} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
    <HiloG {...props} />
  </svg>
);

// ---------- placas y textos ----------
// Placa discreta (dato en pantalla). `metal` = placa de bronce y oro, más grande.
export const Placa: React.FC<{ texto: string; aparece: number; hasta?: number; y?: number; tam?: number; metal?: boolean }> = ({ texto, aparece, hasta = 99999, y = 360, tam = 38, metal = false }) => {
  const f = useCurrentFrame();
  const o = rampa(f, aparece, aparece + 10) * (1 - rampa(f, hasta, hasta + 10));
  if (o <= 0) return null;
  const sube = interpolate(f, [aparece, aparece + 14], [22, 0], { ...CLAMP, easing: SALE });
  const brillo = interpolate(f, [aparece + 8, aparece + 34], [-30, 130], CLAMP);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y + sube, display: "flex", justifyContent: "center", opacity: o }}>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          padding: `${tam * 0.36}px ${tam * 0.8}px`,
          borderRadius: metal ? 10 : 8,
          background: metal ? "linear-gradient(180deg,#A67B45 0%,#6E4A26 55%,#8C6239 100%)" : "rgba(13,27,42,0.88)",
          border: `${metal ? 5 : 3}px solid ${H.dorado}`,
          boxShadow: metal ? "0 14px 34px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,236,170,0.5), inset 0 -4px 8px rgba(0,0,0,0.4)" : "0 10px 26px rgba(0,0,0,0.5)",
          fontFamily: FUENTE_TEXTO,
          fontWeight: 800,
          fontSize: tam,
          color: metal ? "#FBE9B0" : H.pergamino,
          textShadow: metal ? "0 2px 0 rgba(60,35,10,0.9), 0 -1px 0 rgba(255,240,190,0.35)" : "none",
          whiteSpace: "nowrap",
          letterSpacing: tam * 0.09,
        }}
      >
        {texto}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${brillo}%`, width: "22%", background: "linear-gradient(90deg,rgba(255,246,208,0),rgba(255,246,208,0.45),rgba(255,246,208,0))", transform: "skewX(-20deg)" }} />
      </div>
    </div>
  );
};

// Nombre de un personaje (rótulo sobrio, serifa).
export const Nombre: React.FC<{ texto: string; aparece: number; hasta?: number; x?: number; y: number; tam?: number }> = ({ texto, aparece, hasta = 99999, x = 540, y, tam = 44 }) => {
  const f = useCurrentFrame();
  const o = rampa(f, aparece, aparece + 12) * (1 - rampa(f, hasta, hasta + 10));
  if (o <= 0) return null;
  const w = rampa(f, aparece + 4, aparece + 22, SALE);
  return (
    <div style={{ position: "absolute", left: x - 500, width: 1000, top: y, textAlign: "center", opacity: o }}>
      <div style={{ fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: tam, color: H.pergamino, letterSpacing: 5, textShadow: "0 4px 14px rgba(0,0,0,0.85), 0 0 3px rgba(0,0,0,0.9)" }}>{texto}</div>
      <div style={{ margin: "8px auto 0", width: 300 * w, height: 4, borderRadius: 2, background: H.dorado, boxShadow: "0 0 14px rgba(246,222,138,0.8)" }} />
    </div>
  );
};

// Texto grande que el hilo "escribe": se revela de izquierda a derecha, con la chispa en el borde.
export const TextoHilado: React.FC<{ texto: string; p: number; y: number; tam?: number; x?: number; ancho?: number; color?: string; o?: number }> = ({ texto, p, y, tam = 96, x = 540, ancho = 960, color = H.dorado, o = 1 }) => {
  if (p <= 0 || o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x - ancho / 2, top: y, width: ancho, opacity: o }}>
      <div
        style={{
          fontFamily: FUENTE_TITULO,
          fontWeight: 900,
          fontSize: tam,
          lineHeight: 1.05,
          textAlign: "center",
          color,
          letterSpacing: 2,
          textShadow: "0 0 26px rgba(246,222,138,0.55), 0 6px 16px rgba(0,0,0,0.7)",
          clipPath: `inset(-20% ${100 - p * 100}% -20% 0)`,
        }}
      >
        {texto}
      </div>
      <svg width={ancho} height={tam * 2} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <path d={`M 0 ${tam * 1.22} L ${ancho * p} ${tam * 1.22}`} stroke={H.dorado} strokeWidth={5} strokeLinecap="round" opacity={0.9} />
        {p < 0.99 ? <Destello x={ancho * p} y={tam * 0.62} r={20} /> : null}
      </svg>
    </div>
  );
};

// ---------- fondos y atmósfera ----------
export const FondoPergamino: React.FC<{ oscuro?: number; x?: number; y?: number; w?: number; h?: number }> = ({ oscuro = 0, x = 0, y = 0, w = 1080, h = 1920 }) => {
  const id = useIdSvg();
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: x, top: y }}>
      <defs>
        <radialGradient id={`pg${id}`} cx="50%" cy="45%" r="75%">
          <stop offset="0%" stopColor="#EFE4CC" />
          <stop offset="65%" stopColor="#DCCBA6" />
          <stop offset="100%" stopColor="#A98F62" />
        </radialGradient>
        <filter id={`pf${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={3} seed={9} />
          <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.24  0 0 0 0 0.12  0 0 0 0.55 -0.12" />
        </filter>
      </defs>
      <rect width={w} height={h} fill={`url(#pg${id})`} />
      <rect width={w} height={h} filter={`url(#pf${id})`} opacity={0.75} />
      {oscuro > 0 ? <rect width={w} height={h} fill={H.noche} opacity={oscuro} /> : null}
    </svg>
  );
};

// Trama de grabado (líneas finas cruzadas) sobre toda la toma.
export const Grabado: React.FC<{ fuerza?: number; color?: string }> = ({ fuerza = 1, color = "#0A0F18" }) => {
  const id = useIdSvg();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.2 * fuerza, pointerEvents: "none" }}>
      <defs>
        <pattern id={`gr${id}`} width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
          <line x1={0} y1={0} x2={0} y2={9} stroke={color} strokeWidth={2.2} />
        </pattern>
        <pattern id={`gs${id}`} width={13} height={13} patternUnits="userSpaceOnUse" patternTransform="rotate(-52)">
          <line x1={0} y1={0} x2={0} y2={13} stroke={color} strokeWidth={1.4} />
        </pattern>
      </defs>
      <rect width={1080} height={1920} fill={`url(#gr${id})`} />
      <rect width={1080} height={1920} fill={`url(#gs${id})`} opacity={0.6} />
    </svg>
  );
};

// Humo que sube y se deshace (pólvora, incendio, niebla). Coordenadas del mundo.
export const Humo: React.FC<{ x: number; y: number; ancho: number; alto: number; n?: number; color?: string; fuerza?: number; semilla?: number; vel?: number; r?: number }> = ({
  x,
  y,
  ancho,
  alto,
  n = 14,
  color = "#3A4250",
  fuerza = 0.7,
  semilla = 0,
  vel = 1,
  r = 150,
}) => {
  const f = useCurrentFrame();
  const id = useIdSvg();
  if (fuerza <= 0.01) return null;
  return (
    <svg width={10} height={10} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      <defs>
        <filter id={`hu${id}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={34} />
        </filter>
      </defs>
      <g filter={`url(#hu${id})`} opacity={fuerza}>
        {Array.from({ length: n }, (_, i) => {
          const s = i + semilla * 31;
          const t = ((azar(s) + (f * vel * (0.0022 + azar(s + 5) * 0.0018))) % 1 + 1) % 1;
          const bx = x + azar(s + 1) * ancho + Math.sin(f / 60 + i) * 40 + t * 90 * (azar(s + 9) - 0.3);
          const by = y - t * alto;
          return <circle key={i} cx={bx} cy={by} r={r * (0.5 + t * 1.1) * (0.6 + azar(s + 2) * 0.7)} fill={color} opacity={Math.sin(Math.PI * t) * 0.75} />;
        })}
      </g>
    </svg>
  );
};

// Ceniza / brasas / polvo dorado que flota. `sube` > 0 sube, < 0 cae.
export const Ceniza: React.FC<{ n?: number; color?: string; color2?: string; sube?: number; semilla?: number; o?: number; x?: number; y?: number; ancho?: number; alto?: number; tam?: number }> = ({
  n = 40,
  color = "#F2B36B",
  color2 = "#9AA3B0",
  sube = 1,
  semilla = 0,
  o = 1,
  x = 0,
  y = 0,
  ancho = 1080,
  alto = 1920,
  tam = 1,
}) => {
  const f = useCurrentFrame();
  if (o <= 0.01) return null;
  return (
    <svg width={10} height={10} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none", opacity: o }}>
      {Array.from({ length: n }, (_, i) => {
        const s = i * 7 + semilla * 53;
        const v = (0.6 + azar(s) * 1.6) * sube;
        const yy = y + ((((azar(s + 1) * alto - f * v) % alto) + alto) % alto);
        const xx = x + azar(s + 2) * ancho + Math.sin(f / (22 + (i % 9) * 5) + i) * 26;
        const r = (1.6 + azar(s + 3) * 3.4) * tam;
        return <rect key={i} x={xx} y={yy} width={r * 1.6} height={r} rx={r * 0.4} transform={`rotate(${f * (1 + azar(s + 4) * 3) + i * 40} ${xx} ${yy})`} fill={i % 3 === 0 ? color : color2} opacity={0.35 + 0.5 * (0.5 + 0.5 * Math.sin(f / 9 + i))} />;
      })}
    </svg>
  );
};

// Lluvia fina inglesa.
export const Llovizna: React.FC<{ fuerza?: number }> = ({ fuerza = 1 }) => {
  const f = useCurrentFrame();
  if (fuerza <= 0.01) return null;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: fuerza }}>
      {Array.from({ length: 120 }, (_, i) => {
        const v = 30 + azar(i * 3) * 16;
        const yy = ((azar(i * 29) * 2200 + f * v) % 2200) - 140;
        const xx = azar(i * 13) * 1400 - 100 - yy * 0.12;
        const l = 26 + azar(i * 7) * 30;
        return <line key={i} x1={xx} y1={yy} x2={xx - l * 0.12} y2={yy + l} stroke="#C9D6E6" strokeWidth={1.2 + azar(i)} opacity={0.16 + 0.22 * azar(i * 5)} strokeLinecap="round" />;
      })}
    </svg>
  );
};

// ---------- corona ----------
// Corona real (dibujo propio). viewBox 0 0 400 330. `mitad` recorta medio lado (para partirla).
export const Corona: React.FC<{ w?: number; mitad?: "izq" | "der"; apagada?: number }> = ({ w = 400, mitad, apagada = 0 }) => {
  const id = useIdSvg();
  const joya = (x: number, y: number, c: string, r = 11) => (
    <g>
      <circle cx={x} cy={y} r={r + 3} fill="#7A5A16" />
      <circle cx={x} cy={y} r={r} fill={c} />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.3} fill="#FFFFFF" opacity={0.7} />
    </g>
  );
  return (
    <svg width={w} height={(w * 330) / 400} viewBox="0 0 400 330" style={{ overflow: "visible", display: "block", filter: apagada ? `saturate(${1 - apagada * 0.8}) brightness(${1 - apagada * 0.6})` : undefined }}>
      <defs>
        <linearGradient id={`co${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F6DE8A" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8E6B14" />
        </linearGradient>
        <clipPath id={`cm${id}`}>
          {mitad === "izq" ? <path d="M -60 -60 L 205 -60 L 188 60 L 214 120 L 186 190 L 210 260 L 196 400 L -60 400 Z" /> : mitad === "der" ? <path d="M 460 -60 L 205 -60 L 188 60 L 214 120 L 186 190 L 210 260 L 196 400 L 460 400 Z" /> : <rect x={-80} y={-80} width={560} height={500} />}
        </clipPath>
      </defs>
      <g clipPath={`url(#cm${id})`}>
        {/* terciopelo */}
        <path d="M 62 250 C 50 150 110 70 200 62 C 290 70 350 150 338 250 Z" fill={H.lacre} />
        <path d="M 200 62 C 290 70 350 150 338 250 L 250 250 C 262 170 240 100 200 62 Z" fill="#5E1218" opacity={0.6} />
        {/* arcos */}
        <path d="M 62 240 C 60 130 130 62 200 54 C 270 62 340 130 338 240" fill="none" stroke={`url(#co${id})`} strokeWidth={16} />
        <path d="M 200 56 L 200 250" stroke={`url(#co${id})`} strokeWidth={15} />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={200} cy={92 + i * 34} r={6} fill="#FFF6D0" />
        ))}
        {[0, 1, 2, 3].map((i) => {
          const t = 0.18 + i * 0.2;
          return <circle key={`a${i}`} cx={66 + (200 - 66) * t * 1.05} cy={232 - 180 * Math.sin((t * Math.PI) / 1.6)} r={5.5} fill="#FFF6D0" />;
        })}
        {[0, 1, 2, 3].map((i) => {
          const t = 0.18 + i * 0.2;
          return <circle key={`b${i}`} cx={334 - (334 - 200) * t * 1.05} cy={232 - 180 * Math.sin((t * Math.PI) / 1.6)} r={5.5} fill="#FFF6D0" />;
        })}
        {/* orbe y cruz */}
        <circle cx={200} cy={42} r={19} fill={`url(#co${id})`} stroke="#7A5A16" strokeWidth={3} />
        <path d="M 193 -22 L 207 -22 L 207 -6 L 222 -6 L 222 8 L 207 8 L 207 26 L 193 26 L 193 8 L 178 8 L 178 -6 L 193 -6 Z" fill={`url(#co${id})`} stroke="#7A5A16" strokeWidth={3} />
        {/* puntas: cruces y flores */}
        {[70, 200, 330].map((x) => (
          <path key={x} d={`M ${x - 9} 238 L ${x - 9} 214 L ${x - 26} 214 L ${x - 26} 196 L ${x - 9} 196 L ${x - 9} 176 L ${x + 9} 176 L ${x + 9} 196 L ${x + 26} 196 L ${x + 26} 214 L ${x + 9} 214 L ${x + 9} 238 Z`} fill={`url(#co${id})`} stroke="#7A5A16" strokeWidth={3} />
        ))}
        {[135, 265].map((x) => (
          <path key={x} d={`M ${x} 238 C ${x - 30} 222 ${x - 26} 196 ${x} 178 C ${x + 26} 196 ${x + 30} 222 ${x} 238 Z`} fill={`url(#co${id})`} stroke="#7A5A16" strokeWidth={3} />
        ))}
        {/* aro */}
        <path d="M 44 236 C 120 262 280 262 356 236 L 356 296 C 280 322 120 322 44 296 Z" fill={`url(#co${id})`} stroke="#7A5A16" strokeWidth={4} />
        <path d="M 44 246 C 120 272 280 272 356 246" fill="none" stroke="#FFF6D0" strokeWidth={3} opacity={0.7} />
        <path d="M 44 290 C 120 316 280 316 356 290" fill="none" stroke="#7A5A16" strokeWidth={3} opacity={0.7} />
        {joya(200, 286, H.lacreClaro, 15)}
        {joya(120, 277, "#2F6DA8", 12)}
        {joya(280, 277, "#2F6DA8", 12)}
        {joya(66, 262, "#2E8B57", 9)}
        {joya(334, 262, "#2E8B57", 9)}
      </g>
    </svg>
  );
};

// ---------- bustos (retratos por capas, originales y estilizados) ----------
export type TipoBusto = "carlos1" | "cromwell" | "carlos2" | "richard" | "puritano";
// viewBox 0 0 400 520 (cabeza en 200,215). `sombra` 0..1 = luz lateral dramática (lado derecho en sombra).
export const Busto: React.FC<{ tipo: TipoBusto; w?: number; sombra?: number; silueta?: number; respira?: boolean; corona?: boolean }> = ({ tipo, w = 400, sombra = 0.45, silueta = 0, respira = true, corona = false }) => {
  const f = useCurrentFrame();
  const id = useIdSvg();
  const sube = respira ? Math.sin(f / 26) * 2.2 : 0;
  const parp = (f + (tipo.length * 37)) % 110 < 5 ? 0.15 : 1;
  const pelo = tipo === "carlos1" ? "#4A3323" : tipo === "cromwell" ? "#5C5046" : tipo === "carlos2" ? "#15110F" : tipo === "richard" ? "#5A4230" : "#3B2E24";
  const ropa = tipo === "carlos1" ? "#1E2A44" : tipo === "cromwell" ? "#5B6676" : tipo === "carlos2" ? H.lacre : "#17191E";
  return (
    <svg width={w} height={(w * 520) / 400} viewBox="0 0 400 520" style={{ overflow: "visible", display: "block", filter: silueta ? `brightness(${1 - silueta * 0.93}) saturate(${1 - silueta * 0.7})` : undefined }}>
      <defs>
        <linearGradient id={`ar${id}`} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#B4BFCE" />
          <stop offset="40%" stopColor="#6A7688" />
          <stop offset="100%" stopColor="#2C3440" />
        </linearGradient>
        <clipPath id={`cb${id}`}>
          <rect x={-100} y={-140} width={600} height={660} />
        </clipPath>
        <clipPath id={`cs${id}`}>
          <path d="M 214 -140 C 250 100 236 300 262 540 L 500 540 L 500 -140 Z" />
        </clipPath>
        <filter id={`fs${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feColorMatrix values="0 0 0 0 0.03  0 0 0 0 0.04  0 0 0 0 0.08  0 0 0 1 0" />
        </filter>
      </defs>
      <g clipPath={`url(#cb${id})`} id={`bu${id}`}>
        {/* pelo detrás */}
        {tipo === "carlos2" ? (
          <path d="M 200 96 C 110 86 78 170 92 240 C 60 290 70 360 96 420 C 110 450 150 450 160 420 L 240 420 C 250 450 290 450 304 420 C 330 360 340 290 308 240 C 322 170 290 86 200 96 Z" fill={pelo} />
        ) : tipo === "puritano" ? (
          <path d="M 132 200 C 122 260 128 320 140 350 L 260 350 C 272 320 278 260 268 200 Z" fill={pelo} />
        ) : (
          <path d={`M 200 118 C 126 112 108 190 118 250 C 104 300 108 ${tipo === "carlos1" ? 390 : 360} 132 ${tipo === "carlos1" ? 400 : 368} L 268 ${tipo === "carlos1" ? 400 : 368} C 292 ${tipo === "carlos1" ? 390 : 360} 296 300 282 250 C 292 190 274 112 200 118 Z`} fill={pelo} />
        )}
        {/* torso */}
        <g transform={`translate(0 ${sube})`}>
          <path d="M 20 540 C 24 440 60 396 150 372 L 250 372 C 340 396 376 440 380 540 Z" fill={tipo === "cromwell" ? `url(#ar${id})` : ropa} />
          {tipo === "cromwell" ? (
            <g>
              <path d="M 200 380 L 200 540" stroke="#2C3440" strokeWidth={4} opacity={0.7} />
              <path d="M 60 420 C 120 400 160 398 200 400 C 240 398 280 400 340 420" fill="none" stroke="#C9D3E0" strokeWidth={4} opacity={0.6} />
              {[90, 130, 270, 310].map((x) => (
                <circle key={x} cx={x} cy={430 + Math.abs(200 - x) * 0.12} r={6} fill="#D4AF37" />
              ))}
              <path d="M 40 470 C 100 452 150 448 200 450" fill="none" stroke="#DCE4EE" strokeWidth={6} opacity={0.35} />
            </g>
          ) : null}
          {tipo === "carlos1" ? (
            <g>
              <path d="M 96 392 L 330 540 L 290 540 L 76 404 Z" fill={H.lacre} />
              <path d="M 96 392 L 330 540" stroke="#D4AF37" strokeWidth={4} />
              <g transform="translate(270 462)">
                {Array.from({ length: 8 }, (_, i) => (
                  <path key={i} d="M 0 -26 L 5 0 L 0 26 L -5 0 Z" fill="#E9EDF2" transform={`rotate(${i * 22.5})`} />
                ))}
                <circle r={9} fill={H.lacreClaro} stroke="#D4AF37" strokeWidth={3} />
              </g>
              {[410, 440, 470, 500].map((y) => (
                <circle key={y} cx={200} cy={y + 8} r={5} fill="#D4AF37" />
              ))}
            </g>
          ) : null}
          {tipo === "carlos2" ? (
            <g>
              <path d="M 20 540 C 24 440 60 396 150 372 L 176 372 L 150 540 Z" fill="#F4EFE6" />
              <path d="M 380 540 C 376 440 340 396 250 372 L 224 372 L 250 540 Z" fill="#F4EFE6" />
              {[[70, 440], [110, 410], [96, 490], [140, 460], [330, 440], [290, 410], [304, 490], [260, 460], [58, 510], [342, 510]].map(([x, y], i) => (
                <path key={i} d={`M ${x} ${y - 9} L ${x + 5} ${y + 8} L ${x - 5} ${y + 8} Z`} fill="#16130F" />
              ))}
              <path d="M 150 400 C 180 440 220 440 250 400" fill="none" stroke="#D4AF37" strokeWidth={9} />
              <circle cx={200} cy={436} r={14} fill="#D4AF37" stroke="#7A5A16" strokeWidth={3} />
            </g>
          ) : null}
          {tipo === "richard" || tipo === "puritano" ? (
            <g>
              <path d="M 200 380 L 200 540" stroke="#05070A" strokeWidth={4} />
              {[420, 455, 490].map((y) => (
                <circle key={y} cx={200} cy={y} r={5} fill="#3A3F4A" />
              ))}
            </g>
          ) : null}
          {/* cuello de la camisa */}
          {tipo === "carlos1" || tipo === "carlos2" ? (
            <g>
              <path d="M 112 372 C 150 352 250 352 288 372 C 300 400 268 424 230 414 L 200 392 L 170 414 C 132 424 100 400 112 372 Z" fill="#F7F3EA" stroke="#CFC6B2" strokeWidth={2} />
              {Array.from({ length: 13 }, (_, i) => {
                const a = Math.PI * (0.08 + (i / 12) * 0.84);
                return <circle key={i} cx={200 - Math.cos(a) * 92} cy={376 + Math.sin(a) * 44} r={7.5} fill="#F7F3EA" stroke="#CFC6B2" strokeWidth={1.5} />;
              })}
            </g>
          ) : (
            <path d="M 126 366 C 160 352 240 352 274 366 L 262 404 L 204 384 L 200 398 L 196 384 L 138 404 Z" fill="#F4F1EA" stroke="#C9C3B6" strokeWidth={2} />
          )}
        </g>
        {/* cuello y cabeza */}
        <path d="M 170 300 L 170 372 C 190 388 210 388 230 372 L 230 300 Z" fill={H.pielSombra} />
        <ellipse cx={200} cy={215} rx={66} ry={86} fill={H.piel} />
        <path d="M 200 129 C 240 132 266 170 266 215 C 266 262 240 298 200 301 C 226 270 232 170 200 129 Z" fill={H.pielSombra} opacity={0.5} />
        {/* pelo arriba */}
        {tipo === "carlos2" ? (
          <g fill={pelo}>
            <path d="M 132 190 C 120 120 170 96 200 110 C 230 96 280 120 268 190 C 250 150 222 138 200 150 C 178 138 150 150 132 190 Z" />
            {Array.from({ length: 16 }, (_, i) => {
              const izq = i % 2 === 0;
              const k = Math.floor(i / 2);
              return <circle key={i} cx={izq ? 112 - (k % 2) * 12 : 288 + (k % 2) * 12} cy={190 + k * 32} r={26} />;
            })}
          </g>
        ) : tipo === "cromwell" ? (
          <path d="M 134 206 C 128 150 160 120 200 122 C 240 120 272 150 266 206 C 254 172 236 158 216 158 C 196 150 152 160 134 206 Z" fill={pelo} />
        ) : (
          <path d="M 132 214 C 122 150 158 116 200 120 C 242 116 278 150 268 214 C 258 176 240 156 206 152 C 170 150 144 172 132 214 Z" fill={pelo} />
        )}
        {/* rostro */}
        <g>
          <path d="M 160 196 C 170 188 184 188 190 194" fill="none" stroke={pelo} strokeWidth={5} strokeLinecap="round" />
          <path d="M 210 194 C 216 188 230 188 240 196" fill="none" stroke={pelo} strokeWidth={5} strokeLinecap="round" />
          <ellipse cx={175} cy={214} rx={8} ry={5.5 * parp} fill="#1C1611" />
          <ellipse cx={225} cy={214} rx={8} ry={5.5 * parp} fill="#1C1611" />
          <path d="M 200 214 C 196 236 190 250 198 256 L 208 256" fill="none" stroke="#8E6A4E" strokeWidth={4} strokeLinecap="round" />
          <path d={tipo === "cromwell" || tipo === "puritano" ? "M 180 280 C 192 276 208 276 220 280" : "M 182 280 C 192 284 208 284 218 280"} fill="none" stroke="#7A4A3A" strokeWidth={4.5} strokeLinecap="round" />
          {tipo === "carlos1" ? (
            <g fill={pelo}>
              <path d="M 200 266 C 186 262 168 266 156 258 C 166 274 186 276 200 272 C 214 276 234 274 244 258 C 232 266 214 262 200 266 Z" />
              <path d="M 186 292 C 194 298 206 298 214 292 C 212 318 204 338 200 342 C 196 338 188 318 186 292 Z" />
            </g>
          ) : null}
          {tipo === "carlos2" ? <path d="M 200 266 C 188 263 174 266 164 262 C 174 272 188 273 200 271 C 212 273 226 272 236 262 C 226 266 212 263 200 266 Z" fill={pelo} /> : null}
          {tipo === "cromwell" ? (
            <g>
              <path d="M 200 267 C 190 264 178 267 170 264 C 178 273 190 274 200 272 C 210 274 222 273 230 264 C 222 267 210 264 200 267 Z" fill={pelo} />
              <path d="M 150 186 C 160 176 186 178 192 188" fill="none" stroke="#3E362F" strokeWidth={6} strokeLinecap="round" />
              <path d="M 208 188 C 214 178 240 176 250 186" fill="none" stroke="#3E362F" strokeWidth={6} strokeLinecap="round" />
            </g>
          ) : null}
        </g>
        {/* sombrero puritano */}
        {tipo === "puritano" ? (
          <g>
            <path d="M 150 150 L 164 30 L 236 30 L 250 150 Z" fill="#111317" />
            <ellipse cx={200} cy={152} rx={128} ry={22} fill="#111317" />
            <rect x={154} y={118} width={92} height={18} fill="#2A2D34" />
            <rect x={186} y={112} width={28} height={30} fill="none" stroke="#B9A56A" strokeWidth={5} />
          </g>
        ) : null}
        {corona ? (
          <g transform="translate(118 20) scale(0.41)">
            <Corona />
          </g>
        ) : null}
        {sombra > 0 ? <path d="M 136 190 C 130 240 140 290 168 304" fill="none" stroke="#FFE9B8" strokeWidth={5} opacity={0.35} strokeLinecap="round" /> : null}
      </g>
      {/* luz lateral: la mitad derecha de la figura queda en sombra (misma silueta, recortada) */}
      {sombra > 0 ? (
        <g clipPath={`url(#cs${id})`} opacity={sombra}>
          <use href={`#bu${id}`} filter={`url(#fs${id})`} />
        </g>
      ) : null}
    </svg>
  );
};

// ---------- figuras de cuerpo entero (siglo XVII) ----------
export type TipoFigura = "piquero" | "mosquetero" | "puritano" | "rey" | "richard" | "cromwell";
// viewBox 0 0 200 480, pies en (100, 470). `paso` = fase de marcha (rad); `silueta` oscurece.
export const Figura: React.FC<{ tipo: TipoFigura; alto?: number; paso?: number; marcha?: number; silueta?: number; espejo?: boolean; arma?: number }> = ({ tipo, alto = 480, paso = 0, marcha = 0, silueta = 0, espejo = false, arma = 0 }) => {
  const pierna = Math.sin(paso) * 16 * marcha;
  const bota = tipo === "rey" ? "#3A2A1E" : "#1E1A17";
  const calzon = tipo === "piquero" || tipo === "mosquetero" ? "#5B4630" : tipo === "rey" ? "#1E2A44" : "#17191E";
  const casaca = tipo === "piquero" || tipo === "mosquetero" ? H.bronce : tipo === "rey" ? "#1E2A44" : tipo === "cromwell" ? "#4B3B2C" : "#17191E";
  const soldado = tipo === "piquero" || tipo === "mosquetero";
  return (
    <svg width={(alto * 200) / 480} height={alto} viewBox="0 0 200 480" style={{ overflow: "visible", display: "block", transform: espejo ? "scaleX(-1)" : undefined, filter: silueta ? `brightness(${1 - silueta * 0.92}) saturate(${1 - silueta * 0.6})` : undefined }}>
      {/* piernas */}
      <g transform={`rotate(${pierna} 88 290)`}>
        <path d="M 74 290 L 70 380 L 66 462 L 96 462 L 98 380 L 100 290 Z" fill={calzon} />
        <path d="M 66 392 L 98 392 L 98 462 L 54 466 L 54 456 L 68 448 Z" fill={bota} />
      </g>
      <g transform={`rotate(${-pierna} 112 290)`}>
        <path d="M 100 290 L 102 380 L 104 462 L 134 462 L 130 380 L 126 290 Z" fill={calzon} />
        <path d="M 102 392 L 134 392 L 134 462 L 146 466 L 146 456 L 132 448 Z" fill={bota} />
      </g>
      {/* capa */}
      {tipo === "rey" || tipo === "puritano" ? <path d="M 58 150 C 40 240 40 320 48 380 L 152 380 C 160 320 160 240 142 150 Z" fill={tipo === "rey" ? "#111A2E" : "#0E1014"} /> : null}
      {/* torso */}
      <path d="M 62 150 C 56 220 60 270 66 306 L 134 306 C 140 270 144 220 138 150 Z" fill={casaca} />
      {soldado || tipo === "cromwell" ? <path d="M 66 152 C 62 200 66 232 74 252 L 126 252 C 134 232 138 200 134 152 Z" fill="#6F7B8C" /> : null}
      {soldado || tipo === "cromwell" ? <path d="M 100 152 L 100 252" stroke="#3A4250" strokeWidth={3} /> : null}
      {tipo === "mosquetero" ? <path d="M 66 160 L 132 250" stroke="#2B2118" strokeWidth={7} /> : null}
      {tipo === "rey" ? <path d="M 66 162 L 134 300" stroke={H.lacre} strokeWidth={10} /> : null}
      {soldado ? <path d="M 62 262 L 138 262 L 134 300 L 66 300 Z" fill="#7A5530" /> : null}
      {/* brazos */}
      <path d="M 62 156 C 44 190 42 236 50 268 L 68 264 C 64 236 70 200 78 172 Z" fill={casaca} />
      <path d="M 138 156 C 156 190 158 236 150 268 L 132 264 C 136 236 130 200 122 172 Z" fill={casaca} />
      <circle cx={58} cy={272} r={10} fill={H.piel} />
      <circle cx={142} cy={272} r={10} fill={H.piel} />
      {/* cuello blanco */}
      {tipo === "rey" ? <path d="M 66 142 C 84 132 116 132 134 142 L 128 170 L 100 156 L 72 170 Z" fill="#F7F3EA" /> : <path d="M 72 142 C 88 134 112 134 128 142 L 122 162 L 100 152 L 78 162 Z" fill="#EDE9E0" />}
      {/* cabeza */}
      <ellipse cx={100} cy={104} rx={28} ry={34} fill={H.piel} />
      <path d="M 100 70 C 118 72 128 88 128 104 C 128 122 118 136 100 138 C 112 120 112 88 100 70 Z" fill={H.pielSombra} opacity={0.6} />
      {tipo === "rey" || tipo === "richard" || tipo === "cromwell" ? <path d="M 72 108 C 66 80 80 66 100 66 C 120 66 134 80 128 108 C 130 130 128 150 122 156 L 116 120 C 110 96 90 96 84 120 L 78 156 C 72 150 70 130 72 108 Z" fill={tipo === "rey" ? "#4A3323" : "#5A4636"} /> : null}
      {tipo === "rey" ? <path d="M 92 132 C 96 136 104 136 108 132 L 100 152 Z" fill="#4A3323" /> : null}
      {/* tocados */}
      {tipo === "piquero" ? (
        <g>
          <path d="M 68 96 C 66 60 84 46 100 46 C 116 46 134 60 132 96 Z" fill="#7E8A9B" />
          <path d="M 58 96 L 142 96 L 150 104 L 50 104 Z" fill="#5B6676" />
          <path d="M 100 46 L 100 96" stroke="#AEB8C6" strokeWidth={4} />
        </g>
      ) : null}
      {tipo === "mosquetero" || tipo === "rey" ? (
        <g>
          <ellipse cx={100} cy={80} rx={62} ry={13} fill={tipo === "rey" ? "#141C30" : "#2B241D"} />
          <path d="M 72 80 C 70 52 84 42 100 42 C 116 42 130 52 128 80 Z" fill={tipo === "rey" ? "#141C30" : "#2B241D"} />
          {tipo === "rey" ? <path d="M 120 62 C 150 30 176 40 168 66 C 160 52 144 54 126 72 Z" fill="#F4EFE6" /> : null}
        </g>
      ) : null}
      {tipo === "puritano" ? (
        <g>
          <path d="M 76 82 L 82 22 L 118 22 L 124 82 Z" fill="#0E1014" />
          <ellipse cx={100} cy={82} rx={56} ry={11} fill="#0E1014" />
          <rect x={78} y={64} width={44} height={9} fill="#2A2D34" />
        </g>
      ) : null}
      {/* armas */}
      {tipo === "piquero" ? (
        <g transform={`rotate(${arma} 142 272)`}>
          <path d="M 142 300 L 142 -330" stroke="#6E5233" strokeWidth={6} strokeLinecap="round" />
          <path d="M 142 -330 L 135 -300 L 142 -372 L 149 -300 Z" fill="#B4BFCE" />
        </g>
      ) : null}
      {tipo === "mosquetero" ? (
        <g transform={`rotate(${-24 + arma} 142 272)`}>
          <path d="M 142 290 L 142 40" stroke="#3A2A1E" strokeWidth={9} strokeLinecap="round" />
          <path d="M 142 60 L 142 -60" stroke="#59606C" strokeWidth={5} strokeLinecap="round" />
        </g>
      ) : null}
    </svg>
  );
};

// Fila de figuras marchando (ejército). Coordenadas: pies en y, de x a x+ancho.
export const Tropa: React.FC<{ x: number; y: number; ancho: number; n: number; alto?: number; avance?: number; silueta?: number; semilla?: number; tipo?: "piquero" | "mosquetero" | "mixto"; espejo?: boolean; picas?: number }> = ({
  x,
  y,
  ancho,
  n,
  alto = 300,
  avance = 0,
  silueta = 0,
  semilla = 0,
  tipo = "piquero",
  espejo = false,
  picas = 0,
}) => {
  const f = useCurrentFrame();
  const w = (alto * 200) / 480;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const t = tipo === "mixto" ? (i % 3 === 2 ? "mosquetero" : "piquero") : tipo;
        const fase = f / 5.2 + i * 1.7 + semilla;
        const sube = Math.abs(Math.sin(fase)) * 5;
        return (
          <div key={i} style={{ position: "absolute", left: x + (i / Math.max(1, n - 1)) * ancho + avance - w / 2 + (azar(i + semilla * 7) - 0.5) * 10, top: y - alto - sube }}>
            <Figura tipo={t} alto={alto} paso={fase} marcha={1} silueta={silueta} espejo={espejo} arma={picas + Math.sin(f / 23 + i * 0.9 + semilla) * 1.6} />
          </div>
        );
      })}
    </>
  );
};

// Multitud de espaldas (cabezas con sombreros de la época), primer plano.
export const Gentio: React.FC<{ y: number; n?: number; escala?: number; semilla?: number; color?: string; x?: number; ancho?: number; mueve?: number }> = ({ y, n = 9, escala = 1, semilla = 0, color = "#0A0E16", x = -60, ancho = 1200, mueve = 1 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={10} height={10} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {Array.from({ length: n }, (_, i) => {
        const s = i * 5 + semilla * 17;
        const px = x + ((i + 0.5) / n) * ancho + (azar(s) - 0.5) * 60;
        const py = y + (azar(s + 1) - 0.5) * 50 + Math.sin(f / (17 + (i % 5) * 3) + i * 2.3) * 5 * mueve;
        const e = escala * (0.85 + azar(s + 2) * 0.35);
        const tocado = Math.floor(azar(s + 3) * 3);
        return (
          <g key={i} transform={`translate(${px + Math.sin(f / 40 + i) * 6 * mueve} ${py}) scale(${e})`} fill={color}>
            <path d="M -92 260 C -90 150 -60 120 -20 108 L 20 108 C 60 120 90 150 92 260 Z" />
            <ellipse cx={0} cy={66} rx={38} ry={46} />
            {tocado === 0 ? <path d="M -30 34 L -24 -40 L 24 -40 L 30 34 Z M -76 34 A 76 14 0 0 0 76 34 A 76 14 0 0 0 -76 34 Z" /> : tocado === 1 ? <path d="M -86 34 A 86 16 0 0 0 86 34 A 86 16 0 0 0 -86 34 Z M -36 34 C -38 0 -20 -12 0 -12 C 20 -12 38 0 36 34 Z" /> : <path d="M -44 50 C -52 10 -20 -8 0 -8 C 20 -8 52 10 44 50 C 40 80 44 110 50 124 L -50 124 C -44 110 -40 80 -44 50 Z" />}
          </g>
        );
      })}
    </svg>
  );
};

// ---------- estandarte ----------
export type Emblema = "corona" | "cruz" | "mancomunidad" | "liso";
export const Estandarte: React.FC<{ color: string; emblema?: Emblema; w?: number; h?: number; asta?: number; fase?: number; espejo?: boolean; caida?: number }> = ({ color, emblema = "liso", w = 260, h = 190, asta = 520, fase = 0, espejo = false, caida = 0 }) => {
  const f = useCurrentFrame();
  const id = useIdSvg();
  const N = 12;
  const arriba: string[] = [];
  const abajo: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const dy = Math.sin(f / 7 + fase - t * 5) * 13 * t + t * t * 30 * caida;
    arriba.push(`${(t * w).toFixed(1)} ${dy.toFixed(1)}`);
    abajo.unshift(`${(t * w).toFixed(1)} ${(h + dy * 1.1).toFixed(1)}`);
  }
  const d = `M ${arriba.join(" L ")} L ${abajo.join(" L ")} Z`;
  const onda = Math.sin(f / 7 + fase - 2.5) * 6;
  return (
    <svg width={w + 20} height={asta} viewBox={`-10 -20 ${w + 20} ${asta}`} style={{ overflow: "visible", display: "block", transform: espejo ? "scaleX(-1)" : undefined }}>
      <defs>
        <clipPath id={`es${id}`}>
          <path d={d} />
        </clipPath>
      </defs>
      <rect x={-7} y={-20} width={8} height={asta} rx={3} fill="#5A4026" />
      <path d="M -3 -52 L 5 -22 L -11 -22 Z" fill={H.dorado} />
      <path d={d} fill={color} />
      <g clipPath={`url(#es${id})`}>
        {emblema === "cruz" ? (
          <g transform={`translate(0 ${onda})`}>
            <rect x={0} y={-40} width={w} height={h + 80} fill="#F0ECE2" />
            <rect x={w * 0.42} y={-40} width={w * 0.16} height={h + 80} fill={H.lacreClaro} />
            <rect x={0} y={h * 0.39} width={w} height={h * 0.22} fill={H.lacreClaro} />
          </g>
        ) : null}
        {emblema === "mancomunidad" ? (
          <g transform={`translate(0 ${onda})`}>
            <rect x={0} y={-40} width={w / 2} height={h + 80} fill="#F0ECE2" />
            <rect x={w * 0.21} y={-40} width={w * 0.08} height={h + 80} fill={H.lacreClaro} />
            <rect x={0} y={h * 0.42} width={w / 2} height={h * 0.16} fill={H.lacreClaro} />
            <rect x={w / 2} y={-40} width={w / 2} height={h + 80} fill="#23457A" />
            <g transform={`translate(${w * 0.75} ${h * 0.5}) scale(${h / 190})`}>
              <Arpa />
            </g>
          </g>
        ) : null}
        {emblema === "corona" ? (
          <g transform={`translate(${w * 0.5 - 52} ${h * 0.5 - 40 + onda}) scale(0.26)`}>
            <Corona />
          </g>
        ) : null}
        {/* pliegues */}
        {[0.25, 0.5, 0.75].map((t) => (
          <rect key={t} x={w * t - 14} y={-40} width={28} height={h + 100} fill="#000" opacity={0.1 + 0.08 * Math.sin(f / 7 + fase - t * 5)} />
        ))}
      </g>
    </svg>
  );
};

// Arpa (emblema de Irlanda), centrada en 0,0. ~90×120.
export const Arpa: React.FC<{ color?: string }> = ({ color = H.dorado }) => (
  <g fill="none" stroke={color} strokeLinecap="round">
    <path d="M -30 54 L -34 -44 C -20 -66 26 -62 40 -34" strokeWidth={11} />
    <path d="M 40 -34 C 30 4 4 40 -30 54" strokeWidth={9} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <path key={i} d={`M ${-24 + i * 9} ${-46 + i * 2} L ${-24 + i * 9} ${46 - i * 13}`} strokeWidth={3} />
    ))}
  </g>
);

// ---------- mapa de las Islas Británicas ----------
// Proyección simple: x = (lon + 11)·0.588·S ; y = (59.2 − lat)·S   (S = 110 → 800 × 1010 px aprox.)
export const S_MAPA = 110;
export const geo = (lon: number, lat: number): Pt => [(lon + 11) * 0.588 * S_MAPA, (59.2 - lat) * S_MAPA];
const GB: Pt[] = [[-5.7, 50.05], [-5.2, 49.96], [-4.2, 50.35], [-3.6, 50.2], [-3.0, 50.7], [-2.45, 50.52], [-1.3, 50.6], [0.25, 50.75], [0.97, 50.91], [1.38, 51.13], [1.43, 51.38], [0.6, 51.45], [0.9, 51.75], [1.6, 52.1], [1.75, 52.5], [1.3, 52.93], [0.45, 52.95], [0.2, 52.8], [0.35, 53.2], [0.1, 53.6], [-0.1, 54.1], [-0.6, 54.5], [-1.2, 54.65], [-1.4, 55.0], [-2.0, 55.77], [-2.5, 56.0], [-3.2, 55.98], [-2.6, 56.25], [-2.9, 56.45], [-2.05, 57.15], [-1.78, 57.5], [-2.0, 57.7], [-3.4, 57.7], [-4.2, 57.5], [-3.8, 57.87], [-3.05, 58.45], [-3.03, 58.64], [-5.0, 58.62], [-5.3, 58.0], [-5.85, 57.55], [-5.6, 57.2], [-6.2, 56.7], [-5.6, 56.3], [-5.5, 56.0], [-5.75, 55.3], [-5.4, 55.55], [-4.9, 55.9], [-4.65, 55.45], [-5.1, 55.0], [-4.95, 54.65], [-4.3, 54.78], [-3.5, 54.95], [-3.2, 54.9], [-3.6, 54.5], [-2.9, 54.1], [-3.05, 53.75], [-3.05, 53.4], [-3.85, 53.33], [-4.6, 53.3], [-4.35, 53.1], [-4.75, 52.8], [-4.1, 52.9], [-4.05, 52.4], [-4.7, 52.1], [-5.3, 51.9], [-5.1, 51.65], [-4.3, 51.65], [-3.95, 51.57], [-3.15, 51.45], [-2.7, 51.6], [-3.0, 51.2], [-3.8, 51.22], [-4.55, 51.0], [-5.05, 50.45]];
const IRL: Pt[] = [[-7.37, 55.38], [-6.15, 55.22], [-5.8, 54.85], [-5.7, 54.65], [-5.45, 54.45], [-5.6, 54.2], [-6.3, 54.0], [-6.2, 53.72], [-6.1, 53.35], [-6.0, 52.97], [-6.3, 52.35], [-6.37, 52.17], [-6.93, 52.12], [-7.6, 52.05], [-7.85, 51.93], [-8.3, 51.8], [-8.5, 51.6], [-9.8, 51.45], [-10.15, 51.75], [-9.9, 51.9], [-10.45, 52.1], [-9.9, 52.25], [-9.93, 52.56], [-9.4, 52.9], [-9.0, 53.15], [-9.6, 53.25], [-10.2, 53.4], [-9.9, 53.75], [-10.15, 53.97], [-10.0, 54.3], [-9.2, 54.3], [-8.6, 54.3], [-8.2, 54.6], [-8.8, 54.65], [-8.3, 55.15]];
const dGeo = (p: Pt[]) => p.map(([lo, la], i) => `${i ? "L" : "M"} ${geo(lo, la)[0].toFixed(1)} ${geo(lo, la)[1].toFixed(1)}`).join(" ") + " Z";
export const D_GB = dGeo(GB);
export const D_IRL = dGeo(IRL);

// Mapa en pergamino. Los hijos (svg) se dibujan encima, en las mismas coordenadas (usar `geo`).
// `bandos` 0..1: zonas aproximadas de la guerra civil (1643): realistas en rojo, Parlamento en azul.
export const MapaIslas: React.FC<{ bandos?: number; rojo?: number; azul?: number; rotulos?: number; children?: React.ReactNode }> = ({ bandos = 0, rojo = 1, azul = 1, rotulos = 1, children }) => {
  const id = useIdSvg();
  const f = useCurrentFrame();
  const mar = (x: number, y: number, t: string, tam = 30) => (
    <text x={x} y={y} fontFamily={FUENTE_SERIFA} fontStyle="italic" fontSize={tam} fill="#6F6247" opacity={0.75 * rotulos} textAnchor="middle" letterSpacing={5}>
      {t}
    </text>
  );
  return (
    <svg width={1500} height={1300} viewBox="-340 -120 1500 1300" style={{ position: "absolute", left: -340, top: -120, overflow: "visible" }}>
      <defs>
        <clipPath id={`gb${id}`}>
          <path d={D_GB} />
        </clipPath>
        <filter id={`mo${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={16} />
        </filter>
      </defs>
      {/* costa: aureola de tinta */}
      {[D_GB, D_IRL].map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke="#7C6A48" strokeWidth={26} opacity={0.14} strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#7C6A48" strokeWidth={12} opacity={0.2} strokeLinejoin="round" />
          <path d={d} fill="#D9C79E" stroke="#4A3B26" strokeWidth={3.5} strokeLinejoin="round" />
        </g>
      ))}
      {/* bandos */}
      {bandos > 0 ? (
        <g clipPath={`url(#gb${id})`} filter={`url(#mo${id})`} opacity={bandos * 0.78}>
          <path d={`M ${geo(-7, 49.5).join(" ")} L ${geo(-1.9, 50.3).join(" ")} L ${geo(-1.2, 51.6).join(" ")} L ${geo(-1.6, 52.8).join(" ")} L ${geo(-0.4, 53.6).join(" ")} L ${geo(0.6, 54.2).join(" ")} L ${geo(-1.6, 55.75).join(" ")} L ${geo(-3.4, 55.0).join(" ")} L ${geo(-7, 54.9).join(" ")} Z`} fill={H.lacreClaro} opacity={(0.75 + 0.15 * Math.sin(f / 14)) * rojo} />
          <path d={`M ${geo(-1.9, 50.3).join(" ")} L ${geo(-1.2, 51.6).join(" ")} L ${geo(-1.6, 52.8).join(" ")} L ${geo(-0.4, 53.6).join(" ")} L ${geo(0.8, 53.9).join(" ")} L ${geo(3, 52).join(" ")} L ${geo(2, 50.3).join(" ")} Z`} fill={H.azulBando} opacity={(0.8 + 0.15 * Math.sin(f / 14 + 2)) * azul} />
        </g>
      ) : null}
      {/* relieve mínimo */}
      {([[-3.9, 57.0], [-4.6, 56.6], [-3.4, 56.8], [-2.2, 54.6], [-2.0, 54.0], [-3.7, 52.9], [-3.5, 52.3], [-8.6, 52.0], [-9.5, 53.6], [-7.9, 54.9]] as Pt[]).map(([lo, la], i) => {
        const [x, y] = geo(lo, la);
        return <path key={i} d={`M ${x - 16} ${y + 8} L ${x - 4} ${y - 12} L ${x + 4} ${y} L ${x + 12} ${y - 9} L ${x + 22} ${y + 8}`} fill="none" stroke="#6B5A3C" strokeWidth={2.5} opacity={0.55} strokeLinejoin="round" />;
      })}
      {mar(geo(2.2, 55.6)[0], geo(2.2, 55.6)[1], "MAR DEL NORTE")}
      {mar(geo(-11.6, 56.6)[0], geo(-11.6, 56.6)[1], "OCÉANO")}
      {mar(geo(-11.6, 56.6)[0], geo(-11.6, 56.6)[1] + 40, "ATLÁNTICO")}
      {mar(geo(-5.0, 53.75)[0], geo(-5.0, 53.75)[1], "Mar de Irlanda", 22)}
      {/* rosa de los vientos */}
      <g transform={`translate(${geo(2.4, 58.2).join(" ")})`} opacity={0.7 * rotulos}>
        <circle r={46} fill="none" stroke="#6B5A3C" strokeWidth={2.5} />
        {[0, 90, 180, 270].map((a) => (
          <path key={a} d="M 0 -62 L 9 0 L -9 0 Z" fill={a === 0 ? H.lacre : "#6B5A3C"} transform={`rotate(${a})`} />
        ))}
        {[45, 135, 225, 315].map((a) => (
          <path key={a} d="M 0 -38 L 6 0 L -6 0 Z" fill="#8A7650" transform={`rotate(${a})`} />
        ))}
        <text y={-70} fontFamily={FUENTE_SERIFA} fontSize={26} fill="#4A3B26" textAnchor="middle">
          N
        </text>
      </g>
      {children}
    </svg>
  );
};

// Ciudad en el mapa (punto + nombre). Va dentro de <MapaIslas>.
export const Lugar: React.FC<{ lon: number; lat: number; nombre: string; aparece: number; rojo?: boolean; lado?: "izq" | "der"; tam?: number; pulso?: boolean }> = ({ lon, lat, nombre, aparece, rojo = false, lado = "der", tam = 30, pulso = false }) => {
  const f = useCurrentFrame();
  const o = rampa(f, aparece, aparece + 8);
  if (o <= 0) return null;
  const [x, y] = geo(lon, lat);
  const e = interpolate(f, [aparece, aparece + 6, aparece + 14], [0, 1.5, 1], CLAMP);
  const onda = ((f - aparece) % 36) / 36;
  return (
    <g opacity={o}>
      {rojo || pulso ? <circle cx={x} cy={y} r={12 + onda * 44} fill="none" stroke={rojo ? H.lacreClaro : H.dorado} strokeWidth={4} opacity={1 - onda} /> : null}
      {rojo ? <circle cx={x} cy={y} r={30} fill={H.lacreClaro} opacity={0.3} /> : null}
      <circle cx={x} cy={y} r={11 * e} fill={rojo ? H.lacre : "#2B2118"} stroke={rojo ? "#F3C7B0" : H.pergamino} strokeWidth={3} />
      <text x={x + (lado === "der" ? 20 : -20)} y={y + tam * 0.34} textAnchor={lado === "der" ? "start" : "end"} fontFamily={FUENTE_SERIFA} fontWeight={700} fontSize={tam} fill={rojo ? "#6A1218" : "#2B2118"} stroke="#E8DCC4" strokeWidth={7} paintOrder="stroke" strokeLinejoin="round">
        {nombre}
      </text>
    </g>
  );
};

// ---------- cierre de marca ----------
// El hilo converge desde los bordes y forma el emblema (un reloj de arena hilado dentro de un aro) + nombre y lema.
export const CierreCanal: React.FC<{ desde?: number }> = ({ desde = 0 }) => {
  const f = useCurrentFrame() - desde;
  if (f < 0) return null;
  const fondo = rampa(f, 0, 14);
  const conv = rampa(f, 2, 36, SALE);
  const aro = rampa(f, 26, 58);
  const reloj = rampa(f, 34, 70);
  const titulo = rampa(f, 52, 72, SALE);
  const lema = rampa(f, 70, 90, SALE);
  const cx = 540;
  const cy = 640;
  const R = 170;
  const bordes: Pt[][] = [
    [[-40, 200], [200, 420], [380, 520], [cx - R, cy]],
    [[1120, 260], [900, 380], [760, 540], [cx + R, cy]],
    [[-40, 1500], [220, 1200], [330, 900], [cx - R * 0.7, cy + R * 0.7]],
    [[1120, 1640], [880, 1260], [760, 940], [cx + R * 0.7, cy + R * 0.7]],
    [[540, -40], [470, 200], [560, 360], [cx, cy - R]],
  ];
  const circ: Pt[] = Array.from({ length: 73 }, (_, i) => [cx + Math.cos((i / 72) * Math.PI * 2 - Math.PI / 2) * R, cy + Math.sin((i / 72) * Math.PI * 2 - Math.PI / 2) * R]);
  const arena: Pt[] = [[cx - 78, cy - 100], [cx + 78, cy - 100], [cx + 8, cy], [cx + 78, cy + 100], [cx - 78, cy + 100], [cx - 8, cy], [cx - 78, cy - 100]];
  return (
    <AbsoluteFill style={{ opacity: fondo }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 36%, ${H.nocheAlta} 0%, ${H.noche} 62%, #070F18 100%)` }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.1, mixBlendMode: "screen" }}>
        <FondoPergamino />
      </div>
      <div style={{ position: "absolute", left: cx - 520, top: cy - 520, width: 1040, height: 1040, borderRadius: "50%", background: "radial-gradient(circle, rgba(246,222,138,0.3) 0%, rgba(246,222,138,0.08) 40%, rgba(246,222,138,0) 68%)", opacity: aro * (0.85 + 0.15 * Math.sin(f / 9)) }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {bordes.map((b, i) => (
          <HiloG key={i} pts={b} p={conv} cola={rampa(f, 30, 64) * 0.999} grosor={5} ondula={2} />
        ))}
        <HiloG pts={circ} p={aro} grosor={7} crudo ondula={0} />
        <HiloG pts={arena} p={reloj} grosor={6} crudo ondula={0} />
        {reloj > 0.9 ? <circle cx={cx} cy={cy + 62} r={5 + 2 * Math.sin(f / 5)} fill={H.doradoClaro} /> : null}
        {reloj > 0.5 ? <path d={`M ${cx} ${cy + 4} L ${cx} ${cy + 60}`} stroke={H.doradoClaro} strokeWidth={3} strokeDasharray="4 9" strokeDashoffset={-f * 1.4} opacity={0.9} /> : null}
      </svg>
      <div style={{ position: "absolute", left: 40, right: 40, top: 900, textAlign: "center", opacity: titulo, translate: `0px ${(1 - titulo) * 34}px` }}>
        <div style={{ fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 104, lineHeight: 1.02, color: H.pergamino, letterSpacing: 1, textShadow: "0 0 44px rgba(212,175,55,0.5), 0 8px 22px rgba(0,0,0,0.6)" }}>
          EL PASADO
          <br />
          <span style={{ color: H.dorado }}>DEL PASADO</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 1150, textAlign: "center", opacity: lema }}>
        <div style={{ display: "inline-block", width: 150 * lema, height: 4, background: H.dorado, borderRadius: 2, verticalAlign: "middle", boxShadow: "0 0 12px rgba(246,222,138,0.8)" }} />
        <div style={{ marginTop: 22, fontFamily: FUENTE_SERIFA, fontStyle: "italic", fontWeight: 700, fontSize: 50, color: H.doradoClaro, letterSpacing: 2, textShadow: "0 4px 14px rgba(0,0,0,0.7)" }}>El hilo de la historia</div>
      </div>
      <Ceniza n={26} color={H.doradoClaro} color2={H.dorado} sube={0.5} o={0.7 * aro} semilla={4} />
    </AbsoluteFill>
  );
};
