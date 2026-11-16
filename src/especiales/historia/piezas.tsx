// Piezas propias del canal de historia (reutilizables entre videos): mapa de África por potencias,
// placa de dato, humo, chispas, siluetas de época, compás, regla y cierre del canal con el hilo dorado.
// Todo es ilustración original en SVG animada por frames.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { FUENTE_SERIFA, FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { lerp } from "../jesus-12-30/escenarios";
import { azar } from "../ambiente";
import { AFRICA_K, AFRICA_PAISES, AFRICA_X0, AFRICA_Y0, type Potencia } from "./africa-datos";

// ---------- paleta del canal de historia ----------
export const H = {
  noche: "#0B132B",
  nocheAlta: "#1C2541",
  pergamino: "#F4ECD8",
  pergaminoOscuro: "#D9C79E",
  sepia: "#6B4A2B",
  tinta: "#3A2616",
  dorado: "#D4AF37",
  doradoClaro: "#F2D675",
  selva: "#1F5C3A",
  selvaOscura: "#123524",
  ocre: "#C98B3C",
  arena: "#E0B872",
  carmesi: "#B3202F",
  carmesiOscuro: "#5E0F1A",
  acero: "#7D8791",
  aceroOscuro: "#3B434D",
  caoba: "#4A1F14",
  caobaClara: "#7A3520",
  bronce: "#B08D57",
  hueso: "#F5F0E1",
};

export const COLOR_POTENCIA: Record<Potencia, string> = {
  GB: "#B5475A",
  FR: "#4A72A8",
  DE: "#7D8791",
  BE: "#8A64A8",
  PT: "#4F8F5B",
  IT: "#3F9C96",
  ES: "#C9772F",
  IND: H.dorado,
};
export const NOMBRE_POTENCIA: Record<Exclude<Potencia, "IND">, string> = {
  GB: "Reino Unido",
  FR: "Francia",
  DE: "Alemania",
  BE: "Bélgica",
  PT: "Portugal",
  IT: "Italia",
  ES: "España",
};

export const cl = (v: number) => Math.max(0, Math.min(1, v));
const fuera = Easing.out(Easing.cubic);

// ---------- mapa de África ----------
export const MAPA_W = 920;
export const MAPA_H = 960;
// lon/lat → coordenadas del lienzo del mapa (920×960)
export const geo = (lon: number, lat: number): [number, number] => [(lon - AFRICA_X0) * AFRICA_K, (AFRICA_Y0 - lat) * AFRICA_K];

const linea = (pts: [number, number][]) => {
  const p = pts.map(([a, b]) => geo(a, b));
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 1; i < p.length - 1; i++) {
    const mx = (p[i][0] + p[i + 1][0]) / 2;
    const my = (p[i][1] + p[i + 1][1]) / 2;
    d += ` Q ${p[i][0]} ${p[i][1]} ${mx} ${my}`;
  }
  d += ` L ${p[p.length - 1][0]} ${p[p.length - 1][1]}`;
  return d;
};
export const RIO_CONGO = linea([[26.5, -10.5], [26.3, -6], [25.4, -1.5], [25.2, 0.6], [23, 2], [20, 1.6], [18, 0], [16.6, -2.2], [15.6, -4], [14, -5.2], [12.4, -6]]);
export const RIO_NILO = linea([[32.9, 0.4], [31.5, 3.5], [31.4, 7], [32.5, 12], [32.5, 15.6], [33.9, 17.8], [32.2, 19.3], [31, 20.5], [32.9, 24], [31.3, 27.5], [31.2, 30], [31, 31.4]]);
export const RIO_NIGER = linea([[-10.6, 9.4], [-8, 12.4], [-5, 14.3], [-3, 16.7], [0, 16.6], [2, 13.6], [4.3, 11], [6.6, 7.8], [6.1, 4.6]]);

