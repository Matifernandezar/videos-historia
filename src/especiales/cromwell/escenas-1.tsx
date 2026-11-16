// Cromwell — escenas 1 a 5: gancho, Carlos I y la guerra civil, Cromwell y el Nuevo Ejército Modelo,
// el regicidio de 1649 y la Mancomunidad.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import type { EscenaAnimada } from "../../video/tipos";
import { useEscena } from "../../video/contexto";
import { FUENTE_SERIFA } from "../../marca/fuentes";
import { Sfx, useMomento } from "../comun";
import { Polvo, RayosDeLuz, azar } from "../ambiente";
import { Camara, Capa, Textura } from "../jesus-12-30/escenarios";
import { Busto, Ceniza, Corona, Destello, Estandarte, Figura, FondoPergamino, Gentio, Grabado, H, Hilo, HiloG, Humo, Llovizna, Lugar, MapaIslas, Nombre, Placa, Pt, SALE, TextoHilado, Tropa, cl, geo, rampa } from "../historia/piezas";

export type P = { escena: EscenaAnimada };
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ENTRA = Easing.in(Easing.cubic);

// Barrido rápido (whip pan) al entrar o salir de la escena.
export const Latigo: React.FC<{ entra?: boolean; sale?: boolean; children: React.ReactNode }> = ({ entra, sale, children }) => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const e = entra ? 1 - rampa(f, 0, 9, SALE) : 0;
  const s = sale ? rampa(f, duracion - 8, duracion, ENTRA) : 0;
  const k = e + s;
  return (
    <AbsoluteFill style={{ background: H.noche, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${e * 1250 - s * 1250}px) scaleX(${1 + k * 0.35})`, filter: k > 0.02 ? `blur(${k * 16}px)` : undefined }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// Sub-toma dentro de una escena: aparece y desaparece con fundido.
export const Sub: React.FC<{ desde: number; hasta: number; fundido?: number; salida?: number; children: React.ReactNode }> = ({ desde, hasta, fundido = 10, salida, children }) => {
  const f = useCurrentFrame();
  if (f < desde || f > hasta) return null;
  const o = (fundido ? rampa(f, desde, desde + fundido) : 1) * (1 - rampa(f, hasta - (salida ?? fundido), hasta));
  return <AbsoluteFill style={{ opacity: salida === 0 ? (fundido ? rampa(f, desde, desde + fundido) : 1) : o }}>{children}</AbsoluteFill>;
};

export const Negro: React.FC<{ o: number }> = ({ o }) => (o <= 0 ? null : <AbsoluteFill style={{ background: "#03060B", opacity: cl(o) }} />);

// ============ 1. Gancho ============
const Calendario: React.FC<{ tacha: number }> = ({ tacha }) => (
  <svg width={520} height={590} viewBox="0 0 520 590" style={{ overflow: "visible", filter: "drop-shadow(0 22px 30px rgba(0,0,0,0.6))" }}>
    <path d="M 6 10 L 514 0 L 520 580 L 0 590 Z" fill="#E8DCC4" stroke="#8C7A55" strokeWidth={4} />
    <path d="M 6 10 L 514 0 L 516 96 L 5 104 Z" fill={H.lacre} />
    <text x={260} y={72} textAnchor="middle" fontFamily={FUENTE_SERIFA} fontWeight={700} fontSize={56} fill="#F3E7CC" letterSpacing={6}>
      DICIEMBRE
    </text>
    {Array.from({ length: 31 }, (_, i) => {
      const col = i % 7;
      const fila = Math.floor(i / 7);
      const x = 54 + col * 69;
      const y = 176 + fila * 88;
      const es25 = i === 24;
      return (
        <g key={i}>
          {es25 ? <circle cx={x} cy={y - 13} r={40} fill="none" stroke={H.lacreClaro} strokeWidth={6} /> : null}
          <text x={x} y={y} textAnchor="middle" fontFamily={FUENTE_SERIFA} fontWeight={es25 ? 700 : 400} fontSize={es25 ? 46 : 36} fill={es25 ? "#6A1218" : "#3B2E22"}>
            {i + 1}
          </text>
        </g>
      );
    })}
    {tacha > 0 ? (
      <g stroke="#0B0B0E" strokeLinecap="round" fill="none">
        <path d="M 208 386 L 320 492" strokeWidth={17} strokeDasharray={160} strokeDashoffset={160 * (1 - cl(tacha * 2))} />
        <path d="M 322 384 L 204 496" strokeWidth={17} strokeDasharray={170} strokeDashoffset={170 * (1 - cl(tacha * 2 - 1))} />
        {tacha > 0.9 ? [[336, 510, 9], [352, 474, 5], [196, 372, 6], [182, 512, 7]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#0B0B0E" stroke="none" />) : null}
      </g>
    ) : null}
  </svg>
);

const Gancho: React.FC<P> = () => {
  const f = useCurrentFrame();
  const tEjecuto = useMomento("ejecutó", 0.23);
  const tAbolio = useMomento("abolió", 0.4);
  const tMonarquia = useMomento("monarquía", 0.45) + 8;
  const tDictadura = useMomento("dictadura", 0.62);
  const tImplacable = useMomento("implacable", 0.74);
  const tNavidad = useMomento("Navidad", 0.91);
  // corona: flota, cae lento y se parte
  const cae = rampa(f, tEjecuto, tMonarquia, ENTRA);
  const cx = 540;
  const cy = 610 + Math.sin(f / 17) * 8 * (1 - cae) + cae * 170;
  const rot = Math.sin(f / 31) * 2 * (1 - cae) - cae * 7;
  const roto = f >= tMonarquia;
  const tr = f - tMonarquia;
  const tension = rampa(f, tAbolio, tMonarquia - 2);
  const rx = 285 - tension * 70;
  const pHilo = rampa(f, 4, tAbolio, Easing.inOut(Easing.quad));
  const lazo: Pt[] = [[-90, 1180], [90, 1010], [cx - rx - 50, cy + 150]];
  for (let i = 0; i <= 34; i++) {
    const a = Math.PI + (i / 16) * Math.PI * 2;
    lazo.push([cx + Math.cos(a) * rx + (tension > 0.6 ? Math.sin(f * 2.1 + i) * 2.5 : 0), cy + 96 - i * 2.6 + Math.sin(a) * (58 - tension * 16)]);
  }
  lazo.push([cx + rx + 70, cy - 150], [1170, 330]);
  const destello = roto ? 1 - rampa(f, tMonarquia, tMonarquia + 16) : 0;
  const crom = rampa(f, tDictadura - 12, tDictadura + 26);
  const cal = rampa(f, tImplacable, tImplacable + 22, SALE);
  const tacha = rampa(f, tNavidad, tNavidad + 12, Easing.linear);
  const linea: Pt[] = [[-90, 640], [220, 560], [540, 650], [830, 540], [1180, 600]];
  return (
    <Latigo sale>
      <Camara tomas={[{ f: 0, x: 540, y: 880, z: 1.16 }, { f: tMonarquia, x: 540, y: 930, z: 1.02 }, { f: tMonarquia + 190, x: 540, y: 960, z: 1.06 }]}>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 32%, #1B3350 0%, ${H.noche} 55%, #050A12 100%)` }} />
        <Capa k={0.3}>
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 0.5 }}>
            {[-60, 250, 560, 870].map((x) => (
              <path key={x} d={`M ${x} 1920 L ${x} 620 C ${x} 380 ${x + 135} 250 ${x + 135} 250 C ${x + 135} 250 ${x + 270} 380 ${x + 270} 620 L ${x + 270} 1920`} fill="none" stroke="#0A1420" strokeWidth={46} />
            ))}
          </svg>
          <RayosDeLuz x={540} y={-160} largo={1900} angulo={90} apertura={46} n={6} color="#F6DE8A" fuerza={0.34} />
        </Capa>
        {/* hilo relajado detrás de Cromwell (después de partir la corona) */}
        <Capa k={0.8}>
          <Hilo pts={linea} p={rampa(f, tMonarquia + 2, tMonarquia + 30, SALE)} ondula={7} grosor={7} />
        </Capa>
        {/* silueta severa de Cromwell */}
        <Capa k={0.9}>
          <div style={{ position: "absolute", left: 60, top: 150, width: 960, height: 960, borderRadius: "50%", background: "radial-gradient(circle, rgba(135,148,168,0.42) 0%, rgba(74,85,104,0.16) 45%, rgba(74,85,104,0) 70%)", opacity: crom }} />
          <div style={{ position: "absolute", left: 150, top: 200 + (1 - crom) * 60, opacity: crom, transform: `scale(${1.06 - crom * 0.06})`, transformOrigin: "390px 500px" }}>
            <Busto tipo="cromwell" w={780} sombra={0.7} silueta={0.72} />
          </div>
        </Capa>
        {/* corona + hilo que la envuelve */}
        {!roto ? (
          <>
            <Hilo pts={lazo} p={pHilo} grosor={7} ondula={3 * (1 - tension)} />
            <div style={{ position: "absolute", left: cx - 230, top: cy - 190, transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.6))" }}>
              <Corona w={460} />
            </div>
            <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, clipPath: `inset(${cy + 62}px 0 0 0)` }}>
              <Hilo pts={lazo} p={pHilo} grosor={7} ondula={3 * (1 - tension)} chispa={false} />
            </div>
          </>
        ) : (
          (["izq", "der"] as const).map((m, i) => {
            const s = i ? 1 : -1;
            return (
              <div key={m} style={{ position: "absolute", left: cx - 230 + s * tr * 7, top: cy - 190 - tr * 9 + tr * tr * 0.62, transform: `rotate(${-7 + s * tr * 2.6}deg)`, opacity: 1 - rampa(tr, 30, 48) }}>
                <Corona w={460} mitad={m} />
              </div>
            );
          })
        )}
        {roto ? (
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {Array.from({ length: 26 }, (_, i) => {
              const a = azar(i * 3) * Math.PI * 2;
              const v = 9 + azar(i * 7) * 16;
              return <rect key={i} x={cx + Math.cos(a) * v * tr} y={cy + Math.sin(a) * v * tr + tr * tr * 0.4} width={10} height={6} fill={i % 2 ? H.doradoClaro : H.dorado} opacity={1 - rampa(tr, 14, 40)} transform={`rotate(${tr * 20 + i * 30} ${cx + Math.cos(a) * v * tr} ${cy + Math.sin(a) * v * tr})`} />;
            })}
            <Destello x={cx} y={cy} r={150 * destello + 1} o={destello} />
          </svg>
        ) : null}
        {/* calendario */}
        <Capa k={1.1}>
          <div style={{ position: "absolute", left: 280, top: 730 + (1 - cal) * 1100, transform: `rotate(${-3 + (1 - cal) * 12}deg)`, opacity: cal > 0 ? 1 : 0 }}>
            <Calendario tacha={tacha} />
          </div>
        </Capa>
        <Capa k={1.4}>
          <div style={{ position: "absolute", left: -330, top: -100, width: 420, height: 2200, background: "linear-gradient(90deg,#1F0709 0%,#3A0D12 60%,rgba(58,13,18,0) 100%)", filter: "blur(10px)" }} />
          <div style={{ position: "absolute", left: 990, top: -100, width: 420, height: 2200, background: "linear-gradient(270deg,#1F0709 0%,#3A0D12 60%,rgba(58,13,18,0) 100%)", filter: "blur(10px)" }} />
        </Capa>
        <Polvo x={100} y={200} ancho={880} alto={1300} n={30} semilla={2} />
      </Camara>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 36%, #FFF6D0 0%, rgba(246,222,138,0.7) 30%, rgba(246,222,138,0) 70%)", opacity: destello * 0.95 }} />
      <Textura />
      <Sfx archivo="hilo" en={5} volumen={0.3} />
      <Sfx archivo="tension" en={tEjecuto} volumen={0.22} />
      <Sfx archivo="quiebre" en={tMonarquia} volumen={0.5} />
      <Sfx archivo="redoble" en={tDictadura - 10} volumen={0.3} />
      <Sfx archivo="pagina" en={tImplacable} volumen={0.4} />
      <Sfx archivo="pluma" en={tNavidad} volumen={0.5} />
      <Sfx archivo="whoosh" en={Math.max(0, tNavidad + 20)} volumen={0.4} />
    </Latigo>
  );
};

