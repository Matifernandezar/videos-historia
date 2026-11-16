// Configuración del CLI de Remotion (aplica a `npx remotion studio` y `npx remotion render`).
// Los scripts de /scripts pasan --public-dir y --props por video, así que acá solo va lo común.
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