// Enclaves costeros europeos hacia 1870–1880 (aproximados): [lon, lat, radio en grados, potencia]
const COSTA_1880: [number, number, number, Potencia][] = [
  [3, 36, 4.6, "FR"], [-16.4, 15.4, 2.3, "FR"], [9.4, 0.3, 1.4, "FR"],
  [21.5, -32.5, 6.2, "GB"], [30.6, -29.6, 2, "GB"], [-1, 5.2, 1.7, "GB"], [3.4, 6.5, 1.1, "GB"], [-13, 8.4, 1.2, "GB"], [-16.5, 13.4, 0.8, "GB"],
  [13.2, -9, 2.6, "PT"], [12.6, -13, 2, "PT"], [35, -19.6, 2.1, "PT"], [40.4, -15, 1.7, "PT"], [32.7, -25.8, 1.2, "PT"], [-15.5, 12, 0.9, "PT"],
  [8.8, 3.6, 0.7, "ES"],
];

const ORDEN_1914 = [...AFRICA_PAISES].sort((a, b) => azar(a.c[0] * 7 + a.c[1]) - azar(b.c[0] * 7 + b.c[1]));
const TURNO: Record<string, number> = Object.fromEntries(ORDEN_1914.map((p, i) => [p.id, i / ORDEN_1914.length]));

export type EstiloMapa = "pergamino" | "noche" | "terreno";

