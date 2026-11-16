// Genera la narración con la API de ElevenLabs (MP3 + tiempos por palabra).
// VERSIÓN PARA VIDEOS LARGOS (reemplaza a scripts/narrar-api.mjs):
//  - Si el guion entra en un pedido (<= voz.maxCaracteresPorPedido, 3500 por defecto) se comporta como la versión original.
//  - Si no, lo parte por escenas en trozos, une los MP3 y desplaza los tiempos de cada trozo: el resultado
//    (narracion.mp3, palabras.json, narracion.meta.json) es el mismo formato de siempre.
//  - Cada trozo se guarda en recursos/.trozos/: si algo falla a mitad de camino, al reintentar no se pagan de nuevo
//    los trozos ya generados, y si se retoca una escena solo se regenera el trozo que la contiene.
//  - Si la API rechaza un trozo por exceso de caracteres, lo vuelve a partir más corto (el pedido rechazado no se cobra).
// - En la nube: la clave es un secreto de red del entorno. En la PC: ELEVENLABS_API_KEY en .env (o .env.txt).
// Reutiliza el audio si el texto/voz/modelo no cambiaron (no gasta créditos).
// Uso: npm run narracion:api -- <video>   (--forzar rehace todo, --simular muestra qué haría, --max=2500 fuerza el tamaño de trozo)
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { PISTA_CLAVE_ELEVENLABS, argumentos, duracionMP3, encabezadosElevenLabs, escribirJSON, estadoNarracion, fallar, hashNarracion, leerCanal, leerJSON, resolverProduccion, rutasVideo, textoNarracion, vozDelVideo } from "./lib/comun.mjs";
import { normalizarPalabrasVoz } from "./lib/alinear.mjs";

const { opciones, sueltos } = argumentos();
let nombre;
try {
  nombre = resolverProduccion(sueltos[0]);
} catch (e) {
  fallar(e.message);
}
const rutas = rutasVideo(nombre);
const video = leerJSON(rutas.video);
const canal = leerCanal();
const voz = vozDelVideo(video, canal);
if (!voz.voiceId) fallar("Falta elegir la voz (config/canal.json → voz.voiceId).");
const modelo = video.voz?.modeloApi ?? canal.voz.modeloApi ?? "eleven_multilingual_v2";
// Si el modelo principal no acepta tiempos por carácter (with-timestamps), se usa este (no se cobra el pedido rechazado).
const alternativo = canal.voz.modeloApiAlternativo ?? "eleven_multilingual_v2";
const texto = textoNarracion(video);
const MAX_INICIAL = Number(opciones.max ?? canal.voz.maxCaracteresPorPedido ?? 3500);
const MAX_MINIMO = 600;
const DIR_TROZOS = path.join(rutas.recursos, ".trozos");

// ---------- Partir el texto ----------
// Último punto donde cortar dentro de la ventana: fin de oración, si no coma/punto y coma, si no espacio.
const ultimoCorte = (ventana) => {
  for (const re of [/[.!?…]["”»')\]]*\s/g, /[,;:]\s/g, /\s/g]) {
    let ult = -1;
    let m;
    while ((m = re.exec(ventana))) ult = m.index + m[0].length;
    if (ult > ventana.length * 0.3) return ult;
  }
  return 0;
};
const partirTexto = (txt, max) => {
  const partes = [];
  let resto = txt.trim();
  while (resto.length > max) {
    const corte = ultimoCorte(resto.slice(0, max + 1)) || max;
    partes.push(resto.slice(0, corte).trim());
    resto = resto.slice(corte).trim();
  }
  if (resto) partes.push(resto);
  return partes;
};
// Agrupa escenas completas hasta `max` caracteres; una escena más larga que `max` se parte por oraciones.
const armarTrozos = (max) => {
  const trozos = [];
  let actual = "";
  for (const esc of video.escenas) {
    const t = String(esc.narracion ?? "").trim();
    if (!t) continue;
    for (const p of t.length > max ? partirTexto(t, max) : [t]) {
      if (actual && actual.length + 1 + p.length > max) {
        trozos.push(actual);
        actual = "";
      }
      actual = actual ? `${actual} ${p}` : p;
    }
  }
  if (actual) trozos.push(actual);
  return trozos;
};

const est = estadoNarracion(rutas, video, canal);
if (est.estado === "vigente" && !opciones.forzar) {
  console.log("✔ La narración guardada coincide con el texto actual: se reutiliza (0 créditos).");
  process.exit(0);
}

const acceso = encabezadosElevenLabs();
if (opciones.simular) {
  const trozos = armarTrozos(MAX_INICIAL);
  console.log(
    JSON.stringify(
      { voiceId: voz.voiceId, modelo, alternativo, hash: hashNarracion(texto, voz.voiceId, modelo), caracteres: texto.length, maxCaracteresPorPedido: MAX_INICIAL, trozos: trozos.map((t) => t.length), clave: acceso?.origen ?? "falta" },
      null,
      2,
    ),
  );
  process.exit(0);
}
if (!acceso) fallar("No hay ELEVENLABS_API_KEY en .env (o .env.txt). Copiá .env.example, renombralo y pegá tu clave.");

// ---------- Pedidos ----------
class LimiteExcedido extends Error {}
let modeloUsado = modelo;
let modeloFijado = false; // se decide con el primer pedido aceptado y vale para todos los trozos
let conContexto = true; // previous_text / next_text (mantienen la entonación entre trozos)
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const pedirUnoApi = (trozos, i) => {
  const cuerpo = { text: trozos[i], model_id: modeloUsado, voice_settings: canal.voz.ajustesApi };
  if (conContexto && trozos.length > 1) {
    if (i > 0) cuerpo.previous_text = trozos[i - 1].slice(-300);
    if (i < trozos.length - 1) cuerpo.next_text = trozos[i + 1].slice(0, 300);
  }
  return fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voz.voiceId}/with-timestamps?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { ...acceso.headers, "Content-Type": "application/json" },
    body: JSON.stringify(cuerpo),
  });
};