// ============ 2. Carlos I y la guerra civil ============
export const PuertaParlamento: React.FC<{ cierra: number; tranca: number }> = ({ cierra, tranca }) => {
  const f = useCurrentFrame();
  const golpe = interpolate(tranca, [0, 0.8, 1], [-260, 12, 0], CLAMP);
  return (
    <svg width={520} height={700} viewBox="0 0 520 700" style={{ overflow: "visible" }}>
      <path d="M 0 700 L 0 250 C 0 90 260 0 260 0 C 260 0 520 90 520 250 L 520 700 Z" fill="#2A1F18" stroke="#8C6239" strokeWidth={14} />
      <path d="M 40 700 L 40 262 C 40 130 260 52 260 52 C 260 52 480 130 480 262 L 480 700 Z" fill="#F6DE8A" opacity={0.75 * (1 - cierra)} />
      {[0, 1].map((i) => {
        const ab = (1 - cierra) * 0.72;
        return (
          <g key={i} transform={`translate(${i ? 480 : 40} 0) scale(${(i ? -1 : 1) * (1 - ab)} 1)`}>
            <path d="M 0 700 L 0 262 C 0 150 140 86 220 56 L 220 700 Z" fill="#4A3524" stroke="#231810" strokeWidth={5} />
            {[330, 480, 610].map((y) => (
              <rect key={y} x={22} y={y - 70} width={176} height={104} fill="none" stroke="#231810" strokeWidth={6} opacity={0.7} />
            ))}
            {[300, 450, 600].map((y) => (
              <rect key={`h${y}`} x={0} y={y} width={220} height={12} fill="#1B1F27" />
            ))}
            <circle cx={192} cy={410} r={13} fill="#8C6239" />
          </g>
        );
      })}
      {tranca > 0 ? (
        <g transform={`translate(0 ${golpe})`} opacity={cl(tranca * 4)}>
          <rect x={-20} y={372} width={560} height={50} rx={6} fill="#3A2A1C" stroke="#17100A" strokeWidth={5} />
          {[30, 250, 470].map((x) => (
            <rect key={x} x={x} y={364} width={22} height={66} fill="#4A5568" />
          ))}
          {tranca > 0.85 ? (
            <g>
              <path d="M 30 250 L 490 560 M 490 250 L 30 560" stroke="#59606C" strokeWidth={13} strokeDasharray="20 9" />
              <g transform={`translate(260 ${405 + Math.sin(f / 9) * 2})`}>
                <path d="M -22 -10 C -22 -52 22 -52 22 -10" fill="none" stroke="#8794A8" strokeWidth={10} />
                <rect x={-36} y={-14} width={72} height={60} rx={8} fill="#8C6239" stroke="#3A2A1C" strokeWidth={4} />
                <circle cy={12} r={8} fill="#17100A" />
              </g>
            </g>
          ) : null}
        </g>
      ) : null}
      <text x={260} y={214} textAnchor="middle" fontFamily={FUENTE_SERIFA} fontWeight={700} fontSize={36} fill="#D9C79E" letterSpacing={5} opacity={0.9}>
        PARLAMENTO
      </text>
    </svg>
  );
};