// Mapa de África. `costa` 0..1 enciende los enclaves de 1880; `reparto` 0..1 pinta las colonias de 1914 (una tras otra);
// `oro` 0..1 hace brillar a Etiopía y Liberia. Se dibuja en un lienzo de 920×960 y se ubica con x, y, escala.
export const MapaAfrica: React.FC<{
  x: number;
  y: number;
  escala?: number;
  estilo?: EstiloMapa;
  costa?: number;
  reparto?: number;
  oro?: number;
  oroLiberia?: number; // si se indica, Liberia brilla por separado
  fronteras?: number; // opacidad de las fronteras interiores
  rios?: number;
  opacidad?: number;
  hijos?: React.ReactNode; // capas SVG extra en coordenadas del mapa
}> = ({ x, y, escala = 1, estilo = "pergamino", costa = 0, reparto = 0, oro = 0, fronteras = 0, rios = 0.6, opacidad = 1, hijos, oroLiberia }) => {
  const f = useCurrentFrame();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const base = estilo === "pergamino" ? "#E3D2A6" : estilo === "noche" ? "#22305A" : "#B9A05E";
  const borde = estilo === "pergamino" ? H.sepia : estilo === "noche" ? H.dorado : "#4E3B1C";
  const rio = estilo === "noche" ? "#7FB6E6" : "#4F86A8";
  return (
    <svg width={MAPA_W * escala} height={MAPA_H * escala} viewBox={`0 0 ${MAPA_W} ${MAPA_H}`} style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity: opacidad }}>
      <defs>
        <clipPath id={`${uid}c`}>
          {AFRICA_PAISES.map((p) => (
            <path key={p.id} d={p.d} />
          ))}
        </clipPath>
        <radialGradient id={`${uid}t`} cx="45%" cy="58%" r="55%">
          <stop offset="0%" stopColor={H.selva} />
          <stop offset="38%" stopColor="#5E8A45" />
          <stop offset="70%" stopColor="#C9A55A" />
          <stop offset="100%" stopColor={H.arena} />
        </radialGradient>
        <linearGradient id={`${uid}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={H.arena} />
          <stop offset="34%" stopColor="#D9AE62" />
          <stop offset="46%" stopColor="#8FA353" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#8FA353" stopOpacity={0} />
        </linearGradient>
        <radialGradient id={`${uid}o`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF3B8" stopOpacity={0.95} />
          <stop offset="100%" stopColor="#FFD75A" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* contorno (trazo grueso por debajo) */}
      {AFRICA_PAISES.map((p) => (
        <path key={`b${p.id}`} d={p.d} fill={borde} stroke={borde} strokeWidth={estilo === "noche" ? 5 : 7} strokeLinejoin="round" />
      ))}
      {AFRICA_PAISES.map((p) => (
        <path key={`f${p.id}`} d={p.d} fill={base} stroke={base} strokeWidth={1.2} />
      ))}
      {estilo === "terreno" ? (
        <g clipPath={`url(#${uid}c)`}>
          <rect width={MAPA_W} height={MAPA_H} fill={`url(#${uid}t)`} />
          <rect width={MAPA_W} height={MAPA_H} fill={`url(#${uid}s)`} />
          {Array.from({ length: 70 }, (_, i) => {
            const [px, py] = geo(8 + azar(i * 3) * 24, -8 + azar(i * 5 + 1) * 15);
            return <circle key={i} cx={px} cy={py} r={7 + azar(i) * 9} fill={H.selvaOscura} opacity={0.28} />;
          })}
        </g>
      ) : null}
      {/* enclaves costeros de 1880 */}
      {costa > 0 ? (
        <g clipPath={`url(#${uid}c)`} opacity={cl(1 - reparto * 3)}>
          {COSTA_1880.map(([lon, lat, r, pot], i) => {
            const e = cl(costa * 2.2 - azar(i * 9) * 1.1);
            const [cx, cy] = geo(lon, lat);
            return <circle key={i} cx={cx} cy={cy} r={r * AFRICA_K * fuera(e)} fill={COLOR_POTENCIA[pot]} opacity={0.92} />;
          })}
        </g>
      ) : null}
      {/* colonias de 1914 */}
      {reparto > 0
        ? AFRICA_PAISES.map((p) => {
            if (p.p === "IND") return null;
            const e = cl((reparto * 1.25 - TURNO[p.id]) * 5);
            if (e <= 0) return null;
            return <path key={`r${p.id}`} d={p.d} fill={COLOR_POTENCIA[p.p]} opacity={e * (estilo === "noche" ? 0.9 : 0.86)} stroke={estilo === "noche" ? "#0B132B" : "#F4ECD8"} strokeWidth={1.4} strokeOpacity={e * 0.8} />;
          })
        : null}
      {fronteras > 0 ? AFRICA_PAISES.map((p) => <path key={`l${p.id}`} d={p.d} fill="none" stroke={estilo === "noche" ? H.doradoClaro : H.tinta} strokeWidth={1.3} opacity={fronteras * 0.7} />) : null}
      {rios > 0 ? (
        <g fill="none" stroke={rio} strokeLinecap="round" opacity={rios}>
          <path d={RIO_NILO} strokeWidth={3} />
          <path d={RIO_NIGER} strokeWidth={3} />
          <path d={RIO_CONGO} strokeWidth={3.6} />
        </g>
      ) : null}
      {/* Etiopía y Liberia en dorado */}
      {oro > 0 || (oroLiberia ?? 0) > 0
        ? AFRICA_PAISES.filter((p) => p.p === "IND").map((p) => {
            const late = 0.75 + 0.25 * Math.sin(f / 9 + p.c[0]);
            return (
              <g key={`o${p.id}`} opacity={p.id === "LBR" && oroLiberia !== undefined ? oroLiberia : oro}>
                <circle cx={p.c[0]} cy={p.c[1]} r={(p.id === "ETH" ? 120 : 62) * (0.9 + 0.1 * late)} fill={`url(#${uid}o)`} opacity={0.75 * late} />
                <path d={p.d} fill={H.dorado} stroke="#FFF3B8" strokeWidth={3} />
              </g>
            );
          })
        : null}
      {hijos}
    </svg>
  );
};

export const centroPais = (id: string): [number, number] => AFRICA_PAISES.find((p) => p.id === id)?.c ?? [0, 0];

