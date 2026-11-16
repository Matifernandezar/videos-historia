// Prueba local: renderiza la composición PruebaRender (3 s, sin voz ni servicios externos)
// en producciones/0000-prueba-render/ y controla el MP4 resultante.
import path from "node:path";
import { PRODUCCIONES, escribirJSON, fallar, leerCanal } from "./lib/comun.mjs";
import { inspeccionarMP4, renderCuadros, renderVideo } from "./lib/render.mjs";

const dir = path.join(PRODUCCIONES, "0000-prueba-render");
const salida = path.join(dir, "prueba-render.mp4");
const canal = leerCanal();

console.log("\n■ Prueba de render local (3 s, 1080×1920, 30 fps)");
// Registro detallado en la prueba: si algo falla, muestra qué hizo el navegador interno.
const cuadros = await renderCuadros({ composicion: "PruebaRender", frames: [0, 45, 89], carpeta: path.join(dir, "qa", "cuadros"), log: "verbose" });
if (!cuadros.ok) fallar("No se pudieron renderizar los cuadros de prueba.");
const r = await renderVideo({ composicion: "PruebaRender", salida, canal });
if (!r.ok) fallar("No se pudo renderizar el MP4 de prueba.");
const control = await inspeccionarMP4(salida, { ancho: 1080, alto: 1920, fps: 30, duracion: 3 });
const informe = { fecha: new Date().toISOString(), mp4: "prueba-render.mp4", segundosDeRender: r.segundos, control, ok: control.verificado ? control.ok : true };
escribirJSON(path.join(dir, "qa", "informe-prueba.json"), informe);
if (control.verificado && !control.ok) fallar(`El MP4 se generó pero no cumple: ${control.problemas.join("; ")}`);
console.log(`\n✔ PRUEBA OK: ${salida}`);
console.log(`  ${control.verificado ? `${control.ancho}×${control.alto}, ${control.fps} fps, ${control.duracion?.toFixed(2)} s` : control.nota} · render en ${r.segundos} s\n`);
