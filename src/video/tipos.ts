import type { Caption } from "@remotion/captions";
import type { Acento } from "../marca/tema";
import type { Expresion, Pose } from "../personajes/Lupe";

export type Formato = "short" | "largo";

// `entraEn`: palabra (o frase corta) de la narración de ESA escena que dispara la aparición.
// Si no se encuentra, se usa `entraEnFraccion` (0 a 1 de la escena).
export type Disparador = {
  entraEn?: string;
  entraEnFraccion?: number;
};

export type PersonajeEnEscena = {
  pose?: Pose;
  expresion?: Expresion;
  mirar?: "frente" | "izquierda" | "derecha" | "arriba" | "abajo";
  lado?: "izquierda" | "centro" | "derecha";
  oculto?: boolean;
};

export type Elemento = Disparador & {
  ilustracion: string; // nombre del catálogo (src/ilustraciones/catalogo.json)
  etiqueta?: string;
  acento?: Acento;
};

export type EscenaBase = {
  id: string;
  narracion: string; // texto exacto que se locuta en esta escena
  desfaseInicioSeg?: number; // la imagen de la escena empieza X s DESPUÉS de su primera palabra (p. ej. cierre de 4–6 s)
  personaje?: PersonajeEnEscena;
};

export type EscenaGancho = EscenaBase & {
  tipo: "gancho";
  titulo: string; // admite *palabra* destacada
  acento?: Acento;
  ilustracion?: string;
  dato?: string; // cifra o frase corta grande opcional (ej: "8 vasos?")
};

export type EscenaExplicacion = EscenaBase & {
  tipo: "explicacion";
  titulo?: string;
  acento?: Acento;
  pasos: Elemento[]; // 1 a 4 elementos conectados con flechas
  conectar?: boolean; // dibujar flechas entre pasos (por defecto sí)
  acercarA?: Disparador & { paso: number }; // zoom sobre un paso
};

export type LadoComparacion = Disparador & {
  etiqueta: string;
  ilustracion: string;
  valor?: number; // 0 a 100 para la barra
  textoValor?: string; // lo que se muestra (ej: "≈ 95 mg")
  nota?: string;
  tono?: "positivo" | "alerta" | "neutro";
};

export type EscenaComparacion = EscenaBase & {
  tipo: "comparacion";
  titulo?: string;
  izquierda: LadoComparacion;
  derecha: LadoComparacion;
};

export type NivelEvidencia = "demostrado" | "moderado" | "limitado" | "insuficiente";

export type EscenaMatiz = EscenaBase & {
  tipo: "matiz";
  titulo?: string; // por defecto "PARA PENSAR"
  texto: string; // admite *palabra*
  referencia?: string; // cita bíblica en pantalla (ej: "Juan 3:16")
  evidencia?: NivelEvidencia; // opcional: medidor de certeza (ej. datos históricos o arqueológicos)
  fuente?: string; // crédito breve en pantalla (ej: "Josefo, Antigüedades")
};

export type EscenaCierre = EscenaBase & {
  tipo: "cierre";
  texto: string; // conclusión, admite *palabra*
  cta?: string;
  mostrarAviso?: boolean;
};

// Escena con animación a medida (personajes actuando, esquemas). `componente` = clave en src/especiales.
export type EscenaAnimada = EscenaBase & {
  tipo: "animada";
  componente: string;
  subtitulos?: "abajo" | "medio" | "ocultos";
  lema?: string; // cierre del canal: texto debajo del nombre
};

export type Escena =
  | EscenaAnimada
  | EscenaGancho
  | EscenaExplicacion
  | EscenaComparacion
  | EscenaMatiz
  | EscenaCierre;

export type TipoEscena = Escena["tipo"];

export type Sincronia = {
  hash: string;
  metodo: "transcripcion" | "alineacion-api" | "estimado";
  duracionSeg: number;
  escenas: { id: string; inicioSeg: number; finSeg: number }[];
  subtitulos: Caption[];
};

export type VideoProps = {
  id: string;
  formato: Formato;
  escenas: Escena[];
  sincronia?: Sincronia | null;
  audio?: string | null; // archivo dentro de recursos/ (ej: "narracion.mp3")
  mostrarSubtitulos?: boolean;
  mostrarGuias?: boolean;
  reemplazosSubtitulos?: { de: string; a: string }[]; // ej: "te hache ce" se lee "THC" en pantalla
  pausas?: { enSeg: number; duracionSeg: number }[];
  segmentosAudio?: { desdeSeg: number; hastaSeg: number; enSeg: number }[]; // lo arma construirProps
  musica?: { archivo: string; volumen?: number } | null; // pista instrumental en recursos/ (por debajo de la voz)
  destacarSubtitulos?: string[]; // palabras clave que se pintan en dorado en los subtítulos
};