// ---------- placa histórica discreta (una o dos líneas) ----------
export const Placa: React.FC<{ texto: string; texto2?: string; aparece: number; aparece2?: number; hasta?: number; y?: number; tam?: number }> = ({ texto, texto2, aparece, aparece2, hasta = 99999, y = 300, tam = 46 }) => {
  const f = useCurrentFrame();
  const o = lerp(f, aparece, aparece + 10, 0, 1) * (1 - lerp(f, hasta, hasta + 10, 0, 1));
  if (o <= 0) return null;
  const sube = lerp(f, aparece, aparece + 14, 22, 0, fuera);
  const o2 = texto2 ? lerp(f, aparece2 ?? aparece + 8, (aparece2 ?? aparece + 8) + 10, 0, 1) : 0;
  const partes = texto.split("|").map((s) => s.trim());
  return (
    <div style={{ position: "absolute", left: 60, right: 150, top: y + sube, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ padding: `${tam * 0.34}px ${tam * 0.7}px`, borderRadius: 14, background: "rgba(11,19,43,0.9)", borderLeft: `8px solid ${H.dorado}`, boxShadow: "0 12px 30px rgba(0,0,0,0.5)", fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: tam, color: H.pergamino, letterSpacing: 0.3, textAlign: "left", lineHeight: 1.18 }}>
        <div style={{ whiteSpace: "nowrap" }}>
          {partes.map((p, i) => (
            <span key={i}>
              {i > 0 ? <span style={{ color: H.dorado, margin: "0 14px" }}>|</span> : null}
              <span style={{ color: i === 0 && partes.length > 1 ? H.dorado : H.pergamino }}>{p}</span>
            </span>
          ))}
        </div>
        {texto2 ? <div style={{ whiteSpace: "nowrap", fontSize: tam * 0.84, fontWeight: 600, color: H.pergaminoOscuro, opacity: o2, height: o2 > 0 ? "auto" : 0, overflow: "hidden" }}>{texto2}</div> : null}
      </div>
    </div>
  );
};

// etiqueta chica (nombre de persona, lugar u objeto)
export const Rotulito: React.FC<{ texto: string; x: number; y: number; aparece: number; hasta?: number; tam?: number; color?: string }> = ({ texto, x, y, aparece, hasta = 99999, tam = 34, color = H.dorado }) => {
  const f = useCurrentFrame();
  const o = lerp(f, aparece, aparece + 8, 0, 1) * (1 - lerp(f, hasta, hasta + 8, 0, 1));
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: `-50% ${(1 - o) * 14}px`, opacity: o, padding: `${tam * 0.22}px ${tam * 0.5}px`, borderRadius: 10, background: "rgba(11,19,43,0.88)", border: `3px solid ${color}`, color: H.pergamino, fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: tam, whiteSpace: "nowrap", boxShadow: "0 8px 20px rgba(0,0,0,0.45)" }}>
      {texto}
    </div>
  );
};

// ---------- humo que sube (bocanadas) ----------
export const Humo: React.FC<{ x: number; y: number; n?: number; alto?: number; ancho?: number; color?: string; semilla?: number; fuerza?: number; viento?: number }> = ({ x, y, n = 9, alto = 520, ancho = 90, color = "#59606B", semilla = 0, fuerza = 1, viento = 0.25 }) => {
  const f = useCurrentFrame();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={10} height={10}>
      <defs>
        <filter id={`${uid}b`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={14} />
        </filter>
      </defs>
      <g filter={`url(#${uid}b)`}>
        {Array.from({ length: n }, (_, i) => {
          const t = ((f / 150 + i / n + azar(semilla + i)) % 1 + 1) % 1;
          const r = ancho * (0.35 + t * 1.2);
          const dx = Math.sin(t * 5 + i + semilla) * ancho * 0.4 + t * alto * viento;
          return <circle key={i} cx={dx} cy={-t * alto} r={r} fill={color} opacity={fuerza * 0.6 * Math.sin(Math.PI * Math.min(1, t * 1.15)) * (1 - t * 0.5)} />;
        })}
      </g>
    </svg>
  );
};

// ---------- chispas / cenizas / motas ----------
export const Chispas: React.FC<{ x: number; y: number; ancho: number; alto: number; n?: number; color?: string; semilla?: number; sube?: boolean; tam?: number }> = ({ x, y, ancho, alto, n = 30, color = "#FFB347", semilla = 0, sube = true, tam = 4 }) => {
  const f = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible", pointerEvents: "none" }} width={ancho} height={alto}>
      {Array.from({ length: n }, (_, i) => {
        const v = 0.004 + azar(semilla + i * 3) * 0.008;
        const t = ((f * v + azar(semilla + i * 7)) % 1 + 1) % 1;
        const px = azar(semilla + i * 11) * ancho + Math.sin(f / 23 + i) * 26;
        const py = sube ? alto * (1 - t) : alto * t;
        return <circle key={i} cx={px} cy={py} r={tam * (0.5 + azar(i + semilla))} fill={color} opacity={Math.sin(Math.PI * t) * (0.5 + 0.5 * Math.sin(f / 5 + i * 2))} />;
      })}
    </svg>
  );
};

