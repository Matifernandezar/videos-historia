// Renderiza un video: verificación → props → cuadros de revisión (qa/cuadros) → MP4 → control del MP4.
// Uso: npm run render -- <video>             (MP4 final en la carpeta del video)
//      npm run render -- <video> --solo-qa   (solo cuadros de revisión, rápido)
//      npm run render -- <video> --sin-audio (ignora la narración)
//      npm run render -- <video> --forzar    (renderiza aunque haya errores de verificación)
import path from "node:path";
import { argumentos, escribirJSON, fallar, leerCanal, leerJSON, resolverProduccion, rutasVideo } from "./lib/comun.mjs";
import { imprimirVerificacion, verificarProduccion } from "./lib/verificacion.mjs";
import { construirProps, cuadrosRevision, inspeccionarMP4, lineaDeTiempo, renderCuadros, renderVideo } from "./lib/render.mjs";

export const renderizarProduccion = async (nombre, opciones = {}) => {
  const rutas = rutasVideo(nombre);
  const video = leerJSON(rutas.video);
  const canal = leerCanal();
  const sinAudio = Boolean(opciones["sin-audio"]);
  const ver = verificarProduccion(rutas, video, canal, { sinAudio });
  imprimirVerificacion(ver, nombre);
  if (ver.errores.length && !opciones.forzar) throw new Error("Corregí los errores de verificación (o usá --forzar para un borrador).");

  const { props } = construirProps(rutas, video, canal, { sinAudio });
  const f = canal.formatos[video.formato === "largo" ? "largo" : "short"];
  const linea = lineaDeTiempo(video, props.sincronia, f.fps);
  console.log(`Duración del video: ${(linea.total / f.fps).toFixed(2)} s · ${props.audio ? "con narración" : "SIN narración"} · tiempos ${props.sincronia ? "de la voz real" : "estimados"}`);

  const frames = cuadrosRevision(linea);
  console.log(`\n→ Cuadros de revisión (${frames.length}) en qa/cuadros …`);
  const qa = await renderCuadros({ composicion: "VideoCanal", propsArchivo: rutas.props, publicDir: rutas.recursos, frames, carpeta: path.join(rutas.qa, "cuadros") });
  if (!qa.ok) throw new Error("Falló el render de cuadros de revisión (ver mensajes arriba).");
  if (opciones["solo-qa"]) return { qa };

  console.log(`\n→ Render del MP4 …`);
  const r = await renderVideo({ composicion: "VideoCanal", propsArchivo: rutas.props, publicDir: rutas.recursos, salida: rutas.mp4, canal });
  if (!r.ok) throw new Error("Falló el render del MP4 (ver mensajes arriba).");
  const control = await inspeccionarMP4(rutas.mp4, { ancho: f.ancho, alto: f.alto, fps: f.fps, duracion: linea.total / f.fps, audio: Boolean(props.audio) });
  const informe = {
    video: nombre,
    fecha: new Date().toISOString(),
    mp4: path.basename(rutas.mp4),
    segundosDeRender: r.segundos,
    conNarracion: Boolean(props.audio),
    tiempos: props.sincronia ? props.sincronia.metodo : "estimado",
    control,
    avisos: ver.avisos,
  };
  escribirJSON(path.join(rutas.qa, "informe-render.json"), informe);
  console.log(`\n✔ MP4 listo: producciones/${nombre}/${path.basename(rutas.mp4)} (${(control.bytes / 1048576).toFixed(1)} MB, ${r.segundos} s de render)`);
  if (control.verificado && !control.ok) console.log(`⚠ Control del MP4: ${control.problemas.join("; ")}`);
  return informe;
};

const esPrincipal = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop());
if (esPrincipal) {
  const { opciones, sueltos } = argumentos();
  try {
    await renderizarProduccion(resolverProduccion(sueltos[0]), opciones);
  } catch (e) {
    fallar(e.message);
  }
}
