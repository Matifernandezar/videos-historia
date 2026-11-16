// Escenas del video "¿Por qué Dios no destruye al diablo?" (Versículo Oculto).
// Mateo 13:24-43 (trigo y cizaña), 2 Pedro 3:9 y Lucas 15:11-32 (hijo pródigo). Ilustraciones originales.
import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from "remotion";
import { useEscena } from "../../video/contexto";
import type { EscenaAnimada } from "../../video/tipos";
import { FUENTE_SERIFA, FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { Sfx, useMomento } from "../comun";
import { Camara, Capa, lerp, PAL, Referencia, Textura } from "../jesus-12-30/escenarios";
import { Arbol, Arbusto, Astro, Bruma, CasaAdobe, CieloV2, Gradacion, mezcla, Montes, Pajaros, Pasto, Polvo, RayosDeLuz, Roca, Suelo } from "../ambiente";
import { Cierre as CierreCanal, Fig, gestoEnsenar, manoDe, osc } from "../jesus-12-30/escenas";
import type { Brazo } from "../jesus-12-30/personas";

type PropsEscena = { escena: EscenaAnimada };
const cl = (v: number) => Math.max(0, Math.min(1, v));
const azar = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ---------- piezas ----------

// Planta de trigo o de cizaña. (x, y) = base. crece 0..1, madura 0..1 (verde → dorado), alza = tirón hacia arriba.
const Planta: React.FC<{ x: number; y: number; h: number; tipo: "trigo" | "cizana"; crece: number; madura?: number; alza?: number; i: number }> = ({ x, y, h, tipo, crece, madura = 0, alza = 0, i }) => {
  const f = useCurrentFrame();
  if (crece <= 0.02) return null;
  const alto = h * crece;
  const sway = Math.sin(f / 22 + i * 0.7) * 6 * crece;
  const verde = tipo === "trigo" ? "#6F8F3E" : "#3F5E3A";
  const dorado = "#D9A64A";
  const tallo = tipo === "trigo" ? (madura > 0 ? `rgb(${111 + (217 - 111) * madura},${143 + (166 - 143) * madura},${62 + (74 - 62) * madura})` : verde) : verde;
  const top = { x: x + sway, y: y - alto - alza };
  const espiga = cl((crece - 0.55) / 0.45);
  return (
    <g>
      <path d={`M ${x} ${y - alza} Q ${x + sway * 0.3} ${y - alto * 0.5 - alza} ${top.x} ${top.y}`} stroke={tallo} strokeWidth={Math.max(2, h * 0.025)} fill="none" strokeLinecap="round" />
      <path d={`M ${x} ${y - alto * 0.35 - alza} q ${-h * 0.12} ${-h * 0.05} ${-h * 0.2} ${h * 0.04}`} stroke={tallo} strokeWidth={Math.max(2, h * 0.02)} fill="none" strokeLinecap="round" />
      <path d={`M ${x} ${y - alto * 0.55 - alza} q ${h * 0.12} ${-h * 0.05} ${h * 0.2} ${h * 0.04}`} stroke={tallo} strokeWidth={Math.max(2, h * 0.02)} fill="none" strokeLinecap="round" />
      {espiga > 0 ? (
        tipo === "trigo" ? (
          <g transform={`translate(${top.x} ${top.y}) rotate(${sway * 1.5}) scale(${espiga})`}>
            {Array.from({ length: 6 }, (_, k) => (
              <ellipse key={k} cx={(k % 2 ? 1 : -1) * h * 0.022} cy={-k * h * 0.035} rx={h * 0.028} ry={h * 0.045} fill={madura > 0 ? `rgb(${140 + (217 - 140) * madura},${170 + (166 - 170) * madura},${80 - 6 * madura})` : "#8CAA52"} />
            ))}
          </g>
        ) : (
          <g transform={`translate(${top.x} ${top.y}) rotate(${sway * 1.5}) scale(${espiga})`}>
            <line x1={0} y1={0} x2={0} y2={-h * 0.22} stroke="#3F5E3A" strokeWidth={Math.max(1.5, h * 0.012)} />
            {Array.from({ length: 5 }, (_, k) => (
              <ellipse key={k} cx={(k % 2 ? 1 : -1) * h * 0.03} cy={-k * h * 0.05 - h * 0.02} rx={h * 0.016} ry={h * 0.026} fill="#2E3A2A" />
            ))}
          </g>
        )
      ) : null}
      {madura > 0.6 && tipo === "trigo" ? <circle cx={top.x} cy={top.y - h * 0.08} r={h * 0.12} fill={dorado} opacity={0.12 * madura} /> : null}
    </g>
  );
};

// Campo: cielo (día ↔ noche), montes en capas con bruma, árboles, casa lejana, surcos y plantas.
// Mismo terreno en todas las escenas. Las capas lejanas se mueven menos que la cámara (paralaje).
type PlantaCampo = { x: number; y: number; h: number; tipo: "trigo" | "cizana" };
const yFila = (fila: number) => 1010 + fila * 50 + fila * fila * 2;
const PLANTAS: PlantaCampo[] = [];
for (let fila = 0; fila < 8; fila++) {
  const n = 14 + fila;
  for (let k = 0; k < n; k++) {
    const i = fila * 40 + k;
    PLANTAS.push({ x: -120 + (k + azar(i) * 0.6) * (1320 / n), y: yFila(fila), h: 70 + fila * 26, tipo: azar(i + 333) < 0.22 ? "cizana" : "trigo" });
  }
}
const Campo: React.FC<{ noche?: number; crece?: number; madura?: number; cizana?: number; casa?: boolean; luces?: number }> = ({ noche = 0, crece = 0, madura = 0, cizana = 1, casa = true, luces = 1 }) => (
  <>
    <CieloV2 hora="dia" noche={noche} horizonte={1000} />
    <Astro x={200} y={470} r={60} opacidad={1 - noche} />
    <Astro x={860} y={430} r={44} tipo="luna" opacidad={noche} />
    {noche < 0.3 ? <Pajaros y={560} n={5} velocidad={1.1} /> : null}
    <Capa k={0.3}>
      <Montes y={900} color={mezcla("#9DB1CB", "#16223F", noche)} bruma={mezcla("#DCE3E2", "#213059", noche)} amp={84} paso={520} semilla={1} />
    </Capa>
    <Capa k={0.5}>
      <Montes y={944} color={mezcla("#8CA386", "#17263F", noche)} bruma={mezcla("#CBD5B6", "#22335A", noche)} amp={56} paso={380} semilla={2} />
      <Bruma y={985} alto={150} color={noche > 0.5 ? "#3A4E80" : "#FFF2D6"} fuerza={0.45} />
    </Capa>
    <Capa k={0.75}>
      <Montes y={978} color={mezcla("#748A55", "#14203A", noche)} bruma={mezcla("#8E9E68", "#1B2944", noche)} amp={30} paso={300} semilla={3} alto={300} />
      <Arbol x={70} y={994} e={0.44} tipo="cipres" tono={noche} semilla={1} />
      <Arbol x={128} y={998} e={0.54} tipo="cipres" tono={noche} semilla={2} />
      <Arbol x={470} y={992} e={0.34} tipo="olivo" tono={noche} semilla={3} />
      <Arbol x={1040} y={998} e={0.52} tipo="olivo" tono={noche} semilla={4} />
      {casa ? <CasaAdobe x={790} suelo={1003} w={200} h={300} noche={noche} luz={noche * luces} toldo={false} tinajas={false} /> : null}
    </Capa>
    <Suelo y={1000} c1={mezcla("#B28F60", "#2B2439", noche)} c2={mezcla("#7A5B3A", "#15111D", noche)} vetas={noche > 0.5 ? "rgba(0,0,0,0.3)" : "rgba(60,36,14,0.18)"} semilla={2} />
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      {/* surcos: lomo claro y sombra */}
      {Array.from({ length: 8 }, (_, fila) => {
        const y = yFila(fila);
        return (
          <g key={fila}>
            <path d={`M -900 ${y + 10} L 2000 ${y + 10}`} stroke={noche > 0.5 ? "#0E0B14" : "#5E4428"} strokeWidth={8 + fila * 2} opacity={0.42} />
            <path d={`M -900 ${y - 1} L 2000 ${y - 1}`} stroke={noche > 0.5 ? "#4A4668" : "#D9BA86"} strokeWidth={2.5 + fila * 0.5} opacity={0.4} />
          </g>
        );
      })}
      {PLANTAS.map((p, i) => (p.tipo === "cizana" && cizana <= 0 ? null : <Planta key={i} x={p.x} y={p.y} h={p.h} tipo={p.tipo} crece={p.tipo === "cizana" ? Math.min(crece, cizana) : crece} madura={madura} i={i} />))}
    </svg>
  </>
);

// Primer plano del campo (pasto y piedras fuera de foco): se dibuja DESPUÉS de los personajes.
const PrimerPlano: React.FC<{ y?: number; noche?: number; flores?: boolean }> = ({ y = 1560, noche = 0, flores = true }) => (
  <Capa k={1.25}>
    <div style={{ position: "absolute", left: 0, top: 0, filter: "blur(2.5px)" }}>
      <Roca x={110} y={y + 110} e={1.9} tono={noche} semilla={3} />
      <Roca x={960} y={y + 150} e={2.4} tono={noche} semilla={7} />
      <Pasto x={-260} y={y + 40} ancho={1600} alto={220} n={44} h={90} color={noche > 0.5 ? "#1F2E2C" : "#5E7340"} color2={noche > 0.5 ? "#2A3C38" : "#8A9E58"} semilla={5} />
      {flores && noche < 0.5 ? (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={i} cx={-200 + azar(i + 70) * 1480} cy={y + 30 + azar(i + 90) * 200} r={9} fill={i % 2 ? "#E9C24E" : "#F3EEE0"} />
          ))}
        </svg>
      ) : null}
    </div>
  </Capa>
);

