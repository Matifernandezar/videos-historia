import type { Escena } from "../video/tipos";
// ¿La escena muestra a Lupe en primer plano? (define dónde van los subtítulos)
export const personajeVisible = (e: Escena): boolean => {
  if (e.personaje?.oculto) return false;
  switch (e.tipo) {
    case "explicacion":
      return e.personaje ? true : e.pasos.length <= 2;
    case "comparacion":
      return false;
    case "animada":
      return e.subtitulos === "medio";
    default:
      return true;
  }
};