const Espadas: React.FC<{ x: number; y: number; aparece: number; anio: string; lado?: "izq" | "der" }> = ({ x, y, aparece, anio, lado = "der" }) => {
  const f = useCurrentFrame();
  const e = interpolate(f, [aparece, aparece + 6, aparece + 13], [0, 1.4, 1], CLAMP);
  if (e <= 0) return null;
  return (
    <g transform={`translate(${x} ${y})`}>
      <g transform={`scale(${e})`}>
        <circle r={24} fill="#E8DCC4" stroke="#2B2118" strokeWidth={3} />
        <path d="M -15 -15 L 15 15 M 15 -15 L -15 15" stroke="#2B2118" strokeWidth={6} strokeLinecap="round" />
        <path d="M -17 5 L -5 17 M 17 5 L 5 17" stroke={H.lacre} strokeWidth={5} strokeLinecap="round" />
      </g>
      <text x={lado === "der" ? 34 : -34} y={10} textAnchor={lado === "der" ? "start" : "end"} fontFamily={FUENTE_SERIFA} fontWeight={700} fontSize={28} fill="#2B2118" stroke="#E8DCC4" strokeWidth={7} paintOrder="stroke" opacity={cl(e)}>
        {anio}
      </text>
    </g>
  );
};

const MX = 110; // origen y escala del mapa en el mundo (escena 2)
const MY = 2380;
const ME = 0.86;
const enMapa = (lon: number, lat: number): Pt => [MX + geo(lon, lat)[0] * ME, MY + geo(lon, lat)[1] * ME];
const Carlos: React.FC<P> = () => {
  const f = useCurrentFrame();
  const tDivino = useMomento("derecho", 0.17);
  const tGoberno = useMomento("gobernó", 0.23);
  const tSin = useMomento("convocar", 0.31) - 6;
  const tImp = useMomento("imponiendo", 0.4);
  const tEsto = useMomento("Esto", 0.52);
  const tGuerra = useMomento("Guerra", 0.57);
  const tInglesa = useMomento("Inglesa", 0.6);
  const tMil = useMomento("entre mil", 0.65);
  const tReal = useMomento("realistas", 0.88);
  const tParl = useMomento("parlamentarios", 0.94);
  const llega = tEsto + 40;
  const divino = rampa(f, tDivino, tDivino + 20);
  const choque = rampa(f, tGuerra + 8, tInglesa + 6, ENTRA);
  const rebote = Math.max(0, 1 - (f - tInglesa - 6) / 14) * (f >= tInglesa + 6 ? 1 : 0);
  const bajada: Pt[] = [[560, 180], [470, 900], [640, 1700], [500, 2300], enMapa(-0.12, 51.5)];
  const campana: Pt[] = [geo(-0.12, 51.5), geo(-1.25, 53.96), geo(-0.99, 52.42), geo(-2.22, 52.19)];
  return (
    <Latigo entra>
      <Camara tomas={[{ f: 0, x: 540, y: 960, z: 1.0 }, { f: tEsto, x: 540, y: 905, z: 1.12 }, { f: llega, x: 540, y: 3000, z: 1.0 }, { f: llega + 260, x: 540, y: 2985, z: 1.07 }]}>
        {/* salón real */}
        <Capa k={0.4}>
          <div style={{ position: "absolute", left: -300, top: -200, width: 1680, height: 2300, background: "linear-gradient(180deg,#1A0B0E 0%,#3A1418 40%,#22090C 100%)" }} />
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 0.32 }}>
            {Array.from({ length: 40 }, (_, i) => {
              const x = -200 + (i % 8) * 200 + (Math.floor(i / 8) % 2) * 100;
              const y = 100 + Math.floor(i / 8) * 300;
              return <path key={i} d={`M ${x} ${y - 46} C ${x + 30} ${y - 20} ${x + 30} ${y + 20} ${x} ${y + 46} C ${x - 30} ${y + 20} ${x - 30} ${y - 20} ${x} ${y - 46} Z`} fill="none" stroke="#D4AF37" strokeWidth={4} />;
            })}
          </svg>
          {[120, 960].map((x, i) => (
            <div key={x} style={{ position: "absolute", left: x - 260, top: 160, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,196,110,0.55) 0%, rgba(255,170,80,0.16) 40%, rgba(255,170,80,0) 68%)", opacity: 0.8 + 0.2 * Math.sin(f / 4 + i * 2) * Math.sin(f / 7 + i) }} />
          ))}
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {[120, 960].map((x) => (
              <g key={x} transform={`translate(${x} 420)`}>
                <path d="M 0 0 L 0 150 M -70 60 C -70 110 70 110 70 60 M -70 60 L -70 30 M 70 60 L 70 30 M 0 0 L 0 -30" stroke="#C9A545" strokeWidth={9} fill="none" strokeLinecap="round" />
                {[-70, 0, 70].map((dx) => (
                  <path key={dx} d={`M ${dx} ${dx ? 26 : -34} c -12 -22 12 -34 0 -56 c 16 14 16 40 0 56 Z`} fill="#FFE2A0" transform={`rotate(${Math.sin(f / 5 + dx) * 5} ${dx} ${dx ? 26 : -34})`} />
                ))}
              </g>
            ))}
          </svg>
        </Capa>
        <Capa k={0.7}>
          <div style={{ position: "absolute", left: 280, top: 300 }}>
            <PuertaParlamento cierra={rampa(f, tGoberno, tGoberno + 30)} tranca={rampa(f, tSin, tSin + 16, Easing.linear)} />
          </div>
          <Humo x={280} y={760} ancho={520} alto={160} n={6} color="#B9A98C" fuerza={0.35 * rampa(f, tSin + 12, tSin + 20) * (1 - rampa(f, tSin + 30, tSin + 70))} r={60} vel={2} />
        </Capa>
        <Capa k={0.85}>
          <RayosDeLuz x={540} y={90} largo={1500} angulo={90} apertura={50} n={7} color="#F6DE8A" fuerza={0.2 + 0.5 * divino} />
        </Capa>
        {/* retrato */}
        <div style={{ position: "absolute", left: 200, top: 610 }}>
          <Busto tipo="carlos1" w={680} sombra={0.28} />
        </div>
        <div style={{ position: "absolute", left: 425, top: 560 - divino * 26 + Math.sin(f / 20) * 5, opacity: divino, filter: "drop-shadow(0 0 30px rgba(246,222,138,0.9))" }}>
          <Corona w={230} />
        </div>
        {/* impuestos que caen (primer plano) */}
        <Capa k={1.35}>
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: "blur(1.5px)" }}>
            {Array.from({ length: 9 }, (_, i) => {
              const t = (f - tImp - i * 6) / 62;
              if (t < 0 || t > 1.5) return null;
              const x = 80 + azar(i * 3) * 920 + Math.sin(t * 5 + i) * 60;
              const y = -260 + t * 2100;
              return (
                <g key={i} transform={`translate(${x} ${y}) rotate(${(azar(i) - 0.5) * 50 + t * 80 * (i % 2 ? 1 : -1)}) scale(${1.1 + azar(i * 5) * 0.5})`}>
                  <rect x={-90} y={-120} width={180} height={240} fill="#E8DCC4" stroke="#8C7A55" strokeWidth={3} />
                  {[0, 1, 2, 3, 4].map((k) => (
                    <rect key={k} x={-66} y={-92 + k * 30} width={132 - (k % 2) * 30} height={7} fill="#5B4A36" opacity={0.7} />
                  ))}
                  <circle cx={46} cy={82} r={22} fill={H.lacre} />
                </g>
              );
            })}
          </svg>
        </Capa>
        <Polvo x={120} y={300} ancho={840} alto={1100} n={26} semilla={5} />
        {/* transición hacia el mapa */}
        <div style={{ position: "absolute", left: -300, top: 1850, width: 1680, height: 320, background: `linear-gradient(180deg, rgba(34,9,12,0) 0%, #2A2016 55%, #A98F62 100%)` }} />
        <FondoPergamino x={-300} y={2150} w={1680} h={2100} />
        <div style={{ position: "absolute", left: MX, top: MY, transform: `scale(${ME})`, transformOrigin: "0 0" }}>
          <MapaIslas bandos={rampa(f, llega - 4, llega + 26)} rojo={f >= tReal && f < tParl ? 1.25 : 0.95} azul={f >= tParl ? 1.25 : 0.95}>
            <Lugar lon={-0.12} lat={51.5} nombre="Londres" aparece={llega - 6} pulso />
            <Lugar lon={-1.26} lat={51.75} nombre="Oxford" aparece={tReal - 30} lado="izq" tam={26} />
            <HiloG pts={campana} p={rampa(f, tMil, tMil + 110)} grosor={5} crudo ondula={0} />
            <Espadas x={geo(-1.25, 53.96)[0]} y={geo(-1.25, 53.96)[1]} aparece={tMil + 40} anio="1644" />
            <Espadas x={geo(-0.99, 52.42)[0]} y={geo(-0.99, 52.42)[1]} aparece={tMil + 76} anio="1645" />
            <Espadas x={geo(-2.22, 52.19)[0]} y={geo(-2.22, 52.19)[1]} aparece={tMil + 108} anio="1651" lado="izq" />
            <text x={geo(-3.5, 54.3)[0]} y={geo(-3.5, 54.3)[1]} textAnchor="middle" fontFamily={FUENTE_SERIFA} fontWeight={700} fontSize={34} fill="#6A1218" stroke="#E8DCC4" strokeWidth={8} paintOrder="stroke" letterSpacing={3} opacity={rampa(f, tReal, tReal + 10)}>
              REALISTAS
            </text>
            <text x={geo(1.3, 53.35)[0]} y={geo(1.3, 53.35)[1]} textAnchor="middle" fontFamily={FUENTE_SERIFA} fontWeight={700} fontSize={34} fill="#1E3F63" stroke="#E8DCC4" strokeWidth={8} paintOrder="stroke" letterSpacing={3} opacity={rampa(f, tParl, tParl + 10)}>
              PARLAMENTO
            </text>
            <text x={geo(-8.2, 50.7)[0]} y={geo(-8.2, 50.7)[1]} textAnchor="middle" fontFamily={FUENTE_SERIFA} fontStyle="italic" fontSize={27} fill="#6F6247" opacity={rampa(f, llega + 20, llega + 40)}>
              zonas aproximadas, 1643
            </text>
          </MapaIslas>
        </div>
        {/* estandartes que chocan */}
        <div style={{ position: "absolute", left: -420 + choque * 700 - rebote * 46, top: 3300, transform: `rotate(${10 - choque * 4 + rebote * 5}deg)`, transformOrigin: "0 460px", opacity: cl((f - llega + 10) / 10) }}>
          <Estandarte color={H.lacre} emblema="corona" w={260} h={180} asta={480} />
        </div>
        <div style={{ position: "absolute", left: 1220 - choque * 700 + rebote * 46, top: 3300, transform: `rotate(${-10 + choque * 4 - rebote * 5}deg)`, transformOrigin: "280px 460px", opacity: cl((f - llega + 10) / 10) }}>
          <Estandarte color={H.azulBando} emblema="liso" w={260} h={180} asta={480} espejo fase={2} />
        </div>
        <svg width={10} height={10} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <Destello x={540} y={3400} r={70 * rebote + 1} o={rebote} />
        </svg>
        <Hilo pts={bajada} p={rampa(f, tEsto - 4, llega - 2)} cola={rampa(f, llega + 6, llega + 40)} grosor={7} />
      </Camara>
      <Placa texto="INGLATERRA · SIGLO XVII" aparece={10} hasta={tEsto - 6} y={190} />
      <Nombre texto="CARLOS I" aparece={16} hasta={tEsto - 6} y={1300} />
      <Placa texto="1642 – 1651" aparece={tMil} y={215} tam={50} />
      <Textura />
      <Sfx archivo="puerta" en={tSin + 12} volumen={0.5} />
      <Sfx archivo="cadena" en={tSin + 18} volumen={0.35} />
      <Sfx archivo="pagina" en={tImp} volumen={0.4} />
      <Sfx archivo="pagina" en={tImp + 22} volumen={0.3} />
      <Sfx archivo="hilo" en={tEsto - 4} volumen={0.3} />
      <Sfx archivo="tambor" en={tGuerra} volumen={0.3} />
      <Sfx archivo="quiebre" en={tInglesa + 6} volumen={0.3} />
    </Latigo>
  );
};

