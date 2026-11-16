// Personajes del video "Jesús entre los 12 y los 30", dibujados por capas (originales del canal).
// Coordenadas del lienzo: x = 0 en el centro del cuerpo, y = 0 arriba de la cabeza.
// Cabeza centrada en (0, 150); hombros en (±118, 345); cintura y ≈ 600; pies y ≈ 1030 (parado).
// Jesús usa `edad` (0 = doce años, 1 = adulto) para que la transformación conserve la misma cara.
import React from "react";
import { useCurrentFrame } from "remotion";

export type Quien =
  | "jesus"
  | "maria"
  | "jose"
  | "maestro"
  | "maestro2"
  | "vecino"
  | "vecina"
  | "obrero"
  | "obrero2"
  | "oyente1"
  | "oyente2"
  | "oyente3"
  | "fiel" // persona de hoy (ropa actual): reza, comulga
  | "sacerdote" // alba blanca y casulla verde
  | "fiel2" // hombre, ropa actual (comunidad)
  | "fiel3" // mujer mayor, ropa actual (comunidad)
  | "centurion" // oficial romano: casco con cresta transversal, coraza, capa
  | "juan" // Juan el Bautista: vestido de pelo de camello
  | "criado" // criado del centurión (enfermo)
  | "abuela" // abuela de hoy: rodete, anteojos, saco tejido
  | "pio5" // papa Pío V: sotana blanca, solideo, muceta roja, barba blanca
  | "leon13" // papa León XIII: sotana blanca, solideo, muceta roja
  | "jp2" // papa Juan Pablo II (1981): sotana y esclavina blancas, solideo, pelo canoso, sin barba
  | "fatima" // imagen de la Virgen de Fátima: manto blanco con borde dorado, manos juntas
  | "medico" // médico/enfermero de hoy: ambo celeste
  | "ezequias" // rey Ezequías: manto real azul, diadema dorada sobre el tocado
  | "isaias" // profeta Isaías: manto y tocado claros, barba canosa
  | "asirio" // soldado asirio: casco cónico, barba oscura larga, túnica roja con faja
  | "asirio2" // segundo soldado asirio (otros tonos)
  | "sembrador" // dueño del campo (parábola): túnica clara, manto marrón, tocado
  | "enemigo" // el enemigo de la parábola: silueta oscura encapuchada (sin rasgos marcados)
  | "prodigo" // hijo pródigo al volver: túnica gastada y remendada
  | "prodigo2" // hijo pródigo ya vestido por su padre (manto bueno)
  | "francisco" // papa Francisco: sotana blanca, solideo
  | "francisco2" // papa Francisco con impermeable amarillo (lluvia)
  | "jesus2" // Jesús en gloria: túnica blanca y manto dorado
  | "pedro" // Pedro, pescador de unos 60: túnica ocre y manto pardo
  | "pedro2" // Pedro anciano en Roma: pelo y barba canos
  | "betania" // María de Betania (Lucas 10:39): velo terracota
  | "fiel4" // mujer joven, ropa actual (lectora)
  | "fiel5" // hombre mayor con anteojos, ropa actual
  | "fiel6" // joven, ropa actual
  | "padre"; // padre del hijo pródigo: anciano, manto bordó

// hombro: 0 = cuelga; positivo = se abre hacia AFUERA y arriba (90 = horizontal, 180 = arriba).
// codo: positivo = el antebrazo sigue girando en el mismo sentido (hacia arriba/afuera);
//       negativo = se dobla hacia el cuerpo (mano al pecho, a la cara o al regazo).
export type Brazo = { hombro: number; codo: number; mano?: "abierta" | "puno" | "senala" };

export type PropsPersona = {
  quien: Quien;
  ancho: number; // ancho en pantalla del lienzo (600 unidades)
  edad?: number; // solo Jesús: 0 (12 años) → 1 (adulto)
  cabeza?: number; // inclinación (grados)
  giro?: number; // -1..1 desplaza los rasgos (sugiere mirar a un lado)
  mirada?: [number, number];
  cejas?: { y?: number; rot?: number }; // y negativo = cejas arriba (sorpresa); rot > 0 = preocupación
  boca?: { apertura?: number; curva?: number };
  brazoIzq?: Brazo; // brazo izquierdo DEL DIBUJO (a la izquierda de la pantalla)
  brazoDer?: Brazo;
  caminando?: number; // 0..1
  paso?: number; // fase de caminata (ciclos)
  sentado?: boolean;
  corta?: boolean; // túnica corta (obreros)
  semilla?: number; // desfasa parpadeo y respiración
  espejo?: boolean;
  sinBrazos?: boolean; // los brazos se dibujan aparte (manos que trabajan)
  ojos?: number; // 1 abiertos, 0 cerrados (rezar); se combina con el parpadeo
  cejaUna?: number; // levanta SOLO la ceja derecha de la pantalla (unidades, positivo = arriba)
  bocaAuto?: number; // apertura extra de boca (personaje que habla)
};

type Paleta = {
  piel: string;
  pielSombra: string;
  pelo: string;
  tunica: string;
  tunicaSombra: string;
  manto?: string;
  mantoSombra?: string;
  faja?: string;
  velo?: string;
  turbante?: string;
  barba?: "corta" | "larga" | "canosa" | "ninguna";
  canas?: number;
  pantalon?: string; // ropa actual: suéter corto + pantalón
  peloLargo?: boolean;
  casulla?: string; // sacerdote: casulla encima del alba
  casco?: string; // centurión
  coraza?: string;
  capa?: string;
  pelaje?: boolean; // vestido de pelo de camello (borde desflecado)
  rebelde?: boolean; // pelo despeinado
  rodete?: boolean;
  anteojos?: boolean;
  muceta?: string; // capita sobre los hombros (papas)
  solideo?: string;
  yelmo?: string; // casco cónico (asirios)
  diadema?: string; // aro real dorado sobre el tocado (reyes)
};