// Semillas que vuelan desde la mano y caen en los surcos.
const Semillas: React.FC<{ desde: { x: number; y: number }; activo: boolean; color?: string; dir?: number; semilla?: number }> = ({ desde, activo, color = "#E6D2A0", dir = 1, semilla = 0 }) => {
  const f = useCurrentFrame();
  if (!activo) return null;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      {Array.from({ length: 22 }, (_, k) => {
        const t = ((f + k * 3 + semilla) % 26) / 26;
        const vx = (40 + azar(k + semilla) * 150) * dir;
        return <ellipse key={k} cx={desde.x + vx * t} cy={desde.y - 40 * t + 300 * t * t} rx={5.5} ry={4} fill={color} stroke="rgba(0,0,0,0.25)" strokeWidth={1.2} opacity={1 - t * 0.5} />;
      })}
    </svg>
  );
};

// Teléfono en la mano (pantalla con noticias genéricas, sin marcas).
const Telefono: React.FC<{ x: number; y: number; rot?: number; s?: number; brillo?: number }> = ({ x, y, rot = 0, s = 1, brillo = 1 }) => (
  <div style={{ position: "absolute", left: x - 34 * s, top: y - 64 * s, width: 68 * s, height: 128 * s, borderRadius: 13 * s, background: "linear-gradient(160deg,#2A2F40,#141722)", border: `${4 * s}px solid #454A5A`, rotate: `${rot}deg`, boxShadow: `0 0 ${50 * brillo}px rgba(150,190,255,${0.6 * brillo}), 0 6px 14px rgba(0,0,0,0.4)` }}>
    <div style={{ position: "absolute", inset: 3 * s, borderRadius: 8 * s, background: `rgba(210,228,255,${0.16 * brillo})` }} />
    <div style={{ position: "absolute", left: 6 * s, right: 6 * s, top: 10 * s, height: 30 * s, background: "linear-gradient(180deg,#C8362A,#96241A)", borderRadius: 3 * s, opacity: brillo }} />
    {[0, 1, 2, 3].map((k) => (
      <div key={k} style={{ position: "absolute", left: 6 * s, right: (6 + (k % 2) * 14) * s, top: (48 + k * 16) * s, height: 7 * s, background: "#A9C0D4", borderRadius: 3 * s, opacity: brillo }} />
    ))}
  </div>
);

// Habitación actual de noche: ventana con la ciudad, cortinas, lámpara de pie encendida, sillón y alfombra.
const Cuarto: React.FC = () => {
  const f = useCurrentFrame();
  const lamp = 0.92 + 0.08 * Math.sin(f / 9) * Math.sin(f / 23);
  return (
    <>
      <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 2210, background: "linear-gradient(180deg,#1B2742 0%,#2A3B62 70%,#33466E 100%)" }} />
      <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 2210, background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 60px, rgba(0,0,0,0) 60px, rgba(0,0,0,0) 120px)" }} />
      {/* ventana a la ciudad */}
      <div style={{ position: "absolute", left: 610, top: 380, width: 340, height: 470, borderRadius: 10, background: "linear-gradient(180deg,#060B1A 0%,#152447 70%,#2C406E 100%)", border: "16px solid #5A5672", boxShadow: "0 10px 30px rgba(0,0,0,0.45), inset 0 0 40px rgba(0,0,0,0.5)", overflow: "hidden" }}>
        {Array.from({ length: 22 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: azar(i) * 300, top: azar(i + 9) * 250, width: 3, height: 3, borderRadius: 2, background: "#F7F1E3", opacity: 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(f / 9 + i)) }} />
        ))}
        <div style={{ position: "absolute", left: 210, top: 50, width: 46, height: 46, borderRadius: 23, background: "#F3EEDD", boxShadow: "0 0 40px rgba(243,238,221,0.7)" }} />
        {[
          [0, 300, 80],
          [70, 260, 60],
          [124, 320, 90],
          [208, 280, 70],
          [270, 330, 60],
        ].map(([x, top, w], i) => (
          <div key={i} style={{ position: "absolute", left: x, top, width: w, height: 200, background: "#0E1730" }}>
            {Array.from({ length: 6 }, (_, k) => (
              <div key={k} style={{ position: "absolute", left: 10 + (k % 2) * (w / 2 - 6), top: 14 + Math.floor(k / 2) * 34, width: 12, height: 16, background: "#F2C14E", opacity: azar(i * 9 + k) > 0.5 ? 0.85 : 0.08 }} />
            ))}
          </div>
        ))}
        <div style={{ position: "absolute", left: 152, top: 0, width: 12, height: 440, background: "#5A5672" }} />
        <div style={{ position: "absolute", left: 0, top: 206, width: 310, height: 12, background: "#5A5672" }} />
      </div>
      {/* cortinas */}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        <rect x={560} y={340} width={440} height={22} rx={11} fill="#3A3650" />
        {[
          [570, 1],
          [990, -1],
        ].map(([cx, d], i) => (
          <g key={i}>
            <path d={`M ${cx} 356 L ${cx + 96 * d} 356 Q ${cx + 70 * d} 640 ${cx + 84 * d} 900 L ${cx - 6 * d} 900 Z`} fill="#6B5680" stroke="#3E3050" strokeWidth={3} />
            <path d={`M ${cx + 28 * d} 360 Q ${cx + 20 * d} 640 ${cx + 26 * d} 896 M ${cx + 60 * d} 360 Q ${cx + 46 * d} 640 ${cx + 56 * d} 896`} stroke="#4A3C5E" strokeWidth={5} fill="none" opacity={0.7} />
          </g>
        ))}
        {/* cuadro en la pared */}
        <rect x={170} y={520} width={210} height={160} rx={6} fill="#C9A66A" stroke="#6E5230" strokeWidth={8} />
        <path d="M 178 664 L 240 590 L 290 640 L 330 600 L 372 664 Z" fill="#7E8F5A" />
        <circle cx={330} cy={562} r={16} fill="#F2C14E" />
      </svg>
      {/* piso de madera, zócalo y alfombra */}
      <div style={{ position: "absolute", left: -900, top: 1300, width: 2900, height: 1100, background: "linear-gradient(180deg,#3A2F3E 0%,#221C2A 100%)" }} />
      <div style={{ position: "absolute", left: -900, top: 1300, width: 2900, height: 1100, background: "repeating-linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 58px, rgba(0,0,0,0.25) 58px, rgba(0,0,0,0.25) 62px)" }} />
      <div style={{ position: "absolute", left: -900, top: 1284, width: 2900, height: 20, background: "#4A4662" }} />
      <div style={{ position: "absolute", left: 20, top: 1400, width: 900, height: 190, borderRadius: "50%", background: "radial-gradient(ellipse, #7A4E5E 0%, #5E3C4C 60%, #4A2E3E 100%)", border: "6px solid #8C6470" }} />
      {/* sillón */}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        <ellipse cx={380} cy={1348} rx={330} ry={22} fill="rgba(0,0,0,0.35)" />
        <path d="M 100 1090 Q 100 1040 150 1040 L 610 1040 Q 660 1040 660 1090 L 660 1260 L 100 1260 Z" fill="#56587E" stroke="#2E2F48" strokeWidth={4} />
        <path d="M 380 1046 L 380 1250" stroke="#3A3C5C" strokeWidth={5} />
        <path d="M 110 1090 Q 110 1056 150 1052 L 370 1052" stroke="#8284A8" strokeWidth={6} fill="none" opacity={0.5} strokeLinecap="round" />
        <rect x={84} y={1210} width={592} height={110} rx={30} fill="#62648C" stroke="#2E2F48" strokeWidth={4} />
        <rect x={50} y={1130} width={90} height={200} rx={40} fill="#4C4E72" stroke="#2E2F48" strokeWidth={4} />
        <rect x={620} y={1130} width={90} height={200} rx={40} fill="#4C4E72" stroke="#2E2F48" strokeWidth={4} />
        <rect x={500} y={1110} width={110} height={104} rx={22} fill="#C98A5A" stroke="#7A4E2E" strokeWidth={4} transform="rotate(10 555 1160)" />
        {/* lámpara de pie */}
        <rect x={826} y={900} width={12} height={430} fill="#2A2A36" />
        <ellipse cx={832} cy={1332} rx={62} ry={12} fill="#2A2A36" />
        <path d="M 770 900 L 894 900 L 868 780 L 796 780 Z" fill="#F2D9A0" stroke="#A8864A" strokeWidth={4} />
      </svg>
      <div style={{ position: "absolute", left: 832 - 420, top: 860 - 420, width: 840, height: 840, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,214,140,0.5) 0%, rgba(255,214,140,0.16) 40%, rgba(255,214,140,0) 68%)", opacity: lamp, mixBlendMode: "screen" }} />
    </>
  );
};

