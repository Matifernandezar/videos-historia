// Piezas visuales del video "¿Dónde fue la misa más grande de la historia?" (Versículo Oculto).
// Todo es ilustración original: multitud de espaldas, mar de luces, lluvia, mapa, estadios y vista aérea.
import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { lerp, PAL } from "../jesus-12-30/escenarios";
import { azar, mezcla as mezclaHex } from "../ambiente";

// Mezcla de colores que acepta "#rrggbb" y también "rgb(r,g,b)" (resultado de otra mezcla).
const rgbDe = (c: string): [number, number, number] => {
  if (c.startsWith("#")) return [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)) as [number, number, number];
  const m = c.match(/-?\d+(\.\d+)?/g) ?? ["0", "0", "0"];
  return [Number(m[0]), Number(m[1]), Number(m[2])];
};
export const mezcla = (a: string, b: string, t: number) => {
  const pa = rgbDe(a);
  const pb = rgbDe(b);
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(",")})`;
};
export const hexDe = (c: string) => "#" + rgbDe(c).map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
void mezclaHex;

export const cl = (v: number) => Math.max(0, Math.min(1, v));
const uidDe = (id: string) => id.replace(/[^a-zA-Z0-9]/g, "");

// ---------- multitud de espaldas, en perspectiva (filas de cabezas y hombros) ----------
const ROPA = ["#C8402F", "#2F5DA8", "#F2EDE0", "#3E8E5A", "#E3B04B", "#7A4E9A", "#D9703A", "#2C3E66"];
const PELO = ["#1E140E", "#2A1B13", "#3A2418", "#4A3626", "#15100C"];
const PIEL = ["#C99470", "#B98260", "#D2A383", "#A97352"];
const PONCHO = ["#F3C623", "#F3C623", "#F3C623", "#FBF7EA", "#E9B419"];
const PARAGUAS = ["#C8402F", "#2F5DA8", "#F2EDE0", "#2C3E66", "#3E8E5A"];

export const GenteEspalda: React.FC<{
  horizonte: number;
  abajo?: number;
  filas?: number;
  x0?: number;
  ancho?: number;
  poncho?: number; // 0..1 proporción con impermeable amarillo
  saludan?: number; // 0..1 brazos que saludan
  semilla?: number;
  bruma?: string;
  base?: string;
}> = ({ horizonte, abajo = 1960, filas = 30, x0 = -460, ancho = 2000, poncho = 0, saludan = 1, semilla = 1, bruma = "#F2C58A", base = "#4A3A3C" }) => {
  const f = useCurrentFrame();
  const uid = uidDe(React.useId());
  const out: React.ReactNode[] = [<rect key="base" x={x0} y={horizonte} width={ancho} height={abajo - horizonte + 300} fill={base} />];
  for (let k = 0; k < filas; k++) {
    const t = (k + 0.5) / filas;
    const y = horizonte + 10 + (abajo - horizonte) * Math.pow(t, 1.55);
    const r = 2.6 + 52 * Math.pow(t, 1.6);
    const haze = 0.62 * (1 - t);
    const colorRopa = (i: number) => {
      const u = azar(semilla * 977 + k * 131 + i * 17);
      const u2 = azar(semilla * 313 + k * 71 + i * 29);
      return mezcla(u2 < poncho * 0.92 ? PONCHO[Math.floor(u * 5) % 5] : ROPA[Math.floor(u * 8) % 8], bruma, haze);
    };
    const colorPelo = (i: number) => mezcla(PELO[Math.floor(azar(k * 53 + i * 7 + semilla) * 5) % 5], bruma, haze);
    if (r < 9) {
      const w = r * 12;
      const h = r * 4.2;
      const pid = `g${uid}${k}`;
      out.push(
        <pattern key={`p${k}`} id={pid} width={w} height={h} patternUnits="userSpaceOnUse" x={x0 + ((k * 37) % w)} y={y - r * 1.2}>
          {Array.from({ length: 5 }, (_, i) => {
            const cx = (i + 0.5) * (w / 5) + (azar(k * 11 + i) - 0.5) * r * 0.8;
            return (
              <g key={i}>
                <path d={`M ${cx - 1.25 * r} ${h} Q ${cx - 1.25 * r} ${r * 2.2} ${cx} ${r * 2.1} Q ${cx + 1.25 * r} ${r * 2.2} ${cx + 1.25 * r} ${h} Z`} fill={colorRopa(i)} />
                <circle cx={cx} cy={r * 1.2} r={r} fill={colorPelo(i)} />
              </g>
            );
          })}
        </pattern>,
        <rect key={`r${k}`} x={x0} y={y - r * 1.2} width={ancho} height={h * 1.15} fill={`url(#${pid})`} />,
      );
    } else {
      const paso = r * 2.15;
      const n = Math.ceil(ancho / paso) + 1;
      const off = (k % 2) * paso * 0.5;
      for (let i = 0; i < n; i++) {
        const cx = x0 + off + i * paso + (azar(k * 19 + i * 5 + semilla) - 0.5) * r * 0.5;
        const cy = y + (azar(k * 7 + i * 3 + semilla) - 0.5) * r * 0.35;
        if (cx < -300 || cx > 1400) continue;
        const rop = colorRopa(i);
        const pel = colorPelo(i);
        const piel = mezcla(PIEL[Math.floor(azar(i * 3 + k) * 4) % 4], bruma, haze);
        const u = azar(k * 41 + i * 13 + semilla);
        const saluda = r >= 22 && u < 0.22 * saludan;
        const ang = -78 + 26 * Math.sin(f / 5 + i + k);
        const rad = (ang * Math.PI) / 180;
        out.push(
          <g key={`${k}-${i}`}>
            {saluda ? (
              <>
                <line x1={cx + r * 1.0} y1={cy + r * 1.3} x2={cx + r * 1.0 + Math.cos(rad) * r * 1.9} y2={cy + r * 1.3 + Math.sin(rad) * r * 1.9} stroke={rop} strokeWidth={r * 0.5} strokeLinecap="round" />
                <circle cx={cx + r * 1.0 + Math.cos(rad) * r * 2.05} cy={cy + r * 1.3 + Math.sin(rad) * r * 2.05} r={r * 0.27} fill={piel} />
              </>
            ) : null}
            <path d={`M ${cx - 1.22 * r} ${cy + 3.2 * r} Q ${cx - 1.28 * r} ${cy + 0.95 * r} ${cx} ${cy + 0.9 * r} Q ${cx + 1.28 * r} ${cy + 0.95 * r} ${cx + 1.22 * r} ${cy + 3.2 * r} Z`} fill={rop} />
            <ellipse cx={cx} cy={cy + 0.95 * r} rx={0.38 * r} ry={0.3 * r} fill={piel} />
            <circle cx={cx} cy={cy} r={r} fill={pel} />
            {poncho > 0.25 && r >= 14 && u > 0.82 ? (
              <g opacity={cl((poncho - 0.25) * 2)}>
                <path d={`M ${cx - 1.9 * r} ${cy - 0.7 * r} Q ${cx} ${cy - 3.5 * r} ${cx + 1.9 * r} ${cy - 0.7 * r} Z`} fill={PARAGUAS[Math.floor(u * 100) % 5]} stroke="rgba(0,0,0,0.25)" strokeWidth={1.5} />
                <line x1={cx} y1={cy - 1.9 * r} x2={cx} y2={cy - 0.2 * r} stroke="#2A2A2E" strokeWidth={r * 0.1} />
              </g>
            ) : null}
            {u > 0.96 && r >= 22 ? (
              <g>
                <line x1={cx - r * 0.9} y1={cy + r * 0.8} x2={cx - r * 0.9} y2={cy - r * 3.4} stroke="#6B4E34" strokeWidth={r * 0.14} />
                <path d={`M ${cx - r * 0.9} ${cy - r * 3.4} q ${r * 0.9} ${-r * 0.3 + Math.sin(f / 6 + i) * r * 0.2} ${r * 1.8} 0 l 0 ${r * 1.1} q ${-r * 0.9} ${r * 0.25 + Math.sin(f / 6 + i) * r * 0.2} ${-r * 1.8} 0 Z`} fill={u > 0.98 ? "#E3B04B" : "#F2EDE0"} stroke="rgba(0,0,0,0.2)" strokeWidth={1.5} />
              </g>
            ) : null}
          </g>,
        );
      }
    }
  }
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      {out}
    </svg>
  );
};

