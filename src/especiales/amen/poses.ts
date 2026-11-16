// Poses de brazos del video del amén (ver convenciones en ../jesus-12-30/personas.tsx).
import type { Brazo } from "../jesus-12-30/personas";

type Par = { brazoIzq?: Brazo; brazoDer?: Brazo };
export const POSES: Record<string, Par> = {
  rezar: { brazoIzq: { hombro: 10, codo: -110, mano: "abierta" }, brazoDer: { hombro: 10, codo: -110, mano: "abierta" } },
  pensar: { brazoIzq: { hombro: 8, codo: -95, mano: "puno" }, brazoDer: { hombro: -10, codo: -140, mano: "puno" } },
  abrir: { brazoIzq: { hombro: 8, codo: 36, mano: "abierta" }, brazoDer: { hombro: 8, codo: 36, mano: "abierta" } },
  recibir: { brazoIzq: { hombro: 8, codo: -100, mano: "abierta" }, brazoDer: { hombro: 8, codo: -95, mano: "abierta" } },
  hostia: { brazoDer: { hombro: 25, codo: 95, mano: "puno" }, brazoIzq: { hombro: 8, codo: -60, mano: "abierta" } },
  leer: { brazoIzq: { hombro: 20, codo: -75, mano: "puno" }, brazoDer: { hombro: 20, codo: -75, mano: "puno" } },
  alzar: { brazoIzq: { hombro: 150, codo: 10, mano: "abierta" }, brazoDer: { hombro: 150, codo: 10, mano: "abierta" } },
  gesto: { brazoDer: { hombro: 20, codo: 80, mano: "abierta" }, brazoIzq: { hombro: 10, codo: -20 } },
};