// Casa del padre: casa de adobe con puerta que se abre con luz. e = escala (1 → 420 de ancho).
const CasaPadre: React.FC<{ x: number; suelo: number; abierta?: number; e?: number }> = ({ x, suelo, abierta = 0, e = 1 }) => <CasaAdobe x={x} suelo={suelo} w={420 * e} h={330} abierta={abierta} toldo={e > 0.8} tinajas={e > 0.8} />;

// Paisaje del camino (lateral): montes en capas, árboles, sendero de tierra con piedras y la casa a la derecha.
const Camino: React.FC<{ tarde?: number; casa?: boolean; abierta?: number }> = ({ tarde = 0, casa = true, abierta = 0 }) => {
  const t = tarde > 0.5;
  return (
    <>
      <CieloV2 hora={t ? "tarde" : "dia"} horizonte={1090} />
      <Astro x={230} y={t ? 940 : 520} r={t ? 86 : 60} color={t ? "#FFD9A0" : undefined} />
      {t ? null : <Pajaros y={600} n={4} velocidad={1.0} />}
      <Capa k={0.3}>
        <Montes y={965} color={t ? "#8C7DA8" : "#9DB1CB"} bruma={t ? "#F4C9A0" : "#DCE3E2"} amp={96} paso={560} semilla={5} />
      </Capa>
      <Capa k={0.5}>
        <Montes y={1018} color={t ? "#8D8870" : "#8CA386"} bruma={t ? "#EBC89A" : "#CBD5B6"} amp={60} paso={400} semilla={6} />
        <Bruma y={1070} alto={160} color={t ? "#FFD9A8" : "#FFF2D6"} fuerza={0.5} />
      </Capa>
      <Capa k={0.75}>
        <Montes y={1064} color={t ? "#7E8052" : "#748A55"} bruma={t ? "#A39A64" : "#8E9E68"} amp={28} paso={300} semilla={7} alto={300} />
        <Arbol x={60} y={1084} e={0.5} tipo="olivo" tono={t ? 0.25 : 0} semilla={1} />
        <Arbol x={420} y={1080} e={0.5} tipo="cipres" tono={t ? 0.25 : 0} semilla={2} />
        <Arbol x={480} y={1084} e={0.62} tipo="cipres" tono={t ? 0.25 : 0} semilla={3} />
        <Arbol x={1180} y={1086} e={0.6} tipo="palmera" tono={t ? 0.25 : 0} semilla={4} />
      </Capa>
      <Suelo y={1085} c1={t ? "#B59A6A" : "#B3A274"} c2={t ? "#7E6A48" : "#86754E"} semilla={4} />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        {/* sendero de tierra apisonada */}
        <path d="M -900 1232 Q 200 1212 1100 1240 L 2000 1246 L 2000 1340 Q 700 1352 -900 1334 Z" fill={t ? "#D9BE8C" : "#DCC798"} />
        <path d="M -900 1232 Q 200 1212 1100 1240 L 2000 1246" stroke="rgba(255,255,255,0.35)" strokeWidth={4} fill="none" />
        <path d="M -900 1334 Q 700 1352 2000 1340" stroke="rgba(0,0,0,0.22)" strokeWidth={8} fill="none" />
        <path d="M -600 1280 q 200 -8 420 4 M 100 1300 q 240 -10 520 2 M 780 1284 q 200 -6 380 4" stroke="rgba(120,90,50,0.3)" strokeWidth={4} fill="none" strokeLinecap="round" />
        {Array.from({ length: 16 }, (_, i) => (
          <ellipse key={i} cx={-300 + i * 110 + azar(i) * 50} cy={i % 2 ? 1226 + azar(i + 3) * 8 : 1342 + azar(i + 5) * 8} rx={12 + azar(i + 8) * 12} ry={7} fill="#A8946E" stroke="rgba(0,0,0,0.25)" strokeWidth={2} />
        ))}
      </svg>
      <Pasto x={-400} y={1196} ancho={1900} alto={26} n={40} h={30} color={t ? "#7A7A44" : "#6F8448"} color2={t ? "#A39A58" : "#93A662"} semilla={2} />
      <Arbusto x={640} y={1212} e={0.9} tono={t ? 0.2 : 0} semilla={3} />
      <Roca x={330} y={1214} e={0.8} semilla={2} />
      {casa ? <CasaPadre x={900} suelo={1262} abierta={abierta} /> : null}
      {t ? <RayosDeLuz x={230} y={940} largo={1500} angulo={8} apertura={50} n={6} color="#FFD9A0" fuerza={0.4} /> : null}
    </>
  );
};

// Interior de una casa de la época (Jesús explica; la fiesta): pared de adobe, vigas, nicho con lámpara de aceite,
// ventana con luz de tarde y esteras en el piso.
export const Interior: React.FC<{ fiesta?: boolean }> = ({ fiesta = false }) => {
  const f = useCurrentFrame();
  const llama = 0.85 + 0.15 * Math.sin(f / 4) * Math.sin(f / 11);
  return (
    <>
      <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 2230, background: fiesta ? "linear-gradient(180deg,#5C3F2E 0%,#946E4A 70%,#A47C54 100%)" : "linear-gradient(180deg,#3B2C26 0%,#735745 70%,#80624C 100%)" }} />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        {/* vigas del techo */}
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={-200 + i * 240} y={120} width={70} height={34} rx={8} fill="#4A3020" stroke="#2A1A10" strokeWidth={3} />
        ))}
        <rect x={-900} y={96} width={2900} height={30} fill="#3A2416" />
        {/* manchas y grietas del revoque */}
        <path d="M 80 420 q 30 30 10 70 M 900 700 q -20 40 14 80 M 480 250 q 40 10 70 -6" stroke="rgba(0,0,0,0.18)" strokeWidth={5} fill="none" strokeLinecap="round" />
        {/* ventana con luz de tarde */}
        <path d="M 860 420 L 860 300 Q 925 240 990 300 L 990 420 Z" fill="#F6C98A" stroke="#4A3020" strokeWidth={10} />
        <path d="M 925 262 L 925 420 M 860 350 L 990 350" stroke="#4A3020" strokeWidth={7} />
        {/* nicho con lámpara de aceite */}
        <path d="M 60 760 L 60 660 Q 115 610 170 660 L 170 760 Z" fill="#2E211A" stroke="#4A3020" strokeWidth={6} />
        <path d="M 84 752 Q 115 732 150 752 L 160 744 L 146 760 L 84 760 Z" fill="#B8663E" stroke="#5A2E1A" strokeWidth={3} />
        <path d={`M 150 742 Q ${146 + Math.sin(f / 3) * 3} ${716 - llama * 10} 156 ${704 - llama * 12} Q 164 724 158 742 Z`} fill="#FFD27A" />
      </svg>
      <div style={{ position: "absolute", left: 154 - 260, top: 720 - 260, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,200,110,0.55) 0%, rgba(255,200,110,0.14) 45%, rgba(255,200,110,0) 70%)", opacity: llama, mixBlendMode: "screen" }} />
      <RayosDeLuz x={925} y={340} largo={1300} angulo={128} apertura={34} n={4} color="#FFDCA8" fuerza={0.35} />
      {/* piso de tierra con esteras */}
      <div style={{ position: "absolute", left: -900, top: 1300, width: 2900, height: 1100, background: fiesta ? "linear-gradient(180deg,#6E5038 0%,#4A3424 100%)" : "linear-gradient(180deg,#5A4434 0%,#3A2A20 100%)" }} />
      <div style={{ position: "absolute", left: -900, top: 1290, width: 2900, height: 16, background: "rgba(0,0,0,0.25)" }} />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        <path d="M 380 1400 L 1040 1400 L 1120 1520 L 330 1520 Z" fill="#A8683E" stroke="#5A3018" strokeWidth={4} />
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d={`M ${392 + i * 96} 1402 L ${350 + i * 112} 1518`} stroke={i % 2 ? "#E3C27A" : "#6E3A22"} strokeWidth={10} opacity={0.7} />
        ))}
      </svg>
      <Polvo x={500} y={300} ancho={600} alto={900} n={18} semilla={4} />
    </>
  );
};

