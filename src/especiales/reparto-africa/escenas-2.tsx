// "La repartición de África" · escenas 5 a 8: Ocupación Efectiva, el Congo de Leopoldo II,
// África en 1914 y las fronteras rectas (con el cierre del canal). Ilustraciones originales por frames.
import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from "remotion";
import { useEscena } from "../../video/contexto";
import { FUENTE_SERIFA, FUENTE_TEXTO, FUENTE_TITULO } from "../../marca/fuentes";
import { Camara, Capa, Textura, lerp } from "../jesus-12-30/escenarios";
import { Polvo, azar } from "../ambiente";
import { Sfx, useFinDePalabra, useMomento, useResorte } from "../comun";
import { COLOR_POTENCIA, Chispas, CierreCanal, H, Humo, MAPA_H, MAPA_W, MapaAfrica, NOMBRE_POTENCIA, Placa, Rotulito, cl, geo } from "../historia/piezas";
import { AFRICA_PAISES, type Potencia } from "../historia/africa-datos";
import { Fundido, PAPEL, tomasSeguras, type PropsEscena } from "./escenas-1";

const fuera = Easing.out(Easing.cubic);
const MX = 172;
const MY = 420;
const ME = 0.8;
// lon/lat → coordenadas de mundo (mapa en x=172, y=420, escala 0,8)
const enMapa = (lon: number, lat: number): [number, number] => {
  const [x, y] = geo(lon, lat);
  return [MX + x * ME, MY + y * ME];
};
const MAR = "radial-gradient(ellipse at 50% 45%, #1F4660 0%, #12304A 55%, #0B132B 100%)";
const SOMBRA = "linear-gradient(180deg, #14060C 0%, #0B132B 100%)";
const ARENA = "radial-gradient(ellipse at 50% 45%, #EBC987 0%, #D9A85C 60%, #B9853F 100%)";

// ================= 5. OCUPACIÓN EFECTIVA =================
const PINES: [number, number, Potencia][] = [
  [3, 34, "FR"], [-14, 15, "FR"], [-3, 16, "FR"], [15, 12, "FR"], [47, -19, "FR"], [10, 34, "FR"], [14, -2, "FR"],
  [31, 28, "GB"], [32, 15, "GB"], [8, 9, "GB"], [-1, 7, "GB"], [37, -1, "GB"], [28, -15, "GB"], [24, -29, "GB"], [30, -19, "GB"],
  [12, 5, "DE"], [17, -22, "DE"], [35, -6, "DE"], [1, 8, "DE"],
  [23, -3, "BE"], [17, -12, "PT"], [36, -17, "PT"], [17, 28, "IT"], [39, 15, "IT"], [46, 4, "IT"], [-13, 24, "ES"],
];

const Pin: React.FC<{ x: number; y: number; color: string; aparece: number }> = ({ x, y, color, aparece }) => {
  const f = useCurrentFrame();
  const e = useResorte(aparece, { damping: 10, stiffness: 160 });
  if (f < aparece) return null;
  return (
    <g transform={`translate(${x} ${y - (1 - e) * 60}) scale(${0.6 + 0.4 * e})`} opacity={Math.min(1, e * 2)}>
      <ellipse cx={0} cy={2} rx={9} ry={4} fill="rgba(0,0,0,0.4)" />
      <line x1={0} y1={0} x2={0} y2={-46} stroke="#2A1A10" strokeWidth={4} strokeLinecap="round" />
      <path d={`M 2 -46 L 34 ${-38 + Math.sin(f / 6 + x) * 2} L 2 -28 Z`} fill={color} stroke="#F4ECD8" strokeWidth={1.5} />
    </g>
  );
};

const Tratado: React.FC<{ x: number; y: number; rot: number; aparece: number; sello: number }> = ({ x, y, rot, aparece, sello }) => {
  const f = useCurrentFrame();
  const e = useResorte(aparece, { damping: 14 });
  const s = useResorte(sello, { damping: 9, stiffness: 200 });
  if (f < aparece) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y + (1 - e) * 500, width: 300, height: 380, translate: "-50% -50%", transform: `rotate(${rot}deg)`, background: PAPEL, borderRadius: 6, border: `4px solid ${H.pergaminoOscuro}`, boxShadow: "0 24px 50px rgba(0,0,0,0.6)" }}>
      <div style={{ textAlign: "center", marginTop: 20, fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: 34, color: H.tinta, letterSpacing: 2 }}>TRATADO</div>
      <svg width={300} height={300} style={{ position: "absolute", left: 0, top: 70 }}>
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1={34} y1={20 + i * 24} x2={34 + (i % 3 === 2 ? 150 : 230) * cl((f - aparece - 6 - i * 2) / 10)} y2={20 + i * 24} stroke={H.tinta} strokeWidth={5} strokeLinecap="round" opacity={0.55} />
        ))}
        {/* firma con una cruz: quien firma no puede leer el texto */}
        <path d="M 50 236 L 86 268 M 86 236 L 50 268" stroke={H.tinta} strokeWidth={6} strokeLinecap="round" strokeDasharray={100} strokeDashoffset={100 * (1 - cl((f - sello + 14) / 10))} />
        <line x1={40} y1={280} x2={150} y2={280} stroke={H.tinta} strokeWidth={3} opacity={0.5} />
        {f >= sello ? (
          <g transform={`translate(220 250) scale(${2 - s})`} opacity={Math.min(1, s * 2)}>
            <path d="M 0 -40 Q 22 -44 34 -22 Q 50 -4 36 18 Q 30 44 4 40 Q -22 50 -34 24 Q -50 6 -36 -18 Q -28 -42 0 -40 Z" fill={H.carmesi} stroke={H.carmesiOscuro} strokeWidth={4} />
            <circle r={18} fill="none" stroke={H.carmesiOscuro} strokeWidth={4} />
          </g>
        ) : null}
      </svg>
    </div>
  );
};

