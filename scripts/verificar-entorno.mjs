// Revisa que la PC tenga lo necesario y deja un informe en logs/entorno.json.
// Uso: npm run entorno
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { RAIZ, archivoEnv, ejecutar, enGitHubActions, enLaNube, escribirJSON } from "./lib/comun.mjs";

const filas = [];
const ok = (nombre, valor) => filas.push({ nombre, estado: "ok", valor });
const mal = (nombre, valor) => filas.push({ nombre, estado: "falta", valor });
const aviso = (nombre, valor) => filas.push({ nombre, estado: "aviso", valor });

const mayor = Number(process.versions.node.split(".")[0]);
if (mayor >= 20) ok("Node.js", process.version);
else if (mayor >= 18) aviso("Node.js", `${process.version} (funciona; se recomienda 20 o 22 LTS)`);
else mal("Node.js", `${process.version} (se necesita 18 o más nuevo)`);

const npm = await ejecutar("npm", ["--version"], { capturar: true });
npm.codigo === 0 ? ok("npm", npm.salida.trim()) : mal("npm", "no responde");
ok("Sistema", `${os.type()} ${os.release()} (${os.arch()}) · ${Math.round(os.totalmem() / 1073741824)} GB RAM · ${os.cpus().length} núcleos`);

const nm = path.join(RAIZ, "node_modules");
if (!fs.existsSync(nm)) mal("Dependencias", "falta instalar (npm install)");
else {
  const versiones = {};
  for (const p of ["remotion", "@remotion/cli", "@remotion/media", "@remotion/captions", "@remotion/fonts", "@remotion/renderer", "@remotion/bundler"]) {
    const pj = path.join(nm, ...p.split("/"), "package.json");
    if (fs.existsSync(pj)) versiones[p] = JSON.parse(fs.readFileSync(pj, "utf8")).version;
  }
  const distintas = new Set(Object.values(versiones));
  if (!versiones.remotion) mal("Remotion", "no instalado");
  else if (distintas.size > 1) aviso("Remotion", `versiones mezcladas: ${JSON.stringify(versiones)}`);
  else ok("Remotion", `${versiones.remotion} (${Object.keys(versiones).length} paquetes alineados)`);
  const react = path.join(nm, "react", "package.json");
  if (fs.existsSync(react)) ok("React", JSON.parse(fs.readFileSync(react, "utf8")).version);
  const ff = await ejecutar("npx", ["remotion", "ffmpeg", "-version"], { capturar: true });
  ff.codigo === 0 ? ok("FFmpeg de Remotion", ff.salida.split("\n")[0].slice(0, 60)) : aviso("FFmpeg de Remotion", "no respondió (se usa solo para controlar el MP4)");
}

const fuentes = ["InterDisplay-Black.woff", "InterDisplay-ExtraBold.woff", "Inter-Bold.woff", "Inter-SemiBold.woff"];
const faltan = fuentes.filter((f) => !fs.existsSync(path.join(RAIZ, "src", "marca", "fuentes", f)));
faltan.length ? mal("Tipografías", `faltan ${faltan.join(", ")}`) : ok("Tipografías", "Inter (local)");

const canal = JSON.parse(fs.readFileSync(path.join(RAIZ, "config", "canal.json"), "utf8"));
canal.voz?.voiceId ? ok("Voz del canal", `${canal.voz.nombre} (${canal.voz.voiceId})`) : aviso("Voz del canal", "todavía sin elegir (config/canal.json)");
const env = archivoEnv();
if (process.env.ELEVENLABS_API_KEY) ok("Clave ElevenLabs", "variable ELEVENLABS_API_KEY presente");
else if (env) ok("Clave ElevenLabs", `${path.basename(env)} presente`);
else if (enLaNube()) ok("Clave ElevenLabs", "secreto de red del entorno (comprobar con: node scripts/voces.mjs)");
else if (enGitHubActions()) ok("Clave ElevenLabs", "no hace falta en GitHub Actions (la voz ya está en recursos/)");
else aviso("Clave ElevenLabs", "no hay .env (hace falta para generar la voz desde esta PC)");
if (enLaNube()) ok("Lugar", "sesión de Claude Code en la nube");
if (enGitHubActions()) ok("Lugar", "GitHub Actions");

console.log("\n=== Entorno ===");
for (const f of filas) console.log(`  ${f.estado === "ok" ? "✔" : f.estado === "aviso" ? "⚠" : "✖"} ${f.nombre}: ${f.valor}`);
escribirJSON(path.join(RAIZ, "logs", "entorno.json"), { fecha: new Date().toISOString(), filas });
const faltantes = filas.filter((f) => f.estado === "falta");
console.log(faltantes.length ? `\n${faltantes.length} requisito(s) faltante(s).\n` : "\nEntorno listo.\n");
process.exit(faltantes.length ? 1 : 0);
