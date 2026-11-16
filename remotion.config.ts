// Configuración del CLI de Remotion (aplica a `npx remotion studio` y `npx remotion render`).
// Los scripts de /scripts pasan --public-dir y --props por video, así que acá solo va lo común.
import fs from "node:fs";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// En la nube de Claude Code no se puede bajar el navegador de Remotion: usar el Chromium ya instalado, si existe.
const NAVEGADOR_NUBE = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
if (process.env.CLAUDE_CODE_REMOTE && fs.existsSync(NAVEGADOR_NUBE)) Config.setBrowserExecutable(NAVEGADOR_NUBE);
