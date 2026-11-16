// Cromwell — escenas 6 a 10: el golpe de 1653, el código moral, Irlanda y Escocia,
// la Restauración y la ejecución póstuma (+ cierre de marca).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { useEscena } from "../../video/contexto";
import { FUENTE_SERIFA, FUENTE_TITULO } from "../../marca/fuentes";
import { Sfx, useMomento } from "../comun";
import { Polvo, RayosDeLuz, azar } from "../ambiente";
import { Camara, Capa, Textura } from "../jesus-12-30/escenarios";
import { Busto, Ceniza, CierreCanal, Corona, Figura, FondoPergamino, Gentio, Grabado, H, Hilo, HiloG, Humo, Lugar, MapaIslas, Nombre, Placa, Pt, SALE, TextoHilado, Tropa, cl, geo, rampa } from "../historia/piezas";
import { P, PuertaParlamento, Sub } from "./escenas-1";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ENTRA = Easing.in(Easing.cubic);

// ============ 6. El golpe al Parlamento y el Protectorado ============
const Golpe: React.FC<P> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const tEn = useMomento("En mil", 0.21);
  const tEntro = useMomento("entró", 0.37);
  const tDis = useMomento("disolvió", 0.5);
  const tLord = useMomento("Lord", 0.7);
  const tDict = useMomento("dictadura", 0.88);
  const abre = rampa(f, tEntro - 4, tEntro + 8, SALE);
  const avanza = rampa(f, tEntro + 4, tDis + 30, Easing.out(Easing.quad));
  const huye = rampa(f, tDis, tDis + 40, ENTRA);
  const gris = rampa(f, tDict - 10, tDict + 30);
  const cae = rampa(f, tDict, tDict + 26, SALE);
  const banco = (lado: number, fila: number) => {
    const y = 900 + fila * 150;
    const x0 = lado < 0 ? -30 - fila * 40 : 720 + fila * 40;
    return (
      <React.Fragment key={`${lado}-${fila}`}>
        {[0, 1, 2].map((i) => {
          const disc = Math.sin(f / (7 + i) + fila * 2 + lado) * 5 * (1 - huye);
          return (
            <div key={i} style={{ position: "absolute", left: x0 + i * 130 + lado * huye * (700 + i * 60) + disc, top: y - 150 + Math.abs(disc) * 0.6, transform: `rotate(${disc * 0.8 + lado * huye * 14}deg)`, opacity: 1 - rampa(f, tDis + 26, tDis + 44) }}>
              <Busto tipo={(i + fila) % 2 ? "puritano" : "richard"} w={150 + fila * 20} sombra={0} silueta={0.35} respira={false} />
            </div>
          );
        })}
        <div style={{ position: "absolute", left: x0 - 20, top: y + 20, width: 430 + fila * 40, height: 70, background: "linear-gradient(180deg,#4A3524,#2A1F18)", border: "4px solid #17100A", borderRadius: 6 }} />
      </React.Fragment>
    );
  };
  return (
    <AbsoluteFill style={{ background: "#0B0E14" }}>
      <Camara tomas={[{ f: 0, x: 540, y: 960, z: 1.0 }, { f: tEntro, x: 540, y: 900, z: 1.1 }, { f: tLord, x: 540, y: 940, z: 1.04 }, { f: duracion, x: 540, y: 960, z: 1.12 }]}>
        <Capa k={0.4}>
          <div style={{ position: "absolute", left: -300, top: -200, width: 1680, height: 2400, background: "linear-gradient(180deg,#1B1712 0%,#3A2E22 45%,#1C1611 100%)" }} />
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {[60, 860].map((x) => (
              <g key={x}>
                <path d={`M ${x} 900 L ${x} 380 C ${x} 300 ${x + 80} 250 ${x + 80} 250 C ${x + 80} 250 ${x + 160} 300 ${x + 160} 380 L ${x + 160} 900 Z`} fill="#8FA0B4" opacity={0.45 - gris * 0.25} />
                <path d={`M ${x + 80} 250 L ${x + 80} 900 M ${x} 520 L ${x + 160} 520 M ${x} 700 L ${x + 160} 700`} stroke="#1B1712" strokeWidth={9} />
              </g>
            ))}
            <rect x={-300} y={900} width={1680} height={40} fill="#17100A" />
          </svg>
        </Capa>
        <Capa k={0.65}>
          <div style={{ position: "absolute", left: 280, top: 300 }}>
            <PuertaParlamento cierra={1 - abre} tranca={0} />
          </div>
          <div style={{ position: "absolute", left: 140, top: 200, width: 800, height: 1000, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(246,222,138,0.55) 0%, rgba(246,222,138,0) 65%)", opacity: abre * (1 - gris * 0.6) }} />
        </Capa>
        {/* suelo y mesa con la maza */}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d="M -300 1000 L 1380 1000 L 1380 2000 L -300 2000 Z" fill="#231A13" />
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M ${540 + (i - 4) * 70} 1000 L ${540 + (i - 4) * 260} 1920`} stroke="#17100A" strokeWidth={4} opacity={0.7} />
          ))}
        </svg>
        <Capa k={0.85}>
          {/* soldados que irrumpen */}
          {[-1, 1, -2, 2].map((s, i) => {
            const e = 0.5 + avanza * 0.6;
            const x = 540 + s * (40 + avanza * (150 + Math.abs(s) * 55));
            return (
              <div key={s} style={{ position: "absolute", left: x - 75 * e, top: 1010 + avanza * (60 + Math.abs(s) * 40) - 360 * e, transform: `scale(${e})`, transformOrigin: "0 0", opacity: cl((f - tEntro - i * 3) / 6) }}>
                <Figura tipo={i % 2 ? "piquero" : "mosquetero"} alto={360} paso={f / 4 + i} marcha={avanza < 0.97 ? 1 : 0} espejo={s > 0} silueta={0.25 + gris * 0.3} />
              </div>
            );
          })}
        </Capa>
        {[0, 1, 2].map((fila) => banco(-1, fila))}
        {[0, 1, 2].map((fila) => banco(1, fila))}
        {/* Cromwell toma el centro */}
        <div style={{ position: "absolute", left: 540 - 125 * (0.55 + avanza * 0.75), top: 1040 + avanza * 380 - 600 * (0.55 + avanza * 0.75), transform: `scale(${0.55 + avanza * 0.75})`, transformOrigin: "0 0", opacity: cl((f - tEntro + 2) / 6), filter: "drop-shadow(0 20px 24px rgba(0,0,0,0.7))" }}>
          <Figura tipo="cromwell" alto={600} paso={f / 4.5} marcha={avanza < 0.97 ? 1 : 0} />
        </div>
        {/* pendones de hierro que caen */}
        {[90, 830].map((x, i) => (
          <div key={x} style={{ position: "absolute", left: x, top: -80, width: 160, height: 760 * cae, background: "linear-gradient(180deg,#2C3440,#4A5568 80%,#39424F)", borderBottom: `10px solid ${H.bronce}`, clipPath: "polygon(0 0,100% 0,100% 100%,50% 92%,0 100%)", opacity: cae > 0 ? 1 : 0, transform: `skewX(${Math.sin(f / 16 + i) * 1.2}deg)` }} />
        ))}
        <Capa k={1.3}>
          <Humo x={-300} y={1900} ancho={1700} alto={300} n={8} color="#14100C" fuerza={0.8} semilla={3} r={170} />
        </Capa>
        <Polvo x={240} y={300} ancho={600} alto={900} n={20} semilla={6} />
      </Camara>
      <AbsoluteFill style={{ background: H.hierro, mixBlendMode: "color", opacity: gris * 0.55 }} />
      <Placa texto="1653" aparece={tEn} hasta={tLord - 8} y={215} tam={50} />
      <Placa texto="LORD PROTECTOR · 1653" aparece={tLord} y={230} tam={54} metal />
      <Textura />
      <Sfx archivo="multitud" en={4} volumen={0.3} />
      <Sfx archivo="puerta" en={tEntro - 4} volumen={0.65} />
      <Sfx archivo="redoble" en={tEntro + 6} volumen={0.4} />
      <Sfx archivo="quiebre" en={tLord} volumen={0.25} />
      <Sfx archivo="golpe" en={tDict} volumen={0.4} />
    </AbsoluteFill>
  );
};

// ============ 7. El código moral puritano ============
const AN = 1080;
const Vineta: React.FC<{ i: number; children: React.ReactNode; luz?: number }> = ({ i, children, luz = 1 }) => (
  <div style={{ position: "absolute", left: i * AN, top: 0, width: AN, height: 1920 }}>
    <div style={{ position: "absolute", left: 40, top: 420, width: 1000, height: 1000, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,220,196,0.2) 0%, rgba(232,220,196,0.06) 45%, rgba(232,220,196,0) 70%)", opacity: luz }} />
    {children}
  </div>
);

const Codigo: React.FC<P> = () => {
  const f = useCurrentFrame();
  const tTeatros = useMomento("cerraron", 0.24);
  const tCab = useMomento("carreras", 0.37);
  const tJuego = useMomento("juego", 0.47);
  const tTab = useMomento("tabernas", 0.53);
  const tDom = useMomento("domingos", 0.6);
  const tInc = useMomento("incluso", 0.66);
  const tNav = useMomento("Navidad", 0.84);
  const cx = (i: number) => 540 + i * AN;
  const tomas = [
    { f: 0, x: cx(0), y: 960, z: 1.06 },
    { f: tTeatros - 12, x: cx(0), y: 960, z: 1.0 },
    { f: tTeatros, x: cx(1), y: 960, z: 1.0 },
    { f: tCab - 14, x: cx(1), y: 960, z: 1.04 },
    { f: tCab - 2, x: cx(2), y: 960, z: 1.0 },
    { f: tJuego - 20, x: cx(2), y: 960, z: 1.04 },
    { f: tJuego - 9, x: cx(3), y: 960, z: 1.0 },
    { f: tTab - 5, x: cx(3), y: 960, z: 1.04 },
    { f: tTab + 6, x: cx(4), y: 960, z: 1.0 },
    { f: tInc - 4, x: cx(4), y: 960, z: 1.04 },
    { f: tInc + 10, x: cx(5), y: 960, z: 1.0 },
    { f: tInc + 150, x: cx(5), y: 980, z: 1.08 },
  ];
  const camX = interpolate(f, tomas.map((t) => t.f), tomas.map((t) => t.x), CLAMP);
  const hilo: Pt[] = Array.from({ length: 40 }, (_, i) => [-200 + i * 180, 470 + Math.sin(i * 0.9) * 46] as Pt);
  const telon = rampa(f, tTeatros + 12, tTeatros + 34, Easing.bounce);
  const cadena = rampa(f, tTeatros + 34, tTeatros + 46);
  const establo = rampa(f, tCab + 20, tCab + 34, Easing.bounce);
  const sombra = rampa(f, tJuego + 2, tJuego + 20);
  const taberna = rampa(f, tDom, tDom + 14, Easing.bounce);
  const vela = (k: number) => 1 - rampa(f, tNav + k * 14, tNav + k * 14 + 8);
  const noche = 1 - (vela(0) + vela(1) + vela(2)) / 3;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, #1B2E46 0%, ${H.noche} 60%, #050A12 100%)` }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.1, mixBlendMode: "screen" }}>
        <FondoPergamino />
      </div>
      <Camara tomas={tomas}>
        {/* 0: la ordenanza */}
        <Vineta i={0}>
          <div style={{ position: "absolute", left: 250, top: 600, transform: `rotate(-3deg) translateY(${(1 - rampa(f, 2, 24, SALE)) * 300}px)`, opacity: rampa(f, 0, 12), filter: "drop-shadow(0 26px 34px rgba(0,0,0,0.6))" }}>
            <svg width={580} height={720} viewBox="0 0 580 720">
              <path d="M 8 12 L 572 0 L 580 706 L 0 720 Z" fill="#E8DCC4" stroke="#8C7A55" strokeWidth={4} />
              <text x={290} y={96} textAnchor="middle" fontFamily={FUENTE_SERIFA} fontWeight={700} fontSize={54} fill="#2B2118" letterSpacing={6}>
                ORDENANZA
              </text>
              <path d="M 120 124 L 460 124" stroke="#2B2118" strokeWidth={4} />
              {Array.from({ length: 10 }, (_, i) => (
                <rect key={i} x={70} y={170 + i * 42} width={(440 - (i % 3) * 50) * rampa(f, 20 + i * 5, 34 + i * 5)} height={8} rx={4} fill="#4A3B2A" opacity={0.75} />
              ))}
              <circle cx={440} cy={630} r={48} fill={H.lacre} />
              <circle cx={440} cy={630} r={32} fill="none" stroke="#5E1218" strokeWidth={5} />
            </svg>
          </div>
        </Vineta>
        {/* 1: el teatro */}
        <Vineta i={1}>
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <defs>
              <clipPath id="cod-esc">
                <rect x={210} y={640} width={660} height={640} />
              </clipPath>
            </defs>
            <rect x={210} y={640} width={660} height={640} fill="#F2C879" opacity={1 - telon * 0.8} />
            <rect x={210} y={1150} width={660} height={130} fill="#6E4A26" />
            <g opacity={1 - telon}>
              <circle cx={540} cy={1010} r={46} fill="#2B2118" />
              <path d="M 470 1160 C 470 1060 610 1060 610 1160 Z" fill="#2B2118" />
            </g>
            <g clipPath="url(#cod-esc)">
              {[-1, 1].map((s) => (
                <g key={s} transform={`translate(${540 + s * (330 - telon * 330)} 0)`}>
                  <rect x={s < 0 ? -340 : 0} y={630} width={340} height={660} fill={H.lacre} />
                  {[0, 1, 2, 3, 4].map((k) => (
                    <rect key={k} x={(s < 0 ? -340 : 0) + 20 + k * 68} y={630} width={22} height={660} fill="#5E1218" opacity={0.7} />
                  ))}
                </g>
              ))}
            </g>
            <path d="M 170 1300 L 170 600 C 170 520 910 520 910 600 L 910 1300 L 870 1300 L 870 650 L 210 650 L 210 1300 Z" fill="#4A3524" stroke="#231810" strokeWidth={6} />
            <path d="M 210 650 C 320 730 760 730 870 650 Z" fill="#7A1A20" stroke="#5E1218" strokeWidth={4} />
            {cadena > 0 ? (
              <g opacity={cadena}>
                <path d="M 200 760 L 880 1180 M 880 760 L 200 1180" stroke="#8794A8" strokeWidth={15} strokeDasharray="24 10" />
                <g transform="translate(540 970)">
                  <path d="M -26 -12 C -26 -62 26 -62 26 -12" fill="none" stroke="#8794A8" strokeWidth={12} />
                  <rect x={-44} y={-16} width={88} height={74} rx={10} fill={H.bronce} stroke="#3A2A1C" strokeWidth={5} />
                  <circle cy={16} r={10} fill="#17100A" />
                </g>
              </g>
            ) : null}
          </svg>
        </Vineta>
        {/* 2: las carreras de caballos */}
        <Vineta i={2}>
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <rect x={230} y={600} width={620} height={700} fill="#0E141C" />
            <rect x={230} y={600} width={620} height={700} fill="#F2C879" opacity={0.18 * (1 - establo)} />
            <g transform={`translate(${372 + Math.sin(f / 9) * 6} ${690 + Math.sin(f / 6) * 5})`}>
              <path d="M 40 520 C 20 380 50 250 150 180 L 132 96 L 190 150 C 270 150 330 210 372 300 C 398 350 410 388 396 414 C 378 444 340 440 316 416 C 280 400 236 404 210 424 C 226 470 240 500 250 560 L 40 560 Z" fill="#5A4030" stroke="#2B1D14" strokeWidth={6} />
              <path d="M 150 180 C 100 230 70 300 60 380 C 96 330 120 290 150 180 Z M 120 250 C 84 310 64 380 56 460 C 90 400 110 340 120 250 Z" fill="#2B1D14" />
              <circle cx={278} cy={262} r={13} fill="#120C08" />
              <ellipse cx={378} cy={396} rx={7} ry={10} fill="#120C08" />
            </g>
            {/* media puerta inferior y postigos que se cierran */}
            <rect x={230} y={1040} width={620} height={260} fill="#4A3524" stroke="#231810" strokeWidth={6} />
            <path d="M 230 1040 L 850 1300 M 850 1040 L 230 1300" stroke="#231810" strokeWidth={10} />
            {[-1, 1].map((s) => (
              <g key={s} transform={`translate(${s < 0 ? 230 : 850} 0) scale(${s < 0 ? establo : -establo} 1)`}>
                <rect x={0} y={600} width={310} height={440} fill="#4A3524" stroke="#231810" strokeWidth={6} />
                <path d="M 0 600 L 310 1040 M 310 600 L 0 1040" stroke="#231810" strokeWidth={10} />
              </g>
            ))}
            {establo > 0.95 ? <rect x={200} y={800} width={680} height={44} rx={6} fill="#2A1F18" stroke="#17100A" strokeWidth={5} /> : null}
            <path d="M 200 1300 L 200 560 L 880 560 L 880 1300" fill="none" stroke="#2A1F18" strokeWidth={34} />
            <path d="M 540 500 C 500 500 478 530 482 566 L 500 566 C 498 540 514 520 540 520 C 566 520 582 540 580 566 L 598 566 C 602 530 580 500 540 500 Z" fill="#8794A8" />
          </svg>
        </Vineta>
        {/* 3: el juego */}
        <Vineta i={3}>
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <ellipse cx={540} cy={1060} rx={430} ry={250} fill="#3A5A44" stroke="#4A3524" strokeWidth={26} />
            {[-1, 0, 1].map((k) => (
              <g key={k} transform={`translate(${440 + k * 20} 1010) rotate(${-24 + k * 22 + Math.sin(f / 20) * 2})`}>
                <rect x={-70} y={-200} width={140} height={200} rx={10} fill="#F1E9D6" stroke="#2B2118" strokeWidth={4} />
                {k === 0 ? <path d="M 0 -150 L 34 -100 L 0 -50 L -34 -100 Z" fill={H.lacreClaro} /> : k < 0 ? <path d="M 0 -62 C -60 -110 -30 -150 0 -124 C 30 -150 60 -110 0 -62 Z" fill={H.lacreClaro} /> : <path d="M 0 -150 C 50 -110 40 -70 8 -80 L 16 -52 L -16 -52 L -8 -80 C -40 -70 -50 -110 0 -150 Z" fill="#17120E" />}
              </g>
            ))}
            {[[650, 1040, 14], [740, 1120, -20]].map(([x, y, r], i) => (
              <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
                <rect x={-48} y={-48} width={96} height={96} rx={14} fill="#F1E9D6" stroke="#2B2118" strokeWidth={5} />
                {(i ? [[-22, -22], [22, 22], [0, 0], [-22, 22], [22, -22]] : [[-22, -22], [22, 22], [0, 0]]).map(([a, b], k) => (
                  <circle key={k} cx={a} cy={b} r={9} fill="#17120E" />
                ))}
              </g>
            ))}
            <ellipse cx={540} cy={1060} rx={460} ry={280} fill="#03060B" opacity={sombra * 0.88} />
            {sombra > 0.3 ? (
              <g transform="translate(540 1040)" stroke="#0B0B0E" strokeWidth={30} strokeLinecap="round" opacity={0.95}>
                <path d="M -170 -150 L 170 150" strokeDasharray={460} strokeDashoffset={460 * (1 - cl((sombra - 0.3) * 3))} />
                <path d="M 170 -150 L -170 150" strokeDasharray={460} strokeDashoffset={460 * (1 - cl((sombra - 0.6) * 3))} />
              </g>
            ) : null}
          </svg>
        </Vineta>
        {/* 4: la taberna en domingo */}
        <Vineta i={4}>
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <path d="M 180 1320 L 180 700 L 540 500 L 900 700 L 900 1320 Z" fill="#D9C9A4" stroke="#3A2A1C" strokeWidth={10} />
            <path d="M 180 700 L 900 700 M 180 940 L 900 940 M 360 700 L 360 1320 M 720 700 L 720 1320 M 180 700 L 360 940 M 900 700 L 720 940 M 540 500 L 540 700" stroke="#3A2A1C" strokeWidth={14} />
            <path d="M 140 720 L 540 470 L 940 720" fill="none" stroke="#2A1F18" strokeWidth={36} strokeLinejoin="round" />
            <rect x={212} y={760} width={116} height={140} fill="#F2C879" opacity={1 - taberna * 0.92} />
            <rect x={752} y={760} width={116} height={140} fill="#F2C879" opacity={1 - taberna * 0.92} />
            <path d="M 270 760 L 270 900 M 212 830 L 328 830 M 810 760 L 810 900 M 752 830 L 868 830" stroke="#3A2A1C" strokeWidth={8} />
            <rect x={420} y={980} width={240} height={340} fill="#F2C879" opacity={1 - taberna} />
            <g transform={`translate(420 0) scale(${0.12 + taberna * 0.88} 1)`}>
              <rect x={0} y={980} width={240} height={340} fill="#4A3524" stroke="#231810" strokeWidth={6} />
              <path d="M 0 1090 L 240 1090 M 0 1210 L 240 1210" stroke="#1B1F27" strokeWidth={12} />
              <circle cx={206} cy={1150} r={11} fill={H.bronce} />
            </g>
            {/* cartel colgante */}
            <path d="M 900 800 L 1010 800" stroke="#2A1F18" strokeWidth={12} />
            <g transform={`rotate(${Math.sin(f / 9) * 5 + (taberna > 0 && taberna < 1 ? 8 : 0)} 960 800)`}>
              <path d="M 930 800 L 930 830 M 990 800 L 990 830" stroke="#2A1F18" strokeWidth={5} />
              <rect x={905} y={830} width={110} height={130} rx={8} fill="#4A3524" stroke="#231810" strokeWidth={5} />
              <path d="M 935 866 L 975 866 L 972 930 L 938 930 Z M 975 880 C 996 880 996 912 974 912" fill="none" stroke="#E8DCC4" strokeWidth={7} strokeLinejoin="round" />
            </g>
          </svg>
          <Placa texto="DOMINGO" aparece={tDom - 8} y={345} tam={44} />
        </Vineta>
        {/* 5: la mesa de Navidad que se apaga */}
        <Vineta i={5} luz={1 - noche}>
          <div style={{ position: "absolute", left: 90, top: 520, width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,190,100,0.5) 0%, rgba(255,170,80,0.14) 45%, rgba(255,170,80,0) 70%)", opacity: 1 - noche }} />
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, filter: `brightness(${1 - noche * 0.82}) saturate(${1 - noche * 0.7})` }}>
            {/* guirnalda de acebo */}
            <path d="M 150 640 C 340 780 740 780 930 640" fill="none" stroke="#2E5A3A" strokeWidth={26} strokeLinecap="round" />
            {Array.from({ length: 13 }, (_, i) => {
              const t = i / 12;
              const x = 150 + 780 * t;
              const y = 640 + Math.sin(Math.PI * t) * 105;
              return (
                <g key={i}>
                  <path d={`M ${x - 26} ${y} L ${x - 8} ${y - 16} L ${x + 8} ${y - 6} L ${x + 26} ${y - 14} L ${x + 16} ${y + 12} L ${x - 10} ${y + 16} Z`} fill="#3E7A4E" />
                  {i % 2 ? <circle cx={x} cy={y + 14} r={10} fill={H.lacreClaro} /> : null}
                </g>
              );
            })}
            {/* mesa */}
            <path d="M 120 1150 L 960 1150 L 1000 1330 L 80 1330 Z" fill="#E8DCC4" stroke="#8C7A55" strokeWidth={5} />
            <path d="M 80 1330 L 1000 1330 L 980 1420 C 860 1380 760 1440 640 1400 C 520 1370 420 1440 300 1400 C 220 1380 150 1420 100 1420 Z" fill="#D2C3A0" />
            {/* ave asada */}
            <ellipse cx={540} cy={1160} rx={220} ry={50} fill="#8794A8" stroke="#4A5568" strokeWidth={5} />
            <path d="M 400 1150 C 400 1040 680 1040 680 1150 C 640 1176 440 1176 400 1150 Z" fill="#A9682C" stroke="#6E3F16" strokeWidth={5} />
            <path d="M 660 1110 C 720 1080 760 1060 780 1040 M 420 1110 C 360 1080 320 1060 300 1040" stroke="#A9682C" strokeWidth={24} strokeLinecap="round" />
            <circle cx={784} cy={1036} r={15} fill="#F1E9D6" />
            <circle cx={296} cy={1036} r={15} fill="#F1E9D6" />
            {/* pastel y jarra */}
            <path d="M 760 1230 C 760 1180 900 1180 900 1230 L 900 1262 L 760 1262 Z" fill="#C98A3C" stroke="#6E3F16" strokeWidth={5} />
            <path d="M 180 1262 L 190 1170 L 270 1170 L 280 1262 Z M 280 1190 C 320 1190 320 1240 278 1240" fill="#8794A8" stroke="#4A5568" strokeWidth={5} />
            {/* velas */}
            {[330, 540, 750].map((x, k) => (
              <g key={x}>
                <rect x={x - 13} y={k === 1 ? 880 : 960} width={26} height={k === 1 ? 200 : 180} fill="#F1E9D6" stroke="#B9AE98" strokeWidth={3} />
                <rect x={x - 30} y={k === 1 ? 1070 : 1132} width={60} height={16} rx={6} fill={H.dorado} />
              </g>
            ))}
          </svg>
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            {[330, 540, 750].map((x, k) => {
              const y = k === 1 ? 876 : 956;
              const v = vela(k);
              return (
                <g key={x}>
                  {v > 0.02 ? (
                    <g transform={`translate(${x} ${y}) scale(${v}) rotate(${Math.sin(f / 4 + k) * 5})`}>
                      <circle cy={-30} r={70} fill="#FFD27A" opacity={0.25} />
                      <path d="M 0 0 C -20 -30 14 -52 0 -92 C 30 -62 24 -24 0 0 Z" fill="#FFE2A0" />
                      <path d="M 0 -6 C -8 -22 6 -32 0 -52 C 12 -36 10 -18 0 -6 Z" fill="#FFFFFF" />
                    </g>
                  ) : (
                    <path d={`M ${x} ${y} c -16 -40 20 -70 ${Math.sin(f / 9 + k) * 12} -130`} fill="none" stroke="#9AA3B0" strokeWidth={5} strokeLinecap="round" opacity={0.6 * (1 - rampa(f, tNav + k * 14 + 8, tNav + k * 14 + 50))} />
                  )}
                </g>
              );
            })}
          </svg>
        </Vineta>
        <Hilo pts={hilo} p={cl((camX + 520) / 7000)} grosor={6} ondula={5} />
      </Camara>
      <Placa texto="CÓDIGO MORAL PURITANO" aparece={useMomento("código", 0.12)} hasta={tInc - 6} y={215} tam={38} />
      <Textura />
      <Sfx archivo="pagina" en={2} volumen={0.4} />
      <Sfx archivo="tela" en={tTeatros + 12} volumen={0.6} />
      <Sfx archivo="cadena" en={tTeatros + 34} volumen={0.4} />
      <Sfx archivo="puerta" en={tCab + 26} volumen={0.5} />
      <Sfx archivo="pluma" en={tJuego + 12} volumen={0.5} />
      <Sfx archivo="puerta" en={tDom} volumen={0.55} />
      <Sfx archivo="apagar" en={tNav} volumen={0.5} />
      <Sfx archivo="apagar" en={tNav + 14} volumen={0.5} />
      <Sfx archivo="apagar" en={tNav + 28} volumen={0.5} />
      {[tTeatros - 12, tCab - 14, tJuego - 14, tTab - 14, tInc - 4].map((t, i) => (
        <Sfx key={i} archivo="hilo" en={t} volumen={0.22} />
      ))}
    </AbsoluteFill>
  );
};