const PALETAS: Record<Quien, Paleta> = {
  jesus: { piel: "#C58F67", pielSombra: "#A7714D", pelo: "#3A2418", tunica: "#E7DBC2", tunicaSombra: "#C9B897", manto: "#9C4E33", mantoSombra: "#7C3B25", faja: "#5B6E8C", barba: "corta" },
  maria: { piel: "#C99470", pielSombra: "#A97553", pelo: "#2E1C14", tunica: "#D8C7A6", tunicaSombra: "#B9A47E", velo: "#4D6A8E", faja: "#8A6B47", barba: "ninguna" },
  jose: { piel: "#B98260", pielSombra: "#986343", pelo: "#3C2A1E", tunica: "#CBB892", tunicaSombra: "#AA956C", manto: "#6E5235", mantoSombra: "#56402A", faja: "#3F4F6A", turbante: "#D9CBAE", barba: "canosa", canas: 0.35 },
  maestro: { piel: "#C08A63", pielSombra: "#9E6B48", pelo: "#BDB4A6", tunica: "#EFE6D2", tunicaSombra: "#D2C5A8", manto: "#F3EEE2", mantoSombra: "#D9CFB9", faja: "#2E4D7A", turbante: "#F3EEE2", barba: "larga", canas: 1 },
  maestro2: { piel: "#B07B57", pielSombra: "#8F5E3E", pelo: "#5B4A3C", tunica: "#E4D6B8", tunicaSombra: "#C6B48F", manto: "#2F4A72", mantoSombra: "#243A5B", faja: "#C9A24A", turbante: "#E9E1CF", barba: "larga", canas: 0.4 },
  vecino: { piel: "#B47E5A", pielSombra: "#93603F", pelo: "#2C1E16", tunica: "#B9A27A", tunicaSombra: "#98825B", manto: "#56704A", mantoSombra: "#43593A", faja: "#7A4A2E", turbante: "#CDBB98", barba: "corta" },
  vecina: { piel: "#C48D68", pielSombra: "#A26E4B", pelo: "#3A2418", tunica: "#CDB58C", tunicaSombra: "#AD966C", velo: "#B5763C", faja: "#5E4A7A", barba: "ninguna" },
  obrero: { piel: "#AD7651", pielSombra: "#8B5A39", pelo: "#24170F", tunica: "#C2A57A", tunicaSombra: "#A0865D", faja: "#6A4A30", turbante: "#D7C7A6", barba: "corta" },
  obrero2: { piel: "#9C6847", pielSombra: "#7D4F33", pelo: "#1E140E", tunica: "#A98E68", tunicaSombra: "#8A714E", faja: "#4D5E7A", barba: "corta" },
  oyente1: { piel: "#BE8762", pielSombra: "#9C6845", pelo: "#2A1B13", tunica: "#C9B48D", tunicaSombra: "#A99268", velo: "#7A5A8A", faja: "#6A4A30", barba: "ninguna" },
  oyente2: { piel: "#A97352", pielSombra: "#875638", pelo: "#3B2A1E", tunica: "#B49A72", tunicaSombra: "#937B55", manto: "#8A5A3A", mantoSombra: "#6E4529", faja: "#3F4F6A", turbante: "#D2C2A2", barba: "canosa", canas: 0.6 },
  oyente3: { piel: "#C69270", pielSombra: "#A47352", pelo: "#2E1F16", tunica: "#D4C29E", tunicaSombra: "#B4A078", faja: "#8C6A3A", barba: "ninguna" },
  fiel: { piel: "#C99470", pielSombra: "#A97553", pelo: "#2A1A12", tunica: "#B8643F", tunicaSombra: "#96502F", pantalon: "#34466A", peloLargo: true, barba: "ninguna" },
  fiel2: { piel: "#B98260", pielSombra: "#986343", pelo: "#3A2A1E", tunica: "#4F6E5A", tunicaSombra: "#3E5848", pantalon: "#2E3A55", barba: "corta" },
  fiel3: { piel: "#C99A7A", pielSombra: "#A97B5B", pelo: "#9A948C", tunica: "#5A6E96", tunicaSombra: "#475878", pantalon: "#3A3A44", peloLargo: true, barba: "ninguna" },
  centurion: { piel: "#C08A63", pielSombra: "#9E6B48", pelo: "#2A1B12", tunica: "#9C2F25", tunicaSombra: "#7A231C", faja: "#5A3A22", coraza: "#B98A3E", casco: "#C9973F", capa: "#7A231C", barba: "corta" },
  juan: { piel: "#B47E5A", pielSombra: "#93603F", pelo: "#2B1A10", tunica: "#8E6A3C", tunicaSombra: "#6F5230", faja: "#4A2E1A", barba: "larga", canas: 0, peloLargo: true, rebelde: true, pelaje: true },
  criado: { piel: "#C7A07E", pielSombra: "#A88262", pelo: "#3A2A1E", tunica: "#DCD2BC", tunicaSombra: "#BDB198", faja: "#8C7A5A", barba: "ninguna" },
  abuela: { piel: "#D2A383", pielSombra: "#B08463", pelo: "#C9C4BC", tunica: "#8A4E5E", tunicaSombra: "#6E3C4A", pantalon: "#4A4A5A", rodete: true, anteojos: true, barba: "ninguna" },
  pio5: { piel: "#D0A07E", pielSombra: "#AE7E5C", pelo: "#E8E4DC", tunica: "#F4F1EA", tunicaSombra: "#D9D3C6", faja: "#EDE7DA", muceta: "#A3242A", solideo: "#F7F4EE", barba: "larga", canas: 1 },
  leon13: { piel: "#D6AA88", pielSombra: "#B48866", pelo: "#E2DED6", tunica: "#F4F1EA", tunicaSombra: "#D9D3C6", faja: "#EDE7DA", muceta: "#A3242A", solideo: "#F7F4EE", barba: "ninguna" },
  jp2: { piel: "#DDB496", pielSombra: "#BC9274", pelo: "#B9B1A6", tunica: "#F5F2EB", tunicaSombra: "#DAD4C7", faja: "#EEE8DB", muceta: "#EFEBE2", solideo: "#FBF9F4", barba: "ninguna", canas: 0.6 },
  fatima: { piel: "#E9CDB6", pielSombra: "#CFAE95", pelo: "#5A4434", tunica: "#F7F4EE", tunicaSombra: "#DCD6CA", velo: "#FBF9F4", faja: "#D9B45A", barba: "ninguna" },
  sembrador: { piel: "#B47E5A", pielSombra: "#93603F", pelo: "#4A3A2E", tunica: "#E4D6B8", tunicaSombra: "#C6B48F", manto: "#7A5A3A", mantoSombra: "#5E4429", faja: "#3F4F6A", turbante: "#D9CBAE", barba: "corta", canas: 0.3 },
  enemigo: { piel: "#6E5A50", pielSombra: "#55443C", pelo: "#1E140E", tunica: "#2A2433", tunicaSombra: "#1E1A28", manto: "#1E1A28", mantoSombra: "#141018", faja: "#141018", turbante: "#241E2E", barba: "corta" },
  prodigo: { piel: "#B98260", pielSombra: "#986343", pelo: "#2E1F16", tunica: "#9A8C74", tunicaSombra: "#7A6E5A", faja: "#5A4A3A", barba: "corta" },
  prodigo2: { piel: "#B98260", pielSombra: "#986343", pelo: "#2E1F16", tunica: "#EFE6D2", tunicaSombra: "#D2C5A8", manto: "#2F4F8A", mantoSombra: "#243D6C", faja: "#C9A24A", barba: "corta" },
  padre: { piel: "#C08A63", pielSombra: "#9E6B48", pelo: "#C9C2B6", tunica: "#E9DFC8", tunicaSombra: "#CBBE9F", manto: "#7A2E3A", mantoSombra: "#5E222C", faja: "#C9A24A", turbante: "#EFE6D2", barba: "larga", canas: 0.9 },
  ezequias: { piel: "#C08A63", pielSombra: "#9E6B48", pelo: "#3A2A1E", tunica: "#E9DFC8", tunicaSombra: "#CBBE9F", manto: "#2F4F8A", mantoSombra: "#243D6C", faja: "#C9A24A", turbante: "#EFE6D2", diadema: "#E3B04B", barba: "corta" },
  isaias: { piel: "#B98260", pielSombra: "#986343", pelo: "#8C8478", tunica: "#D9CBAE", tunicaSombra: "#B9A988", manto: "#7A5A3A", mantoSombra: "#5E4429", faja: "#3F4F6A", turbante: "#E6DCC6", barba: "larga", canas: 0.75 },
  asirio: { piel: "#B07B57", pielSombra: "#8F5E3E", pelo: "#1E140E", tunica: "#9C2F25", tunicaSombra: "#7A231C", faja: "#C9973F", yelmo: "#A8A49A", barba: "larga", canas: 0 },
  asirio2: { piel: "#A97352", pielSombra: "#875638", pelo: "#24170F", tunica: "#5A4A7A", tunicaSombra: "#463A60", faja: "#C9973F", yelmo: "#B8B0A0", barba: "larga", canas: 0 },
  medico: { piel: "#C08A63", pielSombra: "#9E6B48", pelo: "#2E2018", tunica: "#8FB7C9", tunicaSombra: "#729AAC", pantalon: "#7FA6B8", barba: "ninguna" },
  francisco: { piel: "#D9AE90", pielSombra: "#B88C6E", pelo: "#D9D5CD", tunica: "#F5F2EB", tunicaSombra: "#DAD4C7", faja: "#EEE8DB", solideo: "#FBF9F4", barba: "ninguna", canas: 1 },
  francisco2: { piel: "#D9AE90", pielSombra: "#B88C6E", pelo: "#D9D5CD", tunica: "#F2C62B", tunicaSombra: "#D4A514", faja: "#E6B81F", solideo: "#FBF9F4", barba: "ninguna", canas: 1 },
  jesus2: { piel: "#CD9A72", pielSombra: "#B07C56", pelo: "#3A2418", tunica: "#FFF8E4", tunicaSombra: "#EBDDB0", manto: "#F4D274", mantoSombra: "#D6AE4A", faja: "#E3B04B", barba: "corta" },
  pedro: { piel: "#B98260", pielSombra: "#986343", pelo: "#6A5A4A", tunica: "#B9946A", tunicaSombra: "#957652", manto: "#6E5A3E", mantoSombra: "#54452E", faja: "#4A3A2A", barba: "corta", canas: 0.4 },
  pedro2: { piel: "#B98260", pielSombra: "#986343", pelo: "#CFC9BE", tunica: "#A39A88", tunicaSombra: "#80786A", manto: "#4E4638", mantoSombra: "#3A3428", faja: "#3A3024", barba: "corta", canas: 1 },
  betania: { piel: "#BE8A66", pielSombra: "#9C6A49", pelo: "#3A2418", tunica: "#E6D3B0", tunicaSombra: "#C6B08A", velo: "#B5653F", faja: "#6E4A7A", barba: "ninguna" },
  fiel4: { piel: "#D2A07C", pielSombra: "#B0805E", pelo: "#5A3A26", tunica: "#B5653F", tunicaSombra: "#93502F", pantalon: "#3A3550", peloLargo: true, barba: "ninguna" },
  fiel5: { piel: "#CFA283", pielSombra: "#AD8263", pelo: "#B8B2A8", tunica: "#6E5A7A", tunicaSombra: "#574662", pantalon: "#3E3A36", anteojos: true, barba: "corta", canas: 0.8 },
  fiel6: { piel: "#A87452", pielSombra: "#875638", pelo: "#1E140E", tunica: "#C9A24A", tunicaSombra: "#A68235", pantalon: "#2E3A55", barba: "ninguna" },
  sacerdote: { piel: "#C08A63", pielSombra: "#9E6B48", pelo: "#6E6A64", tunica: "#F2EEE4", tunicaSombra: "#D6CFBF", casulla: "#4F7A4A", barba: "ninguna" },
};

