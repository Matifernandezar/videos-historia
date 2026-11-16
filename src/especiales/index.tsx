// Escenas animadas a medida. Cada video especial registra sus escenas acá con una clave "video/escena".
import React from "react";
import type { EscenaAnimada } from "../video/tipos";
import { ESCENAS_JESUS_12_30 } from "./jesus-12-30/escenas";
import { ESCENAS_AMEN } from "./amen/escenas";
import { ESCENAS_MISA } from "./misa/escenas";
import { ESCENAS_ROSARIO } from "./rosario/escenas";
import { ESCENAS_FATIMA } from "./fatima/escenas";
import { ESCENAS_SENAQUERIB } from "./senaquerib/escenas";
import { ESCENAS_CIZANA } from "./cizana/escenas";
import { ESCENAS_POSTURAS } from "./posturas/escenas";
import { ESCENAS_MANILA } from "./manila/escenas";
import { ESCENAS_REGRESO } from "./regreso/escenas";
import { ESCENAS_PEDRO } from "./pedro/escenas";
import { ESCENAS_REPARTO_AFRICA } from "./reparto-africa/escenas";

const REGISTRO: Record<string, React.FC<{ escena: EscenaAnimada }>> = {
  ...ESCENAS_JESUS_12_30,
  ...ESCENAS_AMEN,
  ...ESCENAS_MISA,
  ...ESCENAS_ROSARIO,
  ...ESCENAS_FATIMA,
  ...ESCENAS_SENAQUERIB,
  ...ESCENAS_CIZANA,
  ...ESCENAS_POSTURAS,
  ...ESCENAS_MANILA,
  ...ESCENAS_REGRESO,
  ...ESCENAS_PEDRO,
  ...ESCENAS_REPARTO_AFRICA,
};

export const EscenaEspecial: React.FC<{ escena: EscenaAnimada }> = ({ escena }) => {
  const C = REGISTRO[escena.componente];
  if (!C) {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5E5B", fontSize: 60, fontWeight: 800 }}>
        falta escena: {escena.componente}
      </div>
    );
  }
  return <C escena={escena} />;
};
