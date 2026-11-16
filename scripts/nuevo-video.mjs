// Crea la carpeta de un video nuevo a partir de la plantilla.
// Uso: npm run nuevo -- cafe-y-bano            (Short)
//      npm run nuevo -- dieta-mediterranea --largo
//      npm run nuevo -- cafe-y-bano --fecha=2026-11-10
import fs from "node:fs";
import path from "node:path";
import { PRODUCCIONES, argumentos, escribirJSON, fallar, fechaHoy, leerJSON, normalizar } from "./lib/comun.mjs";

const { opciones, sueltos } = argumentos();
const crudo = sueltos.join(" ").trim();
if (!crudo) fallar("Indicá un nombre corto. Ej: npm run nuevo -- cafe-y-bano");

const slug = normalizar(crudo).replace(/%/g, "").replace(/\s+/g, "-").replace(/ñ/g, "n").slice(0, 48);
const nombre = `${opciones.fecha ?? fechaHoy()}-${slug}`;
const dir = path.join(PRODUCCIONES, nombre);
if (fs.existsSync(dir)) fallar(`Ya existe ${dir}`);

const plantilla = path.join(PRODUCCIONES, "_plantilla");
fs.mkdirSync(path.join(dir, "recursos"), { recursive: true });
fs.mkdirSync(path.join(dir, "qa"), { recursive: true });
for (const f of ["guion.md", "fuentes.md", "youtube.md"]) {
  fs.copyFileSync(path.join(plantilla, f), path.join(dir, f));
}
const video = leerJSON(path.join(plantilla, "video.json"));
video.id = nombre;
video.formato = opciones.largo ? "largo" : "short";
escribirJSON(path.join(dir, "video.json"), video);

console.log(`✔ Carpeta creada: producciones/${nombre}`);
console.log("  Completar: fuentes.md → guion.md → video.json → youtube.md");