// Calle de hoy al atardecer: perfil lejano de la ciudad, edificios con ventanas, farol, árbol y vereda.
const Calle: React.FC = () => {
  const f = useCurrentFrame();
  const edif = (x: number, top: number, w: number, color: string, i: number, sem: number) => (
    <g key={`${x}-${i}`}>
      <rect x={x} y={top} width={w} height={1210 - top} fill={color} stroke="rgba(0,0,0,0.35)" strokeWidth={3} />
      <rect x={x + w * 0.72} y={top} width={w * 0.28} height={1210 - top} fill="rgba(0,0,0,0.16)" />
      <rect x={x - 6} y={top - 12} width={w + 12} height={16} fill={color} stroke="rgba(0,0,0,0.35)" strokeWidth={3} />
      {Array.from({ length: Math.floor((1150 - top) / 96) * 3 }, (_, k) => {
        const col = k % 3;
        const fil = Math.floor(k / 3);
        const on = azar(sem * 13 + k) > 0.45;
        return <rect key={k} x={x + w * 0.1 + col * (w * 0.28)} y={top + 36 + fil * 96} width={w * 0.19} height={56} rx={4} fill={on ? "#F7CE72" : "#2A2840"} opacity={on ? 0.75 + 0.25 * Math.sin(f / 30 + k) : 0.9} stroke="rgba(0,0,0,0.3)" strokeWidth={2} />;
      })}
    </g>
  );
  return (
    <>
      <CieloV2 hora="tarde" horizonte={1210} />
      <Astro x={540} y={1120} r={110} color="#FFCF96" />
      <Capa k={0.4}>
        <svg style={{ position: "absolute", left: -600, top: 0, overflow: "visible" }} width={10} height={10}>
          {Array.from({ length: 22 }, (_, i) => (
            <rect key={i} x={i * 110} y={900 - azar(i + 2) * 260} width={90 + azar(i + 7) * 30} height={400} fill="#6E5A80" opacity={0.75} />
          ))}
        </svg>
        <Bruma y={1160} alto={240} color="#FFD0A0" fuerza={0.55} />
      </Capa>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        {edif(-260, 430, 300, "#4A4466", 0, 1)}
        {edif(70, 600, 250, "#5A4E70", 1, 2)}
        {edif(700, 500, 270, "#4E4868", 2, 3)}
        {edif(990, 620, 300, "#5C5074", 3, 4)}
        {/* toldos de los locales */}
        <path d="M 80 1040 L 310 1040 L 326 1100 L 64 1100 Z" fill="#B5523A" stroke="#6E2A1A" strokeWidth={3} />
        <path d="M 712 1040 L 958 1040 L 972 1100 L 698 1100 Z" fill="#3E7A6E" stroke="#1E4A40" strokeWidth={3} />
      </svg>
      {/* vereda, cordón y calle */}
      <div style={{ position: "absolute", left: -900, top: 1205, width: 2900, height: 260, background: "linear-gradient(180deg,#8E8794 0%,#76707E 100%)" }} />
      <div style={{ position: "absolute", left: -900, top: 1205, width: 2900, height: 260, background: "repeating-linear-gradient(90deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 178px, rgba(0,0,0,0.18) 178px, rgba(0,0,0,0.18) 182px)" }} />
      <div style={{ position: "absolute", left: -900, top: 1462, width: 2900, height: 22, background: "#5A5564" }} />
      <div style={{ position: "absolute", left: -900, top: 1484, width: 2900, height: 900, background: "linear-gradient(180deg,#4A4654 0%,#2E2A38 100%)" }} />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        {/* árbol de vereda */}
        <ellipse cx={520} cy={1290} rx={90} ry={12} fill="rgba(0,0,0,0.3)" />
        <path d="M 508 1290 Q 512 1150 500 1060 L 536 1060 Q 528 1150 536 1290 Z" fill="#4A3424" stroke="#2A1A10" strokeWidth={3} />
        <g transform={`rotate(${Math.sin(f / 36) * 1.2} 520 1060)`}>
          <ellipse cx={470} cy={990} rx={96} ry={78} fill="#3E5A40" />
          <ellipse cx={574} cy={980} rx={100} ry={84} fill="#3E5A40" />
          <ellipse cx={520} cy={920} rx={110} ry={88} fill="#56764E" />
          <ellipse cx={490} cy={890} rx={56} ry={34} fill="#7C9A62" opacity={0.8} />
        </g>
        {/* farol */}
        <rect x={104} y={820} width={14} height={470} fill="#2A2634" />
        <path d="M 111 824 Q 111 780 170 780" stroke="#2A2634" strokeWidth={12} fill="none" />
        <path d="M 150 782 L 200 782 L 190 820 L 160 820 Z" fill="#FFE2A0" stroke="#2A2634" strokeWidth={4} />
        <ellipse cx={111} cy={1292} rx={34} ry={8} fill="#2A2634" />
      </svg>
      <div style={{ position: "absolute", left: 175 - 300, top: 810 - 300, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,220,150,0.6) 0%, rgba(255,220,150,0.15) 40%, rgba(255,220,150,0) 68%)", mixBlendMode: "screen", opacity: 0.9 + 0.1 * Math.sin(f / 7) }} />
    </>
  );
};

// Banco de plaza con respaldo de listones.
const Banco: React.FC<{ x: number; suelo: number }> = ({ x, suelo }) => (
  <svg style={{ position: "absolute", left: x, top: suelo, overflow: "visible" }} width={10} height={10}>
    <ellipse cx={0} cy={4} rx={210} ry={14} fill="rgba(0,0,0,0.3)" />
    {[-150, 150].map((d) => (
      <path key={d} d={`M ${d - 10} 0 L ${d - 10} -230 L ${d + 10} -230 L ${d + 10} 0 Z M ${d - 26} 0 L ${d + 26} 0`} fill="#2E2A38" stroke="#1A1722" strokeWidth={4} />
    ))}
    {[-230, -196, -162].map((yy) => (
      <rect key={yy} x={-180} y={yy} width={360} height={24} rx={8} fill="#8A5A30" stroke="#4A2E16" strokeWidth={3} />
    ))}
    <rect x={-190} y={-112} width={380} height={28} rx={10} fill="#9A6A3E" stroke="#4A2E16" strokeWidth={3} />
  </svg>
);

// ---------- 1. LA PREGUNTA ----------
const Pregunta: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fDiablo = useMomento("diablo", 0.35);
  const fMismo = useMomento("mismo", 0.5);
  const fParabola = useMomento("parábola", 0.75);
  const baja = lerp(f, fDiablo - 6, fMismo + 4, 0, 1, Easing.inOut(Easing.cubic)); // baja el teléfono y levanta la mirada
  const pregunta = lerp(f, fMismo, fMismo + 10, 0, 1, Easing.out(Easing.back(1.5)));
  const paisaje = lerp(f, fParabola - 8, duracion - 2, 0, 1, Easing.inOut(Easing.cubic));
  const P = { x: 420, suelo: 1500, a: 420 };
  const bTel: Brazo = { hombro: 14 + 6 * baja, codo: -112 + 70 * baja };
  const m = manoDe(P.x, P.suelo, P.a, bTel, 1);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - paisaje }}>
        <Camara tomas={[{ f: 0, x: 440, y: 1010, z: 1.38 }, { f: fMismo, x: 480, y: 980, z: 1.2 }]} vaiven={0.4}>
          <Cuarto />
          <Fig quien="fiel" x={P.x} suelo={P.suelo} ancho={P.a} giro={0.25} mirada={[2, 9 - 16 * baja]} cejas={{ rot: 7, y: -2 * baja }} boca={{ curva: -6 }} cabeza={8 - 12 * baja} brazoDer={bTel} brazoIzq={{ hombro: 10, codo: -30 }} semilla={1} />
          <Telefono x={m.x + 6} y={m.y - 30} rot={-14 + 20 * baja} s={1.1} brillo={1 - 0.5 * baja} />
          {/* la luz de la pantalla le da en la cara */}
          <div style={{ position: "absolute", left: P.x - 260, top: P.suelo - 900, width: 520, height: 620, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(150,190,255,0.5) 0%, rgba(150,190,255,0.12) 45%, rgba(150,190,255,0) 70%)", mixBlendMode: "screen", opacity: 1 - baja }} />
        </Camara>
      </AbsoluteFill>
      {/* el campo aparece por detrás con un paneo lateral suave */}
      {paisaje > 0 ? (
        <AbsoluteFill style={{ opacity: paisaje }}>
          <Camara tomas={[{ f: fParabola - 8, x: 240, y: 1040, z: 1.5 }, { f: duracion, x: 400, y: 1080, z: 1.3 }]} vaiven={0.3}>
            <Campo crece={0} />
            <PrimerPlano />
          </Camara>
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 40, right: 40, top: 250, textAlign: "center", opacity: pregunta, scale: String(0.85 + 0.15 * pregunta), fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 96, lineHeight: 1.02, color: PAL.crema, textShadow: "0 6px 18px rgba(0,0,0,0.5)" }}>
          ¿Por qué Dios <span style={{ color: PAL.dorado }}>espera</span>?
        </div>
      </AbsoluteFill>
      <Textura />
      <Sfx archivo="whoosh" en={fParabola} volumen={0.2} />
    </AbsoluteFill>
  );
};