// Tarjeta "caricatura de época": un coloso con un pie en El Cabo y otro en El Cairo, sosteniendo el hilo del telégrafo.
const Coloso: React.FC<{ aparece: number; hasta: number }> = ({ aparece, hasta }) => {
  const f = useCurrentFrame();
  const e = useResorte(aparece, { damping: 14 });
  const sale = lerp(f, hasta, hasta + 12, 0, 1);
  if (f < aparece || sale >= 1) return null;
  const mw = MAPA_W * 0.42;
  const mh = MAPA_H * 0.42;
  const hilo = Math.sin(f / 14) * 6;
  return (
    <div style={{ position: "absolute", left: 540, top: 800, width: 520, height: 660, translate: "-50% -50%", transform: `rotate(${-3 + (1 - e) * 8}deg) scale(${0.5 + 0.5 * e})`, opacity: Math.min(1, e * 1.6) * (1 - sale), background: PAPEL, borderRadius: 8, border: `6px solid ${H.sepia}`, boxShadow: "0 30px 70px rgba(0,0,0,0.7)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 260 - mw / 2, top: 470 - mh / 2, width: mw, height: mh, transform: "scaleY(0.5) rotate(79deg)" }}>
        <MapaAfrica x={0} y={0} escala={0.42} estilo="pergamino" rios={0} />
      </div>
      <svg width={520} height={660} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* hilo del telégrafo de mano a mano */}
        <path d={`M 64 190 Q 250 ${40 + hilo} 438 190`} stroke={H.tinta} strokeWidth={4} fill="none" />
        <path d="M 62 196 L 72 486 M 446 196 L 430 486" stroke={H.tinta} strokeWidth={3} fill="none" strokeDasharray="6 8" opacity={0.6} />
        <g fill="#1B1420" stroke="#3A2616" strokeWidth={2} strokeLinejoin="round">
          {/* piernas abiertas: El Cabo a la izquierda, El Cairo a la derecha */}
          <path d="M 212 296 L 252 332 L 112 482 L 64 468 Z M 290 296 L 250 332 L 390 482 L 438 468 Z" />
          <path d="M 50 460 L 120 470 L 114 498 L 28 498 Q 26 476 50 460 Z M 452 460 L 382 470 L 388 498 L 474 498 Q 476 476 452 460 Z" />
          <path d="M 202 162 Q 251 140 300 162 L 308 302 Q 251 334 194 302 Z" />
          <path d="M 208 164 L 80 184 L 74 208 L 210 206 Z M 294 164 L 422 184 L 428 208 L 292 206 Z" />
          <circle cx={64} cy={197} r={15} />
          <circle cx={438} cy={197} r={15} />
          <rect x={238} y={134} width={26} height={24} />
          <circle cx={251} cy={112} r={31} />
          <path d="M 213 102 Q 251 48 289 102 Z M 196 100 L 306 100 L 314 111 L 188 111 Z" />
        </g>
        <path d="M 196 286 Q 251 310 306 286" stroke={H.dorado} strokeWidth={6} fill="none" />
        <path d="M 286 150 L 296 310 M 280 96 Q 290 110 282 130" stroke={H.dorado} strokeWidth={4} fill="none" opacity={0.8} />
      </svg>
      <div style={{ position: "absolute", left: 30, top: 508, fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 26, color: H.tinta }}>El Cabo</div>
      <div style={{ position: "absolute", right: 30, top: 508, fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 26, color: H.tinta }}>El Cairo</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 22, textAlign: "center", fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: 30, color: H.tinta, lineHeight: 1.2 }}>
        «El Coloso de Rodas»
        <div style={{ fontFamily: FUENTE_TEXTO, fontSize: 24, fontWeight: 600, color: H.sepia }}>recreación de una caricatura de época</div>
      </div>
    </div>
  );
};

