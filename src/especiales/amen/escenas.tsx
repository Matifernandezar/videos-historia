// Escenas del Short "¿Qué decís cuando decís amén?" (Versículo Oculto).
// Reutiliza personajes, escenarios y cámara de jesus-12-30 para mantener la continuidad del canal.
// Cada acción se engancha a una palabra de la narración real (useMomento).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { useEscena } from "../../video/contexto";
import type { EscenaAnimada } from "../../video/tipos";
import { FUENTE_HEBREO, FUENTE_SERIFA, FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { Sfx, useFinDePalabra, useMomento } from "../comun";
import type { Brazo, Quien } from "../jesus-12-30/personas";
import { Camara, Cielo, CLAMP, Colinas, JerusalenLejos, lerp, PAL, Referencia, Rollo, Textura } from "../jesus-12-30/escenarios";
import { Cierre as CierreCanal, Fig, manoDe, osc } from "../jesus-12-30/escenas";
import { POSES } from "./poses";

type PropsEscena = { escena: EscenaAnimada };

// Mezcla dos poses de brazo (t = 0 → a, t = 1 → b).
export const mezclarBrazo = (a: Brazo, b: Brazo, t: number): Brazo => ({
  hombro: a.hombro + (b.hombro - a.hombro) * t,
  codo: a.codo + (b.codo - a.codo) * t,
  mano: t < 0.5 ? a.mano : b.mano,
});

// Boca que se mueve solo mientras se dice una palabra (el personaje la pronuncia).
export const useBocaPalabra = (palabra: string, fraccion: number) => {
  const f = useCurrentFrame();
  const desde = useMomento(palabra, fraccion);
  const hasta = useFinDePalabra(palabra, fraccion);
  return f >= desde && f <= hasta + 2 ? 0.55 * osc(f, 5) : 0;
};

// Palabra "AMÉN" dorada (tarjeta que aparece con un pequeño rebote).
const PalabraAmen: React.FC<{ x: number; y: number; aparece: number; tam?: number; opacidad?: number; serifa?: boolean; brillo?: number }> = ({
  x,
  y,
  aparece,
  tam = 120,
  opacidad = 1,
  serifa = false,
  brillo = 0.5,
}) => {
  const f = useCurrentFrame();
  const e = lerp(f, aparece, aparece + 10, 0, 1, Easing.out(Easing.back(2)));
  if (e <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -50%",
        scale: String(0.6 + 0.4 * e),
        opacity: Math.min(1, e * 1.4) * opacidad,
        fontFamily: serifa ? FUENTE_SERIFA : FUENTE_TITULO,
        fontWeight: serifa ? 700 : 900,
        fontSize: tam,
        letterSpacing: tam * 0.06,
        color: PAL.dorado,
        textShadow: `0 0 ${30 * brillo}px rgba(242,193,78,${0.7 * brillo}), 0 6px 18px rgba(0,0,0,0.5)`,
        whiteSpace: "nowrap",
      }}
    >
      AMÉN
    </div>
  );
};

// Cartel discreto con una frase (pergamino claro).
export const Frase: React.FC<{ texto: React.ReactNode; x: number; y: number; aparece: number; hasta?: number; tam?: number; acento?: boolean }> = ({ texto, x, y, aparece, hasta = 99999, tam = 50, acento = false }) => {
  const f = useCurrentFrame();
  const e = lerp(f, aparece, aparece + 9, 0, 1, Easing.out(Easing.back(1.6)));
  const o = Math.min(1, e * 1.5) * (1 - lerp(f, hasta, hasta + 8, 0, 1));
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -50%",
        scale: String(0.85 + 0.15 * e),
        opacity: o,
        padding: `${tam * 0.32}px ${tam * 0.6}px`,
        borderRadius: tam * 0.5,
        background: acento ? `linear-gradient(180deg, ${PAL.dorado}, ${PAL.doradoOscuro})` : "rgba(247,241,227,0.95)",
        color: PAL.tinta,
        fontFamily: FUENTE_TEXTO,
        fontWeight: 800,
        fontSize: tam,
        whiteSpace: "nowrap",
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
      }}
    >
      {texto}
    </div>
  );
};

// ---------- habitación (escenas 1 y 6: mismo lugar, misma ropa) ----------
const HAB = { x: 540, suelo: 1390, ancho: 520 };
const CABEZA_FIEL: [number, number] = [HAB.x, HAB.suelo - (922 / 600) * HAB.ancho + (210 / 600) * HAB.ancho]; // (540, 773)

