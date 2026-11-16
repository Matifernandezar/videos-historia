# INSTALAR-Y-PROBAR: revisa Node/npm, instala dependencias y renderiza la prueba de 3 s.
. (Join-Path $PSScriptRoot 'comun.ps1')
$log = Join-Path $Raiz ("logs\instalacion-" + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.log')
Escribir $log "Sistema de videos - instalacion y prueba de render ($(Get-Date))" 'Cyan'
Escribir $log ("Windows: " + [System.Environment]::OSVersion.VersionString)

# La skill del proyecto viene en .claude\skills\producir-videos-historia\SKILL.md (tambien en GitHub).
$skill = Join-Path $Raiz '.claude\skills\producir-videos-historia\SKILL.md'
if (Test-Path $skill) { Escribir $log 'Skill del proyecto presente.' 'Green' } else { Escribir $log 'Aviso: falta .claude\skills\producir-videos-historia\SKILL.md' 'Yellow' }

if (-not (NodeDisponible)) {
  Escribir $log 'FALTA Node.js (no se encontro el comando node).' 'Yellow'
  if (Get-Command winget -ErrorAction SilentlyContinue) {
    $r = Read-Host 'Instalar Node.js LTS ahora con winget? (S/N)'
    if ($r -match '^[sS]') {
      winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements
      Escribir $log 'Node.js instalado. CERRA esta ventana y volve a abrir INSTALAR-Y-PROBAR.cmd.' 'Green'
      exit 1
    }
  }
  Escribir $log 'Instala Node.js LTS desde https://nodejs.org y volve a ejecutar este archivo.' 'Yellow'
  exit 1
}

$c = Paso $log 'Versiones' { node --version; npm.cmd --version }
$c = Paso $log 'Instalando dependencias (npm install)' { npm.cmd install --no-audit --no-fund }
if ($c -ne 0) { Escribir $log "FALLO npm install (codigo $c). Pasale este registro a Claude: $log" 'Red'; exit 1 }

$c = Paso $log 'Revision del entorno' { node scripts/verificar-entorno.mjs }
$t = Paso $log 'Revision de tipos TypeScript (no bloquea)' { npx.cmd tsc --noEmit }
if ($t -ne 0) { Escribir $log 'Aviso: la revision de tipos tuvo observaciones (no impide renderizar).' 'Yellow' }

$b = Paso $log 'Navegador interno de Remotion (se descarga la primera vez)' { npx.cmd remotion browser ensure }
$c = Paso $log 'Prueba de render (3 s, sin voz)' { node scripts/prueba-render.mjs }
if ($c -eq 0) {
  Escribir $log "`nPRUEBA OK -> producciones\0000-prueba-render\prueba-render.mp4" 'Green'
  Escribir $log "Registro: $log" 'Gray'
  Start-Process explorer.exe (Join-Path $Raiz 'producciones\0000-prueba-render')
  exit 0
}
Escribir $log "`nLa prueba fallo (codigo $c). Pasale este registro a Claude: $log" 'Red'
exit 1