// ---------- mar de pequeñas luces cálidas (multitud de noche) ----------
export const MarDeLuces: React.FC<{
  horizonte: number;
  abajo?: number;
  filas?: number;
  x0?: number;
  ancho?: number;
  semilla?: number;
  fuerza?: number;
  frio?: number; // 0..1 proporción de luces blanco-azuladas (pantallas, linternas)
}> = ({ horizonte, abajo = 1960, filas = 22, x0 = -320, ancho = 1720, semilla = 1, fuerza = 1, frio = 0.1 }) => {
  const f = useCurrentFrame();
  const uid = uidDe(React.useId());
  const out: React.ReactNode[] = [];
  const idC = `c${uid}`;
  const idF = `f${uid}`;
  const tiposC = [
    ["#FFE7A8", "#FFC260"],
    ["#FFF3CC", "#FFD27A"],
    ["#FFD98A", "#F29A3A"],
  ];
  for (let k = 0; k < filas; k++) {
    const t = (k + 0.5) / filas;
    const y = horizonte + 6 + (abajo - horizonte) * Math.pow(t, 1.55);
    const r = 1.2 + 6.6 * Math.pow(t, 1.45);
    const gap = ((abajo - horizonte) * 1.55 * Math.pow(t, 0.55)) / filas;
    if (r < 2.7) {
      const w = r * 16;
      const h = Math.max(r * 5, gap * 2.4);
      const pid = `l${uid}${k}`;
      out.push(
        <pattern key={`p${k}`} id={pid} width={w} height={h} patternUnits="userSpaceOnUse" x={x0 + ((k * 29) % w)} y={y}>
          {Array.from({ length: 8 }, (_, i) => (
            <circle key={i} cx={azar(k * 17 + i + semilla) * w} cy={azar(k * 31 + i * 3 + semilla) * h} r={r * (0.7 + azar(i * 5 + k) * 0.7)} fill={azar(i + k * 9) < frio ? "#DCEBFF" : "#FFD27A"} />
          ))}
        </pattern>,
        <rect key={`r${k}`} x={x0} y={y - gap * 0.6} width={ancho} height={h * 1.1} fill={`url(#${pid})`} opacity={fuerza * (0.7 + 0.3 * Math.sin(f / 17 + k * 1.3))} />,
      );
    } else {
      const paso = r * 3.1;
      const n = Math.ceil(ancho / paso);
      for (let i = 0; i < n; i++) {
        const u = azar(k * 47 + i * 13 + semilla);
        const cx = x0 + i * paso + (azar(k * 5 + i * 7) - 0.5) * paso * 0.7;
        const cy = y + (azar(k * 11 + i * 3) - 0.5) * (r * 1.6 + gap * 1.5);
        if (cx < -200 || cx > 1300) continue;
        const parp = 0.62 + 0.38 * Math.sin(f / (11 + (i % 7)) + i * 2.1 + k);
        out.push(<circle key={`${k}-${i}`} cx={cx} cy={cy} r={r * 2.6 * (0.8 + u * 0.4)} fill={u < frio ? `url(#${idF})` : `url(#${idC}${Math.floor(u * 30) % 3})`} opacity={fuerza * parp} />);
      }
    }
  }
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      <defs>
        {tiposC.map((c, j) => (
          <radialGradient key={j} id={`${idC}${j}`}>
            <stop offset="0%" stopColor={c[0]} stopOpacity={1} />
            <stop offset="30%" stopColor={c[1]} stopOpacity={0.85} />
            <stop offset="100%" stopColor={c[1]} stopOpacity={0} />
          </radialGradient>
        ))}
        <radialGradient id={idF}>
          <stop offset="0%" stopColor="#F4FAFF" stopOpacity={1} />
          <stop offset="35%" stopColor="#BFD8FF" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#BFD8FF" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={x0} y={horizonte} width={ancho} height={abajo - horizonte + 300} fill="#0B1020" />
      {out}
    </svg>
  );
};

