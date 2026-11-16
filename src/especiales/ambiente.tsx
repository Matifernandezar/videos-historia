// Kit de ambientación (v2): cielos con nubes, astros con resplandor, montes con bruma, árboles, pasto,
// rocas, casas de adobe y efectos de luz. Todo original, dibujado por código y animado por frames.
// Se usa dentro de <Camara> (coordenadas de mundo, 1080 de ancho base).
import React from "react";
import { useCurrentFrame } from "remotion";

export const azar = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
export const mezcla = (a: string, b: string, t: number) => {
  const pa = hex(a);
  const pb = hex(b);
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(",")})`;
};
const cl = (v: number) => Math.max(0, Math.min(1, v));

// ---------- cielo ----------
export type Hora = "dia" | "tarde" | "alba" | "noche";
const CIELOS: Record<Hora, string[]> = {
  dia: ["#3F78BE", "#7FB0DC", "#C5DEEC", "#F4E6C4"],
  tarde: ["#27356A", "#7B5A8C", "#E28C5C", "#F8CE8E"],
  alba: ["#4E6FA8", "#B7A3C6", "#F4B88C", "#FCE3B4"],
  noche: ["#050A18", "#0C1834", "#1B2C55", "#2C406E"],
};
const degradado = (c: string[]) => `linear-gradient(180deg, ${c[0]} 0%, ${c[1]} 38%, ${c[2]} 72%, ${c[3]} 100%)`;

// Cielo con degradado de 4 tonos, nubes suaves que se desplazan y estrellas.
// `noche` 0..1 funde hacia el cielo nocturno (para pasar de día a noche en el mismo plano).
export const CieloV2: React.FC<{ hora?: Hora; noche?: number; nubes?: number; horizonte?: number }> = ({ hora = "dia", noche = 0, nubes = 1, horizonte = 1000 }) => {
  const f = useCurrentFrame();
  const esNoche = hora === "noche" ? 1 : noche;
  const colorNube = hora === "tarde" ? "#FFD9B0" : hora === "alba" ? "#FFE8D0" : "#FFFFFF";
  return (
    <>
      <div style={{ position: "absolute", left: -1600, top: horizonte - 2600, width: 4280, height: 2620, background: degradado(CIELOS[hora]) }} />
      {noche > 0 && hora !== "noche" ? <div style={{ position: "absolute", left: -1600, top: horizonte - 2600, width: 4280, height: 2620, background: degradado(CIELOS.noche), opacity: noche }} /> : null}
      {esNoche > 0 ? (
        <svg style={{ position: "absolute", left: -1600, top: horizonte - 2600, overflow: "visible", opacity: esNoche }} width={4280} height={2600}>
          {Array.from({ length: 260 }, (_, i) => {
            const r = 1.2 + azar(i + 900) * 2.6;
            return <circle key={i} cx={azar(i) * 4280} cy={azar(i + 500) * 2450} r={r} fill={i % 9 === 0 ? "#FFE9B0" : "#F7F1E3"} opacity={0.3 + 0.7 * (0.5 + 0.5 * Math.sin(f / (7 + (i % 9)) + i))} />;
          })}
        </svg>
      ) : null}
      {nubes > 0 ? (
        <svg style={{ position: "absolute", left: -1600, top: horizonte - 1500, overflow: "visible", opacity: nubes * (1 - esNoche * 0.75) }} width={4280} height={1500}>
          <defs>
            <radialGradient id="nubeV2">
              <stop offset="0" stopColor={colorNube} stopOpacity={0.95} />
              <stop offset="0.6" stopColor={colorNube} stopOpacity={0.55} />
              <stop offset="1" stopColor={colorNube} stopOpacity={0} />
            </radialGradient>
          </defs>
          {Array.from({ length: 9 }, (_, i) => {
            const x = ((azar(i + 3) * 4280 + f * (0.18 + azar(i + 40) * 0.22)) % 4700) - 200;
            const y = 300 + azar(i + 17) * 900;
            const s = 0.7 + azar(i + 61) * 1.1;
            return (
              <g key={i} transform={`translate(${x} ${y}) scale(${s})`} opacity={0.55 + azar(i + 5) * 0.35}>
                <ellipse cx={0} cy={0} rx={210} ry={54} fill="url(#nubeV2)" />
                <ellipse cx={-90} cy={-22} rx={110} ry={50} fill="url(#nubeV2)" />
                <ellipse cx={40} cy={-36} rx={130} ry={58} fill="url(#nubeV2)" />
                <ellipse cx={140} cy={-10} rx={100} ry={40} fill="url(#nubeV2)" />
              </g>
            );
          })}
        </svg>
      ) : null}
    </>
  );
};

// Sol o luna con halo en capas (el halo late apenas).
export const Astro: React.FC<{ x: number; y: number; r?: number; tipo?: "sol" | "luna"; color?: string; opacidad?: number }> = ({ x, y, r = 70, tipo = "sol", color, opacidad = 1 }) => {
  const f = useCurrentFrame();
  const c = color ?? (tipo === "sol" ? "#FFE9B0" : "#F3EEDD");
  const late = 1 + Math.sin(f / 40) * 0.03;
  const id = `astro${Math.round(x)}${Math.round(y)}${tipo}`;
  return (
    <svg style={{ position: "absolute", left: x - r * 7, top: y - r * 7, overflow: "visible", opacity: opacidad }} width={r * 14} height={r * 14}>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor={c} stopOpacity={tipo === "sol" ? 0.85 : 0.5} />
          <stop offset="0.18" stopColor={c} stopOpacity={tipo === "sol" ? 0.45 : 0.22} />
          <stop offset="0.5" stopColor={c} stopOpacity={0.12} />
          <stop offset="1" stopColor={c} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={r * 7} cy={r * 7} r={r * 7 * late} fill={`url(#${id})`} />
      <circle cx={r * 7} cy={r * 7} r={r} fill={c} />
      {tipo === "sol" ? (
        <circle cx={r * 7} cy={r * 7} r={r * 0.8} fill="#FFFBEA" opacity={0.7} />
      ) : (
        <g opacity={0.22} fill="#8E8A7C">
          <circle cx={r * 7 - r * 0.3} cy={r * 7 - r * 0.25} r={r * 0.2} />
          <circle cx={r * 7 + r * 0.35} cy={r * 7 + r * 0.1} r={r * 0.14} />
          <circle cx={r * 7 - r * 0.05} cy={r * 7 + r * 0.45} r={r * 0.16} />
        </g>
      )}
    </svg>
  );
};