// ---------- personas de época, en silueta ----------
// De espaldas o de frente, de pie o sentadas: levita, cuello alto; opción de barba, calva, patillas o uniforme con charreteras.
export const Caballero: React.FC<{ x: number; y: number; e?: number; color?: string; luz?: string; sentado?: boolean; barba?: boolean; calvo?: boolean; charreteras?: boolean; bigote?: boolean; mece?: number; brazo?: number }> = ({
  x,
  y,
  e = 1,
  color = "#141A2E",
  luz = "#3A4468",
  sentado = false,
  barba = false,
  calvo = false,
  charreteras = false,
  bigote = false,
  mece = 0,
  brazo = 0,
}) => {
  const f = useCurrentFrame();
  const m = Math.sin(f / 31 + mece * 5) * 1.6 * (mece ? 1 : 0);
  const h = sentado ? 250 : 470;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={10} height={10}>
      <g transform={`scale(${e}) rotate(${m})`}>
        {/* cuerpo: los pies (o la cintura si está sentado) quedan en y=0 */}
        <path d={sentado ? `M -92 0 L -100 -150 Q -100 -214 -52 -226 L 52 -226 Q 100 -214 100 -150 L 92 0 Z` : `M -70 0 L -84 -200 L -98 -330 Q -100 -412 -50 -428 L 50 -428 Q 100 -412 98 -330 L 84 -200 L 70 0 L 14 0 L 0 -170 L -14 0 Z`} fill={color} />
        {/* brazo que gesticula */}
        {brazo > 0 ? <path d={`M 84 ${-h + 70} Q ${150 + brazo * 40} ${-h + 110 - brazo * 90} ${170 + brazo * 60} ${-h + 40 - brazo * 150}`} stroke={color} strokeWidth={44} strokeLinecap="round" fill="none" /> : null}
        {/* cuello y cabeza */}
        <rect x={-24} y={-h - 2} width={48} height={40} fill={color} />
        <ellipse cx={0} cy={-h - 44} rx={46} ry={54} fill={color} />
        {!calvo ? <path d={`M -48 ${-h - 50} Q -50 ${-h - 108} 0 ${-h - 106} Q 50 ${-h - 108} 48 ${-h - 50} Q 30 ${-h - 84} 0 ${-h - 84} Q -30 ${-h - 84} -48 ${-h - 50} Z`} fill={color} /> : null}
        {barba ? <path d={`M -44 ${-h - 30} Q -40 ${-h + 70} 0 ${-h + 96} Q 40 ${-h + 70} 44 ${-h - 30} Z`} fill={color} /> : null}
        {bigote ? <path d={`M -62 ${-h - 16} Q -30 ${-h - 34} 0 ${-h - 22} Q 30 ${-h - 34} 62 ${-h - 16} Q 30 ${-h - 4} 0 ${-h - 12} Q -30 ${-h - 4} -62 ${-h - 16} Z`} fill={color} /> : null}
        {charreteras ? (
          <g fill={H.dorado} opacity={0.85}>
            <rect x={-112} y={-h + 28} width={54} height={16} rx={8} />
            <rect x={58} y={-h + 28} width={54} height={16} rx={8} />
          </g>
        ) : null}
        {/* luz de contorno */}
        <path d={`M 40 ${-h - 80} Q 60 ${-h - 40} 44 ${-h - 4} M 70 ${-h + 30} Q 104 ${-h + 60} 98 ${-h + 150}`} stroke={luz} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
      </g>
    </svg>
  );
};

