// Entregas: un video marcado como "listo" (entrega.json) se renderiza en GitHub Actions
// y el MP4 queda en la sección Releases del repositorio. No se publica en ninguna red.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { RAIZ, ejecutar, estadoNarracion, leerJSON } from "./comun.mjs";

// Huella del contenido: proyecto editable + sincronía + narración + número de revisión.
// Si cambia cualquiera de esas cosas, es otra entrega (otro MP4).
export const huellaEntrega = (rutas, video, canal, revision) => {
  const est = estadoNarracion(rutas, video, canal);
  const sinc = leerJSON(rutas.sincronia, null);
  const contenido = JSON.stringify({ video, sincronia: sinc, narracion: est.hash, revision });
  return crypto.createHash("sha256").update(contenido).digest("hex").slice(0, 10);
};

// Nombre de la etiqueta (tag) del release: entrega-<carpeta>-<huella>
export const etiquetaEntrega = (nombre, entrega) => `entrega-${nombre}-${entrega.huella}`;

// owner/repo del repositorio actual (en Actions viene en GITHUB_REPOSITORY; si no, del remoto de git).
export const repositorio = async () => {
  if (process.env.GITHUB_REPOSITORY) return process.env.GITHUB_REPOSITORY;
  const r = await ejecutar("git", ["remote", "get-url", "origin"], { capturar: true });
  const url = r.salida.trim().replace(/\.git$/, "");
  const partes = url.split(/[/:]/).filter(Boolean);
  return partes.length >= 2 ? `${partes[partes.length - 2]}/${partes[partes.length - 1]}` : null;
};

// Llamada a la API REST de GitHub con gh (en la nube el proxy pone las credenciales).
export const ghApi = async (ruta, extra = []) => {
  const r = await ejecutar("gh", ["api", ruta, ...extra], { capturar: true });
  let datos = null;
  try {
    datos = JSON.parse(r.salida);
  } catch {
    datos = null;
  }
  return { ok: r.codigo === 0, datos, error: (r.error || r.salida).trim() };
};

// Título del video desde youtube.md (sección "## Título").
export const tituloYoutube = (rutas) => {
  if (!fs.existsSync(rutas.youtube)) return null;
  const m = fs.readFileSync(rutas.youtube, "utf8").match(/^##\s*T[ií]tulo\s*\n+([^\n]+)/im);
  return m ? m[1].trim() : null;
};

export const rutaRelativa = (p) => path.relative(RAIZ, p).replace(/\\/g, "/");