// ============ 3. Cromwell y el Nuevo Ejército Modelo ============
const Cromwell: React.FC<P> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const tOrg = useMomento("Organizó", 0.48);
  const tModelo = useMomento("Modelo", 0.58);
  const tApl = useMomento("aplastó", 0.88);
  const corte = rampa(f, 0, 18);
  const aparta = rampa(f, tOrg - 4, tOrg + 40);
  const x0 = interpolate(f, [tOrg - 10, tOrg + 80, duracion], [-2100, -1000, -620], CLAMP);
  const cae = rampa(f, tApl + 4, tApl + 34, ENTRA);
  const hunt = geo(-0.18, 52.33);
  return (
    <AbsoluteFill style={{ background: H.noche }}>
      <Camara tomas={[{ f: 0, x: 540, y: 930, z: 1.14 }, { f: tOrg, x: 540, y: 950, z: 1.05 }, { f: tOrg + 50, x: 560, y: 960, z: 1.0 }, { f: duracion, x: 640, y: 970, z: 1.06 }]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg,#131C2B 0%,#3B4250 38%,#8A6A4A 62%,#2A2520 100%)" }} />
        <Capa k={0.25}>
          <Humo x={-300} y={700} ancho={1700} alto={500} n={12} color="#1A2230" fuerza={0.8} semilla={1} vel={0.5} r={220} />
          <div style={{ position: "absolute", left: -500, top: 420, width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,170,90,0.5) 0%, rgba(255,150,70,0.12) 45%, rgba(255,150,70,0) 70%)" }} />
        </Capa>
        <Capa k={0.45}>
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <path d="M -500 1040 C -200 960 100 1010 400 980 C 700 950 1000 1000 1700 960 L 1700 2000 L -500 2000 Z" fill="#232629" />
            <path d="M 700 975 L 700 900 L 760 860 L 820 900 L 820 975 Z M 820 975 L 820 930 L 900 930 L 900 975 Z" fill="#191B1E" opacity={1 - aparta} />
          </svg>
          <Tropa x={x0 * 0.6 - 200} y={1050} ancho={2300} n={26} alto={190} silueta={0.82} semilla={3} tipo="piquero" />
        </Capa>
        <Capa k={0.75}>
          <Humo x={-200} y={1150} ancho={1500} alto={300} n={8} color="#6B6258" fuerza={0.4} semilla={4} r={130} />
          <Tropa x={x0} y={1290} ancho={2500} n={15} alto={360} silueta={0.3} semilla={1} tipo="mixto" />
          <div style={{ position: "absolute", left: x0 + 620, top: 640 }}>
            <Estandarte color="#F0ECE2" emblema="cruz" w={230} h={160} asta={640} />
          </div>
          <div style={{ position: "absolute", left: x0 + 1650, top: 620 }}>
            <Estandarte color="#F0ECE2" emblema="cruz" w={230} h={160} asta={660} fase={2} />
          </div>
          {/* estandarte del rey que cae */}
          <div style={{ position: "absolute", left: 1040, top: 700, transform: `rotate(${cae * 82}deg)`, transformOrigin: "0 560px", opacity: rampa(f, tApl - 60, tApl - 30) * (1 - rampa(f, tApl + 30, tApl + 50)) }}>
            <Estandarte color={H.lacre} emblema="corona" w={250} h={180} asta={580} fase={1} caida={cae} />
          </div>
          <Humo x={900} y={1300} ancho={400} alto={420} n={7} color="#8A7F72" fuerza={0.7 * rampa(f, tApl + 20, tApl + 34)} semilla={9} vel={2.2} r={110} />
        </Capa>
        {/* retrato con luz lateral */}
        <div style={{ position: "absolute", left: 170 - aparta * 230, top: 500 + aparta * 110, transform: `scale(${1 - aparta * 0.14})`, transformOrigin: "370px 900px", filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.6))" }}>
          <Busto tipo="cromwell" w={740} sombra={0.6} />
        </div>
        <Capa k={1.35}>
          <Humo x={-300} y={1750} ancho={1700} alto={420} n={10} color="#22262C" fuerza={0.75} semilla={6} vel={0.8} r={190} />
        </Capa>
        <Ceniza n={30} sube={1.4} semilla={2} o={0.8} />
      </Camara>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(255,160,80,0.2) 0%, rgba(255,160,80,0) 42%)", mixBlendMode: "screen" }} />
      {/* match cut desde el mapa */}
      {corte < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - rampa(f, 5, 18) }}>
          <FondoPergamino />
          <div style={{ position: "absolute", left: MX, top: MY - 2040, transform: `scale(${ME * (1 + corte * 2.2)})`, transformOrigin: `${hunt[0]}px ${hunt[1]}px` }}>
            <MapaIslas bandos={1} />
          </div>
        </AbsoluteFill>
      ) : null}
      <Nombre texto="OLIVER CROMWELL" aparece={12} hasta={tOrg - 8} y={1265} />
      <Placa texto="NUEVO EJÉRCITO MODELO · 1645" aparece={tModelo} y={215} tam={36} />
      <Textura />
      <Sfx archivo="hilo" en={2} volumen={0.25} />
      <Sfx archivo="tambor" en={tOrg} volumen={0.4} />
      <Sfx archivo="tambor" en={tOrg + 90} volumen={0.4} />
      <Sfx archivo="tambor" en={tOrg + 180} volumen={0.35} />
      <Sfx archivo="golpe" en={tApl + 30} volumen={0.5} />
    </AbsoluteFill>
  );
};

