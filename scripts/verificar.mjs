// Revisión previa al render (estructura, textos, voz, sincronía, fuentes, YouTube).
// Uso: npm run verificar -- <video>
import { argumentos, fallar, leerCanal, leerJSON, resolverProduccion, rutasVideo } from "./lib/comun.mjs";
import { imprimirVerificacion, verificarProduccion } from "./lib/verificacion.mjs";

const { opciones, sueltos } = argumentos();
let nombre;
try {
  nombre = resolverProduccion(sueltos[0]);
} catch (e) {
  fallar(e.message);
}
const rutas = rutasVideo(nombre);
const r = verificarProduccion(rutas, leerJSON(rutas.video), leerCanal(), { sinAudio: Boolean(opciones["sin-audio"]) });
if (opciones.json) console.log(JSON.stringify({ errores: r.errores, avisos: r.avisos, info: r.info }, null, 2));
else imprimirVerificacion(r, nombre);
process.exit(r.errores.length ? 1 : 0);