// ---------- 2. DOS SIEMBRAS ----------
const Siembras: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fDormian = useMomento("dormían", 0.4);
  const fEnemigo = useMomento("enemigo", 0.55);
  const fCampo = useMomento("campo", 0.95);
  const noche = lerp(f, fDormian - 10, fDormian + 10, 0, 1);
  const luces = 1 - lerp(f, fDormian + 6, fDormian + 16, 0, 1);
  const camina = lerp(f, 0, fDormian - 6, 0, 1, Easing.linear);
  const S = { x: 200 + 400 * camina, suelo: 1360, a: 300 };
  const tira = osc(f, 18);
  const bS: Brazo = { hombro: 30 + 70 * tira, codo: 20 - 30 * tira, mano: "abierta" };
  const mS = manoDe(S.x, S.suelo, S.a, bS, 1);
  const entra = lerp(f, fEnemigo - 8, duracion, 0, 1, Easing.linear);
  const E = { x: 1050 - 520 * entra, suelo: 1370, a: 300 };
  const bE: Brazo = { hombro: 30 + 60 * osc(f, 16, 0.3), codo: 20, mano: "abierta" };
  const mE = manoDe(E.x, E.suelo, E.a, bE, -1);
  const sembradorVisible = noche < 1;
  return (
    <AbsoluteFill>
      <Camara tomas={[{ f: 0, x: 400, y: 1080, z: 1.3 }, { f: fDormian - 4, x: 560, y: 1080, z: 1.3 }, { f: duracion, x: 620, y: 1085, z: 1.36 }]} vaiven={0.4}>
        <Campo noche={noche} crece={0} luces={luces} />
        {sembradorVisible ? (
          <div style={{ opacity: 1 - noche }}>
            <Fig quien="sembrador" x={S.x} suelo={S.suelo} ancho={S.a} giro={0.4} mirada={[6, 4]} caminando={0.6} paso={f / 20} brazoDer={bS} brazoIzq={{ hombro: 10, codo: -70 }} semilla={2} />
            {/* morral de semillas en bandolera */}
            <svg style={{ position: "absolute", left: S.x, top: S.suelo, overflow: "visible" }} width={10} height={10}>
              <path d="M 44 -372 L -70 -262" stroke="#6E4E2E" strokeWidth={9} strokeLinecap="round" />
              <path d="M -112 -268 Q -118 -196 -74 -186 Q -30 -196 -36 -268 Z" fill="#9A7448" stroke="#5A3E22" strokeWidth={4} />
              <path d="M -112 -268 Q -74 -286 -36 -268 Q -74 -250 -112 -268 Z" fill="#E6D2A0" stroke="#5A3E22" strokeWidth={3} />
            </svg>
            <Semillas desde={mS} activo={tira > 0.6} />
          </div>
        ) : null}
        {f >= fEnemigo - 8 ? (
          <>
            <Fig quien="enemigo" x={E.x} suelo={E.suelo} ancho={E.a} giro={-0.5} mirada={[-6, 6]} ojos={0.7} caminando={0.5} paso={f / 22} brazoIzq={bE} brazoDer={{ hombro: 10, codo: -60 }} semilla={7} />
            <Semillas desde={mE} activo={osc(f, 16, 0.3) > 0.6} color="#2E3A2A" dir={-1} semilla={9} />
          </>
        ) : null}
        <Gradacion color="#24356E" fuerza={noche * 0.3} />
        <PrimerPlano noche={noche} />
      </Camara>
      <Referencia texto="Mateo 13:24-25" aparece={6} hasta={duracion - 6} />
      <Textura />
      <Sfx archivo="semillas" en={10} volumen={0.35} />
      <Sfx archivo="semillas" en={34} volumen={0.3} />
      <Sfx archivo="paso" en={20} volumen={0.2} />
      <Sfx archivo="grillos" en={fDormian} volumen={0.2} />
      <Sfx archivo="semillas" en={fEnemigo + 6} volumen={0.25} />
      <Sfx archivo="viento" en={fCampo - 20} volumen={0.12} />
    </AbsoluteFill>
  );
};

// ---------- 3. EL PELIGRO DE ARRANCAR ----------
const RAICES_X = { trigo: 430, cizana: 650 };
const CorteRaices: React.FC<{ tirar: number; f: number }> = ({ tirar, f }) => {
  const alza = 60 * tirar;
  const alzaTrigo = 34 * tirar;
  return (
    <>
      <CieloV2 hora="dia" horizonte={850} />
      <Montes y={800} color="#8CA386" bruma="#CBD5B6" amp={40} paso={420} semilla={9} alto={200} />
      {/* corte del suelo: capa fértil, tierra y piedras */}
      <div style={{ position: "absolute", left: -900, top: 850, width: 2900, height: 1500, background: "linear-gradient(180deg,#7A5636 0%,#6A4A2E 25%,#553A24 60%,#3E2A1A 100%)" }} />
      <div style={{ position: "absolute", left: -900, top: 850, width: 2900, height: 26, background: "linear-gradient(180deg,#4E3A22,#7A5636)" }} />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        {Array.from({ length: 34 }, (_, i) => {
          const px = -100 + azar(i + 200) * 1280;
          const py = 900 + azar(i + 230) * 560;
          const r = 8 + azar(i + 260) * 22;
          return i % 3 === 0 ? (
            <ellipse key={i} cx={px} cy={py} rx={r} ry={r * 0.7} fill="#8E7A62" stroke="rgba(0,0,0,0.3)" strokeWidth={2.5} />
          ) : (
            <path key={i} d={`M ${px} ${py} q ${r * 2} ${-r * 0.3} ${r * 4} 0`} stroke="rgba(0,0,0,0.18)" strokeWidth={4} fill="none" strokeLinecap="round" />
          );
        })}
      </svg>
      <Pasto x={-200} y={846} ancho={1500} alto={8} n={46} h={34} semilla={8} />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        {/* raíces entrelazadas */}
        {Array.from({ length: 7 }, (_, k) => (
          <path key={`t${k}`} d={`M ${RAICES_X.trigo} ${850 - alzaTrigo} C ${RAICES_X.trigo + 40 + k * 26} ${980 - alzaTrigo * 0.6}, ${RAICES_X.trigo + 160 + k * 10} ${1080 + k * 20}, ${RAICES_X.trigo + 60 + k * 40} ${1220 + k * 16}`} stroke="#E8D9B0" strokeWidth={6 - k * 0.5} fill="none" strokeLinecap="round" />
        ))}
        {Array.from({ length: 7 }, (_, k) => (
          <path key={`c${k}`} d={`M ${RAICES_X.cizana} ${850 - alza} C ${RAICES_X.cizana - 40 - k * 26} ${980 - alza * 0.6}, ${RAICES_X.cizana - 170 - k * 10} ${1070 + k * 22}, ${RAICES_X.cizana - 60 - k * 40} ${1210 + k * 18}`} stroke="#3A2A20" strokeWidth={6 - k * 0.5} fill="none" strokeLinecap="round" />
        ))}
        <Planta x={RAICES_X.trigo} y={850} h={420} tipo="trigo" crece={1} alza={alzaTrigo} i={3} />
        <Planta x={RAICES_X.cizana} y={850} h={420} tipo="cizana" crece={1} alza={alza} i={8} />
      </svg>
      {/* flecha: se tira de la cizaña */}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: tirar > 0 ? 1 : 0.5 }} width={10} height={10}>
        <path d={`M ${RAICES_X.cizana + 70} ${560 - alza} L ${RAICES_X.cizana + 70} ${380 - alza}`} stroke={PAL.crema} strokeWidth={10} strokeLinecap="round" />
        <path d={`M ${RAICES_X.cizana + 46} ${410 - alza} L ${RAICES_X.cizana + 70} ${370 - alza} L ${RAICES_X.cizana + 94} ${410 - alza}`} stroke={PAL.crema} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {tirar > 0.3 ? <div style={{ position: "absolute", left: RAICES_X.trigo - 60, top: 410 - alzaTrigo, width: 120, height: 120, borderRadius: "50%", border: "6px solid rgba(242,193,78,0.9)", opacity: Math.sin(f / 4) * 0.3 + 0.7 }} /> : null}
    </>
  );
};
const Arrancar: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fArrancarla = useMomento("arrancarla", 0.25);
  const fFreno = useMomento("frenó", 0.38);
  const fPodian = useMomento("podían", 0.45);
  const fPidio = useMomento("pidió", 0.68);
  const fCosecha = useMomento("cosecha", 0.92);
  const crece = lerp(f, 0, fArrancarla - 6, 0, 1, Easing.inOut(Easing.quad));
  const agacha = lerp(f, fArrancarla - 4, fArrancarla + 10, 0, 1);
  const frena = lerp(f, fFreno - 4, fFreno + 8, 0, 1, Easing.out(Easing.back(1.4)));
  const corte = lerp(f, fPodian - 4, fPodian + 6, 0, 1) * (1 - lerp(f, fPidio - 6, fPidio + 2, 0, 1));
  const tirar = lerp(f, fPodian + 6, fPodian + 22, 0, 1, Easing.inOut(Easing.quad)) * (1 - lerp(f, fPidio - 14, fPidio - 4, 0, 1));
  const madura = lerp(f, fPidio, fCosecha + 6, 0, 1);
  const senala = lerp(f, fPidio + 2, fPidio + 12, 0, 1, Easing.out(Easing.back(1.4)));
  const W = { x: 680, suelo: 1390, a: 320 };
  const D = { x: 250 + 70 * lerp(f, fFreno - 14, fFreno, 0, 1), suelo: 1380, a: 330 };
  const suelta = 1 - frena;
  const bW: Brazo = { hombro: 8 + 26 * agacha * suelta, codo: -14 + 34 * agacha * suelta, mano: "puno" };
  const bD: Brazo = madura > 0 ? { hombro: 10 + 100 * senala, codo: 0, mano: "senala" } : { hombro: 10 + 60 * frena, codo: 60 * frena, mano: "abierta" };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - corte }}>
        <Camara tomas={[{ f: 0, x: 620, y: 1085, z: 1.36 }, { f: fArrancarla, x: 500, y: 1100, z: 1.42 }, { f: fPidio, x: 500, y: 1100, z: 1.42 }, { f: duracion, x: 560, y: 1080, z: 1.22 }]} vaiven={0.4}>
          <Campo crece={crece} madura={madura} />
          {crece > 0.6 ? (
            <>
              <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
                <Planta x={W.x - 130} y={W.suelo + 10} h={420} tipo="cizana" crece={1} i={77} />
              </svg>
              <Fig quien="obrero" x={W.x} suelo={W.suelo} ancho={W.a} corta giro={-0.5} mirada={[-8, 6 - 10 * frena]} cabeza={-14 * agacha * suelta} cejas={{ y: -4 * frena }} brazoIzq={bW} brazoDer={{ hombro: 8, codo: -20 }} semilla={3} />
              <Fig quien="sembrador" x={D.x} suelo={D.suelo} ancho={D.a} giro={0.5} mirada={[8, 0]} boca={{ curva: 4 }} caminando={1 - lerp(f, fFreno - 2, fFreno + 4, 0, 1)} paso={f / 14} brazoDer={bD} brazoIzq={{ hombro: 10, codo: -40 }} semilla={2} />
            </>
          ) : null}
          <PrimerPlano flores={false} />
        </Camara>
      </AbsoluteFill>
      {corte > 0 ? (
        <AbsoluteFill style={{ opacity: corte }}>
          <Camara tomas={[{ f: fPodian, x: 540, y: 820, z: 1.0 }]} vaiven={0.2}>
            <CorteRaices tirar={tirar} f={f} />
          </Camara>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1220, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 40, color: PAL.crema, textShadow: "0 4px 12px rgba(0,0,0,0.6)", opacity: lerp(f, fPodian + 8, fPodian + 16, 0, 1) }}>raíces entrelazadas</div>
        </AbsoluteFill>
      ) : null}
      <Referencia texto="Mateo 13:28-30" aparece={fArrancarla} hasta={duracion - 4} />
      <Textura />
      <Sfx archivo="tela" en={fArrancarla} volumen={0.3} />
      <Sfx archivo="tela" en={fPodian + 8} volumen={0.3} />
      <Sfx archivo="viento" en={fPidio} volumen={0.15} />
    </AbsoluteFill>
  );
};