// ---------- compás de acero y regla de bronce (vista cenital) ----------
// El compás se dibuja con la punta clavada en (0,0); `apertura` en grados.
export const Compas: React.FC<{ apertura?: number; largo?: number }> = ({ apertura = 34, largo = 330 }) => {
  const a = (apertura / 2) * (Math.PI / 180);
  const pata = (s: number) => `${Math.sin(a) * largo * s} ${-Math.cos(a) * largo}`;
  // la bisagra está arriba; pata izquierda termina en (0,0)
  const bx = Math.sin(a) * largo;
  const by = -Math.cos(a) * largo;
  void pata;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      <defs>
        <linearGradient id="hcomp" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#59616C" />
          <stop offset="45%" stopColor="#E3E8EE" />
          <stop offset="100%" stopColor="#6C7480" />
        </linearGradient>
      </defs>
      <g>
        <path d={`M 0 0 L ${bx - 9} ${by} L ${bx + 9} ${by} Z`} fill="url(#hcomp)" stroke="#2B3038" strokeWidth={2} />
        <path d={`M ${2 * bx} 0 L ${bx - 9} ${by} L ${bx + 9} ${by} Z`} fill="url(#hcomp)" stroke="#2B3038" strokeWidth={2} />
        <path d={`M ${2 * bx - 3} -26 L ${2 * bx} 4 L ${2 * bx + 3} -26 Z`} fill="#1A1A1A" />
        <circle cx={bx} cy={by} r={20} fill={H.bronce} stroke="#5E4520" strokeWidth={4} />
        <circle cx={bx} cy={by} r={7} fill="#5E4520" />
        <rect x={bx - 7} y={by - 74} width={14} height={58} rx={6} fill={H.bronce} stroke="#5E4520" strokeWidth={3} />
        <path d={`M ${bx * 0.55} ${by * 0.45} Q ${bx} ${by * 0.3} ${bx * 1.45} ${by * 0.45}`} stroke="#8A929E" strokeWidth={5} fill="none" />
      </g>
    </svg>
  );
};

export const Regla: React.FC<{ largo?: number; ancho?: number }> = ({ largo = 760, ancho = 64 }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
    <defs>
      <linearGradient id="hregla" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D9B878" />
        <stop offset="50%" stopColor={H.bronce} />
        <stop offset="100%" stopColor="#7A5C2E" />
      </linearGradient>
    </defs>
    <rect x={0} y={4} width={largo} height={ancho} rx={5} fill="rgba(0,0,0,0.35)" transform="translate(8 10)" />
    <rect x={0} y={0} width={largo} height={ancho} rx={5} fill="url(#hregla)" stroke="#5E4520" strokeWidth={3} />
    {Array.from({ length: Math.floor(largo / 19) }, (_, i) => (
      <line key={i} x1={12 + i * 19} y1={0} x2={12 + i * 19} y2={i % 5 === 0 ? 26 : 14} stroke="#4A3618" strokeWidth={2.4} />
    ))}
  </svg>
);

// Mano con puño de gala (vista cenital): la muñeca entra desde `desde` grados; los dedos quedan en (0,0).
export const ManoGala: React.FC<{ rot?: number; largo?: number }> = ({ rot = 0, largo = 900 }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
    <g transform={`rotate(${rot})`}>
      <rect x={96} y={-66} width={largo} height={132} rx={30} fill="#11131C" />
      <rect x={96} y={-66} width={largo} height={30} rx={14} fill="#232838" opacity={0.7} />
      <rect x={62} y={-58} width={62} height={116} rx={12} fill="#F3EFE4" stroke="#C9C2B0" strokeWidth={3} />
      <circle cx={96} cy={30} r={9} fill={H.dorado} stroke="#7A5C2E" strokeWidth={2} />
      <path d="M 70 -46 Q 20 -58 -6 -40 Q -34 -20 -30 8 Q -28 40 4 46 Q 40 54 70 46 Z" fill="#E2B595" stroke="#B98463" strokeWidth={3} />
      <path d="M -20 -18 Q 4 -12 18 -22 M -24 4 Q 2 6 20 -2 M -14 26 Q 6 26 22 18" stroke="#B98463" strokeWidth={3} fill="none" strokeLinecap="round" />
    </g>
  </svg>
);

