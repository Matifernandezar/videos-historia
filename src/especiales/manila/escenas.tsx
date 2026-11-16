// Escenas del video "¿Dónde fue la misa más grande de la historia?" (Versículo Oculto).
// Fuentes: Wikipedia (Rizal Park, World Youth Day 1995, 2015 visit by Pope Francis to the Philippines,
// List of largest peaceful gatherings, List of stadiums by capacity). Ilustraciones originales.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { useEscena } from "../../video/contexto";
import type { EscenaAnimada } from "../../video/tipos";
import { FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { Sfx, useMomento } from "../comun";
import { Persona } from "../jesus-12-30/personas";
import { Camara, lerp, LibroAntiguo, PAL, Renglones, TapaLibro, Textura } from "../jesus-12-30/escenarios";
import { Fig } from "../jesus-12-30/escenas";
import { Arbol, azar } from "../ambiente";
import {
  AltarDeEspaldas,
  cl,
  CENTRO_MAPA,
  Contador,
  Dato,
  EstadioArriba,
  EstadioNoche,
  GenteEspalda,
  hexDe,
  Lluvia,
  mezcla,
  MANILA_MAPA,
  MapaFilipinas,
  MarDeLuces,
  ParqueAereo,
  PARQUE_POLI,
  Reloj,
} from "./piezas";

type PropsEscena = { escena: EscenaAnimada };
const SUAVE = Easing.inOut(Easing.cubic);

// ---------- vista de noche de la explanada (mar de luces cálidas) ----------
const HOR_N = 770;
export const Explanada: React.FC<{ tinte?: number }> = ({ tinte = 0 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#050813 0%,#0E1730 30%,#26335A 62%,#6A5A64 78%)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 50 }, (_, i) => (
          <circle key={i} cx={azar(i * 3) * 1080} cy={azar(i * 5) * 620} r={0.8 + azar(i) * 1.6} fill="#F7F1E3" opacity={0.2 + 0.45 * azar(i * 2) * (0.6 + 0.4 * Math.sin(f / 22 + i))} />
        ))}
        {/* silueta lejana de la ciudad con ventanas encendidas */}
        {Array.from({ length: 34 }, (_, i) => {
          const x = -40 + i * 34;
          const h = 30 + azar(i * 7) * 110 * (1 - Math.abs(i - 17) / 22);
          return (
            <g key={i}>
              <rect x={x} y={HOR_N - h} width={30} height={h + 6} fill="#1A2342" />
              {Array.from({ length: Math.floor(h / 16) }, (_, j) => (
                <rect key={j} x={x + 5 + (j % 2) * 12} y={HOR_N - h + 8 + j * 14} width={5} height={6} fill="#FFD27A" opacity={0.55 + 0.3 * azar(i * 11 + j)} />
              ))}
            </g>
          );
        })}
        {/* altar lejano */}
        <rect x={496} y={HOR_N - 36} width={88} height={40} fill="#F7F1E3" opacity={0.95} />
        <path d={`M 540 ${HOR_N - 70} L 540 ${HOR_N - 36} M 528 ${HOR_N - 58} L 552 ${HOR_N - 58}`} stroke="#FFD27A" strokeWidth={5} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: 540 - 300, top: HOR_N - 300, width: 600, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,214,140,0.8) 0%, rgba(255,214,140,0) 66%)", mixBlendMode: "screen" }} />
      <MarDeLuces horizonte={HOR_N + 4} frio={0.1 + 0.3 * tinte} />
    </div>
  );
};