// ---------- 4. JESÚS EXPLICA ----------
const Explica: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fEnemigo = useMomento("enemigo", 0.35);
  const fCosecha = useMomento("cosecha", 0.65);
  const pasa = lerp(f, 0, 14, 0, 1);
  const c1 = lerp(f, fEnemigo - 2, fEnemigo + 8, 0, 1) * (1 - lerp(f, fCosecha - 8, fCosecha - 2, 0, 1));
  const c2 = lerp(f, fCosecha - 2, fCosecha + 8, 0, 1);
  const mirarPanel = c1 + c2 > 0.5;
  return (
    <AbsoluteFill>
      <Camara tomas={[{ f: 0, x: 540, y: 1000, z: 1.02 }, { f: duracion, x: 540, y: 1040, z: 1.14 }]} vaiven={0.4}>
        <Interior />
        {/* ilustración del campo (sale de la escena anterior), como un tapiz colgado */}
        <div style={{ position: "absolute", left: 208, top: 262, width: 10, height: 60, background: "#3A2416" }} />
        <div style={{ position: "absolute", left: 722, top: 262, width: 10, height: 60, background: "#3A2416" }} />
        <div style={{ position: "absolute", left: 120, top: 310, width: 700, height: 500, borderRadius: 14, overflow: "hidden", border: `12px solid ${PAL.doradoOscuro}`, boxShadow: "0 18px 40px rgba(0,0,0,0.5)", opacity: pasa, scale: String(0.9 + 0.1 * pasa), background: "#F1E2BE" }}>
          <div style={{ position: "absolute", left: 0, top: 0, scale: "0.66", transformOrigin: "0 0", translate: "-10px -520px" }}>
            <Campo crece={1} madura={c2} />
          </div>
          <div style={{ position: "absolute", inset: 0, background: "rgba(201,162,74,0.16)", mixBlendMode: "multiply" }} />
        </div>
        <Fig quien="jesus" edad={1} x={250} suelo={1420} ancho={330} giro={0.45} mirada={[8, mirarPanel ? -6 : 0]} boca={{ curva: 6 }} bocaAuto={0.3 * osc(f, 9)} brazoDer={gestoEnsenar(f)} brazoIzq={{ hombro: 10, codo: -60 }} semilla={1} />
        <Fig quien="vecino" sentado x={620} suelo={1430} ancho={280} giro={-0.45} mirada={[-8, mirarPanel ? -10 : -2]} semilla={4} />
        <Fig quien="oyente2" sentado x={860} suelo={1440} ancho={270} giro={-0.5} mirada={[-9, mirarPanel ? -10 : -1]} semilla={6} />
      </Camara>
      {[
        { o: c1, a: "El enemigo", b: "El diablo" },
        { o: c2, a: "La cosecha", b: "El final de los tiempos" },
      ].map((c) =>
        c.o > 0 ? (
          <div key={c.a} style={{ position: "absolute", left: 90, right: 90, top: 610, padding: "18px 16px", borderRadius: 20, background: "rgba(11,20,38,0.88)", border: `3px solid ${PAL.dorado}`, textAlign: "center", opacity: c.o, scale: String(0.92 + 0.08 * c.o), fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 46, lineHeight: 1.15, color: PAL.crema }}>
            {c.a} <span style={{ color: PAL.dorado }}>→</span> <span style={{ color: PAL.dorado }}>{c.b}</span>
          </div>
        ) : null,
      )}
      <Referencia texto="Mateo 13:36-39" aparece={4} hasta={duracion - 4} />
      <Textura />
      <Sfx archivo="pagina" en={4} volumen={0.3} />
      <Sfx archivo="brillo" en={fEnemigo} volumen={0.2} />
      <Sfx archivo="brillo" en={fCosecha} volumen={0.2} />
    </AbsoluteFill>
  );
};

// ---------- 5. TIEMPO PARA VOLVER ----------
const Volver: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fPaciencia = useMomento("paciencia", 0.3);
  const fQuiere = useMomento("quiere", 0.5);
  const fArrepientan = useMomento("arrepientan", 0.72);
  const fPerderse = useMomento("perderse", 0.9);
  const pagina = 1 - lerp(f, fQuiere - 8, fQuiere + 8, 0, 1);
  const lineas = lerp(f, 4, 30, 0, 1);
  // la persona se aleja (hacia la izquierda), se detiene, mira atrás y vuelve
  const mira = lerp(f, fQuiere + 4, fQuiere + 16, 0, 1);
  const anda = lerp(f, fArrepientan, duracion + 6, 0, 1, Easing.linear);
  const vuelve = anda > 0;
  const detenido = !vuelve;
  const x = 380 + 320 * anda;
  return (
    <AbsoluteFill>
      <Camara tomas={[{ f: 0, x: 500, y: 1050, z: 1.16 }, { f: duracion, x: 640, y: 1080, z: 1.3 }]} vaiven={0.4}>
        <Camino casa={false} />
        <div style={{ position: "absolute", left: 960 - 140, top: 960, width: 280, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,226,160,0.7), rgba(255,226,160,0) 70%)", opacity: mira }} />
        <CasaPadre x={960} suelo={1150} e={0.45} abierta={mira} />
        <Fig quien="prodigo" x={x} suelo={1290} ancho={280} giro={0.7 * mira} mirada={[9 * mira, 9 - 11 * mira]} cabeza={14 - 16 * mira} caminando={detenido ? 0 : 1} paso={f / 14} boca={{ curva: -2 }} brazoIzq={{ hombro: 8 + (detenido ? 0 : 10 * osc(f, 14)), codo: -15 }} brazoDer={{ hombro: 8 + (detenido ? 0 : 10 * osc(f, 14, 1)), codo: -15 }} semilla={5} />
        <PrimerPlano y={1500} flores={false} />
      </Camara>
      {/* página de 2 Pedro que se abre al camino */}
      {pagina > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: pagina }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(11,20,38,0.6)" }} />
          <div style={{ position: "absolute", left: 160, top: 360, width: 760, height: 860, borderRadius: 16, background: "linear-gradient(160deg,#F1E2BE,#DCC594)", boxShadow: "0 18px 40px rgba(0,0,0,0.5)", scale: String(1 + 0.4 * (1 - pagina)), opacity: pagina }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: 56, color: PAL.tinta }}>2 Pedro 3:9</div>
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} style={{ position: "absolute", left: 70, width: (560 - (i % 3) * 60) * cl(lineas * 12 - i), top: 170 + i * 52, height: 10, borderRadius: 5, background: "rgba(59,42,26,0.45)" }} />
            ))}
            {/* el último renglón se convierte en el camino */}
            <div style={{ position: "absolute", left: 70, top: 800, width: 620, height: 14, borderRadius: 7, background: "#C9A24A", opacity: lerp(f, fPaciencia, fPaciencia + 10, 0, 1) }} />
          </div>
        </div>
      ) : null}
      <Referencia texto="Paciencia y arrepentimiento" aparece={fPaciencia} hasta={duracion - 4} />
      <Textura />
      <Sfx archivo="pagina" en={2} volumen={0.35} />
      <Sfx archivo="paso" en={fQuiere + 6} volumen={0.2} />
      <Sfx archivo="paso" en={fPerderse + 4} volumen={0.2} />
    </AbsoluteFill>
  );
};

