// Escenas del video "¿Qué pasó con Jesús entre los 12 y los 30 años?" (Versículo Oculto).
// Cada acción se engancha a una palabra de la narración (useMomento): sigue a la voz real.
// Precisión: no se muestra a Jesús en Séforis; el taller y los encargos son ilustrativos.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { useAperturaBoca, useEscena } from "../../video/contexto";
import type { EscenaAnimada } from "../../video/tipos";
import { FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { Sfx, useMomento } from "../comun";
import { Persona, paletaDe, type Brazo, type PropsPersona, type Quien } from "./personas";
import {
  BancoCarpintero,
  Banco,
  Camara,
  Cartel,
  Casita,
  CalleNazaret,
  Cielo,
  CLAMP,
  Colinas,
  En,
  Escuadra,
  Formon,
  JerusalenLejos,
  LibroAntiguo,
  lerp,
  Mazo,
  MontesMapa,
  PAL,
  Particulas,
  Pergamino,
  Portal,
  PuntoMapa,
  Referencia,
  Renglones,
  Rollo,
  Ruta,
  Serrucho,
  Sillar,
  Sol,
  Tabla,
  TapaLibro,
  Taller,
  Templo,
  textoCartel,
  Textura,
  Viga,
} from "./escenarios";

type PropsEscena = { escena: EscenaAnimada };

// ---------- utilidades ----------

// Figura parada con los pies en `suelo` (coordenadas del mundo).
export const PIE = 1110 / 600; // altura del lienzo hasta los pies (proporción del ancho)
const PIE_SENTADO = 922 / 600;
const CABEZA = 210 / 600; // centro de la cabeza
export const Fig: React.FC<Omit<PropsPersona, "ancho"> & { x: number; suelo: number; ancho: number; opacidad?: number }> = ({ x, suelo, ancho, opacidad = 1, ...p }) => (
  <div style={{ position: "absolute", left: x, top: suelo - (p.sentado ? PIE_SENTADO : p.corta ? 1086 / 600 : PIE) * ancho, opacity: opacidad }}>
    <Persona ancho={ancho} {...p} />
  </div>
);

// Cabeza en (x, y): para primeros planos.
export const FigCabeza: React.FC<Omit<PropsPersona, "ancho"> & { x: number; y: number; ancho: number }> = ({ x, y, ancho, ...p }) => (
  <div style={{ position: "absolute", left: x, top: y - CABEZA * ancho }}>
    <Persona ancho={ancho} {...p} />
  </div>
);

// Posición en pantalla (mundo) de la mano de una figura parada, según su pose (mismo cálculo que personas.tsx).
// lado: -1 brazo izquierdo de la pantalla, 1 derecho. Devuelve también el ángulo del antebrazo (grados).
export const manoDe = (x: number, suelo: number, ancho: number, b: Brazo, lado: 1 | -1, corta = false, sentado = false) => {
  const k = ancho / 600;
  const top = suelo - (sentado ? PIE_SENTADO : corta ? 1086 / 600 : PIE) * ancho;
  const rad = (g: number) => (g * Math.PI) / 180;
  const r1 = -b.hombro * lado;
  const r2 = r1 - b.codo * lado;
  const hx = 132 * lado - 160 * Math.sin(rad(r1)) - 182 * Math.sin(rad(r2));
  const hy = 345 + 160 * Math.cos(rad(r1)) + 182 * Math.cos(rad(r2));
  return { x: x + hx * k, y: top + (hy + 60) * k, ang: r2 };
};

// Fundido entre partes de una escena.
export const Parte: React.FC<{ desde: number; hasta: number; children: React.ReactNode; fundido?: number }> = ({ desde, hasta, children, fundido = 8 }) => {
  const frame = useCurrentFrame();
  if (frame < desde - fundido || frame > hasta + fundido) return null;
  const o = Math.min(lerp(frame, desde - fundido, desde, 0, 1), 1 - lerp(frame, hasta, hasta + fundido, 0, 1));
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

// Oscilación 0..1 (gestos repetidos: serruchar, golpear, caminar).
export const osc = (f: number, periodo: number, fase = 0) => 0.5 + 0.5 * Math.sin(((f / periodo) * 2 + fase) * Math.PI);

// Brazo suelto con hombro, codo y muñeca (cinemática inversa de dos tramos): para manos que trabajan
// sobre la mesa. El codo se ubica solo, hacia afuera del cuerpo (`codoHacia` = -1 izquierda, 1 derecha).
const BrazoLibre: React.FC<{
  quien: Quien;
  hombro: [number, number];
  mano: [number, number];
  grosor?: number;
  codoHacia?: number;
  tipoMano?: "abierta" | "puno";
  largo?: [number, number];
}> = ({ quien, hombro, mano, grosor = 62, codoHacia = 1, tipoMano = "puno", largo = [185, 200] }) => {
  const c = paletaDe(quien);
  const [L1, L2] = largo;
  const dx = mano[0] - hombro[0];
  const dy = mano[1] - hombro[1];
  const d = Math.min(Math.hypot(dx, dy), (L1 + L2) * 0.995);
  const base = Math.atan2(dy, dx);
  const a = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
  const candidatos = [base + a, base - a].map((ang) => [hombro[0] + Math.cos(ang) * L1, hombro[1] + Math.sin(ang) * L1] as [number, number]);
  const codo = candidatos.sort((p, q) => q[0] * codoHacia - p[0] * codoHacia)[0];
  // la mano queda a la distancia alcanzable sobre la recta hombro→mano pedida
  const angAnte = Math.atan2(mano[1] - codo[1], mano[0] - codo[0]);
  const muneca: [number, number] = [codo[0] + Math.cos(angAnte) * L2, codo[1] + Math.sin(angAnte) * L2];
  const ang = (angAnte * 180) / Math.PI;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      {/* brazo (manga ancha) */}
      <line x1={hombro[0]} y1={hombro[1]} x2={codo[0]} y2={codo[1]} stroke={c.tunica} strokeWidth={grosor * 1.15} strokeLinecap="round" />
      <line x1={hombro[0]} y1={hombro[1]} x2={codo[0]} y2={codo[1]} stroke={c.tunicaSombra} strokeWidth={grosor * 0.3} strokeLinecap="round" opacity={0.4} transform={`translate(${codoHacia * 10} 4)`} />
      {/* antebrazo */}
      <line x1={codo[0]} y1={codo[1]} x2={muneca[0]} y2={muneca[1]} stroke={c.tunica} strokeWidth={grosor} strokeLinecap="round" />
      <g transform={`translate(${muneca[0]} ${muneca[1]}) rotate(${ang - 90})`}>
        <rect x={-grosor * 0.52} y={-grosor * 0.25} width={grosor * 1.04} height={grosor * 0.3} rx={6} fill={c.tunicaSombra} />
        <rect x={-grosor * 0.2} y={0} width={grosor * 0.4} height={grosor * 0.3} fill={c.pielSombra} />
        <ellipse cx={0} cy={grosor * 0.55} rx={grosor * 0.42} ry={grosor * 0.5} fill={c.piel} />
        {tipoMano === "abierta" ? (
          <path d={`M ${-grosor * 0.26} ${grosor * 0.9} l 0 ${grosor * 0.28} M 0 ${grosor * 0.95} l 0 ${grosor * 0.3} M ${grosor * 0.26} ${grosor * 0.9} l 0 ${grosor * 0.28}`} stroke={c.piel} strokeWidth={grosor * 0.2} strokeLinecap="round" />
        ) : (
          <path d={`M ${-grosor * 0.28} ${grosor * 0.7} q ${grosor * 0.28} ${grosor * 0.14} ${grosor * 0.56} 0`} stroke={c.pielSombra} strokeWidth={4} fill="none" />
        )}
        {/* pulgar */}
        <ellipse cx={-grosor * 0.38 * codoHacia} cy={grosor * 0.4} rx={grosor * 0.14} ry={grosor * 0.24} fill={c.piel} transform={`rotate(${25 * codoHacia} ${-grosor * 0.38 * codoHacia} ${grosor * 0.4})`} />
      </g>
    </svg>
  );
};

// Brazo con gesto de enseñar (oscila suave).
export const gestoEnsenar = (f: number, fase = 0) => ({ hombro: 16 + 14 * osc(f, 34, fase), codo: 62 + 26 * osc(f, 26, fase + 0.5), mano: "abierta" as const });

// ---------- 1. EL SALTO EN EL TIEMPO ----------
const Salto: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fDoce = useMomento("doce", 0.12);
  const fTreinta = useMomento("treinta", 0.22);
  const fEvangelios = useMomento("evangelios", 0.32);
  const fGolpe = useMomento("golpe", 0.5);
  const fHistorias = useMomento("historias", 0.66);
  const fIndia = useMomento("india", 0.88);
  const edad = lerp(f, fTreinta - 4, fTreinta + 34, 0, 1);
  const barra = lerp(f, fDoce + 4, fTreinta + 20, 0, 1);
  const hueco = lerp(f, fEvangelios + 6, fGolpe, 0, 1);
  const mapa = lerp(f, fIndia - 4, fIndia + 18, 0, 1);
  const ruta = lerp(f, fIndia + 12, Math.min(duracion - 6, fIndia + 50), 0, 1);
  // la cara acompaña: leve acercamiento y luego se aleja cuando aparece el mapa
  const z = interpolate(f, [0, fTreinta, fTreinta + 40, fIndia, fIndia + 20], [1.0, 1.06, 1.1, 1.1, 0.92], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  const mirar: [number, number] = f < fTreinta ? [-6 + 6 * osc(f, 70), -2] : [lerp(f, fTreinta, fTreinta + 30, -4, 4), 0];
  const panelY = 1150;
  const xi = 170;
  const xf = 910;
  return (
    <AbsoluteFill>
      <Camara tomas={[{ f: 0, x: 540, y: 960, z }]}>
        <Templo />
        <Portal x={-200} y={420} />
        {/* maestros desenfocados al fondo */}
        <div style={{ filter: "blur(3px)", opacity: 0.85 }}>
          <Fig quien="maestro" sentado x={110} suelo={1320} ancho={330} cabeza={4} giro={0.6} mirada={[6, 0]} semilla={2} />
          <Fig quien="maestro2" sentado x={980} suelo={1330} ancho={330} cabeza={-3} giro={-0.6} mirada={[-6, 0]} semilla={5} />
        </div>
        {/* Jesús: primer plano que se transforma de 12 años a adulto */}
        <FigCabeza quien="jesus" x={540} y={600} ancho={lerp(f, fTreinta, fTreinta + 34, 1250, 1300)} edad={edad} mirada={mirar} cabeza={Math.sin(f / 40) * 2} semilla={1} sinBrazos />
        {/* destello durante la transformación */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, background: "radial-gradient(circle at 50% 33%, rgba(255,233,176,0.75), rgba(255,233,176,0) 45%)", opacity: Math.sin(Math.PI * lerp(f, fTreinta - 4, fTreinta + 34, 0, 1)) * 0.8 }} />
      </Camara>
      {/* línea temporal */}
      <div style={{ position: "absolute", left: 0, top: panelY - 150, width: 1080, height: 340, background: "linear-gradient(180deg, rgba(11,20,38,0) 0%, rgba(11,20,38,0.82) 35%, rgba(11,20,38,0.82) 70%, rgba(11,20,38,0) 100%)", opacity: lerp(f, fDoce, fDoce + 8, 0, 1) * (1 - mapa) }} />
      <svg style={{ position: "absolute", left: 0, top: 0, opacity: lerp(f, fDoce, fDoce + 8, 0, 1) * (1 - mapa) }} width={1080} height={1920}>
        <line x1={xi} y1={panelY} x2={xi + (xf - xi) * barra} y2={panelY} stroke={PAL.dorado} strokeWidth={12} strokeLinecap="round" strokeDasharray={hueco > 0 ? undefined : undefined} />
        {/* tramo del medio: se vuelve punteado ("casi de golpe") */}
        {hueco > 0 ? <line x1={xi + 90} y1={panelY} x2={xf - 90} y2={panelY} stroke={PAL.noche} strokeWidth={16} opacity={hueco} /> : null}
        {hueco > 0 ? <line x1={xi + 90} y1={panelY} x2={xf - 90} y2={panelY} stroke={PAL.pergamino} strokeWidth={8} strokeDasharray="14 18" opacity={hueco} /> : null}
        <circle cx={xi} cy={panelY} r={20} fill={PAL.dorado} />
        <circle cx={xf} cy={panelY} r={20 * lerp(f, fTreinta + 12, fTreinta + 20, 0, 1)} fill={PAL.dorado} />
        {hueco > 0.3 ? (
          <text x={540} y={panelY + 24} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={900} fontSize={84} fill={PAL.dorado} opacity={hueco} style={{ scale: String(0.8 + 0.2 * osc(f, 50)), transformOrigin: "540px 1150px" }}>
            ?
          </text>
        ) : null}
      </svg>
      <div style={{ position: "absolute", left: xi - 140, width: 280, top: panelY + 40, textAlign: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 54, color: PAL.crema, opacity: lerp(f, fDoce, fDoce + 8, 0, 1) * (1 - mapa) }}>12 años</div>
      <div style={{ position: "absolute", left: xf - 220, width: 380, top: panelY + 40, textAlign: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 50, lineHeight: 1.05, color: PAL.crema, opacity: lerp(f, fTreinta + 10, fTreinta + 20, 0, 1) * (1 - mapa) }}>
        Alrededor de 30
      </div>
      {/* "historias de todo tipo": rollitos con signos de pregunta que aparecen alrededor del hueco */}
      {[0, 1, 2, 3].map((i) => {
        const a = fHistorias + i * 5;
        const e = lerp(f, a, a + 10, 0, 1, Easing.out(Easing.back(2)));
        const pos = [
          [300, 980],
          [760, 1000],
          [420, 900],
          [660, 880],
        ][i];
        return (
          <div key={i} style={{ position: "absolute", left: pos[0] - 50, top: pos[1] - 34 + Math.sin(f / 15 + i) * 6, width: 100, height: 68, borderRadius: 14, background: PAL.pergamino, border: `4px solid ${PAL.pergaminoOscuro}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 44, color: PAL.tinta, scale: String(e), opacity: e * (1 - mapa), rotate: `${(i % 2 ? 1 : -1) * 6}deg` }}>
            ?
          </div>
        );
      })}
      {/* la línea se convierte en mapa */}
      {mapa > 0 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: mapa }}>
          <div style={{ position: "absolute", left: 540 - 470, top: panelY - 310, width: 940, height: 620, transform: `scale(${0.3 + 0.7 * mapa}, ${0.08 + 0.92 * mapa})`, transformOrigin: "470px 310px" }}>
            <Pergamino x={0} y={0} w={940} h={620}>
              <MontesMapa puntos={[[260, 300], [330, 330], [600, 200], [680, 240], [760, 210]]} />
              {/* costa del Mediterráneo, esquemática */}
              <svg style={{ position: "absolute", left: 0, top: 0 }} width={940} height={620}>
                <path d="M 30 120 Q 80 260 60 420 Q 50 520 90 600 L 0 600 L 0 120 Z" fill="#9FB4C8" opacity={0.65} />
                <path d="M 560 520 Q 640 470 700 560 L 720 620 L 540 620 Z" fill="#9FB4C8" opacity={0.5} />
              </svg>
              <Ruta p0={[150, 380]} p1={[820, 420]} curva={-200} progreso={ruta} grosor={9} ancho={940} alto={620} />
              <PuntoMapa x={150} y={380} nombre="Galilea" lado="abajo" tam={46} />
              <PuntoMapa x={820} y={420} nombre="India" lado="abajo" tam={46} aparece={fIndia + 30} />
              <div style={{ position: "absolute", left: 445, top: 150, width: 120, height: 120, borderRadius: 60, background: PAL.coral, color: PAL.crema, fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 90, display: "flex", alignItems: "center", justifyContent: "center", scale: String(lerp(f, fIndia + 30, fIndia + 40, 0, 1, Easing.out(Easing.back(2)))), boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }}>
                ?
              </div>
            </Pergamino>
          </div>
        </div>
      ) : null}
      <Textura />
      <Sfx archivo="brillo" en={fTreinta - 2} volumen={0.22} />
      <Sfx archivo="tela" en={fHistorias} volumen={0.25} />
      <Sfx archivo="pagina" en={fIndia - 4} volumen={0.4} />
    </AbsoluteFill>
  );
};

// ---------- 2. LA BÚSQUEDA Y EL TEMPLO ----------
const Busqueda: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fBuscan = useMomento("buscan", 0.12);
  const fDias = useMomento("dias", 0.22);
  const fEncuentran = useMomento("encuentran", 0.3);
  const fEscuchando = useMomento("escuchando", 0.5);
  const fPreguntas = useMomento("preguntas", 0.62);
  const fDespues = useMomento("despues", 0.72);
  const boca = useAperturaBoca(true);

  // A) camino: María y José buscan entre los viajeros y vuelven hacia Jerusalén
  const vuelta = fDias + 26; // se dan vuelta hacia Jerusalén
  const caminoA = (
    <Camara tomas={[{ f: 0, x: 540, y: 980, z: 1 }, { f: fEncuentran, x: 420, y: 980, z: 1.05 }]}>
      <Cielo tono="tarde" />
      <Sol x={860} y={560} r={70} color="#FBD38A" />
      <JerusalenLejos x={-120} y={720} escala={0.9} />
      <Colinas y={900} colores={["#9C8E64", "#86784F", "#6E6240"]} />
      {/* camino */}
      <div style={{ position: "absolute", left: -1200, top: 1250, width: 4000, height: 700, background: "linear-gradient(180deg,#C2A57A,#9A7F58)" }} />
      {/* viajeros que pasan (caravana) */}
      {[0, 1, 2, 3].map((i) => {
        const x = 1300 - ((f * 3.2 + i * 380) % 1900);
        const q: Quien[] = ["oyente2", "oyente1", "oyente3", "vecino"];
        return <Fig key={i} quien={q[i]} x={x} suelo={1250 + (i % 2) * 20} ancho={190} caminando={1} paso={f / 22 + i * 0.3} espejo semilla={i + 3} />;
      })}
      {/* María y José */}
      {(() => {
        const atras = f > vuelta;
        const dx = atras ? -lerp(f, vuelta, fEncuentran, 0, 220) : lerp(f, 0, vuelta, 0, 60);
        const mira = Math.sin(f / 16) * 0.8;
        const preoc = { y: -4, rot: 14 };
        return (
          <>
            <Fig quien="jose" x={430 + dx} suelo={1420} ancho={330} caminando={0.8} paso={f / 24} giro={mira} mirada={[mira * 8, 0]} cejas={preoc} espejo={atras} semilla={4} brazoDer={f > fBuscan && f < fBuscan + 40 ? { hombro: 30, codo: 70, mano: "abierta" } : undefined} />
            <Fig quien="maria" x={680 + dx} suelo={1440} ancho={320} caminando={0.8} paso={f / 24 + 0.5} giro={-mira} mirada={[-mira * 8, 0]} cejas={preoc} boca={{ curva: -4 }} espejo={atras} semilla={6} />
          </>
        );
      })()}
      {/* tres días: soles que se encienden */}
      {[0, 1, 2].map((i) => {
        const a = fDias - 8 + i * 9;
        const e = lerp(f, a, a + 8, 0, 1, Easing.out(Easing.back(2)));
        return (
          <div key={i} style={{ position: "absolute", left: 300 + i * 170, top: 300, width: 120, height: 120, borderRadius: 60, background: "radial-gradient(circle, #FBE3A4 40%, rgba(251,227,164,0) 70%)", scale: String(e), opacity: e }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 50, color: PAL.tinta }}>{i + 1}</div>
          </div>
        );
      })}
    </Camara>
  );

  // B) templo: Jesús entre los maestros; los padres llegan a la entrada
  const alivio = lerp(f, fPreguntas + 16, fPreguntas + 30, 0, 1);
  const levantaMano = lerp(f, fPreguntas - 4, fPreguntas + 8, 0, 1, Easing.out(Easing.back(1.5))) * (1 - lerp(f, fDespues - 6, fDespues, 0, 1));
  const giroMaestro2 = lerp(f, fPreguntas + 2, fPreguntas + 14, -0.1, -0.9);
  const templo = (
    <Camara tomas={[{ f: fEncuentran, x: 540, y: 1010, z: 1.12 }, { f: fPreguntas, x: 520, y: 1000, z: 1.2 }, { f: fPreguntas + 20, x: 700, y: 980, z: 1.05 }]}>
      <Templo />
      <Portal x={880} y={420} />
      {/* padres en la entrada (al fondo) */}
      <div style={{ opacity: lerp(f, fEscuchando, fEscuchando + 10, 0, 1) }}>
        <Fig quien="jose" x={1010} suelo={1350} ancho={200} giro={-0.6} mirada={[-8, 0]} cejas={{ y: -6 + 6 * alivio, rot: 14 * (1 - alivio) }} boca={{ curva: -4 + 12 * alivio }} semilla={4} brazoIzq={{ hombro: 8 + 17 * alivio, codo: -10 + 50 * alivio, mano: "abierta" }} />
        <Fig quien="maria" x={1120} suelo={1360} ancho={195} giro={-0.7} mirada={[-8, 0]} cejas={{ y: -6 + 6 * alivio, rot: 14 * (1 - alivio) }} boca={{ curva: -4 + 12 * alivio }} semilla={6} brazoIzq={{ hombro: 8 + 10 * alivio, codo: -10 - 135 * alivio, mano: "abierta" }} />
      </div>
      <Banco x={20} y={1260} ancho={330} />
      <Banco x={660} y={1270} ancho={330} />
      <Fig quien="maestro" sentado x={190} suelo={1300} ancho={360} giro={0.5} mirada={[7, 0]} bocaAuto={f < fPreguntas ? boca * 0.8 : 0} brazoDer={f < fPreguntas ? gestoEnsenar(f) : { hombro: 10, codo: -40 }} semilla={2} />
      <div style={{ position: "absolute", left: 60, top: 1180 }}>
        <Rollo ancho={220} />
      </div>
      <Fig quien="maestro2" sentado x={820} suelo={1310} ancho={360} giro={giroMaestro2} mirada={[-8 * Math.abs(giroMaestro2), 0]} cejas={{ y: -10 * lerp(f, fPreguntas + 4, fPreguntas + 12, 0, 1) }} semilla={5} />
      {/* Jesús (12 años) sentado entre ellos, en el piso sobre una estera */}
      <div style={{ position: "absolute", left: 360, top: 1370, width: 360, height: 40, borderRadius: 20, background: "#8A3E2A" }} />
      <Fig
        quien="jesus"
        edad={0}
        sentado
        x={540}
        suelo={1400}
        ancho={300}
        giro={f < fPreguntas ? -0.5 : 0.4}
        mirada={f < fPreguntas ? [-8, 0] : [8, -2]}
        cejas={{ y: f > fPreguntas ? -6 : 0 }}
        bocaAuto={f > fPreguntas && f < fPreguntas + 24 ? boca * 0.7 : 0}
        brazoDer={{ hombro: 10 + 150 * levantaMano, codo: 20 * levantaMano, mano: "abierta" }}
        brazoIzq={{ hombro: 12, codo: -55 }}
        semilla={1}
      />
    </Camara>
  );

  // C) regreso a Nazaret: los tres caminan
  const regreso = (
    <Camara tomas={[{ f: fDespues, x: 480, y: 1000, z: 1 }, { f: duracion, x: 640, y: 990, z: 1.06 }]}>
      <Cielo tono="tarde" />
      <Sol x={980} y={760} r={80} color="#F8C77A" />
      <Colinas y={920} colores={["#A08A62", "#8A774F", "#706040"]} />
      {/* Nazaret en la colina */}
      <div style={{ position: "absolute", left: 980, top: 840, scale: "0.45", transformOrigin: "0 0" }}>
        <Casita x={0} y={0} ancho={260} alto={220} />
        <Casita x={240} y={-40} ancho={240} alto={200} color="#D4B48C" />
        <Casita x={460} y={10} ancho={260} alto={210} color="#C49A70" />
      </div>
      <div style={{ position: "absolute", left: -1200, top: 1300, width: 4000, height: 700, background: "linear-gradient(180deg,#C2A57A,#9A7F58)" }} />
      {(() => {
        const dx = lerp(f, fDespues, duracion, 0, 260, Easing.linear);
        return (
          <>
            <Fig quien="jose" x={240 + dx} suelo={1420} ancho={300} caminando={1} paso={f / 22} semilla={4} giro={0.3} />
            <Fig quien="jesus" edad={0} x={420 + dx} suelo={1430} ancho={250} caminando={1} paso={f / 22 + 0.33} semilla={1} giro={0.3} mirada={[6, 0]} />
            <Fig quien="maria" x={590 + dx} suelo={1440} ancho={290} caminando={1} paso={f / 22 + 0.66} semilla={6} giro={-0.3} mirada={[-6, 0]} boca={{ curva: 8 }} />
          </>
        );
      })()}
    </Camara>
  );

  return (
    <AbsoluteFill>
      <Parte desde={0} hasta={fEncuentran - 4}>{caminoA}</Parte>
      <Parte desde={fEncuentran - 4} hasta={fDespues + 4}>{templo}</Parte>
      <Parte desde={fDespues + 4} hasta={duracion + 20}>{regreso}</Parte>
      <Referencia texto="Lucas 2:41–52" aparece={fEncuentran} />
      <Textura />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Sfx key={i} archivo="paso" en={6 + i * 12} volumen={0.12} />
      ))}
      <Sfx archivo="whoosh" en={fEncuentran - 6} volumen={0.25} />
      <Sfx archivo="tela" en={fPreguntas - 4} volumen={0.3} />
      <Sfx archivo="whoosh" en={fDespues} volumen={0.2} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Sfx key={`r${i}`} archivo="paso" en={fDespues + 10 + i * 11} volumen={0.12} />
      ))}
    </AbsoluteFill>
  );
};

// ---------- 3. EL LIBRO DE 1894 ----------
const Libro1894: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fLibro = useMomento("libro", 0.35);
  const fMil = useMomento("mil", 0.5);
  const fRespaldo = useMomento("respaldo", 0.72);
  const fDesmentido = useMomento("desmentido", 0.88);
  const entra = lerp(f, 0, 16, 0, 1, Easing.out(Easing.cubic));
  const apertura = lerp(f, fLibro - 6, fLibro + 14, 0, 1);
  const ilustra = lerp(f, fMil + 6, fMil + 30, 0, 1);
  const golpe = lerp(f, fDesmentido - 2, fDesmentido + 4, 0, 1, Easing.in(Easing.quad));
  const hoja = lerp(f, duracion - 14, duracion, 0, 1); // página que pasa hacia la calle de Nazaret
  return (
    <AbsoluteFill style={{ background: "#1B130C" }}>
      <Camara tomas={[{ f: 0, x: 540, y: 900, z: 1 }, { f: fMil, x: 540, y: 880, z: 1.08 }, { f: fRespaldo - 4, x: 560, y: 900, z: 1.04 }, { f: fRespaldo + 14, x: 1300, y: 940, z: 1.05 }]}>
        {/* mesa de madera con luz de lámpara */}
        <div style={{ position: "absolute", left: -600, top: -400, width: 3000, height: 2800, background: "radial-gradient(ellipse at 35% 40%, #6E4A2C 0%, #3A2716 45%, #1B130C 80%)" }} />
        {Array.from({ length: 14 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: -600, top: -200 + i * 170, width: 3000, height: 4, background: "rgba(0,0,0,0.25)" }} />
        ))}
        {/* libro */}
        <div style={{ position: "absolute", left: 540, top: 880 + (1 - entra) * 900, rotate: `${(1 - entra) * -8}deg` }}>
          <LibroAntiguo
            apertura={apertura}
            w={420}
            h={580}
            tapa={<TapaLibro w={420} h={580} />}
            izquierda={
              <div style={{ position: "absolute", inset: 0 }}>
                <Renglones x={50} y={60} ancho={320} n={4} progreso={1} />
                <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 150, color: PAL.tinta, opacity: lerp(f, fMil - 2, fMil + 8, 0, 1), scale: String(lerp(f, fMil - 2, fMil + 10, 1.4, 1, Easing.out(Easing.back(1.4)))) }}>
                  1894
                </div>
                <Renglones x={50} y={420} ancho={320} n={4} progreso={1} />
              </div>
            }
            derecha={
              <div style={{ position: "absolute", inset: 0 }}>
                {/* ilustración del relato del libro (grabado) */}
                <div style={{ position: "absolute", left: 30, top: 50, width: 360, height: 340, border: `4px solid ${PAL.tinta}`, opacity: ilustra, background: "rgba(200,174,125,0.25)" }}>
                  <MontesMapa puntos={[[120, 200], [170, 220], [250, 170]]} />
                  <Ruta p0={[40, 270]} p1={[320, 120]} curva={-40} progreso={ilustra} grosor={7} color={PAL.tinta} ancho={360} alto={340} />
                  <div style={{ position: "absolute", left: 22, top: 252, width: 30, height: 30, borderRadius: 15, background: PAL.tinta }} />
                  <div style={{ position: "absolute", left: 300, top: 100, width: 34, height: 34, borderRadius: 17, border: `6px solid ${PAL.tinta}` }} />
                  <div style={{ position: "absolute", left: 150, top: 40, fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 70, color: PAL.tinta }}>?</div>
                </div>
                <div style={{ position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 40, color: PAL.tinta, opacity: ilustra }}>
                  Según el libro
                </div>
                <Renglones x={50} y={480} ancho={320} n={2} progreso={ilustra} />
              </div>
            }
          />
        </div>
        {/* documentos con sello */}
        <div style={{ position: "absolute", left: 1080, top: 640 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: i * 40, top: i * 30, width: 400, height: 520, background: i === 2 ? "#F2E6C8" : "#E2D2AC", rotate: `${(i - 1) * 5}deg`, boxShadow: "0 10px 26px rgba(0,0,0,0.35)" }}>
              {i === 2 ? (
                <>
                  <Renglones x={40} y={50} ancho={320} n={12} paso={34} />
                  <div style={{ position: "absolute", left: 280, top: 400, width: 80, height: 80, borderRadius: 40, background: "#8C2E24", opacity: 0.85 }} />
                </>
              ) : null}
            </div>
          ))}
          {/* sello "desmentido" */}
          {f >= fDesmentido - 2 ? (
            <div
              style={{
                position: "absolute",
                left: -10,
                top: 180,
                width: 500,
                padding: "16px 10px",
                border: `8px solid ${PAL.coral}`,
                borderRadius: 14,
                color: PAL.coral,
                fontFamily: FUENTE_TITULO,
                fontWeight: 900,
                fontSize: 50,
                lineHeight: 1.05,
                textAlign: "center",
                rotate: "-9deg",
                background: "rgba(242,230,200,0.6)",
                scale: String(1.8 - 0.8 * golpe),
                opacity: golpe,
              }}
            >
              RESPALDO DOCUMENTAL DESMENTIDO
            </div>
          ) : null}
        </div>
      </Camara>
      {/* la página pasa y deja ver la calle de Nazaret */}
      {hoja > 0 ? (
        <AbsoluteFill>
          <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${(1 - hoja) * 100}%)` }}>
            <Camara tomas={[{ f: 0, x: 600, y: 980, z: 1 }]}>
              <CalleNazaret />
            </Camara>
          </AbsoluteFill>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${(1 - hoja) * 100 - 8}%`, width: "16%", background: "linear-gradient(90deg, rgba(242,230,200,0) 0%, #F2E6C8 45%, #D9C59A 60%, rgba(0,0,0,0.25) 100%)" }} />
        </AbsoluteFill>
      ) : null}
      <Textura />
      <Sfx archivo="whoosh" en={0} volumen={0.2} />
      <Sfx archivo="pagina" en={fLibro - 6} volumen={0.5} />
      <Sfx archivo="marca" en={fMil} volumen={0.25} />
      <Sfx archivo="whoosh" en={fRespaldo - 2} volumen={0.18} />
      <Sfx archivo="madera" en={fDesmentido + 2} volumen={0.45} />
      <Sfx archivo="pagina" en={duracion - 14} volumen={0.45} />
    </AbsoluteFill>
  );
};

// ---------- 4. LOS VECINOS LO RECONOCEN ----------
const Vecinos: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const fPueblo = useMomento("pueblo", 0.3);
  const fSorprenden = useMomento("sorprenden", 0.5);
  const fNoEs = useMomento("no es este", 0.72);
  const fCarpintero = useMomento("carpintero", 0.85);
  const boca = useAperturaBoca(true);
  const sorpresa = lerp(f, fSorprenden - 2, fSorprenden + 8, 0, 1);
  const miraOtro = lerp(f, fSorprenden + 10, fSorprenden + 20, 0, 1);
  const senala = lerp(f, fNoEs - 6, fNoEs + 6, 0, 1, Easing.out(Easing.back(1.4)));
  return (
    <AbsoluteFill>
      <Camara tomas={[{ f: 0, x: 600, y: 980, z: 1 }, { f: fPueblo, x: 520, y: 1000, z: 1.08 }, { f: fSorprenden, x: 640, y: 1010, z: 1.12 }, { f: fNoEs + 6, x: 760, y: 980, z: 1.0 }]}>
        <CalleNazaret />
        {/* oyentes al fondo */}
        <Fig quien="oyente2" x={160} suelo={1350} ancho={210} giro={-0.4} mirada={[-6, 0]} semilla={8} cejas={{ y: -6 * sorpresa }} />
        <Fig quien="oyente1" x={-10} suelo={1360} ancho={200} giro={0.5} mirada={[6, 0]} semilla={9} />
        {/* Jesús adulto enseña */}
        <Fig quien="jesus" edad={1} x={250} suelo={1400} ancho={320} giro={0.4} mirada={[7, 0]} bocaAuto={boca * 0.75} brazoDer={gestoEnsenar(f)} brazoIzq={{ hombro: 14 + 8 * osc(f, 40), codo: 30 + 20 * osc(f, 40) }} semilla={1} />
        {/* vecinos (la vecina va detrás para que el brazo que señala quede adelante) */}
        <Fig
          quien="vecina"
          x={520}
          suelo={1480}
          ancho={330}
          giro={-0.5 + 1.0 * miraOtro}
          mirada={[miraOtro > 0.5 ? 8 : -8, 0]}
          cejas={{ y: -12 * lerp(f, fSorprenden + 4, fSorprenden + 12, 0, 1) }}
          boca={{ apertura: 0.35 * lerp(f, fSorprenden + 4, fSorprenden + 12, 0, 1), curva: 2 }}
          brazoIzq={{ hombro: 8 + 10 * sorpresa, codo: -10 - 135 * sorpresa, mano: "abierta" }}
          semilla={7}
        />
        <Fig
          quien="vecino"
          x={790}
          suelo={1490}
          ancho={360}
          giro={senala > 0.5 ? 0.6 : -0.6}
          mirada={[senala > 0.5 ? 9 : -9, senala > 0.5 ? -3 : 0]}
          cejas={{ y: -14 * sorpresa, rot: -4 * sorpresa }}
          boca={{ apertura: 0.5 * sorpresa * (1 - miraOtro * 0.5), curva: 4 }}
          brazoDer={{ hombro: 10 + 105 * senala, codo: -10 * senala, mano: senala > 0.5 ? "senala" : "abierta" }}
          semilla={3}
        />

      </Camara>
      <Cartel aparece={fNoEs} y={300}>
        <div style={textoCartel(78)}>
          ¿No es este el <span style={{ color: PAL.doradoOscuro }}>carpintero</span>?
        </div>
      </Cartel>
      <Referencia texto="Marcos 6:3" aparece={fCarpintero} y={196} />
      <Textura />
      <Sfx archivo="tela" en={fSorprenden} volumen={0.3} />
      <Sfx archivo="tela" en={fNoEs - 4} volumen={0.3} />
      <Sfx archivo="pagina" en={fNoEs} volumen={0.15} />
    </AbsoluteFill>
  );
};

// ---------- 5. EL OFICIO ----------
const Oficio: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fOficio = useMomento("oficio", 0.2);
  const fGriega = useMomento("griega", 0.35);
  const fTecton = useMomento("tecton", 0.45);
  const fArtesano = useMomento("artesano", 0.55);
  const fConstructor = useMomento("constructor", 0.66);
  const fMadera = useMomento("madera", 0.9);
  const entrada = lerp(f, 0, 18, 0, 1); // zoom hacia la puerta del taller
  // Mundo del taller: banco en y = 1180, tabla centrada en x = 540
  const SUP = 1180;
  const tablaX = lerp(f, 18, 36, 1300, 540, Easing.out(Easing.cubic)); // la tabla llega al banco
  const CORTE = 400; // posición de corte dentro de la tabla (px desde su borde izq.)
  const xCorte = 540 - 280 + CORTE;
  const marca = lerp(f, fArtesano + 2, fArtesano + 22, 0, 1);
  const serrando = f > fConstructor + 10 && f < duracion - 8;
  const vaiven = serrando ? osc(f, 14) : 0;
  const pedazo = lerp(f, duracion - 14, duracion - 2, 0, 1, Easing.in(Easing.quad));
  // posiciones de las manos según la acción
  let manoIzq: [number, number] = [380, 1150];
  let manoDer: [number, number] = [700, 1150];
  if (f >= 36 && f < fGriega) {
    // medir: estira el cordel de punta a punta
    manoIzq = [272, 1140];
    manoDer = [lerp(f, fOficio - 4, fOficio + 20, 300, 808), 1140];
  } else if (f >= fGriega && f < fArtesano) {
    manoIzq = [300, 1150];
    manoDer = [760, 1150];
  } else if (f >= fArtesano && f < fConstructor + 10) {
    // marcar con carbón y sujetar
    manoIzq = [lerp(f, fConstructor - 4, fConstructor + 6, 300, 600), 1150];
    manoDer = [xCorte + 6, 1134 + 46 * marca - 46];
  } else if (serrando) {
    manoIzq = [600, 1150];
    manoDer = [xCorte + 150 + 70 * vaiven, 1110];
  }
  const tomas = [
    { f: 0, x: 540, y: 1000, z: 1 },
    { f: fOficio - 6, x: 540, y: 1060, z: 1.0 },
    { f: fOficio + 4, x: 540, y: 1150, z: 1.9 }, // detalle: medir
    { f: fGriega, x: 540, y: 1150, z: 1.9 },
    { f: fGriega + 14, x: 540, y: 960, z: 1.0 }, // general: Tékton
    { f: fArtesano - 2, x: 540, y: 960, z: 1.0 },
    { f: fArtesano + 10, x: xCorte, y: 1140, z: 2.4 }, // detalle: marca
    { f: fConstructor, x: xCorte, y: 1140, z: 2.4 },
    { f: fConstructor + 12, x: 560, y: 1080, z: 1.3 }, // medio: sujeta
    { f: fMadera - 16, x: xCorte + 60, y: 1120, z: 2.1 }, // detalle: sierra
    { f: duracion, x: xCorte + 40, y: 1100, z: 1.8 },
  ];
  return (
    <AbsoluteFill>
      {/* interior del taller */}
      <AbsoluteFill style={{ opacity: entrada }}>
        <Camara tomas={tomas}>
          <Taller />
          {/* Jesús detrás del banco (los brazos se dibujan aparte para trabajar sobre la tabla) */}
          <FigCabeza quien="jesus" edad={1} x={540} y={640} ancho={560} giro={f > fArtesano && f < fConstructor ? 0.2 : 0} mirada={[0, 7]} cabeza={6} semilla={1} sinBrazos />
          <BancoCarpintero x={160} y={SUP} ancho={760} />
          {/* herramientas sobre el banco (quedan fijas entre planos) */}
          <En x={200} y={SUP - 60}>
            <div style={{ scale: "0.5", transformOrigin: "0 0" }}>
              <Escuadra />
            </div>
          </En>
          <En x={830} y={SUP - 40}>
            <div style={{ rotate: "90deg", transformOrigin: "0 0", scale: "0.6" }}>
              <Formon />
            </div>
          </En>
          {/* tabla */}
          <En x={tablaX} y={SUP}>
            <Tabla largo={560} corte={CORTE} marca={marca} />
          </En>
          {/* pedazo cortado que cae */}
          {pedazo > 0 ? (
            <En x={xCorte + 70} y={SUP + pedazo * 260} rot={pedazo * 24} opacidad={1 - pedazo * 0.3}>
              <div style={{ position: "absolute", left: -70, top: -46, width: 140, height: 46, background: "#D9A566", borderRadius: 4 }} />
            </En>
          ) : null}
          {/* cordel de medir */}
          {f >= 36 && f < fGriega + 6 ? (
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
              <line x1={272} y1={SUP - 50} x2={manoDer[0]} y2={SUP - 50} stroke="#E9DDBB" strokeWidth={5} />
              {Array.from({ length: 7 }, (_, i) => {
                const x = 272 + i * 80;
                return x < manoDer[0] ? <circle key={i} cx={x} cy={SUP - 50} r={6} fill="#8C6A3A" /> : null;
              })}
            </svg>
          ) : null}
          {/* carbón en la mano */}
          {f >= fArtesano && f < fConstructor + 10 ? <div style={{ position: "absolute", left: manoDer[0] - 8, top: manoDer[1] - 70, width: 16, height: 60, borderRadius: 6, background: "#1E1A16", rotate: "12deg" }} /> : null}
          {/* serrucho */}
          {serrando ? (
            <div style={{ position: "absolute", left: xCorte - 150 + 70 * vaiven, top: SUP - 120, rotate: "18deg", transformOrigin: "0 0" }}>
              <Serrucho escala={1.1} />
            </div>
          ) : null}
          <Particulas x={xCorte} y={SUP} desde={fConstructor + 12} hasta={duracion - 10} n={26} />
          <BrazoLibre quien="jesus" hombro={[420, 830]} mano={manoIzq} codoHacia={-1} />
          <BrazoLibre quien="jesus" hombro={[660, 830]} mano={manoDer} codoHacia={1} />
        </Camara>
      </AbsoluteFill>
      {/* entrada: acercamiento a la puerta del taller desde la calle */}
      {entrada < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - entrada }}>
          <Camara tomas={[{ f: 0, x: 900, y: 990, z: 1.0 }, { f: 18, x: 1160, y: 1060, z: 3.2 }]}>
            <CalleNazaret />
          </Camara>
        </AbsoluteFill>
      ) : null}
      <Cartel aparece={fTecton - 4} hasta={fArtesano - 2} y={260}>
        <div style={textoCartel(96)}>Tékton</div>
        <div style={{ ...textoCartel(50, 800), marginTop: 8 }}>Artesano / constructor</div>
      </Cartel>
      <Textura />
      <Sfx archivo="whoosh" en={0} volumen={0.2} />
      <Sfx archivo="tabla" en={34} volumen={0.45} />
      <Sfx archivo="tela" en={fOficio - 2} volumen={0.25} />
      <Sfx archivo="marca" en={fArtesano + 2} volumen={0.35} />
      <Sfx archivo="tabla" en={fConstructor + 4} volumen={0.3} />
      {serrando || f < fConstructor + 10
        ? Array.from({ length: Math.max(0, Math.ceil((duracion - fConstructor - 20) / 28)) }, (_, i) => <Sfx key={i} archivo="sierra" en={fConstructor + 10 + i * 28} volumen={0.3} />)
        : null}
      <Sfx archivo="tabla" en={duracion - 4} volumen={0.4} />
    </AbsoluteFill>
  );
};

// ---------- 6. SÉFORIS ----------
const Seforis: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fNazaret = useMomento("nazaret", 0.12);
  const fSeforis = useMomento("seforis", 0.38);
  const fCiudad = useMomento("ciudad", 0.5);
  const fArtesanos = useMomento("artesanos", 0.82);
  const NAZ: [number, number] = [640, 1180];
  const SEF: [number, number] = [430, 620];
  const ruta = lerp(f, fNazaret + 4, fSeforis + 6, 0, 1);
  const obra = lerp(f, fCiudad - 6, fCiudad + 10, 0, 1);
  const muro = lerp(f, fCiudad + 6, duracion, 0, 1, Easing.linear);
  return (
    <AbsoluteFill style={{ background: PAL.noche }}>
      {/* mapa */}
      <AbsoluteFill style={{ opacity: 1 - obra }}>
        <Camara
          tomas={[
            { f: 0, x: 540, y: 920, z: 1 },
            { f: fNazaret + 4, x: NAZ[0], y: NAZ[1] - 80, z: 1.25 },
            { f: fSeforis + 6, x: SEF[0], y: SEF[1] + 60, z: 1.3 },
            { f: fCiudad + 8, x: SEF[0], y: SEF[1], z: 3 },
          ]}
        >
          <div style={{ position: "absolute", left: -600, top: -600, width: 2400, height: 3200, background: "#1B130C" }} />
          <Pergamino x={60} y={300} w={960} h={1120}>
            <MontesMapa puntos={[[200, 540], [270, 570], [760, 420], [830, 460], [700, 760], [180, 880]]} />
            <div style={{ position: "absolute", left: 40, top: 30, fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 52, color: PAL.tinta, opacity: 0.55, letterSpacing: 4 }}>GALILEA</div>
          </Pergamino>
          <Ruta p0={NAZ} p1={SEF} curva={-40} progreso={ruta} color={PAL.tinta} grosor={10} />
          <PuntoMapa x={NAZ[0]} y={NAZ[1]} nombre="Nazaret" lado="der" />
          <PuntoMapa x={SEF[0]} y={SEF[1]} nombre="Séforis" lado="arriba" aparece={fSeforis - 6} />
          {/* distancia (≈ 6 km, ver fuentes.md) */}
          <div style={{ position: "absolute", left: 560, top: 860, fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 44, color: PAL.tinta, opacity: lerp(f, fSeforis, fSeforis + 10, 0, 1) }}>≈ 6 km</div>
          {/* ciudad dibujada en el mapa */}
          <svg style={{ position: "absolute", left: SEF[0] - 70, top: SEF[1] - 140, opacity: lerp(f, fSeforis, fSeforis + 10, 0, 1) }} width={140} height={110}>
            <path d="M 10 100 L 10 50 L 40 50 L 40 30 L 70 30 L 70 50 L 100 50 L 100 40 L 130 40 L 130 100 Z" fill="none" stroke={PAL.tinta} strokeWidth={5} />
            <path d="M 60 30 L 60 10 L 90 10" stroke={PAL.tinta} strokeWidth={4} fill="none" strokeDasharray="6 6" />
          </svg>
        </Camara>
      </AbsoluteFill>
      {/* obra en reconstrucción */}
      {obra > 0 ? (
        <AbsoluteFill style={{ opacity: obra }}>
          <Camara tomas={[{ f: fCiudad, x: 540, y: 960, z: 1.15 }, { f: fArtesanos, x: 620, y: 1000, z: 1.0 }, { f: duracion, x: 700, y: 1000, z: 1.05 }]}>
            <Obra muro={muro} f={f} desde={fCiudad} />
          </Camara>
        </AbsoluteFill>
      ) : null}
      <Textura />
      <Sfx archivo="pagina" en={0} volumen={0.25} />
      <Sfx archivo="marca" en={fNazaret + 4} volumen={0.2} />
      <Sfx archivo="whoosh" en={fCiudad - 4} volumen={0.25} />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={i} archivo="piedra" en={fCiudad + 14 + i * 16} volumen={0.3} />
      ))}
      {[0, 1, 2].map((i) => (
        <Sfx key={`m${i}`} archivo="madera" en={fCiudad + 22 + i * 20} volumen={0.25} />
      ))}
    </AbsoluteFill>
  );
};

// Obra de construcción (Séforis y la casa de la escena siguiente comparten este mundo).
const SUELO_OBRA = 1380;
const Obra: React.FC<{ muro: number; f: number; desde: number; sinObreros?: boolean }> = ({ muro, f, desde, sinObreros }) => {
  const t = f - desde;
  const hileras = 5;
  const visibles = Math.floor(muro * hileras * 4.99);
  return (
    <>
      <Cielo tono="dia" />
      <Sol x={850} y={330} r={60} />
      <Colinas y={900} />
      <div style={{ position: "absolute", left: -1200, top: SUELO_OBRA, width: 4000, height: 700, background: "linear-gradient(180deg,#B9A07A,#8E7553)" }} />
      {/* edificios a medio hacer al fondo */}
      <svg style={{ position: "absolute", left: -200, top: 760 }} width={1600} height={640}>
        <rect x={0} y={260} width={420} height={380} fill="#CDBB98" />
        <rect x={0} y={260} width={420} height={30} fill="#B8A57F" />
        <rect x={1080} y={200} width={460} height={440} fill="#D4C3A0" />
        <rect x={1180} y={200} width={60} height={440} fill="#BFAE8A" />
        {/* andamio */}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={1060 + i * 150} y={120} width={14} height={520} fill={PAL.madera} />
        ))}
        {[0, 1, 2].map((i) => (
          <rect key={`h${i}`} x={1050} y={200 + i * 150} width={480} height={14} fill={PAL.maderaClara} />
        ))}
      </svg>
      {/* muro que se levanta (sillares que se apilan) */}
      <div style={{ position: "absolute", left: 300, top: SUELO_OBRA }}>
        {Array.from({ length: hileras * 4 }, (_, i) => {
          const fila = Math.floor(i / 4);
          const col = i % 4;
          if (i > visibles) return null;
          const cae = i === visibles ? (muro * hileras * 4.99) % 1 : 1;
          return (
            <div key={i} style={{ position: "absolute", left: col * 124 + (fila % 2) * 62, top: -(fila + 1) * 72 - (1 - cae) * 120, opacity: Math.min(1, cae * 2) }}>
              <Sillar w={120} h={70} tono={i} />
            </div>
          );
        })}
      </div>
      {sinObreros ? null : (
        <>
          {/* dos obreros llevan una viga */}
          {(() => {
            const x = -300 + ((t * 4) % 1700);
            const levanta: Brazo = { hombro: 172, codo: 0, mano: "puno" };
            const m = manoDe(x, SUELO_OBRA + 120, 300, levanta, 1, true);
            return (
              <>
                <Fig quien="obrero" corta x={x} suelo={SUELO_OBRA + 120} ancho={300} caminando={1} paso={t / 20} semilla={3} brazoDer={{ hombro: 172, codo: 0, mano: "puno" }} />
                <Fig quien="obrero2" corta x={x + 360} suelo={SUELO_OBRA + 120} ancho={300} caminando={1} paso={t / 20 + 0.5} semilla={5} brazoIzq={{ hombro: 172, codo: 0, mano: "puno" }} />
                <div style={{ position: "absolute", left: x - 60, top: m.y - 34 - Math.abs(Math.sin((t / 20) * Math.PI * 2)) * 6, rotate: "-1deg" }}>
                  <Viga largo={480} grosor={44} />
                </div>
              </>
            );
          })()}
          {/* obrero que prepara una viga con la azuela */}
          <div style={{ position: "absolute", left: 760, top: SUELO_OBRA - 40 }}>
            <Viga largo={300} grosor={40} />
            <div style={{ position: "absolute", left: 20, top: 40, width: 24, height: 80, background: PAL.maderaOscura }} />
            <div style={{ position: "absolute", left: 250, top: 40, width: 24, height: 80, background: PAL.maderaOscura }} />
          </div>
          {(() => {
            const g = osc(t, 20);
            const b: Brazo = { hombro: 40 + 70 * g, codo: 40 - 30 * g, mano: "puno" };
            const m = manoDe(1000, SUELO_OBRA + 60, 300, b, -1, true);
            return (
              <>
                <Fig quien="vecino" corta x={1000} suelo={SUELO_OBRA + 60} ancho={300} giro={-0.6} mirada={[-6, 6]} semilla={7} brazoIzq={b} brazoDer={{ hombro: 30, codo: 60, mano: "puno" }} />
                {/* mazo en la mano (el mango sigue al antebrazo) */}
                <div style={{ position: "absolute", left: m.x, top: m.y, transformOrigin: "0 0", transform: `rotate(${m.ang + 180}deg) scale(0.6)` }}>
                  <div style={{ position: "absolute", left: -80, top: -185 }}>
                    <Mazo />
                  </div>
                </div>
              </>
            );
          })()}
          <Particulas x={900} y={SUELO_OBRA - 40} desde={desde + 10} hasta={desde + 200} n={18} color="#C9A27A" />
        </>
      )}
    </>
  );
};

// ---------- 7. CASAS Y TORRES ----------
const Casas: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fCasa = useMomento("casa", 0.4);
  const fCimientos = useMomento("cimientos", 0.55);
  const fTorre = useMomento("torre", 0.68);
  const fCalcular = useMomento("calcular", 0.82);
  const fConstruir = useMomento("construir", 0.94);
  const levanta = lerp(f, 0, fCasa + 4, 0, 1);
  const corte = lerp(f, fCimientos - 4, fCimientos + 12, 0, 1);
  const flechas = lerp(f, fCimientos + 8, fCimientos + 20, 0, 1);
  // mundo: casa en x 540, torre y constructor en x 1900
  const TX = 1880;
  const fichas = Math.floor(lerp(f, fCalcular - 4, fCalcular + 30, 0, 6.99, Easing.linear));
  const base = lerp(f, fConstruir - 2, duracion, 0, 1);
  return (
    <AbsoluteFill>
      <Camara
        tomas={[
          { f: 0, x: 540, y: 1000, z: 1.0 },
          { f: fCimientos - 4, x: 540, y: 1060, z: 1.0 },
          { f: fCimientos + 10, x: 540, y: 1260, z: 1.0 },
          { f: fTorre - 6, x: 560, y: 1200, z: 1.0 },
          { f: fTorre + 10, x: TX, y: 1060, z: 1.0 },
          { f: fCalcular + 6, x: TX + 60, y: 1180, z: 1.45 },
          { f: duracion, x: TX, y: 1080, z: 1.05 },
        ]}
      >
        <Cielo tono="dia" />
        <Sol x={1300} y={330} r={60} />
        <Colinas y={900} ancho={6000} />
        {/* suelo (se vuelve corte del terreno) */}
        <div style={{ position: "absolute", left: -1200, top: SUELO_OBRA, width: 5000, height: 900, background: "linear-gradient(180deg,#B9A07A,#8E7553)" }} />
        <svg style={{ position: "absolute", left: -100, top: SUELO_OBRA, opacity: corte }} width={1300} height={700}>
          <rect x={0} y={0} width={1300} height={700} fill="#7A5E40" />
          {/* capas de tierra */}
          <path d="M 0 140 Q 300 120 650 150 T 1300 140 L 1300 260 L 0 260 Z" fill="#6A5036" />
          {/* roca */}
          <path d="M 0 300 Q 200 260 400 290 Q 650 250 900 290 Q 1100 270 1300 300 L 1300 700 L 0 700 Z" fill="#8B8C8F" />
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d={`M ${60 + i * 160} ${360 + (i % 3) * 40} l 40 20 l -20 30`} stroke="#6E6F73" strokeWidth={6} fill="none" />
          ))}
          {/* cimientos bajo las paredes, hasta la roca */}
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={330 + (i % 2) * 20} y={i * 58} width={130} height={56} rx={6} fill={["#D2C09C", "#C6B28A", "#DCCBA8"][i % 3]} stroke="#8E7A55" strokeWidth={3} />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={`d${i}`} x={830 + (i % 2) * 20} y={i * 58} width={130} height={56} rx={6} fill={["#DCCBA8", "#D2C09C", "#C6B28A"][i % 3]} stroke="#8E7A55" strokeWidth={3} />
          ))}
          {/* flechas de carga */}
          {[400, 900].map((x) => (
            <g key={x} opacity={flechas}>
              <line x1={x} y1={-260} x2={x} y2={-260 + 220 * flechas} stroke={PAL.dorado} strokeWidth={14} />
              <path d={`M ${x - 26} ${-60 + 0 * flechas} l 26 30 l 26 -30`} stroke={PAL.dorado} strokeWidth={14} fill="none" opacity={flechas} />
            </g>
          ))}
        </svg>
        {/* casa que se levanta */}
        <div style={{ position: "absolute", left: 220, top: SUELO_OBRA - 520 * levanta, width: 640, height: 520 * levanta, overflow: "hidden" }}>
          <svg width={640} height={520} style={{ position: "absolute", left: 0, bottom: 0 }}>
            <rect x={20} y={40} width={600} height={480} fill="#D4BE96" />
            {Array.from({ length: 7 }, (_, r) => (
              <line key={r} x1={20} y1={100 + r * 64} x2={620} y2={100 + r * 64} stroke="#A8946E" strokeWidth={3} />
            ))}
            <rect x={0} y={20} width={640} height={36} fill="#8C6E4C" />
            {Array.from({ length: 9 }, (_, i) => (
              <rect key={i} x={30 + i * 70} y={50} width={18} height={18} fill="#5E452E" />
            ))}
            <path d="M 240 520 L 240 300 Q 320 250 400 300 L 400 520 Z" fill="#4A3424" />
            <rect x={470} y={210} width={90} height={80} rx={8} fill="#3A2A1E" />
          </svg>
        </div>
        {/* torre: contorno punteado + constructor que calcula */}
        <svg style={{ position: "absolute", left: TX - 180, top: SUELO_OBRA - 900, overflow: "visible" }} width={360} height={900}>
          <path d="M 20 900 L 40 140 L 20 140 L 20 80 L 80 80 L 80 120 L 140 120 L 140 80 L 220 80 L 220 120 L 280 120 L 280 80 L 340 80 L 340 140 L 320 140 L 340 900" stroke={PAL.crema} strokeWidth={6} strokeDasharray="18 14" fill="rgba(247,241,227,0.08)" opacity={lerp(f, fTorre, fTorre + 12, 0, 1)} />
        </svg>
        <div style={{ position: "absolute", left: TX - 160, top: SUELO_OBRA }}>
          {Array.from({ length: 8 }, (_, i) => {
            const vis = base * 8 - i;
            if (vis <= 0) return null;
            const fila = Math.floor(i / 2);
            return (
              <div key={i} style={{ position: "absolute", left: (i % 2) * 160 + (fila % 2) * 10, top: -(fila + 1) * 68 - (1 - Math.min(1, vis)) * 90, opacity: Math.min(1, vis * 2) }}>
                <Sillar w={150} h={66} tono={i} />
              </div>
            );
          })}
        </div>
        {/* pila de piedras y mesa con fichas */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ position: "absolute", left: TX + 230 + (i % 3) * 70, top: SUELO_OBRA - 56 - Math.floor(i / 3) * 52 }}>
            <Sillar w={90} h={50} tono={i} />
          </div>
        ))}
        <div style={{ position: "absolute", left: TX + 170, top: SUELO_OBRA - 250, width: 300, height: 26, background: PAL.maderaClara, borderRadius: 6 }} />
        <div style={{ position: "absolute", left: TX + 190, top: SUELO_OBRA - 224, width: 20, height: 224, background: PAL.madera }} />
        <div style={{ position: "absolute", left: TX + 430, top: SUELO_OBRA - 224, width: 20, height: 224, background: PAL.madera }} />
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: TX + 200 + (i % 4) * 56, top: SUELO_OBRA - 274 - Math.floor(i / 4) * 26 + (i < fichas ? 0 : -400), width: 40, height: 18, borderRadius: 9, background: PAL.dorado, border: `3px solid ${PAL.doradoOscuro}`, opacity: i < fichas ? 1 : 0 }} />
        ))}
        {/* tablilla con marcas de cuenta */}
        <div style={{ position: "absolute", left: TX + 380, top: SUELO_OBRA - 330, width: 90, height: 70, background: PAL.pergamino, border: `3px solid ${PAL.pergaminoOscuro}`, rotate: "-8deg" }}>
          <svg width={90} height={70}>
            {Array.from({ length: Math.min(6, fichas) }, (_, i) => (
              <line key={i} x1={12 + i * 12} y1={14} x2={12 + i * 12} y2={50} stroke={PAL.tinta} strokeWidth={4} />
            ))}
          </svg>
        </div>
        <Fig
          quien="obrero"
          x={TX + 300}
          suelo={SUELO_OBRA + 10}
          ancho={330}
          corta
          giro={f < fCalcular ? -0.7 : 0.3}
          mirada={f < fCalcular ? [-8, -6] : [4, 8]}
          cabeza={f < fCalcular ? -6 : 6}
          brazoDer={f >= fCalcular - 4 && f < fConstruir ? { hombro: 50 + 12 * osc(f, 12), codo: 70, mano: "senala" } : { hombro: 20, codo: 30 }}
          brazoIzq={f < fCalcular ? { hombro: 120, codo: 20, mano: "senala" } : { hombro: 30, codo: 60 }}
          semilla={3}
        />
      </Camara>
      <Referencia texto="Mateo 7:24–27" aparece={fCasa} hasta={fTorre - 4} />
      <Referencia texto="Lucas 14:28–30" aparece={fTorre + 6} />
      <Textura />
      {[0, 1, 2].map((i) => (
        <Sfx key={i} archivo="piedra" en={6 + i * 14} volumen={0.25} />
      ))}
      <Sfx archivo="whoosh" en={fCimientos - 4} volumen={0.2} />
      <Sfx archivo="piedra" en={fCimientos + 12} volumen={0.35} />
      <Sfx archivo="whoosh" en={fTorre} volumen={0.2} />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={`c${i}`} archivo="cincel" en={fCalcular + i * 7} volumen={0.15} />
      ))}
      <Sfx archivo="piedra" en={fConstruir + 4} volumen={0.3} />
    </AbsoluteFill>
  );
};

// ---------- 8. LAS PISTAS QUE QUEDAN ----------
const Pistas: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fDetallada = useMomento("detallada", 0.15);
  const fPistas = useMomento("pistas", 0.3);
  const fNazaret = useMomento("nazaret", 0.36);
  const fFamilia = useMomento("familia", 0.44);
  const fOficio = useMomento("oficio", 0.52);
  const fAntes = useMomento("antes", 0.6);
  const fMultitudes = useMomento("multitudes", 0.7);
  const fManos = useMomento("manos", 0.92);
  const boca = useAperturaBoca(true);
  const rollo = lerp(f, 0, fDetallada + 10, 0, 1);
  // mundo horizontal: rollo (x 540), Nazaret (1700), familia (2700), oficio (3700), manos y ladera (4800)
  const tomas = [
    { f: 0, x: 540, y: 960, z: 1 },
    { f: fPistas - 6, x: 540, y: 960, z: 1 },
    { f: fNazaret + 4, x: 1700, y: 1000, z: 1 },
    { f: fFamilia + 4, x: 2700, y: 1000, z: 1 },
    { f: fOficio + 4, x: 3700, y: 1080, z: 1.05 },
    { f: Math.max(fOficio + 10, fAntes - 8), x: 3720, y: 1070, z: 1.08 }, // se queda en "Un oficio" hasta "Antes"
    { f: fAntes + 8, x: 4800, y: 1180, z: 2.6 }, // primer plano de las manos
    { f: fMultitudes + 4, x: 4800, y: 1150, z: 2.4 },
    { f: fManos + 6, x: 4800, y: 1020, z: 0.95 }, // se abre: enseña ante un grupo
    { f: duracion, x: 4800, y: 1000, z: 0.92 },
  ];
  const golpe = osc(f, 16);
  const abre = lerp(f, fMultitudes - 6, fMultitudes + 12, 0, 1); // de taller a ladera (fundido corto)
  const hilo = lerp(f, fPistas, fOficio + 8, 0, 1);
  return (
    <AbsoluteFill>
      <Camara tomas={tomas}>
        <div style={{ position: "absolute", left: -1000, top: -800, width: 8000, height: 3600, background: "linear-gradient(180deg,#14223F 0%,#24395F 60%,#3E5A86 100%)" }} />
        {/* rollo casi en blanco: "no tenemos una historia detallada" */}
        <div style={{ position: "absolute", left: 540 - (40 + 780 * rollo) / 2 - 20, top: 860 }}>
          <Rollo ancho={780} abierto={rollo} marcas={0.12} />
          <div style={{ position: "absolute", left: (40 + 780 * rollo) / 2 - 10, top: -150, fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 100, color: PAL.pergamino, opacity: lerp(f, fDetallada, fDetallada + 10, 0, 0.8) }}>?</div>
        </div>
        {/* hilo que une las pistas */}
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          <path d="M 1700 700 Q 2200 820 2700 700 Q 3200 820 3700 700" stroke={PAL.coral} strokeWidth={6} fill="none" strokeDasharray={2200} strokeDashoffset={2200 * (1 - hilo)} />
        </svg>
        {/* pista 1: Nazaret */}
        <Vineta x={1700} titulo="Nazaret" aparece={fNazaret - 10}>
          <div style={{ position: "absolute", left: -360, top: 0, width: 720, height: 520, overflow: "hidden", borderRadius: 24 }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#8FA8C4,#EBD9B4)" }} />
            <div style={{ position: "absolute", left: 0, top: 260, width: 720, height: 300, background: "#86784F", borderRadius: "50% 50% 0 0" }} />
            <Casita x={120} y={380} ancho={200} alto={170} />
            <Casita x={300} y={330} ancho={180} alto={160} color="#D4B48C" />
            <Casita x={460} y={390} ancho={200} alto={170} color="#C49A70" />
          </div>
        </Vineta>
        {/* pista 2: su familia */}
        <Vineta x={2700} titulo="Su familia" aparece={fFamilia - 10}>
          <div style={{ position: "absolute", left: -360, top: 0, width: 720, height: 520, overflow: "hidden", borderRadius: 24, background: "linear-gradient(180deg,#C9A27A,#A88259)" }}>
            <div style={{ position: "absolute", left: 270, top: 150, width: 180, height: 370, background: "#4A3424", borderRadius: "90px 90px 0 0" }} />
            <Fig quien="jose" x={190} suelo={560} ancho={210} giro={0.4} mirada={[6, 0]} semilla={4} />
            <Fig quien="jesus" edad={0.15} x={360} suelo={575} ancho={180} mirada={[0, 0]} semilla={1} boca={{ curva: 8 }} />
            <Fig quien="maria" x={530} suelo={565} ancho={205} giro={-0.4} mirada={[-6, 0]} semilla={6} boca={{ curva: 8 }} />
          </div>
        </Vineta>
        {/* pista 3: un oficio */}
        <Vineta x={3700} titulo="Un oficio" aparece={fOficio - 10}>
          <div style={{ position: "absolute", left: -360, top: 0, width: 720, height: 520, overflow: "hidden", borderRadius: 24, background: "linear-gradient(180deg,#4A3826,#8A6A48)" }}>
            <div style={{ position: "absolute", left: 60, top: 300 }}>
              <BancoCarpintero x={0} y={0} ancho={600} />
            </div>
            <div style={{ position: "absolute", left: 120, top: 210, scale: "0.7", transformOrigin: "0 0" }}>
              <Serrucho />
            </div>
            <div style={{ position: "absolute", left: 430, top: 160, scale: "0.7", transformOrigin: "0 0" }}>
              <Mazo />
            </div>
            <div style={{ position: "absolute", left: 560, top: 190, scale: "0.6", transformOrigin: "0 0" }}>
              <Escuadra />
            </div>
          </div>
        </Vineta>
        {/* manos que trabajan → Jesús enseña ante un grupo (mismo lugar del mundo) */}
        <div style={{ position: "absolute", left: 4800 - 1300, top: 0, width: 2600, height: 1920, opacity: abre, clipPath: `inset(-1200px -1200px -1200px ${Math.max(0, 760 - 1300 * abre)}px)` }}>
          <div style={{ position: "absolute", left: -400, top: -600, width: 3400, height: 2000, background: "linear-gradient(180deg,#3E5A86 0%,#8FA8C4 60%,#EBD9B4 100%)" }} />
          <div style={{ position: "absolute", left: 0, top: 0 }}>
            <Colinas y={880} desde={0} ancho={2600} />
          </div>
          <div style={{ position: "absolute", left: -200, top: 1300, width: 3000, height: 1400, background: "linear-gradient(180deg,#8E9A72,#6F7F4E 50%)" }} />
        </div>
        {abre > 0 ? (
          <div style={{ opacity: abre }}>
            {[
              { q: "oyente1" as Quien, x: 4330, s: 1430, a: 240, g: 0.6 },
              { q: "oyente2" as Quien, x: 4550, s: 1470, a: 260, g: 0.4 },
              { q: "vecina" as Quien, x: 5050, s: 1470, a: 260, g: -0.4 },
              { q: "oyente3" as Quien, x: 5280, s: 1430, a: 240, g: -0.6 },
              { q: "vecino" as Quien, x: 4200, s: 1530, a: 280, g: 0.6 },
              { q: "maria" as Quien, x: 5420, s: 1540, a: 270, g: -0.6 },
            ].map((o, i) => (
              <Fig key={i} quien={o.q} sentado x={o.x} suelo={o.s} ancho={o.a} giro={o.g} mirada={[o.g * 10, -4]} semilla={i + 2} />
            ))}
            <Fig quien="jesus" edad={1} x={4800} suelo={1350} ancho={320} bocaAuto={boca * 0.7} brazoDer={gestoEnsenar(f)} brazoIzq={gestoEnsenar(f, 0.7)} semilla={1} />
          </div>
        ) : null}
        {/* banco con las manos (se desvanece rápido al abrir el plano) */}
        <div style={{ opacity: 1 - abre }}>
          <div style={{ position: "absolute", left: 4060, top: 0, width: 1300, height: 1920, background: "linear-gradient(90deg, rgba(74,56,38,0) 0px, #5E4632 260px)" }} />
          <BancoCarpintero x={4800 - 380} y={1180} ancho={760} />
          <En x={4800} y={1180}>
            <Tabla largo={560} />
          </En>
          {/* formón (mano izquierda) y mazo (mano derecha): golpes */}
          {(() => {
            const manoMazo: [number, number] = [4990, 1060 - 110 * golpe];
            const angMazo = -35 + 30 * (1 - golpe);
            return (
              <>
                <div style={{ position: "absolute", left: 4790, top: 1180 - 216 - 18 * golpe, rotate: "6deg" }}>
                  <Formon />
                </div>
                <BrazoLibre quien="jesus" hombro={[4650, 770]} mano={[4812, 1010 - 18 * golpe]} codoHacia={-1} largo={[150, 165]} />
                <div style={{ position: "absolute", left: manoMazo[0], top: manoMazo[1], transformOrigin: "0 0", transform: `rotate(${angMazo}deg)` }}>
                  <div style={{ position: "absolute", left: -80, top: -170 }}>
                    <Mazo />
                  </div>
                </div>
                <BrazoLibre quien="jesus" hombro={[4970, 770]} mano={manoMazo} codoHacia={1} largo={[150, 165]} />
              </>
            );
          })()}
          <Particulas x={4810} y={1170} desde={fAntes} hasta={fManos} n={20} />
        </div>
      </Camara>
      <Textura />
      <Sfx archivo="pagina" en={4} volumen={0.3} />
      <Sfx archivo="whoosh" en={fNazaret - 4} volumen={0.2} />
      <Sfx archivo="whoosh" en={fFamilia - 4} volumen={0.2} />
      <Sfx archivo="whoosh" en={fOficio - 4} volumen={0.2} />
      {Array.from({ length: Math.max(0, Math.ceil((fMultitudes - fAntes) / 16)) }, (_, i) => (
        <Sfx key={i} archivo="madera" en={fAntes + 8 + i * 16} volumen={0.25} />
      ))}
    </AbsoluteFill>
  );
};

// Viñeta de pista: marco con alfiler y rótulo.
const Vineta: React.FC<{ x: number; titulo: string; aparece: number; children: React.ReactNode }> = ({ x, titulo, aparece, children }) => {
  const f = useCurrentFrame();
  const e = lerp(f, aparece, aparece + 12, 0, 1, Easing.out(Easing.back(1.4)));
  return (
    <div style={{ position: "absolute", left: x, top: 720, scale: String(0.85 + 0.15 * e), opacity: Math.min(1, e * 1.5) }}>
      <div style={{ position: "absolute", left: -380, top: -20, width: 760, height: 560, borderRadius: 30, background: PAL.pergamino, boxShadow: "0 18px 50px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", left: -18, top: -38, width: 36, height: 36, borderRadius: 18, background: PAL.coral, border: `5px solid ${PAL.tinta}` }} />
      {children}
      <div style={{ position: "absolute", left: -300, width: 600, top: 560, textAlign: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 70, color: PAL.crema, textShadow: "0 6px 18px rgba(0,0,0,0.6)" }}>{titulo}</div>
    </div>
  );
};

// ---------- 9. CIERRE ----------
export const Cierre: React.FC<PropsEscena> = ({ escena }) => {
  const f = useCurrentFrame();
  const apertura = lerp(f, 6, 30, 0, 1);
  const luz = lerp(f, 18, 50, 0, 1);
  const titulo = lerp(f, 24, 40, 0, 1, Easing.out(Easing.cubic));
  const lema = lerp(f, 38, 52, 0, 1);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #24395F 0%, #0B1426 70%)" }}>
      {/* rayos de luz desde el libro */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: luz }}>
        <defs>
          <radialGradient id="cierre-luz" cx="50%" cy="58%" r="45%">
            <stop offset="0%" stopColor="#FFE9B0" stopOpacity={0.85} />
            <stop offset="100%" stopColor="#FFE9B0" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={540} cy={1120} r={760} fill="url(#cierre-luz)" />
        {Array.from({ length: 9 }, (_, i) => {
          const a = -150 + i * 15 + Math.sin(f / 30 + i) * 2;
          const r = (a * Math.PI) / 180;
          return <path key={i} d={`M 540 1120 L ${540 + Math.cos(r - 0.04) * 1100} ${1120 + Math.sin(r - 0.04) * 1100} L ${540 + Math.cos(r + 0.04) * 1100} ${1120 + Math.sin(r + 0.04) * 1100} Z`} fill="#FFE9B0" opacity={0.12} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: 540, top: 1150 + Math.sin(f / 40) * 4 }}>
        <LibroAntiguo
          apertura={apertura}
          w={330}
          h={420}
          tapa={<TapaLibro w={330} h={420} />}
          izquierda={<Renglones x={40} y={50} ancho={250} n={10} paso={32} />}
          derecha={<Renglones x={40} y={50} ancho={250} n={10} paso={32} />}
        />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", opacity: titulo, translate: `0px ${(1 - titulo) * 40}px` }}>
        <div style={{ fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 112, lineHeight: 1.0, color: PAL.crema, textShadow: "0 0 40px rgba(242,193,78,0.55), 0 8px 20px rgba(0,0,0,0.5)" }}>
          Versículo
          <br />
          <span style={{ color: PAL.dorado }}>Oculto</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 830, textAlign: "center", opacity: lema, fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: (escena.lema ?? "").length > 36 ? 42 : 48, whiteSpace: "nowrap", color: PAL.pergamino }}>
        {escena.lema ?? "Historias y curiosidades de la Biblia"}
      </div>
      <Textura fuerza={0.7} />
      <Sfx archivo="pagina" en={4} volumen={0.45} />
      <Sfx archivo="brillo" en={20} volumen={0.3} />
    </AbsoluteFill>
  );
};

export const ESCENAS_JESUS_12_30: Record<string, React.FC<{ escena: EscenaAnimada }>> = {
  "jesus-12-30/salto": Salto,
  "jesus-12-30/templo": Busqueda,
  "jesus-12-30/libro": Libro1894,
  "jesus-12-30/vecinos": Vecinos,
  "jesus-12-30/oficio": Oficio,
  "jesus-12-30/seforis": Seforis,
  "jesus-12-30/casas": Casas,
  "jesus-12-30/pistas": Pistas,
  "jesus-12-30/cierre": Cierre,
};