const pedirTrozo = async (trozos, i) => {
  let reintentos = 0;
  for (;;) {
    const r = await pedirUnoApi(trozos, i);
    if (r.ok) {
      modeloFijado = true;
      return r.json();
    }
    const detalle = (await r.text()).slice(0, 400);
    if (r.status === 401) fallar(`ElevenLabs respondió 401: ${detalle.slice(0, 150)} ${PISTA_CLAVE_ELEVENLABS}`);
    if (/quota|insufficient|credits/i.test(detalle)) fallar(`ElevenLabs respondió ${r.status} (créditos o cuota): ${detalle.slice(0, 250)}`);
    if (conContexto && trozos.length > 1 && /previous_text|next_text|stitch|previous_request|next_request/i.test(detalle)) {
      console.log(`⚠ ${modeloUsado} no acepta previous_text/next_text; sigo sin contexto entre trozos.`);
      conContexto = false;
      continue;
    }
    if (/character|caracter|too long|too_long|exceed|maximum|max_length|text_length/i.test(detalle)) throw new LimiteExcedido(detalle);
    if (!modeloFijado && modeloUsado !== alternativo && alternativo && /model|timestamp|alignment|not supported|unsupported|invalid/i.test(detalle)) {
      console.log(`⚠ ${modeloUsado} fue rechazado (${r.status}: ${detalle.slice(0, 120)}). Pruebo con ${alternativo}.`);
      modeloUsado = alternativo;
      continue;
    }
    if ((r.status === 429 || r.status >= 500) && reintentos < 2) {
      reintentos++;
      console.log(`⚠ ElevenLabs respondió ${r.status}; reintento ${reintentos}/2 en ${reintentos * 5} s.`);
      await espera(reintentos * 5000);
      continue;
    }
    fallar(`ElevenLabs respondió ${r.status}: ${detalle}${/voice/i.test(detalle) ? " Agregá la voz a 'My Voices' de la cuenta de ElevenLabs." : ""}`);
  }
};

// Clave de caché de un trozo: texto + voz + modelo + ajustes (si cambia cualquiera, se regenera).
const claveTrozo = (t, m) =>
  crypto.createHash("sha256").update(JSON.stringify({ t, v: voz.voiceId, m, a: canal.voz.ajustesApi })).digest("hex").slice(0, 16);
// Busca un trozo ya generado con el modelo principal o con el alternativo (si una corrida anterior cayó a ese).
const trozoGuardado = (t) => {
  for (const m of [...new Set([modeloUsado, alternativo])]) {
    const base = path.join(DIR_TROZOS, claveTrozo(t, m));
    if (fs.existsSync(`${base}.mp3`) && fs.existsSync(`${base}.json`)) return { base, m };
  }
  return null;
};

// Genera (o recupera de recursos/.trozos/) todos los trozos para un tamaño máximo dado.
const generarTodo = async (max) => {
  const trozos = armarTrozos(max);
  const usarCache = trozos.length > 1;
  if (usarCache) fs.mkdirSync(DIR_TROZOS, { recursive: true });
  console.log(`Generando narración (${texto.length} caracteres${trozos.length > 1 ? `, ${trozos.length} trozos de hasta ${max}` : ""}) con ${voz.nombre ?? voz.voiceId} · ${modelo} · clave: ${acceso.origen}…`);
  const salida = [];
  for (let i = 0; i < trozos.length; i++) {
    const previo = usarCache && !opciones.forzar ? trozoGuardado(trozos[i]) : null;
    if (previo) {
      const guardado = leerJSON(`${previo.base}.json`);
      console.log(`  · trozo ${i + 1}/${trozos.length}: reutilizado (0 créditos)`);
      modeloUsado = previo.m;
      modeloFijado = true;
      salida.push({ mp3: `${previo.base}.mp3`, alineacion: guardado.alineacion });
      continue;
    }
    const datos = await pedirTrozo(trozos, i);
    if (!datos.audio_base64) fallar(`La respuesta del trozo ${i + 1} no trae audio.`);
    const base = usarCache ? path.join(DIR_TROZOS, claveTrozo(trozos[i], modeloUsado)) : null;
    const mp3 = base ? `${base}.mp3` : path.join(rutas.recursos, "narracion.mp3");
    fs.mkdirSync(rutas.recursos, { recursive: true });
    fs.writeFileSync(mp3, Buffer.from(datos.audio_base64, "base64"));
    const alineacion = datos.alignment ?? datos.normalized_alignment ?? null;
    if (base) escribirJSON(`${base}.json`, { texto: trozos[i], modelo: modeloUsado, alineacion });
    if (trozos.length > 1) console.log(`  · trozo ${i + 1}/${trozos.length}: generado (${trozos[i].length} caracteres)`);
    salida.push({ mp3, alineacion });
  }
  return salida;
};