const Habitacion: React.FC<{ luz?: number }> = ({ luz = 0 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 3800, background: "linear-gradient(180deg,#172848 0%,#22385E 55%,#2A3550 100%)" }} />
      {/* ventana de noche con luna */}
      <svg style={{ position: "absolute", left: 90, top: 300 }} width={300} height={380}>
        <rect x={0} y={0} width={300} height={380} rx={14} fill="#0E1A33" />
        <circle cx={210} cy={110} r={44} fill="#F3E6C6" />
        <circle cx={226} cy={100} r={40} fill="#0E1A33" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={30 + ((i * 53) % 240)} cy={40 + ((i * 71) % 280)} r={3} fill="#F7F1E3" opacity={0.4 + 0.5 * Math.abs(Math.sin(f / 13 + i))} />
        ))}
        <rect x={142} y={0} width={16} height={380} fill="#5E452E" />
        <rect x={0} y={182} width={300} height={16} fill="#5E452E" />
        <rect x={-6} y={-6} width={312} height={392} rx={16} fill="none" stroke="#7A5A3A" strokeWidth={14} />
      </svg>
      {/* cruz de madera sencilla en la pared */}
      <svg style={{ position: "absolute", left: 512, top: 330 }} width={56} height={120}>
        <rect x={22} y={0} width={12} height={120} rx={3} fill="#8C6A42" />
        <rect x={0} y={30} width={56} height={12} rx={3} fill="#8C6A42" />
      </svg>
      {/* lámpara con luz cálida */}
      <div style={{ position: "absolute", left: 995 - 500, top: 560 - 500, width: 1000, height: 1000, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,214,140,0.42) 0%, rgba(255,214,140,0) 60%)", opacity: 0.75 + 0.25 * luz }} />
      <svg style={{ position: "absolute", left: 930, top: 500 }} width={130} height={560}>
        <path d="M 10 70 L 120 70 L 96 0 L 34 0 Z" fill="#F2C98A" />
        <rect x={60} y={70} width={10} height={420} fill="#5E452E" />
        <rect x={20} y={490} width={90} height={22} rx={8} fill="#5E452E" />
      </svg>
      {/* cama donde está sentada */}
      <div style={{ position: "absolute", left: 120, top: 1180, width: 860, height: 260, borderRadius: 30, background: "linear-gradient(180deg,#E9DCC0,#CDBB98)" }} />
      <div style={{ position: "absolute", left: 120, top: 1300, width: 860, height: 140, borderRadius: "0 0 30px 30px", background: "#4D6A8E" }} />
      <div style={{ position: "absolute", left: -900, top: 1440, width: 2900, height: 1300, background: "linear-gradient(180deg,#5A4632,#3E3022)" }} />
    </>
  );
};

// ---------- 1. EL AMÉN AUTOMÁTICO ----------
const Automatico: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fAmen = useMomento("amen", 0.1);
  const fPero = useMomento("pero", 0.45);
  const fAcabas = useMomento("acabas", 0.6);
  const fSi = useMomento("si", 0.85);
  const bocaAmen = useBocaPalabra("amen", 0.1);
  const abre = lerp(f, fPero - 2, fPero + 6, 0, 1);
  const piensa = lerp(f, fAcabas - 4, fAcabas + 10, 0, 1);
  const mira = lerp(f, fSi, fSi + 10, 0, 1);
  const PAL_X = 730;
  const PAL_Y = 500;
  const bIzq = mezclarBrazo(POSES.rezar.brazoIzq!, POSES.pensar.brazoIzq!, piensa);
  const bDer = mezclarBrazo(POSES.rezar.brazoDer!, POSES.pensar.brazoDer!, piensa);
  return (
    <AbsoluteFill>
      <Camara
        tomas={[
          { f: 0, x: 540, y: 900, z: 1.05 },
          { f: fAcabas, x: 560, y: 860, z: 1.15 },
          { f: Math.max(fSi + 4, duracion - 18), x: 620, y: 780, z: 1.2 },
          { f: duracion, x: PAL_X, y: PAL_Y, z: 2.0 },
        ]}
      >
        <Habitacion />
        <Fig
          quien="fiel"
          sentado
          x={HAB.x}
          suelo={HAB.suelo}
          ancho={HAB.ancho}
          ojos={abre}
          cejaUna={14 * piensa}
          cabeza={-4 * piensa + 4 * (1 - abre)}
          giro={0.5 * mira}
          mirada={mira > 0 ? [9 * mira, -9 * mira] : [0, 0]}
          boca={{ apertura: bocaAmen, curva: piensa > 0.5 ? 2 : 6 }}
          brazoIzq={bIzq}
          brazoDer={bDer}
          semilla={2}
        />
        <PalabraAmen x={PAL_X} y={PAL_Y} aparece={fAmen + 2} tam={110} />
      </Camara>
      <Textura />
      <Sfx archivo="brillo" en={fAmen + 2} volumen={0.15} />
      <Sfx archivo="tela" en={fAcabas - 2} volumen={0.25} />
      <Sfx archivo="whoosh" en={duracion - 16} volumen={0.18} />
    </AbsoluteFill>
  );
};

