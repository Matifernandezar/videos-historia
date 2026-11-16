// Identidad visual del canal. Cambiá acá colores y nombre; todo el sistema los toma de este archivo.
import canal from "../../config/canal.json";

export const MARCA = {
  nombre: canal.nombre,
  usuario: canal.usuario,
  personaje: canal.personaje.nombre,
};

export const COLOR = {
  // Fondos (azul profundo, canal Versículo Oculto)
  fondo: "#0B1426",
  fondoAlto: "#14223F",
  fondoMatiz: "#1B1A33",
  panel: "rgba(255,255,255,0.06)",
  panelFuerte: "rgba(10,18,32,0.78)",
  borde: "rgba(255,255,255,0.14)",
  // Texto
  tinta: "#F7F1E3",
  tintaSuave: "#C9BFA8",
  tintaOscura: "#0A1220",
  // Acentos semánticos
  lima: "#F2C14E", // dato clave / positivo (dorado cálido en Versículo Oculto)
  coral: "#FF5E5B", // mito / alerta
  ambar: "#E8A54B", // matiz / precaución
  celeste: "#4DD4EC", // diagrama / neutro
  turquesa: "#D9C6A0", // marca (pergamino)
  violeta: "#9B8AFB",
  pergamino: "#EAD9B5",
  pergaminoOscuro: "#C8AE7D",
  dorado: "#F2C14E",
} as const;

export type Acento = "lima" | "coral" | "ambar" | "celeste" | "turquesa" | "violeta";

export const colorAcento = (a: Acento | undefined, porDefecto: Acento = "lima"): string =>
  COLOR[a ?? porDefecto];

export const SOMBRA_TEXTO =
  "0 6px 0 rgba(0,0,0,0.35), 0 0 28px rgba(0,0,0,0.55)";

// Zonas seguras. En Shorts la interfaz de YouTube tapa la franja inferior y el lateral derecho.
export const zonas = (ancho: number, alto: number) => {
  const vertical = alto > ancho;
  if (vertical) {
    const k = ancho / 1080;
    return {
      vertical,
      k,
      lateral: Math.round(80 * k),
      lateralDerechoUI: Math.round(150 * k), // botones de me gusta / comentar
      superior: Math.round(170 * k),
      tituloAlto: Math.round(470 * k),
      escenarioArriba: Math.round(640 * k),
      escenarioAbajo: Math.round(1500 * k),
      subtitulosCentroY: Math.round(1330 * k),
      inferiorUI: Math.round(400 * k), // franja con título/canal de YouTube
    };
  }
  const k = alto / 1080;
  return {
    vertical,
    k,
    lateral: Math.round(110 * k),
    lateralDerechoUI: Math.round(110 * k),
    superior: Math.round(80 * k),
    tituloAlto: Math.round(200 * k),
    escenarioArriba: Math.round(260 * k),
    escenarioAbajo: Math.round(860 * k),
    subtitulosCentroY: Math.round(930 * k),
    inferiorUI: Math.round(60 * k),
  };
};

// Tamaños mínimos de texto (escala con el ancho/alto de la composición).
export const TIPO = {
  titulo: 104,
  tituloMin: 84,
  subtitulo: 64,
  etiqueta: 46,
  apoyo: 44,
  nota: 34,
};