// ---------- lluvia ----------
export const Lluvia: React.FC<{ fuerza: number; viento?: number }> = ({ fuerza, viento = 0.18 }) => {
  const f = useCurrentFrame();
  if (fuerza <= 0.01) return null;
  const n = Math.round(150 * fuerza);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }} width={1080} height={1920}>
      {Array.from({ length: n }, (_, i) => {
        const v = 26 + azar(i * 3) * 18;
        const largo = 34 + azar(i * 7) * 50;
        const x0 = azar(i * 13) * 1500 - 200;
        const yy = ((azar(i * 29) * 2300 + f * v) % 2300) - 250;
        const xx = x0 - yy * viento;
        return <line key={i} x1={xx} y1={yy} x2={xx - largo * viento} y2={yy + largo} stroke="#DCE8F5" strokeWidth={1.5 + azar(i) * 1.6} opacity={0.25 + 0.3 * azar(i * 5)} strokeLinecap="round" />;
      })}
    </svg>
  );
};

// ---------- contador de años (calendario que avanza) ----------
export const Contador: React.FC<{ desde: number; hasta: number; f0: number; f1: number; y?: number; opacidad?: number }> = ({ desde, hasta, f0, f1, y = 230, opacidad = 1 }) => {
  const f = useCurrentFrame();
  const p = lerp(f, f0, f1, 0, 1, Easing.inOut(Easing.cubic));
  const v = desde + (hasta - desde) * p;
  const año = Math.round(v);
  const frac = v - Math.floor(v);
  const rodando = p > 0 && p < 1;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", opacity: opacidad }}>
      <div style={{ padding: "10px 44px 12px", borderRadius: 24, background: "rgba(11,20,38,0.88)", border: `4px solid ${PAL.dorado}`, boxShadow: "0 14px 34px rgba(0,0,0,0.45)", overflow: "hidden" }}>
        <div style={{ fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 116, lineHeight: 1.05, color: PAL.dorado, letterSpacing: 4, transform: rodando ? `translateY(${(frac - 0.5) * 14}px)` : undefined, filter: rodando ? "blur(1.2px)" : undefined }}>{año}</div>
      </div>
    </div>
  );
};

