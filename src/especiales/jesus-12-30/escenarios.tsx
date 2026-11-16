// Escenarios, objetos y cámara del video "Jesús entre los 12 y los 30" (ilustraciones originales).
// Todo se anima por frames. Los escenarios se dibujan en coordenadas de "mundo" (1080 de ancho base)
// y la <Camara> se mueve sobre ellos: así los objetos conservan su lugar entre plano general y detalle.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";

export const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const suave = Easing.inOut(Easing.cubic);
export const lerp = (f: number, a: number, b: number, va: number, vb: number, e = suave) =>
  interpolate(f, [a, Math.max(a + 1, b)], [va, vb], { ...CLAMP, easing: e });

export const PAL = {
  noche: "#0B1426",
  azul: "#14223F",
  azulMedio: "#24395F",
  azulClaro: "#3E5A86",
  pergamino: "#EAD9B5",
  pergaminoOscuro: "#C8AE7D",
  tinta: "#3B2A1A",
  dorado: "#F2C14E",
  doradoOscuro: "#C8922E",
  piedra: "#CDBB98",
  piedraSombra: "#A8946E",
  adobe: "#C9A27A",
  adobeSombra: "#A88259",
  madera: "#9A6A3E",
  maderaClara: "#C08A55",
  maderaOscura: "#6E4528",
  verde: "#6F7F4E",
  coral: "#D9654B",
  crema: "#F7F1E3",
};

// ---------- cámara ----------
export type Toma = { f: number; x: number; y: number; z: number };

// Interpola entre tomas (punto del mundo que queda en el centro de la pantalla + zoom).
export const useToma = (tomas: Toma[]): { x: number; y: number; z: number } => {
  const frame = useCurrentFrame();
  const ordenadas = [...tomas].sort((p, q) => p.f - q.f);
  if (ordenadas.length === 1 || frame <= ordenadas[0].f) return ordenadas[0];
  const ultima = ordenadas[ordenadas.length - 1];
  if (frame >= ultima.f) return ultima;
  let i = 0;
  while (i < ordenadas.length - 2 && frame > ordenadas[i + 1].f) i++;
  const a = ordenadas[i];
  const b = ordenadas[i + 1];
  const t = interpolate(frame, [a.f, Math.max(a.f + 1, b.f)], [0, 1], { ...CLAMP, easing: suave });
  // zoom en escala logarítmica para que se sienta parejo
  const z = Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * t);
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z };
};

// La toma actual queda disponible para las capas con paralaje.
const ContextoCamara = React.createContext<{ x: number; y: number; z: number }>({ x: 540, y: 960, z: 1 });

// Capa con paralaje dentro de <Camara>. `k` = cuánto sigue a la cámara: 1 = normal (se mueve con el mundo),
// 0 = fija al encuadre (infinitamente lejos). Fondos lejanos ≈ 0.2–0.5; primer plano > 1 (p. ej. 1.3).
// `ky` (por defecto 1) hace lo mismo en vertical; casi siempre conviene dejarlo en 1 para no mover el horizonte.
export const Capa: React.FC<{ k: number; ky?: number; children: React.ReactNode }> = ({ k, ky = 1, children }) => {
  const t = React.useContext(ContextoCamara);
  return <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${(t.x - 540) * (1 - k)}px, ${(t.y - 960) * (1 - ky)}px)` }}>{children}</div>;
};

export const Camara: React.FC<{ tomas: Toma[]; children: React.ReactNode; vaiven?: number }> = ({ tomas, children, vaiven = 1 }) => {
  const frame = useCurrentFrame();
  const t = useToma(tomas);
  // respiración leve de cámara (cámara en mano muy suave)
  const dx = Math.sin(frame / 47) * 4 * vaiven;
  const dy = Math.cos(frame / 59) * 3 * vaiven;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          transformOrigin: "0 0",
          transform: `translate(${540 - t.x * t.z + dx}px, ${960 - t.y * t.z + dy}px) scale(${t.z})`,
        }}
      >
        <ContextoCamara.Provider value={t}>{children}</ContextoCamara.Provider>
      </div>
    </AbsoluteFill>
  );
};

// Coloca un elemento en coordenadas del mundo.
export const En: React.FC<{ x: number; y: number; children: React.ReactNode; escala?: number; rot?: number; opacidad?: number; origen?: string }> = ({
  x,
  y,
  children,
  escala = 1,
  rot = 0,
  opacidad = 1,
  origen = "0 0",
}) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg) scale(${escala})`, transformOrigin: origen, opacity: opacidad }}>{children}</div>
);

// ---------- acabado pictórico ----------
// Grano de papel + viñeta cálida sobre toda la escena (texturas suaves).
export const Textura: React.FC<{ fuerza?: number }> = ({ fuerza = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: 0.18 * fuerza }}>
      <filter id="grano">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={1080} height={1920} filter="url(#grano)" />
    </svg>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 90% at 50% 46%, rgba(0,0,0,0) 58%, rgba(5,8,18,0.2) 82%, rgba(5,8,18,0.42) 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,236,200,0.07) 0%, rgba(255,236,200,0) 30%, rgba(8,12,26,0) 70%, rgba(8,12,26,0.16) 100%)" }} />
  </AbsoluteFill>
);