const mezclar = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(",")})`;
};

const aclarar = (a: string, t: number) => mezclar(a, "#FFFFFF", t);
const oscurecer = (a: string, t: number) => mezclar(a, "#000000", t);

// Manos con dedos (palma + dedos + pulgar). El origen es el centro de la palma; +y se aleja de la muñeca.
const Mano: React.FC<{ tipo: "abierta" | "puno" | "senala"; piel: string; sombra: string }> = ({ tipo, piel, sombra }) => {
  const borde = oscurecer(sombra, 0.28);
  const palma = "M -26 -6 Q -28 -30 0 -30 Q 28 -30 26 -6 Q 26 20 0 22 Q -26 20 -26 -6 Z";
  if (tipo === "senala") {
    return (
      <g>
        <rect x={-10} y={6} width={19} height={62} rx={9.5} fill={piel} stroke={borde} strokeWidth={2.5} />
        <path d={palma} fill={piel} stroke={borde} strokeWidth={2.5} />
        <path d="M 4 6 Q 12 12 20 5 M 6 15 Q 13 19 19 13" stroke={sombra} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        <ellipse cx={-19} cy={6} rx={10} ry={15} fill={piel} stroke={borde} strokeWidth={2.2} transform="rotate(-22 -19 6)" />
      </g>
    );
  }
  if (tipo === "puno") {
    return (
      <g>
        <path d="M -26 -6 Q -28 -30 0 -30 Q 28 -30 26 -4 Q 26 24 0 26 Q -26 24 -26 -6 Z" fill={piel} stroke={borde} strokeWidth={2.5} />
        <path d="M -15 9 Q -9 17 -3 9 Q 3 17 9 9 Q 14 16 20 8" stroke={sombra} strokeWidth={3} fill="none" strokeLinecap="round" />
        <ellipse cx={-19} cy={-2} rx={10} ry={15} fill={piel} stroke={borde} strokeWidth={2.2} transform="rotate(-25 -19 -2)" />
      </g>
    );
  }
  return (
    <g>
      {(
        [
          [-18, 30],
          [-6, 38],
          [7, 36],
          [19, 28],
        ] as const
      ).map(([x, l], i) => (
        <rect key={i} x={x - 6} y={4} width={12} height={l} rx={6} fill={piel} stroke={borde} strokeWidth={2.2} />
      ))}
      <path d={palma} fill={piel} stroke={borde} strokeWidth={2.5} />
      <ellipse cx={-25} cy={0} rx={9} ry={19} fill={piel} stroke={borde} strokeWidth={2.2} transform="rotate(-28 -25 0)" />
      <path d="M -12 4 Q 0 11 13 4" stroke={sombra} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.8} />
    </g>
  );
};

const BrazoSVG: React.FC<{ lado: 1 | -1; b: Brazo; c: Paleta; manto: boolean; recto: boolean }> = ({ lado, b, c, manto, recto }) => {
  const tela = manto && c.manto ? c.manto : c.tunica;
  const telaSombra = manto && c.mantoSombra ? c.mantoSombra : c.tunicaSombra;
  const borde = oscurecer(telaSombra, 0.25);
  const bordeT = oscurecer(c.tunicaSombra, 0.25);
  const bordePiel = oscurecer(c.pielSombra, 0.28);
  return (
    <g transform={`translate(${132 * lado} 345) rotate(${-b.hombro * lado})`}>
      {/* brazo superior con hombro redondeado */}
      <path d="M -37 -8 Q -40 -36 0 -37 Q 40 -36 37 -8 L 33 166 Q 0 180 -33 166 Z" fill={tela} stroke={borde} strokeWidth={3} strokeLinejoin="round" />
      <path d={lado === 1 ? "M 12 -34 Q 38 -30 37 -8 L 33 166 Q 24 172 14 175 Z" : "M -12 -34 Q -38 -30 -37 -8 L -33 166 Q -24 172 -14 175 Z"} fill={telaSombra} opacity={0.5} />
      {/* codo: une las dos partes sin quiebres */}
      <circle cx={0} cy={160} r={31} fill={tela} />
      <g transform={`translate(0 160) rotate(${-b.codo * lado})`}>
        {recto ? (
          <>
            <path d="M -31 -10 Q 0 -22 31 -10 L 30 128 Q 0 138 -30 128 Z" fill={c.tunica} stroke={bordeT} strokeWidth={3} strokeLinejoin="round" />
            <path d="M -31 114 Q 0 126 31 114 L 30 132 Q 0 144 -30 132 Z" fill={c.tunicaSombra} />
          </>
        ) : (
          <>
            <path d="M -32 -10 Q 0 -22 32 -10 L 43 126 Q 0 146 -43 126 Z" fill={c.tunica} stroke={bordeT} strokeWidth={3} strokeLinejoin="round" />
            <path d={lado === 1 ? "M 10 -16 Q 26 -14 32 -10 L 43 126 Q 30 134 16 138 Z" : "M -10 -16 Q -26 -14 -32 -10 L -43 126 Q -30 134 -16 138 Z"} fill={c.tunicaSombra} opacity={0.45} />
            <path d="M -8 20 Q -4 70 -14 118" stroke={c.tunicaSombra} strokeWidth={4} fill="none" opacity={0.45} strokeLinecap="round" />
            {/* boca de la manga */}
            <path d="M -43 126 Q 0 146 43 126 Q 0 114 -43 126 Z" fill={oscurecer(c.tunicaSombra, 0.32)} />
          </>
        )}
        {/* muñeca y mano */}
        <rect x={-14} y={126} width={28} height={40} rx={12} fill={c.piel} stroke={bordePiel} strokeWidth={2.5} />
        <rect x={-14} y={126} width={28} height={14} fill={c.pielSombra} opacity={0.6} />
        <g transform={`translate(0 182) scale(${lado} 1)`}>
          <Mano tipo={b.mano ?? "abierta"} piel={c.piel} sombra={c.pielSombra} />
        </g>
      </g>
    </g>
  );
};

const Ojo: React.FC<{ x: number; apertura: number; mirada: [number, number]; piel: string }> = ({ x, apertura, mirada, piel }) => {
  const ab = Math.max(0, Math.min(1, apertura));
  const ry = 17;
  const yParp = -ry + (2 * ry + 2) * (1 - ab);
  return (
    <g transform={`translate(${x} 150)`}>
      <ellipse cx={0} cy={0} rx={21} ry={ry} fill="#FBF6EC" />
      <ellipse cx={0} cy={-ry + 5} rx={21} ry={8} fill="#8A7A6A" opacity={0.22} />
      <circle cx={mirada[0]} cy={mirada[1] + 1} r={11.5} fill="#5A3A22" />
      <circle cx={mirada[0]} cy={mirada[1] + 1} r={11.5} fill="none" stroke="#2E1B10" strokeWidth={2} />
      <circle cx={mirada[0]} cy={mirada[1] + 1} r={5.5} fill="#140C07" />
      <circle cx={mirada[0] + 4} cy={mirada[1] - 4} r={3.2} fill="#FFFFFF" opacity={0.95} />
      <circle cx={mirada[0] - 4} cy={mirada[1] + 5} r={1.6} fill="#FFFFFF" opacity={0.5} />
      {/* párpado superior */}
      <path d={`M -24 ${-ry - 4} L 24 ${-ry - 4} L 24 ${yParp} L -24 ${yParp} Z`} fill={piel} />
      <path d={`M -23 ${yParp - 1} Q 0 ${yParp - 8} 23 ${yParp - 1}`} stroke="#2A1810" strokeWidth={4.5} fill="none" strokeLinecap="round" />
      {ab > 0.4 ? <path d={`M -20 ${ry - 2} Q 0 ${ry + 3} 20 ${ry - 2}`} stroke="#000" strokeWidth={2} fill="none" opacity={0.18} strokeLinecap="round" /> : null}
    </g>
  );
};

// Paleta pública (para dibujar brazos sueltos con la misma ropa).
export const paletaDe = (q: Quien) => PALETAS[q];

export const Persona: React.FC<PropsPersona> = (p) => {
  const frame = useCurrentFrame();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const c = PALETAS[p.quien];
  const esJesus = p.quien === "jesus";
  const edad = esJesus ? Math.max(0, Math.min(1, p.edad ?? 1)) : 1;
  const semilla = p.semilla ?? 0;
  const cam = p.caminando ?? 0;
  const fase = (p.paso ?? 0) * Math.PI * 2;
  const rebote = -Math.abs(Math.sin(fase)) * 14 * cam;
  const respira = Math.sin((frame + semilla * 13) / 20) * 2.5;
  const ciclo = (frame + semilla * 37) % 110;
  const parpadeo = ciclo < 4 ? Math.abs(ciclo - 2) / 2 : 1;
  const giro = (p.giro ?? 0) * 20;
  const mir = p.mirada ?? [0, 0];
  const cejaY = p.cejas?.y ?? 0;
  const cejaRot = p.cejas?.rot ?? 0;
  const boca = { apertura: Math.max(p.boca?.apertura ?? 0, p.bocaAuto ?? 0), curva: p.boca?.curva ?? 6 };
  const balanceo = Math.sin(fase) * 22 * cam;
  const bIzq: Brazo = p.brazoIzq ?? { hombro: 8 - balanceo, codo: -10 - Math.max(0, -balanceo) * 0.8 };
  const bDer: Brazo = p.brazoDer ?? { hombro: 8 + balanceo, codo: -10 - Math.max(0, balanceo) * 0.8 };
  const moderno = !!c.pantalon;
  const largoTunica = moderno ? 640 : p.corta ? 760 : 1000;
  const piso = p.corta || moderno ? 1010 : largoTunica + 18; // altura de los pies
  const conManto = !!c.manto;
  const alto = 1100;
  // movimiento secundario: la cabeza nunca queda del todo quieta; al caminar el cuerpo se inclina hacia adelante
  const cabezaViva = Math.sin((frame + semilla * 29) / 37) * 0.9 + Math.sin((frame + semilla * 7) / 61) * 0.5;
  const inclina = cam * 2.6 * (giro === 0 ? 0 : Math.sign(giro));
  const ruedo = Math.sin(fase) * 16 * cam;

  // Rasgos de Jesús según la edad: cara un poco más larga, barba y pelo más largos.
  const caraRy = 110 + 10 * edad;
  const caraRx = 98 + 4 * edad;
  const largoPelo = 210 + 70 * edad;

  const bordeTun = oscurecer(c.tunicaSombra, 0.25);
  const bordePiel = oscurecer(c.pielSombra, 0.28);
  const bordePelo = oscurecer(c.pelo, 0.3);
  const tun = `url(#tun${uid})`;
  const colorBarba = mezclar(c.pelo, "#D8D2C6", c.canas ?? 0);
  const colorCeja = mezclar(c.pelo, "#D8D2C6", (c.canas ?? 0) * 0.7);

  const sandalia = (dx: number) => (
    <g>
      <ellipse cx={dx} cy={12} rx={46} ry={17} fill="#3A2618" />
      <ellipse cx={dx} cy={7} rx={42} ry={15} fill={moderno ? "#4A3A30" : c.piel} />
      {moderno ? <ellipse cx={dx} cy={7} rx={42} ry={15} fill="#5A4636" /> : <path d={`M ${dx - 34} 6 Q ${dx} ${-8} ${dx + 34} 6 M ${dx - 10} -6 L ${dx - 10} 18 M ${dx + 14} -5 L ${dx + 14} 18`} stroke="#5A3E2A" strokeWidth={6} fill="none" strokeLinecap="round" />}
    </g>
  );

  const pies = (sentado: boolean) =>
    sentado ? (
      <g>
        <g transform="translate(-60 852)">{sandalia(0)}</g>
        <g transform="translate(60 852)">{sandalia(0)}</g>
      </g>
    ) : (
      [-1, 1].map((lado) => {
        const f = Math.sin(fase + (lado === 1 ? 0 : Math.PI));
        const lev = Math.max(0, f) * cam;
        return (
          <g key={lado} transform={`translate(${48 * lado + f * 30 * cam} ${piso - lev * 30})`}>
            {p.corta || moderno ? (
              <>
                <rect x={moderno ? -30 : -20} y={largoTunica - piso - 20} width={moderno ? 60 : 40} height={piso - largoTunica + 22} rx={moderno ? 22 : 18} fill={c.pantalon ?? c.piel} stroke={c.pantalon ? oscurecer(c.pantalon, 0.25) : bordePiel} strokeWidth={2.5} />
                <rect x={moderno ? 6 : 4} y={largoTunica - piso - 16} width={moderno ? 22 : 14} height={piso - largoTunica + 12} rx={8} fill="#000" opacity={0.12} />
              </>
            ) : null}
            {sandalia(8 * lado)}
          </g>
        );
      })
    );

  const cuerpo = p.sentado ? (
    // Sentado: túnica que cae sobre las rodillas
    <g>
      <path d="M -132 380 Q -140 330 -80 312 L 80 312 Q 140 330 132 380 L 150 640 Q 170 700 170 780 L 160 850 L -160 850 L -170 780 Q -170 700 -150 640 Z" fill={tun} stroke={bordeTun} strokeWidth={3} strokeLinejoin="round" />
      <path d="M -150 700 Q 0 660 150 700 L 160 850 L -160 850 Z" fill={c.pantalon ?? c.tunicaSombra} opacity={c.pantalon ? 1 : 0.6} />
      {c.pantalon ? <path d="M -152 630 Q 0 600 152 630 Q 170 700 170 780 L 160 850 L -160 850 L -170 780 Q -170 700 -152 630 Z" fill={c.pantalon} stroke={oscurecer(c.pantalon, 0.25)} strokeWidth={3} /> : null}
      <path d="M 60 320 L 80 312 Q 140 330 132 380 L 150 640 L 100 650 Z" fill={c.tunicaSombra} opacity={0.45} />
      {/* rodillas y pliegues del regazo */}
      <path d="M -150 690 Q -80 650 -10 700 M 10 700 Q 80 650 150 690" stroke={c.pantalon ? oscurecer(c.pantalon, 0.25) : c.tunicaSombra} strokeWidth={5} fill="none" opacity={0.6} strokeLinecap="round" />
      <path d="M 0 705 L 0 846" stroke={c.pantalon ? oscurecer(c.pantalon, 0.3) : c.tunicaSombra} strokeWidth={5} opacity={0.5} />
    </g>
  ) : (
    <g>
      <path d={`M -130 380 Q -138 328 -80 312 L 80 312 Q 138 328 130 380 L 150 ${largoTunica} Q ${ruedo} ${largoTunica + 22} -150 ${largoTunica} Z`} fill={tun} stroke={bordeTun} strokeWidth={3} strokeLinejoin="round" />
      <path d={`M 56 318 L 80 312 Q 138 328 130 380 L 150 ${largoTunica} Q 120 ${largoTunica + 8} 92 ${largoTunica + 12} Z`} fill={c.tunicaSombra} opacity={0.42} />
      {moderno ? null : (
        <>
          {/* pliegues que caen desde la cintura */}
          <path
            d={`M -64 ${Math.min(660, largoTunica - 90)} Q -74 ${largoTunica - 120} ${-86 + ruedo * 0.5} ${largoTunica - 12} M -10 ${Math.min(645, largoTunica - 100)} Q -18 ${largoTunica - 150} ${-8 + ruedo * 0.6} ${largoTunica - 4} M 44 ${Math.min(655, largoTunica - 95)} Q 56 ${largoTunica - 130} ${60 + ruedo * 0.5} ${largoTunica - 8}`}
            stroke={c.tunicaSombra}
            strokeWidth={5}
            opacity={0.55}
            fill="none"
            strokeLinecap="round"
          />
          {/* ruedo */}
          <path d={`M -150 ${largoTunica} Q ${ruedo} ${largoTunica + 22} 150 ${largoTunica} L 148 ${largoTunica - 20} Q ${ruedo} ${largoTunica + 2} -148 ${largoTunica - 20} Z`} fill={c.tunicaSombra} opacity={0.6} />
        </>
      )}
    </g>
  );

  return (
    <svg
      viewBox={`-300 -60 600 ${alto}`}
      width={p.ancho}
      height={(p.ancho * alto) / 600}
      style={{ overflow: "visible", position: "absolute", left: -p.ancho / 2, top: 0 }}
    >
      <defs>
        <linearGradient id={`tun${uid}`} gradientUnits="userSpaceOnUse" x1={-150} y1={0} x2={150} y2={0}>
          <stop offset="0" stopColor={aclarar(c.tunica, 0.14)} />
          <stop offset="0.45" stopColor={c.tunica} />
          <stop offset="1" stopColor={mezclar(c.tunica, c.tunicaSombra, 0.75)} />
        </linearGradient>
        <linearGradient id={`man${uid}`} gradientUnits="userSpaceOnUse" x1={-60} y1={300} x2={160} y2={700}>
          <stop offset="0" stopColor={aclarar(c.manto ?? c.tunica, 0.14)} />
          <stop offset="0.5" stopColor={c.manto ?? c.tunica} />
          <stop offset="1" stopColor={c.mantoSombra ?? c.tunicaSombra} />
        </linearGradient>
        <radialGradient id={`car${uid}`} gradientUnits="userSpaceOnUse" cx={-34} cy={104} r={190}>
          <stop offset="0" stopColor={aclarar(c.piel, 0.13)} />
          <stop offset="0.55" stopColor={c.piel} />
          <stop offset="1" stopColor={mezclar(c.piel, c.pielSombra, 0.7)} />
        </radialGradient>
        <radialGradient id={`som${uid}`}>
          <stop offset="0" stopColor="#000" stopOpacity={0.38} />
          <stop offset="0.6" stopColor="#000" stopOpacity={0.2} />
          <stop offset="1" stopColor="#000" stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform={`${p.espejo ? "scale(-1 1) " : ""}translate(0 ${rebote})`}>
        {/* sombra de contacto */}
        <ellipse cx={0} cy={(p.sentado ? 872 : piso + 18) - rebote} rx={190 - Math.abs(rebote) * 2} ry={26} fill={`url(#som${uid})`} />
        {pies(!!p.sentado)}
        <g transform={`rotate(${inclina} 0 ${piso})`}>
          <g transform={`translate(0 ${respira * 0.4})`}>
            {/* pelo largo por detrás (María bajo el velo, Jesús) */}
            {esJesus || c.peloLargo ? <path d={`M -104 140 Q -112 ${largoPelo + 30} -70 ${largoPelo + 50} L 70 ${largoPelo + 50} Q 112 ${largoPelo + 30} 104 140 Z`} fill={c.pelo} stroke={bordePelo} strokeWidth={3} /> : null}
            {c.velo ? <path d="M -136 120 Q -150 330 -150 560 Q -120 620 0 640 Q 120 620 150 560 Q 150 330 136 120 Q 120 10 0 0 Q -120 10 -136 120 Z" fill={mezclar(c.velo, "#000000", 0.18)} stroke={oscurecer(c.velo, 0.4)} strokeWidth={3} /> : null}
            {c.capa ? <path d={`M -140 330 Q -190 600 -170 ${p.corta ? 900 : 980} L 170 ${p.corta ? 900 : 980} Q 190 600 140 330 Z`} fill={c.capa} stroke={oscurecer(c.capa, 0.3)} strokeWidth={3} /> : null}
            {cuerpo}
            {/* vestido de pelo de camello: borde desflecado y textura */}
            {c.pelaje && !p.sentado ? (
              <g>
                <path d={`M -150 ${largoTunica - 6} ${Array.from({ length: 12 }, (_, i) => `L ${-150 + i * 25 + 12} ${largoTunica + 26} L ${-150 + (i + 1) * 25} ${largoTunica - 6}`).join(" ")} Z`} fill={c.tunica} />
                {Array.from({ length: 16 }, (_, i) => (
                  <path key={i} d={`M ${-110 + (i % 4) * 60 + (i % 2) * 18} ${400 + Math.floor(i / 4) * 120} l 10 18 l 10 -18`} stroke={c.tunicaSombra} strokeWidth={5} fill="none" opacity={0.6} />
                ))}
              </g>
            ) : null}
            {/* coraza del centurión con tiras de cuero */}
            {c.coraza ? (
              <g>
                {Array.from({ length: 9 }, (_, i) => (
                  <rect key={i} x={-126 + i * 28} y={590} width={22} height={100} rx={5} fill="#6A4426" stroke="#3A2618" strokeWidth={2} />
                ))}
                <path d="M -128 330 Q 0 300 128 330 L 132 600 Q 0 624 -132 600 Z" fill={c.coraza} stroke={oscurecer(c.coraza, 0.35)} strokeWidth={3} />
                <path d="M -60 380 Q 0 420 60 380 M -70 450 Q 0 490 70 450 M -80 520 Q 0 560 80 520" stroke="#8A6428" strokeWidth={6} fill="none" />
                <path d="M -100 350 Q -90 470 -104 580" stroke="#FFE7A3" strokeWidth={8} fill="none" opacity={0.35} strokeLinecap="round" />
                <path d="M 60 330 Q 128 330 128 330 L 132 600 Q 110 606 90 610 Z" fill="#000" opacity={0.14} />
              </g>
            ) : null}
            {/* faja con nudo y punta que cuelga */}
            {p.sentado || !c.faja ? null : (
              <g>
                <path d="M -138 590 Q 0 612 138 590 L 140 628 Q 0 650 -140 628 Z" fill={c.faja} stroke={oscurecer(c.faja, 0.3)} strokeWidth={2.5} />
                <path d="M 40 604 L 140 592 L 140 628 L 60 642 Z" fill="#000" opacity={0.14} />
                {moderno || c.coraza ? null : (
                  <>
                    <path d={`M -74 624 L ${-86 + ruedo * 0.3} 716 L ${-58 + ruedo * 0.3} 722 L -52 628 Z`} fill={c.faja} stroke={oscurecer(c.faja, 0.3)} strokeWidth={2.5} />
                    <circle cx={-62} cy={622} r={15} fill={c.faja} stroke={oscurecer(c.faja, 0.3)} strokeWidth={2.5} />
                  </>
                )}
              </g>
            )}
            {/* suéter: cuello y puño elástico */}
            {moderno && !p.sentado ? <path d="M -136 610 Q 0 640 136 610 L 138 644 Q 0 674 -138 644 Z" fill={c.tunicaSombra} stroke={bordeTun} strokeWidth={2.5} /> : null}
            {/* casulla del sacerdote, con franja dorada */}
            {c.casulla ? (
              <g>
                <path d="M -150 330 Q 0 290 150 330 L 175 860 Q 0 900 -175 860 Z" fill={c.casulla} stroke={oscurecer(c.casulla, 0.35)} strokeWidth={3} />
                <path d="M 60 330 Q 150 330 150 330 L 175 860 Q 130 880 90 885 Z" fill="#000" opacity={0.12} />
                <rect x={-22} y={318} width={44} height={570} fill="#D9B25A" />
                <rect x={-90} y={470} width={180} height={34} fill="#D9B25A" />
              </g>
            ) : null}
            {/* manto en diagonal sobre el hombro */}
            {conManto && !p.corta ? (
              <g>
                <path
                  d={`M 40 306 Q 150 312 146 420 L ${p.sentado ? 160 : 156} ${p.sentado ? 840 : largoTunica - 30} Q 60 ${p.sentado ? 860 : largoTunica - 10} 10 ${p.sentado ? 830 : largoTunica - 60} L -60 470 Q -40 340 40 306 Z`}
                  fill={`url(#man${uid})`}
                  stroke={oscurecer(c.mantoSombra ?? c.manto ?? "#000000", 0.3)}
                  strokeWidth={3}
                  strokeLinejoin="round"
                />
                <path d={`M 100 330 Q 150 340 146 420 L ${p.sentado ? 160 : 156} ${p.sentado ? 840 : largoTunica - 30} Q 130 ${p.sentado ? 848 : largoTunica - 22} 110 ${p.sentado ? 850 : largoTunica - 20} Z`} fill={c.mantoSombra} opacity={0.55} />
                {/* borde claro y pliegues del manto */}
                <path d={`M -58 470 L 10 ${p.sentado ? 830 : largoTunica - 60}`} stroke={aclarar(c.manto ?? "#888888", 0.3)} strokeWidth={6} opacity={0.7} strokeLinecap="round" />
                <path d={`M 30 430 Q 60 600 50 ${p.sentado ? 800 : largoTunica - 80} M 84 400 Q 110 600 104 ${p.sentado ? 820 : largoTunica - 50}`} stroke={c.mantoSombra} strokeWidth={5} fill="none" opacity={0.6} strokeLinecap="round" />
                {p.quien === "maestro" ? [0, 1].map((i) => <path key={i} d={`M ${-20 + i * 18} ${560 + i * 30} L ${150} ${520 + i * 30}`} stroke="#2E4D7A" strokeWidth={8} opacity={0.75} />) : null}
              </g>
            ) : null}
            {c.muceta ? (
              <g>
                <path d="M -150 330 Q 0 290 150 330 L 166 470 Q 0 510 -166 470 Z" fill={c.muceta} stroke={oscurecer(c.muceta, 0.3)} strokeWidth={3} />
                <path d="M -30 320 L 0 350 L 30 320" stroke="#F7F4EE" strokeWidth={8} fill="none" />
                {[0, 1, 2, 3].map((i) => <circle key={i} cx={0} cy={370 + i * 30} r={5} fill="#F7F4EE" />)}
              </g>
            ) : null}
            {/* cuello de la túnica y sombra de la cabeza sobre el pecho */}
            <ellipse cx={4} cy={332} rx={74} ry={24} fill="#000" opacity={0.1} />
            <path d="M -46 312 Q 0 352 46 312" stroke={c.tunicaSombra} strokeWidth={8} fill="none" />
            {p.sinBrazos ? null : <BrazoSVG lado={-1} b={bIzq} c={c} manto={false} recto={moderno} />}
            {p.sinBrazos ? null : <BrazoSVG lado={1} b={bDer} c={c} manto={conManto && !p.corta} recto={moderno} />}
          </g>
          {/* cabeza */}
          <g transform={`translate(0 ${respira}) rotate(${(p.cabeza ?? 0) + cabezaViva} 0 300)`}>
            <rect x={-30} y={236} width={60} height={86} rx={22} fill={c.pielSombra} stroke={bordePiel} strokeWidth={2.5} />
            <path d="M -30 262 Q 0 296 30 262 L 30 250 L -30 250 Z" fill="#000" opacity={0.16} />
            {c.rodete ? <circle cx={0} cy={20} r={58} fill={c.pelo} stroke={bordePelo} strokeWidth={3} /> : null}
            {c.velo ? <path d="M -128 120 Q -132 300 -110 330 L 110 330 Q 132 300 128 120 Q 116 16 0 8 Q -116 16 -128 120 Z" fill={c.velo} stroke={oscurecer(c.velo, 0.3)} strokeWidth={3} /> : null}
            {c.velo ? null : (
              <>
                {giro > 8 ? null : (
                  <g>
                    <ellipse cx={-100 + giro * 0.2} cy={160} rx={17} ry={25} fill={c.piel} stroke={bordePiel} strokeWidth={2.5} />
                    <path d={`M ${-104 + giro * 0.2} 150 Q ${-112 + giro * 0.2} 162 ${-102 + giro * 0.2} 172`} stroke={c.pielSombra} strokeWidth={4} fill="none" strokeLinecap="round" />
                  </g>
                )}
                {giro < -8 ? null : (
                  <g>
                    <ellipse cx={100 + giro * 0.2} cy={160} rx={17} ry={25} fill={c.pielSombra} stroke={bordePiel} strokeWidth={2.5} />
                    <path d={`M ${104 + giro * 0.2} 150 Q ${112 + giro * 0.2} 162 ${102 + giro * 0.2} 172`} stroke={bordePiel} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} />
                  </g>
                )}
              </>
            )}
            <ellipse cx={0} cy={150 + (caraRy - 110) * 0.4} rx={caraRx} ry={caraRy} fill={`url(#car${uid})`} stroke={bordePiel} strokeWidth={3} />
            {/* bajo el velo: pelo partido al medio sobre la frente (mujeres) */}
            {c.velo ? <path d="M -100 150 Q -98 52 0 50 Q 98 52 100 150 Q 84 92 40 80 Q 12 74 0 86 Q -12 74 -40 80 Q -84 92 -100 150 Z" fill={c.pelo} /> : null}
            {/* pelo / tocado */}
            {esJesus ? (
              <g>
                <path d="M -104 150 Q -114 40 -30 30 Q 10 18 50 28 Q 112 44 104 150 Q 94 96 66 80 Q 30 66 6 76 Q -30 64 -60 82 Q -92 100 -104 150 Z" fill={c.pelo} stroke={bordePelo} strokeWidth={3} strokeLinejoin="round" />
                <path d="M -70 62 Q -30 40 20 44" stroke={aclarar(c.pelo, 0.22)} strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.7} />
              </g>
            ) : null}
            {c.rebelde ? (
              <path d="M -110 130 L -138 100 L -112 86 L -132 46 L -96 52 L -92 8 L -58 34 L -36 -6 L -8 26 L 22 -8 L 40 28 L 74 4 L 82 44 L 120 36 L 108 76 L 140 96 L 112 130 Z" fill={c.pelo} stroke={bordePelo} strokeWidth={3} strokeLinejoin="round" />
            ) : null}
            {c.casco ? (
              <g>
                {/* cresta transversal (de lado a lado) */}
                <path d="M -150 40 Q 0 -110 150 40 L 120 50 Q 0 -60 -120 50 Z" fill="#B0281E" stroke="#6E1610" strokeWidth={3} />
                {Array.from({ length: 9 }, (_, i) => (
                  <line key={i} x1={-120 + i * 30} y1={44 - Math.sin((i / 8) * Math.PI) * 70} x2={-136 + i * 34} y2={38 - Math.sin((i / 8) * Math.PI) * 100} stroke="#7A1A14" strokeWidth={4} />
                ))}
                <path d="M -112 128 Q -116 30 0 24 Q 116 30 112 128 L 96 120 Q 0 96 -96 120 Z" fill={c.casco} stroke={oscurecer(c.casco, 0.35)} strokeWidth={3} />
                <path d="M -84 100 Q -80 50 -30 38" stroke="#FFE7A3" strokeWidth={8} fill="none" opacity={0.45} strokeLinecap="round" />
                <rect x={-112} y={112} width={224} height={18} rx={8} fill="#A87A2E" />
                <path d="M -110 128 L -96 214 L -74 210 L -82 128 Z M 110 128 L 96 214 L 74 210 L 82 128 Z" fill={c.casco} stroke={oscurecer(c.casco, 0.35)} strokeWidth={2.5} />
              </g>
            ) : null}
            {c.turbante ? (
              <g>
                <path d="M -112 120 Q -118 30 0 24 Q 118 30 112 120 Q 60 96 0 98 Q -60 96 -112 120 Z" fill={c.turbante} stroke={oscurecer(c.turbante, 0.3)} strokeWidth={3} strokeLinejoin="round" />
                <path d="M 40 30 Q 118 40 112 120 Q 80 104 50 100 Q 70 60 40 30 Z" fill="#000" opacity={0.1} />
                <path d="M -108 112 Q 0 84 108 112" stroke={mezclar(c.turbante, "#000000", 0.2)} strokeWidth={6} fill="none" />
                <path d="M -96 84 Q -20 46 84 70 M -78 58 Q -10 30 60 44" stroke={mezclar(c.turbante, "#000000", 0.16)} strokeWidth={4.5} fill="none" strokeLinecap="round" />
                {p.quien === "maestro" || p.quien === "maestro2" ? <path d="M -112 120 Q -140 260 -128 340 L -96 330 Q -104 240 -96 140 Z M 112 120 Q 140 260 128 340 L 96 330 Q 104 240 96 140 Z" fill={c.turbante} stroke={oscurecer(c.turbante, 0.3)} strokeWidth={2.5} /> : null}
              </g>
            ) : null}
            {c.yelmo ? (
              <g>
                <path d="M -110 130 Q -104 60 -30 10 L 0 -46 L 30 10 Q 104 60 110 130 Q 0 104 -110 130 Z" fill={c.yelmo} stroke={oscurecer(c.yelmo, 0.4)} strokeWidth={3} strokeLinejoin="round" />
                <path d="M 0 -46 L 30 10 Q 104 60 110 130 Q 60 112 20 110 Q 30 40 0 -46 Z" fill={mezclar(c.yelmo, "#000000", 0.15)} />
                <path d="M -70 96 Q -60 50 -22 20" stroke="#FFFFFF" strokeWidth={7} fill="none" opacity={0.4} strokeLinecap="round" />
                <rect x={-112} y={114} width={224} height={18} rx={8} fill={mezclar(c.yelmo, "#000000", 0.3)} />
              </g>
            ) : null}
            {c.diadema && c.turbante ? (
              <g>
                <rect x={-106} y={92} width={212} height={20} rx={8} fill={c.diadema} stroke={mezclar(c.diadema, "#000000", 0.25)} strokeWidth={3} />
                {[-70, -35, 0, 35, 70].map((dx) => (
                  <path key={dx} d={`M ${dx - 12} 94 L ${dx} ${dx === 0 ? 58 : 68} L ${dx + 12} 94 Z`} fill={c.diadema} stroke={mezclar(c.diadema ?? "#E3B04B", "#000000", 0.25)} strokeWidth={2} />
                ))}
                <circle cx={0} cy={102} r={6} fill="#B0281E" />
              </g>
            ) : null}
            {!esJesus && !c.turbante && !c.velo && !c.casco && !c.yelmo && !c.rebelde ? (
              <g>
                <path d="M -102 140 Q -110 40 -20 34 Q 104 30 102 140 Q 90 90 50 80 Q 0 92 -50 80 Q -90 96 -102 140 Z" fill={c.pelo} stroke={bordePelo} strokeWidth={3} strokeLinejoin="round" />
                <path d="M -74 64 Q -36 44 14 46" stroke={aclarar(c.pelo, 0.22)} strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.65} />
              </g>
            ) : null}
            {p.corta && c.turbante === undefined && p.quien === "obrero2" ? <rect x={-104} y={92} width={208} height={18} rx={9} fill="#8A3A2A" /> : null}
            <g transform={`translate(${giro} 0)`}>
              {/* sombra de la mejilla (volumen de la cara) */}
              <path d={`M 62 96 Q 96 150 70 222 Q 52 250 30 256 Q 66 214 64 160 Q 64 120 62 96 Z`} fill={c.pielSombra} opacity={0.35} />
              {/* barba */}
              {c.barba === "corta" || esJesus ? (
                <g opacity={esJesus ? Math.max(0, (edad - 0.35) / 0.65) : 1}>
                  <path d="M -92 176 Q -92 286 0 300 Q 92 286 92 176 Q 80 230 40 236 Q 0 222 -40 236 Q -80 230 -92 176 Z" fill={c.pelo} stroke={bordePelo} strokeWidth={2.5} strokeLinejoin="round" />
                  <path d="M -50 256 Q -44 272 -34 284 M -8 262 Q -6 280 0 292 M 36 258 Q 36 274 28 286" stroke={aclarar(c.pelo, 0.2)} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.6} />
                </g>
              ) : null}
              {c.barba === "larga" || c.barba === "canosa" ? (
                <g>
                  <path
                    d={`M -94 170 Q -100 ${c.barba === "larga" ? 360 : 300} 0 ${c.barba === "larga" ? 390 : 318} Q 100 ${c.barba === "larga" ? 360 : 300} 94 170 Q 80 228 40 234 Q 0 222 -40 234 Q -80 228 -94 170 Z`}
                    fill={colorBarba}
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth={2.5}
                    strokeLinejoin="round"
                  />
                  <path
                    d={`M -52 262 Q -48 ${c.barba === "larga" ? 320 : 286} -30 ${c.barba === "larga" ? 360 : 300} M -6 262 Q -8 ${c.barba === "larga" ? 330 : 290} 0 ${c.barba === "larga" ? 374 : 308} M 40 260 Q 44 ${c.barba === "larga" ? 316 : 284} 30 ${c.barba === "larga" ? 356 : 298}`}
                    stroke="#000"
                    strokeWidth={4}
                    fill="none"
                    strokeLinecap="round"
                    opacity={0.16}
                  />
                </g>
              ) : null}
              {/* mejillas */}
              <ellipse cx={-56} cy={192} rx={20} ry={11} fill="#D9765E" opacity={0.28} />
              <ellipse cx={56} cy={192} rx={20} ry={11} fill="#D9765E" opacity={0.28} />
              <Ojo x={-38} apertura={Math.min(parpadeo, p.ojos ?? 1)} mirada={mir} piel={c.piel} />
              <Ojo x={38} apertura={Math.min(parpadeo, p.ojos ?? 1)} mirada={mir} piel={c.piel} />
              {/* cejas (más gruesas hacia el centro) */}
              <g transform={`translate(-40 ${118 + cejaY}) rotate(${cejaRot})`}>
                {c.velo ? <path d="M -22 4 Q 0 -6 22 2" stroke={mezclar(c.pelo, c.piel, 0.3)} strokeWidth={7} strokeLinecap="round" fill="none" /> : <path d="M -25 5 Q -6 -11 24 -5 Q 27 0 23 6 Q -4 -1 -22 9 Q -27 9 -25 5 Z" fill={colorCeja} />}
              </g>
              <g transform={`translate(40 ${118 + cejaY - (p.cejaUna ?? 0)}) rotate(${-cejaRot - (p.cejaUna ?? 0) * 0.5})`}>
                {c.velo ? <path d="M -22 4 Q 0 -6 22 2" stroke={mezclar(c.pelo, c.piel, 0.3)} strokeWidth={7} strokeLinecap="round" fill="none" /> : <path d="M 25 5 Q 6 -11 -24 -5 Q -27 0 -23 6 Q 4 -1 22 9 Q 27 9 25 5 Z" fill={colorCeja} />}
              </g>
              {c.solideo ? <path d="M -74 50 Q 0 -8 74 50 Q 0 32 -74 50 Z" fill={c.solideo} stroke="#D9D3C6" strokeWidth={3} /> : null}
              {c.anteojos ? (
                <g fill="none" stroke="#5A3E2A" strokeWidth={5}>
                  <circle cx={-38} cy={150} r={30} />
                  <circle cx={38} cy={150} r={30} />
                  <path d="M -8 148 Q 0 140 8 148" />
                </g>
              ) : null}
              {/* nariz (apunta hacia donde mira el personaje) */}
              <g transform={giro < -3 ? "scale(-1 1)" : undefined}>
                <path d="M 4 150 Q -6 190 -2 198 Q 8 206 18 196 Q 14 180 4 150 Z" fill={c.pielSombra} opacity={0.3} />
                <path d="M 2 156 Q -8 192 -2 198 Q 6 202 14 196" stroke={bordePiel} strokeWidth={4.5} fill="none" strokeLinecap="round" />
              </g>
              {/* boca */}
              <g transform="translate(0 226)">
                {boca.apertura > 0.05 ? (
                  <g>
                    <ellipse cx={0} cy={4} rx={16} ry={4 + boca.apertura * 13} fill="#4E1C1C" />
                    {boca.apertura > 0.3 ? <path d={`M -12 ${1 - boca.apertura * 5} Q 0 ${5 - boca.apertura * 4} 12 ${1 - boca.apertura * 5} L 11 ${-3 - boca.apertura * 5} L -11 ${-3 - boca.apertura * 5} Z`} fill="#F4EEE4" /> : null}
                    {boca.apertura > 0.45 ? <ellipse cx={0} cy={8 + boca.apertura * 8} rx={9} ry={4 + boca.apertura * 3} fill="#B8554E" /> : null}
                  </g>
                ) : null}
                <path d={`M -18 0 Q 0 ${boca.curva} 18 0`} stroke="#4E1C1C" strokeWidth={5} fill="none" strokeLinecap="round" />
                {boca.apertura > 0.05 || c.barba === "larga" ? null : <path d={`M -9 ${10 + Math.max(0, boca.curva) * 0.5} Q 0 ${15 + Math.max(0, boca.curva) * 0.5} 9 ${10 + Math.max(0, boca.curva) * 0.5}`} stroke={c.pielSombra} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} />}
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};
