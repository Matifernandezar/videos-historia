// Reemplazo mínimo de la API de Remotion para la VISTA PREVIA APROXIMADA (sin npm).
// Solo sirve para revisar diseño y legibilidad cuadro por cuadro. El render real siempre usa Remotion.
import React, { createContext, useContext } from "react";

type Config = { fps: number; width: number; height: number; durationInFrames: number; id: string };
const FrameCtx = createContext(0);
const ConfigCtx = createContext<Config>({ fps: 30, width: 1080, height: 1920, durationInFrames: 90, id: "vista" });

export const __Proveedor: React.FC<{ frame: number; config: Config; children: React.ReactNode }> = ({ frame, config, children }) => (
  <ConfigCtx.Provider value={config}>
    <FrameCtx.Provider value={frame}>{children}</FrameCtx.Provider>
  </ConfigCtx.Provider>
);

export const useCurrentFrame = () => useContext(FrameCtx);
export const useVideoConfig = () => useContext(ConfigCtx);

export const AbsoluteFill: React.FC<React.HTMLAttributes<HTMLDivElement> & { name?: string }> = ({ style, children, name: _n, ...rest }) => (
  <div
    {...rest}
    style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", ...style }}
  >
    {children}
  </div>
);

export const Sequence: React.FC<{
  from?: number;
  durationInFrames?: number;
  layout?: "absolute-fill" | "none";
  name?: string;
  premountFor?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ from = 0, durationInFrames = Infinity, layout = "absolute-fill", style, children }) => {
  const f = useContext(FrameCtx);
  if (f < from || f >= from + durationInFrames) return null;
  const inner = <FrameCtx.Provider value={f - from}>{children}</FrameCtx.Provider>;
  return layout === "none" ? inner : <AbsoluteFill style={style}>{inner}</AbsoluteFill>;
};

// ---------- Easing ----------
type Fn = (t: number) => number;
const bezier = (x1: number, y1: number, x2: number, y2: number): Fn => {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x;
      const d = dx(t);
      if (Math.abs(e) < 1e-6 || Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    t = Math.min(1, Math.max(0, t));
    return sy(t);
  };
};
export const Easing = {
  linear: (t: number) => t,
  ease: bezier(0.42, 0, 1, 1),
  quad: (t: number) => t * t,
  cubic: (t: number) => t * t * t,
  sin: (t: number) => 1 - Math.cos((t * Math.PI) / 2),
  circle: (t: number) => 1 - Math.sqrt(1 - t * t),
  exp: (t: number) => Math.pow(2, 10 * (t - 1)),
  back: (s = 1.70158) => (t: number) => t * t * ((s + 1) * t - s),
  bezier,
  in: (f: Fn) => f,
  out: (f: Fn) => (t: number) => 1 - f(1 - t),
  inOut: (f: Fn) => (t: number) => (t < 0.5 ? f(t * 2) / 2 : 1 - f((1 - t) * 2) / 2),
};

type Opciones = {
  easing?: Fn;
  extrapolateLeft?: "clamp" | "extend" | "identity";
  extrapolateRight?: "clamp" | "extend" | "identity";
};
export const interpolate = (x: number, entrada: readonly number[], salida: readonly number[], o: Opciones = {}): number => {
  const ease = o.easing ?? ((t: number) => t);
  let i = 0;
  while (i < entrada.length - 2 && x > entrada[i + 1]) i++;
  const a = entrada[i], b = entrada[i + 1];
  let t = b === a ? 1 : (x - a) / (b - a);
  if (t < 0 && i === 0) {
    if ((o.extrapolateLeft ?? "extend") === "clamp") return salida[0];
  }
  if (t > 1 && i === entrada.length - 2) {
    if ((o.extrapolateRight ?? "extend") === "clamp") return salida[salida.length - 1];
  }
  const tt = t >= 0 && t <= 1 ? ease(t) : t;
  return salida[i] + tt * (salida[i + 1] - salida[i]);
};

const resorte = (seg: number, damping: number, stiffness: number, mass: number) => {
  const w0 = Math.sqrt(stiffness / mass);
  const z = damping / (2 * Math.sqrt(stiffness * mass));
  if (z < 1) {
    const wd = w0 * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w0 * seg) * (Math.cos(wd * seg) + ((z * w0) / wd) * Math.sin(wd * seg));
  }
  if (z === 1) return 1 - Math.exp(-w0 * seg) * (1 + w0 * seg);
  const r1 = -w0 * (z - Math.sqrt(z * z - 1));
  const r2 = -w0 * (z + Math.sqrt(z * z - 1));
  const c2 = r1 / (r1 - r2);
  const c1 = 1 - c2;
  return 1 - (c1 * Math.exp(r1 * seg) + c2 * Math.exp(r2 * seg));
};

export const spring = ({
  frame,
  fps,
  config = {},
  from = 0,
  to = 1,
  durationInFrames,
  delay = 0,
}: {
  frame: number;
  fps: number;
  config?: { damping?: number; stiffness?: number; mass?: number; overshootClamping?: boolean };
  from?: number;
  to?: number;
  durationInFrames?: number;
  delay?: number;
}) => {
  const d = config.damping ?? 10, k = config.stiffness ?? 100, m = config.mass ?? 1;
  let f = frame - delay;
  if (f < 0) return from;
  if (durationInFrames) {
    let natural = 10 * fps;
    for (let s = 1; s < 10 * fps; s++) {
      let ok = true;
      for (let q = s; q < s + fps; q++) if (Math.abs(resorte(q / fps, d, k, m) - 1) > 0.005) { ok = false; break; }
      if (ok) { natural = s; break; }
    }
    f = (f * natural) / durationInFrames;
  }
  let v = resorte(f / fps, d, k, m);
  if (config.overshootClamping) v = Math.min(1, v);
  return from + (to - from) * v;
};

export const random = (seed: string | number | null) => {
  const s = String(seed);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return ((h >>> 0) % 100000) / 100000;
};

export const interpolateColors = (x: number, entrada: number[], salida: string[]) => {
  const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const a = salida.map(hex);
  const r = [0, 1, 2].map((k) => Math.round(interpolate(x, entrada, a.map((c) => c[k]), { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  return `rgb(${r.join(",")})`;
};

export const staticFile = (p: string) => `./public/${p}`;
export const delayRender = (_?: string) => 0;
export const continueRender = (_: number) => undefined;
export const cancelRender = (e: unknown) => { throw e; };
export const Img: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (p) => <img {...p} />;
export const Composition: React.FC<Record<string, unknown>> = () => null;
export const Folder: React.FC<{ name: string; children?: React.ReactNode }> = ({ children }) => <>{children}</>;
export const registerRoot = () => undefined;
export const getInputProps = () => ({});
export type CalculateMetadataFunction<T> = (o: { props: T; defaultProps: T; abortSignal: AbortSignal }) => Promise<Record<string, unknown>> | Record<string, unknown>;