// Texto de referencia bíblica discreto (arriba, lejos de la interfaz de las plataformas).
export const Referencia: React.FC<{ texto: string; aparece: number; hasta?: number; y?: number }> = ({ texto, aparece, hasta = 99999, y = 196 }) => {
  const frame = useCurrentFrame();
  const o = lerp(frame, aparece, aparece + 10, 0, 1) * (1 - lerp(frame, hasta, hasta + 10, 0, 1));
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        justifyContent: "center",
        opacity: o,
        translate: `0px ${(1 - o) * 12}px`,
      }}
    >
      <div
        style={{
          padding: "10px 26px",
          borderRadius: 999,
          background: "rgba(234,217,181,0.92)",
          color: PAL.tinta,
          fontFamily: FUENTE_TEXTO,
          fontWeight: 700,
          fontSize: 38,
          letterSpacing: 0.5,
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        }}
      >
        {texto}
      </div>
    </div>
  );
};

// Cartel de texto grande en pantalla (pregunta de los vecinos, "Tékton", etc.).
export const Cartel: React.FC<{ aparece: number; hasta?: number; y: number; children: React.ReactNode; ancho?: number }> = ({ aparece, hasta = 99999, y, children, ancho = 920 }) => {
  const frame = useCurrentFrame();
  const e = lerp(frame, aparece, aparece + 9, 0, 1, Easing.out(Easing.back(1.6)));
  const o = lerp(frame, aparece, aparece + 6, 0, 1) * (1 - lerp(frame, hasta, hasta + 8, 0, 1));
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: (1080 - ancho) / 2, width: ancho, top: y, display: "flex", justifyContent: "center", opacity: o, scale: String(0.8 + 0.2 * e) }}>
      <div
        style={{
          padding: "26px 40px",
          borderRadius: 28,
          background: "linear-gradient(180deg, rgba(247,241,227,0.97), rgba(234,217,181,0.97))",
          border: `5px solid ${PAL.doradoOscuro}`,
          boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
          color: PAL.tinta,
          textAlign: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const textoCartel = (tam: number, peso = 900): React.CSSProperties => ({
  fontFamily: peso >= 900 ? FUENTE_TITULO : FUENTE_TEXTO,
  fontWeight: peso,
  fontSize: tam,
  lineHeight: 1.1,
});

// ---------- cielos y paisajes ----------
export const Cielo: React.FC<{ tono?: "dia" | "tarde" | "noche"; mezcla?: number }> = ({ tono = "dia" }) => {
  const g =
    tono === "noche"
      ? "linear-gradient(180deg, #0B1426 0%, #1B2A4D 60%, #3A3F5E 100%)"
      : tono === "tarde"
        ? "linear-gradient(180deg, #2A3A66 0%, #8C6A7A 45%, #E8A766 80%, #F2C98A 100%)"
        : "linear-gradient(180deg, #3E5A86 0%, #8FA8C4 55%, #EBD9B4 100%)";
  return <div style={{ position: "absolute", left: -2000, top: -800, width: 8000, height: 3200, background: g }} />;
};

export const Sol: React.FC<{ x: number; y: number; r?: number; color?: string }> = ({ x, y, r = 70, color = "#FBE3A4" }) => (
  <svg style={{ position: "absolute", left: x - r * 4, top: y - r * 4, overflow: "visible" }} width={r * 8} height={r * 8}>
    <defs>
      <radialGradient id={`sol-${x}-${y}`}>
        <stop offset="0%" stopColor={color} stopOpacity={0.9} />
        <stop offset="25%" stopColor={color} stopOpacity={0.45} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={r * 4} cy={r * 4} r={r * 4} fill={`url(#sol-${x}-${y})`} />
    <circle cx={r * 4} cy={r * 4} r={r} fill={color} />
  </svg>
);

// Colinas en capas (paralaje lo da la cámara). `desde`/`ancho` en coordenadas del mundo.
export const Colinas: React.FC<{ y: number; desde?: number; ancho?: number; colores?: string[] }> = ({ y, desde = -1200, ancho = 5000, colores = ["#8E9A72", "#6F7F4E", "#5B6A40"] }) => (
  <svg style={{ position: "absolute", left: desde, top: y - 260, overflow: "visible" }} width={ancho} height={900}>
    {colores.map((c, i) => {
      const base = 120 + i * 90;
      const pts: string[] = [];
      for (let x = 0; x <= ancho; x += 120) {
        const h = Math.sin((x + i * 300) / 380) * 50 + Math.sin((x + i * 170) / 150) * 18;
        pts.push(`${x},${base - h}`);
      }
      return <path key={i} d={`M 0 900 L ${pts.join(" L ")} L ${ancho} 900 Z`} fill={c} />;
    })}
    {/* olivos dispersos */}
    {Array.from({ length: Math.floor(ancho / 260) }, (_, i) => {
      const x = 80 + i * 260 + ((i * 97) % 90);
      const yy = 230 + ((i * 53) % 60);
      return (
        <g key={`o${i}`} transform={`translate(${x} ${yy})`}>
          <rect x={-5} y={0} width={10} height={36} fill="#5A4430" />
          <ellipse cx={0} cy={-6} rx={34} ry={24} fill="#7E8C5E" />
          <ellipse cx={-12} cy={-12} rx={18} ry={14} fill="#94A170" />
        </g>
      );
    })}
  </svg>
);

// Muralla y edificios lejanos de Jerusalén (silueta dorada).
export const JerusalenLejos: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => (
  <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={600 * escala} height={260 * escala} viewBox="0 0 600 260">
    <path d="M 0 260 L 0 150 L 40 150 L 40 120 L 70 120 L 70 150 L 180 150 L 180 110 L 210 110 L 210 150 L 330 150 L 330 120 L 360 120 L 360 150 L 470 150 L 470 115 L 500 115 L 500 150 L 600 150 L 600 260 Z" fill="#B99A6A" />
    <rect x={220} y={40} width={170} height={110} fill="#CDB07A" />
    <rect x={240} y={20} width={130} height={30} fill="#E2C88E" />
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={238 + i * 30} y={70} width={14} height={60} fill="#8F7448" />
    ))}
  </svg>
);