// ---------- 2. UNA PALABRA ANTIGUA ----------
const Antigua: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const fMiles = useMomento("miles", 0.12);
  const fHebreo = useMomento("hebreo", 0.3);
  const fAsiEs = useMomento("asi es", 0.45);
  const fVerdad = useMomento("verdad", 0.52);
  const fSea = useMomento("que asi sea", 0.6);
  const fFirmeza = useMomento("firmeza", 0.82);
  const fConfianza = useMomento("confianza", 0.92);
  const envejece = lerp(f, fMiles - 4, fMiles + 18, 0, 1);
  const base = lerp(f, fFirmeza - 6, fFirmeza + 8, 0, 1, Easing.out(Easing.cubic));
  // las letras bajan y se apoyan en la base (rebote suave)
  const apoyo = interpolate(f, [fFirmeza + 6, fFirmeza + 14, fFirmeza + 18, fFirmeza + 22], [0, 1, 0.92, 1], { ...CLAMP });
  const brillo = lerp(f, fConfianza - 2, fConfianza + 12, 0, 1);
  const salenFrases = lerp(f, fFirmeza - 8, fFirmeza, 0, 1);
  const Y_AMEN = 600;
  return (
    <AbsoluteFill style={{ background: PAL.noche }}>
      <Camara tomas={[{ f: 0, x: 540, y: 820, z: 1.0 }, { f: fFirmeza, x: 540, y: 820, z: 1.04 }, { f: fFirmeza + 20, x: 540, y: 760, z: 1.1 }]}>
        <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 3800, background: "radial-gradient(ellipse at 50% 45%, #24395F 0%, #0B1426 70%)" }} />
        {/* hoja actual (cuaderno) → pergamino antiguo */}
        <div style={{ position: "absolute", left: 80, top: 260, width: 920, height: 1060, rotate: `${-1.5 + envejece * 1.5}deg` }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: "#FBFBF7", boxShadow: "0 20px 50px rgba(0,0,0,0.45)", opacity: 1 - envejece }}>
            <svg width={920} height={1060}>
              {Array.from({ length: 22 }, (_, i) => (
                <line key={i} x1={0} y1={90 + i * 44} x2={920} y2={90 + i * 44} stroke="#9EC1E6" strokeWidth={2} />
              ))}
              <line x1={110} y1={0} x2={110} y2={1060} stroke="#E79A9A" strokeWidth={3} />
            </svg>
          </div>
          <svg width={920} height={1060} style={{ position: "absolute", inset: 0, opacity: envejece, filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))" }}>
            <defs>
              <radialGradient id="perg-amen" cx="50%" cy="45%" r="75%">
                <stop offset="0%" stopColor="#F3E6C6" />
                <stop offset="80%" stopColor="#E2CD9E" />
                <stop offset="100%" stopColor="#B99760" />
              </radialGradient>
            </defs>
            <path d="M 24 14 Q 460 40 896 8 Q 916 530 902 1050 Q 460 1030 16 1052 Q 4 530 24 14 Z" fill="url(#perg-amen)" />
            {[120, 980].map((y) => (
              <rect key={y} x={-6} y={y - 30} width={932} height={60} rx={30} fill="#C8AE7D" opacity={0.6} />
            ))}
          </svg>
        </div>
        {/* AMÉN: tipografía actual → letras con serifa sobre el pergamino */}
        <div style={{ position: "absolute", left: 540, top: Y_AMEN - 130 * (1 - apoyo) * base + (base > 0 ? 0 : 0), translate: "-50% -50%" }}>
          <div style={{ position: "relative" }}>
            <div style={{ fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 200, letterSpacing: 10, color: "#2A3550", opacity: 1 - envejece }}>AMÉN</div>
            <div style={{ position: "absolute", left: "50%", top: "50%", translate: "-50% -50%", fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: 196, letterSpacing: 14, color: PAL.tinta, opacity: envejece, textShadow: brillo > 0 ? `0 0 ${40 * brillo}px rgba(242,193,78,${0.8 * brillo})` : undefined }}>
              AMÉN
            </div>
          </div>
        </div>
        {/* base de piedra que encaja debajo de las letras */}
        {base > 0 ? (
          <svg style={{ position: "absolute", left: 540 - 330, top: Y_AMEN + 110 + (1 - base) * 300, opacity: Math.min(1, base * 1.6) }} width={660} height={110}>
            <path d="M 0 30 L 270 30 L 290 0 L 370 0 L 390 30 L 660 30 L 660 110 L 0 110 Z" fill="#A89878" />
            <path d="M 0 30 L 660 30 L 660 46 L 0 46 Z" fill="#C9B998" />
            <rect x={0} y={96} width={660} height={14} fill="#7E705A" />
            {[110, 330, 550].map((x) => (
              <line key={x} x1={x} y1={50} x2={x} y2={110} stroke="#7E705A" strokeWidth={4} />
            ))}
            <rect x={0} y={0} width={660} height={110} fill={PAL.dorado} opacity={0.25 * brillo} />
          </svg>
        ) : null}
        {/* así es · es verdad · que así sea */}
        <div style={{ opacity: 1 - salenFrases }}>
          <Frase texto="Así es" x={540} y={800} aparece={fAsiEs - 2} tam={64} />
          <Frase texto="Es verdad" x={540} y={900} aparece={fVerdad - 2} tam={64} />
          <Frase texto="Que así sea" x={540} y={1000} aparece={fSea - 2} tam={64} />
        </div>
        {/* hebreo */}
        <div style={{ position: "absolute", left: 540, top: 1110, translate: "-50% -50%", display: "flex", alignItems: "center", gap: 28, opacity: lerp(f, fHebreo - 2, fHebreo + 8, 0, 1) }}>
          <span style={{ fontFamily: FUENTE_HEBREO, fontWeight: 700, fontSize: 110, color: PAL.doradoOscuro, direction: "rtl" }}>אמן</span>
          <span style={{ fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 46, color: PAL.tinta }}>hebreo</span>
        </div>
      </Camara>
      <Textura />
      <Sfx archivo="pagina" en={fMiles - 4} volumen={0.4} />
      <Sfx archivo="marca" en={fHebreo} volumen={0.2} />
      <Sfx archivo="tela" en={fAsiEs - 2} volumen={0.15} />
      <Sfx archivo="tela" en={fVerdad - 2} volumen={0.15} />
      <Sfx archivo="tela" en={fSea - 2} volumen={0.15} />
      <Sfx archivo="piedra" en={fFirmeza + 12} volumen={0.4} />
      <Sfx archivo="brillo" en={fConfianza} volumen={0.2} />
    </AbsoluteFill>
  );
};

