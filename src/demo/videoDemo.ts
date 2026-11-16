// Video de demostración del sistema: sirve para ver todos los tipos de escena
// en Studio antes de producir un video real. No es contenido para publicar.
import type { VideoProps } from "../video/tipos";

export const VIDEO_DEMO: VideoProps = {
  id: "demo-sistema",
  formato: "short",
  mostrarSubtitulos: true,
  mostrarGuias: false,
  escenas: [
    {
      id: "gancho",
      tipo: "gancho",
      narracion: "¿Cómo se arma un Short que cuenta una historia de la Biblia con fidelidad?",
      titulo: "¿CÓMO SE ARMA UN *SHORT* BÍBLICO?",
      acento: "lima",
      ilustracion: "lupa",
      personaje: { pose: "sorprendida", expresion: "sorprendida", lado: "derecha" },
    },
    {
      id: "proceso",
      tipo: "explicacion",
      narracion: "Primero se lee el pasaje completo, después se escribe el guion y al final se graba la voz.",
      titulo: "EL *PROCESO*",
      pasos: [
        { ilustracion: "lupa", etiqueta: "Pasaje", entraEn: "pasaje" },
        { ilustracion: "interrogacion", etiqueta: "Guion", entraEn: "guion" },
        { ilustracion: "check", etiqueta: "Voz", entraEn: "voz", acento: "lima" },
      ],
    },
    {
      id: "comparar",
      tipo: "comparacion",
      narracion: "Lo que dice el texto entra. Lo que le agregamos nosotros, no.",
      titulo: "¿ESTÁ EN EL *TEXTO*?",
      izquierda: { etiqueta: "Agregado", ilustracion: "cruz", tono: "alerta", entraEn: "agregamos" },
      derecha: { etiqueta: "En el texto", ilustracion: "check", tono: "positivo", entraEn: "texto" },
    },
    {
      id: "matiz",
      tipo: "matiz",
      narracion: "Y cada idea importante lleva su cita, para que la puedas leer vos mismo.",
      texto: "Cada idea lleva su *cita* para que la leas.",
      referencia: "Hechos 17:11",
    },
    {
      id: "cierre",
      tipo: "cierre",
      narracion: "Pedí una historia y la armamos.",
      texto: "Pedí una *historia* y la armamos",
      cta: "Seguí para más",
    },
  ],
};