// ---------- 6. EL PADRE CORRE ----------
const Padre: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fLejos = useMomento("lejos", 0.5);
  const fCorre = useMomento("corre", 0.6);
  const fAbrazarlo = useMomento("abrazarlo", 0.7);
  const fCelebra = useMomento("celebra", 0.82);
  const fVuelveH = useMomento("vuelve", 0.4);
  const camHijo = lerp(f, fVuelveH - 10, fAbrazarlo - 4, 0, 1, Easing.linear);
  const xHijo = 150 + 300 * camHijo;
  const ve = lerp(f, fLejos - 4, fLejos + 6, 0, 1);
  const corre = lerp(f, fLejos + 8, fAbrazarlo - 2, 0, 1, Easing.inOut(Easing.quad));
  const xPadre = 860 - (860 - (xHijo + 95)) * corre;
  const abrazo = lerp(f, fAbrazarlo - 2, fAbrazarlo + 10, 0, 1);
  const fiesta = lerp(f, fCelebra - 4, fCelebra + 6, 0, 1);
  const bAbrazo: Brazo = { hombro: 80 - 20 * abrazo, codo: -125 * abrazo, mano: "abierta" };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - fiesta }}>
        <Camara tomas={[{ f: 0, x: 500, y: 1060, z: 1.14 }, { f: fAbrazarlo - 4, x: 540, y: 1070, z: 1.2 }, { f: fAbrazarlo + 14, x: 500, y: 1080, z: 1.55 }]} vaiven={0.3}>
          <Camino tarde={1} abierta={ve} />
          {/* hijo: ropa gastada, cabeza baja */}
          <Fig quien="prodigo" x={xHijo} suelo={1290} ancho={280} giro={0.55} mirada={[6, 8 - 8 * abrazo]} cabeza={12 + 4 * abrazo} ojos={1 - 0.5 * abrazo} caminando={abrazo > 0 || camHijo <= 0 ? 0 : 1} paso={f / 12} boca={{ curva: -4 + 8 * abrazo }} bocaAuto={f > fAbrazarlo - 6 && f < fAbrazarlo + 14 ? 0.4 * osc(f, 6) : 0} brazoIzq={{ hombro: 8, codo: -20 }} brazoDer={abrazo > 0.3 ? { hombro: 60, codo: -90, mano: "abierta" } : { hombro: 8, codo: -20 }} semilla={5} />
          {/* parches de la túnica */}
          <svg style={{ position: "absolute", left: xHijo - 140, top: 1290 - 520, overflow: "visible", opacity: 1 - abrazo * 0.3 }} width={10} height={10}>
            <rect x={110} y={330} width={36} height={30} fill="#7A6E5A" stroke="#5A4A3A" strokeWidth={3} strokeDasharray="5 4" />
            <rect x={150} y={420} width={30} height={26} fill="#8A7C64" stroke="#5A4A3A" strokeWidth={3} strokeDasharray="5 4" />
          </svg>
          {/* padre: lo ve de lejos, sale y corre */}
          <Fig quien="padre" x={xPadre} suelo={1295} ancho={300} giro={-0.55} cabeza={-12 * abrazo} mirada={[-8, 0]} cejas={{ y: -6 * ve, rot: -2 * ve }} boca={{ curva: 4 + 8 * ve, apertura: 4 * ve * (1 - abrazo) }} ojos={1 - 0.5 * abrazo} caminando={corre > 0 && corre < 1 ? 1 : 0} paso={f / 8} brazoIzq={abrazo > 0 ? bAbrazo : corre > 0 ? { hombro: 30 + 20 * osc(f, 9), codo: -40 } : { hombro: 10, codo: -20 }} brazoDer={abrazo > 0 ? bAbrazo : corre > 0 ? { hombro: 30 + 20 * osc(f, 9, 1), codo: -40 } : { hombro: 10, codo: -20 }} semilla={8} />
          {/* polvo que levanta al correr */}
          {corre > 0.05 && corre < 1 ? (
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
              {[0, 1, 2, 3].map((i) => {
                const t = ((f + i * 4) % 16) / 16;
                return <circle key={i} cx={xPadre + 70 + t * 60 + i * 10} cy={1292 - t * 30} r={10 + t * 22} fill="#E8D4AC" opacity={0.45 * (1 - t)} />;
              })}
            </svg>
          ) : null}
          <PrimerPlano y={1500} flores={false} />
        </Camara>
      </AbsoluteFill>
      {fiesta > 0 ? (
        <AbsoluteFill style={{ opacity: fiesta }}>
          <Camara tomas={[{ f: fCelebra, x: 540, y: 1050, z: 1.24 }, { f: duracion, x: 540, y: 1060, z: 1.12 }]} vaiven={0.5}>
            <Interior fiesta />
            {/* guirnaldas y lámparas colgantes */}
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
              <path d="M -100 200 Q 200 330 540 220 Q 880 330 1180 200" stroke="#566A40" strokeWidth={7} fill="none" />
              {Array.from({ length: 22 }, (_, i) => {
                const t = i / 21;
                const gx = -100 + t * 1280;
                const gy = 200 + Math.sin(t * Math.PI * 2 - Math.PI / 2) * 55 + 55 + Math.sin(f / 14 + i) * 2;
                return <ellipse key={i} cx={gx} cy={gy + 8} rx={13} ry={7} fill={i % 3 === 0 ? "#D9654B" : i % 3 === 1 ? "#E9C24E" : "#7E8F5A"} transform={`rotate(${i * 37} ${gx} ${gy + 8})`} />;
              })}
              {[230, 540, 850].map((lx, i) => (
                <g key={lx} transform={`translate(${lx} 0) rotate(${Math.sin(f / 22 + i) * 2} 0 130)`}>
                  <line x1={0} y1={130} x2={0} y2={400} stroke="#3A2416" strokeWidth={5} />
                  <path d="M -34 400 Q 0 380 34 400 Q 30 440 0 446 Q -30 440 -34 400 Z" fill="#C9973F" stroke="#6E4A18" strokeWidth={4} />
                  <path d={`M 0 400 Q ${-7 + Math.sin(f / 3 + i) * 3} 380 0 ${362 + Math.sin(f / 4 + i) * 4} Q 8 382 0 400 Z`} fill="#FFE9B0" />
                </g>
              ))}
            </svg>
            {[230, 540, 850].map((lx, i) => (
              <div key={lx} style={{ position: "absolute", left: lx - 230, top: 390 - 230, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,214,140,0.6) 0%, rgba(255,214,140,0.15) 45%, rgba(255,214,140,0) 70%)", mixBlendMode: "screen", opacity: 0.8 + 0.2 * Math.sin(f / 5 + i * 2) }} />
            ))}
            <Fig quien="vecina" x={150} suelo={1340} ancho={250} giro={0.4} boca={{ curva: 12 }} brazoIzq={{ hombro: 40 + 10 * osc(f, 10), codo: 70, mano: "abierta" }} brazoDer={{ hombro: 40 + 10 * osc(f, 10, 1), codo: 70, mano: "abierta" }} semilla={2} />
            <Fig quien="prodigo2" x={470} suelo={1360} ancho={290} giro={0.3} mirada={[6, 0]} boca={{ curva: 12 }} brazoIzq={{ hombro: 10, codo: -30 }} brazoDer={{ hombro: 10, codo: -30 }} semilla={5} />
            <Fig quien="padre" x={680} suelo={1365} ancho={300} giro={-0.4} mirada={[-6, 0]} boca={{ curva: 14 }} brazoIzq={{ hombro: 70, codo: -60, mano: "abierta" }} brazoDer={{ hombro: 20, codo: -30 }} semilla={8} />
            <Fig quien="oyente1" x={920} suelo={1340} ancho={250} giro={-0.4} boca={{ curva: 12 }} brazoIzq={{ hombro: 40 + 10 * osc(f, 10), codo: 70, mano: "abierta" }} brazoDer={{ hombro: 20, codo: -40 }} semilla={6} />
            {/* mesa con mantel, pan, uvas y una jarra */}
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
              <ellipse cx={540} cy={1470} rx={470} ry={20} fill="rgba(0,0,0,0.35)" />
              <path d="M 90 1296 L 990 1296 L 1010 1336 L 70 1336 Z" fill="#F1E6CE" stroke="#8A7A5A" strokeWidth={4} />
              <path d="M 70 1336 L 1010 1336 L 1000 1450 Q 920 1470 860 1448 Q 780 1474 700 1450 Q 620 1474 540 1450 Q 460 1474 380 1450 Q 300 1474 220 1448 Q 150 1470 80 1450 Z" fill="#E6D8BA" stroke="#8A7A5A" strokeWidth={4} />
              <path d="M 70 1356 L 1010 1356" stroke="#B5523A" strokeWidth={10} opacity={0.8} />
              <path d="M 220 1340 L 220 1446 M 380 1340 L 380 1448 M 540 1340 L 540 1448 M 700 1340 L 700 1448 M 860 1340 L 860 1446" stroke="rgba(0,0,0,0.1)" strokeWidth={6} />
              {/* panes */}
              {[200, 660].map((bx) => (
                <g key={bx}>
                  <ellipse cx={bx} cy={1300} rx={66} ry={12} fill="#B89A6A" stroke="#6E5230" strokeWidth={3} />
                  <ellipse cx={bx - 14} cy={1276} rx={40} ry={24} fill="#D9A45A" stroke="#7A4E1E" strokeWidth={3.5} />
                  <ellipse cx={bx + 26} cy={1282} rx={34} ry={20} fill="#C9903E" stroke="#7A4E1E" strokeWidth={3.5} />
                  <path d={`M ${bx - 30} 1268 l 12 -8 M ${bx - 14} 1264 l 12 -8 M ${bx + 2} 1268 l 12 -8`} stroke="#7A4E1E" strokeWidth={3} strokeLinecap="round" />
                </g>
              ))}
              {/* uvas */}
              <g>
                <ellipse cx={420} cy={1300} rx={60} ry={11} fill="#B89A6A" stroke="#6E5230" strokeWidth={3} />
                {[[396, 1284], [416, 1280], [436, 1284], [406, 1268], [426, 1268], [416, 1254], [446, 1272]].map(([ux, uy], i) => (
                  <circle key={i} cx={ux} cy={uy} r={11} fill="#6E3A6E" stroke="#3E1E3E" strokeWidth={2.5} />
                ))}
                <path d="M 416 1246 q 6 -14 20 -16" stroke="#566A40" strokeWidth={4} fill="none" strokeLinecap="round" />
              </g>
              {/* jarra y copas */}
              <path d="M 830 1298 Q 800 1270 812 1236 Q 818 1218 824 1206 L 856 1206 Q 862 1218 868 1236 Q 880 1270 850 1298 Z" fill="#B8663E" stroke="#5A2E1A" strokeWidth={4} />
              <path d="M 866 1226 Q 892 1232 884 1258 Q 880 1268 868 1268" stroke="#5A2E1A" strokeWidth={6} fill="none" />
              <path d="M 822 1250 Q 826 1228 832 1216" stroke="rgba(255,220,180,0.5)" strokeWidth={5} fill="none" strokeLinecap="round" />
              {[540, 930].map((cx2) => (
                <path key={cx2} d={`M ${cx2 - 16} 1262 L ${cx2 + 16} 1262 L ${cx2 + 10} 1284 L ${cx2 + 4} 1286 L ${cx2 + 4} 1294 L ${cx2 + 14} 1298 L ${cx2 - 14} 1298 L ${cx2 - 4} 1294 L ${cx2 - 4} 1286 L ${cx2 - 10} 1284 Z`} fill="#C9973F" stroke="#6E4A18" strokeWidth={3} />
              ))}
            </svg>
          </Camara>
        </AbsoluteFill>
      ) : null}
      <Referencia texto="Lucas 15:20-24" aparece={4} hasta={duracion - 4} />
      <Textura />
      <Sfx archivo="paso" en={6} volumen={0.2} />
      <Sfx archivo="paso" en={30} volumen={0.2} />
      <Sfx archivo="paso" en={fCorre} volumen={0.25} />
      <Sfx archivo="paso" en={fCorre + 8} volumen={0.25} />
      <Sfx archivo="tela" en={fAbrazarlo} volumen={0.35} />
      <Sfx archivo="multitud" en={fCelebra} volumen={0.1} />
    </AbsoluteFill>
  );
};