// ---------- reloj / línea de tiempo que marca "20 años" ----------
export const Reloj: React.FC<{ x: number; y: number; aparece: number; gira: number }> = ({ x, y, aparece, gira }) => {
  const f = useCurrentFrame();
  const e = lerp(f, aparece, aparece + 12, 0, 1, Easing.out(Easing.back(1.6)));
  if (e <= 0) return null;
  const g = lerp(f, aparece + 4, aparece + gira, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${e})` }}>
      <svg width={190} height={190} viewBox="-95 -95 190 190" style={{ overflow: "visible", filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.5))" }}>
        <circle r={86} fill="#0B1426" stroke={PAL.dorado} strokeWidth={8} />
        <circle r={70} fill="#14223F" />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={0} y1={-62} x2={0} y2={i % 3 === 0 ? -50 : -56} stroke="#F7F1E3" strokeWidth={i % 3 === 0 ? 5 : 3} transform={`rotate(${i * 30})`} strokeLinecap="round" />
        ))}
        <line x1={0} y1={6} x2={0} y2={-46} stroke="#F7F1E3" strokeWidth={5} strokeLinecap="round" transform={`rotate(${g * 360 * 5})`} />
        <line x1={0} y1={4} x2={0} y2={-30} stroke={PAL.dorado} strokeWidth={7} strokeLinecap="round" transform={`rotate(${g * 360 * 5 / 12})`} />
        <circle r={7} fill={PAL.dorado} />
      </svg>
    </div>
  );
};

// ---------- mapa ilustrado de Filipinas (formas simplificadas, ilustración propia) ----------
const K = 70;
const px = (lon: number, lat: number): [number, number] => [(lon - 116.2) * K, (19.1 - lat) * K * 1.08];
const poli = (pts: [number, number][], cerrar = true) => "M " + pts.map(([lo, la]) => px(lo, la).map((v) => v.toFixed(1)).join(" ")).join(" L ") + (cerrar ? " Z" : "");
const ISLAS: { id: string; d: string }[] = [
  { id: "luzon", d: poli([[120.4, 18.5], [121.5, 18.6], [122.3, 18.4], [122.4, 17.2], [122.1, 16.2], [121.7, 15.7], [121.6, 15.0], [122.0, 14.5], [122.7, 14.3], [123.3, 14.0], [123.9, 13.2], [124.1, 12.6], [123.6, 12.7], [123.2, 13.1], [122.6, 13.5], [122.0, 13.9], [121.5, 13.7], [120.8, 13.8], [120.6, 14.2], [120.95, 14.45], [120.95, 14.8], [120.6, 14.9], [120.2, 14.8], [119.9, 15.3], [120.0, 16.0], [120.3, 16.4], [120.4, 17.5]]) },
  { id: "mindoro", d: poli([[120.3, 13.4], [121.4, 13.4], [121.5, 12.6], [121.1, 12.2], [120.4, 12.7]]) },
  { id: "palawan", d: poli([[117.2, 8.4], [117.9, 9.0], [118.6, 9.9], [119.5, 10.8], [119.9, 11.4], [119.6, 11.5], [118.9, 10.8], [118.2, 10.0], [117.5, 9.0]]) },
  { id: "panay", d: poli([[121.9, 11.8], [122.6, 11.9], [123.1, 11.3], [122.7, 10.4], [122.0, 10.6]]) },
  { id: "negros", d: poli([[122.4, 10.9], [123.2, 10.5], [123.5, 9.8], [123.2, 9.0], [122.8, 9.3], [122.7, 10.2]]) },
  { id: "cebu", d: poli([[123.4, 11.2], [123.9, 10.5], [123.6, 9.6], [123.3, 10.0]]) },
  { id: "samar", d: poli([[124.3, 12.5], [125.5, 12.4], [125.7, 11.4], [125.0, 11.0], [124.5, 11.6]]) },
  { id: "leyte", d: poli([[124.5, 11.2], [124.9, 11.0], [125.2, 10.2], [124.9, 9.9], [124.4, 10.3]]) },
  { id: "mindanao", d: poli([[122.0, 7.7], [123.0, 8.7], [124.2, 9.1], [125.4, 9.8], [126.2, 9.2], [126.5, 8.0], [126.3, 6.8], [125.7, 6.0], [125.2, 5.8], [124.4, 6.2], [124.1, 6.9], [123.6, 7.4], [123.0, 7.0], [122.3, 7.2]]) },
];
export const MANILA_MAPA = px(120.98, 14.59);
export const CENTRO_MAPA: [number, number] = [px(121.8, 12.6)[0], px(121.8, 12.6)[1]];

// Mapa dentro de un cuadro de 900×800 unidades; `s` = zoom, `foco` = punto del mapa que queda en `centro`.
export const MapaFilipinas: React.FC<{ s: number; foco: [number, number]; centro: [number, number]; puntoAp: number }> = ({ s, foco, centro, puntoAp }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 46%, #24395F 0%, #14223F 55%, #0B1426 100%)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${centro[0]} ${centro[1]}) scale(${s}) translate(${-foco[0]} ${-foco[1]})`}>
          {/* retícula */}
          {Array.from({ length: 14 }, (_, i) => (
            <line key={`v${i}`} x1={-300 + i * 90} y1={-500} x2={-300 + i * 90} y2={1400} stroke="#3E5A86" strokeWidth={1.2} opacity={0.35} vectorEffect="non-scaling-stroke" />
          ))}
          {Array.from({ length: 14 }, (_, i) => (
            <line key={`h${i}`} x1={-300} y1={-300 + i * 100} x2={1400} y2={-300 + i * 100} stroke="#3E5A86" strokeWidth={1.2} opacity={0.35} vectorEffect="non-scaling-stroke" />
          ))}
          {/* ondas */}
          {Array.from({ length: 5 }, (_, i) => (
            <circle key={i} cx={px(120.98, 14.59)[0]} cy={px(120.98, 14.59)[1]} r={(((f / 40 + i / 5) % 1) * 90) / Math.max(1, s * 0.25)} fill="none" stroke={PAL.dorado} strokeWidth={2.5} opacity={puntoAp * (1 - ((f / 40 + i / 5) % 1)) * 0.6} vectorEffect="non-scaling-stroke" />
          ))}
          {ISLAS.map((i) => (
            <path key={i.id} d={i.d} fill="#E7D4A6" stroke="#B99A62" strokeWidth={3} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          ))}
          {ISLAS.map((i) => (
            <path key={`s${i.id}`} d={i.d} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={9} strokeLinejoin="round" opacity={0.35} vectorEffect="non-scaling-stroke" transform="translate(-2 -2)" />
          ))}
        </g>
      </svg>
      {/* chinche de Manila (tamaño constante en pantalla) */}
      {puntoAp > 0 ? (() => {
        const sx = centro[0] + (MANILA_MAPA[0] - foco[0]) * s;
        const sy = centro[1] + (MANILA_MAPA[1] - foco[1]) * s;
        return (
          <div style={{ position: "absolute", left: sx, top: sy, transform: `translate(-50%, -100%) scale(${0.4 + 0.6 * puntoAp})`, opacity: puntoAp }}>
            <div style={{ position: "absolute", left: 64, top: 26, fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 52, letterSpacing: 3, color: "#F7F1E3", textShadow: "0 4px 14px rgba(0,0,0,0.8)", whiteSpace: "nowrap" }}>MANILA</div>
            <svg width={80} height={110} viewBox="-40 -100 80 110" style={{ overflow: "visible", filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.5))" }}>
              <path d="M 0 0 Q -34 -42 -30 -66 A 30 30 0 1 1 30 -66 Q 34 -42 0 0 Z" fill={PAL.dorado} stroke="#8A6420" strokeWidth={4} />
              <circle cy={-66} r={12} fill="#0B1426" />
            </svg>
          </div>
        );
      })() : null}
    </div>
  );
};