// ---------- parque visto desde la multitud (de espaldas); estrado con el papa ----------
const HOR = 900;
const Parque: React.FC<{ epoca: number; papa: number; poncho?: number; desborde?: number; saludan?: number }> = ({ epoca, papa, poncho = 0, desborde = 0, saludan = 1 }) => {
  const f = useCurrentFrame();
  const top = mezcla("#F0B467", "#56647A", epoca);
  const mid = mezcla("#F7D49A", "#8794A8", epoca);
  const bot = mezcla("#FBE6C0", "#B8C2CE", epoca);
  const bruma = hexDe(mezcla("#F2C58A", "#A7B3C2", epoca));
  const piedra = mezcla("#C79A78", "#7E8DA3", epoca);
  const sombra = mezcla("#A57A5E", "#66758C", epoca);
  const ond = Math.sin(f / 6);
  const saludo = { hombro: 128 + 14 * ond, codo: 18 + 16 * Math.sin(f / 6 + 1.2), mano: "abierta" as const };
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>
      <div style={{ position: "absolute", left: -600, top: -900, width: 2280, height: HOR + 940, background: `linear-gradient(180deg, ${top} 0%, ${mid} 62%, ${bot} 100%)` }} />
      <div style={{ position: "absolute", left: 640, top: 380, width: 640, height: 640, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,240,200,0.95) 0%, rgba(255,226,160,0) 66%)", opacity: 1 - epoca }} />
      {/* nubes */}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        {Array.from({ length: 8 }, (_, i) => {
          const x = ((azar(i) * 1900 + f * (0.35 + 0.2 * azar(i + 4))) % 2000) - 500;
          return <ellipse key={i} cx={x} cy={150 + azar(i * 3) * 520} rx={170 + azar(i * 7) * 120} ry={34 + azar(i * 5) * 28} fill={mezcla("#FFF1D6", "#6D7A8F", epoca)} opacity={0.5 + 0.35 * epoca} />;
        })}
        {/* horizonte de la ciudad */}
        {Array.from({ length: 40 }, (_, i) => {
          const x = -300 + i * 50;
          const h = 26 + azar(i * 7) * 120 * (0.5 + 0.5 * Math.sin(i * 0.4) ** 2);
          return <rect key={i} x={x} y={HOR - h} width={44} height={h + 8} fill={mezcla(piedra, bruma, 0.35)} opacity={0.9} />;
        })}
        {/* calles llenas detrás de los edificios (la marea desborda el parque) */}
        <rect x={-300} y={HOR - 26} width={2000} height={34} fill="#8A7A6A" opacity={0.25 * desborde} />
        {desborde > 0
          ? Array.from({ length: 260 }, (_, i) => (
              <circle key={i} cx={-290 + (i / 260) * 1950 + azar(i) * 4} cy={HOR - 20 + azar(i * 3) * 24} r={3 + azar(i * 5) * 2} fill={azar(i * 9) < 0.8 ? "#F3C623" : "#FBF7EA"} opacity={desborde * 0.9} />
            ))
          : null}
      </svg>
      {[90, 190, 900, 1000].map((x, i) => (
        <Arbol key={x} x={x} y={HOR + 8} e={0.8 + (i % 2) * 0.15} tipo="palmera" semilla={i} tono={0.15 + 0.5 * epoca} />
      ))}
      {/* estrado: pantallas, techo, fondo con cruz, tarima y escalones */}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        {[160, 760].map((x) => (
          <g key={x}>
            <rect x={x} y={690} width={160} height={212} rx={6} fill="#10182E" stroke="#B9A97A" strokeWidth={4} />
            <rect x={x + 8} y={698} width={144} height={196} rx={4} fill={mezcla("#3A5A98", "#5A7098", epoca)} opacity={0.9} />
          </g>
        ))}
        <rect x={360} y={690} width={360} height={200} fill="#FBF7EA" stroke={sombra} strokeWidth={3} />
        <path d="M 340 690 L 740 690 L 716 652 L 364 652 Z" fill="#F7F1E3" stroke={sombra} strokeWidth={3} />
        <path d="M 540 704 L 540 800 M 506 734 L 574 734" stroke="#E3B04B" strokeWidth={14} strokeLinecap="round" />
        <path d="M 360 692 Q 380 760 372 890 L 400 890 Q 408 760 392 692 Z M 720 692 Q 700 760 708 890 L 680 890 Q 672 760 688 692 Z" fill="#E3B04B" opacity={0.9} />
        <rect x={340} y={884} width={400} height={34} fill="#EFE8D8" stroke={sombra} strokeWidth={3} />
        <rect x={340} y={916} width={400} height={9} fill={sombra} />
        <path d="M 500 925 L 580 925 L 592 938 L 488 938 Z" fill={sombra} />
      </svg>
      {/* el papa: sale uno y entra el otro */}
      <div style={{ opacity: 1 - papa }}>
        <Fig quien="jp2" x={540} suelo={886} ancho={122} giro={0} mirada={[0, 1]} boca={{ curva: 8 }} brazoDer={saludo} brazoIzq={{ hombro: 22, codo: 24, mano: "abierta" }} semilla={4} />
      </div>
      <div style={{ opacity: papa }}>
        <Fig quien="francisco2" x={540} suelo={886} ancho={122} giro={0} mirada={[0, 1]} boca={{ curva: 8 }} brazoDer={saludo} brazoIzq={{ hombro: 22, codo: 24, mano: "abierta" }} semilla={6} />
      </div>
      {/* multitud de espaldas */}
      <GenteEspalda horizonte={HOR} poncho={poncho} saludan={saludan} semilla={3} bruma={bruma} base={mezcla("#4A3A3C", "#3A4256", epoca)} />
      <div style={{ position: "absolute", left: -600, top: HOR - 30, width: 2280, height: 240, background: `linear-gradient(180deg, ${bruma}00 0%, ${bruma} 55%, ${bruma}00 100%)`, opacity: 0.28 }} />
    </div>
  );
};