// ---------- cierre del canal: el hilo dorado teje el emblema y el título ----------
const HILO = "M -120 1180 C 120 1080 260 900 330 760 C 400 600 520 470 640 520 C 770 575 760 760 640 800 C 500 845 400 720 440 600 C 480 480 620 430 720 500 C 840 585 800 780 660 850 C 560 900 420 900 300 960 C 200 1010 180 1090 300 1100 L 800 1100";
const LARGO_HILO = 3900;
export const CierreCanal: React.FC<{ nombre?: string; lema?: string }> = ({ nombre = "El pasado del pasado", lema = "el hilo de la historia" }) => {
  const f = useCurrentFrame();
  const teje = lerp(f, 0, 62, 0, 1, Easing.inOut(Easing.quad));
  const titulo = lerp(f, 38, 60, 0, 1, fuera);
  const sub = lerp(f, 58, 78, 0, 1, fuera);
  const respira = 0.85 + 0.15 * Math.sin(f / 22);
  const palabras = nombre.split(" ");
  const mitad = Math.ceil(palabras.length / 2);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% 42%, ${H.nocheAlta} 0%, ${H.noche} 72%)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 34% at 50% 36%, rgba(244,236,216,${0.13 * respira}) 0%, rgba(244,236,216,0) 100%)` }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.1 }}>
        {Array.from({ length: 34 }, (_, i) => (
          <path key={i} d={`M 0 ${i * 58 + 10} Q 540 ${i * 58 + 10 + (azar(i) - 0.5) * 30} 1080 ${i * 58 + 10}`} stroke={H.pergamino} strokeWidth={1.4} fill="none" />
        ))}
      </svg>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="hilo-brillo" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={9} />
          </filter>
        </defs>
        <g transform="translate(0 -40)">
          <path d={HILO} fill="none" stroke={H.doradoClaro} strokeWidth={16} strokeLinecap="round" strokeDasharray={LARGO_HILO} strokeDashoffset={LARGO_HILO * (1 - teje)} filter="url(#hilo-brillo)" opacity={0.7 * respira} />
          <path d={HILO} fill="none" stroke={H.dorado} strokeWidth={6} strokeLinecap="round" strokeDasharray={LARGO_HILO} strokeDashoffset={LARGO_HILO * (1 - teje)} />
          <path d={HILO} fill="none" stroke="#FFF6CF" strokeWidth={2} strokeLinecap="round" strokeDasharray={LARGO_HILO} strokeDashoffset={LARGO_HILO * (1 - teje)} />
          {/* aguja y reloj de arena: el emblema dentro del lazo */}
          <g opacity={lerp(f, 30, 50, 0, 1)} transform="translate(590 655)">
            <path d="M -44 -62 L 44 -62 L 8 0 L 44 62 L -44 62 L -8 0 Z" fill="none" stroke={H.pergamino} strokeWidth={7} strokeLinejoin="round" />
            <path d={`M -22 ${-40 + 16 * cl(f / 150)} L 22 ${-40 + 16 * cl(f / 150)} L 0 -4 Z`} fill={H.dorado} />
            <path d="M -30 56 Q 0 26 30 56 Z" fill={H.dorado} />
            <line x1={0} y1={-2} x2={0} y2={40} stroke={H.dorado} strokeWidth={3} strokeDasharray="5 7" strokeDashoffset={-f} />
          </g>
        </g>
      </svg>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1110, textAlign: "center", opacity: titulo, translate: `0px ${(1 - titulo) * 36}px`, fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 104, lineHeight: 1.02, color: H.pergamino, textShadow: "0 0 40px rgba(212,175,55,0.5), 0 8px 20px rgba(0,0,0,0.5)" }}>
        {palabras.slice(0, mitad).join(" ")}
        <br />
        <span style={{ color: H.dorado }}>{palabras.slice(mitad).join(" ")}</span>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1352, textAlign: "center", opacity: sub, fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: 50, color: H.pergaminoOscuro, letterSpacing: 1 }}>{lema}</div>
      <Chispas x={80} y={300} ancho={920} alto={1300} n={34} color={H.doradoClaro} semilla={5} tam={3.2} />
    </AbsoluteFill>
  );
};
