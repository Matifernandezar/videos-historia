// Alinea las palabras del guion con los tiempos reales de la voz.
// Entrada: palabras con tiempos (transcripción de ElevenLabs o alineación de la API).
// Salida: tiempos de cada escena + subtítulos con el texto EXACTO del guion.
import { normalizar } from "./comun.mjs";

// Acepta: [{texto|text|word, inicio|start, fin|end, type?}] o {characters, character_start_times_seconds, ...}
export const normalizarPalabrasVoz = (crudo) => {
  if (crudo && Array.isArray(crudo.characters)) {
    const c = crudo.characters;
    const ini = crudo.character_start_times_seconds;
    const fin = crudo.character_end_times_seconds;
    const salida = [];
    let actual = null;
    for (let i = 0; i < c.length; i++) {
      if (/\s/.test(c[i])) {
        if (actual) salida.push(actual);
        actual = null;
        continue;
      }
      if (!actual) actual = { texto: "", inicio: ini[i], fin: fin[i] };
      actual.texto += c[i];
      actual.fin = fin[i];
    }
    if (actual) salida.push(actual);
    return salida;
  }
  const lista = Array.isArray(crudo) ? crudo : Array.isArray(crudo?.words) ? crudo.words : Array.isArray(crudo?.palabras) ? crudo.palabras : [];
  return lista
    .filter((w) => !w.type || w.type === "word")
    .map((w) => ({
      texto: String(w.texto ?? w.text ?? w.word ?? "").trim(),
      inicio: Number(w.inicio ?? w.start ?? w.startSeg ?? 0),
      fin: Number(w.fin ?? w.end ?? w.endSeg ?? 0),
    }))
    .filter((w) => w.texto && Number.isFinite(w.inicio) && Number.isFinite(w.fin));
};

const levenshtein = (a, b) => {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
};

const parecidas = (a, b) => {
  if (!a || !b) return false;
  if (a === b) return true;
  const d = levenshtein(a, b);
  return d / Math.max(a.length, b.length) <= 0.34;
};

// Alineación global (programación dinámica) entre tokens del guion y de la voz.
const alinearSecuencias = (guion, voz) => {
  const n = guion.length;
  const m = voz.length;
  const HUECO = 1;
  const costo = Array.from({ length: n + 1 }, () => new Float64Array(m + 1));
  const paso = Array.from({ length: n + 1 }, () => new Uint8Array(m + 1)); // 1 diag, 2 arriba, 3 izq
  for (let i = 1; i <= n; i++) {
    costo[i][0] = i * HUECO;
    paso[i][0] = 2;
  }
  for (let j = 1; j <= m; j++) {
    costo[0][j] = j * HUECO;
    paso[0][j] = 3;
  }
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const sub = parecidas(guion[i - 1], voz[j - 1]) ? 0 : 1.2;
      const d = costo[i - 1][j - 1] + sub;
      const u = costo[i - 1][j] + HUECO;
      const l = costo[i][j - 1] + HUECO;
      if (d <= u && d <= l) {
        costo[i][j] = d;
        paso[i][j] = 1;
      } else if (u <= l) {
        costo[i][j] = u;
        paso[i][j] = 2;
      } else {
        costo[i][j] = l;
        paso[i][j] = 3;
      }
    }
  }
  const pareja = new Array(n).fill(-1);
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    const p = paso[i][j];
    if (p === 1) {
      pareja[i - 1] = j - 1;
      i--;
      j--;
    } else if (p === 2) i--;
    else j--;
  }
  return pareja;
};

