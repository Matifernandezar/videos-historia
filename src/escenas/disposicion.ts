// Disposición de cada escena según el formato (Short vertical 1080×1920 o largo horizontal 1920×1080).
// Todos los componentes de escena toman las posiciones de acá: así se respetan márgenes y zonas de UI.
import { useVideoConfig } from "remotion";

export type Rect = { x0: number; y0: number; x1: number; y1: number };

export const useDisposicion = () => {
  const { width: W, height: H } = useVideoConfig();
  const vertical = H > W;
  if (vertical) {
    const k = W / 1080;
    return {
      vertical,
      W,
      H,
      k,
      lateral: 80 * k,
      titulo: { top: 170 * k, anchoMax: 920 * k, alineacion: "center" as const },
      tamTitulo: 104 * k,
      tamTituloEscena: 84 * k,
      escenario: { x0: 80 * k, y0: 600 * k, x1: 1000 * k, y1: 1040 * k } as Rect,
      escenarioAmplio: { x0: 80 * k, y0: 600 * k, x1: 1000 * k, y1: 1320 * k } as Rect,
      personaje: { alto: 660 * k, base: 1790 * k, x: { izquierda: 300 * k, centro: 540 * k, derecha: 780 * k } },
      subtitulosY: 1430 * k, // escenas sin personaje
      subtitulosYConPersonaje: 1120 * k, // entre el escenario y la cabeza de Lupe
      tamSubtitulo: 66 * k,
      anchoSubtitulo: 900 * k,
    };
  }
  const k = H / 1080;
  return {
    vertical,
    W,
    H,
    k,
    lateral: 110 * k,
    titulo: { top: 80 * k, anchoMax: 1150 * k, alineacion: "left" as const },
    tamTitulo: 96 * k,
    tamTituloEscena: 76 * k,
    escenario: { x0: 110 * k, y0: 270 * k, x1: 1300 * k, y1: 840 * k } as Rect,
    escenarioAmplio: { x0: 110 * k, y0: 270 * k, x1: 1810 * k, y1: 840 * k } as Rect,
    personaje: { alto: 780 * k, base: 1150 * k, x: { izquierda: 330 * k, centro: 960 * k, derecha: 1560 * k } },
    subtitulosY: 960 * k,
    subtitulosYConPersonaje: 960 * k,
    tamSubtitulo: 56 * k,
    anchoSubtitulo: 1400 * k,
  };
};

// Posiciones (centros) para 1 a 4 elementos dentro de un rectángulo.
export const posicionesPasos = (n: number, r: Rect, vertical: boolean): { x: number; y: number; tamano: number }[] => {
  const w = r.x1 - r.x0;
  const h = r.y1 - r.y0;
  const P = (fx: number, fy: number) => ({ x: r.x0 + fx * w, y: r.y0 + fy * h });
  let puntos: { x: number; y: number }[];
  let cols = 1;
  let filas = 1;
  if (n <= 1) puntos = [P(0.5, 0.5)];
  else if (n === 2) {
    puntos = [P(0.24, 0.5), P(0.76, 0.5)];
    cols = 2;
  } else if (n === 3) {
    if (vertical) {
      puntos = [P(0.23, 0.27), P(0.77, 0.27), P(0.5, 0.76)];
      cols = 2;
      filas = 2;
    } else {
      puntos = [P(0.17, 0.5), P(0.5, 0.5), P(0.83, 0.5)];
      cols = 3;
    }
  } else if (vertical) {
    puntos = [P(0.24, 0.26), P(0.76, 0.26), P(0.76, 0.76), P(0.24, 0.76)];
    cols = 2;
    filas = 2;
  } else {
    puntos = [P(0.12, 0.5), P(0.37, 0.5), P(0.63, 0.5), P(0.88, 0.5)];
    cols = 4;
  }
  const tamano = Math.min(w / cols, h / filas) * (n <= 1 ? 0.86 : 0.8);
  return puntos.slice(0, Math.max(1, Math.min(4, n))).map((p) => ({ ...p, tamano }));
};