const Ocupacion: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fPrin = useMomento("principio", 0.06);
  const fTerr = Math.max(fPrin + 40, useMomento("demostraba", 0.3));
  const fDib = Math.max(fTerr + 40, useMomento("dibujándolo", 0.5));
  const fCarr = Math.max(fDib + 30, useMomento("carrera", 0.62));
  const fTrat = Math.max(fCarr + 40, useMomento("tratados", 0.72));
  const fFirm = useMomento("firmados", 0.78);
  const fNoEnt = useMomento("entendían", 0.9);
  const cae = lerp(f, 0, 30, 0, 1, fuera);
  const tomas = tomasSeguras([
    { f: 0, x: 540, y: 800, z: 2.6 },
    { f: 32, x: 540, y: 880, z: 1.06 },
    { f: fTerr, x: 540, y: 860, z: 1.12 },
    { f: fDib - 4, x: 600, y: 800, z: 1.3 },
    { f: fCarr, x: 540, y: 860, z: 1.08 },
    { f: fTrat - 8, x: 540, y: 860, z: 1.1 },
    { f: fTrat + 26, x: 540, y: 980, z: 1.16 },
    { f: duracion, x: 540, y: 1000, z: 1.22 },
  ]);
  const [dx, dy] = enMapa(8, 22);
  const dib = lerp(f, fDib, fDib + 24, 0, 1);
  const tacha = lerp(f, fDib + 28, fDib + 40, 0, 1);
  return (
    <AbsoluteFill style={{ background: "#0B132B" }}>
      <Camara tomas={tomas} vaiven={0.7}>
        <Capa k={0.8}>
          <div style={{ position: "absolute", left: -900, top: -900, width: 2880, height: 3720, background: MAR }} />
          <svg style={{ position: "absolute", left: -400, top: -200, overflow: "visible", opacity: 0.25 }} width={10} height={10}>
            {Array.from({ length: 40 }, (_, i) => (
              <path key={i} d={`M ${azar(i) * 1900 + Math.sin(f / 40 + i) * 14} ${azar(i + 50) * 2300} q 26 -10 52 0 t 52 0`} stroke="#BFE0EA" strokeWidth={3} fill="none" />
            ))}
          </svg>
        </Capa>
        <MapaAfrica x={MX} y={MY} escala={ME} estilo="pergamino" opacidad={1 - cae} rios={0.5} />
        <MapaAfrica x={MX} y={MY} escala={ME} estilo="terreno" opacidad={cae} rios={0.8} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {/* "no solo dibujándolo en un mapa": un reclamo trazado a lápiz, tachado */}
          <g opacity={1 - lerp(f, fCarr - 10, fCarr, 0, 1)}>
            <rect x={dx - 120} y={dy - 90} width={240} height={180} fill="rgba(244,236,216,0.18)" stroke={H.pergamino} strokeWidth={6} strokeDasharray="16 12" strokeDashoffset={840 * (1 - dib)} pathLength={840} opacity={dib > 0 ? 1 : 0} />
            <path d={`M ${dx - 96} ${dy - 66} L ${dx - 96 + 192 * tacha} ${dy - 66 + 132 * tacha}`} stroke={H.carmesi} strokeWidth={12} strokeLinecap="round" opacity={tacha > 0 ? 1 : 0} />
            <path d={`M ${dx + 96} ${dy - 66} L ${dx + 96 - 192 * cl(tacha * 2 - 1)} ${dy - 66 + 132 * cl(tacha * 2 - 1)}`} stroke={H.carmesi} strokeWidth={12} strokeLinecap="round" opacity={tacha > 0.5 ? 1 : 0} />
          </g>
          {/* banderas en el terreno: primero pocas (control efectivo), después la carrera */}
          {PINES.map(([lon, lat, pot], i) => {
            const [px, py] = enMapa(lon, lat);
            const ap = i % 5 === 0 ? fTerr + 6 + i * 2 : fCarr + 4 + Math.round(azar(i * 13) * 70);
            return <Pin key={i} x={px} y={py} color={COLOR_POTENCIA[pot]} aparece={ap} />;
          })}
        </svg>
        <Coloso aparece={fCarr + 12} hasta={fTrat - 6} />
        <Capa k={1.2}>
          <Tratado x={250} y={1010} rot={-8} aparece={fTrat} sello={fFirm + 4} />
          <Tratado x={560} y={1060} rot={4} aparece={fTrat + 8} sello={fFirm + 16} />
          <Tratado x={850} y={1000} rot={11} aparece={fTrat + 16} sello={fFirm + 28} />
        </Capa>
      </Camara>
      <Placa texto="Principio de" texto2="Ocupación Efectiva" aparece={fPrin} aparece2={fPrin + 6} y={210} />
      <Rotulito texto="Tratados desiguales" x={470} y={640} aparece={fTrat + 20} tam={38} color={H.carmesi} />
      <Rotulito texto="firmados sin poder leerlos" x={470} y={720} aparece={fNoEnt} tam={32} color={H.sepia} />
      <Polvo x={60} y={300} ancho={960} alto={1100} n={16} semilla={7} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(4,6,14,0.55) 100%)", pointerEvents: "none" }} />
      <Textura fuerza={0.8} />
      <Fundido color={PAPEL} o={lerp(f, 2, 14, 1, 0)} />
      <Fundido color={SOMBRA} o={lerp(f, duracion - 14, duracion - 2, 0, 1)} />
      <Sfx archivo="tambor" en={fCarr} volumen={0.2} />
      <Sfx archivo="pagina" en={fTrat} volumen={0.36} />
      <Sfx archivo="pagina" en={fTrat + 10} volumen={0.3} />
      <Sfx archivo="banco" en={fFirm + 4} volumen={0.3} />
      <Sfx archivo="banco" en={fFirm + 16} volumen={0.26} />
      <Sfx archivo="banco" en={fFirm + 28} volumen={0.26} />
    </AbsoluteFill>
  );
};

// ================= 6. EL CONGO DE LEOPOLDO II =================
// Liana que se vuelve cadena: misma curva; al final se tensa hasta quedar recta.
const LianaCadena: React.FC<{ x: number; fase: number; cadena: number; tension: number; largo?: number }> = ({ x, fase, cadena, tension, largo = 1500 }) => {
  const f = useCurrentFrame();
  const amp = 46 * (1 - tension);
  const pt = (t: number): [number, number] => [x + Math.sin(t * 7 + fase + f / 50) * amp * (0.3 + t), 160 + t * largo];
  const N = 44;
  const pts = Array.from({ length: N + 1 }, (_, i) => pt(i / N));
  const d = pts.map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  return (
    <g>
      <g opacity={1 - cadena}>
        <path d={d} stroke="#1E4D2F" strokeWidth={13} fill="none" strokeLinecap="round" />
        <path d={d} stroke="#3F7F4A" strokeWidth={4} fill="none" strokeLinecap="round" />
        {pts.filter((_, i) => i % 5 === 2).map((p, i) => (
          <path key={i} d={`M ${p[0]} ${p[1]} q ${i % 2 ? 44 : -44} -14 ${i % 2 ? 58 : -58} 22 q ${i % 2 ? -34 : 34} 6 ${i % 2 ? -58 : 58} -22 Z`} fill="#2C6A3C" />
        ))}
      </g>
      <g opacity={cadena}>
        {pts.slice(0, -1).map((p, i) => {
          const q = pts[i + 1];
          const a = (Math.atan2(q[1] - p[1], q[0] - p[0]) * 180) / Math.PI;
          return <ellipse key={i} cx={(p[0] + q[0]) / 2} cy={(p[1] + q[1]) / 2} rx={21} ry={i % 2 ? 6 : 12} fill="none" stroke={i % 2 ? "#8A929E" : "#59616C"} strokeWidth={6} transform={`rotate(${a} ${(p[0] + q[0]) / 2} ${(p[1] + q[1]) / 2})`} />;
        })}
      </g>
    </g>
  );
};

