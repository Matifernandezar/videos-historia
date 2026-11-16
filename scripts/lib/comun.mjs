// Utilidades compartidas por los scripts (Node puro, funciona igual en Windows, macOS y Linux).
import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

export const RAIZ = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..", "..");
export const PRODUCCIONES = path.join(RAIZ, "producciones");
export const CANAL_JSON = path.join(RAIZ, "config", "canal.json");

export const leerJSON = (p, porDefecto = undefined) => {
  if (!fs.existsSync(p)) {
    if (porDefecto !== undefined) return porDefecto;
    throw new Error(`No existe: ${p}`);
  }
  const texto = fs.readFileSync(p, "utf8").replace(/^﻿/, "");
  try {
    return JSON.parse(texto);
  } catch (e) {
    throw new Error(`JSON inválido en ${p}: ${e.message}`);
  }
};

export const escribirJSON = (p, datos) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(datos, null, 2) + "\n", "utf8");
};

export const leerCanal = () => leerJSON(CANAL_JSON);

// Variables de .env (también acepta .env.txt, que es como lo guarda el Bloc de notas).
export const archivoEnv = () => [".env", ".env.txt"].map((n) => path.join(RAIZ, n)).find((p) => fs.existsSync(p)) ?? null;
export const cargarEnv = () => {
  const p = archivoEnv();
  if (!p) return null;
  for (const linea of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return path.basename(p);
};

// ---------- Nube ----------
// Sesión de Claude Code en la nube (claude.ai/code, app del celular): la variable vale "true" solo ahí.
export const enLaNube = () => process.env.CLAUDE_CODE_REMOTE === "true";
export const enGitHubActions = () => process.env.GITHUB_ACTIONS === "true";

// Encabezados para la API de ElevenLabs.
// - En la PC: la clave sale de .env / .env.txt.
// - En la nube: la clave es un "secreto de red" del entorno; el proxy la agrega en el camino,
//   así que la sesión manda el pedido sin clave (y nunca la ve).
export const encabezadosElevenLabs = () => {
  cargarEnv();
  const clave = process.env.ELEVENLABS_API_KEY;
  if (clave) return { origen: "clave local", headers: { "xi-api-key": clave } };
  if (enLaNube()) return { origen: "secreto de red", headers: {} };
  return null;
};
export const PISTA_CLAVE_ELEVENLABS = enLaNube()
  ? "En la nube la clave va como secreto de red del entorno (host api.elevenlabs.io, encabezado xi-api-key, sin prefijo). Ver guia-produccion/nube.md."
  : "Revisá ELEVENLABS_API_KEY en .env (o .env.txt) y que la clave tenga permiso de Text to Speech.";

// ---------- Producciones ----------
export const listarProducciones = () => {
  if (!fs.existsSync(PRODUCCIONES)) return [];
  return fs
    .readdirSync(PRODUCCIONES, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("."))
    .map((d) => d.name)
    .filter((n) => fs.existsSync(path.join(PRODUCCIONES, n, "video.json")))
    .sort();
};

// Acepta el nombre completo de la carpeta, una parte única del nombre o "ultimo".
export const resolverProduccion = (consulta) => {
  const todas = listarProducciones();
  if (!consulta || consulta === "ultimo" || consulta === "último") {
    const reales = todas.filter((n) => !n.startsWith("0000-"));
    if (!reales.length) throw new Error("Todavía no hay producciones. Creá una con: npm run nuevo -- <tema-corto>");
    return reales[reales.length - 1];
  }
  if (todas.includes(consulta)) return consulta;
  const coinciden = todas.filter((n) => n.includes(consulta));
  if (coinciden.length === 1) return coinciden[0];
  if (coinciden.length > 1) throw new Error(`"${consulta}" coincide con varias carpetas: ${coinciden.join(", ")}`);
  throw new Error(`No encontré la producción "${consulta}". Disponibles: ${todas.join(", ") || "(ninguna)"}`);
};

export const rutasVideo = (nombre) => {
  const dir = path.join(PRODUCCIONES, nombre);
  const recursos = path.join(dir, "recursos");
  return {
    nombre,
    dir,
    video: path.join(dir, "video.json"),
    guion: path.join(dir, "guion.md"),
    fuentes: path.join(dir, "fuentes.md"),
    youtube: path.join(dir, "youtube.md"),
    recursos,
    audio: path.join(recursos, "narracion.mp3"),
    meta: path.join(recursos, "narracion.meta.json"),
    pendiente: path.join(recursos, "narracion.pendiente.json"),
    textoNarracion: path.join(recursos, "narracion.texto.txt"),
    palabras: path.join(recursos, "palabras.json"),
    sincronia: path.join(recursos, "sincronia.json"),
    qa: path.join(dir, "qa"),
    entrega: path.join(dir, "entrega.json"),
    build: path.join(dir, ".build"),
    props: path.join(dir, ".build", "props.json"),
    mp4: path.join(dir, `${nombre}.mp4`),
  };
};

// ---------- Narración ----------
// El texto que se locuta es la concatenación de `narracion` de cada escena, separadas por un espacio.
export const textoNarracion = (video) =>
  video.escenas
    .map((e) => String(e.narracion ?? "").trim())
    .filter(Boolean)
    .join(" ");

export const vozDelVideo = (video, canal) => {
  const v = video.voz ?? {};
  return {
    voiceId: v.voiceId ?? canal.voz.voiceId ?? null,
    nombre: v.nombre ?? canal.voz.nombre ?? null,
    modelo: v.modelo ?? canal.voz.modelo,
  };
};

// Hash que identifica una narración: si cambia el texto, la voz o el modelo, hay que regenerar.
export const hashNarracion = (texto, voiceId, modelo) =>
  crypto.createHash("sha256").update(JSON.stringify({ texto, voiceId, modelo })).digest("hex").slice(0, 16);

export const estadoNarracion = (rutas, video, canal) => {
  const texto = textoNarracion(video);
  const voz = vozDelVideo(video, canal);
  // La huella depende del texto, la voz y el modelo con que se generó. Un audio sirve si fue hecho
  // con este mismo texto y esta misma voz (por la conexión de ElevenLabs o con la clave local).
  const hashCon = (modelo) => hashNarracion(texto, voz.voiceId, modelo);
  const meta = leerJSON(rutas.meta, null);
  const hayAudio = fs.existsSync(rutas.audio);
  const pendiente = leerJSON(rutas.pendiente, null);
  let hash = hashCon(voz.modelo);
  let estado;
  if (!voz.voiceId) estado = "sin-voz";
  else if (hayAudio && meta?.hash && meta.hash === hashCon(meta.modelo)) {
    estado = "vigente";
    hash = meta.hash;
  } else if (pendiente?.hash && pendiente.hash === hashCon(pendiente.modelo)) {
    estado = "pendiente-descarga";
    hash = pendiente.hash;
  } else if (hayAudio) estado = "desactualizada";
  else estado = "falta";
  return { texto, voz, hash, meta, hayAudio, pendiente, estado };
};

export const contarPalabras = (texto) => texto.split(/\s+/).filter(Boolean).length;

// ---------- Texto ----------
export const normalizar = (s) =>
  String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ%\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// ---------- Duración de MP3 (sin herramientas externas) ----------
const BITRATES = {
  "1-3": [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
  "2-3": [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
};
const MUESTREO = { 3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000] };

export const duracionMP3 = (archivo) => {
  const b = fs.readFileSync(archivo);
  let i = 0;
  if (b.length > 10 && b.toString("latin1", 0, 3) === "ID3") {
    const tam = ((b[6] & 0x7f) << 21) | ((b[7] & 0x7f) << 14) | ((b[8] & 0x7f) << 7) | (b[9] & 0x7f);
    i = 10 + tam;
  }
  let segundos = 0;
  let cuadros = 0;
  while (i + 4 <= b.length) {
    if (b[i] === 0xff && (b[i + 1] & 0xe0) === 0xe0) {
      const version = (b[i + 1] >> 3) & 0x03; // 3=MPEG1, 2=MPEG2, 0=MPEG2.5
      const capa = (b[i + 1] >> 1) & 0x03; // 1=Layer III
      const idxBit = (b[i + 2] >> 4) & 0x0f;
      const idxMue = (b[i + 2] >> 2) & 0x03;
      const relleno = (b[i + 2] >> 1) & 0x01;
      if (version !== 1 && capa === 1 && idxBit > 0 && idxBit < 15 && idxMue < 3) {
        const kbps = (version === 3 ? BITRATES["1-3"] : BITRATES["2-3"])[idxBit];
        const hz = MUESTREO[version][idxMue];
        const muestras = version === 3 ? 1152 : 576;
        const largo = Math.floor(((muestras / 8) * kbps * 1000) / hz) + relleno;
        if (largo > 4) {
          segundos += muestras / hz;
          cuadros++;
          i += largo;
          continue;
        }
      }
    }
    i++;
  }
  return cuadros > 0 ? Math.round(segundos * 1000) / 1000 : null;
};

// ---------- Procesos ----------
export const ejecutar = (comando, args, opciones = {}) =>
  new Promise((resolve) => {
    const citados = args.map((a) => (/[\s",;=&|<>^()]/.test(a) ? `"${a.replace(/"/g, "")}"` : a));
    // Una sola línea de comando (evita el aviso DEP0190 de Node al combinar shell con lista de argumentos).
    const linea = [comando, ...citados].join(" ");
    const hijo = spawn(linea, { cwd: RAIZ, shell: true, stdio: opciones.capturar ? ["ignore", "pipe", "pipe"] : "inherit" });
    let salida = "";
    let error = "";
    if (opciones.capturar) {
      hijo.stdout.on("data", (d) => (salida += d));
      hijo.stderr.on("data", (d) => (error += d));
    }
    hijo.on("close", (codigo) => resolve({ codigo, salida, error }));
    hijo.on("error", (e) => resolve({ codigo: 1, salida, error: String(e) }));
  });

export const sondear = async (archivo) => {
  const r = await ejecutar("npx", ["remotion", "ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height,r_frame_rate,nb_frames:format=duration", "-of", "json", archivo], { capturar: true });
  if (r.codigo !== 0) return null;
  try {
    return JSON.parse(r.salida);
  } catch {
    return null;
  }
};

export const argumentos = () => {
  const crudos = process.argv.slice(2);
  const opciones = {};
  const sueltos = [];
  // Opciones con valor: --clave=valor. Banderas: --clave
  for (const a of crudos) {
    if (a.startsWith("--")) {
      const i = a.indexOf("=");
      if (i > 0) opciones[a.slice(2, i)] = a.slice(i + 1);
      else opciones[a.slice(2)] = true;
    } else sueltos.push(a);
  }
  return { opciones, sueltos };
};

export const fallar = (mensaje) => {
  console.error(`\n✖ ${mensaje}\n`);
  process.exit(1);
};

export const fechaHoy = () => {
  const d = new Date();
  const z = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
};