// ---------- cuadrícula de 70 estadios ----------
const COLS = 7;
const FILAS = 10;
const celda = (c: number, r: number): [number, number] => [540 + (c - 3) * 150, 960 + (r - 4.5) * 118];
const Cuadricula: React.FC<{ f0: number; vivo?: boolean }> = ({ f0, vivo = true }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {Array.from({ length: COLS * FILAS }, (_, n) => {
        const c = n % COLS;
        const r = Math.floor(n / COLS);
        const [x, y] = celda(c, r);
        const dist = Math.hypot(c - 3, (r - 4.5) * 0.9);
        const e = vivo ? Easing.out(Easing.back(1.8))(cl((f - (f0 + dist * 2.4)) / 12)) : 1;
        if (e <= 0) return null;
        return (
          <g key={n} transform={`translate(${x} ${y}) scale(${e}) translate(${-x} ${-y})`} opacity={0.85 + 0.15 * Math.sin(f / 8 + n)}>
            <EstadioArriba cx={x} cy={y} rx={60} ry={43} lleno={1} detalle={false} />
          </g>
        );
      })}
    </g>
  );
};

// ================= 1. MÁS QUE CUALQUIER ESTADIO O RECITAL =================
const Apertura: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fRecital = useMomento("recital", 0.36);
  const fVeces = useMomento("veces", 0.62);
  const fAnos = useMomento("años", 0.74);
  const luz = 1 - lerp(f, fRecital + 6, fRecital + 32, 0, 1);
  const sube = lerp(f, fRecital + 22, fRecital + 78, 0, 1, SUAVE);
  const desen = Math.sin(Math.PI * cl(sube)) * 9;
  const linea = lerp(f, fVeces - 6, fVeces + 22, 0, 1);
  return (
    <AbsoluteFill>
      <Camara tomas={[{ f: 0, x: 540, y: 1020, z: 1.22 }, { f: fRecital + 12, x: 540, y: 1000, z: 1.06 }, { f: fRecital + 78, x: 540, y: 980, z: 1.0 }, { f: duracion, x: 540, y: 960, z: 1.14 }]}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${sube * 1500}px)`, filter: desen > 0.3 ? `blur(${desen}px)` : undefined }}>
          <EstadioNoche luz={luz} />
        </div>
        {sube > 0 ? (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${(sube - 1) * 1500}px)`, filter: desen > 0.3 ? `blur(${desen}px)` : undefined }}>
            <Explanada tinte={linea} />
            {/* dos momentos sobre el mismo lugar: mitad cálida (1995) y mitad fría con lluvia (2015) */}
            <div style={{ position: "absolute", left: 0, top: 0, width: 540 * linea, height: 1920, background: "rgba(255,170,70,0.16)", mixBlendMode: "soft-light" }} />
            <div style={{ position: "absolute", left: 1080 - 540 * linea, top: 0, width: 540 * linea, height: 1920, background: "rgba(90,140,230,0.34)", mixBlendMode: "soft-light" }} />
            <div style={{ position: "absolute", left: 540, top: 0, width: 540, height: 1920, overflow: "hidden", opacity: linea }}>
              <div style={{ position: "absolute", left: -540, top: 0 }}>
                <Lluvia fuerza={0.55} />
              </div>
            </div>
            <div style={{ position: "absolute", left: 537, top: 560, width: 6, height: 1360 * linea, background: `linear-gradient(180deg, ${PAL.dorado}, rgba(242,193,78,0.25))`, boxShadow: "0 0 24px rgba(242,193,78,0.8)", borderRadius: 3 }} />
            {[{ x: 300, t: "1995" }, { x: 780, t: "2015" }].map((o) => (
              <div key={o.t} style={{ position: "absolute", left: o.x, top: 640, transform: "translate(-50%, -50%)", opacity: linea, fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 84, color: "#F7F1E3", textShadow: "0 6px 20px rgba(0,0,0,0.7)", letterSpacing: 3 }}>
                {o.t}
              </div>
            ))}
            <Reloj x={540} y={1010} aparece={fAnos - 4} gira={44} />
            {f >= fAnos + 6 ? (
              <div style={{ position: "absolute", left: 540, top: 1160, transform: `translate(-50%, 0) scale(${0.7 + 0.3 * lerp(f, fAnos + 6, fAnos + 18, 0, 1, Easing.out(Easing.back(1.6)))})`, opacity: lerp(f, fAnos + 6, fAnos + 16, 0, 1), padding: "12px 38px 14px", borderRadius: 999, background: "rgba(11,20,38,0.92)", border: `4px solid ${PAL.dorado}`, fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 70, color: PAL.dorado, whiteSpace: "nowrap", boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}>
                20 años
              </div>
            ) : null}
          </div>
        ) : null}
      </Camara>
      <Textura />
      <Sfx archivo="aplauso" en={2} volumen={0.1} />
      <Sfx archivo="apagon" en={fRecital + 6} volumen={0.4} />
      <Sfx archivo="expansion" en={fRecital + 22} volumen={0.3} />
      <Sfx archivo="brillo" en={fRecital + 70} volumen={0.16} />
      <Sfx archivo="tabla" en={fVeces} volumen={0.1} />
      <Sfx archivo="cuenta" en={fAnos} volumen={0.2} />
    </AbsoluteFill>
  );
};