const LIANAS: [number, number][] = [[200, 0.4], [420, 2.1], [660, 3.7], [880, 5.2]];

const Congo: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fLeo = useMomento("Leopoldo", 0.08);
  const fCuenca = Math.max(fLeo + 30, useMomento("cuenca", 0.3));
  const fEstado = Math.max(fCuenca + 20, useMomento("Estado", 0.48));
  const fForz = Math.max(fEstado + 30, useMomento("forzados", 0.68));
  const fMuerte = Math.max(fForz + 30, useMomento("muerte", 0.86));
  const [cx, cy] = enMapa(22.5, -3);
  const sombra = lerp(f, fLeo - 6, fLeo + 40, 0, 1);
  const cuenca = lerp(f, fCuenca, fCuenca + 30, 0, 1);
  const lianas = lerp(f, fForz - 50, fForz - 20, 0, 1);
  const cadena = lerp(f, fForz, fForz + 40, 0, 1);
  const tension = lerp(f, duracion - 26, duracion - 6, 0, 1, Easing.in(Easing.cubic));
  const tomas = tomasSeguras([
    { f: 0, x: 540, y: 860, z: 1.02 },
    { f: fCuenca - 6, x: 540, y: 840, z: 1.08 },
    { f: fCuenca + 40, x: cx, y: cy + 30, z: 1.7 },
    { f: fForz - 30, x: cx, y: cy + 40, z: 1.76 },
    { f: fForz + 20, x: 540, y: 880, z: 1.1 },
    { f: duracion, x: 540, y: 880, z: 1.04 },
  ]);
  return (
    <AbsoluteFill style={{ background: "#07060E" }}>
      <Camara tomas={tomas} vaiven={0.5}>
        <Capa k={0.8}>
          <div style={{ position: "absolute", left: -900, top: -900, width: 2880, height: 3720, background: `radial-gradient(ellipse at 50% 46%, #3A0F1C 0%, #1A0A1C 45%, ${H.noche} 100%)` }} />
        </Capa>
        <MapaAfrica
          x={MX}
          y={MY}
          escala={ME}
          estilo="noche"
          rios={0.35}
        />
        {/* la cuenca del Congo, marcada */}
        <svg width={MAPA_W * ME} height={MAPA_H * ME} viewBox={`0 0 ${MAPA_W} ${MAPA_H}`} style={{ position: "absolute", left: MX, top: MY, overflow: "visible" }}>
          <defs>
            <filter id="co-brillo" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation={7} />
            </filter>
          </defs>
          <CongoTerritorio o={cuenca} />
          {/* luces de aldeas que se apagan */}
          {Array.from({ length: 46 }, (_, i) => {
            const [px, py] = geo(15 + azar(i * 3) * 14, -10 + azar(i * 7 + 2) * 13);
            const apaga = fMuerte + 6 + azar(i * 11) * Math.max(30, duracion - fMuerte - 50);
            const o = cuenca * (1 - cl((f - apaga) / 12)) * (0.7 + 0.3 * Math.sin(f / 7 + i));
            return o > 0.01 ? (
              <g key={i} opacity={o}>
                <circle cx={px} cy={py} r={9} fill="#FFD98A" filter="url(#co-brillo)" />
                <circle cx={px} cy={py} r={3.2} fill="#FFF3C8" />
              </g>
            ) : null;
          })}
        </svg>
        {/* sombra gigantesca del rey */}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: sombra * 0.8, transform: `translateY(${(1 - sombra) * -160}px)` }}>
          <defs>
            <radialGradient id="co-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C23A4A" stopOpacity={0.75} />
              <stop offset="100%" stopColor="#C23A4A" stopOpacity={0} />
            </radialGradient>
            <linearGradient id="co-sombra" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000" stopOpacity={1} />
              <stop offset="70%" stopColor="#000" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#000" stopOpacity={0} />
            </linearGradient>
          </defs>
          <ellipse cx={540} cy={330} rx={520} ry={520} fill="url(#co-halo)" />
          <g fill="url(#co-sombra)" transform="translate(540 0)">
            <path d="M -70 60 L -52 -10 L -26 44 L 0 -24 L 26 44 L 52 -10 L 70 60 Z" />
            <ellipse cx={0} cy={170} rx={120} ry={140} />
            <path d="M -112 190 Q -130 520 0 640 Q 130 520 112 190 Z" />
            <path d="M -150 330 Q -470 380 -560 640 L -640 1500 L 640 1500 L 560 640 Q 470 380 150 330 Z" />
          </g>
        </svg>
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: lianas }}>
          {LIANAS.map(([x, fase], i) => (
            <LianaCadena key={i} x={x} fase={fase} cadena={cadena} tension={tension} />
          ))}
        </svg>
        <Capa k={1.3}>
          <Humo x={160} y={1500} n={7} alto={900} ancho={120} color="#3A1420" semilla={21} fuerza={0.5} viento={0.1} />
          <Humo x={940} y={1560} n={7} alto={900} ancho={120} color="#1C2541" semilla={22} fuerza={0.5} viento={-0.1} />
        </Capa>
      </Camara>
      <Placa texto="Estado Libre del Congo" texto2="Propiedad privada del rey" aparece={fEstado} y={210} />
      <Rotulito texto="Leopoldo II de Bélgica" x={470} y={352} aparece={fLeo + 6} hasta={fEstado - 8} tam={36} color={H.carmesi} />
      <Rotulito texto="Caucho por trabajo forzado" x={470} y={352} aparece={fForz + 8} hasta={fMuerte - 6} tam={34} color={H.acero} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(0,0,0,0) 45%, rgba(4,2,8,0.75) 100%)", pointerEvents: "none" }} />
      <Textura fuerza={0.9} />
      <Fundido color={SOMBRA} o={lerp(f, 2, 20, 1, 0)} />
      <Sfx archivo="tension" en={fLeo} volumen={0.22} />
      <Sfx archivo="grillos" en={fCuenca} volumen={0.1} />
      <Sfx archivo="marca" en={fForz + 6} volumen={0.3} />
      <Sfx archivo="apagar" en={fMuerte + 10} volumen={0.2} />
      <Sfx archivo="tension" en={duracion - 30} volumen={0.2} />
    </AbsoluteFill>
  );
};

