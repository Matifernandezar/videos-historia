import React from "react";
import type { Escena } from "../video/tipos";
import { Gancho } from "./Gancho";
import { Explicacion } from "./Explicacion";
import { Comparacion } from "./Comparacion";
import { Matiz } from "./Matiz";
import { Cierre } from "./Cierre";
import { EscenaEspecial } from "../especiales";

export { Gancho, Explicacion, Comparacion, Matiz, Cierre };

export { personajeVisible } from "./visibilidad";

// Elige el componente según `tipo`. Para un tipo nuevo: crear el componente y sumarlo acá y en tipos.ts.
export const EscenaPorTipo: React.FC<{ escena: Escena }> = ({ escena }) => {
  switch (escena.tipo) {
    case "gancho":
      return <Gancho escena={escena} />;
    case "explicacion":
      return <Explicacion escena={escena} />;
    case "comparacion":
      return <Comparacion escena={escena} />;
    case "matiz":
      return <Matiz escena={escena} />;
    case "cierre":
      return <Cierre escena={escena} />;
    case "animada":
      return <EscenaEspecial escena={escena} />;
    default:
      return null;
  }
};
