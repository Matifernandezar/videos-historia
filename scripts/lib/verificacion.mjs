// Revisión automática antes de renderizar: estructura, legibilidad, márgenes de texto,
// sincronía con la voz, citas bíblicas/fuentes y lenguaje. Devuelve errores (bloquean) y avisos.
import fs from "node:fs";
import path from "node:path";
import { RAIZ, contarPalabras, estadoNarracion, leerJSON, normalizar } from "./comun.mjs";

const TIPOS = ["gancho", "explicacion", "comparacion", "matiz", "cierre", "animada"];
const EVIDENCIA = ["demostrado", "moderado", "limitado", "insuficiente"];
const ACENTOS = ["lima", "coral", "ambar", "celeste", "turquesa", "violeta"];
const POSES = ["neutral", "explica", "senala", "saluda", "celebra", "encoge", "sorprendida", "preocupada", "pulgar"];
const EXPRESIONES = ["feliz", "sorprendida", "pensativa", "preocupada", "seria"];

// Expresiones que suelen implicar promesas que el canal no hace (prosperidad, sanidad garantizada, etc.).
const FRASES_RIESGO = [
  "garantiza", "garantizado", "garantizada", "100%", "nunca falla", "te vas a sanar", "sanidad garantizada",
  "deja la medicacion", "dejar la medicacion", "no vayas al medico", "dios te va a hacer rico", "siembra tu ofrenda",
  "pacto de prosperidad", "si no compartis", "si no compartes",
];

const sinMarcas = (s) => String(s ?? "").replace(/\*/g, "");

