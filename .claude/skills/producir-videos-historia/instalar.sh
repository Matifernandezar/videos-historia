#!/usr/bin/env bash
# Instala el canal de historia en el repositorio actual. Correr desde la RAÍZ del repo:
#   bash .claude/skills/producir-videos-historia/instalar.sh [--si]
# 1) Copia CLAUDE.md, config/canal.json, guia-produccion/ y producciones/_plantilla/ (de para-la-raiz-del-repo/).
# 2) Aplica los ajustes de código para videos sin límite de duración (ajustes-al-codigo/):
#    narrar-api.mjs en trozos, timeout del workflow a 6 h y .gitignore de la caché de trozos.
# Antes de pisar algo guarda una copia en .respaldo-antes-de-historia/. --si = no preguntar.
# Si el repo ya tiene la configuración de historia ("canal": "historia"), NO pisa CLAUDE.md ni config/canal.json
# (para no borrar el nombre del canal u otros cambios): solo reaplica los ajustes de código.
set -euo pipefail

SK=".claude/skills/producir-videos-historia"
RAIZ="$SK/para-la-raiz-del-repo"
AJ="$SK/ajustes-al-codigo"
RESPALDO=".respaldo-antes-de-historia"

if [ ! -d "$RAIZ" ] || [ ! -f "$AJ/scripts/narrar-api.mjs" ]; then
  echo "✖ No encuentro $RAIZ. Copiá la carpeta producir-videos-historia a .claude/skills/ y corré esto desde la raíz del repo." >&2
  exit 1
fi

guardar() { # guarda una copia de un archivo existente antes de pisarlo
  if [ -e "$1" ]; then mkdir -p "$RESPALDO/$(dirname "$1")"; cp -p "$1" "$RESPALDO/$1"; fi
}

YA_INSTALADO=0
if [ -f config/canal.json ] && grep -q '"canal": *"historia"' config/canal.json; then YA_INSTALADO=1; fi

if [ "$YA_INSTALADO" = 0 ]; then
  if [ -f config/canal.json ] && [ "${1:-}" != "--si" ]; then
    echo "Este repositorio tiene la configuración de OTRO canal (config/canal.json)."
    echo "Se van a reemplazar: CLAUDE.md, config/canal.json, guia-produccion/ y producciones/_plantilla/"
    echo "(con copia de respaldo en $RESPALDO/)."
    r=""
    read -r -p "¿Continuar? [s/N] " r || true
    [[ "$r" =~ ^[sS]$ ]] || { echo "Cancelado (sin cambios). Para instalar sin preguntar: agregá --si"; exit 1; }
  fi
  while IFS= read -r f; do guardar "${f#"$RAIZ"/}"; done < <(find "$RAIZ" -type f)
  guardar guia-produccion/fuentes-biblicas.md
  cp -r "$RAIZ/." .
  rm -f guia-produccion/fuentes-biblicas.md # la reemplaza fuentes-historicas.md
  # Completa el nombre del repositorio si se puede leer del remoto
  NOMBRE=$(git remote get-url origin 2>/dev/null | sed -E 's#/+$##; s#\.git$##; s#^.*/##' || true)
  if [ -n "${NOMBRE:-}" ]; then
    sed -i "s#<REPO>#$NOMBRE#g" CLAUDE.md guia-produccion/nube.md
    echo "· Repositorio detectado: $NOMBRE (revisá el dueño en CLAUDE.md y guia-produccion/nube.md)."
  else
    echo "· No pude leer el nombre del repositorio: reemplazá <REPO> en CLAUDE.md y guia-produccion/nube.md."
  fi
  echo "✔ Copiados: CLAUDE.md, config/canal.json, guia-produccion/, producciones/_plantilla/"
else
  echo "· Ya está la configuración de historia: no se pisan CLAUDE.md ni config/canal.json."
fi

# --- Ajustes de código para videos largos ---
if [ -f scripts/narrar-api.mjs ]; then
  guardar scripts/narrar-api.mjs
  cp "$AJ/scripts/narrar-api.mjs" scripts/narrar-api.mjs
  echo "✔ scripts/narrar-api.mjs: ahora genera la voz en trozos si el guion es largo."
else
  echo "⚠ No existe scripts/narrar-api.mjs: este repo no tiene la base técnica (¿es la carpeta correcta?)." >&2
fi
if [ -f .github/workflows/renderizar.yml ]; then
  guardar .github/workflows/renderizar.yml
  sed -i 's/timeout-minutes: 60$/timeout-minutes: 360/' .github/workflows/renderizar.yml
  echo "✔ .github/workflows/renderizar.yml: timeout de render a 360 minutos."
else
  echo "⚠ No existe .github/workflows/renderizar.yml: subir a mano timeout-minutes a 360 cuando exista." >&2
fi
if ! grep -qxF 'producciones/*/recursos/.trozos/' .gitignore 2>/dev/null; then
  printf '\n# Caché de trozos de la narración (videos largos)\nproducciones/*/recursos/.trozos/\n' >> .gitignore
  echo "✔ .gitignore: se ignora la caché de trozos."
fi

echo
echo "Listo. Siguiente: commit + push y abrir una sesión NUEVA (para que cargue el CLAUDE.md nuevo)."
echo "Antes de producir: sumar al entorno de la nube los hosts de fuentes (config/canal.json → fuentes.hostsSugeridos)."
[ -d "$RESPALDO" ] && echo "Respaldo de lo reemplazado: $RESPALDO/ (borralo cuando verifiques que todo anda)." || true