// ---------- 3. UNA RESPUESTA COMPARTIDA ----------
const OYENTES: { q: Quien; x: number; s: number; a: number; d: number }[] = [
  { q: "oyente2", x: 610, s: 1340, a: 250, d: 0 },
  { q: "vecina", x: 790, s: 1350, a: 245, d: 3 },
  { q: "oyente1", x: 960, s: 1345, a: 240, d: 6 },
  { q: "vecino", x: 700, s: 1470, a: 290, d: 2 },
  { q: "oyente3", x: 900, s: 1480, a: 280, d: 5 },
];
const Pueblo: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fBiblia = useMomento("biblia", 0.1);
  const fPueblo = useMomento("pueblo", 0.3);
  const fAmen = useMomento("amen", 0.45);
  const fEscuchaba = useMomento("escuchaba", 0.85);
  const responde = (d: number) => lerp(f, fAmen - 6 + d, fAmen + 6 + d, 0, 1, Easing.out(Easing.cubic));
  const bocaPueblo = f >= fAmen - 2 && f <= fAmen + 14 ? 0.5 * osc(f, 5) : 0;
  const lee = f < fAmen - 6;
  const rollo = manoDe(260, 1260, 300, POSES.leer.brazoDer!, 1);
  return (
    <AbsoluteFill>
      <Camara tomas={[{ f: 0, x: 420, y: 980, z: 1.1 }, { f: fPueblo, x: 560, y: 1000, z: 1.0 }, { f: fAmen + 10, x: 700, y: 980, z: 1.08 }, { f: duracion, x: 700, y: 900, z: 1.12 }]}>
        <Cielo tono="dia" />
        <JerusalenLejos x={-80} y={680} escala={1.2} />
        <Colinas y={980} colores={["#B09A70", "#9C8662", "#86744F"]} />
        <div style={{ position: "absolute", left: -900, top: 1180, width: 2900, height: 1400, background: "linear-gradient(180deg,#CDBB98,#A8946E)" }} />
        {/* púlpito de madera (Nehemías 8:4) */}
        <div style={{ position: "absolute", left: 90, top: 1180, width: 340, height: 120, background: PAL.madera, borderRadius: 8 }} />
        <div style={{ position: "absolute", left: 90, top: 1170, width: 340, height: 22, background: PAL.maderaClara, borderRadius: 8 }} />
        {/* Esdras lee */}
        <Fig quien="maestro" x={260} suelo={1260} ancho={300} giro={0.4} mirada={lee ? [4, 8] : [8, 0]} cabeza={lee ? 6 : 0} brazoIzq={POSES.leer.brazoIzq} brazoDer={POSES.leer.brazoDer} bocaAuto={lee ? 0.3 * osc(f, 6) : 0} semilla={2} />
        <div style={{ position: "absolute", left: rollo.x - 120, top: rollo.y - 50, scale: "0.8" }}>
          <Rollo ancho={150} />
        </div>
        {/* el pueblo escucha y responde */}
        {OYENTES.map((o, i) => {
          const r = responde(o.d);
          const alza = mezclarBrazo({ hombro: 8, codo: -10 }, POSES.alzar.brazoDer!, r);
          return (
            <Fig
              key={i}
              quien={o.q}
              x={o.x}
              suelo={o.s}
              ancho={o.a}
              giro={-0.6}
              mirada={[-8, r > 0.5 ? -8 : 6]}
              cabeza={(1 - r) * -6}
              boca={{ apertura: r > 0.3 ? bocaPueblo : 0, curva: 6 }}
              brazoIzq={i % 2 === 0 ? alza : mezclarBrazo({ hombro: 8, codo: -10 }, { hombro: 120, codo: 20, mano: "abierta" }, r)}
              brazoDer={alza}
              semilla={i + 4}
            />
          );
        })}
        <PalabraAmen x={800} y={760} aparece={fAmen} tam={130} brillo={0.8} />
      </Camara>
      <Referencia texto="Nehemías 8:6" aparece={fBiblia + 4} />
      <Textura />
      <Sfx archivo="pagina" en={4} volumen={0.25} />
      <Sfx archivo="tela" en={fAmen - 4} volumen={0.3} />
      <Sfx archivo="brillo" en={fAmen} volumen={0.15} />
      <Sfx archivo="whoosh" en={fEscuchaba + 4} volumen={0.15} />
    </AbsoluteFill>
  );
};