// ============ 4. El regicidio ============
const Tribunal: React.FC = () => {
  const f = useCurrentFrame();
  const tAlta = useMomento("alta", 0.17);
  const inclina = rampa(f, tAlta, tAlta + 20);
  return (
    <Camara tomas={[{ f: 0, x: 540, y: 940, z: 1.0 }, { f: 170, x: 540, y: 1010, z: 1.22 }]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#0B0E14 0%,#1C1A1C 50%,#0E0B0A 100%)" }} />
      <Capa k={0.4}>
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d="M 380 760 L 380 300 C 380 150 540 80 540 80 C 540 80 700 150 700 300 L 700 760 Z" fill="#8FA0B4" opacity={0.5} />
          <path d="M 460 760 L 460 180 M 540 760 L 540 90 M 620 760 L 620 180 M 380 420 L 700 420" stroke="#1C1A1C" strokeWidth={12} />
          {[-1, 1].map((s) => (
            <g key={s}>
              {[0, 1, 2].map((i) => (
                <path key={i} d={`M ${540 + s * (640 - i * 40)} ${1000} C ${540 + s * (640 - i * 40)} ${300 + i * 120} ${540 + s * 200} ${-60 + i * 110} 540 ${-140 + i * 110}`} fill="none" stroke="#2B1F16" strokeWidth={34} />
              ))}
            </g>
          ))}
        </svg>
        <RayosDeLuz x={540} y={90} largo={1700} angulo={90} apertura={30} n={5} color="#DCE6F2" fuerza={0.5} />
      </Capa>
      <Capa k={0.7}>
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: 96 + i * 100 - 50, top: 500 + Math.abs(i - 4) * 10 + inclina * 12, transform: `rotate(${(i - 4) * -1.2 * inclina}deg)` }}>
            <Busto tipo="puritano" w={190} sombra={0} silueta={0.72} respira={false} />
          </div>
        ))}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <rect x={20} y={730} width={1040} height={150} fill="#241812" stroke="#0E0907" strokeWidth={6} />
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={44 + i * 114} y={752} width={88} height={106} fill="none" stroke="#3A2A1C" strokeWidth={5} />
          ))}
          <rect x={300} y={880} width={480} height={90} fill={H.lacre} />
          <rect x={300} y={880} width={480} height={14} fill="#5E1218" />
        </svg>
      </Capa>
      <div style={{ position: "absolute", left: 100, top: 760 }}>
        <Figura tipo="piquero" alto={640} silueta={0.6} />
      </div>
      <div style={{ position: "absolute", left: 715, top: 760 }}>
        <Figura tipo="piquero" alto={640} silueta={0.6} espejo />
      </div>
      <div style={{ position: "absolute", left: 300, top: 880, width: 480, height: 620, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(220,230,242,0.3) 0%, rgba(220,230,242,0) 68%)" }} />
      <div style={{ position: "absolute", left: 412, top: 800, filter: "drop-shadow(0 16px 20px rgba(0,0,0,0.7))" }}>
        <Figura tipo="rey" alto={620} />
      </div>
      <Capa k={1.3}>
        <Gentio y={1560} n={7} escala={1.25} semilla={3} />
      </Capa>
      <Polvo x={340} y={200} ancho={400} alto={1100} n={18} color="#DCE6F2" semilla={8} />
    </Camara>
  );
};