// ---------- templo ----------
export const Templo: React.FC<{ ancho?: number }> = ({ ancho = 1600 }) => {
  const frame = useCurrentFrame();
  const parpadeoLuz = 0.85 + 0.15 * Math.sin(frame / 23);
  return (
    <div style={{ position: "absolute", left: -260, top: 0, width: ancho, height: 1920 }}>
      {/* extensión del muro y del piso fuera del cuadro (para movimientos de cámara) */}
      <div style={{ position: "absolute", left: -600, top: -700, width: ancho + 1200, height: 720, background: "#5A4A38" }} />
      <div style={{ position: "absolute", left: -600, top: 1900, width: ancho + 1200, height: 800, background: "#7E6744" }} />
      <div style={{ position: "absolute", left: -600, top: 0, width: 620, height: 1920, background: "linear-gradient(180deg,#5A4A38,#9C8158 55%,#7E6744 75%)" }} />
      <div style={{ position: "absolute", left: ancho - 20, top: 0, width: 620, height: 1920, background: "linear-gradient(180deg,#5A4A38,#9C8158 55%,#7E6744 75%)" }} />
      <svg width={ancho} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="templo-muro" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5A4A38" />
            <stop offset="55%" stopColor="#9C8158" />
            <stop offset="100%" stopColor="#B99B6C" />
          </linearGradient>
          <linearGradient id="templo-piso" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B49668" />
            <stop offset="100%" stopColor="#7E6744" />
          </linearGradient>
          <linearGradient id="templo-haz" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFE9B0" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#FFE9B0" stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect width={ancho} height={1920} fill="url(#templo-muro)" />
        {/* hiladas de piedra */}
        {Array.from({ length: 22 }, (_, r) => (
          <g key={r}>
            <line x1={0} y1={r * 62} x2={ancho} y2={r * 62} stroke="#4A3B2A" strokeOpacity={0.25} strokeWidth={3} />
            {Array.from({ length: Math.ceil(ancho / 180) + 1 }, (_, c) => (
              <line key={c} x1={c * 180 + (r % 2) * 90} y1={r * 62} x2={c * 180 + (r % 2) * 90} y2={r * 62 + 62} stroke="#4A3B2A" strokeOpacity={0.18} strokeWidth={3} />
            ))}
          </g>
        ))}
        {/* columnas */}
        {Array.from({ length: Math.ceil(ancho / 330) }, (_, i) => {
          const x = 60 + i * 330;
          return (
            <g key={i}>
              <rect x={x} y={120} width={110} height={1250} fill="#D6BF91" />
              <rect x={x + 70} y={120} width={40} height={1250} fill="#B79E70" />
              <rect x={x - 22} y={90} width={154} height={50} rx={6} fill="#E3CFA4" />
              <rect x={x - 22} y={1360} width={154} height={46} rx={6} fill="#C4AB7C" />
              {[0, 1, 2].map((k) => (
                <line key={k} x1={x + 22 + k * 24} y1={150} x2={x + 22 + k * 24} y2={1350} stroke="#B79E70" strokeWidth={4} opacity={0.6} />
              ))}
            </g>
          );
        })}
        {/* haces de luz */}
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M ${300 + i * 420} 0 L ${470 + i * 420} 0 L ${760 + i * 420} 1400 L ${460 + i * 420} 1400 Z`} fill="url(#templo-haz)" opacity={0.5 * parpadeoLuz} />
        ))}
        <rect x={0} y={1390} width={ancho} height={530} fill="url(#templo-piso)" />
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={0} y1={1420 + i * 56} x2={ancho} y2={1420 + i * 56} stroke="#5E4C31" strokeOpacity={0.25} strokeWidth={3} />
        ))}
      </svg>
    </div>
  );
};

// Banco de piedra donde se sientan los maestros.
export const Banco: React.FC<{ x: number; y: number; ancho: number }> = ({ x, y, ancho }) => (
  <svg style={{ position: "absolute", left: x, top: y }} width={ancho} height={150}>
    <rect x={0} y={0} width={ancho} height={40} rx={8} fill="#D8C298" />
    <rect x={0} y={34} width={ancho} height={110} fill="#B49A6C" />
    <rect x={0} y={34} width={ancho} height={14} fill="#9C8256" />
  </svg>
);

// Rollo desplegado (sobre las rodillas de un maestro o en el suelo).
export const Rollo: React.FC<{ ancho?: number; abierto?: number; marcas?: number }> = ({ ancho = 240, abierto = 1, marcas = 1 }) => {
  const w = 40 + (ancho - 40) * abierto;
  return (
    <svg width={ancho + 40} height={110} style={{ overflow: "visible" }}>
      <rect x={20} y={20} width={w} height={70} fill={PAL.pergamino} />
      {Array.from({ length: 5 }, (_, i) => (
        <line key={i} x1={36} y1={34 + i * 12} x2={36 + Math.max(0, w - 32) * (i % 2 ? 0.8 : 0.95) * marcas} y2={34 + i * 12} stroke={PAL.tinta} strokeOpacity={0.45} strokeWidth={3} />
      ))}
      <rect x={6} y={8} width={26} height={94} rx={12} fill={PAL.maderaClara} />
      <rect x={14 + w} y={8} width={26} height={94} rx={12} fill={PAL.maderaClara} />
    </svg>
  );
};

// Arco de entrada (puerta del atrio).
export const Portal: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg style={{ position: "absolute", left: x, top: y }} width={420} height={1000}>
    <path d="M 0 1000 L 0 300 Q 0 60 210 40 Q 420 60 420 300 L 420 1000 Z" fill="#D9C08C" />
    <path d="M 50 1000 L 50 320 Q 50 110 210 96 Q 370 110 370 320 L 370 1000 Z" fill="#F4E2B4" />
    <path d="M 50 1000 L 50 320 Q 50 110 210 96 Q 370 110 370 320 L 370 1000 Z" fill="url(#portal-luz)" />
    <defs>
      <radialGradient id="portal-luz" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stopColor="#FFF6DC" />
        <stop offset="100%" stopColor="#E8C98A" />
      </radialGradient>
    </defs>
  </svg>
);

// ---------- pueblo (Nazaret) ----------
export const Casita: React.FC<{ x: number; y: number; ancho?: number; alto?: number; color?: string; puerta?: boolean; ventana?: boolean }> = ({
  x,
  y,
  ancho = 320,
  alto = 300,
  color = PAL.adobe,
  puerta = true,
  ventana = true,
}) => (
  <svg style={{ position: "absolute", left: x, top: y - alto, overflow: "visible" }} width={ancho} height={alto}>
    <rect x={0} y={20} width={ancho} height={alto - 20} fill={color} />
    <rect x={ancho * 0.7} y={20} width={ancho * 0.3} height={alto - 20} fill="#000" opacity={0.12} />
    {/* techo plano con vigas que asoman */}
    <rect x={-12} y={8} width={ancho + 24} height={22} fill="#8C6E4C" />
    {Array.from({ length: Math.floor(ancho / 60) }, (_, i) => (
      <rect key={i} x={20 + i * 60} y={24} width={14} height={14} fill="#5E452E" />
    ))}
    {puerta ? <path d={`M ${ancho * 0.18} ${alto} L ${ancho * 0.18} ${alto * 0.48} Q ${ancho * 0.3} ${alto * 0.4} ${ancho * 0.42} ${alto * 0.48} L ${ancho * 0.42} ${alto} Z`} fill="#4A3424" /> : null}
    {ventana ? <rect x={ancho * 0.58} y={alto * 0.36} width={ancho * 0.16} height={alto * 0.14} rx={6} fill="#3A2A1E" /> : null}
    {/* textura de revoque */}
    {[0.25, 0.55, 0.8].map((k, i) => (
      <path key={i} d={`M ${ancho * 0.05} ${alto * k} q ${ancho * 0.1} -6 ${ancho * 0.2} 0`} stroke="#000" strokeOpacity={0.08} strokeWidth={4} fill="none" />
    ))}
  </svg>
);

// Calle de Nazaret con taller a la derecha. `ancho` del mundo.
export const CalleNazaret: React.FC<{ suelo?: number }> = ({ suelo = 1320 }) => (
  <>
    <Cielo tono="dia" />
    <Sol x={220} y={300} r={60} />
    <Colinas y={760} />
    <Casita x={-260} y={suelo - 10} ancho={360} alto={420} color="#C8A27A" />
    <Casita x={120} y={suelo - 40} ancho={300} alto={340} color="#D4B48C" ventana={false} />
    <Casita x={560} y={suelo - 20} ancho={340} alto={380} color="#C49A70" />
    {/* taller: puerta ancha con tablas apoyadas */}
    <Taller exterior x={930} y={suelo} />
    <Casita x={1420} y={suelo - 30} ancho={320} alto={360} color="#CDAA80" />
    <div style={{ position: "absolute", left: -1200, top: suelo, width: 4200, height: 900, background: "linear-gradient(180deg,#B59A72,#8E7553)" }} />
    <svg style={{ position: "absolute", left: -1200, top: suelo, overflow: "visible" }} width={4200} height={300}>
      {Array.from({ length: 40 }, (_, i) => (
        <ellipse key={i} cx={(i * 211) % 4200} cy={40 + ((i * 67) % 220)} rx={18 + (i % 3) * 6} ry={7} fill="#7E6646" opacity={0.35} />
      ))}
    </svg>
  </>
);

// Fachada del taller (exterior) o interior del taller.
export const Taller: React.FC<{ exterior?: boolean; x?: number; y?: number }> = ({ exterior, x = 0, y = 0 }) => {
  if (exterior) {
    return (
      <svg style={{ position: "absolute", left: x, top: y - 420, overflow: "visible" }} width={460} height={420}>
        <rect x={0} y={20} width={460} height={400} fill="#BE9466" />
        <rect x={-14} y={8} width={488} height={24} fill="#7E5E3E" />
        <rect x={110} y={150} width={240} height={270} fill="#3A2818" />
        <rect x={110} y={150} width={240} height={18} fill="#6E4A2C" />
        {/* tablas apoyadas y caballete */}
        {[0, 1, 2].map((i) => (
          <rect key={i} x={20 + i * 26} y={180 + i * 8} width={20} height={240 - i * 8} rx={4} fill={[PAL.maderaClara, PAL.madera, "#B07A48"][i]} transform={`rotate(${-8 + i * 3} ${30 + i * 26} 420)`} />
        ))}
        <rect x={370} y={330} width={80} height={14} fill={PAL.madera} />
        <rect x={378} y={344} width={10} height={76} fill={PAL.maderaOscura} />
        <rect x={432} y={344} width={10} height={76} fill={PAL.maderaOscura} />
        {/* letrero: escuadra */}
        <path d="M 200 70 L 200 120 L 260 120" stroke={PAL.maderaOscura} strokeWidth={12} fill="none" />
      </svg>
    );
  }
  // interior (mundo 1080 × 1920)
  return (
    <>
    <div style={{ position: "absolute", left: -800, top: -700, width: 2700, height: 720, background: "#4A3826" }} />
    <div style={{ position: "absolute", left: -800, top: 1900, width: 2700, height: 900, background: "#6A5038" }} />
    <div style={{ position: "absolute", left: -800, top: 0, width: 620, height: 1920, background: "linear-gradient(180deg,#4A3826,#8A6A48 72%,#6A5038 73%)" }} />
    <div style={{ position: "absolute", left: 1260, top: 0, width: 620, height: 1920, background: "linear-gradient(180deg,#4A3826,#8A6A48 72%,#6A5038 73%)" }} />
    <svg style={{ position: "absolute", left: -200, top: 0 }} width={1480} height={1920}>
      <defs>
        <linearGradient id="taller-pared" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A3826" />
          <stop offset="100%" stopColor="#8A6A48" />
        </linearGradient>
        <radialGradient id="taller-luz" cx="70%" cy="20%" r="60%">
          <stop offset="0%" stopColor="#FFE2A0" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#FFE2A0" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={1480} height={1920} fill="url(#taller-pared)" />
      {/* ventana alta con luz */}
      <rect x={980} y={200} width={220} height={180} fill="#F6DFA6" />
      <rect x={1084} y={200} width={12} height={180} fill="#6E4A2C" />
      <path d="M 980 380 L 1200 380 L 900 1500 L 400 1500 Z" fill="#FFE2A0" opacity={0.12} />
      <rect width={1480} height={1920} fill="url(#taller-luz)" />
      {/* estante con herramientas */}
      <rect x={160} y={520} width={760} height={18} fill={PAL.maderaOscura} />
      {/* serrucho colgado */}
      <g transform="translate(230 300)">
        <path d="M 0 0 L 170 0 L 170 50 L 0 70 Z" fill="#B8BCC2" />
        <rect x={-50} y={-6} width={60} height={60} rx={14} fill={PAL.madera} />
      </g>
      {/* azuela */}
      <g transform="translate(500 300)">
        <rect x={0} y={0} width={18} height={200} rx={8} fill={PAL.madera} />
        <path d="M -40 0 L 40 0 L 30 26 L -30 26 Z" fill="#8E949B" />
      </g>
      {/* escuadra */}
      <path d="M 640 320 L 640 470 L 770 470" stroke={PAL.maderaClara} strokeWidth={18} fill="none" />
      {/* cordel enrollado */}
      <circle cx={850} cy={400} r={36} fill="#D9C7A0" />
      <circle cx={850} cy={400} r={14} fill="#A88F64" />
      {/* tablas apoyadas atrás */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={1120 + i * 40} y={700 + i * 14} width={30} height={700 - i * 14} rx={5} fill={[PAL.maderaClara, PAL.madera, "#B07A48", PAL.maderaClara][i]} transform={`rotate(${-6 + i * 2} ${1135 + i * 40} 1400)`} />
      ))}
      <rect x={0} y={1400} width={1480} height={520} fill="#6A5038" />
      {/* virutas en el piso */}
      {Array.from({ length: 18 }, (_, i) => (
        <path key={i} d={`M ${200 + i * 60} ${1440 + (i % 4) * 30} q 10 -12 20 0 q 10 12 20 0`} stroke="#D6A86E" strokeWidth={4} fill="none" opacity={0.7} />
      ))}
    </svg>
    </>
  );
};

// Banco de carpintero (frente). Superficie en y; ancho.
export const BancoCarpintero: React.FC<{ x: number; y: number; ancho?: number }> = ({ x, y, ancho = 760 }) => (
  <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={ancho} height={420}>
    <rect x={0} y={0} width={ancho} height={46} rx={6} fill={PAL.maderaClara} />
    <rect x={0} y={38} width={ancho} height={14} fill={PAL.madera} />
    <rect x={30} y={52} width={44} height={360} fill={PAL.madera} />
    <rect x={ancho - 74} y={52} width={44} height={360} fill={PAL.madera} />
    <rect x={30} y={250} width={ancho - 60} height={30} fill={PAL.maderaOscura} />
    {/* vetas */}
    {[0.2, 0.5, 0.8].map((k, i) => (
      <path key={i} d={`M ${ancho * 0.05} ${12 + i * 10} q ${ancho * k * 0.3} 6 ${ancho * 0.9} 0`} stroke={PAL.madera} strokeOpacity={0.5} strokeWidth={3} fill="none" />
    ))}
  </svg>
);

// Tabla (vista frontal, apoyada). Se dibuja centrada en x.
export const Tabla: React.FC<{ largo: number; alto?: number; corte?: number; marca?: number }> = ({ largo, alto = 46, corte, marca = 0 }) => (
  <svg width={largo} height={alto + 4} style={{ overflow: "visible", position: "absolute", left: -largo / 2, top: -alto }}>
    <rect x={0} y={0} width={largo} height={alto} rx={4} fill="#D9A566" />
    <rect x={0} y={alto - 10} width={largo} height={10} fill="#B07A48" />
    {[0.3, 0.6].map((k, i) => (
      <path key={i} d={`M 6 ${alto * k} q ${largo * 0.3} -5 ${largo * 0.6} 0 t ${largo * 0.38} 0`} stroke="#B07A48" strokeWidth={3} fill="none" opacity={0.7} />
    ))}
    {/* línea de carbón */}
    {marca > 0 && corte !== undefined ? <line x1={corte} y1={0} x2={corte} y2={alto * marca} stroke="#1E1A16" strokeWidth={4} /> : null}
  </svg>
);

// Herramientas (dibujadas con el mango hacia abajo-derecha, origen en la punta de agarre).
export const Serrucho: React.FC<{ escala?: number }> = ({ escala = 1 }) => (
  <svg width={300 * escala} height={120 * escala} viewBox="0 0 300 120" style={{ overflow: "visible" }}>
    <path d="M 0 30 L 210 18 L 210 70 L 0 62 Z" fill="#C3C8CE" />
    <path d="M 0 62 L 210 70" stroke="#8C9298" strokeWidth={3} />
    {Array.from({ length: 21 }, (_, i) => (
      <path key={i} d={`M ${i * 10} ${62 + i * 0.38} l 5 7 l 5 -7`} fill="#8C9298" />
    ))}
    <path d="M 205 8 Q 290 8 290 50 Q 290 92 205 84 Z" fill={PAL.madera} />
    <ellipse cx={248} cy={48} rx={20} ry={22} fill={PAL.maderaOscura} />
  </svg>
);

export const Mazo: React.FC = () => (
  <svg width={180} height={200} style={{ overflow: "visible" }}>
    <rect x={70} y={60} width={20} height={140} rx={8} fill={PAL.madera} />
    <rect x={20} y={10} width={120} height={64} rx={14} fill={PAL.maderaOscura} />
  </svg>
);

export const Formon: React.FC = () => (
  <svg width={60} height={220} style={{ overflow: "visible" }}>
    <rect x={18} y={0} width={24} height={110} rx={10} fill={PAL.madera} />
    <path d="M 22 110 L 38 110 L 38 200 L 30 216 L 22 200 Z" fill="#B8BDC3" />
  </svg>
);

export const Escuadra: React.FC = () => (
  <svg width={200} height={200} style={{ overflow: "visible" }}>
    <path d="M 10 10 L 10 190 L 190 190" stroke="#D0B07A" strokeWidth={24} fill="none" strokeLinejoin="round" />
    {Array.from({ length: 8 }, (_, i) => (
      <line key={i} x1={22} y1={30 + i * 20} x2={34} y2={30 + i * 20} stroke="#6E4A2C" strokeWidth={3} />
    ))}
  </svg>
);

// Viga (vista lateral) para obreros.
export const Viga: React.FC<{ largo: number; grosor?: number }> = ({ largo, grosor = 40 }) => (
  <svg width={largo} height={grosor} style={{ overflow: "visible" }}>
    <rect x={0} y={0} width={largo} height={grosor} rx={6} fill="#B07A48" />
    <rect x={0} y={grosor - 10} width={largo} height={10} fill="#8A5A30" />
    <path d={`M 10 ${grosor * 0.4} q ${largo / 3} -6 ${largo - 20} 0`} stroke="#8A5A30" strokeWidth={3} fill="none" />
  </svg>
);

// Bloque de piedra tallada.
export const Sillar: React.FC<{ w?: number; h?: number; tono?: number }> = ({ w = 120, h = 70, tono = 0 }) => (
  <svg width={w} height={h} style={{ overflow: "visible" }}>
    <rect x={0} y={0} width={w} height={h} rx={6} fill={["#D2C09C", "#C6B28A", "#DCCBA8"][tono % 3]} />
    <rect x={0} y={h - 12} width={w} height={12} rx={4} fill="#A8946E" />
    <path d={`M ${w * 0.2} ${h * 0.35} l ${w * 0.15} 4`} stroke="#A8946E" strokeWidth={3} />
  </svg>
);

// ---------- libro ----------
// Libro antiguo: `apertura` 0 (cerrado) → 1 (abierto). Centrado en (0,0) del contenedor; ancho abierto 2*w.
export const LibroAntiguo: React.FC<{ apertura: number; w?: number; h?: number; izquierda?: React.ReactNode; derecha?: React.ReactNode; tapa?: React.ReactNode; color?: string }> = ({
  apertura,
  w = 400,
  h = 540,
  izquierda,
  derecha,
  tapa,
  color = "#6B3A22",
}) => {
  const a = Math.max(0, Math.min(1, apertura));
  // la tapa gira sobre el lomo (x = 0): de cubrir la página derecha a quedar a la izquierda
  const escalaTapa = Math.cos(a * Math.PI); // 1 → -1
  return (
    <div style={{ position: "absolute", left: 0, top: 0 }}>
      {/* sombra */}
      <div style={{ position: "absolute", left: -w * (0.1 + a * 0.95), top: h / 2 - 10, width: w * (1.2 + a * 0.95), height: 60, borderRadius: "50%", background: "rgba(0,0,0,0.35)", filter: "blur(14px)" }} />
      {/* contratapa */}
      <div style={{ position: "absolute", left: -6, top: -h / 2 - 8, width: w + 14, height: h + 16, borderRadius: 10, background: color }} />
      {a > 0.02 ? <div style={{ position: "absolute", left: -w - 8, top: -h / 2 - 8, width: w + 14, height: h + 16, borderRadius: 10, background: color, opacity: Math.min(1, a * 3) }} /> : null}
      {/* páginas */}
      <div style={{ position: "absolute", left: 0, top: -h / 2, width: w, height: h, background: "linear-gradient(90deg,#D9C59A 0%,#EFE2C2 12%,#F2E6C8 100%)", borderRadius: "0 6px 6px 0", overflow: "hidden" }}>{derecha}</div>
      {/* tapa que gira */}
      <div
        style={{
          position: "absolute",
          left: escalaTapa >= 0 ? 0 : -w * -escalaTapa,
          top: -h / 2 - 8,
          width: w * Math.abs(escalaTapa) + 8,
          height: h + 16,
          borderRadius: 10,
          background: escalaTapa >= 0 ? `linear-gradient(90deg, ${color}, #8A4E2E)` : "linear-gradient(270deg,#E9DBB8,#D9C59A)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          overflow: "hidden",
          display: Math.abs(escalaTapa) < 0.02 ? "none" : "block",
        }}
      >
        {escalaTapa >= 0 ? <div style={{ position: "absolute", inset: 0, transform: `scaleX(${Math.max(0.02, escalaTapa)})`, transformOrigin: "0 0", width: w }}>{tapa}</div> : null}
      </div>
      {/* página izquierda: queda encima del interior de la tapa */}
      {a > 0.5 ? (
        <div style={{ position: "absolute", left: -w, top: -h / 2, width: w, height: h, background: "linear-gradient(270deg,#D9C59A 0%,#EFE2C2 12%,#F2E6C8 100%)", borderRadius: "6px 0 0 6px", overflow: "hidden" }}>{izquierda}</div>
      ) : null}
    </div>
  );
};

