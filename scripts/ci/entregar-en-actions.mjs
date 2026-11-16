// Corre dentro de GitHub Actions (flujo .github/workflows/renderizar.yml).
// Renderiza los videos marcados para entrega (producciones/*/entrega.json) que todavía no tienen
// su release, controla el MP4 y lo sube a la sección Releases del repositorio.
// Nunca publica en redes: el release es privado como el repositorio.
//
// Variables: VIDEO=<carpeta> (uno en particular) · VIDEO=prueba (render de prueba de 3 s)
//            REHACER=true (vuelve a renderizar aunque el release ya exista)
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { PRODUCCIONES, leerCanal, leerJSON, listarProducciones, resolverProduccion, rutasVideo } from "../lib/comun.mjs";
import { etiquetaEntrega, huellaEntrega, rutaRelativa } from "../lib/entrega.mjs";
import { renderizarProduccion } from "../renderizar.mjs";

const sha = process.env.GITHUB_SHA ?? "";
const pedido = (process.env.VIDEO ?? "").trim();
const rehacer = process.env.REHACER === "true";
const resumen = ["## Renderizar y entregar", ""];

// gh sin shell (los títulos pueden traer signos que el shell interpretaría).
const gh = (args) => {
  const r = spawnSync("gh", args, { encoding: "utf8" });
  return { codigo: r.status ?? 1, salida: (r.stdout ?? "").trim(), error: (r.stderr ?? "").trim() };
};
const existeRelease = (tag) => gh(["release", "view", tag, "--json", "url"]).codigo === 0;

const crearRelease = ({ tag, titulo, notas, archivos, prerelease = false }) => {
  const notasArchivo = path.join(os.tmpdir(), `notas-${tag}.md`);
  fs.writeFileSync(notasArchivo, notas, "utf8");
  if (existeRelease(tag)) gh(["release", "delete", tag, "--yes", "--cleanup-tag"]);
  const args = ["release", "create", tag, ...archivos, "--title", titulo, "--notes-file", notasArchivo];
  if (sha) args.push("--target", sha);
  if (prerelease) args.push("--prerelease");
  const r = gh(args);
  if (r.codigo !== 0) throw new Error(`no se pudo crear el release ${tag}: ${r.error || r.salida}`);
  return r.salida.split("\n").pop();
};

const mb = (archivo) => (fs.statSync(archivo).size / 1048576).toFixed(1);
const primerCuadro = (carpeta, destino) => {
  const indice = leerJSON(path.join(carpeta, "indice.json"), null);
  const archivo = indice?.archivos?.[0];
  if (!archivo || !fs.existsSync(path.join(carpeta, archivo))) return null;
  fs.copyFileSync(path.join(carpeta, archivo), destino);
  return destino;
};
const filaControl = (c) =>
  !c?.verificado ? "sin verificar (ffprobe no respondió)" : c.ok ? "✔ OK" : `⚠ ${c.problemas.join("; ")}`;

// ---------- Render de prueba (3 s, sin voz) ----------
const entregarPrueba = () => {
  console.log("■ Render de prueba de 3 s");
  const r = spawnSync("node", ["scripts/prueba-render.mjs"], { stdio: "inherit" });
  const dir = path.join(PRODUCCIONES, "0000-prueba-render");
  const mp4 = path.join(dir, "prueba-render.mp4");
  const informe = leerJSON(path.join(dir, "qa", "informe-prueba.json"), null);
  if (r.status !== 0 || !fs.existsSync(mp4)) throw new Error("falló el render de prueba (ver el registro de arriba)");
  const c = informe?.control;
  const portada = primerCuadro(path.join(dir, "qa", "cuadros"), path.join(os.tmpdir(), "prueba-render-cuadro0.png"));
  const tag = `prueba-render-${sha.slice(0, 7) || Date.now()}`;
  const notas = [
    "Render de prueba en GitHub Actions (3 s, sin voz). Sirve para comprobar que el render en la nube funciona.",
    "",
    `- Archivo: \`prueba-render.mp4\` (${mb(mp4)} MB)`,
    `- Formato: ${c?.ancho}×${c?.alto} · ${c?.fps} fps · ${c?.duracion?.toFixed(2)} s`,
    `- Control del MP4: ${filaControl(c)}`,
    `- Tiempo de render: ${informe?.segundosDeRender ?? "?"} s`,
  ].join("\n");
  const url = crearRelease({ tag, titulo: "Prueba de render en la nube", notas, archivos: [mp4, ...(portada ? [portada] : [])], prerelease: true });
  resumen.push(`- ✔ Prueba: ${url} (${c?.duracion?.toFixed(2)} s, control ${filaControl(c)})`);
};