// ============ 8. Irlanda y Escocia ============
const MX = 110;
const MY = 400;
const ME = 0.86;
const enMapa = (lon: number, lat: number): Pt => [MX + geo(lon, lat)[0] * ME, MY + geo(lon, lat)[1] * ME];

const Murallas: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const tPers = useMomento("persiste", 0.9);
  const frio = rampa(f, tPers - 6, tPers + 40);
  const torre = (x: number, w: number, h: number, c: string) => (
    <g key={`${x}-${w}`}>
      <rect x={x} y={1240 - h} width={w} height={h + 400} fill={c} />
      {Array.from({ length: Math.floor(w / 36) }, (_, i) => (i % 2 === 0 ? <rect key={i} x={x + i * 36} y={1240 - h - 30} width={36} height={32} fill={c} /> : null))}
      <path d={`M ${x + w / 2 - 8} ${1240 - h + 70} l 16 0 l 0 60 l -16 0 Z`} fill="#050608" />
    </g>
  );
  return (
    <Camara tomas={[{ f: desde, x: 540, y: 1040, z: 1.12 }, { f: duracion, x: 560, y: 900, z: 1.0 }]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#0D1B2A 0%,#5A2420 38%,#C8612E 62%,#E89A4A 70%,#2A1410 100%)" }} />
      <Capa k={0.25}>
        <div style={{ position: "absolute", left: -200, top: 620, width: 1500, height: 900, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,140,70,0.6) 0%, rgba(200,70,40,0.2) 45%, rgba(200,70,40,0) 70%)", opacity: 0.75 + 0.2 * Math.sin(f / 6) * Math.sin(f / 11) }} />
        <Humo x={-200} y={1000} ancho={1500} alto={1000} n={12} color="#2A1A18" fuerza={0.6} semilla={2} vel={1.1} r={200} />
      </Capa>
      <Capa k={0.5}>
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d="M 640 1300 L 640 900 L 690 760 L 740 900 L 740 1300 Z M 600 1300 L 600 1000 L 780 1000 L 780 1300 Z" fill="#24191A" />
          {[100, 260, 420, 860, 980].map((x, i) => (
            <path key={x} d={`M ${x} 1300 L ${x} ${1080 + (i % 2) * 40} L ${x + 60} ${1020 + (i % 2) * 40} L ${x + 120} ${1080 + (i % 2) * 40} L ${x + 120} 1300 Z`} fill="#24191A" />
          ))}
        </svg>
        <Humo x={200} y={1100} ancho={700} alto={800} n={8} color="#4A332C" fuerza={0.55} semilla={5} vel={1.5} r={150} />
      </Capa>
      <Capa k={0.8}>
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <rect x={-400} y={1090} width={1900} height={600} fill="#15100F" />
          <path d="M -400 1092 L 1500 1092" stroke="#E89A4A" strokeWidth={4} opacity={0.55} />
          {[330, 600, -120, 980].map((x) => (
            <path key={`r${x}`} d={`M ${x + 3} 1500 L ${x + 3} ${x === 330 || x === 600 ? 824 : x < 0 ? 944 : 924}`} stroke="#E89A4A" strokeWidth={5} opacity={0.5} />
          ))}
          {Array.from({ length: 34 }, (_, i) => (i % 2 === 0 ? <rect key={i} x={-400 + i * 56} y={1060} width={56} height={34} fill="#15100F" /> : null))}
          {/* puerta de dos torres redondas (barbacana medieval) */}
          {torre(330, 150, 420, "#120D0C")}
          {torre(600, 150, 420, "#120D0C")}
          <rect x={480} y={900} width={120} height={500} fill="#120D0C" />
          <path d="M 490 1300 L 490 1120 C 490 1060 590 1060 590 1120 L 590 1300 Z" fill="#050608" />
          {torre(-120, 180, 300, "#120D0C")}
          {torre(980, 180, 320, "#120D0C")}
          {/* brecha en el muro */}
          <path d="M 800 1060 L 830 1130 L 880 1150 L 900 1210 L 960 1180 L 980 1060 Z" fill="#3A1A1C" />
        </svg>
      </Capa>
      <Capa k={1.0}>
        <Humo x={760} y={1250} ancho={300} alto={900} n={8} color="#2A2222" fuerza={0.7} semilla={8} vel={2} r={120} />
        <Humo x={0} y={1250} ancho={300} alto={800} n={6} color="#2A2222" fuerza={0.6} semilla={11} vel={1.6} r={110} />
      </Capa>
      <Capa k={1.35}>
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: "blur(3px)" }}>
          <path d="M -400 1560 C -100 1480 200 1540 500 1500 C 800 1470 1100 1530 1500 1480 L 1500 2100 L -400 2100 Z" fill="#070506" />
        </svg>
      </Capa>
      <Ceniza n={46} sube={1.8} semilla={3} o={0.9 * (1 - frio * 0.7)} />
      <AbsoluteFill style={{ background: "#3E5A7A", mixBlendMode: "color", opacity: frio * 0.6 }} />
      <Hilo pts={[[-80, 700], [260, 640], [560, 720], [840, 620], [1180, 680]]} p={rampa(f, tPers, tPers + 40)} ondula={5} grosor={6} />
    </Camara>
  );
};