// ================= 2. MANILA, 1995: JUAN PABLO II =================
const Mil995: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fPapa = useMomento("Juan", 0.3);
  const fParque = useMomento("parque", 0.52);
  const fMill = useMomento("millones", 0.84);
  const fManila = useMomento("Manila", 0.6);
  const zoom = lerp(f, 40, Math.max(fParque + 10, 120), 0, 1, Easing.inOut(Easing.cubic));
  const s = 1.1 + 0.18 * lerp(f, 0, 40, 0, 1) + zoom * 15;
  const foco: [number, number] = [CENTRO_MAPA[0] + (MANILA_MAPA[0] - CENTRO_MAPA[0]) * zoom, CENTRO_MAPA[1] + (MANILA_MAPA[1] - CENTRO_MAPA[1]) * zoom];
  const aMapa = 1 - lerp(f, fManila - 4, fManila + 14, 0, 1);
  const pin = lerp(f, fPapa - 10, fPapa + 8, 0, 1);
  const camaraT = Math.max(fManila - 2, 140);
  return (
    <AbsoluteFill style={{ background: "#0B1426" }}>
      <Camara tomas={[{ f: 0, x: 540, y: 1080, z: 1.0 }, { f: camaraT, x: 540, y: 1060, z: 1.0 }, { f: duracion, x: 540, y: 930, z: 1.45 }]} vaiven={0.4}>
        <Parque epoca={0} papa={0} saludan={lerp(f, fManila, fManila + 20, 0, 1)} />
      </Camara>
      {aMapa > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: aMapa, filter: zoom > 0.55 ? `blur(${(zoom - 0.55) * 3}px)` : undefined }}>
          <MapaFilipinas s={s} foco={foco} centro={[540, 980]} puntoAp={pin} />
          {zoom < 0.5 ? (
            <div style={{ position: "absolute", left: 0, right: 0, top: 1100 + 0, textAlign: "center", opacity: pin * (1 - zoom * 2), fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 46, letterSpacing: 8, color: "#B99A62" }} />
          ) : null}
        </div>
      ) : null}
      <Contador desde={1995} hasta={1995} f0={0} f1={1} y={230} opacidad={lerp(f, 4, 16, 0, 1)} />
      <Dato texto="Manila, 1995 — 5 millones de personas" aparece={fMill - 4} y={400} tam={40} />
      <Textura />
      <Sfx archivo="whoosh" en={Math.max(36, fPapa)} volumen={0.16} />
      <Sfx archivo="brillo" en={fPapa} volumen={0.14} />
      <Sfx archivo="multitud" en={fManila} volumen={0.2} />
      <Sfx archivo="aplauso" en={fManila + 6} volumen={0.16} />
    </AbsoluteFill>
  );
};