// Bandada lejana (pequeñas "v" que cruzan el cielo aleteando).
export const Pajaros: React.FC<{ y: number; n?: number; desde?: number; velocidad?: number; color?: string }> = ({ y, n = 5, desde = 0, velocidad = 1.6, color = "#3A4658" }) => {
  const f = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      {Array.from({ length: n }, (_, i) => {
        const x = -200 + ((f - desde) * velocidad + i * 70 + azar(i) * 40);
        const yy = y + azar(i + 4) * 90 + Math.sin(f / 20 + i) * 8;
        const ala = Math.sin(f / 3.2 + i * 1.3) * 9;
        return <path key={i} d={`M ${x - 16} ${yy + ala} Q ${x - 7} ${yy - 5} ${x} ${yy + 3} Q ${x + 7} ${yy - 5} ${x + 16} ${yy + ala}`} stroke={color} strokeWidth={3.5} fill="none" strokeLinecap="round" />;
      })}
    </svg>
  );
};

// ---------- relieve ----------
// Una capa de montes/colinas con degradado hacia la bruma (perspectiva atmosférica).
// Combinar varias capas de atrás (claras, azuladas) hacia adelante (saturadas).
export const Montes: React.FC<{ y: number; color: string; bruma?: string; amp?: number; paso?: number; semilla?: number; desde?: number; ancho?: number; alto?: number; borde?: boolean; idx?: string }> = ({
  y,
  color,
  bruma,
  amp = 60,
  paso = 420,
  semilla = 0,
  desde = -1600,
  ancho = 4280,
  alto = 700,
  borde = false,
  idx = "",
}) => {
  const id = `monte${Math.round(y)}${semilla}${idx}`;
  const pts: string[] = [];
  for (let x = 0; x <= ancho; x += 60) {
    const h = Math.sin((x + semilla * 311) / paso) * amp + Math.sin((x + semilla * 173) / (paso * 0.37)) * amp * 0.32 + Math.sin((x + semilla * 97) / (paso * 0.13)) * amp * 0.08;
    pts.push(`${x},${(amp * 1.4 - h).toFixed(1)}`);
  }
  return (
    <svg style={{ position: "absolute", left: desde, top: y - amp * 1.4, overflow: "visible" }} width={ancho} height={alto}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={bruma ?? color} />
        </linearGradient>
      </defs>
      <path d={`M 0 ${alto} L ${pts.join(" L ")} L ${ancho} ${alto} Z`} fill={`url(#${id})`} />
      {borde ? <path d={`M ${pts.join(" L ")}`} stroke="rgba(255,255,255,0.25)" strokeWidth={4} fill="none" /> : null}
    </svg>
  );
};

