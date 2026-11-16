// Vista previa APROXIMADA sin Remotion: empaqueta src/ con un reemplazo mínimo de la API
// y captura cuadros con Chromium (Playwright). Pensada para revisar diseño en un entorno sin npm.
// Uso:
//   node herramientas/vista-previa/capturar.mjs --comp PruebaRender --frames 0,45,89 --salida /tmp/cuadros
//   node herramientas/vista-previa/capturar.mjs --comp PruebaRender --todos --mp4 /tmp/prueba.mp4
//   node herramientas/vista-previa/capturar.mjs --comp VideoCanal --props producciones/x/.build/props.json --frames 0,100
// Requiere: esbuild, react, react-dom, playwright (+ Chromium) y ffmpeg para --mp4.
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const aqui = path.dirname(url.fileURLToPath(import.meta.url));
const raiz = path.resolve(aqui, "..", "..");
const req = createRequire(import.meta.url);
const buscar = (nombre) => {
  const rutas = [raiz, ...(process.env.NODE_PATH ?? "").split(path.delimiter).filter(Boolean)];
  return req.resolve(nombre, { paths: rutas });
};

const args = process.argv.slice(2);
const arg = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : d;
};
const tiene = (n) => args.includes(`--${n}`);

const comp = arg("comp", "PruebaRender");
const salida = path.resolve(arg("salida", path.join(raiz, "out", "vista-previa", comp)));
const propsArchivo = arg("props");
const props = propsArchivo ? JSON.parse(fs.readFileSync(path.resolve(propsArchivo), "utf8")) : undefined;

const esbuildMod = await import(url.pathToFileURL(buscar("esbuild")).href);
const esbuild = esbuildMod.build ? esbuildMod : esbuildMod.default;
const dist = path.join(aqui, "dist");
fs.mkdirSync(dist, { recursive: true });
const shim = (f) => path.join(aqui, "shim", f);
await esbuild.build({
  entryPoints: [path.join(aqui, "entrada.tsx")],
  bundle: true,
  outfile: path.join(dist, "app.js"),
  format: "iife",
  jsx: "automatic",
  loader: { ".woff": "file", ".woff2": "file", ".png": "file" },
  alias: {
    remotion: shim("remotion.tsx"),
    "@remotion/media": shim("media.tsx"),
    "@remotion/fonts": shim("fonts.ts"),
    "@remotion/captions": shim("captions.ts"),
  },
  nodePaths: (process.env.NODE_PATH ?? "").split(path.delimiter).filter(Boolean),
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "warning",
});
fs.writeFileSync(
  path.join(dist, "index.html"),
  `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#000}</style></head><body><div id="root"></div><script src="app.js"></script></body></html>`,
);

const pw = await import(url.pathToFileURL(buscar("playwright")).href);
const chromium = pw.chromium ?? pw.default?.chromium;
const navegador = await chromium.launch();
const pagina = await navegador.newPage();
const errores = [];
pagina.on("pageerror", (e) => errores.push(String(e)));
pagina.on("console", (m) => m.type() === "error" && errores.push(m.text()));
await pagina.goto(url.pathToFileURL(path.join(dist, "index.html")).href);
await pagina.waitForFunction(() => typeof window.__render === "function");
const meta = await pagina.evaluate(([c, p]) => window.__meta(c, p), [comp, props]);
await pagina.setViewportSize({ width: meta.width, height: meta.height });

let frames;
if (tiene("todos")) frames = Array.from({ length: meta.durationInFrames }, (_, i) => i);
else frames = (arg("frames", "0") ?? "0").split(",").map((x) => Number(x.trim()));

fs.mkdirSync(salida, { recursive: true });
for (const f of frames) {
  await pagina.evaluate(([c, fr, p]) => window.__render(c, fr, p), [comp, f, props]);
  await pagina.screenshot({ path: path.join(salida, `cuadro-${String(f).padStart(4, "0")}.png`) });
}
await navegador.close();

if (tiene("mp4") || arg("mp4")) {
  const destino = path.resolve(arg("mp4", path.join(salida, `${comp}.mp4`)));
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(meta.fps), "-i", path.join(salida, "cuadro-%04d.png"), "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", destino]);
  console.log("MP4:", destino);
}
console.log(JSON.stringify({ comp, ...meta, cuadros: frames.length, salida, errores }, null, 2));
if (errores.length) process.exitCode = 1;