// ================= 3. MANILA, 2015: FRANCISCO EN EL MISMO LUGAR =================
const Dos015: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fFran = useMomento("Francisco", 0.38);
  const fSeis = useMomento("seis", 0.74);
  const epoca = lerp(f, 8, 104, 0, 1);
  const lluvia = lerp(f, 20, 110, 0, 1);
  const poncho = lerp(f, 40, 124, 0, 1);
  const papa = lerp(f, fFran - 16, fFran + 6, 0, 1);
  const des = lerp(f, fSeis - 24, fSeis + 40, 0, 1);
  return (
    <AbsoluteFill style={{ background: "#0B1426" }}>
      <Camara tomas={[{ f: 0, x: 540, y: 930, z: 1.45 }, { f: fFran + 30, x: 540, y: 930, z: 1.45 }, { f: duracion, x: 540, y: 1010, z: 1.06 }]} vaiven={0.4}>
        <Parque epoca={epoca} papa={papa} poncho={poncho} desborde={des} />
      </Camara>
      <Lluvia fuerza={lluvia} />
      <AbsoluteFill style={{ background: "rgba(40,60,100,0.18)", opacity: lluvia, mixBlendMode: "multiply" }} />
      <Contador desde={1995} hasta={2015} f0={10} f1={64} y={230} />
      <Dato texto="2015 — 6 a 7 millones de personas" aparece={fSeis - 4} y={400} tam={40} />
      <Textura />
      <Sfx archivo="lluvia" en={14} volumen={0.22} />
      <Sfx archivo="cuenta" en={14} volumen={0.16} />
      <Sfx archivo="cuenta" en={34} volumen={0.16} />
      <Sfx archivo="cuenta" en={54} volumen={0.16} />
      <Sfx archivo="aplauso" en={fFran} volumen={0.16} />
      <Sfx archivo="multitud" en={fSeis} volumen={0.22} />
    </AbsoluteFill>
  );
};

// ================= 4. MULTIPLICADO POR SETENTA =================
const Estadios: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const fButaca = useMomento("butaca", 0.55);
  const fAhora = useMomento("Ahora", 0.68);
  const fPor = useMomento("por", 0.86);
  const lleno = lerp(f, 34, fButaca, 0.3, 1);
  const pz = lerp(f, 0, fButaca + 6, 0, 1, Easing.out(Easing.cubic));
  const zoom = 3.6 - 2.6 * pz;
  const fx = 540 + 340 * (1 - pz);
  const fy = 960 - 60 * (1 - pz);
  const giro = lerp(f, 0, fButaca, -7, 0, Easing.out(Easing.cubic));
  const enc = lerp(f, fAhora + 6, fAhora + 40, 0, 1, SUAVE);
  const [cx0, cy0] = celda(3, 4);
  const sBig = 1 + (0.12 - 1) * enc;
  const px = 540 + (cx0 - 540) * enc;
  const py = 960 + (cy0 - 960) * enc;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #1B2C58 0%, #0A1230 80%)" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 60 }, (_, i) => (
          <circle key={i} cx={azar(i * 3) * 1080} cy={azar(i * 5) * 1920} r={1 + azar(i) * 2} fill="#FFE7A8" opacity={0.12 + 0.2 * azar(i * 2)} />
        ))}
        <g transform={`translate(540 960) rotate(${giro}) scale(${zoom}) translate(${-fx} ${-fy})`}>
          <g transform={`translate(${px} ${py}) scale(${sBig}) translate(-540 -960)`}>
            <EstadioArriba cx={540} cy={960} rx={500} ry={360} lleno={lleno} />
          </g>
          {enc > 0 ? <Cuadricula f0={fAhora + 22} /> : null}
        </g>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 900, background: "radial-gradient(ellipse at 50% 0%, rgba(255,231,168,0.12), rgba(255,231,168,0) 70%)" }} />
      <Dato texto="× 70 estadios llenos" aparece={fPor - 2} y={250} tam={60} />
      <Textura />
      <Sfx archivo="whoosh" en={0} volumen={0.3} />
      <Sfx archivo="aplauso" en={Math.max(2, fButaca - 20)} volumen={0.16} />
      <Sfx archivo="expansion" en={fAhora + 6} volumen={0.34} />
      <Sfx archivo="brillo" en={fPor + 10} volumen={0.2} />
    </AbsoluteFill>
  );
};