export const sincronizar = ({ escenas, palabrasVoz, duracionSeg }) => {
  // Tokens del guion: cada palabra visible, con la escena a la que pertenece.
  const tokens = [];
  escenas.forEach((e, ie) => {
    String(e.narracion ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .forEach((p) => tokens.push({ texto: p, norm: normalizar(p), escena: ie }));
  });
  const voz = palabrasVoz.map((w) => ({ ...w, norm: normalizar(w.texto) }));
  const pareja = alinearSecuencias(
    tokens.map((t) => t.norm),
    voz.map((w) => w.norm),
  );
  const coincidencias = pareja.filter((p) => p >= 0).length;
  const exactas = pareja.filter((p, i) => p >= 0 && parecidas(tokens[i].norm, voz[p].norm)).length;

  // Tiempos por token (interpolando los que no tienen pareja).
  const tiempos = tokens.map((_, i) => (pareja[i] >= 0 ? { inicio: voz[pareja[i]].inicio, fin: voz[pareja[i]].fin, ok: true } : null));
  const finAudio = duracionSeg ?? (voz.length ? voz[voz.length - 1].fin + 0.3 : 0);
  for (let i = 0; i < tiempos.length; i++) {
    if (tiempos[i]) continue;
    let a = i - 1;
    while (a >= 0 && !tiempos[a]) a--;
    let b = i + 1;
    while (b < tiempos.length && !tiempos[b]) b++;
    const desde = a >= 0 ? tiempos[a].fin : 0;
    const hasta = b < tiempos.length ? tiempos[b].inicio : finAudio;
    const huecos = b - a - 1;
    const k = i - a - 1;
    const ancho = Math.max(0.05, (hasta - desde) / Math.max(1, huecos));
    tiempos[i] = { inicio: desde + k * ancho, fin: desde + (k + 1) * ancho, ok: false };
  }

  // Monotonía (por si la voz repitió o se saltó algo).
  for (let i = 1; i < tiempos.length; i++) {
    if (tiempos[i].inicio < tiempos[i - 1].inicio) tiempos[i].inicio = tiempos[i - 1].inicio;
    if (tiempos[i].fin < tiempos[i].inicio) tiempos[i].fin = tiempos[i].inicio + 0.05;
  }

  const subtitulos = tokens.map((t, i) => ({
    text: (i === 0 ? "" : " ") + t.texto,
    startMs: Math.round(tiempos[i].inicio * 1000),
    endMs: Math.round(tiempos[i].fin * 1000),
    timestampMs: Math.round(((tiempos[i].inicio + tiempos[i].fin) / 2) * 1000),
    confidence: tiempos[i].ok ? 1 : null,
  }));

  const escenasT = escenas.map((e, ie) => {
    const idx = tokens.findIndex((t) => t.escena === ie);
    const ultimo = tokens.map((t) => t.escena).lastIndexOf(ie);
    return {
      id: e.id,
      inicioSeg: idx >= 0 ? Math.max(0, tiempos[idx].inicio - 0.12) : 0,
      finSeg: ultimo >= 0 ? tiempos[ultimo].fin : 0,
    };
  });
  escenasT[0].inicioSeg = 0;
  for (let i = 1; i < escenasT.length; i++) {
    // la escena empieza en su primera palabra, pero nunca antes de que termine la anterior
    escenasT[i].inicioSeg = Math.max(escenasT[i].inicioSeg, escenasT[i - 1].finSeg - 0.05);
  }

  const ultimaPalabra = tiempos.length ? tiempos[tiempos.length - 1].fin : 0;
  const duracionFinal = Math.max(finAudio, ultimaPalabra + 0.1);
  return {
    duracionSeg: Math.round(duracionFinal * 1000) / 1000,
    escenas: escenasT.map((e) => ({ ...e, inicioSeg: Math.round(e.inicioSeg * 1000) / 1000, finSeg: Math.round(e.finSeg * 1000) / 1000 })),
    subtitulos,
    calidad: {
      palabrasGuion: tokens.length,
      palabrasVoz: voz.length,
      emparejadas: coincidencias,
      parecidas: exactas,
      cobertura: tokens.length ? Math.round((exactas / tokens.length) * 100) : 0,
    },
  };
};

// Sin tiempos de la voz: reparte las palabras según su largo (solo como último recurso).
export const sincronizarEstimado = ({ escenas, duracionSeg }) => {
  const tokens = [];
  escenas.forEach((e, ie) =>
    String(e.narracion ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .forEach((p) => tokens.push({ texto: p, escena: ie })),
  );
  const peso = (p) => p.length + 1 + (/[.!?…]$/.test(p) ? 6 : /[,;:]$/.test(p) ? 3 : 0);
  const total = tokens.reduce((a, t) => a + peso(t.texto), 0) || 1;
  const util = Math.max(0.5, duracionSeg - 0.4);
  let t = 0.15;
  const palabrasVoz = tokens.map((tk) => {
    const d = (util * peso(tk.texto)) / total;
    const w = { texto: tk.texto, inicio: t, fin: t + d * 0.82 };
    t += d;
    return w;
  });
  return sincronizar({ escenas, palabrasVoz, duracionSeg });
};