// Tapa decorada (marco dorado).
export const TapaLibro: React.FC<{ w?: number; h?: number }> = ({ w = 400, h = 540 }) => (
  <svg width={w} height={h + 16}>
    <rect x={30} y={38} width={w - 70} height={h - 60} rx={10} fill="none" stroke={PAL.dorado} strokeWidth={6} opacity={0.85} />
    <rect x={50} y={58} width={w - 110} height={h - 100} rx={8} fill="none" stroke={PAL.dorado} strokeWidth={2} opacity={0.6} />
    <circle cx={w / 2 - 5} cy={h / 2 + 8} r={46} fill="none" stroke={PAL.dorado} strokeWidth={5} />
    <path d={`M ${w / 2 - 5} ${h / 2 - 22} L ${w / 2 - 5} ${h / 2 + 38} M ${w / 2 - 30} ${h / 2} L ${w / 2 + 20} ${h / 2}`} stroke={PAL.dorado} strokeWidth={5} strokeLinecap="round" />
  </svg>
);

// Líneas de texto "manuscrito" sobre una página.
export const Renglones: React.FC<{ x: number; y: number; ancho: number; n: number; paso?: number; progreso?: number; color?: string }> = ({ x, y, ancho, n, paso = 30, progreso = 1, color = PAL.tinta }) => (
  <svg style={{ position: "absolute", left: x, top: y }} width={ancho} height={n * paso}>
    {Array.from({ length: n }, (_, i) => {
      const p = Math.max(0, Math.min(1, progreso * n - i));
      const largo = ancho * (i % 3 === 2 ? 0.7 : 0.95) * p;
      return <line key={i} x1={0} y1={i * paso + 10} x2={largo} y2={i * paso + 10} stroke={color} strokeOpacity={0.5} strokeWidth={5} strokeLinecap="round" />;
    })}
  </svg>
);