// ================= 5. DOS PAPAS, UN MISMO PEDACITO DE TIERRA =================
const Avatar: React.FC<{ quien: "jp2" | "francisco2"; x: number; y: number; e: number; etiqueta: string }> = ({ quien, x, y, e, etiqueta }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${e})`, opacity: e }}>
    <div style={{ width: 210, height: 210, borderRadius: "50%", overflow: "hidden", border: `6px solid ${PAL.dorado}`, background: quien === "jp2" ? "linear-gradient(180deg,#F7D49A,#E9A267)" : "linear-gradient(180deg,#8EA0B8,#56647A)", position: "relative", boxShadow: "0 14px 30px rgba(0,0,0,0.5)" }}>
      <div style={{ position: "absolute", left: 105, top: -92 }}>
        <Persona quien={quien} ancho={430} mirada={[0, 0]} boca={{ curva: 8 }} semilla={4} />
      </div>
    </div>
    <div style={{ marginTop: 14, textAlign: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 58, color: "#F7F1E3", textShadow: "0 5px 16px rgba(0,0,0,0.7)", letterSpacing: 2 }}>{etiqueta}</div>
  </div>
);

const Mismo: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fMismo = useMomento("mismo", 0.2);
  const fNunca = useMomento("nunca", 0.58);
  const fRecord = useMomento("récord", 0.78);
  const fManila = useMomento("Manila", 0.94);
  const aGrid = 1 - lerp(f, 0, 26, 0, 1);
  const aParque = lerp(f, 6, 30, 0, 1);
  const partido = lerp(f, 22, 42, 0, 1);
  const conv = lerp(f, fMismo - 6, fMismo + 44, 0, 1, SUAVE);
  const dorada = lerp(f, fMismo + 14, fMismo + 64, 0, 1);
  const iconos = lerp(f, fNunca - 14, fNunca + 6, 0, 1) * (1 - lerp(f, fRecord - 8, fRecord, 0, 1));
  const medalla = lerp(f, fRecord - 2, fRecord + 16, 0, 1, Easing.out(Easing.back(1.6)));
  const altar = lerp(f, duracion - 64, duracion - 22, 0, 1, SUAVE);
  const resplandor = 0.5 + 0.5 * Math.sin(f / 7);
  return (
    <AbsoluteFill style={{ background: "#0B1020" }}>
      <Camara tomas={[{ f: 0, x: 540, y: 960, z: 1.0 }, { f: duracion - 70, x: 540, y: 930, z: 1.08 }, { f: duracion, x: 540, y: 1000, z: 1.0 }]} vaiven={0.3}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: aParque * (1 - altar) }}>
          {/* 1995 a la izquierda, 2015 a la derecha; luego convergen en la misma explanada dorada */}
          <ParqueAereo calido={1} luces={1} />
          <div style={{ position: "absolute", left: 540 + 540 * conv, top: 0, width: 540 * (1 - conv), height: 1920, overflow: "hidden", opacity: 1 - dorada }}>
            <div style={{ position: "absolute", left: -540 - 540 * conv, top: 0 }}>
              <ParqueAereo calido={0} lluvia={1} luces={0.9} semilla={9} poncho />
              <div style={{ position: "absolute", inset: 0, background: "rgba(70,120,220,0.3)", mixBlendMode: "soft-light" }} />
              <Lluvia fuerza={0.5} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 537 + 540 * conv, top: 0, width: 6, height: 1920, background: PAL.dorado, opacity: 0.85 * (1 - conv) * partido, boxShadow: "0 0 20px rgba(242,193,78,0.9)" }} />
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            <path d={PARQUE_POLI} fill="none" stroke="#FFE7A8" strokeWidth={8 + 10 * resplandor} opacity={0.35 + 0.4 * dorada} strokeLinejoin="round" />
            {/* un estadio y un recital, diminutos frente al parque */}
            <g opacity={iconos}>
              <g transform="translate(440 790) scale(0.62)">
                <EstadioArriba cx={0} cy={0} rx={60} ry={43} lleno={1} detalle={false} />
              </g>
              <g transform="translate(660 790)">
                <rect x={-34} y={-20} width={68} height={40} rx={5} fill="#1B2A52" stroke="#7DF3FF" strokeWidth={4} />
                <path d="M -20 12 L -8 -10 L 4 12 L 16 -12 L 26 8" stroke="#FF6EC7" strokeWidth={4} fill="none" strokeLinecap="round" />
              </g>
              <text x={440} y={858} textAnchor="middle" fontFamily={FUENTE_TEXTO} fontWeight={800} fontSize={34} fill="#F7F1E3">partido</text>
              <text x={660} y={858} textAnchor="middle" fontFamily={FUENTE_TEXTO} fontWeight={800} fontSize={34} fill="#F7F1E3">recital</text>
            </g>
          </svg>
        </div>
        {aGrid > 0 ? (
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: aGrid }}>
            <rect width={1080} height={1920} fill="#0A1230" opacity={0.0} />
            <Cuadricula f0={0} vivo={false} />
          </svg>
        ) : null}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: altar }}>
          <Explanada />
          <AltarDeEspaldas luz={1} />
        </div>
      </Camara>
      {/* papas: avatares que se acercan hasta quedar juntos sobre la misma explanada */}
      <Avatar quien="jp2" x={270 + 190 * conv} y={330} e={lerp(f, 24, 44, 0, 1, Easing.out(Easing.back(1.5))) * (1 - altar)} etiqueta="1995" />
      <Avatar quien="francisco2" x={810 - 190 * conv} y={330} e={lerp(f, 30, 50, 0, 1, Easing.out(Easing.back(1.5))) * (1 - altar)} etiqueta="2015" />
      {medalla > 0 ? (
        <div style={{ position: "absolute", left: 540, top: 640, transform: `translate(-50%, -50%) scale(${medalla})`, opacity: medalla * (1 - altar), textAlign: "center" }}>
          <svg width={230} height={250} viewBox="-115 -125 230 250" style={{ overflow: "visible", filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.55))" }}>
            <path d="M -40 40 L -64 118 L -30 100 L -12 124 L 6 44 Z" fill="#8E2F33" />
            <path d="M 40 40 L 64 118 L 30 100 L 12 124 L -6 44 Z" fill="#A3242A" />
            <circle r={84} fill="#E3B04B" stroke="#8A6420" strokeWidth={6} />
            <circle r={68} fill="#F2C14E" stroke="#B88A2A" strokeWidth={3} />
            <path d="M 0 -42 L 12 -12 L 44 -10 L 19 10 L 28 40 L 0 22 L -28 40 L -19 10 L -44 -10 L -12 -12 Z" fill="#FFF3CC" stroke="#B88A2A" strokeWidth={3} />
          </svg>
          <div style={{ marginTop: 6, fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 70, color: PAL.dorado, letterSpacing: 3, textShadow: "0 6px 18px rgba(0,0,0,0.7)" }}>RÉCORD</div>
        </div>
      ) : null}
      <Dato texto="Parque Rizal · Manila" aparece={fManila - 6} y={420} tam={44} hasta={duracion - 70} />
      <Textura />
      <Sfx archivo="whoosh" en={fMismo - 2} volumen={0.2} />
      <Sfx archivo="expansion" en={fMismo + 20} volumen={0.2} />
      <Sfx archivo="brillo" en={fRecord} volumen={0.26} />
      <Sfx archivo="brillo" en={duracion - 50} volumen={0.14} />
    </AbsoluteFill>
  );
};

// ================= 6. COMENTAR Y SEGUIR =================
const Cierre: React.FC<PropsEscena> = ({ escena }) => {
  const f = useCurrentFrame();
  const fundir = lerp(f, 26, 78, 0, 1, SUAVE);
  const apertura = lerp(f, 62, 94, 0, 1);
  const titulo = lerp(f, 86, 104, 0, 1, Easing.out(Easing.cubic));
  const lema = lerp(f, 102, 118, 0, 1);
  const luz = lerp(f, 52, 90, 0, 1);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #24395F 0%, #0B1426 70%)" }}>
      {/* la multitud de luces del parque ... */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: 1 - fundir, transform: `scale(${1 + 0.05 * f / 60})`, transformOrigin: "540px 1000px" }}>
        <Explanada />
        <AltarDeEspaldas luz={1 - fundir} />
      </div>
      {/* ... se convierten en un brillo cálido sobre el libro */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: luz }}>
        <defs>
          <radialGradient id="cm-luz" cx="50%" cy="58%" r="45%">
            <stop offset="0%" stopColor="#FFE9B0" stopOpacity={0.85} />
            <stop offset="100%" stopColor="#FFE9B0" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={540} cy={1120} r={760} fill="url(#cm-luz)" />
        {Array.from({ length: 9 }, (_, i) => {
          const a = -150 + i * 15 + Math.sin(f / 30 + i) * 2;
          const r = (a * Math.PI) / 180;
          return <path key={i} d={`M 540 1120 L ${540 + Math.cos(r - 0.04) * 1100} ${1120 + Math.sin(r - 0.04) * 1100} L ${540 + Math.cos(r + 0.04) * 1100} ${1120 + Math.sin(r + 0.04) * 1100} Z`} fill="#FFE9B0" opacity={0.12} />;
        })}
      </svg>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 70 }, (_, i) => {
          const sx = azar(i * 3) * 1300 - 110;
          const sy = 780 + azar(i * 5) * 1100;
          const d = azar(i * 7) * 16;
          const e = Easing.inOut(Easing.cubic)(cl((f - 26 - d) / 44));
          const x = sx + (540 - sx) * e;
          const y = sy + (1150 - sy) * e;
          return <circle key={i} cx={x} cy={y} r={7 - 3 * e} fill="#FFD98A" opacity={(0.9 - 0.9 * cl((e - 0.7) / 0.3)) * (e > 0 ? 1 : 0)} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: 540, top: 1150 + Math.sin(f / 40) * 4, opacity: apertura > 0 ? 1 : 0 }}>
        <LibroAntiguo apertura={apertura} w={330} h={420} tapa={<TapaLibro w={330} h={420} />} izquierda={<Renglones x={40} y={50} ancho={250} n={10} paso={32} />} derecha={<Renglones x={40} y={50} ancho={250} n={10} paso={32} />} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", opacity: titulo, translate: `0px ${(1 - titulo) * 40}px` }}>
        <div style={{ fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 112, lineHeight: 1.0, color: PAL.crema, textShadow: "0 0 40px rgba(242,193,78,0.55), 0 8px 20px rgba(0,0,0,0.5)" }}>
          Versículo
          <br />
          <span style={{ color: PAL.dorado }}>Oculto</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 830, textAlign: "center", opacity: lema, fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 54, whiteSpace: "nowrap", color: PAL.pergamino }}>
        {escena.lema ?? "Comentá AMÉN y seguinos"}
      </div>
      <Textura fuerza={0.7} />
      <Sfx archivo="brillo" en={36} volumen={0.22} />
      <Sfx archivo="pagina" en={64} volumen={0.4} />
      <Sfx archivo="brillo" en={88} volumen={0.3} />
    </AbsoluteFill>
  );
};

export const ESCENAS_MANILA: Record<string, React.FC<{ escena: EscenaAnimada }>> = {
  "manila/apertura": Apertura,
  "manila/1995": Mil995,
  "manila/2015": Dos015,
  "manila/estadios": Estadios,
  "manila/mismo": Mismo,
  "manila/cierre": Cierre,
};
