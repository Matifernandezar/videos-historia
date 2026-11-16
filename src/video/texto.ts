// Utilidades de texto compartidas por subtítulos, disparadores y títulos.

export const normalizar = (s: string): string =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ%\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Palabras tal como se muestran (con puntuación pegada), sin las marcas *destacado*.
export const palabrasVisibles = (s: string): string[] =>
  s
    .replace(/\*/g, "")
    .split(/\s+/)
    .map((p) => p.trim())
    .filter(Boolean);

export type Segmento = { texto: string; destacado: boolean };

// "¿POR QUÉ EL CAFÉ TE MANDA AL *BAÑO*?" -> segmentos con destacado
export const parsearDestacado = (s: string): Segmento[] => {
  const partes = s.split("*");
  return partes
    .map((texto, i) => ({ texto, destacado: i % 2 === 1 }))
    .filter((p) => p.texto.length > 0);
};

// Divide en palabras; cada palabra puede tener partes destacadas y no destacadas
// (ej: "*BAÑO*?" -> una sola palabra: "BAÑO" destacado + "?" normal, sin cortar línea).
export type Palabra = { partes: Segmento[]; destacada: boolean };
export const palabrasConDestacado = (s: string): Palabra[] => {
  const salida: Palabra[] = [];
  let actual: Segmento[] = [];
  const cerrar = () => {
    if (actual.length) salida.push({ partes: actual, destacada: actual.some((p) => p.destacado) });
    actual = [];
  };
  for (const seg of parsearDestacado(s)) {
    const trozos = seg.texto.split(/(\s+)/);
    for (const t of trozos) {
      if (!t) continue;
      if (/^\s+$/.test(t)) {
        cerrar();
        continue;
      }
      actual.push({ texto: t, destacado: seg.destacado });
    }
  }
  cerrar();
  return salida;
};