const CONGO_D = AFRICA_PAISES.find((p) => p.id === "COD")?.d ?? "";
const CongoTerritorio: React.FC<{ o: number }> = ({ o }) => {
  const f = useCurrentFrame();
  return o <= 0 ? null : (
    <g opacity={o}>
      <path d={CONGO_D} fill={H.carmesi} opacity={0.5 + 0.08 * Math.sin(f / 12)} />
      <path d={CONGO_D} fill="none" stroke="#FF6B5A" strokeWidth={3.5} />
    </g>
  );
};

// ================= 7. ÁFRICA EN 1914 =================
const Leyenda: React.FC<{ aparece: number }> = ({ aparece }) => {
  const f = useCurrentFrame();
  const o = lerp(f, aparece, aparece + 16, 0, 1);
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 122, top: 912, display: "flex", flexDirection: "column", gap: 7, opacity: o }}>
      {(Object.keys(NOMBRE_POTENCIA) as Exclude<Potencia, "IND">[]).map((k) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 9, fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 28, color: H.tinta }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: COLOR_POTENCIA[k], border: `2px solid ${H.sepia}` }} />
          {NOMBRE_POTENCIA[k]}
        </div>
      ))}
    </div>
  );
};

const Mapa1914: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fPara = 10;
  const fNov = Math.max(60, useMomento("noventa", 0.26));
  const fSolo = Math.max(fNov + 40, useMomento("solo", 0.44));
  const fEti = Math.max(fSolo + 6, useMomento("Etiopía", 0.47));
  const fAdua = Math.max(fEti + 30, useMomento("Adua", 0.62));
  const fLib = Math.max(fAdua + 40, useMomento("Liberia", 0.74));
  const fMant = Math.max(fLib + 40, useMomento("mantuvieron", 0.92));
  const reparto = lerp(f, fPara, fNov + 20, 0, 1, Easing.inOut(Easing.quad));
  const anio = Math.round(1880 + 34 * reparto);
  const pct = Math.round(lerp(f, fNov - 20, fNov + 20, 10, 90));
  const [ex, ey] = enMapa(40, 9);
  const [ax, ay] = enMapa(38.9, 14.2);
  const [lx, ly] = enMapa(-9.4, 6.4);
  const tension = lerp(f, 0, 26, 1, 0);
  const zFin = Math.max(fMant + 40, duracion - 18);
  const [sx, sy] = enMapa(8, 24);
  const tomas = tomasSeguras([
    { f: 0, x: 540, y: 880, z: 1.04 },
    { f: fSolo - 4, x: 540, y: 880, z: 1.08 },
    { f: fEti + 26, x: ex - 40, y: ey + 20, z: 1.75 },
    { f: fLib - 16, x: ex - 50, y: ey, z: 1.82 },
    { f: fLib + 22, x: lx + 90, y: ly + 30, z: 1.9 },
    { f: fMant - 8, x: lx + 100, y: ly + 30, z: 1.96 },
    { f: fMant + 30, x: 540, y: 880, z: 1.06 },
    { f: zFin, x: 540, y: 880, z: 1.1 },
    { f: duracion, x: sx, y: sy, z: 6 },
  ]);
  const zoom = lerp(f, fSolo, fEti + 20, 0, 1) * (1 - lerp(f, fMant, fMant + 24, 0, 1));
  const chispa = cl((f - fAdua) / 30);
  return (
    <AbsoluteFill style={{ background: H.noche }}>
      <Camara tomas={tomas} vaiven={0.6}>
        <div style={{ position: "absolute", left: -900, top: -900, width: 2880, height: 3720, background: `radial-gradient(ellipse at 540px 900px, #2A3558 0%, ${H.noche} 60%)` }} />
        <div style={{ position: "absolute", left: 96, top: 350, width: 888, height: 920, transform: "rotate(-0.8deg)", background: PAPEL, borderRadius: 6, boxShadow: "0 18px 50px rgba(0,0,0,0.65), inset 0 0 90px rgba(107,74,43,0.45)" }} />
        <MapaAfrica x={MX} y={MY} escala={ME} estilo="pergamino" costa={1} reparto={reparto} oro={lerp(f, fEti - 4, fEti + 14, 0, 1)} oroLiberia={lerp(f, fLib - 4, fLib + 14, 0, 1)} rios={0.4} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {/* las cadenas tensas de la escena anterior quedan como líneas rectas y se desvanecen */}
          {LIANAS.map(([x], i) => (
            <line key={i} x1={x} y1={-200} x2={x} y2={2200} stroke="#8A929E" strokeWidth={10} opacity={tension * 0.9} />
          ))}
          {/* destello de Adua */}
          {chispa > 0 && chispa < 1
            ? Array.from({ length: 12 }, (_, i) => {
                const a = (i * Math.PI) / 6;
                return <line key={i} x1={ax + Math.cos(a) * 10 * chispa} y1={ay + Math.sin(a) * 10 * chispa} x2={ax + Math.cos(a) * (16 + 54 * fuera(chispa))} y2={ay + Math.sin(a) * (16 + 54 * fuera(chispa))} stroke="#FFF3B8" strokeWidth={5} strokeLinecap="round" opacity={1 - chispa} />;
              })
            : null}
          {f >= fAdua ? <circle cx={ax} cy={ay} r={7} fill={H.carmesi} stroke="#FFF3B8" strokeWidth={3} /> : null}
        </svg>
        <div style={{ position: "absolute", left: 124, top: 372, opacity: 1 - zoom, fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 84, color: H.tinta, lineHeight: 1 }}>{anio}</div>
        <div style={{ position: "absolute", left: 690, top: 1136, opacity: lerp(f, fNov - 24, fNov - 10, 0, 1) * (1 - zoom), fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 112, color: H.carmesi, lineHeight: 1 }}>{pct}%</div>
        <div style={{ opacity: 1 - zoom }}>
          <Leyenda aparece={fNov - 10} />
        </div>
        {/* rótulos en el mapa */}
        <div style={{ position: "absolute", left: ex - 20, top: ey + 22, translate: "-50% 0", opacity: lerp(f, fEti + 6, fEti + 18, 0, 1) * zoom, fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 28, color: H.tinta, textShadow: "0 0 10px #FFF3B8, 0 0 4px #FFF3B8", whiteSpace: "nowrap" }}>ETIOPÍA</div>
        <div style={{ position: "absolute", left: ax - 6, top: ay - 50, translate: "-100% 0", opacity: lerp(f, fAdua + 4, fAdua + 14, 0, 1) * zoom * (1 - lerp(f, fLib - 22, fLib - 12, 0, 1)), padding: "4px 12px", borderRadius: 8, background: "rgba(11,19,43,0.9)", border: `2px solid ${H.dorado}`, fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 24, color: H.pergamino, whiteSpace: "nowrap" }}>Adua, 1896</div>
        <div style={{ position: "absolute", left: lx + 30, top: ly + 44, opacity: lerp(f, fLib + 6, fLib + 18, 0, 1) * zoom, padding: "4px 12px", borderRadius: 8, background: "rgba(11,19,43,0.9)", border: `2px solid ${H.dorado}`, fontFamily: FUENTE_TEXTO, fontWeight: 700, fontSize: 24, color: H.pergamino, whiteSpace: "nowrap" }}>LIBERIA</div>
      </Camara>
      <Placa texto="1914 | 90% bajo dominio europeo" texto2="(Excepciones: Etiopía y Liberia)" aparece={fNov - 26} aparece2={fSolo} y={210} tam={42} />
            <Rotulito texto="Fronteras aproximadas" x={330} y={1300} aparece={fNov + 30} hasta={fSolo - 6} tam={26} color={H.sepia} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(4,6,14,0.5) 100%)", pointerEvents: "none" }} />
      <Textura fuerza={0.8} />
      <Fundido color={ARENA} o={lerp(f, duracion - 10, duracion - 2, 0, 1)} />
      <Sfx archivo="tambor" en={fPara + 6} volumen={0.3} />
      <Sfx archivo="tambor" en={Math.round((fPara + fNov) / 2)} volumen={0.3} />
      <Sfx archivo="tambor" en={fNov} volumen={0.36} />
      <Sfx archivo="brillo" en={fEti} volumen={0.22} />
      <Sfx archivo="trompeta" en={fAdua} volumen={0.1} />
      <Sfx archivo="brillo" en={fLib} volumen={0.22} />
      <Sfx archivo="whoosh" en={duracion - 18} volumen={0.26} />
    </AbsoluteFill>
  );
};

