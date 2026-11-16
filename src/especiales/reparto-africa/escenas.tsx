// "La repartición de África": registro de las escenas del video.
import type React from "react";
import type { EscenaAnimada } from "../../video/tipos";
import { ESCENAS_1 } from "./escenas-1";
import { ESCENAS_2 } from "./escenas-2";

export const ESCENAS_REPARTO_AFRICA: Record<string, React.FC<{ escena: EscenaAnimada }>> = { ...ESCENAS_1, ...ESCENAS_2 };
