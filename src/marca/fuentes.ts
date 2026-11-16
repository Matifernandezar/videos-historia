// Fuentes locales (Inter, licencia SIL OFL 1.1, subconjunto latino).
// Se empaquetan con el proyecto: el render no depende de internet para la tipografía.
import { loadFont } from "@remotion/fonts";
import { continueRender, delayRender } from "remotion";
import interDisplayBlack from "./fuentes/InterDisplay-Black.woff";
import interDisplayExtraBold from "./fuentes/InterDisplay-ExtraBold.woff";
import interBold from "./fuentes/Inter-Bold.woff";
import interSemiBold from "./fuentes/Inter-SemiBold.woff";
import dejavuSansBold from "./fuentes/DejaVuSans-Bold.ttf";
import dejavuSerifBold from "./fuentes/DejaVuSerif-Bold.ttf";

export const FUENTE_TITULO = "Inter Display";
export const FUENTE_TEXTO = "Inter";
// DejaVu (licencia libre, ver fuentes/LICENCIA-DejaVu.txt): hebreo y títulos con serifa ("pergamino").
export const FUENTE_HEBREO = "DejaVu Sans";
export const FUENTE_SERIFA = "DejaVu Serif";

const espera = delayRender("Cargando tipografías del canal");

Promise.all([
  loadFont({ family: FUENTE_TITULO, url: interDisplayBlack, weight: "900" }),
  loadFont({ family: FUENTE_TITULO, url: interDisplayExtraBold, weight: "800" }),
  loadFont({ family: FUENTE_TEXTO, url: interBold, weight: "700" }),
  loadFont({ family: FUENTE_TEXTO, url: interSemiBold, weight: "600" }),
  loadFont({ family: FUENTE_HEBREO, url: dejavuSansBold, weight: "700" }),
  loadFont({ family: FUENTE_SERIFA, url: dejavuSerifBold, weight: "700" }),
])
  .then(() => continueRender(espera))
  .catch((err) => {
    console.error("No se pudieron cargar las fuentes", err);
    continueRender(espera);
  });