// ---------- 4. JESÚS Y SUS ENSEÑANZAS ----------
const JESUS = { x: 420, suelo: 1290, ancho: 330 };
const Jesus: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fEnsenanzas = useMomento("ensenanzas", 0.35);
  const fTraducida = useMomento("traducida", 0.7);
  const fVerdad = useMomento("verdad", 0.82);
  const mira = lerp(f, 4, 18, 0, 1); // contacto visual con el grupo
  const gesto = lerp(f, fEnsenanzas - 4, fEnsenanzas + 10, 0, 1);
  // al final la mano se extiende hacia la derecha: de ahí sale la transición a la misa
  const extiende = lerp(f, duracion - 22, duracion - 6, 0, 1);
  const reposo: Brazo = { hombro: 10, codo: -20 };
  const bDer0 = mezclarBrazo(reposo, { hombro: 20 + 8 * osc(f, 30), codo: 70 + 15 * osc(f, 24), mano: "abierta" }, gesto);
  const bDer = mezclarBrazo(bDer0, { hombro: 70, codo: 20, mano: "abierta" }, extiende);
  const mano = manoDe(JESUS.x, JESUS.suelo, JESUS.ancho, bDer, 1);
  const cambio = lerp(f, fTraducida - 2, fTraducida + 10, 0, 1);
  return (
    <AbsoluteFill>
      <Camara
        tomas={[
          { f: 0, x: 600, y: 900, z: 1.05 },
          { f: fEnsenanzas, x: 560, y: 960, z: 1.12 },
          { f: duracion - 24, x: 560, y: 980, z: 1.1 },
          { f: duracion, x: mano.x, y: mano.y, z: 2.6 },
        ]}
      >
        <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 2200, background: "linear-gradient(180deg,#3E5A86 0%,#8FA8C4 60%,#EBD9B4 100%)" }} />
        <Colinas y={880} />
        <div style={{ position: "absolute", left: -900, top: 1200, width: 2900, height: 1500, background: "linear-gradient(180deg,#8E9A72,#6F7F4E 50%)" }} />
        <Fig
          quien="jesus"
          edad={1}
          x={JESUS.x}
          suelo={JESUS.suelo}
          ancho={JESUS.ancho}
          giro={0.5 * mira}
          mirada={[8 * mira, 4 * mira]}
          bocaAuto={gesto > 0.5 && extiende < 0.5 ? 0.3 * osc(f, 6) : 0}
          brazoDer={bDer}
          brazoIzq={{ hombro: 10 + 6 * gesto, codo: -20 + 30 * gesto }}
          semilla={1}
        />
        {[
          { q: "oyente1" as Quien, x: 640, s: 1430, a: 250, g: -0.6 },
          { q: "vecino" as Quien, x: 820, s: 1450, a: 260, g: -0.6 },
          { q: "oyente3" as Quien, x: 980, s: 1420, a: 240, g: -0.7 },
          { q: "maria" as Quien, x: 740, s: 1560, a: 270, g: -0.6 },
          { q: "oyente2" as Quien, x: 940, s: 1570, a: 270, g: -0.7 },
        ].map((o, i) => (
          <Fig key={i} quien={o.q} sentado x={o.x} suelo={o.s} ancho={o.a} giro={o.g} mirada={[-9, -4]} cabeza={Math.sin((f + i * 20) / 40) * 2} semilla={i + 3} />
        ))}
      </Camara>
      {/* AMÉN → "En verdad les digo" */}
      <div style={{ position: "absolute", left: 540, top: 470, translate: "-50% -50%", opacity: 1 - cambio, scale: String(1 - 0.2 * cambio) }}>
        <div style={{ fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 130, letterSpacing: 8, color: PAL.dorado, textShadow: "0 0 24px rgba(242,193,78,0.6), 0 6px 18px rgba(0,0,0,0.5)" }}>AMÉN</div>
      </div>
      <Frase texto={<span>«En verdad les digo»</span>} x={540} y={470} aparece={fTraducida + 2} tam={60} acento />
      <Referencia texto="Mateo 5:18" aparece={fVerdad} />
      <Textura />
      <Sfx archivo="tela" en={fEnsenanzas - 2} volumen={0.25} />
      <Sfx archivo="pagina" en={fTraducida} volumen={0.25} />
      <Sfx archivo="whoosh" en={duracion - 14} volumen={0.22} />
    </AbsoluteFill>
  );
};

