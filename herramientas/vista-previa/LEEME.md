# Vista previa aproximada (sin Remotion)

Sirve para revisar diseño, legibilidad y márgenes cuadro por cuadro **en un entorno donde no se puede instalar Remotion** (por ejemplo, un contenedor sin acceso a npm). Reemplaza la API de Remotion por una versión mínima (`shim/`) y captura cuadros con Chromium.

**No es el render final**: los resortes, la carga de fuentes y el audio pueden diferir un poco. El video que se entrega siempre se renderiza con Remotion (`npm run render` / `PRODUCIR-VIDEO.cmd`).

Requisitos: `esbuild`, `react`, `react-dom`, `playwright` con Chromium y `ffmpeg` (para `--mp4`), accesibles por `NODE_PATH` o `node_modules`.

```bash
node herramientas/vista-previa/capturar.mjs --comp PruebaRender --frames 0,45,89 --salida /tmp/cuadros
node herramientas/vista-previa/capturar.mjs --comp VideoCanal --props producciones/<video>/.build/props.json --frames 0,120,300
node herramientas/vista-previa/capturar.mjs --comp Lupe-Poses --frames 20
```
Composiciones disponibles: las de `composiciones.ts` (mismas que `src/Root.tsx`).