const Pluma: React.FC<{ x: number; y: number; rot?: number }> = ({ x, y, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path d="M 0 0 L 16 -40 C 60 -150 150 -260 250 -320 C 230 -210 150 -100 44 -30 Z" fill="#F4EFE6" stroke="#B9AE98" strokeWidth={3} />
    <path d="M 0 0 L 240 -306" stroke="#B9AE98" strokeWidth={3} />
    <path d="M 0 0 L 10 -20 L 20 -12 Z" fill="#2B2118" />
  </g>
);

const FIRMA: Pt[] = [[150, 560], [190, 500], [230, 590], [270, 505], [310, 585], [360, 520], [400, 575], [450, 530], [510, 570], [470, 610], [300, 630], [180, 618], [560, 600]];
const Sentencia: React.FC = () => {
  const f = useCurrentFrame();
  const tTreinta = useMomento("treinta", 0.3);
  const tMil = useMomento("mil seiscientos", 0.35);
  const tFirmo = useMomento("firmó", 0.47);
  const tSent = useMomento("sentencia", 0.5);
  const sube = rampa(f, tMil + 6, tMil + 36, SALE);
  const pf = rampa(f, tFirmo - 4, tSent + 4, Easing.inOut(Easing.quad));
  const sello = interpolate(f, [tSent + 8, tSent + 14, tSent + 22], [0, 1.25, 1], CLAMP);
  const cab = (() => {
    const i = Math.min(FIRMA.length - 1, pf * (FIRMA.length - 1));
    const a = FIRMA[Math.floor(i)];
    const b = FIRMA[Math.min(FIRMA.length - 1, Math.floor(i) + 1)];
    const t = i - Math.floor(i);
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  })();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #1B2E46 0%, ${H.noche} 60%, #050A12 100%)` }} />
      <TextoHilado texto="30 DE ENERO" p={rampa(f, tTreinta, tMil, Easing.linear)} y={250} tam={118} />
      <TextoHilado texto="DE 1649" p={rampa(f, tMil, tMil + 40, Easing.linear)} y={400} tam={118} color={H.pergamino} />
      <div style={{ position: "absolute", left: 190, top: 640 + (1 - sube) * 1300, transform: `rotate(${-2 + (1 - sube) * 8}deg)`, filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.7))" }}>
        <svg width={700} height={760} viewBox="0 0 700 760" style={{ overflow: "visible" }}>
          <path d="M 10 14 L 690 0 L 700 742 L 0 760 Z" fill="#E8DCC4" stroke="#8C7A55" strokeWidth={4} />
          <path d="M 10 14 L 690 0 L 700 742 L 0 760 Z" fill="#A98F62" opacity={0.16} />
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M 70 ${90 + i * 42} ${Array.from({ length: 14 }, (_, k) => `q 10 ${k % 2 ? -9 : 9} 20 0 t 20 0`).join(" ")}`} fill="none" stroke="#4A3B2A" strokeWidth={4} opacity={0.75} strokeDasharray={i === 8 ? "300 800" : undefined} />
          ))}
          {/* otras firmas del tribunal */}
          {Array.from({ length: 12 }, (_, i) => {
            const o = rampa(f, tSent + 16 + i * 2, tSent + 22 + i * 2);
            const x = 90 + (i % 4) * 150;
            const y = 668 + Math.floor(i / 4) * 26;
            return <path key={`f${i}`} d={`M ${x} ${y} q 14 -16 26 0 t 26 0 t 30 -4`} fill="none" stroke="#2B2118" strokeWidth={3} opacity={o * 0.8} />;
          })}
          <path d={FIRMA.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ")} fill="none" stroke="#17120E" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pf} />
          {pf > 0 && pf < 1 ? <Pluma x={cab[0]} y={cab[1]} rot={Math.sin(f / 2) * 4} /> : null}
          {sello > 0 ? (
            <g transform={`translate(560 500) scale(${sello})`}>
              <path d={Array.from({ length: 24 }, (_, i) => `${i ? "L" : "M"} ${Math.cos((i / 24) * Math.PI * 2) * (62 + (i % 2) * 9)} ${Math.sin((i / 24) * Math.PI * 2) * (62 + (i % 3) * 5)}`).join(" ") + " Z"} fill={H.lacre} />
              <circle r={44} fill="none" stroke="#5E1218" strokeWidth={6} />
              <path d="M -20 12 L -20 -10 L -10 0 L 0 -16 L 10 0 L 20 -10 L 20 12 Z" fill="#5E1218" />
              <circle cx={-22} cy={-26} r={10} fill="#C8565C" opacity={0.6} />
            </g>
          ) : null}
        </svg>
      </div>
      <Polvo x={100} y={200} ancho={880} alto={1300} n={18} semilla={11} />
      <Sfx archivo="hilo" en={tTreinta} volumen={0.3} />
      <Sfx archivo="pagina" en={tMil + 6} volumen={0.45} />
      <Sfx archivo="pluma" en={tFirmo - 4} volumen={0.55} />
      <Sfx archivo="lacre" en={tSent + 8} volumen={0.6} />
    </AbsoluteFill>
  );
};

const Whitehall: React.FC<{ desde: number }> = ({ desde }) => {
  const ventana = (x: number, y: number, fronton: boolean) => (
    <g key={`${x}-${y}`}>
      <rect x={x - 26} y={y} width={52} height={104} fill="#3B3226" />
      <rect x={x - 34} y={y - 8} width={68} height={8} fill="#8C7A55" />
      {fronton ? <path d={`M ${x - 40} ${y - 10} L ${x} ${y - 38} L ${x + 40} ${y - 10} Z`} fill="#A08C64" stroke="#5B4A36" strokeWidth={3} /> : <path d={`M ${x - 40} ${y - 10} C ${x - 30} ${y - 40} ${x + 30} ${y - 40} ${x + 40} ${y - 10} Z`} fill="#A08C64" stroke="#5B4A36" strokeWidth={3} />}
      <path d={`M ${x} ${y} L ${x} ${y + 104} M ${x - 26} ${y + 52} L ${x + 26} ${y + 52}`} stroke="#8C7A55" strokeWidth={3} />
    </g>
  );
  return (
    <Camara tomas={[{ f: desde, x: 540, y: 930, z: 1.0 }, { f: desde + 110, x: 540, y: 1010, z: 1.2 }]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#5E5A52 0%,#9A917F 45%,#B8AC93 70%,#6B6253 100%)" }} />
      <Capa k={0.2}>
        <Humo x={-300} y={520} ancho={1700} alto={380} n={12} color="#3F3D3A" fuerza={0.7} semilla={2} vel={0.5} r={210} />
      </Capa>
      <Capa k={0.45}>
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d="M -300 1000 L -300 760 L -180 700 L -60 760 L -60 820 L 60 820 L 60 700 L 110 660 L 160 700 L 160 1000 Z M 930 1000 L 930 740 L 1010 690 L 1090 740 L 1090 800 L 1240 800 L 1240 700 L 1300 700 L 1300 1000 Z" fill="#6E6656" />
        </svg>
      </Capa>
      <Capa k={0.65}>
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {/* Banqueting House (dibujo propio): basamento, dos órdenes de siete ventanas, balaustrada */}
          <rect x={150} y={470} width={780} height={640} fill="#C9B994" stroke="#5B4A36" strokeWidth={5} />
          <rect x={150} y={980} width={780} height={130} fill="#A8987A" />
          {Array.from({ length: 6 }, (_, i) => (
            <path key={i} d={`M 150 ${1000 + i * 20} L 930 ${1000 + i * 20}`} stroke="#7A6A50" strokeWidth={2.5} />
          ))}
          <rect x={136} y={452} width={808} height={22} fill="#B5A37E" stroke="#5B4A36" strokeWidth={4} />
          <rect x={150} y={722} width={780} height={16} fill="#B5A37E" stroke="#5B4A36" strokeWidth={3} />
          {Array.from({ length: 26 }, (_, i) => (
            <rect key={i} x={158 + i * 30} y={410} width={10} height={42} fill="#B5A37E" stroke="#5B4A36" strokeWidth={2} />
          ))}
          <rect x={150} y={400} width={780} height={12} fill="#B5A37E" stroke="#5B4A36" strokeWidth={3} />
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i}>
              <rect x={156 + i * 108} y={480} width={16} height={240} fill="#D9C9A4" stroke="#5B4A36" strokeWidth={2.5} />
              <rect x={156 + i * 108} y={742} width={16} height={236} fill="#D9C9A4" stroke="#5B4A36" strokeWidth={2.5} />
            </g>
          ))}
          {Array.from({ length: 7 }, (_, i) => ventana(218 + i * 108, 560, i % 2 === 0))}
          {Array.from({ length: 7 }, (_, i) => ventana(218 + i * 108, 820, i % 2 === 1))}
        </svg>
      </Capa>
      <Capa k={0.85}>
        {/* cadalso cubierto de paño negro */}
        {[330, 430, 610, 700].map((x, i) => (
          <div key={x} style={{ position: "absolute", left: x, top: 912 }}>
            <Figura tipo={i === 1 ? "richard" : "puritano"} alto={170} silueta={0.95} espejo={i > 1} />
          </div>
        ))}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <rect x={200} y={1076} width={680} height={170} fill="#0B0B0E" />
          <path d="M 200 1076 L 880 1076 L 880 1100 C 800 1130 720 1096 640 1124 C 560 1150 480 1100 400 1128 C 320 1150 260 1110 200 1126 Z" fill="#15151A" />
          <path d="M 200 1076 L 200 1010 L 880 1010 L 880 1076 M 310 1010 L 310 1076 M 420 1010 L 420 1076 M 540 1010 L 540 1076 M 660 1010 L 660 1076 M 770 1010 L 770 1076" stroke="#0B0B0E" strokeWidth={8} fill="none" />
        </svg>
      </Capa>
      <Tropa x={40} y={1400} ancho={1000} n={9} alto={270} silueta={0.86} semilla={5} />
      <Capa k={1.25}>
        <Gentio y={1380} n={8} escala={1.2} semilla={1} color="#14110E" />
      </Capa>
      <Capa k={1.45}>
        <Gentio y={1570} n={6} escala={1.6} semilla={7} color="#0A0908" />
      </Capa>
    </Camara>
  );
};

const CoronaCaida: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const t = f - desde;
  const hilo: Pt[] = [[-80, 1240], [200, 1300], [420, 1210], [640, 1330], [860, 1250], [1160, 1320]];
  return (
    <Camara tomas={[{ f: desde, x: 540, y: 1000, z: 1.0 }, { f: duracion, x: 540, y: 1060, z: 1.22 }]}>
      <AbsoluteFill style={{ background: "#03060B" }} />
      <Capa k={0.5}>
        <RayosDeLuz x={540} y={-100} largo={1800} angulo={90} apertura={24} n={4} color="#DCE6F2" fuerza={0.55} />
      </Capa>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs>
          <radialGradient id="cc-luz" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6B5A48" />
            <stop offset="100%" stopColor="#03060B" />
          </radialGradient>
        </defs>
        <ellipse cx={540} cy={1260} rx={620} ry={260} fill="url(#cc-luz)" />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M ${540 + (i - 4) * 60} 1040 L ${540 + (i - 4) * 190} 1520`} stroke="#03060B" strokeWidth={5} opacity={0.7} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: 370, top: 1020, transform: `rotate(${24 + Math.max(0, 1 - t / 30) * Math.sin(t / 3) * 6}deg)`, filter: "drop-shadow(0 24px 24px rgba(0,0,0,0.8))" }}>
        <Corona w={330} apagada={0.35} />
      </div>
      <Hilo pts={hilo} p={rampa(f, desde + 20, desde + 90)} ondula={2} grosor={5} o={0.85} />
      <Polvo x={380} y={300} ancho={320} alto={900} n={14} color="#DCE6F2" semilla={3} />
    </Camara>
  );
};

