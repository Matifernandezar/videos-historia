// Escenas del Short "La Biblia que repetís en misa" (Versículo Oculto).
// Reutiliza personajes, escenarios y cámara de los videos anteriores (continuidad del canal).
// No se representa a Dios: en la visión celestial el trono está rodeado de luz, sin figura.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { useEscena } from "../../video/contexto";
import type { EscenaAnimada } from "../../video/tipos";
import { FUENTE_SERIFA, FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { Sfx, useMomento } from "../comun";
import { Persona, type Brazo, type PropsPersona } from "../jesus-12-30/personas";
import { Camara, CalleNazaret, Cielo, Colinas, lerp, PAL, Referencia, Textura } from "../jesus-12-30/escenarios";
import { Cierre as CierreCanal, Fig, manoDe, osc } from "../jesus-12-30/escenas";
import { Frase, Iglesia, mezclarBrazo, useBocaPalabra } from "../amen/escenas";
import { POSES_MISA as P } from "./poses";

type PropsEscena = { escena: EscenaAnimada };

// Tiempos (frame local) de TODAS las veces que se dice una palabra en la escena.
const useMomentos = (palabra: string): number[] => {
  const { palabras } = useEscena();
  return palabras.filter((w) => w.norm.split(" ").includes(palabra)).map((w) => Math.max(0, w.desde - 3));
};

// ---------- nave de la iglesia vista desde el altar (comunidad de frente) ----------
const BANCO_Y = 1290;
const Nave: React.FC<{ luz?: number }> = ({ luz = 0 }) => (
  <>
    <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 3800, background: "linear-gradient(180deg,#1B2A4D 0%,#2C3F66 55%,#3A4A6A 100%)" }} />
    <svg style={{ position: "absolute", left: -200, top: 120 }} width={1480} height={1300}>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${60 + i * 480} 1300 L ${60 + i * 480} 420 Q ${300 + i * 480} 150 ${540 + i * 480} 420 L ${540 + i * 480} 1300`} fill="none" stroke="#5A6A8A" strokeWidth={40} />
      ))}
    </svg>
    {[150, 830].map((x) => (
      <svg key={x} style={{ position: "absolute", left: x, top: 330 }} width={110} height={300}>
        <path d="M 0 300 L 0 55 Q 55 -20 110 55 L 110 300 Z" fill="#F2C98A" opacity={0.75 + 0.25 * luz} />
        <rect x={50} y={20} width={10} height={280} fill="#2A1E14" />
        <rect x={0} y={150} width={110} height={10} fill="#2A1E14" />
      </svg>
    ))}
    {/* puerta del fondo */}
    <svg style={{ position: "absolute", left: 420, top: 640 }} width={240} height={460}>
      <path d="M 0 460 L 0 120 Q 120 0 240 120 L 240 460 Z" fill="#4A3826" />
      <rect x={116} y={70} width={8} height={390} fill="#2A1E14" />
    </svg>
    <div style={{ position: "absolute", left: -900, top: 1100, width: 2900, height: 1600, background: "linear-gradient(180deg,#6A5038,#4A3826)" }} />
  </>
);

const Bancos: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: -200, top: BANCO_Y, width: 1480, height: 34, background: "#8A5A30", borderRadius: 10 }} />
    <div style={{ position: "absolute", left: -200, top: BANCO_Y + 30, width: 1480, height: 500, background: "linear-gradient(180deg,#7A4E2A,#5A3A20)" }} />
    {[60, 360, 660, 960].map((x) => (
      <div key={x} style={{ position: "absolute", left: x, top: BANCO_Y + 60, width: 14, height: 440, background: "#4A2E18" }} />
    ))}
  </>
);

// Comunidad: la fiel al centro y otros dos fieles. `canta` 0..1 abre la boca y junta las manos.
const Comunidad: React.FC<{ f: number; canta?: number; fielProps?: Partial<PropsPersona> }> = ({ f, canta = 0, fielProps = {} }) => {
  const boca = canta > 0 ? (0.25 + 0.35 * osc(f, 7)) * canta : 0;
  const manos = (q: number) => mezclarBrazo(P.reposo.brazoIzq!, P.canta.brazoIzq!, q);
  const manosD = (q: number) => mezclarBrazo(P.reposo.brazoDer!, P.canta.brazoDer!, q);
  return (
    <>
      <Fig quien="fiel2" x={220} suelo={1500} ancho={380} giro={0.2} mirada={[2, -4]} boca={{ apertura: boca * 0.9 }} brazoIzq={manos(canta)} brazoDer={manosD(canta)} semilla={5} />
      <Fig quien="fiel3" x={870} suelo={1510} ancho={370} giro={-0.2} mirada={[-2, -4]} boca={{ apertura: boca }} brazoIzq={manos(canta)} brazoDer={manosD(canta)} semilla={7} />
      <Fig quien="fiel" x={540} suelo={1540} ancho={430} mirada={[0, -3]} boca={{ apertura: boca }} brazoIzq={manos(canta)} brazoDer={manosD(canta)} semilla={2} {...fielProps} />
    </>
  );
};


// ---------- 1. EL SOLDADO QUE NO ESPERABAS ----------
const Soldado: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fRepetis = useMomento("repetis", 0.1);
  const fSoldado = useMomento("soldado", 0.4);
  const fCapaz = useMomento("capaz", 0.65);
  const fEnteraste = useMomento("enteraste", 0.85);
  const responde = f >= fRepetis - 4 && f < fSoldado - 4 ? 0.35 * osc(f, 6) : 0;
  const aparece = lerp(f, fSoldado - 2, fSoldado + 10, 0, 1) * (1 - lerp(f, fEnteraste + 4, duracion - 2, 0, 1));
  const mira = lerp(f, fSoldado + 4, fSoldado + 14, 0, 1);
  const ceja = lerp(f, fCapaz - 4, fCapaz + 6, 0, 1);
  return (
    <AbsoluteFill>
      <Camara tomas={[{ f: 0, x: 540, y: 1000, z: 1.05 }, { f: fSoldado, x: 600, y: 960, z: 1.15 }, { f: duracion, x: 620, y: 960, z: 1.2 }]}>
        <Nave />
        <Comunidad
          f={f}
          fielProps={{
            boca: { apertura: responde, curva: ceja > 0.5 ? 9 : 5 },
            giro: 0.6 * mira,
            mirada: [9 * mira, -4 * mira],
            cejaUna: 14 * ceja,
            cabeza: -3 * ceja,
          }}
        />
        <Bancos />
        {/* medallón con la silueta ilustrada del centurión, junto a la fiel */}
        <div style={{ position: "absolute", left: 830 - 150, top: 780 - 150, width: 300, height: 300, borderRadius: 150, overflow: "hidden", opacity: aparece, scale: String(0.8 + 0.2 * aparece), background: "radial-gradient(circle, rgba(242,193,78,0.25), rgba(11,20,38,0.85))", border: `6px solid ${PAL.dorado}`, boxShadow: "0 0 40px rgba(242,193,78,0.6)" }}>
          <div style={{ filter: "sepia(0.85) saturate(1.3) brightness(1.08) contrast(1.05)" }}>
            <div style={{ position: "absolute", left: 150, top: 22 }}>
              <Persona quien="centurion" corta ancho={360} giro={-0.3} mirada={[-6, 0]} {...P.pecho} semilla={9} />
            </div>
          </div>
        </div>
      </Camara>
      <Textura />
      <Sfx archivo="brillo" en={fSoldado} volumen={0.15} />
      <Sfx archivo="tela" en={fCapaz - 2} volumen={0.2} />
    </AbsoluteFill>
  );
};

// ---------- 2. CORDERO DE DIOS ----------
const Jordan: React.FC = () => (
  <>
    <Cielo tono="dia" />
    <Colinas y={900} colores={["#B9A27A", "#A08A62", "#8C7A55"]} />
    {/* río Jordán con juncos */}
    <div style={{ position: "absolute", left: -900, top: 1180, width: 2900, height: 1500, background: "linear-gradient(180deg,#C2A57A,#9A7F58)" }} />
    <div style={{ position: "absolute", left: -900, top: 1210, width: 2900, height: 120, background: "linear-gradient(180deg,#5E86A8,#3E6688)", borderRadius: "40% 40% 0 0" }} />
    {Array.from({ length: 16 }, (_, i) => (
      <div key={i} style={{ position: "absolute", left: -300 + i * 110, top: 1150 + (i % 3) * 14, width: 8, height: 90 - (i % 4) * 12, background: "#6F7F4E", borderRadius: 4, rotate: `${(i % 2 ? 1 : -1) * 6}deg` }} />
    ))}
  </>
);

const Cordero: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fCordero = useMomento("cordero", 0.05);
  const fMundo = useMomento("mundo", 0.35);
  const fJuan = useMomento("juan", 0.55);
  const fPresento = useMomento("presento", 0.75);
  const enJordan = lerp(f, fMundo - 4, fMundo + 8, 0, 1);
  const enMisa = lerp(f, fPresento - 4, fPresento + 6, 0, 1);
  const textoSube = lerp(f, fMundo - 6, fMundo + 6, 0, 1);
  // Jesús se acerca por la izquierda; Juan lo ve, gira hacia sus discípulos y lo señala
  const jesusX = lerp(f, fMundo, fPresento, -80, 200, Easing.linear);
  const ve = lerp(f, fMundo + 6, fMundo + 14, 0, 1);
  const gira = lerp(f, fJuan - 10, fJuan, 0, 1);
  const senala = lerp(f, fJuan, fJuan + 10, 0, 1, Easing.out(Easing.back(1.4)));
  const bJuan = mezclarBrazo(P.reposo.brazoIzq!, { hombro: 105, codo: -8, mano: "senala" }, senala);
  // sacerdote: presenta la hostia (mismo gesto de "mirá, es Él")
  const bCura: Brazo = { hombro: 22, codo: 112, mano: "puno" };
  const manoCura = manoDe(540, 1500, 420, bCura, 1);
  return (
    <AbsoluteFill>
      {/* iglesia: "Cordero de Dios" junto a la fiel */}
      <AbsoluteFill style={{ opacity: 1 - enJordan }}>
        <Camara tomas={[{ f: 0, x: 620, y: 960, z: 1.2 }, { f: fMundo, x: 600, y: 900, z: 1.3 }]}>
          <Nave />
          <Comunidad f={f} fielProps={{ boca: { apertura: f < fMundo ? 0.3 * osc(f, 6) : 0 }, mirada: [6, -6], giro: 0.3 }} />
          <Bancos />
        </Camara>
      </AbsoluteFill>
      {/* río Jordán */}
      {enJordan > 0 && enMisa < 1 ? (
        <AbsoluteFill style={{ opacity: enJordan * (1 - enMisa) }}>
          <Camara tomas={[{ f: fMundo, x: 600, y: 1000, z: 1.0 }, { f: fJuan, x: 520, y: 1000, z: 1.05 }, { f: fPresento, x: 470, y: 960, z: 1.15 }]}>
            <Jordan />
            <Fig quien="jesus" edad={1} x={jesusX} suelo={1230} ancho={240} caminando={1} paso={f / 22} giro={0.3} mirada={[6, 0]} semilla={1} />
            <Fig quien="oyente1" x={900} suelo={1300} ancho={270} giro={-0.5 + 0.2 * gira} mirada={[-8, 0]} cejas={{ y: -6 * senala }} semilla={4} />
            <Fig quien="oyente3" x={1010} suelo={1330} ancho={260} giro={-0.6} mirada={[-8, 0]} semilla={6} />
            <Fig quien="juan" x={690} suelo={1320} ancho={320} giro={-0.6 * ve + 1.0 * gira * (1 - senala * 0.6)} mirada={[gira > 0.5 && senala < 0.5 ? 9 : -9, 0]} cejas={{ y: -6 * ve }} brazoIzq={bJuan} semilla={3} />
          </Camara>
        </AbsoluteFill>
      ) : null}
      {/* misa: el sacerdote presenta la hostia */}
      {enMisa > 0 ? (
        <AbsoluteFill style={{ opacity: enMisa }}>
          <Camara tomas={[{ f: fPresento, x: manoCura.x, y: manoCura.y, z: 1.8 }, { f: duracion, x: 560, y: 1000, z: 1.2 }]}>
            <Iglesia />
            <Fig quien="sacerdote" x={540} suelo={1500} ancho={420} mirada={[0, 0]} brazoDer={bCura} brazoIzq={{ hombro: 10, codo: -80, mano: "abierta" }} semilla={3} />
            <div style={{ position: "absolute", left: manoCura.x - 34, top: manoCura.y - 76, width: 68, height: 68, borderRadius: 34, background: "radial-gradient(circle at 40% 35%, #FFFFFF, #EDE6D6)", boxShadow: "0 0 30px rgba(255,240,200,0.8)" }} />
          </Camara>
        </AbsoluteFill>
      ) : null}
      {/* "Cordero de Dios": aparece junto a la fiel y se convierte en la transición */}
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 520 - 120 * textoSube,
          translate: "-50% -50%",
          opacity: lerp(f, fCordero - 2, fCordero + 8, 0, 1) * (1 - lerp(f, fJuan - 6, fJuan, 0, 1)),
          scale: String(1 + 0.25 * textoSube),
          fontFamily: FUENTE_SERIFA,
          fontWeight: 700,
          fontSize: 76,
          color: PAL.dorado,
          whiteSpace: "nowrap",
          padding: "10px 34px",
          borderRadius: 999,
          background: "rgba(11,20,38,0.72)",
          textShadow: `0 0 ${20 + 40 * textoSube}px rgba(242,193,78,0.8), 0 6px 18px rgba(0,0,0,0.6)`,
        }}
      >
        Cordero de Dios
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: "radial-gradient(circle at 50% 30%, rgba(255,233,176,0.8), rgba(255,233,176,0) 50%)", opacity: Math.sin(Math.PI * enJordan) * 0.7 }} />
      <Referencia texto="Juan el Bautista · Juan 1:29" aparece={fJuan - 2} hasta={fPresento - 4} />
      <Textura />
      <Sfx archivo="brillo" en={fCordero} volumen={0.15} />
      <Sfx archivo="whoosh" en={fMundo - 4} volumen={0.22} />
      <Sfx archivo="tela" en={fJuan} volumen={0.25} />
      <Sfx archivo="whoosh" en={fPresento - 4} volumen={0.2} />
    </AbsoluteFill>
  );
};

// ---------- 3. SANTO, SANTO, SANTO ----------
// Serafín: ser de luz con seis alas (dos cubren el rostro, dos los pies y dos vuelan; Isaías 6:2).
const Serafin: React.FC<{ x: number; y: number; escala?: number; espejo?: boolean; fase?: number }> = ({ x, y, escala = 1, espejo = false, fase = 0 }) => {
  const f = useCurrentFrame();
  const aleteo = Math.sin(f / 7 + fase) * 10;
  const ala = (rot: number, largo: number, ancho: number, key: string) => (
    <ellipse key={key} cx={0} cy={-largo / 2} rx={ancho} ry={largo / 2} fill="url(#ala)" transform={`rotate(${rot})`} />
  );
  return (
    <svg style={{ position: "absolute", left: x - 220 * escala, top: y - 260 * escala, overflow: "visible" }} width={440 * escala} height={520 * escala} viewBox="-220 -260 440 520">
      <defs>
        <linearGradient id="ala" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#F2C14E" stopOpacity={0.95} />
          <stop offset="100%" stopColor="#FFF4D6" stopOpacity={0.9} />
        </linearGradient>
        <radialGradient id="aura">
          <stop offset="0%" stopColor="#FFF4D6" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#FFF4D6" stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform={espejo ? "scale(-1 1)" : undefined}>
        <circle cx={0} cy={0} r={230} fill="url(#aura)" opacity={0.5} />
        {/* alas que vuelan */}
        <g transform={`translate(0 -10) rotate(${-aleteo})`}>{ala(-70, 220, 46, "a1")}</g>
        <g transform={`translate(0 -10) rotate(${aleteo})`}>{ala(70, 220, 46, "a2")}</g>
        {/* alas que cubren los pies */}
        {ala(160, 150, 36, "b1")}
        {ala(-160, 150, 36, "b2")}
        {/* cuerpo de luz */}
        <ellipse cx={0} cy={30} rx={38} ry={90} fill="#FFF4D6" />
        {/* alas que cubren el rostro */}
        {ala(-28, 130, 32, "c1")}
        {ala(28, 130, 32, "c2")}
      </g>
    </svg>
  );
};

const Cielo3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {/* el cielo está "encima" de la iglesia: la cámara sube y baja por el mismo mundo */}
      <div style={{ position: "absolute", left: -900, top: -3000, width: 2900, height: 2900, background: "linear-gradient(180deg,#0B1426 0%,#24395F 35%,#8C6A3A 75%,#1B2A4D 100%)" }} />
      {/* columna de luz que une la iglesia con la visión */}
      <div style={{ position: "absolute", left: 380, top: -1800, width: 320, height: 2400, background: "linear-gradient(180deg, rgba(255,233,176,0.0), rgba(255,233,176,0.35) 40%, rgba(255,233,176,0.25) 80%, rgba(255,233,176,0))" }} />
      {/* nubes */}
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: -300 + ((i * 173) % 1500) + Math.sin(f / 60 + i) * 12,
            top: -1350 + (i % 4) * 110,
            width: 520 + (i % 3) * 120,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(ellipse at 50% 50%, rgba(247,241,227,0.45) 0%, rgba(247,241,227,0.18) 45%, rgba(247,241,227,0) 72%)",
          }}
        />
      ))}
      {/* arco como de esmeralda alrededor del trono (Apocalipsis 4:3) */}
      <svg style={{ position: "absolute", left: 140, top: -2200, overflow: "visible" }} width={800} height={800}>
        <path d="M 40 640 A 360 360 0 0 1 760 640" stroke="#6FBF8E" strokeWidth={26} fill="none" opacity={0.55} />
        <path d="M 80 640 A 320 320 0 0 1 720 640" stroke="#F2C14E" strokeWidth={10} fill="none" opacity={0.5} />
      </svg>
      {/* trono rodeado de luz (sin figura) */}
      <div style={{ position: "absolute", left: 540 - 420, top: -1960 - 420, width: 840, height: 840, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,246,220,1) 0%, rgba(255,233,176,0.7) 25%, rgba(255,233,176,0) 65%)", opacity: 0.85 + 0.15 * Math.sin(f / 20) }} />
      <svg style={{ position: "absolute", left: 540 - 170, top: -2080 }} width={340} height={400}>
        <path d="M 50 380 L 50 120 Q 50 40 170 30 Q 290 40 290 120 L 290 380 Z" fill="#C8922E" />
        <path d="M 80 380 L 80 140 Q 80 80 170 72 Q 260 80 260 140 L 260 380 Z" fill="#F2C14E" />
        <rect x={20} y={300} width={300} height={40} rx={10} fill="#E8B84A" />
        <rect x={0} y={340} width={340} height={40} rx={10} fill="#C8922E" />
      </svg>
      {/* mar como de vidrio (Apocalipsis 4:6) */}
      <div style={{ position: "absolute", left: -200, top: -1680, width: 1480, height: 120, background: "linear-gradient(180deg, rgba(200,230,255,0.5), rgba(200,230,255,0.1))", borderRadius: "50%" }} />
      {/* serafines orientados hacia el trono */}
      <Serafin x={190} y={-2060} escala={0.9} fase={0} />
      <Serafin x={890} y={-2060} escala={0.9} espejo fase={1.5} />
      <Serafin x={250} y={-1700} escala={0.7} fase={0.8} />
      <Serafin x={830} y={-1700} escala={0.7} espejo fase={2.2} />
    </>
  );
};

const Santo: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const santos = useMomentos("santo");
  const fVisiones = useMomento("visiones", 0.25);
  const fSeres = useMomento("seres", 0.4);
  const fTrono = useMomento("trono", 0.55);
  const fCantarlo = useMomento("cantarlo", 0.68);
  const fAlabanza = useMomento("alabanza", 0.92);
  const s = [santos[0] ?? 2, santos[1] ?? 14, santos[2] ?? 26];
  // la cámara sube con la luz, entra en la visión y vuelve a bajar a la comunidad que canta
  const tomas = [
    { f: 0, x: 540, y: 1000, z: 1.0 },
    { f: s[2] + 6, x: 540, y: 200, z: 0.95 },
    { f: fVisiones + 4, x: 540, y: -1350, z: 0.95 },
    { f: fSeres, x: 540, y: -1800, z: 0.9 },
    { f: fTrono + 6, x: 540, y: -1900, z: 1.05 },
    { f: fCantarlo - 6, x: 540, y: -1800, z: 1.0 },
    { f: fCantarlo + 22, x: 540, y: 1050, z: 1.05 },
    { f: duracion, x: 540, y: 1080, z: 1.12 },
  ];
  const canta = lerp(f, fCantarlo + 10, fCantarlo + 22, 0, 1);
  return (
    <AbsoluteFill>
      <Camara tomas={tomas} vaiven={0.6}>
        <Cielo3 />
        <Nave luz={1} />
        <Comunidad f={f} canta={canta} fielProps={{ ojos: canta > 0 ? 0.8 : 1 }} />
        <Bancos />
        {/* luz del vitral que sube hacia la visión */}
        <div style={{ position: "absolute", left: 380, top: -200, width: 320, height: 1400, background: "linear-gradient(0deg, rgba(255,233,176,0), rgba(255,233,176,0.35))", opacity: 0.6 + 0.4 * lerp(f, fAlabanza - 10, fAlabanza + 10, 0, 1) }} />
      </Camara>
      {/* Santo, santo, santo: aparecen con cada palabra */}
      {s.map((t, i) => {
        const e = lerp(f, t, t + 8, 0, 1, Easing.out(Easing.back(1.8)));
        const sale = lerp(f, fVisiones - 4, fVisiones + 6, 0, 1);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540,
              top: 520 + i * 150,
              translate: "-50% -50%",
              scale: String(0.6 + 0.4 * e),
              opacity: Math.min(1, e * 1.5) * (1 - sale),
              fontFamily: FUENTE_SERIFA,
              fontWeight: 700,
              fontSize: 110,
              color: PAL.dorado,
              textShadow: "0 0 36px rgba(242,193,78,0.85), 0 6px 18px rgba(0,0,0,0.5)",
            }}
          >
            {i === 0 ? "Santo" : "santo"}
          </div>
        );
      })}
      <Referencia texto="Isaías 6:3 · Apocalipsis 4:8" aparece={fSeres - 4} hasta={fCantarlo} />
      <Textura />
      <Sfx archivo="coro" en={s[0]} volumen={0.12} />
      <Sfx archivo="brillo" en={s[0]} volumen={0.12} />
      <Sfx archivo="whoosh" en={fCantarlo - 2} volumen={0.18} />
    </AbsoluteFill>
  );
};

// ---------- 4. LA CONFIANZA DEL CENTURIÓN ----------
// Criado enfermo acostado. La figura se gira -90°: con el contenedor en (L, T), la cabeza queda a la
// izquierda (centro ≈ L + 147, T) y el cuerpo se extiende hacia la derecha hasta ≈ L + 770, centrado en y = T.
const CRIADO = { L: 150, T: 1150, ancho: 420 };
const Criado: React.FC<{ f: number }> = ({ f }) => {
  const { L, T, ancho } = CRIADO;
  const k = ancho / 600;
  const respira = Math.sin(f / 22) * 3;
  return (
    <>
      <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 3800, background: "linear-gradient(180deg,#3A2E28 0%,#5A4636 60%,#4A3826 100%)" }} />
      {/* ventanita con luz tenue que cae sobre él */}
      <div style={{ position: "absolute", left: 760, top: 520, width: 150, height: 120, background: "#E8C98A", opacity: 0.7, borderRadius: 8 }} />
      <div style={{ position: "absolute", left: 300, top: 600, width: 700, height: 700, background: "linear-gradient(200deg, rgba(232,201,138,0.22), rgba(232,201,138,0) 65%)" }} />
      <div style={{ position: "absolute", left: -900, top: T + 110, width: 2900, height: 1500, background: "#5A4232" }} />
      {/* estera debajo del cuerpo */}
      <div style={{ position: "absolute", left: L - 50, top: T + 40, width: 900, height: 90, borderRadius: 18, background: "#B49A6C", boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }} />
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: L - 30 + i * 88, top: T + 48, width: 4, height: 74, background: "#9A8058" }} />
      ))}
      {/* almohada bajo la cabeza */}
      <div style={{ position: "absolute", left: L - 10, top: T - 10, width: 250, height: 90, borderRadius: 45, background: "#E6DCC6" }} />
      {/* el criado (figura girada) */}
      <div style={{ position: "absolute", left: L, top: T, rotate: "-90deg", transformOrigin: "0 0" }}>
        <Persona quien="criado" ancho={ancho} ojos={0} cejas={{ y: 2, rot: 10 }} boca={{ curva: -3 }} brazoIzq={{ hombro: 6, codo: -10 }} brazoDer={{ hombro: 6, codo: -10 }} semilla={8} />
      </div>
      {/* manta que tapa el cuerpo desde el pecho hasta los pies (respira apenas) */}
      <svg style={{ position: "absolute", left: L + 330 * k + 60, top: T - 130 * k - respira, overflow: "visible" }} width={10} height={10}>
        <path d={`M 0 ${20} Q 10 -4 60 0 L ${560} 6 Q ${600} 10 ${598} ${60} L ${598} ${260 * k + 40} Q ${300} ${270 * k + 52} 0 ${260 * k + 40} Z`} fill="#8C6A4A" />
        <path d={`M 0 ${20} Q 10 -4 60 0 L ${560} 6 Q 600 10 598 40 L 0 40 Z`} fill="#A07E5C" />
        {[160, 300, 440].map((x) => (
          <path key={x} d={`M ${x} 50 Q ${x + 20} ${130 * k + 40} ${x - 10} ${250 * k + 30}`} stroke="#6E5236" strokeWidth={5} fill="none" opacity={0.6} />
        ))}
      </svg>
      {/* cuenco de agua y paño junto a la estera */}
      <div style={{ position: "absolute", left: L + 760, top: T + 150, width: 90, height: 40, borderRadius: "0 0 45px 45px", background: "#9A6A3E" }} />
      <div style={{ position: "absolute", left: L + 640, top: T + 160, width: 90, height: 26, borderRadius: 8, background: "#E6DCC6" }} />
    </>
  );
};

const JESUS_C = { x: 300, suelo: 1440, ancho: 330 };
const CENT = { x: 760, suelo: 1460, ancho: 360 };
const Centurion: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fDigno = useMomento("digno", 0.12);
  const fRecuerda = useMomento("recuerda", 0.3);
  const fCriado = useMomento("criado", 0.42);
  const fConfiaba = useMomento("confiaba", 0.55);
  const fPalabra = useMomento("palabra", 0.8);
  const enCalle = lerp(f, fRecuerda - 4, fRecuerda + 8, 0, 1);
  const enCuarto = lerp(f, fCriado - 2, fCriado + 1, 0, 1) * (1 - lerp(f, fConfiaba - 2, fConfiaba + 1, 0, 1));
  const sereno = lerp(f, fConfiaba + 4, fConfiaba + 20, 0, 1);
  const bCent = (lado: "Izq" | "Der") => mezclarBrazo(P.ruega[`brazo${lado}`]!, P.pecho[`brazo${lado}`]!, sereno);
  const pecho = lerp(f, fDigno - 6, fDigno + 6, 0, 1);
  return (
    <AbsoluteFill>
      {/* la fiel, en misa, con la mano en el pecho: "no soy digno" */}
      <AbsoluteFill style={{ opacity: 1 - enCalle }}>
        <Camara tomas={[{ f: 0, x: 540, y: 900, z: 1.4 }, { f: fRecuerda, x: 560, y: 920, z: 1.6 }]}>
          <Nave />
          <Comunidad f={f} fielProps={{ ojos: 1 - 0.6 * pecho, cabeza: 4 * pecho, brazoDer: mezclarBrazo(P.reposo.brazoDer!, P.pecho.brazoDer!, pecho), brazoIzq: P.reposo.brazoIzq, boca: { apertura: f < fRecuerda ? 0.3 * osc(f, 6) : 0 } }} />
          <Bancos />
        </Camara>
      </AbsoluteFill>
      {/* Cafarnaúm: el centurión pide por su criado; Jesús escucha */}
      {enCalle > 0 ? (
        <AbsoluteFill style={{ opacity: enCalle }}>
          <Camara
            tomas={[
              { f: fRecuerda, x: CENT.x - 40, y: 980, z: 1.5 },
              { f: fCriado - 4, x: 540, y: 1000, z: 1.05 },
              { f: fConfiaba, x: 540, y: 1000, z: 1.05 },
              { f: fConfiaba + 14, x: CENT.x - 10, y: 820, z: 1.9 },
              { f: fPalabra, x: CENT.x - 20, y: 840, z: 1.8 },
              { f: duracion, x: CENT.x - 30, y: 860, z: 1.9 },
            ]}
          >
            <CalleNazaret />
            <Fig quien="jesus" edad={1} x={JESUS_C.x} suelo={JESUS_C.suelo} ancho={JESUS_C.ancho} giro={0.5} mirada={[8, 0]} cabeza={f > fPalabra ? Math.sin((f - fPalabra) / 8) * 3 : 2} brazoIzq={P.escucha.brazoIzq} brazoDer={P.escucha.brazoDer} semilla={1} />
            <Fig
              quien="centurion"
              corta
              x={CENT.x}
              suelo={CENT.suelo}
              ancho={CENT.ancho}
              giro={-0.5}
              mirada={[-8, sereno > 0.5 ? 2 : 0]}
              cejas={{ y: -4 * (1 - sereno), rot: 12 * (1 - sereno) }}
              boca={{ curva: -3 + 11 * sereno, apertura: sereno < 0.3 && f < fCriado ? 0.25 * osc(f, 7) : 0 }}
              ojos={1 - 0.35 * sereno}
              brazoIzq={bCent("Izq")}
              brazoDer={bCent("Der")}
              semilla={3}
            />
          </Camara>
        </AbsoluteFill>
      ) : null}
      {/* el criado enfermo en su habitación */}
      {enCuarto > 0 ? (
        <AbsoluteFill style={{ opacity: enCuarto }}>
          <Camara tomas={[{ f: fCriado, x: 540, y: 1060, z: 1.05 }, { f: fConfiaba, x: 520, y: 1080, z: 1.15 }]}>
            <Criado f={f} />
          </Camara>
        </AbsoluteFill>
      ) : null}
      <Referencia texto="Mateo 8:5–13 · Lucas 7:1–10" aparece={fRecuerda + 4} />
      <Textura />
      <Sfx archivo="tela" en={fDigno - 4} volumen={0.2} />
      <Sfx archivo="whoosh" en={fRecuerda - 4} volumen={0.2} />
      <Sfx archivo="whoosh" en={fCriado - 2} volumen={0.15} />
      <Sfx archivo="whoosh" en={fConfiaba - 4} volumen={0.15} />
    </AbsoluteFill>
  );
};

// ---------- 5. DEL CRIADO AL ALMA ----------
const CURA5 = { x: 380, suelo: 1460, ancho: 360 };
const FIEL5 = { x: 760, suelo: 1470, ancho: 350 };
const Alma: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fAdapta = useMomento("adapta", 0.15);
  const fComulgar = useMomento("comulgar", 0.45);
  const fPalabra = useMomento("palabra", 0.6);
  const fAlma = useMomento("alma", 0.85);
  const bocaFiel = useBocaPalabra("alma", 0.85);
  const deCent = lerp(f, 4, 14, 0, 1); // el gesto del centurión pasa a la fiel
  const abre = lerp(f, fComulgar - 4, fComulgar + 16, 0, 1);
  const recibe = lerp(f, fPalabra, fPalabra + 16, 0, 1);
  const bCura = mezclarBrazo({ hombro: 10, codo: -60 }, { hombro: 25, codo: 95, mano: "puno" }, abre);
  const manoCura = manoDe(CURA5.x, CURA5.suelo, CURA5.ancho, bCura, 1);
  const bFielD = mezclarBrazo(P.pecho.brazoDer!, { hombro: 8, codo: -95, mano: "abierta" }, recibe);
  const bFielI = mezclarBrazo(P.pecho.brazoIzq!, { hombro: 8, codo: -100, mano: "abierta" }, recibe);
  const criadoTachado = lerp(f, fComulgar - 6, fComulgar + 4, 0, 1);
  return (
    <AbsoluteFill>
      {/* el centurión (mano en el pecho) se funde con la fiel que hace el mismo gesto */}
      <AbsoluteFill style={{ opacity: 1 - deCent }}>
        <Camara tomas={[{ f: 0, x: 730, y: 860, z: 1.9 }]}>
          <CalleNazaret />
          <Fig quien="centurion" corta x={760} suelo={1460} ancho={360} giro={-0.5} mirada={[-8, 2]} boca={{ curva: 8 }} ojos={0.65} {...P.pecho} semilla={3} />
        </Camara>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: deCent }}>
        <Camara tomas={[{ f: 0, x: FIEL5.x - 20, y: 900, z: 1.9 }, { f: fComulgar - 4, x: FIEL5.x - 40, y: 920, z: 1.7 }, { f: fComulgar + 16, x: 580, y: 1000, z: 1.15 }, { f: duracion, x: 600, y: 980, z: 1.2 }]}>
          <Iglesia />
          <Fig quien="sacerdote" x={CURA5.x} suelo={CURA5.suelo} ancho={CURA5.ancho} giro={0.6} mirada={[8, -2]} brazoDer={bCura} brazoIzq={{ hombro: 8, codo: -60, mano: "abierta" }} semilla={3} />
          <Fig
            quien="fiel"
            x={FIEL5.x}
            suelo={FIEL5.suelo}
            ancho={FIEL5.ancho}
            giro={-0.6}
            mirada={[-8, recibe > 0.5 ? 4 : 0]}
            ojos={recibe > 0.5 ? 0.75 : 0.55}
            cabeza={4}
            boca={{ apertura: bocaFiel, curva: 6 + 3 * recibe }}
            brazoIzq={bFielI}
            brazoDer={bFielD}
            semilla={2}
          />
          <div style={{ position: "absolute", left: manoCura.x - 30 + 20, top: manoCura.y - 64, width: 60, height: 60, borderRadius: 30, background: "radial-gradient(circle at 40% 35%, #FFFFFF, #EDE6D6)", boxShadow: "0 0 24px rgba(255,240,200,0.7)", opacity: abre }} />
        </Camara>
      </AbsoluteFill>
      {/* Mi criado → Mi alma */}
      <div style={{ position: "absolute", left: 540, top: 430, translate: "-50% -50%", opacity: lerp(f, fAdapta - 2, fAdapta + 8, 0, 1) * (1 - lerp(f, duracion - 18, duracion - 8, 0, 1)) }}>
        <div style={{ position: "relative", padding: "14px 34px", borderRadius: 999, background: "rgba(247,241,227,0.95)", color: PAL.tinta, fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 56, opacity: 1 - 0.45 * criadoTachado, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
          «Mi criado»
          <div style={{ position: "absolute", left: 24, right: 24, top: "52%", height: 6, background: PAL.coral, transformOrigin: "0 50%", scale: `${criadoTachado} 1` }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 540, top: 525, translate: "-50% -50%", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 64, color: PAL.dorado, opacity: lerp(f, fComulgar - 4, fComulgar + 4, 0, 1) * (1 - lerp(f, duracion - 18, duracion - 8, 0, 1)), textShadow: "0 4px 12px rgba(0,0,0,0.6)" }}>↓</div>
      <Frase texto="«Mi alma»" x={540} y={620} aparece={fComulgar + 2} hasta={duracion - 18} tam={64} acento />
      <Textura />
      <Sfx archivo="tela" en={2} volumen={0.2} />
      <Sfx archivo="marca" en={fComulgar - 4} volumen={0.2} />
      <Sfx archivo="brillo" en={fAlma} volumen={0.15} />
    </AbsoluteFill>
  );
};

// ---------- 6. CIERRE ----------
const Cierre: React.FC<PropsEscena> = (p) => <CierreCanal {...p} />;

export const ESCENAS_MISA: Record<string, React.FC<{ escena: EscenaAnimada }>> = {
  "misa/soldado": Soldado,
  "misa/cordero": Cordero,
  "misa/santo": Santo,
  "misa/centurion": Centurion,
  "misa/alma": Alma,
  "misa/cierre": Cierre,
};