// ================= 8. FRONTERAS RECTAS + CIERRE =================
type Aldea = { x: number; y: number; r: number };
const aldeas = (cx: number, cy: number, rx: number, ry: number, n: number, semilla: number): Aldea[] =>
  Array.from({ length: n }, (_, i) => {
    const a = azar(semilla + i * 3) * Math.PI * 2;
    const d = Math.sqrt(azar(semilla + i * 7 + 1));
    return { x: cx + Math.cos(a) * rx * d, y: cy + Math.sin(a) * ry * d, r: 9 + azar(semilla + i) * 7 };
  });
const PUEBLOS = [
  { cx: 540, cy: 600, rx: 300, ry: 170, color: "#1F8A7E", casas: aldeas(540, 600, 250, 130, 30, 5) },
  { cx: 350, cy: 1050, rx: 220, ry: 180, color: "#A8392E", casas: aldeas(350, 1050, 170, 140, 22, 40) },
  { cx: 730, cy: 1050, rx: 220, ry: 180, color: "#3E5FA8", casas: aldeas(730, 1050, 170, 140, 22, 90) },
];

// Muro de cristal y acero que cae sobre el terreno (línea recta de p0 a p1).
const MuroRecto: React.FC<{ p0: [number, number]; p1: [number, number]; cae: number; oro?: number }> = ({ p0, p1, cae, oro = 0 }) => {
  const f = useCurrentFrame();
  const t = cl((f - cae) / 9);
  if (f < cae) return null;
  const e = Easing.in(Easing.cubic)(t);
  const golpe = cl((f - cae - 9) / 20);
  const largo = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  const ang = (Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * 180) / Math.PI;
  const color = oro > 0 ? H.dorado : "#AEB7C2";
  return (
    <g transform={`translate(${p0[0]} ${p0[1]}) rotate(${ang})`}>
      {t >= 1 && golpe < 1 ? <rect x={-10} y={-30 - golpe * 50} width={largo + 20} height={60 + golpe * 100} rx={30} fill="#F4ECD8" opacity={(1 - golpe) * 0.35} /> : null}
      <g transform={`translate(0 ${-(1 - e) * 220}) scale(1 ${1 + (1 - e) * 2})`} opacity={0.3 + 0.7 * e}>
        <rect x={0} y={8} width={largo} height={16} fill="rgba(0,0,0,0.35)" />
        <rect x={0} y={-22} width={largo} height={30} fill="rgba(190,225,240,0.32)" opacity={1 - oro} />
        <rect x={0} y={-22} width={largo} height={5} fill="rgba(255,255,255,0.75)" opacity={1 - oro} />
        <rect x={0} y={-6} width={largo} height={12} fill={color} />
        <rect x={0} y={-6} width={largo} height={3} fill="#FFFFFF" opacity={0.6} />
        {oro <= 0 ? Array.from({ length: Math.floor(largo / 90) }, (_, i) => <rect key={i} x={40 + i * 90} y={-24} width={7} height={32} fill="#59616C" />) : null}
      </g>
    </g>
  );
};