let max = MAX_INICIAL;
let trozosOk;
for (;;) {
  try {
    trozosOk = await generarTodo(max);
    break;
  } catch (e) {
    if (!(e instanceof LimiteExcedido)) throw e;
    const nuevo = Math.floor(max * 0.6);
    if (nuevo < MAX_MINIMO) fallar(`ElevenLabs rechaza el texto por exceso de caracteres incluso con trozos de ${max}: ${e.message.slice(0, 250)}`);
    console.log(`⚠ La API rechazó un trozo por exceso de caracteres (${e.message.slice(0, 120)}). Vuelvo a partir en trozos de hasta ${nuevo}.`);
    max = nuevo;
  }
}

// ---------- Unir ----------
const hash = hashNarracion(texto, voz.voiceId, modeloUsado);
fs.mkdirSync(rutas.recursos, { recursive: true });
const duraciones = trozosOk.map((t) => duracionMP3(t.mp3));
if (trozosOk.length === 1) {
  if (trozosOk[0].mp3 !== rutas.audio) fs.copyFileSync(trozosOk[0].mp3, rutas.audio);
} else {
  const archivos = trozosOk.map((t) => path.resolve(t.mp3));
  const destino = rutas.audio;
  try {
    const lista = path.join(DIR_TROZOS, "lista.txt");
    fs.writeFileSync(lista, archivos.map((a) => `file '${a.replace(/'/g, "'\\''")}'`).join("\n") + "\n");
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", path.resolve(lista), "-c", "copy", path.resolve(destino)]);
  } catch {
    console.log("⚠ ffmpeg no pudo unir los trozos; los concateno directamente.");
    fs.writeFileSync(destino, Buffer.concat(archivos.map((a) => fs.readFileSync(a))));
  }
}
const duracionSeg = duracionMP3(rutas.audio);
const suma = duraciones.every((d) => d != null) ? duraciones.reduce((a, d) => a + d, 0) : null;
if (suma != null && duracionSeg != null && Math.abs(suma - duracionSeg) > 0.25) {
  console.log(`⚠ La suma de los trozos (${suma.toFixed(2)} s) difiere del MP3 unido (${duracionSeg.toFixed(2)} s): revisar la sincronía.`);
}

// Tiempos: cada trozo se desplaza por la duración de los anteriores.
let palabras = [];
if (trozosOk.every((t) => t.alineacion?.characters)) {
  const un = { characters: [], character_start_times_seconds: [], character_end_times_seconds: [] };
  let desfase = 0;
  trozosOk.forEach((t, i) => {
    if (i > 0) {
      un.characters.push(" ");
      un.character_start_times_seconds.push(desfase);
      un.character_end_times_seconds.push(desfase);
    }
    t.alineacion.characters.forEach((c, k) => {
      un.characters.push(c);
      un.character_start_times_seconds.push(t.alineacion.character_start_times_seconds[k] + desfase);
      un.character_end_times_seconds.push(t.alineacion.character_end_times_seconds[k] + desfase);
    });
    desfase += duraciones[i] ?? Math.max(...t.alineacion.character_end_times_seconds);
  });
  palabras = normalizarPalabrasVoz(un);
}
if (palabras.length) escribirJSON(rutas.palabras, { origen: "elevenlabs-api-alineacion", hash, palabras });
else fs.rmSync(rutas.palabras, { force: true });
escribirJSON(rutas.meta, { hash, voiceId: voz.voiceId, vozNombre: voz.nombre, modelo: modeloUsado, origen: "elevenlabs-api", duracionSeg, trozos: trozosOk.length, fecha: new Date().toISOString() });
console.log(`✔ Narración guardada (${duracionSeg?.toFixed(2)} s, ${modeloUsado}${trozosOk.length > 1 ? `, ${trozosOk.length} trozos` : ""}) ${palabras.length ? "con tiempos por palabra" : "SIN tiempos por palabra (sincronizar con --estimar)"}. Siguiente: node scripts/sincronizar.mjs ${nombre}`);