export const verificarProduccion = (rutas, video, canal, opciones = {}) => {
  const errores = [];
  const avisos = [];
  const info = [];
  const E = (m) => errores.push(m);
  const A = (m) => avisos.push(m);

  const catalogo = leerJSON(path.join(RAIZ, "src", "ilustraciones", "catalogo.json"));
  const ilustracionOk = (n, donde) => {
    if (!n) return;
    if (!catalogo[n]) E(`${donde}: la ilustración "${n}" no existe en el catálogo (src/ilustraciones/catalogo.json).`);
  };

  // ---- Estructura ----
  if (!video.id) E("video.json: falta `id`.");
  if (!["short", "largo"].includes(video.formato)) E('video.json: `formato` debe ser "short" o "largo".');
  if (!Array.isArray(video.escenas) || video.escenas.length === 0) {
    E("video.json: no hay escenas.");
    return { errores, avisos, info };
  }
  const ids = new Set();
  video.escenas.forEach((e, i) => {
    const donde = `Escena ${i + 1} (${e.id ?? "sin id"})`;
    if (!e.id) E(`${donde}: falta id.`);
    else if (ids.has(e.id)) E(`${donde}: id repetido.`);
    ids.add(e.id);
    if (!TIPOS.includes(e.tipo)) E(`${donde}: tipo "${e.tipo}" no válido (${TIPOS.join(", ")}).`);
    if (!String(e.narracion ?? "").trim()) E(`${donde}: falta la narración.`);
    if (e.personaje?.pose && !POSES.includes(e.personaje.pose)) E(`${donde}: pose "${e.personaje.pose}" no existe (${POSES.join(", ")}).`);
    if (e.personaje?.expresion && !EXPRESIONES.includes(e.personaje.expresion)) E(`${donde}: expresión "${e.personaje.expresion}" no existe.`);
    if (e.acento && !ACENTOS.includes(e.acento)) E(`${donde}: acento "${e.acento}" no existe (${ACENTOS.join(", ")}).`);

    const narr = normalizar(e.narracion ?? "");
    const disparadorOk = (d, que) => {
      if (d?.entraEn && !narr.includes(normalizar(d.entraEn).split(" ")[0])) {
        A(`${donde}: ${que} usa entraEn "${d.entraEn}" pero esa palabra no está en la narración de la escena (aparecerá por fracción).`);
      }
    };

    if (e.tipo === "gancho") {
      if (!e.titulo) E(`${donde}: el gancho necesita \`titulo\`.`);
      const largo = sinMarcas(e.titulo).length;
      if (largo > 48) A(`${donde}: título de ${largo} caracteres; ideal ≤ 40 para leerse de un vistazo.`);
      if (!/\*[^*]+\*/.test(e.titulo ?? "")) A(`${donde}: el título no tiene *palabra destacada*.`);
      ilustracionOk(e.ilustracion, donde);
      if (contarPalabras(e.narracion ?? "") > 22) A(`${donde}: el gancho dura mucho (${contarPalabras(e.narracion)} palabras); ideal ≤ 16 (≈ 3–5 s).`);
    }
    if (e.tipo === "explicacion") {
      if (!Array.isArray(e.pasos) || e.pasos.length < 1 || e.pasos.length > 4) E(`${donde}: \`pasos\` debe tener entre 1 y 4 elementos.`);
      (e.pasos ?? []).forEach((p, j) => {
        ilustracionOk(p.ilustracion, `${donde} paso ${j + 1}`);
        if (p.etiqueta && p.etiqueta.length > 16) A(`${donde} paso ${j + 1}: etiqueta "${p.etiqueta}" larga (>16); puede quedar apretada.`);
        disparadorOk(p, `paso ${j + 1}`);
      });
      if (e.titulo && sinMarcas(e.titulo).length > 30) A(`${donde}: título de escena largo (>30).`);
    }
    if (e.tipo === "comparacion") {
      for (const lado of ["izquierda", "derecha"]) {
        const L = e[lado];
        if (!L?.etiqueta || !L?.ilustracion) E(`${donde}: \`${lado}\` necesita etiqueta e ilustración.`);
        else {
          ilustracionOk(L.ilustracion, `${donde} ${lado}`);
          if (L.etiqueta.length > 14) A(`${donde} ${lado}: etiqueta larga (>14) para media pantalla.`);
          if (L.nota && L.nota.length > 40) A(`${donde} ${lado}: nota larga (>40).`);
          disparadorOk(L, lado);
        }
      }
    }
    if (e.tipo === "matiz") {
      if (!e.texto) E(`${donde}: falta \`texto\`.`);
      if (e.evidencia !== undefined && !EVIDENCIA.includes(e.evidencia)) E(`${donde}: \`evidencia\` debe ser ${EVIDENCIA.join(" | ")}.`);
      if (sinMarcas(e.texto).length > 120) A(`${donde}: texto del matiz largo (>120).`);
      if (!e.referencia && !e.fuente) A(`${donde}: conviene mostrar la cita bíblica en pantalla (campo \`referencia\`, ej. "Juan 3:16").`);
    }
    if (e.tipo === "animada" && !e.componente) E(`${donde}: falta \`componente\` (escena animada a medida).`);
    if (e.tipo === "cierre") {
      if (!e.texto) E(`${donde}: falta \`texto\`.`);
      if (sinMarcas(e.texto).length > 50) A(`${donde}: conclusión larga (>50).`);
    }

    // Lenguaje (promesas que el canal no hace)
    const todo = ` ${normalizar([e.narracion, e.titulo, e.texto, e.dato].filter(Boolean).join(" "))} `;
    for (const f of FRASES_RIESGO) {
      if (todo.includes(` ${normalizar(f)} `)) A(`${donde}: revisar la expresión "${f}" (posible promesa que el canal no hace).`);
    }
    for (const pal of String(e.narracion ?? "").split(/\s+/)) {
      if (pal.replace(/[^\p{L}\p{N}]/gu, "").length > 18) A(`${donde}: palabra muy larga para subtítulo: "${pal}".`);
    }
  });
  if (video.escenas[0]?.tipo !== "gancho") A("La primera escena no es un gancho.");
  if (video.escenas[video.escenas.length - 1]?.tipo !== "cierre") A("La última escena no es un cierre.");

  // ---- Duración y ritmo ----
  const f = canal.formatos[video.formato === "largo" ? "largo" : "short"];
  const narracion = estadoNarracion(rutas, video, canal);
  const palabras = contarPalabras(narracion.texto);
  const [pmin, pmax] = f.palabrasObjetivo;
  if (palabras < pmin * 0.85) A(`Narración corta: ${palabras} palabras (objetivo ${pmin}–${pmax}).`);
  if (palabras > pmax * 1.1) A(`Narración larga: ${palabras} palabras (objetivo ${pmin}–${pmax}).`);
  info.push(`Narración: ${palabras} palabras, ≈ ${Math.round(palabras / 2.6)} s estimados.`);

  // ---- Voz ----
  if (narracion.estado === "sin-voz") A("Todavía no hay voz elegida (config/canal.json → voz.voiceId).");
  if (narracion.estado === "desactualizada" && !opciones.sinAudio) {
    E("La narración guardada no coincide con el texto actual (cambió el guion, la voz o el modelo). Hay que regenerarla o volver al texto anterior.");
  }
  if (narracion.estado === "pendiente-descarga") A("Hay una narración pendiente de descarga (narracion.pendiente.json). Se descarga al producir.");
  if (narracion.estado === "falta" && !opciones.sinAudio) A("No hay narración: el render saldría mudo con tiempos estimados.");

  const sinc = leerJSON(rutas.sincronia, null);
  if (narracion.estado === "vigente") {
    const dur = narracion.meta?.duracionSeg;
    if (dur) {
      info.push(`Voz real: ${dur.toFixed(1)} s.`);
      if (dur > f.duracionMaximaSeg) A(`La voz dura ${dur.toFixed(1)} s (máximo pensado ${f.duracionMaximaSeg} s).`);
      const ritmo = palabras / dur;
      if (ritmo > 3.3) A(`Ritmo rápido: ${ritmo.toFixed(2)} palabras/s (cómodo: 2,3–3,0).`);
      if (ritmo < 2.0) A(`Ritmo lento: ${ritmo.toFixed(2)} palabras/s.`);
    }
    if (!sinc) E("Falta recursos/sincronia.json: corré `npm run sincronizar -- <video>` (necesita palabras.json).");
    else if (sinc.hash !== narracion.hash) E("sincronia.json corresponde a otra narración: volvé a sincronizar.");
  }
  if (sinc) {
    if (sinc.escenas?.length !== video.escenas.length) E("sincronia.json no tiene la misma cantidad de escenas que video.json: volvé a sincronizar.");
    if (sinc.metodo === "estimado") A("La sincronía es ESTIMADA (sin tiempos reales por palabra). Conviene transcribir la voz para subtítulos exactos.");
    if (sinc.calidad && sinc.calidad.cobertura < 85) A(`Sincronía con baja coincidencia (${sinc.calidad.cobertura}%): revisar que la voz diga el texto del guion.`);
    (sinc.escenas ?? []).forEach((s, i) => {
      if (s.finSeg - s.inicioSeg < 1.2) A(`Escena ${i + 1} (${s.id}) dura ${(s.finSeg - s.inicioSeg).toFixed(1)} s: muy corta para leerse.`);
    });
  }

  // ---- Documentos ----
  const leer = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null);
  const fuentes = leer(rutas.fuentes);
  const esPrueba = String(video.id ?? "").startsWith("0000") || opciones.esPrueba;
  if (!esPrueba) {
    if (!fuentes) E("Falta fuentes.md.");
    else {
      if (!/https?:\/\//.test(fuentes)) A("fuentes.md no tiene ningún enlace (conviene enlazar cada pasaje).");
      if (/PENDIENTE/.test(fuentes)) E("fuentes.md todavía tiene marcadores PENDIENTE.");
      const idsFuentes = new Set([...fuentes.matchAll(/\[([BF]\d+)\]/g)].map((m) => m[1]));
      const guion = leer(rutas.guion) ?? "";
      const citas = new Set([...guion.matchAll(/\[([BF]\d+)\]/g)].map((m) => m[1]));
      if (citas.size === 0) A("guion.md no cita pasajes ni fuentes con marcas [B1], [F1]…");
      for (const c of citas) if (!idsFuentes.has(c)) E(`guion.md cita ${c} pero no está en fuentes.md.`);
    }
    const yt = leer(rutas.youtube);
    if (!yt) E("Falta youtube.md (título y descripción).");
    else {
      const t = yt.match(/^##\s*T[ií]tulo\s*\n+([^\n]+)/im);
      if (!t) A("youtube.md: no encontré la sección '## Título'.");
      else if (t[1].trim().length > 100) E(`youtube.md: el título tiene ${t[1].trim().length} caracteres (YouTube admite 100).`);
      if (!/pasajes|fuentes|referencias/i.test(yt)) A("youtube.md: la descripción no lista los pasajes bíblicos.");
      if (/PENDIENTE/.test(yt)) E("youtube.md todavía tiene marcadores PENDIENTE.");
    }
  }

  return { errores, avisos, info, narracion };
};

export const imprimirVerificacion = (r, titulo) => {
  console.log(`\n=== Verificación: ${titulo} ===`);
  r.info.forEach((m) => console.log(`  · ${m}`));
  if (!r.errores.length && !r.avisos.length) console.log("  ✔ Todo en orden.");
  r.avisos.forEach((m) => console.log(`  ⚠ ${m}`));
  r.errores.forEach((m) => console.log(`  ✖ ${m}`));
  console.log(r.errores.length ? `\n  ${r.errores.length} error(es) bloquean el render.\n` : "\n  Sin errores bloqueantes.\n");
};
