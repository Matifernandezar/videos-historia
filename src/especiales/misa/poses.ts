// Poses del video "La Biblia que repetís en misa" (convenciones en ../jesus-12-30/personas.tsx).
import type { Brazo } from "../jesus-12-30/personas";

type Par = { brazoIzq?: Brazo; brazoDer?: Brazo };
export const POSES_MISA: Record<string, Par> = {
  reposo: { brazoIzq: { hombro: 8, codo: -15 }, brazoDer: { hombro: 8, codo: -15 } },
  rezar: { brazoIzq: { hombro: 10, codo: -110, mano: "abierta" }, brazoDer: { hombro: 10, codo: -110, mano: "abierta" } },
  pecho: { brazoIzq: { hombro: 8, codo: -15 }, brazoDer: { hombro: 4, codo: -128, mano: "abierta" } },
  ruega: { brazoIzq: { hombro: 22, codo: 40, mano: "abierta" }, brazoDer: { hombro: 22, codo: 40, mano: "abierta" } },
  senala: { brazoIzq: { hombro: 8, codo: -15 }, brazoDer: { hombro: 105, codo: -8, mano: "senala" } },
  canta: { brazoIzq: { hombro: 10, codo: -90, mano: "abierta" }, brazoDer: { hombro: 10, codo: -90, mano: "abierta" } },
  escucha: { brazoIzq: { hombro: 8, codo: -20 }, brazoDer: { hombro: 12, codo: -40 } },
};