const Regicidio: React.FC<P> = () => {
  const { duracion } = useEscena();
  const tEl = useMomento("El treinta", 0.29) - 8;
  const tRey = useMomento("y el rey", 0.53) - 6;
  const tCorte = useMomento("Londres", 0.65) + 20;
  const tFue = useMomento("Fue la", 0.69);
  return (
    <AbsoluteFill style={{ background: "#03060B" }}>
      <Sub desde={0} hasta={tEl + 10}>
        <Tribunal />
        <Placa texto="WESTMINSTER HALL · ENERO DE 1649" aparece={50} hasta={tEl - 6} y={205} tam={34} />
      </Sub>
      <Sub desde={tEl} hasta={tRey + 10}>
        <Sentencia />
      </Sub>
      <Sub desde={tRey} hasta={tCorte} salida={0}>
        <Whitehall desde={tRey} />
        <AbsoluteFill style={{ background: "#8A7550", mixBlendMode: "multiply", opacity: 0.35 }} />
        <Llovizna />
        <Grabado fuerza={1.3} />
        <Placa texto="WHITEHALL · LONDRES" aparece={tRey + 10} hasta={tCorte - 12} y={205} />
      </Sub>
      <Sub desde={tFue - 6} hasta={duracion + 1} fundido={26} salida={0}>
        <CoronaCaida desde={tFue - 6} />
        <Llovizna fuerza={0.7} />
      </Sub>
      <Textura />
      <Sfx archivo="multitud" en={10} volumen={0.22} />
      <Sfx archivo="multitud" en={tRey} volumen={0.35} />
      <Sfx archivo="redoble" en={tRey + 20} volumen={0.4} />
      <Sfx archivo="golpe" en={tCorte} volumen={0.7} />
      <Sfx archivo="viento" en={tFue - 6} volumen={0.3} />
    </AbsoluteFill>
  );
};