const grieta = (x: number, y: number, ang: number, largo: number, semilla: number) => {
  let d = `M ${x} ${y}`;
  let px = x;
  let py = y;
  const n = 7;
  for (let i = 1; i <= n; i++) {
    const a = ang + (azar(semilla + i * 3) - 0.5) * 1.5;
    px += (Math.cos(a) * largo) / n;
    py += (Math.sin(a) * largo) / n;
    d += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
  }
  return d;
};
const GRIETAS = [
  grieta(540, 840, Math.PI / 2, 420, 1),
  grieta(540, 600, Math.PI * 0.9, 260, 8),
  grieta(540, 600, 0.2, 260, 15),
  grieta(350, 830, Math.PI * 0.6, 300, 22),
  grieta(760, 830, Math.PI * 0.4, 320, 29),
  grieta(540, 1040, Math.PI * 0.95, 240, 36),
  grieta(540, 1100, 0.1, 250, 43),
];

const MUROS: [[number, number], [number, number]][] = [
  [[540, 300], [540, 830]],
  [[30, 830], [1050, 830]],
  [[110, 830], [110, 1272]],
  [[970, 830], [970, 1272]],
  [[110, 1272], [970, 1272]],
];

const Fronteras: React.FC<PropsEscena> = ({ escena }) => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const fRectas = Math.max(40, useMomento("rectas", 0.1));
  const fEtn = Math.max(fRectas + 20, useMomento("étnicas", 0.22));
  const fLing = useMomento("lingüísticas", 0.27);
  const fRel = useMomento("religiosas", 0.32);
  const fSep = Math.max(fRel + 20, useMomento("separando", 0.4));
  const fEnc = Math.max(fSep + 40, useMomento("encerrando", 0.5));
  const fRaiz = Math.max(fEnc + 50, useMomento("raíz", 0.64));
  const fGuerras = Math.max(fRaiz + 20, useMomento("guerras", 0.72));
  const fSiglo = Math.max(fGuerras + 30, useMomento("siglo", 0.8));
  const fFinVoz = Math.max(fSiglo + 20, useFinDePalabra("veintiuno", 0.86));
  const fCierre = Math.min(fFinVoz + 8, duracion - 140);
  const caidas = [fSep, fRectas + 6, fEnc, fEnc + 5, fEnc + 10];
  const pulsos = [fEtn, fLing, fRel];
  const fuego = lerp(f, fGuerras, fGuerras + 50, 0, 1);
  const noche = lerp(f, fSiglo, fSiglo + 44, 0, 1);
  const tomas = tomasSeguras([
    { f: 0, x: 540, y: 800, z: 1.5 },
    { f: 30, x: 540, y: 820, z: 1.06 },
    { f: fSep - 6, x: 540, y: 800, z: 1.1 },
    { f: fSep + 24, x: 540, y: 640, z: 1.42 },
    { f: fEnc - 8, x: 540, y: 650, z: 1.44 },
    { f: fEnc + 24, x: 540, y: 1000, z: 1.36 },
    { f: fRaiz - 6, x: 540, y: 1010, z: 1.4 },
    { f: fRaiz + 30, x: 540, y: 830, z: 1.08 },
    { f: fSiglo, x: 540, y: 830, z: 1.12 },
    { f: fCierre + 14, x: 540, y: 760, z: 0.62 },
  ]);
  const temblor = f > fGuerras ? Math.sin(f * 1.7) * 2.5 * fuego * (1 - noche) : 0;
  return (
    <AbsoluteFill style={{ background: H.noche }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${temblor}px, ${-temblor * 0.6}px)` }}>
        <Camara tomas={tomas} vaiven={0.6}>
          {/* terreno desde el aire */}
          <div style={{ position: "absolute", left: -1300, top: -1500, width: 3680, height: 4920, background: ARENA }} />
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1080} height={1920}>
            <defs>
              <filter id="fr-suave" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation={34} />
              </filter>
              <filter id="fr-brasa" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation={8} />
              </filter>
            </defs>
            {/* dunas */}
            {Array.from({ length: 46 }, (_, i) => {
              const y = -700 + i * 76;
              return <path key={i} d={`M -1300 ${y} q 300 ${-30 - azar(i) * 40} 600 0 t 600 0 t 600 0 t 600 0 t 600 0 t 600 0`} stroke="#A9772F" strokeWidth={5} fill="none" opacity={0.28} />;
            })}
            {/* territorios ancestrales: tres pueblos */}
            {PUEBLOS.map((p, i) => {
              const pulso = cl(1 - Math.abs(f - pulsos[i] - 10) / 16);
              return (
                <g key={i}>
                  <ellipse cx={p.cx} cy={p.cy} rx={p.rx * (1 + pulso * 0.06)} ry={p.ry * (1 + pulso * 0.06)} fill={p.color} opacity={0.34 + pulso * 0.3} filter="url(#fr-suave)" />
                  {p.casas.map((c, k) => (
                    <g key={k}>
                      <circle cx={c.x + 3} cy={c.y + 4} r={c.r} fill="rgba(60,30,10,0.35)" />
                      <circle cx={c.x} cy={c.y} r={c.r} fill={p.color} stroke="#F4ECD8" strokeWidth={2} />
                      <circle cx={c.x} cy={c.y} r={c.r * 0.34} fill="#3A2616" opacity={0.7} />
                    </g>
                  ))}
                </g>
              );
            })}
            {/* grietas encendidas */}
            {GRIETAS.map((d, i) => {
              const t = cl((f - fGuerras - i * 5) / 26);
              return t > 0 ? (
                <g key={i} opacity={1 - noche}>
                  <path d={d} stroke="#FF5A1E" strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#fr-brasa)" pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - t)} opacity={0.6 + 0.3 * Math.sin(f / 4 + i)} />
                  <path d={d} stroke="#FFD27A" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - t)} />
                </g>
              ) : null;
            })}
            {MUROS.map(([p0, p1], i) => (
              <MuroRecto key={i} p0={p0} p1={p1} cae={caidas[i]} oro={noche} />
            ))}
          </svg>
          <Chispas x={150} y={500} ancho={780} alto={760} n={Math.round(30 * fuego * (1 - noche))} color="#FF9A4A" semilla={31} tam={4} />
          {/* la cámara sube al cielo nocturno */}
          <div style={{ position: "absolute", left: -1300, top: -1500, width: 3680, height: 4920, background: `radial-gradient(ellipse at 50% 46%, ${H.nocheAlta} 0%, ${H.noche} 60%)`, opacity: noche * 0.94, mixBlendMode: "multiply" }} />
          <div style={{ position: "absolute", left: -1300, top: -1500, width: 3680, height: 4920, background: H.noche, opacity: noche * 0.8 }} />
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: noche }} width={1080} height={1920}>
            {MUROS.map(([p0, p1], i) => (
              <line key={i} x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke={H.dorado} strokeWidth={9} strokeLinecap="round" />
            ))}
          </svg>
        </Camara>
      </div>
      <Rotulito texto="Un mismo pueblo, dos países" x={470} y={300} aparece={fSep + 18} hasta={fEnc - 8} tam={36} />
      <Rotulito texto="Grupos rivales, un mismo país" x={470} y={300} aparece={fEnc + 24} hasta={fRaiz - 4} tam={36} color={H.carmesi} />
      <Rotulito texto="Territorios ancestrales" x={470} y={300} aparece={fEtn - 4} hasta={fSep - 10} tam={36} color={H.selva} />
      <Polvo x={60} y={300} ancho={960} alto={1100} n={18} color="#FFE9C0" semilla={9} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(4,6,14,0.5) 100%)", pointerEvents: "none" }} />
      <Textura fuerza={0.8} />
      <Fundido color={ARENA} o={lerp(f, 2, 16, 1, 0)} />
      <AbsoluteFill style={{ opacity: lerp(f, fCierre, fCierre + 16, 0, 1) }}>
        <Sequence from={fCierre} layout="none">
          <CierreCanal nombre="El pasado del pasado" lema={escena.lema ?? "el hilo de la historia"} />
        </Sequence>
      </AbsoluteFill>
      <Sfx archivo="viento" en={4} volumen={0.16} />
      <Sfx archivo="canon" en={fRectas + 14} volumen={0.2} />
      <Sfx archivo="canon" en={fSep + 8} volumen={0.24} />
      <Sfx archivo="canon" en={fEnc + 8} volumen={0.24} />
      <Sfx archivo="tambor" en={fEnc + 16} volumen={0.3} />
      <Sfx archivo="fuego" en={fGuerras} volumen={0.2} />
      <Sfx archivo="expansion" en={fSiglo} volumen={0.14} />
      <Sfx archivo="coro" en={fCierre + 4} volumen={0.2} />
      <Sfx archivo="brillo" en={fCierre + 40} volumen={0.22} />
    </AbsoluteFill>
  );
};

export const ESCENAS_2: Record<string, React.FC<PropsEscena>> = {
  "reparto-africa/ocupacion": Ocupacion,
  "reparto-africa/congo": Congo,
  "reparto-africa/mapa-1914": Mapa1914,
  "reparto-africa/fronteras": Fronteras,
};