// ---------- 7. LA OPORTUNIDAD ----------
const Oportunidad: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fReconocer = useMomento("reconocer", 0.3);
  const fVolver = useMomento("volver", 0.42);
  const fJuicio = useMomento("juicio", 0.5);
  const fPaciencia = useMomento("paciencia", 0.72);
  const fConversion = useMomento("conversión", 0.92);
  const camino = lerp(f, 0, 20, 0, 1);
  const paso = lerp(f, 6, fVolver - 6, 0, 1, Easing.linear);
  const habla = f > fVolver && f < fJuicio;
  const cosecha = lerp(f, fJuicio - 4, fJuicio + 6, 0, 1) * (1 - lerp(f, fPaciencia - 6, fPaciencia + 2, 0, 1));
  const puerta = lerp(f, fPaciencia - 2, fPaciencia + 8, 0, 1);
  const abre = lerp(f, fPaciencia + 6, fConversion, 0, 1, Easing.inOut(Easing.cubic));
  const P = { x: 260 + 220 * paso, suelo: 1400, a: 320 };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: Math.max(0, 1 - cosecha - puerta) }}>
        <Camara tomas={[{ f: 0, x: 520, y: 1070, z: 1.16 }, { f: fVolver, x: 620, y: 1090, z: 1.32 }]} vaiven={0.4}>
          <Calle />
          {/* el camino de la parábola se prolonga hasta la vereda */}
          <div style={{ position: "absolute", left: -200, top: 1392, width: 1100 * camino, height: 22, borderRadius: 11, background: "linear-gradient(90deg, rgba(242,193,78,0), rgba(242,193,78,0.9))", boxShadow: "0 0 24px rgba(242,193,78,0.6)" }} />
          <Banco x={820} suelo={1402} />
          <Fig quien="fiel2" sentado x={820} suelo={1400} ancho={300} giro={-0.4} mirada={[-8, 0]} boca={{ curva: 2 + 6 * paso }} bocaAuto={habla ? 0.3 * osc(f, 7, 0.5) : 0} brazoIzq={{ hombro: 10, codo: -60 }} brazoDer={{ hombro: 10, codo: -60 }} semilla={4} />
          <Fig quien="fiel" x={P.x} suelo={P.suelo} ancho={P.a} giro={0.45} mirada={[8, 0]} boca={{ curva: 6 }} bocaAuto={habla ? 0.35 * osc(f, 6) : 0} caminando={paso > 0 && paso < 1 ? 0.7 : 0} paso={f / 18} brazoDer={paso >= 1 ? { hombro: 40, codo: 30, mano: "abierta" } : { hombro: 10, codo: -30 }} brazoIzq={{ hombro: 10, codo: -30 }} semilla={1} />
        </Camara>
      </AbsoluteFill>
      {/* el juicio está anunciado: el campo listo para la cosecha */}
      {cosecha > 0 ? (
        <AbsoluteFill style={{ opacity: cosecha }}>
          <Camara tomas={[{ f: fJuicio, x: 460, y: 1080, z: 1.2 }, { f: fPaciencia, x: 600, y: 1100, z: 1.32 }]} vaiven={0.3}>
            <Campo crece={1} madura={1} />
            <RayosDeLuz x={200} y={470} largo={1500} angulo={52} apertura={46} n={6} fuerza={0.35} />
            <PrimerPlano flores={false} />
          </Camara>
          <Referencia texto="Mateo 25:41 · Apocalipsis 20:10" aparece={fJuicio} hasta={fPaciencia - 6} />
        </AbsoluteFill>
      ) : null}
      {/* la paciencia de Dios: la puerta de la casa abierta */}
      {puerta > 0 ? (
        <AbsoluteFill style={{ opacity: puerta }}>
          <Camara tomas={[{ f: fPaciencia, x: 900, y: 1110, z: 1.6 }, { f: duracion, x: 900, y: 1110, z: 2.2 }]} vaiven={0.3}>
            <Camino tarde={1} abierta={abre} />
          </Camara>
        </AbsoluteFill>
      ) : null}
      <Textura />
      <Sfx archivo="paso" en={fReconocer} volumen={0.2} />
      <Sfx archivo="viento" en={fJuicio} volumen={0.15} />
      <Sfx archivo="brillo" en={fPaciencia + 6} volumen={0.3} />
    </AbsoluteFill>
  );
};

// ---------- 8. CIERRE ----------
const Cierre: React.FC<PropsEscena> = (p) => {
  const f = useCurrentFrame();
  const libro = lerp(f, 10, 22, 0, 1);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - libro }}>
        <Camara tomas={[{ f: 0, x: 900, y: 1110, z: 2.2 }, { f: 22, x: 900, y: 1110, z: 3.2 }]}>
          <Camino tarde={1} abierta={1} />
        </Camara>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,233,176,1), rgba(255,233,176,0) 70%)", opacity: lerp(f, 0, 12, 0, 1) }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: libro }}>
        <Sequence from={-14} layout="none">
          <CierreCanal {...p} />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ESCENAS_CIZANA: Record<string, React.FC<{ escena: EscenaAnimada }>> = {
  "cizana/pregunta": Pregunta,
  "cizana/siembras": Siembras,
  "cizana/arrancar": Arrancar,
  "cizana/explica": Explica,
  "cizana/volver": Volver,
  "cizana/padre": Padre,
  "cizana/oportunidad": Oportunidad,
  "cizana/cierre": Cierre,
};
export { Campo, Planta };