// ============ 5. La Mancomunidad ============
const Mancomunidad: React.FC<P> = () => {
  const f = useCurrentFrame();
  const tMon = useMomento("monarquía", 0.07);
  const tLores = useMomento("Lores", 0.22);
  const tDecl = useMomento("declarando", 0.29);
  const tRep = useMomento("república", 0.43);
  const tManc = useMomento("Mancomunidad", 0.54);
  const tUnico = useMomento("único", 0.73);
  const d1 = rampa(f, tMon, tMon + 34);
  const d2 = rampa(f, tLores, tLores + 34);
  const marco: Pt[] = [[-60, 1100], [120, 1190], [212, 1160], [212, 540], [868, 540], [868, 985], [212, 985]];
  const pm = rampa(f, tLores + 16, tRep + 6);
  const tela = rampa(f, tRep - 12, tRep + 22);
  const linea = rampa(f, tUnico, tUnico + 34);
  const icono = (x: number, d: number, hijo: React.ReactNode, rotulo: string, ancho: number) => (
    <>
      <div style={{ position: "absolute", left: x, top: 350 - d * 50, opacity: 1 - d, filter: `blur(${d * 6}px)` }}>{hijo}</div>
      <div style={{ position: "absolute", left: x - 60, top: 660, width: ancho + 120, textAlign: "center", fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: 36, letterSpacing: 3, color: H.pergamino, opacity: (1 - rampa(f, tDecl - 6, tDecl + 8)) * 0.9 }}>
        {rotulo}
        <div style={{ position: "absolute", left: "8%", top: 17, height: 5, width: `${84 * cl(d * 2.5)}%`, background: "#0B0B0E", borderRadius: 3 }} />
      </div>
      <Ceniza n={34} x={x - 40} y={240} ancho={ancho + 80} alto={380} color="#C9B68F" color2="#6B6253" sube={2.4} semilla={x} o={Math.sin(Math.PI * cl(d * 1.15)) * 0.95} tam={1.5} />
    </>
  );
  return (
    <AbsoluteFill style={{ background: "#03060B" }}>
      <AbsoluteFill style={{ opacity: rampa(f, 0, 14) }}>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #223A56 0%, ${H.noche} 58%, #050A12 100%)` }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.16, mixBlendMode: "screen" }}>
          <FondoPergamino />
        </div>
        <Camara tomas={[{ f: 0, x: 540, y: 900, z: 1.1 }, { f: tDecl + 10, x: 540, y: 930, z: 1.04 }, { f: tDecl + 220, x: 540, y: 960, z: 1.0 }]}>
          {icono(110, d1, <Corona w={340} apagada={0.15} />, "MONARQUÍA", 340)}
          {icono(
            610,
            d2,
            <svg width={360} height={296} viewBox="0 0 280 230">
              <path d="M 20 150 C 90 176 190 176 260 150 L 260 206 C 190 232 90 232 20 206 Z" fill="#C9A545" stroke="#7A5A16" strokeWidth={4} />
              {[36, 88, 140, 192, 244].map((x, i) => (
                <g key={x}>
                  <path d={`M ${x} ${158 + (i === 0 || i === 4 ? -4 : 6)} L ${x} 96`} stroke="#C9A545" strokeWidth={7} />
                  <circle cx={x} cy={82} r={17} fill="#F4EFE6" stroke="#9A9382" strokeWidth={3} />
                </g>
              ))}
              <path d="M 30 150 C 60 60 220 60 250 150 Z" fill={H.lacre} opacity={0.85} />
              {[36, 88, 140, 192, 244].map((x) => (
                <circle key={`p${x}`} cx={x} cy={82} r={17} fill="#F4EFE6" stroke="#9A9382" strokeWidth={3} />
              ))}
            </svg>,
            "CÁMARA DE LOS LORES",
            360,
          )}
          {/* el hilo teje el estandarte */}
          <div style={{ position: "absolute", left: 212, top: 540, opacity: tela, filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.6))" }}>
            <Estandarte color="#F0ECE2" emblema="mancomunidad" w={656} h={445} asta={760} />
          </div>
          <Hilo pts={marco} p={pm} crudo ondula={1.5} grosor={6} o={1 - rampa(f, tRep + 30, tRep + 60) * 0.75} />
          {/* línea de tiempo: el único paréntesis sin rey */}
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <path d={`M 90 1300 L ${90 + 900 * linea} 1300`} stroke="#8C7A55" strokeWidth={7} strokeLinecap="round" />
            {[150, 290, 430, 570, 850, 960].map((x, i) => (
              <g key={x} transform={`translate(${x - 36} 1218) scale(0.18)`} opacity={cl(linea * 6 - i) * 0.75}>
                <Corona apagada={0.5} />
              </g>
            ))}
            {linea > 0.7 ? (
              <g>
                <path d="M 668 1300 L 752 1300" stroke={H.dorado} strokeWidth={13} strokeLinecap="round" />
                <path d="M 668 1300 L 752 1300" stroke="#FFF6D0" strokeWidth={4} strokeLinecap="round" />
                <Destello x={710} y={1300} r={18} o={0.5 + 0.5 * Math.sin(f / 5)} />
                <text x={710} y={1250} textAnchor="middle" fontFamily={FUENTE_SERIFA} fontWeight={700} fontSize={46} fill={H.doradoClaro}>
                  1649 – 1660
                </text>
              </g>
            ) : null}
          </svg>
        </Camara>
        <Placa texto="MANCOMUNIDAD DE INGLATERRA · 1649" aparece={tManc} y={250} tam={34} />
      </AbsoluteFill>
      <Ceniza n={18} color="#C9B68F" color2="#6B6253" sube={0.5} semilla={8} o={0.5} />
      <Textura />
      <Sfx archivo="apagar" en={tMon} volumen={0.4} />
      <Sfx archivo="apagar" en={tLores} volumen={0.4} />
      <Sfx archivo="hilo" en={tDecl} volumen={0.3} />
      <Sfx archivo="tela" en={tRep - 10} volumen={0.4} />
      <Sfx archivo="brillo" en={tManc} volumen={0.2} />
      <Sfx archivo="hilo" en={tUnico} volumen={0.25} />
    </AbsoluteFill>
  );
};

export const ESCENAS_CROMWELL_1: Record<string, React.FC<P>> = {
  "cromwell/gancho": Gancho,
  "cromwell/carlos": Carlos,
  "cromwell/cromwell": Cromwell,
  "cromwell/regicidio": Regicidio,
  "cromwell/mancomunidad": Mancomunidad,
};