// ---------- 5. EL AMÉN EN LA COMUNIÓN ----------
const CURA = { x: 380, suelo: 1460, ancho: 360 };
const FIEL = { x: 760, suelo: 1470, ancho: 350 };
export const Iglesia: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: -900, top: -900, width: 2900, height: 3800, background: "linear-gradient(180deg,#1B2A4D 0%,#2C3F66 50%,#3A4A6A 100%)" }} />
    {/* arcos de piedra */}
    <svg style={{ position: "absolute", left: -200, top: 160 }} width={1480} height={1200}>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${60 + i * 480} 1200 L ${60 + i * 480} 380 Q ${300 + i * 480} 120 ${540 + i * 480} 380 L ${540 + i * 480} 1200`} fill="none" stroke="#5A6A8A" strokeWidth={40} />
      ))}
    </svg>
    {/* vitral geométrico (original) con luz cálida */}
    <svg style={{ position: "absolute", left: 390, top: 260 }} width={300} height={520}>
      <path d="M 0 520 L 0 150 Q 150 -40 300 150 L 300 520 Z" fill="#2A1E14" />
      {Array.from({ length: 6 }, (_, r) =>
        Array.from({ length: 4 }, (_, c) => (
          <rect key={`${r}-${c}`} x={16 + c * 68} y={170 + r * 56} width={60} height={48} fill={["#C8922E", "#8E3B2E", "#2F5D8A", "#D9B25A", "#4F7A4A"][(r * 4 + c) % 5]} opacity={0.85} />
        )),
      )}
      <path d="M 30 160 Q 150 10 270 160 Z" fill="#F2C14E" opacity={0.85} />
      <rect x={140} y={40} width={20} height={480} fill="#2A1E14" />
    </svg>
    <div style={{ position: "absolute", left: 200, top: 300, width: 700, height: 1200, background: "linear-gradient(180deg, rgba(255,214,140,0.25), rgba(255,214,140,0))", clipPath: "polygon(35% 0, 65% 0, 100% 100%, 0 100%)" }} />
    {/* altar */}
    <div style={{ position: "absolute", left: 190, top: 1010, width: 700, height: 300, background: "#E9E2D2", borderRadius: 8 }} />
    <div style={{ position: "absolute", left: 190, top: 1010, width: 700, height: 40, background: "#F7F3EA" }} />
    <div style={{ position: "absolute", left: 500, top: 1060, width: 80, height: 80, border: "6px solid #D9B25A", borderRadius: 6 }} />
    {[240, 820].map((x) => (
      <div key={x} style={{ position: "absolute", left: x, top: 880 }}>
        <div style={{ position: "absolute", left: 0, top: 30, width: 20, height: 100, background: "#F7F3EA" }} />
        <div style={{ position: "absolute", left: 3, top: 6, width: 14, height: 26, borderRadius: "50% 50% 40% 40%", background: "#FFC870", boxShadow: "0 0 30px 10px rgba(255,200,112,0.5)" }} />
      </div>
    ))}
    <div style={{ position: "absolute", left: -900, top: 1400, width: 2900, height: 1300, background: "linear-gradient(180deg,#6A5038,#4A3826)" }} />
  </>
);

const Misa: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fCuerpo = useMomento("cuerpo", 0.3);
  const fAmen = useMomento("amen", 0.55);
  const fFe = useMomento("fe", 0.75);
  const fCreo = useMomento("creo", 0.9);
  const bocaAmen = useBocaPalabra("amen", 0.55);
  const presenta = lerp(f, 6, 20, 0, 1);
  const bCura = mezclarBrazo({ hombro: 10, codo: -60 }, POSES.hostia.brazoDer!, presenta);
  const manoCura = manoDe(CURA.x, CURA.suelo, CURA.ancho, bCura, 1);
  const recibe = lerp(f, fAmen + 10, fAmen + 26, 0, 1);
  const bFiel = mezclarBrazo({ hombro: 8, codo: -20 }, POSES.recibir.brazoDer!, lerp(f, fCuerpo, fCuerpo + 14, 0, 1));
  const manosFiel = manoDe(FIEL.x, FIEL.suelo, FIEL.ancho, bFiel, -1);
  const hostia: [number, number] = [manoCura.x + 20 + (manosFiel.x + 20 - manoCura.x - 20) * recibe, manoCura.y - 34 + (manosFiel.y - 10 - manoCura.y + 34) * recibe];
  return (
    <AbsoluteFill>
      <Camara
        tomas={[
          { f: 0, x: manoCura.x + 20, y: manoCura.y - 30, z: 2.6 },
          { f: 22, x: 560, y: 1000, z: 1.15 },
          { f: fAmen, x: 640, y: 960, z: 1.2 },
          { f: duracion, x: 600, y: 940, z: 1.12 },
        ]}
      >
        <Iglesia />
        <Fig quien="sacerdote" x={CURA.x} suelo={CURA.suelo} ancho={CURA.ancho} giro={0.6} mirada={[8, -2]} brazoDer={bCura} brazoIzq={{ hombro: 8, codo: -60, mano: "abierta" }} semilla={3} />
        <Fig
          quien="fiel"
          x={FIEL.x}
          suelo={FIEL.suelo}
          ancho={FIEL.ancho}
          giro={-0.6}
          mirada={[-8, f > fAmen + 8 ? 6 : 0]}
          cabeza={f > fFe ? 4 : 0}
          boca={{ apertura: bocaAmen, curva: f > fCreo ? 8 : 4 }}
          ojos={f > fCreo + 6 ? 0.45 : 1}
          brazoIzq={mezclarBrazo({ hombro: 8, codo: -20 }, POSES.recibir.brazoIzq!, lerp(f, fCuerpo, fCuerpo + 14, 0, 1))}
          brazoDer={bFiel}
          semilla={2}
        />
        {/* hostia */}
        <div style={{ position: "absolute", left: hostia[0] - 30, top: hostia[1] - 30, width: 60, height: 60, borderRadius: 30, background: "radial-gradient(circle at 40% 35%, #FFFFFF, #EDE6D6)", boxShadow: "0 0 24px rgba(255,240,200,0.7)", opacity: recibe > 0.98 && f > fFe + 10 ? 0 : 1 }}>
          <svg width={60} height={60}>
            <path d="M 30 14 L 30 46 M 16 28 L 44 28" stroke="#D8CFBA" strokeWidth={3} />
          </svg>
        </div>
      </Camara>
      <Frase texto="El Cuerpo de Cristo" x={360} y={520} aparece={fCuerpo - 2} hasta={fCreo - 6} tam={44} />
      <Frase texto="Amén" x={760} y={620} aparece={fAmen} hasta={fCreo - 6} tam={52} />
      <Frase texto="«Sí, creo»" x={540} y={560} aparece={fCreo - 4} tam={76} acento />
      <Textura />
      <Sfx archivo="whoosh" en={0} volumen={0.18} />
      <Sfx archivo="tela" en={fAmen + 10} volumen={0.2} />
      <Sfx archivo="brillo" en={fCreo - 4} volumen={0.18} />
    </AbsoluteFill>
  );
};

// ---------- 6. HACER TUYA LA ORACIÓN ----------
const Oracion: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fConfianza = useMomento("confianza", 0.35);
  const fTuyo = useMomento("tuyo", 0.5);
  const fManos = useMomento("manos", 0.85);
  const fDios = useMomento("dios", 0.95);
  // escucha (ojos cerrados, cabeza inclinada) → asiente → abre las manos → expresión relajada
  const asiente = f > fConfianza && f < fConfianza + 30 ? Math.sin(((f - fConfianza) / 15) * Math.PI) * 6 : 0;
  const abre = lerp(f, fManos - 10, fManos + 10, 0, 1);
  const relaja = lerp(f, fDios - 4, fDios + 14, 0, 1);
  const luz = lerp(f, fTuyo, duracion, 0, 1);
  return (
    <AbsoluteFill>
      <Camara tomas={[{ f: 0, x: 540, y: 960, z: 1.0 }, { f: duracion, x: 540, y: 900, z: 1.12 }]}>
        <Habitacion luz={luz} />
        {/* AMÉN integrado en la luz de la pared */}
        <PalabraAmen x={690} y={545} aparece={fConfianza} tam={110} opacidad={0.45 + 0.25 * luz} serifa brillo={0.4 + 0.6 * luz} />
        <Fig
          quien="fiel"
          sentado
          x={HAB.x}
          suelo={HAB.suelo}
          ancho={HAB.ancho}
          ojos={0}
          cabeza={4 + asiente}
          boca={{ curva: 4 + 8 * relaja }}
          cejas={{ y: 2 * relaja, rot: -3 * relaja }}
          brazoIzq={mezclarBrazo(POSES.rezar.brazoIzq!, POSES.abrir.brazoIzq!, abre)}
          brazoDer={mezclarBrazo(POSES.rezar.brazoDer!, POSES.abrir.brazoDer!, abre)}
          semilla={2}
        />
      </Camara>
      <Textura />
      <Sfx archivo="tela" en={fManos - 8} volumen={0.25} />
      <Sfx archivo="brillo" en={fDios} volumen={0.15} />
    </AbsoluteFill>
  );
};

// ---------- 7. CIERRE (el mismo del canal) ----------
const Cierre: React.FC<PropsEscena> = (p) => <CierreCanal {...p} />;

export const ESCENAS_AMEN: Record<string, React.FC<{ escena: EscenaAnimada }>> = {
  "amen/automatico": Automatico,
  "amen/antigua": Antigua,
  "amen/pueblo": Pueblo,
  "amen/jesus": Jesus,
  "amen/misa": Misa,
  "amen/oracion": Oracion,
  "amen/cierre": Cierre,
};

void CABEZA_FIEL;
void FUENTE_HEBREO;