// Ruta punteada que se dibuja (de p0 a p1 con curva). progreso 0..1.
export const Ruta: React.FC<{ p0: [number, number]; p1: [number, number]; curva?: number; progreso: number; color?: string; grosor?: number; ancho?: number; alto?: number }> = ({
  p0,
  p1,
  curva = -120,
  progreso,
  color = PAL.coral,
  grosor = 8,
  ancho = 1080,
  alto = 1920,
}) => {
  const mx = (p0[0] + p1[0]) / 2;
  const my = (p0[1] + p1[1]) / 2 + curva;
  const d = `M ${p0[0]} ${p0[1]} Q ${mx} ${my} ${p1[0]} ${p1[1]}`;
  const largo = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) * 1.25;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={ancho} height={alto}>
      <defs>
        <mask id={`ruta-${p0[0]}-${p1[0]}`}>
          <path d={d} stroke="white" strokeWidth={grosor * 3} fill="none" strokeDasharray={largo} strokeDashoffset={largo * (1 - progreso)} />
        </mask>
      </defs>
      <path d={d} stroke={color} strokeWidth={grosor} fill="none" strokeDasharray={`${grosor * 2.2} ${grosor * 1.6}`} strokeLinecap="round" mask={`url(#ruta-${p0[0]}-${p1[0]})`} />
    </svg>
  );
};