// Franja de bruma (luz atmosférica entre capas).
export const Bruma: React.FC<{ y: number; alto?: number; color?: string; fuerza?: number }> = ({ y, alto = 260, color = "#FFF2D6", fuerza = 0.5 }) => (
  <div style={{ position: "absolute", left: -1600, top: y - alto / 2, width: 4280, height: alto, background: `linear-gradient(180deg, ${color}00 0%, ${color} 50%, ${color}00 100%)`, opacity: fuerza }} />
);

// ---------- vegetación ----------
export const Arbol: React.FC<{ x: number; y: number; e?: number; tipo?: "olivo" | "cipres" | "palmera"; semilla?: number; tono?: number }> = ({ x, y, e = 1, tipo = "olivo", semilla = 0, tono = 0 }) => {
  const f = useCurrentFrame();
  const v = Math.sin(f / 34 + semilla * 1.7) * 1.6; // viento
  const hoja = mezcla("#7E8F5A", "#3E4E3A", tono);
  const hojaLuz = mezcla("#A7B77A", "#55664A", tono);
  const hojaSombra = mezcla("#566A40", "#2A382C", tono);
  const tronco = mezcla("#6B4E34", "#33281F", tono);
  if (tipo === "cipres") {
    return (
      <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={10} height={10}>
        <g transform={`scale(${e}) rotate(${v * 0.5})`}>
          <ellipse cx={0} cy={4} rx={50} ry={10} fill="rgba(0,0,0,0.22)" />
          <rect x={-7} y={-40} width={14} height={44} fill={tronco} />
          <path d="M 0 -420 Q 46 -300 44 -150 Q 40 -50 0 -34 Q -40 -50 -44 -150 Q -46 -300 0 -420 Z" fill={hojaSombra} />
          <path d="M 0 -420 Q 16 -300 12 -150 Q 8 -60 0 -34 Q -40 -50 -44 -150 Q -46 -300 0 -420 Z" fill={mezcla("#5F7748", "#2E3E30", tono)} />
          <path d="M -18 -300 Q -8 -200 -20 -90" stroke={hojaLuz} strokeWidth={8} fill="none" opacity={0.35} strokeLinecap="round" />
        </g>
      </svg>
    );
  }
  if (tipo === "palmera") {
    return (
      <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={10} height={10}>
        <g transform={`scale(${e})`}>
          <ellipse cx={0} cy={4} rx={70} ry={12} fill="rgba(0,0,0,0.22)" />
          <path d="M -14 0 Q 10 -200 30 -400 L 52 -396 Q 34 -200 16 0 Z" fill={tronco} />
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M ${-10 + i * 4.4} ${-30 - i * 42} l 28 -6`} stroke="rgba(0,0,0,0.25)" strokeWidth={5} />
          ))}
          <g transform={`translate(42 -400) rotate(${v})`}>
            {[-150, -110, -70, -30, 10, 50, 90].map((a, i) => (
              <g key={i} transform={`rotate(${a + (i % 2 ? v : -v) * 0.8})`}>
                <path d="M 0 0 Q 110 -50 230 20 Q 110 -14 0 12 Z" fill={i % 2 ? hoja : hojaSombra} />
                <path d="M 0 4 Q 110 -34 226 20" stroke={hojaLuz} strokeWidth={3} fill="none" opacity={0.6} />
              </g>
            ))}
            <circle r={18} fill={tronco} />
          </g>
        </g>
      </svg>
    );
  }
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={10} height={10}>
      <g transform={`scale(${e})`}>
        <ellipse cx={0} cy={4} rx={120} ry={16} fill="rgba(0,0,0,0.22)" />
        {/* tronco retorcido */}
        <path d="M -26 0 Q -10 -50 -22 -96 Q -40 -140 -70 -160 L -52 -170 Q -20 -150 -6 -120 Q 4 -160 34 -186 L 50 -174 Q 26 -140 22 -96 Q 18 -50 30 0 Z" fill={tronco} />
        <path d="M 6 -110 Q 0 -60 10 0 L 30 0 Q 18 -50 22 -96 Z" fill="rgba(0,0,0,0.22)" />
        <g transform={`rotate(${v} 0 -160)`}>
          <ellipse cx={-76} cy={-196} rx={96} ry={62} fill={hojaSombra} />
          <ellipse cx={70} cy={-214} rx={104} ry={66} fill={hojaSombra} />
          <ellipse cx={-6} cy={-262} rx={112} ry={70} fill={hoja} />
          <ellipse cx={-70} cy={-226} rx={74} ry={46} fill={hoja} />
          <ellipse cx={76} cy={-244} rx={70} ry={44} fill={hoja} />
          <ellipse cx={-34} cy={-290} rx={64} ry={34} fill={hojaLuz} opacity={0.85} />
          <ellipse cx={-96} cy={-240} rx={36} ry={20} fill={hojaLuz} opacity={0.7} />
          <ellipse cx={50} cy={-272} rx={40} ry={20} fill={hojaLuz} opacity={0.6} />
        </g>
      </g>
    </svg>
  );
};

export const Arbusto: React.FC<{ x: number; y: number; e?: number; tono?: number; semilla?: number }> = ({ x, y, e = 1, tono = 0, semilla = 0 }) => {
  const f = useCurrentFrame();
  const v = Math.sin(f / 30 + semilla) * 1.2;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={10} height={10}>
      <g transform={`scale(${e}) rotate(${v} 0 0)`}>
        <ellipse cx={0} cy={2} rx={70} ry={10} fill="rgba(0,0,0,0.2)" />
        <ellipse cx={-30} cy={-26} rx={44} ry={32} fill={mezcla("#566A40", "#2A382C", tono)} />
        <ellipse cx={30} cy={-30} rx={48} ry={36} fill={mezcla("#566A40", "#2A382C", tono)} />
        <ellipse cx={0} cy={-46} rx={46} ry={34} fill={mezcla("#7E8F5A", "#3E4E3A", tono)} />
        <ellipse cx={-14} cy={-58} rx={24} ry={14} fill={mezcla("#A7B77A", "#55664A", tono)} opacity={0.8} />
      </g>
    </svg>
  );
};

// Matas de pasto que se mecen. Se reparten en una franja (x, y, ancho, alto).
export const Pasto: React.FC<{ x: number; y: number; ancho: number; alto?: number; n?: number; h?: number; color?: string; color2?: string; semilla?: number }> = ({ x, y, ancho, alto = 40, n = 30, h = 34, color = "#6F8448", color2 = "#93A662", semilla = 0 }) => {
  const f = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      {Array.from({ length: n }, (_, i) => {
        const px = x + azar(i + semilla * 31) * ancho;
        const py = y + azar(i + semilla * 31 + 7) * alto;
        const k = 0.6 + azar(i + semilla + 13) * 0.9 + (py - y) / Math.max(1, alto) * 0.5;
        const v = Math.sin(f / 18 + i * 0.9 + semilla) * 5 * k;
        return (
          <g key={i} stroke={i % 3 ? color : color2} strokeWidth={3.2 * k} fill="none" strokeLinecap="round">
            <path d={`M ${px} ${py} Q ${px - 4 * k} ${py - h * 0.6 * k} ${px - 10 * k + v} ${py - h * k}`} />
            <path d={`M ${px + 3 * k} ${py} Q ${px + 4 * k} ${py - h * 0.7 * k} ${px + 2 * k + v} ${py - h * 1.2 * k}`} />
            <path d={`M ${px + 6 * k} ${py} Q ${px + 10 * k} ${py - h * 0.5 * k} ${px + 16 * k + v} ${py - h * 0.85 * k}`} />
          </g>
        );
      })}
    </svg>
  );
};

export const Roca: React.FC<{ x: number; y: number; e?: number; tono?: number; semilla?: number }> = ({ x, y, e = 1, tono = 0, semilla = 0 }) => {
  const a = 0.8 + azar(semilla) * 0.5;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={10} height={10}>
      <g transform={`scale(${e * a} ${e})`}>
        <ellipse cx={0} cy={2} rx={62} ry={9} fill="rgba(0,0,0,0.22)" />
        <path d="M -54 0 Q -60 -30 -30 -44 Q 4 -58 34 -40 Q 58 -24 52 0 Z" fill={mezcla("#B5A68A", "#4A4A58", tono)} />
        <path d="M 6 -50 Q 34 -44 46 -26 Q 56 -10 52 0 L 14 0 Q 26 -24 6 -50 Z" fill="rgba(0,0,0,0.2)" />
        <path d="M -40 -22 Q -26 -40 -4 -44" stroke="rgba(255,255,255,0.3)" strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
};

// Suelo con degradado, vetas y piedritas (da textura al primer plano).
export const Suelo: React.FC<{ y: number; alto?: number; c1: string; c2: string; vetas?: string; n?: number; semilla?: number }> = ({ y, alto = 1600, c1, c2, vetas = "rgba(0,0,0,0.12)", n = 46, semilla = 0 }) => (
  <>
    <div style={{ position: "absolute", left: -1600, top: y, width: 4280, height: alto, background: `linear-gradient(180deg, ${c1} 0%, ${c2} 60%, ${c2} 100%)` }} />
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      {Array.from({ length: n }, (_, i) => {
        const px = -500 + azar(i + semilla * 17) * 2080;
        const d = azar(i + semilla * 17 + 5);
        const py = y + 14 + d * d * 760;
        const k = 0.5 + d * 1.4;
        return i % 3 === 0 ? (
          <ellipse key={i} cx={px} cy={py} rx={9 * k} ry={4.5 * k} fill="rgba(0,0,0,0.16)" />
        ) : (
          <path key={i} d={`M ${px} ${py} q ${22 * k} ${-3 * k} ${46 * k} 0`} stroke={vetas} strokeWidth={3 * k} fill="none" strokeLinecap="round" />
        );
      })}
    </svg>
  </>
);

// ---------- arquitectura ----------
// Casa de adobe (época bíblica): pared con volumen, parapeto, vigas, puerta de madera que se abre con luz,
// ventana con celosía (encendida de noche), toldo y tinajas. (x, suelo) = centro de la base.
export const CasaAdobe: React.FC<{ x: number; suelo: number; w?: number; h?: number; abierta?: number; noche?: number; luz?: number; toldo?: boolean; tinajas?: boolean; escalera?: boolean }> = ({
  x,
  suelo,
  w = 420,
  h = 330,
  abierta = 0,
  noche = 0,
  luz = 0,
  toldo = true,
  tinajas = true,
  escalera = false,
}) => {
  const f = useCurrentFrame();
  const k = w / 420;
  const pared = mezcla("#E8D3A6", "#4E4A66", noche * 0.85);
  const paredLuz = mezcla("#F6E6C2", "#5E5A78", noche * 0.85);
  const paredSombra = mezcla("#C4A776", "#3A3650", noche * 0.85);
  const madera = mezcla("#7A4E2C", "#2E2430", noche * 0.7);
  const interior = luz > 0 || abierta > 0 ? "#FFDB8E" : "#2A1E18";
  const parp = 0.9 + 0.1 * Math.sin(f / 5) * Math.sin(f / 13);
  const id = `casa${Math.round(x)}${Math.round(suelo)}`;
  return (
    <svg style={{ position: "absolute", left: x - 210 * k, top: suelo - h * k, overflow: "visible" }} width={420 * k} height={h * k} viewBox={`0 0 420 ${h}`}>
      <defs>
        <linearGradient id={`${id}p`} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor={paredLuz} />
          <stop offset="0.6" stopColor={pared} />
          <stop offset="1" stopColor={paredSombra} />
        </linearGradient>
        <radialGradient id={`${id}l`}>
          <stop offset="0" stopColor="#FFE2A0" stopOpacity={0.85} />
          <stop offset="1" stopColor="#FFE2A0" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* sombra proyectada en el suelo */}
      <path d={`M 10 ${h} L 420 ${h} L 520 ${h + 26} L 60 ${h + 26} Z`} fill="rgba(0,0,0,0.2)" />
      {escalera ? (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={420 + i * 24} y={h - 150 + i * 30} width={26} height={150 - i * 30} fill={paredSombra} stroke="rgba(0,0,0,0.2)" strokeWidth={2} />
          ))}
        </g>
      ) : null}
      {/* pared */}
      <rect x={0} y={46} width={420} height={h - 46} fill={`url(#${id}p)`} stroke="rgba(60,40,20,0.45)" strokeWidth={3} />
      <rect x={330} y={46} width={90} height={h - 46} fill="rgba(0,0,0,0.1)" />
      {/* parapeto y vigas */}
      <path d="M -14 50 L -14 22 Q 0 12 20 22 L 400 22 Q 420 12 434 22 L 434 50 Z" fill={paredLuz} stroke="rgba(60,40,20,0.45)" strokeWidth={3} />
      <rect x={-14} y={44} width={448} height={10} fill={paredSombra} />
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={30 + i * 45} cy={72} r={8} fill={madera} stroke="rgba(0,0,0,0.3)" strokeWidth={2} />
      ))}
      {/* grietas y revoque */}
      <path d={`M 40 130 l 14 20 l -6 22 M 300 ${h - 90} l 18 14 l 4 26 M 120 ${h - 40} q 30 -8 60 0`} stroke="rgba(90,60,30,0.3)" strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* ventanas con celosía */}
      {[52, 308].map((vx) => (
        <g key={vx}>
          <path d={`M ${vx} 190 L ${vx} 140 Q ${vx + 30} 112 ${vx + 60} 140 L ${vx + 60} 190 Z`} fill={luz > 0 ? "#FFD27A" : "#3A2A22"} stroke={madera} strokeWidth={5} opacity={luz > 0 ? 0.7 + 0.3 * luz * parp : 1} />
          <path d={`M ${vx + 20} 124 L ${vx + 20} 190 M ${vx + 40} 124 L ${vx + 40} 190 M ${vx} 164 L ${vx + 60} 164`} stroke={madera} strokeWidth={4} />
          {luz > 0 ? <circle cx={vx + 30} cy={160} r={90} fill={`url(#${id}l)`} opacity={0.5 * luz * parp} /> : null}
          <rect x={vx - 8} y={190} width={76} height={10} rx={3} fill={paredSombra} />
        </g>
      ))}
      {/* puerta: hueco (oscuro o iluminado) y hoja de madera que se abre */}
      <path d={`M 158 ${h} L 158 170 Q 210 122 262 170 L 262 ${h} Z`} fill={interior} stroke={madera} strokeWidth={6} />
      {abierta > 0 ? <ellipse cx={210} cy={h - 70} rx={170} ry={150} fill={`url(#${id}l)`} opacity={0.75 * abierta} /> : null}
      <g transform={`translate(158 0) scale(${1 - 0.86 * abierta} 1)`}>
        <path d={`M 0 ${h} L 0 170 Q 52 122 104 170 L 104 ${h} Z`} fill={madera} stroke="rgba(0,0,0,0.35)" strokeWidth={3} />
        <path d={`M 26 150 L 26 ${h} M 52 142 L 52 ${h} M 78 150 L 78 ${h}`} stroke="rgba(0,0,0,0.28)" strokeWidth={3} />
        <rect x={0} y={206} width={104} height={8} fill="rgba(0,0,0,0.3)" />
        <rect x={0} y={h - 50} width={104} height={8} fill="rgba(0,0,0,0.3)" />
        <circle cx={86} cy={h - 110} r={6} fill="#C9973F" />
      </g>
      {/* luz que sale por la puerta abierta sobre el suelo */}
      {abierta > 0 ? <path d={`M 162 ${h} L 258 ${h} L 330 ${h + 110} L 90 ${h + 110} Z`} fill="#FFE2A0" opacity={0.45 * abierta} /> : null}
      {/* umbral */}
      <rect x={146} y={h - 8} width={128} height={12} rx={3} fill={paredSombra} stroke="rgba(0,0,0,0.25)" strokeWidth={2} />
      {toldo ? (
        <g>
          <line x1={-40} y1={h} x2={-40} y2={150} stroke={madera} strokeWidth={8} />
          <path d={`M -52 150 L 150 110 L 150 132 L -52 ${176 + Math.sin(f / 16) * 3} Z`} fill={mezcla("#B5523A", "#3A2A40", noche * 0.8)} />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M ${-30 + i * 46} ${146 - i * 9} l 22 -4 l 0 22 l -22 5 Z`} fill="rgba(255,240,210,0.5)" />
          ))}
        </g>
      ) : null}
      {tinajas ? (
        <g>
          {[
            [290, 1],
            [338, 0.78],
          ].map(([tx, s], i) => (
            <g key={i} transform={`translate(${tx} ${h}) scale(${s})`}>
              <ellipse cx={0} cy={0} rx={30} ry={6} fill="rgba(0,0,0,0.25)" />
              <path d="M -14 -70 Q -36 -50 -30 -20 Q -24 0 0 0 Q 24 0 30 -20 Q 36 -50 14 -70 L 16 -82 L -16 -82 Z" fill={mezcla("#B8663E", "#3E2E3A", noche * 0.7)} stroke="rgba(0,0,0,0.3)" strokeWidth={2.5} />
              <path d="M -20 -44 Q -14 -62 -6 -68" stroke="rgba(255,220,180,0.45)" strokeWidth={5} fill="none" strokeLinecap="round" />
            </g>
          ))}
        </g>
      ) : null}
    </svg>
  );
};

// ---------- luz y atmósfera ----------
// Rayos de luz que bajan desde un punto (sol, ventana, puerta). Se ven sobre lo que tienen detrás.
export const RayosDeLuz: React.FC<{ x: number; y: number; largo?: number; angulo?: number; apertura?: number; n?: number; color?: string; fuerza?: number }> = ({ x, y, largo = 1400, angulo = 90, apertura = 70, n = 7, color = "#FFE9B0", fuerza = 0.5 }) => {
  const f = useCurrentFrame();
  const id = `rayo${Math.round(x)}${Math.round(y)}`;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible", mixBlendMode: "screen", opacity: fuerza }} width={10} height={10}>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={largo} y2={0}>
          <stop offset="0" stopColor={color} stopOpacity={0.55} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {Array.from({ length: n }, (_, i) => {
        const a = angulo - apertura / 2 + ((i + 0.5) / n) * apertura + Math.sin(f / 50 + i * 2.1) * 1.5;
        const ancho = (apertura / n) * (0.25 + 0.3 * azar(i + 3));
        const o = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(f / 37 + i * 1.9));
        return (
          <g key={i} transform={`rotate(${a})`} opacity={o}>
            <path d={`M 0 0 L ${largo} ${-Math.tan((ancho * Math.PI) / 360) * largo} L ${largo} ${Math.tan((ancho * Math.PI) / 360) * largo} Z`} fill={`url(#${id})`} />
          </g>
        );
      })}
    </svg>
  );
};

