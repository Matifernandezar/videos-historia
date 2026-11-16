// Prepara una sesión de Claude Code en la nube. Lo ejecuta el hook SessionStart de .claude/settings.json.
// En la PC (o en cualquier lado que no sea la nube de Claude Code) no hace nada.
// Pasos: librerías de Linux del navegador (si faltan) → dependencias de npm (si cambió package.json)
//        → navegador de Remotion. Detalle completo en logs/preparar-nube.log.
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

if (process.env.CLAUDE_CODE_REMOTE !== "true") process.exit(0);
// En la nube, Node solo usa el proxy de salida (ElevenLabs, descarga del navegador) con esta variable.
process.env.NODE_USE_ENV_PROXY ??= "1";

const RAIZ = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const LOG = path.join(RAIZ, "logs", "preparar-nube.log");
fs.mkdirSync(path.dirname(LOG), { recursive: true });
fs.writeFileSync(LOG, `preparar-nube ${new Date().toISOString()}\n`);
const anotar = (t) => fs.appendFileSync(LOG, t.endsWith("\n") ? t : t + "\n");

const correr = (comando, tiempoMs = 300000) => {
  anotar(`\n$ ${comando}`);
  const r = spawnSync(comando, { cwd: RAIZ, shell: true, encoding: "utf8", timeout: tiempoMs, maxBuffer: 64 * 1024 * 1024 });
  anotar((r.stdout ?? "") + (r.stderr ?? ""));
  return r.status === 0;
};
const resultado = [];

// 1) Librerías que necesita el navegador interno de Remotion (Chrome Headless Shell) en Ubuntu 24.04.
const necesarias = ["libnss3.so", "libgbm.so.1", "libasound.so.2", "libatk-bridge-2.0.so.0", "libxkbcommon.so.0", "libcups.so.2", "libpango-1.0.so.0", "libXcomposite.so.1", "libXdamage.so.1", "libXrandr.so.2"];
const cache = spawnSync("ldconfig", ["-p"], { encoding: "utf8" }).stdout ?? "";
const faltan = necesarias.filter((l) => !cache.includes(l));
if (!faltan.length) resultado.push("librerías ok");
else {
  const paquetes = "libnss3 libdbus-1-3 libatk1.0-0 libasound2t64 libxrandr2 libxkbcommon-dev libxfixes3 libxcomposite1 libxdamage1 libgbm-dev libcups2 libcairo2 libpango-1.0-0 libatk-bridge2.0-0";
  const sudo = process.getuid && process.getuid() !== 0 ? "sudo " : "";
  const ok = correr(`${sudo}apt-get update -qq && ${sudo}DEBIAN_FRONTEND=noninteractive apt-get install -y -qq ${paquetes}`, 240000);
  resultado.push(ok ? "librerías instaladas" : `FALTAN librerías (${faltan.join(", ")}): ver logs/preparar-nube.log`);
}

// 2) Dependencias de npm: solo si cambió package.json / package-lock.json desde la última vez.
const archivosDeps = ["package.json", "package-lock.json"].filter((f) => fs.existsSync(path.join(RAIZ, f)));
const huella = crypto.createHash("sha256").update(archivosDeps.map((f) => fs.readFileSync(path.join(RAIZ, f), "utf8")).join("\n")).digest("hex");
const marca = path.join(RAIZ, "node_modules", ".preparar-nube.sha256");
const yaEstaba = fs.existsSync(marca) && fs.readFileSync(marca, "utf8").trim() === huella;
if (yaEstaba) resultado.push("dependencias ok");
else {
  const conLock = archivosDeps.includes("package-lock.json");
  const ok = correr(conLock ? "npm ci --no-audit --no-fund" : "npm install --no-audit --no-fund", 300000);
  if (ok) fs.writeFileSync(marca, huella);
  resultado.push(ok ? "dependencias instaladas" : "FALLÓ npm install: ver logs/preparar-nube.log");
}

// 3) Navegador de Remotion (se descarga una vez por sesión desde remotion.media: ese host debe estar permitido en el entorno).
if (fs.existsSync(path.join(RAIZ, "node_modules", "remotion"))) {
  const ok = correr("npx remotion browser ensure", 180000);
  resultado.push(ok ? "navegador de Remotion ok" : "FALLÓ la descarga del navegador: ver logs/preparar-nube.log");
}

const problemas = resultado.filter((r) => r.startsWith("FALT") || r.startsWith("FALLÓ"));
console.log(`Nube de Claude Code: ${resultado.join(" · ")}.${problemas.length ? " Revisar antes de renderizar." : " Se puede renderizar."}`);
process.exit(0);
