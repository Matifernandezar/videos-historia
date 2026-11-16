// Abre Remotion Studio. Sin argumentos: demo y referencias. Con un video: carga sus props y su audio.
// Uso: npm run studio                 |  npm run studio -- <video>
import { argumentos, ejecutar, fallar, leerCanal, leerJSON, resolverProduccion, rutasVideo } from "./lib/comun.mjs";
import { construirProps } from "./lib/render.mjs";

const { sueltos } = argumentos();
if (!sueltos[0]) {
  await ejecutar("npx", ["remotion", "studio", "src/index.ts"]);
} else {
  let nombre;
  try {
    nombre = resolverProduccion(sueltos[0]);
  } catch (e) {
    fallar(e.message);
  }
  const rutas = rutasVideo(nombre);
  construirProps(rutas, leerJSON(rutas.video), leerCanal());
  console.log(`Abriendo Studio con ${nombre} (composición VideoCanal)…`);
  await ejecutar("npx", ["remotion", "studio", "src/index.ts", `--props=${rutas.props}`, `--public-dir=${rutas.recursos}`]);
}
