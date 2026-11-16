// Mismas composiciones que src/Root.tsx, para la vista previa aproximada.
import type React from "react";
import { HojaDePoses } from "../../src/personajes/HojaDePoses";
import { CatalogoIlustraciones } from "../../src/ilustraciones/CatalogoIlustraciones";
import { PruebaRender } from "../../src/pruebas/PruebaRender";
import { VideoCanal, calcularMetadatos } from "../../src/video/VideoCanal";
import { VIDEO_DEMO } from "../../src/demo/videoDemo";

type Def = {
  component: React.FC<any>;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  props?: Record<string, unknown>;
  calcular?: (p: any) => Promise<Record<string, unknown>> | Record<string, unknown>;
};

export const COMPOSICIONES: Record<string, Def> = {
  VideoCanal: {
    component: VideoCanal,
    width: 1080,
    height: 1920,
    fps: 30,
    durationInFrames: 1650,
    props: VIDEO_DEMO as unknown as Record<string, unknown>,
    calcular: (p) => calcularMetadatos({ props: p, defaultProps: p, abortSignal: new AbortController().signal } as never) as Record<string, unknown>,
  },
  PruebaRender: { component: PruebaRender, width: 1080, height: 1920, fps: 30, durationInFrames: 90 },
  "Lupe-Poses": { component: HojaDePoses, width: 1080, height: 1920, fps: 30, durationInFrames: 120 },
  "Catalogo-Ilustraciones": { component: CatalogoIlustraciones, width: 1080, height: 1920, fps: 30, durationInFrames: 120 },
};