// ---------- Un video marcado para entrega ----------
const entregarVideo = async (nombre) => {
  const rutas = rutasVideo(nombre);
  const entrega = leerJSON(rutas.entrega, null);
  if (!entrega) throw new Error(`no tiene entrega.json (node scripts/entregar.mjs ${nombre})`);
  const video = leerJSON(rutas.video);
  const canal = leerCanal();
  const huella = huellaEntrega(rutas, video, canal, entrega.revision ?? 1);
  if (huella !== entrega.huella) {
    throw new Error(`entrega.json no coincide con el contenido actual (cambió video.json, la voz o la sincronía después de marcarlo). Volvé a correr: node scripts/entregar.mjs ${nombre}`);
  }
  const tag = etiquetaEntrega(nombre, entrega);
  if (!rehacer && existeRelease(tag)) {
    console.log(`= ${nombre}: ya entregado (${tag}); no se vuelve a renderizar.`);
    resumen.push(`- = ${nombre}: ya estaba entregado (${tag})`);
    return;
  }
  console.log(`\n■ Renderizando ${nombre} (${tag})`);
  const informe = await renderizarProduccion(nombre, {});
  if (!informe?.mp4 || !fs.existsSync(rutas.mp4)) throw new Error("no se generó el MP4");
  const c = informe.control;
  if (c?.verificado && !c.ok) throw new Error(`el MP4 no pasó el control: ${c.problemas.join("; ")}`);
  const portada = primerCuadro(path.join(rutas.qa, "cuadros"), path.join(os.tmpdir(), `${nombre}-portada.png`));
  const youtube = fs.existsSync(rutas.youtube) ? fs.readFileSync(rutas.youtube, "utf8") : "";
  const notas = [
    "**Video listo para descargar. No se publicó en ninguna red**: bajalo y subilo vos con el título y la descripción de abajo.",
    "",
    "| | |",
    "|---|---|",
    `| Archivo | \`${path.basename(rutas.mp4)}\` (${mb(rutas.mp4)} MB) |`,
    `| Formato | ${c?.ancho}×${c?.alto} · ${c?.fps} fps · ${c?.duracion?.toFixed(2)} s |`,
    `| Narración | ${entrega.voz ?? "?"} (${informe.tiempos === "estimado" ? "tiempos estimados" : "sincronizada con la voz real"}) |`,
    `| Control del MP4 | ${filaControl(c)} |`,
    `| Proyecto | \`${rutaRelativa(rutas.dir)}\` · revisión ${entrega.revision ?? 1} · commit ${sha.slice(0, 7)} |`,
    "",
    "---",
    "",
    youtube,
  ].join("\n");
  const url = crearRelease({ tag, titulo: entrega.titulo || nombre, notas, archivos: [rutas.mp4, ...(portada ? [portada] : [])] });
  console.log(`✔ Entregado: ${url}`);
  resumen.push(`- ✔ ${nombre}: ${url} (${c?.duracion?.toFixed(2)} s, ${mb(rutas.mp4)} MB)`);
};

let fallas = 0;
try {
  if (pedido === "prueba") entregarPrueba();
  else {
    const candidatos = pedido ? [resolverProduccion(pedido)] : listarProducciones().filter((n) => fs.existsSync(rutasVideo(n).entrega));
    if (!candidatos.length) {
      console.log("No hay videos marcados para entrega (producciones/*/entrega.json).");
      resumen.push("- No hay videos marcados para entrega.");
    }
    for (const nombre of candidatos) {
      try {
        await entregarVideo(nombre);
      } catch (e) {
        fallas++;
        console.error(`\n✖ ${nombre}: ${e.message}`);
        resumen.push(`- ✖ ${nombre}: ${e.message}`);
      }
    }
  }
} catch (e) {
  fallas++;
  console.error(`\n✖ ${e.message}`);
  resumen.push(`- ✖ ${e.message}`);
}
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, resumen.join("\n") + "\n");
process.exit(fallas ? 1 : 0);