// ---------- estadio de noche (vista frontal) y escenario de concierto ----------
export const EstadioNoche: React.FC<{ luz: number }> = ({ luz }) => {
  const f = useCurrentFrame();
  const lamp = mezcla("#1A2238", "#FFF6D6", luz);
  const masts = [70, 300, 780, 1010];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#050813 0%,#0E1730 45%,#1B2748 80%,#232F55 100%)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 40 }, (_, i) => (
          <circle key={i} cx={azar(i * 3) * 1080} cy={azar(i * 5) * 700} r={1 + azar(i) * 1.6} fill="#F7F1E3" opacity={0.25 + 0.4 * azar(i * 2) * (0.6 + 0.4 * Math.sin(f / 20 + i))} />
        ))}
        {/* estadio */}
        <path d="M 40 1400 L 110 900 Q 540 740 970 900 L 1040 1400 Z" fill="#1B2A52" stroke="#33497A" strokeWidth={6} />
        <path d="M 110 900 Q 540 740 970 900 L 990 1000 Q 540 860 90 1000 Z" fill="#2A3D6E" />
        <path d="M 90 1000 Q 540 860 990 1000 L 1010 1140 Q 540 1000 70 1140 Z" fill="#233562" />
        {Array.from({ length: 5 }, (_, r) => (
          <path key={r} d={`M ${100 - r * 4} ${930 + r * 52} Q 540 ${790 + r * 52} ${980 + r * 4} ${930 + r * 52}`} stroke="#4A6AA8" strokeWidth={3} fill="none" opacity={0.6} />
        ))}
        {/* butacas iluminadas */}
        {Array.from({ length: 150 }, (_, i) => {
          const t = azar(i * 9 + 1);
          const rr = Math.floor(azar(i * 7 + 2) * 5);
          const xx = 130 + t * 820;
          const yy = 940 + rr * 52 - Math.sin(t * Math.PI) * 108 + 40;
          return <circle key={i} cx={xx} cy={yy} r={3.2} fill={azar(i * 5) < 0.5 ? "#FFD27A" : "#9FC0F0"} opacity={0.65 * luz} />;
        })}
        {/* arcadas */}
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M ${130 + i * 100} 1400 L ${130 + i * 100} 1290 Q ${160 + i * 100} 1250 ${190 + i * 100} 1290 L ${190 + i * 100} 1400 Z`} fill={mezcla("#0A1022", "#7A5A2A", luz * 0.9)} stroke="#33497A" strokeWidth={3} />
        ))}
        {/* borde del techo con luces */}
        <path d="M 108 902 Q 540 742 972 902" fill="none" stroke={lamp} strokeWidth={8} strokeLinecap="round" opacity={0.55 + 0.45 * luz} strokeDasharray="14 10" />
        {/* mástiles de reflectores */}
        {masts.map((x, i) => (
          <g key={i}>
            <rect x={x - 7} y={i === 1 || i === 2 ? 640 : 480} width={14} height={i === 1 || i === 2 ? 280 : 450} fill="#0A1022" />
            <rect x={x - 62} y={(i === 1 || i === 2 ? 640 : 480) - 78} width={124} height={86} rx={8} fill="#0A1022" stroke="#33497A" strokeWidth={3} />
            {Array.from({ length: 12 }, (_, j) => (
              <circle key={j} cx={x - 46 + (j % 4) * 31} cy={(i === 1 || i === 2 ? 640 : 480) - 58 + Math.floor(j / 4) * 27} r={9} fill={lamp} />
            ))}
          </g>
        ))}
        {/* escenario de concierto */}
        <g transform="translate(640 1060)">
          <rect x={0} y={150} width={420} height={250} fill="#0A1022" stroke="#33497A" strokeWidth={4} />
          <rect x={26} y={28} width={368} height={196} rx={8} fill={mezcla("#0B1228", "#5A3AD8", luz)} stroke="#0A1022" strokeWidth={6} />
          <rect x={26} y={28} width={368} height={196} rx={8} fill={mezcla("#0B1228", "#E8408A", luz * (0.5 + 0.5 * Math.sin(f / 7)))} opacity={0.45} />
          <path d="M 70 200 L 130 70 L 190 200 L 250 60 L 330 200" fill="none" stroke={mezcla("#0B1228", "#7DF3FF", luz)} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
          <rect x={-20} y={0} width={14} height={400} fill="#0A1022" />
          <rect x={426} y={0} width={14} height={400} fill="#0A1022" />
          <rect x={-20} y={0} width={460} height={14} fill="#0A1022" />
          {[40, 150, 270, 380].map((x, i) => (
            <circle key={i} cx={x} cy={22} r={9} fill={mezcla("#1A2238", ["#7DF3FF", "#FF6EC7", "#FFD27A", "#7DF3FF"][i], luz)} />
          ))}
        </g>
        {/* haces de luz del escenario */}
        {[0, 1, 2, 3].map((i) => {
          const ang = -90 + Math.sin(f / 22 + i * 1.6) * 28 + (i - 1.5) * 18;
          const r = (ang * Math.PI) / 180;
          const ox = 680 + i * 110;
          return <path key={i} d={`M ${ox} 1082 L ${ox + Math.cos(r - 0.07) * 800} ${1082 + Math.sin(r - 0.07) * 800} L ${ox + Math.cos(r + 0.07) * 800} ${1082 + Math.sin(r + 0.07) * 800} Z`} fill={["#7DF3FF", "#FF6EC7", "#FFD27A", "#9F7BFF"][i]} opacity={0.3 * luz} style={{ mixBlendMode: "screen" }} />;
        })}
        <rect x={0} y={1400} width={1080} height={520} fill="#070B18" />
        {/* público del concierto (cabezas) */}
        {Array.from({ length: 70 }, (_, i) => (
          <g key={i}>
            <path d={`M ${540 + azar(i * 3) * 560 - 42} 1640 Q ${540 + azar(i * 3) * 560 - 42} 1520 ${560 + azar(i * 3) * 560} 1516 Q ${580 + azar(i * 3) * 560 + 22} 1520 ${580 + azar(i * 3) * 560 + 22} 1640 Z`} fill="#070B18" />
            <circle cx={560 + azar(i * 3) * 560} cy={1480 + azar(i * 5) * 100} r={20 + azar(i * 7) * 8} fill="#0A1022" />
            <path d={`M ${560 + azar(i * 3) * 560 - 18} ${1470 + azar(i * 5) * 100} Q ${560 + azar(i * 3) * 560} ${1456 + azar(i * 5) * 100} ${560 + azar(i * 3) * 560 + 18} ${1470 + azar(i * 5) * 100}`} stroke={mezcla("#0A1022", "#FFB86B", luz * 0.7)} strokeWidth={3} fill="none" strokeLinecap="round" />
          </g>
        ))}
      </svg>
      {/* halos de los reflectores */}
      {masts.map((x, i) => (
        <div key={i} style={{ position: "absolute", left: x - 280, top: (i === 1 || i === 2 ? 640 : 480) - 340, width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,246,214,0.6) 0%, rgba(255,246,214,0) 62%)", opacity: luz, mixBlendMode: "screen" }} />
      ))}
    </div>
  );
};

// ---------- estadio visto desde arriba (lleno, en azul profundo y dorado) ----------
export const EstadioArriba: React.FC<{ cx: number; cy: number; rx: number; ry: number; lleno: number; detalle?: boolean; brillo?: number }> = ({ cx, cy, rx, ry, lleno, detalle = true, brillo = 1 }) => {
  const f = useCurrentFrame();
  const anillos = [
    { a: 1.0, b: 0.84, n: 3 },
    { a: 0.82, b: 0.66, n: 3 },
    { a: 0.64, b: 0.53, n: 2 },
  ];
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx * 1.08} ry={ry * 1.08} fill="#0A1230" stroke="#33497A" strokeWidth={Math.max(2, rx * 0.012)} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#16234A" />
      {detalle
        ? anillos.map((an, j) =>
            Array.from({ length: an.n }, (_, m) => {
              const q = an.a - ((an.a - an.b) * (m + 0.5)) / an.n;
              const cant = Math.round(70 + 90 * q * (rx > 200 ? 1 : 0.5));
              return Array.from({ length: rx > 200 ? cant : 0 }, (_, i) => {
                const ang = (i / cant) * Math.PI * 2 + m * 0.07;
                const u = azar(j * 1000 + m * 100 + i);
                const ocupado = u < lleno;
                const sector = Math.floor(((ang / (Math.PI * 2)) * 12 + j) % 2);
                const col = ocupado ? (azar(i * 3 + m) < 0.28 ? "#FFE7A8" : sector ? "#E3B04B" : "#7FA6E0") : "#26335E";
                return <circle key={`${j}-${m}-${i}`} cx={cx + Math.cos(ang) * rx * q} cy={cy + Math.sin(ang) * ry * q} r={Math.max(2.4, rx * 0.0085)} fill={col} opacity={ocupado ? 0.7 + 0.3 * Math.sin(f / 9 + i) : 0.9} />;
              });
            }),
          )
        : [
            <ellipse key="a" cx={cx} cy={cy} rx={rx * 0.9} ry={ry * 0.9} fill="none" stroke="#E3B04B" strokeWidth={rx * 0.12} opacity={0.85 * brillo} />,
            <ellipse key="b" cx={cx} cy={cy} rx={rx * 0.7} ry={ry * 0.7} fill="none" stroke="#7FA6E0" strokeWidth={rx * 0.12} opacity={0.9 * brillo} />,
          ]}
      <rect x={cx - rx * 0.46} y={cy - ry * 0.46} width={rx * 0.92} height={ry * 0.92} rx={rx * 0.06} fill="#1F6E48" stroke="#E9F2E4" strokeWidth={Math.max(1.5, rx * 0.012)} />
      <line x1={cx} y1={cy - ry * 0.46} x2={cx} y2={cy + ry * 0.46} stroke="#E9F2E4" strokeWidth={Math.max(1, rx * 0.01)} opacity={0.8} />
      <ellipse cx={cx} cy={cy} rx={rx * 0.1} ry={ry * 0.1} fill="none" stroke="#E9F2E4" strokeWidth={Math.max(1, rx * 0.01)} opacity={0.8} />
    </g>
  );
};

// ---------- vista aérea ilustrada del parque Rizal (bahía, avenidas, manzanas, explanada iluminada) ----------
export const PARQUE_POLI = "M 330 640 L 760 640 L 800 700 L 800 1180 L 330 1180 Z";
export const ParqueAereo: React.FC<{ calido: number; lluvia?: number; luces?: number; semilla?: number; poncho?: boolean }> = ({ calido, lluvia = 0, luces = 1, semilla = 3, poncho = false }) => {
  const f = useCurrentFrame();
  const uid = uidDe(React.useId());
  const mar = mezcla("#16315E", "#2A4A74", lluvia);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${mezcla("#0B1020", "#1B2236", lluvia)} 0%, ${mezcla("#141C34", "#27314A", lluvia)} 100%)` }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id={`pq${uid}`}>
            <path d={PARQUE_POLI} />
          </clipPath>
          <radialGradient id={`gl${uid}`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#FFD98A" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#FFB45A" stopOpacity={0.15} />
          </radialGradient>
        </defs>
        {/* bahía */}
        <path d="M -40 300 L 250 300 Q 300 560 270 760 Q 250 1000 300 1250 L 290 1700 L -40 1700 Z" fill={mar} />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M ${20 + azar(i) * 170} ${380 + i * 110} q 26 -12 52 0 t 52 0`} stroke="#6C93C8" strokeWidth={3} fill="none" opacity={0.35 + 0.2 * Math.sin(f / 14 + i)} />
        ))}
        {/* manzanas de la ciudad */}
        {Array.from({ length: 80 }, (_, i) => {
          const col = i % 5;
          const fila = Math.floor(i / 5);
          const x = 830 + col * 62 - (fila % 2) * 20 + azar(i) * 10;
          const y = 360 + fila * 96;
          if (x > 1110) return null;
          const cal = azar(i * 3) < 0.45;
          return <rect key={i} x={x} y={y} width={48} height={72} rx={5} fill={cal ? "#33406A" : "#26305A"} stroke="#4A5A8A" strokeWidth={2} opacity={0.95} />;
        })}
        {Array.from({ length: 70 }, (_, i) => (
          <rect key={`v${i}`} x={842 + (i % 5) * 62 + azar(i) * 12} y={374 + Math.floor(i / 5) * 96 + azar(i * 3) * 30} width={7} height={9} fill="#FFD27A" opacity={0.6 * luces} />
        ))}
        {/* avenidas */}
        <rect x={296} y={600} width={534} height={620} rx={22} fill="#1B2440" />
        <path d="M 805 300 L 805 1760" stroke="#2B3558" strokeWidth={26} />
        <path d="M 300 1226 L 1100 1226" stroke="#2B3558" strokeWidth={26} />
        {/* explanada */}
        <path d={PARQUE_POLI} fill="#10172E" />
        <g clipPath={`url(#pq${uid})`}>
          <rect x={300} y={620} width={520} height={580} fill={`url(#gl${uid})`} opacity={0.35 * luces} />
          {Array.from({ length: 1000 }, (_, i) => {
            const u = azar(i * 7 + semilla);
            const x = 330 + (i % 40) * 11.8 + azar(i) * 6;
            const y = 646 + Math.floor(i / 40) * 21.5 + azar(i * 3) * 8;
            const fr = u < 0.1;
            return <circle key={i} cx={x} cy={y} r={2.2 + azar(i * 5) * 2.2} fill={poncho ? (azar(i * 9) < 0.7 ? "#F3C623" : fr ? "#DCEBFF" : "#FBF7EA") : fr ? "#DCEBFF" : azar(i * 9) < 0.5 ? "#FFD27A" : "#FFB45A"} opacity={luces * (0.65 + 0.35 * Math.sin(f / (10 + (i % 5)) + i))} />;
          })}
        </g>
        <path d={PARQUE_POLI} fill="none" stroke="#FFD98A" strokeWidth={5} opacity={0.8 * luces} strokeLinejoin="round" />
        {/* altar / tarima */}
        <g transform="translate(560 1160)">
          <rect x={-70} y={-16} width={140} height={34} rx={6} fill="#F7F1E3" stroke="#B9A97A" strokeWidth={3} />
          <path d="M 0 -50 L 0 -14 M -14 -36 L 14 -36" stroke="#E3B04B" strokeWidth={6} strokeLinecap="round" />
          <circle cy={0} r={90} fill="none" stroke="#FFE7A8" strokeWidth={3} opacity={0.5 * luces} />
        </g>
        {/* árboles de las avenidas */}
        {Array.from({ length: 16 }, (_, i) => (
          <circle key={i} cx={316 + i * 32} cy={1238} r={12 + azar(i) * 5} fill="#1E4A3A" opacity={0.8} />
        ))}
      </svg>
      <div style={{ position: "absolute", inset: 0, background: `rgba(255,150,60,${0.26 * calido})`, mixBlendMode: "soft-light" }} />
    </div>
  );
};

