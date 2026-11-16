// Lista las voces de TU cuenta de ElevenLabs (incluidas las agregadas a "My Voices") con su voiceId.
// No gasta créditos. Uso: node scripts/voces.mjs            (todas)
//                         node scripts/voces.mjs <nombre>  (filtra por nombre)
// También sirve para comprobar que la clave (o el secreto de red en la nube) funciona.
import { PISTA_CLAVE_ELEVENLABS, argumentos, encabezadosElevenLabs, fallar } from "./lib/comun.mjs";

const { sueltos } = argumentos();
const filtro = (sueltos.join(" ") || "").toLowerCase();
const acceso = encabezadosElevenLabs();
if (!acceso) fallar("No hay ELEVENLABS_API_KEY en .env (o .env.txt).");

const pedir = async (url) => {
  const r = await fetch(url, { headers: acceso.headers });
  if (r.status === 401) fallar(`ElevenLabs respondió 401 (clave rechazada o ausente). ${PISTA_CLAVE_ELEVENLABS}`);
  if (!r.ok) throw new Error(`ElevenLabs respondió ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
};

let voces = [];
try {
  let token = null;
  do {
    const datos = await pedir(`https://api.elevenlabs.io/v2/voices?page_size=100${token ? `&next_page_token=${encodeURIComponent(token)}` : ""}`);
    voces.push(...(datos.voices ?? []));
    token = datos.has_more ? datos.next_page_token : null;
  } while (token);
} catch {
  try {
    voces = (await pedir("https://api.elevenlabs.io/v1/voices")).voices ?? [];
  } catch (e) {
    fallar(`${e.message}\nSi la clave no tiene permiso para leer voces, activá "Voices: read" al crearla.`);
  }
}
const lista = voces
  .filter((v) => !filtro || String(v.name).toLowerCase().includes(filtro))
  .map((v) => ({ voiceId: v.voice_id, nombre: v.name, categoria: v.category, acento: v.labels?.accent ?? "", idioma: v.labels?.language ?? "" }));
if (!lista.length) console.log(filtro ? `No encontré voces que contengan "${filtro}" en tu cuenta. ¿La agregaste a My Voices?` : "Tu cuenta no tiene voces.");
for (const v of lista) console.log(`${v.voiceId}  ${v.nombre}  [${[v.categoria, v.acento, v.idioma].filter(Boolean).join(", ")}]`);