// Motas de polvo/polen que flotan en la luz.
export const Polvo: React.FC<{ x: number; y: number; ancho: number; alto: number; n?: number; color?: string; semilla?: number }> = ({ x, y, ancho, alto, n = 26, color = "#FFF1C8", semilla = 0 }) => {
  const f = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", mixBlendMode: "screen" }} width={10} height={10}>
      {Array.from({ length: n }, (_, i) => {
        const bx = x + azar(i + semilla * 11) * ancho;
        const by = y + ((azar(i + semilla * 11 + 3) * alto - f * (0.25 + azar(i + 9) * 0.35) + alto * 10) % alto);
        const dx = Math.sin(f / (26 + (i % 7) * 4) + i) * 22;
        return <circle key={i} cx={bx + dx} cy={by} r={2 + azar(i + 21) * 3.5} fill={color} opacity={(0.25 + 0.55 * (0.5 + 0.5 * Math.sin(f / 14 + i * 1.3))) * 0.8} />;
      })}
    </svg>
  );
};

// Baño de color sobre toda la toma (noche azulada, tarde cálida…). Va DESPUÉS de los elementos que debe teñir
// y ANTES de las luces que deben seguir brillando (ventanas, luna, antorchas).
export const Gradacion: React.FC<{ color: string; fuerza: number; modo?: "multiply" | "soft-light" | "screen" | "overlay" }> = ({ color, fuerza, modo = "multiply" }) =>
  fuerza <= 0 ? null : <div style={{ position: "absolute", left: -1600, top: -2600, width: 4280, height: 6200, background: color, opacity: cl(fuerza), mixBlendMode: modo, pointerEvents: "none" }} />;