// ---------- altar iluminado visto desde atrás (mira hacia la multitud de luces) ----------
export const AltarDeEspaldas: React.FC<{ luz?: number }> = ({ luz = 1 }) => {
  const f = useCurrentFrame();
  const llama = 0.85 + 0.15 * Math.sin(f / 4) * Math.sin(f / 9);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      <defs>
        <radialGradient id="alt-halo">
          <stop offset="0%" stopColor="#FFC870" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#FFC870" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="alt-tela" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBF7EA" />
          <stop offset="100%" stopColor="#CFC6B0" />
        </linearGradient>
      </defs>
      {/* cruz de fondo a contraluz */}
      <path d="M 540 1000 L 540 1240 M 480 1060 L 600 1060" stroke="#0B1020" strokeWidth={22} strokeLinecap="round" opacity={0.0} />
      {/* mesa del altar */}
      <g transform="translate(0 150)"><path d="M 170 1400 L 250 1250 L 830 1250 L 910 1400 L 960 1960 L 120 1960 Z" fill="url(#alt-tela)" stroke="#B9A97A" strokeWidth={4} />
      <path d="M 250 1250 L 830 1250 L 840 1280 L 240 1280 Z" fill="#FFFFFF" opacity={0.85} />
      <path d="M 300 1330 Q 540 1370 780 1330 M 260 1450 Q 540 1500 820 1450" stroke="#B9A97A" strokeWidth={4} fill="none" opacity={0.6} />
      {/* candeleros */}
      {[300, 780].map((x) => (
        <g key={x}>
          <rect x={x - 22} y={1236} width={44} height={16} rx={4} fill="#C9973F" />
          <rect x={x - 11} y={1150} width={22} height={88} fill="#F7F3EA" stroke="#CFC6B2" strokeWidth={2} />
          <path d={`M ${x - 8} ${1150} Q ${x + Math.sin(f / 3 + x) * 3} ${1100 - llama * 12} ${x + 8} ${1150} Z`} fill="#FFC870" />
        </g>
      ))}
      {/* cruz de altar */}
      <path d="M 540 1130 L 540 1250 M 500 1168 L 580 1168" stroke="#E3B04B" strokeWidth={14} strokeLinecap="round" />
      {[300, 780].map((x) => (
        <circle key={`h${x}`} cx={x} cy={1110} r={150} fill="url(#alt-halo)" opacity={0.9 * luz * llama} style={{ mixBlendMode: "screen" }} />
      ))}
      </g>
    </svg>
  );
};

// pastilla de dato (discreta): "Manila, 1995 — 5 millones de personas"
export const Dato: React.FC<{ texto: string; aparece: number; y?: number; tam?: number; hasta?: number }> = ({ texto, aparece, y = 380, tam = 42, hasta = 99999 }) => {
  const f = useCurrentFrame();
  const o = lerp(f, aparece, aparece + 10, 0, 1) * (1 - lerp(f, hasta, hasta + 10, 0, 1));
  if (o <= 0) return null;
  const sube = lerp(f, aparece, aparece + 14, 24, 0, Easing.out(Easing.cubic));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y + sube, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ padding: `${tam * 0.3}px ${tam * 0.7}px`, borderRadius: 999, background: "rgba(11,20,38,0.9)", border: `4px solid ${PAL.dorado}`, boxShadow: "0 12px 30px rgba(0,0,0,0.5)", fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: tam, color: "#F7F1E3", whiteSpace: "nowrap", letterSpacing: 0.4 }}>{texto}</div>
    </div>
  );
};