const Irlanda: React.FC<P> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const tEsc = useMomento("Escocia", 0.3);
  const tIrl = useMomento("Irlanda", 0.34);
  const tDest = useMomento("destacando", 0.4);
  const tDro = useMomento("Dróeda", 0.48);
  const tWex = useMomento("Wexford", 0.52);
  const tMil = useMomento("en mil", 0.57);
  const tGen = useMomento("generando", 0.7);
  const escocia: Pt[] = [geo(-0.12, 51.5), geo(-1.1, 53.96), geo(-1.6, 54.97), geo(-2.0, 55.77), geo(-2.52, 56.0), geo(-3.19, 55.95)];
  const irlanda1: Pt[] = [geo(-1.6, 51.6), geo(-3.4, 51.5), geo(-5.05, 51.71), geo(-5.6, 52.5), geo(-6.2, 53.35), geo(-6.35, 53.72)];
  const irlanda2: Pt[] = [geo(-6.35, 53.72), geo(-6.2, 53.35), geo(-6.1, 52.98), geo(-6.15, 52.8), geo(-6.46, 52.34)];
  const c0 = enMapa(-2.6, 53.3);
  const cE = enMapa(-2.8, 56.2);
  const cI = enMapa(-6.6, 53.0);
  return (
    <AbsoluteFill style={{ background: "#03060B" }}>
      <Sub desde={0} hasta={tGen + 12}>
        <Camara tomas={[{ f: 0, x: c0[0] + 40, y: c0[1] + 120, z: 1.0 }, { f: tEsc - 24, x: c0[0] + 40, y: c0[1] + 60, z: 1.08 }, { f: tEsc + 6, x: cE[0], y: cE[1], z: 1.7 }, { f: tIrl + 4, x: cE[0], y: cE[1], z: 1.7 }, { f: tDest - 4, x: cI[0], y: cI[1], z: 1.85 }, { f: tGen + 10, x: cI[0] - 10, y: cI[1] + 10, z: 2.0 }]}>
          <FondoPergamino x={-500} y={-400} w={2080} h={2700} />
          <div style={{ position: "absolute", left: MX, top: MY, transform: `scale(${ME})`, transformOrigin: "0 0" }}>
            <MapaIslas rotulos={0.7}>
              <Lugar lon={-0.12} lat={51.5} nombre="Londres" aparece={4} />
              <HiloG pts={escocia} p={rampa(f, tEsc - 34, tEsc + 14)} grosor={4.5} ondula={0} />
              <Lugar lon={-2.52} lat={56.0} nombre="Dunbar, 1650" aparece={tEsc + 8} tam={20} pulso />
              <Lugar lon={-3.19} lat={55.95} nombre="Edimburgo" aparece={tEsc + 14} tam={20} lado="izq" />
              <HiloG pts={irlanda1} p={rampa(f, tIrl - 6, tDro)} grosor={4} ondula={0} />
              <HiloG pts={irlanda2} p={rampa(f, tDro + 8, tWex + 4)} grosor={4} ondula={0} />
              <Lugar lon={-6.2} lat={53.35} nombre="Dublín" aparece={tDest - 10} tam={19} />
              <Lugar lon={-6.35} lat={53.72} nombre="Drogheda" aparece={tDro} tam={22} rojo lado="izq" />
              <Lugar lon={-6.46} lat={52.34} nombre="Wexford" aparece={tWex} tam={22} rojo lado="izq" />
              <text x={geo(-8.1, 53.3)[0]} y={geo(-8.1, 53.3)[1]} textAnchor="middle" fontFamily={FUENTE_SERIFA} fontWeight={700} fontSize={30} fill="#4A3B26" letterSpacing={8} opacity={0.55}>
                IRLANDA
              </text>
              <text x={geo(-4.1, 56.75)[0]} y={geo(-4.1, 56.75)[1]} textAnchor="middle" fontFamily={FUENTE_SERIFA} fontWeight={700} fontSize={26} fill="#4A3B26" letterSpacing={6} opacity={0.55}>
                ESCOCIA
              </text>
            </MapaIslas>
          </div>
        </Camara>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 50%, rgba(43,33,24,0.55) 100%)" }} />
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, rgba(139,30,36,0.35) 0%, rgba(139,30,36,0) 60%)`, opacity: (f >= tDro ? Math.max(0, 1 - (f - tDro) / 16) : 0) + (f >= tWex ? Math.max(0, 1 - (f - tWex) / 16) : 0) }} />
        <Placa texto="1649" aparece={tMil} hasta={tGen} y={215} tam={54} />
      </Sub>
      <Sub desde={tGen} hasta={duracion + 1} fundido={14} salida={0}>
        <Murallas desde={tGen} />
        <Grabado fuerza={0.45} />
        <Placa texto="IRLANDA · 1649" aparece={tGen + 14} y={215} />
      </Sub>
      <Textura />
      <Sfx archivo="pagina" en={0} volumen={0.4} />
      <Sfx archivo="hilo" en={tEsc - 34} volumen={0.3} />
      <Sfx archivo="hilo" en={tIrl - 6} volumen={0.3} />
      <Sfx archivo="golpe" en={tDro} volumen={0.45} />
      <Sfx archivo="golpe" en={tWex} volumen={0.45} />
      <Sfx archivo="fuego" en={tGen} volumen={0.4} />
      <Sfx archivo="viento" en={tGen + 20} volumen={0.3} />
    </AbsoluteFill>
  );
};

// ============ 9. Muerte de Cromwell y Restauración ============
const Restauracion: React.FC<P> = () => {
  const f = useCurrentFrame();
  const { duracion } = useEscena();
  const tMurio = useMomento("murió", 0.03);
  const tHijo = useMomento("su hijo", 0.18);
  const tApoyo = useMomento("apoyo", 0.32);
  const tRen = useMomento("renunciando", 0.37);
  const tCans = useMomento("Cansada", 0.46);
  const tRest = useMomento("restauró", 0.63);
  const tMayo = useMomento("mayo", 0.69);
  const tCor = useMomento("coronando", 0.78);
  const tHijo2 = useMomento("hijo del", 0.86);
  const tTras = useMomento("tras", 0.93);
  const giro = rampa(f, tCans, tRest - 4);
  const ang = giro * 180;
  const rompe = f - tMurio - 34;
  const cae = rampa(f, tRen + 6, tRen + 30, Easing.bounce);
  const atras = rampa(f, tRen + 10, tRen + 50);
  const corona = rampa(f, tCor, tCor + 30, Easing.out(Easing.back(1.4)));
  return (
    <AbsoluteFill style={{ background: "#03060B", overflow: "hidden" }}>
      {/* A + B: el mundo gris del Protectorado */}
      {giro < 1 ? (
        <AbsoluteFill style={{ transform: `rotate(${ang}deg) scale(${1 + Math.sin(Math.PI * giro) * 0.5})`, opacity: 1 - rampa(giro, 0.35, 0.6) }}>
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #232C39 0%, ${H.noche} 60%, #050A12 100%)` }} />
          <Sub desde={0} hasta={tHijo + 6}>
            <div style={{ position: "absolute", left: 190, top: 660, opacity: 1 - rampa(f, tMurio, tMurio + 70) * 0.85, filter: `saturate(${1 - rampa(f, tMurio, tMurio + 40)})` }}>
              <Busto tipo="cromwell" w={700} sombra={0.6} silueta={0.05 + rampa(f, tMurio, tMurio + 60) * 0.5} respira={f < tMurio} />
            </div>
            <TextoHilado texto="1658" p={rampa(f, tMurio + 6, tMurio + 40, Easing.linear)} y={250} tam={230} color={H.hierroClaro} />
            <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
              {/* el hilo se debilita y se fragmenta */}
              {Array.from({ length: 11 }, (_, i) => {
                const t = Math.max(0, rompe - i * 3);
                const x = 60 + i * 88;
                return (
                  <g key={i} transform={`translate(0 ${t * t * 0.35}) rotate(${t * (i % 2 ? 1.4 : -1.4)} ${x + 40} 600)`} opacity={(1 - cl(t / 44)) * rampa(f, 4, 22)}>
                    <HiloG pts={[[x, 600 + Math.sin(i) * 8], [x + 40, 596 + Math.cos(i) * 8], [x + 82, 600 + Math.sin(i + 1) * 8]]} p={1} grosor={6 - cl(rompe / 20) * 2.5} chispa={false} ondula={1} />
                  </g>
                );
              })}
            </svg>
          </Sub>
          <Sub desde={tHijo} hasta={duracion}>
            <Capa k={1}>
              <div style={{ opacity: 1 - rampa(f, tApoyo, tApoyo + 40) }}>
                <Tropa x={-60 + rampa(f, tApoyo, tApoyo + 60, ENTRA) * 900} y={1330} ancho={1200} n={7} alto={420} silueta={0.82} semilla={4} />
              </div>
            </Capa>
            <div style={{ position: "absolute", left: 290, top: 400, width: 500, height: 1100, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(135,148,168,0.3) 0%, rgba(135,148,168,0) 68%)" }} />
            <div style={{ position: "absolute", left: 375 + Math.sin(f / 13) * 7, top: 620 - atras * 40, transform: `rotate(${Math.sin(f / 17) * 1.6}deg) scale(${1 - atras * 0.1})`, transformOrigin: "165px 800px", opacity: 1 - atras * 0.55 }}>
              <Figura tipo="richard" alto={790} />
            </div>
            {/* bastón de mando que cae */}
            <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
              <g transform={`translate(${612 + Math.sin(f / 13) * 7 * (1 - cae) + cae * 60} ${1010 + cae * 400}) rotate(${-14 + cae * 100})`}>
                <rect x={-9} y={-150} width={18} height={300} rx={8} fill="#2B2118" />
                <rect x={-12} y={-156} width={24} height={44} rx={8} fill={H.dorado} />
                <rect x={-12} y={112} width={24} height={44} rx={8} fill={H.dorado} />
              </g>
            </svg>
            <Nombre texto="RICHARD CROMWELL" aparece={tHijo + 20} hasta={tCans - 4} y={300} />
          </Sub>
          <Ceniza n={24} color="#8794A8" color2="#4A5568" sube={-0.8} semilla={6} o={0.6} />
        </AbsoluteFill>
      ) : null}
      {/* D: vuelve el color */}
      {giro > 0.3 ? (
        <AbsoluteFill style={{ transform: `rotate(${ang - 180}deg) scale(${1 + Math.sin(Math.PI * giro) * 0.5})`, opacity: rampa(giro, 0.4, 0.7) }}>
          <Camara tomas={[{ f: tRest - 20, x: 540, y: 930, z: 1.1 }, { f: duracion, x: 540, y: 960, z: 1.0 }]}>
            <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #B8862E 0%, #6A2A1A 55%, #2A0D10 100%)" }} />
            <Capa k={0.4}>
              <RayosDeLuz x={540} y={-100} largo={2000} angulo={90} apertura={80} n={9} color="#F6DE8A" fuerza={0.6} />
            </Capa>
            <Capa k={0.7}>
              {/* retrato del padre, en sepia */}
              <div style={{ position: "absolute", left: 70, top: 430, opacity: rampa(f, tHijo2, tHijo2 + 16), filter: "sepia(0.9) brightness(0.8)" }}>
                <div style={{ width: 230, height: 300, borderRadius: "50%", overflow: "hidden", border: `8px solid ${H.bronce}`, background: "#3A2A1C", boxShadow: "0 12px 24px rgba(0,0,0,0.5)" }}>
                  <div style={{ marginLeft: -10, marginTop: 14 }}>
                    <Busto tipo="carlos1" w={250} sombra={0} respira={false} />
                  </div>
                </div>
                <div style={{ marginTop: 10, textAlign: "center", fontFamily: FUENTE_SERIFA, fontWeight: 700, fontSize: 26, color: H.pergamino, letterSpacing: 2, textShadow: "0 2px 8px #000" }}>CARLOS I</div>
              </div>
              <Hilo pts={[[300, 600], [400, 540], [470, 620]]} p={rampa(f, tHijo2 + 8, tHijo2 + 34)} grosor={5} />
            </Capa>
            <div style={{ position: "absolute", left: 170, top: 600, filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.55))" }}>
              <Busto tipo="carlos2" w={740} sombra={0.18} />
            </div>
            <div style={{ position: "absolute", left: 392, top: 250 + corona * 400, opacity: cl(corona * 3), filter: "drop-shadow(0 0 34px rgba(246,222,138,0.9))" }}>
              <Corona w={296} />
            </div>
            <Capa k={1.4}>
              <div style={{ position: "absolute", left: -360, top: -100, width: 440, height: 2200, background: "linear-gradient(90deg,#4A0E14 0%,#8B1E24 60%,rgba(139,30,36,0) 100%)", filter: "blur(8px)" }} />
              <div style={{ position: "absolute", left: 1000, top: -100, width: 440, height: 2200, background: "linear-gradient(270deg,#4A0E14 0%,#8B1E24 60%,rgba(139,30,36,0) 100%)", filter: "blur(8px)" }} />
            </Capa>
            <Ceniza n={50} color={H.doradoClaro} color2={H.dorado} sube={-1.6} semilla={9} o={rampa(f, tCor, tCor + 20)} tam={1.6} />
          </Camara>
          <Placa texto="MAYO DE 1660" aparece={tMayo} y={215} tam={50} />
          <Placa texto="CARLOS II" aparece={tCor + 20} hasta={tTras - 8} y={330} tam={40} />
          <Placa texto="TRAS 11 AÑOS DE REPÚBLICA" aparece={tTras} y={330} tam={34} />
        </AbsoluteFill>
      ) : null}
      {giro > 0 && giro < 1 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <HiloG pts={Array.from({ length: 60 }, (_, i) => [540 + Math.cos(i / 6 + giro * 5) * (60 + i * 11), 900 + Math.sin(i / 6 + giro * 5) * (60 + i * 11)] as Pt)} p={giro} cola={Math.max(0, giro - 0.45)} grosor={7} crudo ondula={0} />
        </svg>
      ) : null}
      <Textura />
      <Sfx archivo="apagar" en={tMurio} volumen={0.5} />
      <Sfx archivo="quiebre" en={tMurio + 34} volumen={0.3} />
      <Sfx archivo="madera" en={tRen + 22} volumen={0.6} />
      <Sfx archivo="whoosh" en={tCans + 6} volumen={0.5} />
      <Sfx archivo="hilo" en={tCans + 10} volumen={0.3} />
      <Sfx archivo="campana" en={tRest} volumen={0.4} />
      <Sfx archivo="brillo" en={tCor + 16} volumen={0.3} />
      <Sfx archivo="campana" en={tCor + 30} volumen={0.3} />
    </AbsoluteFill>
  );
};