// Pergamino de fondo (mapa).
export const Pergamino: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode }> = ({ x, y, w, h, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id={`perg-${w}-${h}`} cx="50%" cy="45%" r="75%">
          <stop offset="0%" stopColor="#F3E6C6" />
          <stop offset="80%" stopColor="#E2CD9E" />
          <stop offset="100%" stopColor="#C8AE7D" />
        </radialGradient>
      </defs>
      <path d={`M 20 10 Q ${w / 2} 30 ${w - 20} 6 Q ${w - 4} ${h / 2} ${w - 14} ${h - 10} Q ${w / 2} ${h - 30} 14 ${h - 6} Q 2 ${h / 2} 20 10 Z`} fill={`url(#perg-${w}-${h})`} />
    </svg>
    {children}
  </div>
);

export const PuntoMapa: React.FC<{ x: number; y: number; nombre: string; aparece?: number; color?: string; tam?: number; lado?: "izq" | "der" | "abajo" | "arriba" }> = ({
  x,
  y,
  nombre,
  aparece = 0,
  color = PAL.coral,
  tam = 44,
  lado = "der",
}) => {
  const frame = useCurrentFrame();
  const e = lerp(frame, aparece, aparece + 10, 0, 1, Easing.out(Easing.back(2)));
  if (e <= 0) return null;
  const pos: React.CSSProperties =
    lado === "der" ? { left: 30, top: -tam * 0.65 } : lado === "izq" ? { right: 30, top: -tam * 0.65 } : lado === "abajo" ? { left: -200, width: 400, textAlign: "center", top: 26 } : { left: -200, width: 400, textAlign: "center", top: -tam * 1.6 };
  return (
    <div style={{ position: "absolute", left: x, top: y, scale: String(e) }}>
      <div style={{ position: "absolute", left: -16, top: -16, width: 32, height: 32, borderRadius: 16, background: color, border: `5px solid ${PAL.tinta}` }} />
      <div style={{ position: "absolute", whiteSpace: "nowrap", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: tam, color: PAL.tinta, ...pos }}>{nombre}</div>
    </div>
  );
};

// Montañitas dibujadas a tinta (estilo mapa antiguo).
export const MontesMapa: React.FC<{ puntos: [number, number][] }> = ({ puntos }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
    {puntos.map(([x, y], i) => (
      <path key={i} d={`M ${x - 40} ${y} L ${x} ${y - 46} L ${x + 40} ${y} M ${x - 8} ${y - 36} L ${x + 6} ${y - 18}`} stroke={PAL.tinta} strokeOpacity={0.5} strokeWidth={5} fill="none" strokeLinejoin="round" />
    ))}
  </svg>
);

// Partículas (aserrín, polvo) que caen desde un punto.
export const Particulas: React.FC<{ x: number; y: number; desde: number; hasta: number; color?: string; n?: number; dispersion?: number }> = ({ x, y, desde, hasta, color = "#E2B47A", n = 14, dispersion = 60 }) => {
  const frame = useCurrentFrame();
  if (frame < desde) return null;
  return (
    <svg style={{ position: "absolute", left: x - 200, top: y - 50, overflow: "visible" }} width={400} height={400}>
      {Array.from({ length: n }, (_, i) => {
        const nace = desde + ((i * 7) % Math.max(1, hasta - desde));
        const t = frame - nace;
        if (t < 0 || t > 40) return null;
        const px = 200 + Math.sin(i * 12.9) * dispersion * (t / 40) + (i % 2 ? 1 : -1) * t * 0.6;
        const py = 50 + t * t * 0.08 + t * 1.2;
        return <rect key={i} x={px} y={py} width={6} height={6} rx={2} fill={color} opacity={1 - t / 40} transform={`rotate(${t * 9 + i * 30} ${px} ${py})`} />;
      })}
    </svg>
  );
};