// ============ 10. La ejecución póstuma (y cierre de marca) ============
// Abadía de Westminster hacia 1661: todavía SIN las torres del oeste (son del siglo XVIII).
const ABADIA: Pt[] = [[40, 1330], [40, 1150], [70, 1150], [70, 1040], [100, 1000], [130, 1040], [130, 1100], [200, 1100], [200, 1010], [215, 960], [230, 1010], [230, 1100], [330, 1100], [330, 1010], [345, 960], [360, 1010], [360, 1100], [460, 1100], [460, 1010], [475, 960], [490, 1010], [490, 1100], [540, 1100], [540, 960], [600, 880], [660, 960], [660, 1100], [720, 1100], [720, 1020], [735, 970], [750, 1020], [750, 1120], [840, 1120], [840, 1060], [856, 1010], [872, 1060], [872, 1140], [960, 1140], [960, 1090], [978, 1050], [996, 1090], [996, 1180], [1040, 1180], [1040, 1330]];
const HORCA: Pt[] = [[1300, 1340], [1300, 760], [1620, 700], [1620, 1340], [1620, 700], [1900, 780], [1900, 1340], [1900, 780], [1300, 760]];

const Postuma: React.FC<P> = () => {
  const f = useCurrentFrame();
  const { palabras } = useEscena();
  const finVoz = palabras.length ? palabras[palabras.length - 1].hasta : 450;
  const tCierre = finVoz + 12;
  const tDes = useMomento("desenterrar", 0.2);
  const tEjec = useMomento("ejecución", 0.33);
  const tAhor = useMomento("ahorcándolo", 0.42);
  const tClavar = useMomento("clavar", 0.52);
  const tDur = useMomento("durante", 0.64);
  const pAb = rampa(f, tDes - 4, tDes + 50);
  const pHo = rampa(f, tEjec, tAhor + 10);
  const anio = Math.round(interpolate(f, [tDur, tCierre - 4], [1661, 1684], CLAMP));
  const luna: Pt[] = Array.from({ length: 49 }, (_, i) => [2700 + Math.cos((i / 48) * Math.PI * 2 - Math.PI / 2) * 250, 560 + Math.sin((i / 48) * Math.PI * 2 - Math.PI / 2) * 250] as Pt);
  const nube = (x: number, y: number, s: number, v: number, o: number) => (
    <g transform={`translate(${((x + f * v) % 4600) - 500} ${y}) scale(${s})`} opacity={o}>
      <path d="M 0 60 C -20 20 40 0 70 20 C 90 -30 190 -30 210 20 C 260 0 320 30 300 60 Z" fill="#16283D" />
    </g>
  );
  return (
    <AbsoluteFill style={{ background: H.noche }}>
      <Camara tomas={[{ f: 0, x: 540, y: 980, z: 1.08 }, { f: tEjec - 26, x: 540, y: 960, z: 1.0 }, { f: tEjec, x: 1620, y: 960, z: 1.0 }, { f: tClavar - 20, x: 1620, y: 940, z: 1.05 }, { f: tClavar + 10, x: 2700, y: 860, z: 1.0 }, { f: tCierre + 10, x: 2700, y: 800, z: 1.12 }]}>
        <Capa k={0.15}>
          <div style={{ position: "absolute", left: -600, top: -400, width: 4600, height: 2800, background: "linear-gradient(180deg,#060D16 0%,#0D1B2A 45%,#1B3350 80%,#0D1B2A 100%)" }} />
          <svg width={10} height={10} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {Array.from({ length: 90 }, (_, i) => (
              <circle key={i} cx={-500 + azar(i * 3) * 2600} cy={azar(i * 7) * 1000} r={1.5 + azar(i) * 2.2} fill="#DCE6F2" opacity={0.3 + 0.5 * Math.abs(Math.sin(f / 20 + i))} />
            ))}
          </svg>
        </Capa>
        {/* luna llena y nubes */}
        <div style={{ position: "absolute", left: 2700 - 520, top: 560 - 520, width: 1040, height: 1040, borderRadius: "50%", background: "radial-gradient(circle, rgba(220,230,242,0.34) 0%, rgba(220,230,242,0.08) 42%, rgba(220,230,242,0) 68%)" }} />
        <svg width={10} height={10} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <circle cx={2700} cy={560} r={210} fill="#E9EEF2" />
          <circle cx={2630} cy={500} r={38} fill="#C9D3DC" opacity={0.7} />
          <circle cx={2770} cy={610} r={54} fill="#C9D3DC" opacity={0.6} />
          <circle cx={2700} cy={680} r={24} fill="#C9D3DC" opacity={0.6} />
          {nube(300, 380, 2.2, 1.2, 0.9)}
          {nube(1500, 520, 1.7, 1.8, 0.8)}
          {nube(2500, 300, 2.6, 1.5 + rampa(f, tDur, tDur + 20) * 7, 0.85)}
          {nube(3300, 640, 2.0, 2.2 + rampa(f, tDur, tDur + 20) * 9, 0.9)}
          {nube(4100, 460, 1.5, 1.4 + rampa(f, tDur, tDur + 20) * 8, 0.8)}
        </svg>
        {/* 1) la Abadía: el hilo traza su silueta */}
        <svg width={10} height={10} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d={ABADIA.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ") + " Z"} fill="#060B13" opacity={rampa(f, tDes + 30, tDes + 60)} />
          {[150, 280, 410, 560, 620, 790].map((x) => (
            <path key={x} d={`M ${x} 1280 L ${x} 1180 C ${x} 1150 ${x + 30} 1150 ${x + 30} 1180 L ${x + 30} 1280 Z`} fill="#1B3350" opacity={rampa(f, tDes + 40, tDes + 70) * 0.8} />
          ))}
          <HiloG pts={ABADIA} p={pAb} crudo ondula={0} grosor={5} o={1 - rampa(f, tDes + 70, tDes + 110) * 0.6} />
          {/* cementerio: cruces y lápidas */}
          {[90, 250, 420, 700, 900, 1010].map((x, i) => (
            <path key={x} d={i % 2 ? `M ${x} 1440 L ${x} 1370 C ${x} 1340 ${x + 50} 1340 ${x + 50} 1370 L ${x + 50} 1440 Z` : `M ${x + 18} 1440 L ${x + 18} 1380 L ${x} 1380 L ${x} 1364 L ${x + 18} 1364 L ${x + 18} 1340 L ${x + 34} 1340 L ${x + 34} 1364 L ${x + 52} 1364 L ${x + 52} 1380 L ${x + 34} 1380 L ${x + 34} 1440 Z`} fill="#04070C" />
          ))}
          <rect x={-600} y={1330} width={4600} height={900} fill="#04070C" />
          {/* tumba abierta: pala y montículo */}
          <g opacity={rampa(f, tDes, tDes + 14)}>
            <path d="M 470 1330 C 500 1280 600 1280 640 1330 Z" fill="#0A111B" />
            <path d="M 680 1330 L 720 1180" stroke="#3A2A1C" strokeWidth={9} strokeLinecap="round" />
            <path d="M 706 1182 L 734 1182 L 738 1140 L 716 1128 L 700 1140 Z" fill="#59606C" />
          </g>
          {/* 2) Tyburn: el hilo traza la horca triangular; soga vacía */}
          <path d={HORCA.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ")} fill="none" stroke="#04070C" strokeWidth={30} strokeLinejoin="round" opacity={rampa(f, tAhor, tAhor + 24)} />
          <HiloG pts={HORCA} p={pHo} crudo ondula={0} grosor={5} o={1 - rampa(f, tAhor + 30, tAhor + 60) * 0.55} />
          <g transform={`rotate(${Math.sin(f / 14) * 5} 1460 730)`} opacity={rampa(f, tAhor + 4, tAhor + 16)}>
            <path d="M 1460 730 L 1460 930" stroke="#8C7A55" strokeWidth={7} />
            <ellipse cx={1460} cy={962} rx={22} ry={32} fill="none" stroke="#8C7A55" strokeWidth={7} />
          </g>
          {/* 3) Westminster Hall: hastial y la pica contra la luna */}
          <path d="M 2160 2000 L 2160 1220 L 2230 1220 L 2230 1130 L 2262 1070 L 2294 1130 L 2294 1200 L 2700 930 L 3106 1200 L 3106 1130 L 3138 1070 L 3170 1130 L 3170 1220 L 3240 1220 L 3240 2000 Z" fill="#04070C" />
          <path d="M 2560 1500 L 2560 1260 C 2560 1160 2700 1100 2700 1100 C 2700 1100 2840 1160 2840 1260 L 2840 1500 Z" fill="#12233A" />
          <path d="M 2630 1500 L 2630 1150 M 2700 1500 L 2700 1100 M 2770 1500 L 2770 1150 M 2560 1300 L 2840 1300" stroke="#04070C" strokeWidth={10} />
          <g opacity={rampa(f, tClavar + 4, tClavar + 20)}>
            <path d="M 2700 940 L 2700 470" stroke="#04070C" strokeWidth={11} strokeLinecap="round" />
            <ellipse cx={2700} cy={446} rx={24} ry={30} fill="#04070C" />
          </g>
          <HiloG pts={luna} p={rampa(f, tDur, tCierre - 6, Easing.linear)} crudo ondula={0} grosor={5} />
        </svg>
        <Capa k={1.3}>
          <div style={{ opacity: rampa(f, tEjec - 10, tEjec + 10) * (1 - rampa(f, tClavar - 10, tClavar + 10)) }}>
            <Gentio y={1560} n={8} escala={1.25} semilla={5} color="#03060B" x={1000} ancho={1300} />
          </div>
        </Capa>
        <Humo x={-400} y={1500} ancho={4200} alto={260} n={18} color="#22364D" fuerza={0.5} semilla={7} vel={0.6} r={170} />
      </Camara>
      <Grabado fuerza={0.7} color="#02050A" />
      <Placa texto="1661" aparece={8} hasta={tEjec - 30} y={215} tam={54} />
      <Placa texto="ABADÍA DE WESTMINSTER" aparece={tDes + 30} hasta={tEjec - 30} y={330} tam={32} />
      <Placa texto="TYBURN · 30 DE ENERO DE 1661" aparece={tEjec + 6} hasta={tClavar - 22} y={215} tam={36} />
      <Placa texto="WESTMINSTER HALL" aparece={tClavar + 16} hasta={tDur - 4} y={215} tam={38} />
      {f >= tDur && f < tCierre + 6 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily: FUENTE_TITULO, fontWeight: 900, fontSize: 110, color: H.dorado, letterSpacing: 4, textShadow: "0 0 30px rgba(246,222,138,0.5), 0 6px 16px rgba(0,0,0,0.8)", opacity: rampa(f, tDur, tDur + 8) }}>{anio}</div>
      ) : null}
      <Textura />
      <CierreCanal desde={tCierre} />
      <Sfx archivo="viento" en={0} volumen={0.4} />
      <Sfx archivo="hilo" en={tDes - 4} volumen={0.3} />
      <Sfx archivo="marca" en={tDes + 6} volumen={0.3} />
      <Sfx archivo="whoosh" en={tEjec - 26} volumen={0.3} />
      <Sfx archivo="hilo" en={tEjec} volumen={0.3} />
      <Sfx archivo="redoble" en={tAhor - 6} volumen={0.3} />
      <Sfx archivo="viento" en={tClavar - 10} volumen={0.45} />
      <Sfx archivo="golpe" en={tClavar + 4} volumen={0.35} />
      <Sfx archivo="hilo" en={tCierre} volumen={0.35} />
      <Sfx archivo="brillo" en={tCierre + 50} volumen={0.3} />
    </AbsoluteFill>
  );
};

export const ESCENAS_CROMWELL_2: Record<string, React.FC<P>> = {
  "cromwell/golpe": Golpe,
  "cromwell/codigo": Codigo,
  "cromwell/irlanda": Irlanda,
  "cromwell/restauracion": Restauracion,
  "cromwell/postuma": Postuma,
};
