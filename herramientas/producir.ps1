# PRODUCIR-VIDEO: descarga la voz pendiente, sincroniza, verifica, genera cuadros de revision y el MP4.
. (Join-Path $PSScriptRoot 'comun.ps1')
if (-not (NodeDisponible)) { Write-Host 'Falta Node.js: primero ejecuta INSTALAR-Y-PROBAR.cmd' -ForegroundColor Yellow; exit 1 }
if (-not (Test-Path (Join-Path $Raiz 'node_modules'))) { Write-Host 'Faltan dependencias: primero ejecuta INSTALAR-Y-PROBAR.cmd' -ForegroundColor Yellow; exit 1 }

$lista = ListarProducciones
if ($lista.Count -eq 0) { Write-Host 'Todavia no hay videos en producciones\. Pedile uno a Claude.' -ForegroundColor Yellow; exit 1 }
Write-Host 'Videos:' -ForegroundColor Cyan
for ($i = 0; $i -lt $lista.Count; $i++) { Write-Host ("  {0}. {1}" -f ($i + 1), $lista[$i]) }
$ultimo = $lista.Count
$r = Read-Host "Numero del video a producir [Enter = $ultimo]"
if ([string]::IsNullOrWhiteSpace($r)) { $r = $ultimo }
$n = [int]$r
if ($n -lt 1 -or $n -gt $lista.Count) { Write-Host 'Numero invalido.' -ForegroundColor Red; exit 1 }
$video = $lista[$n - 1]
$dirQa = Join-Path $Raiz "producciones\$video\qa"
New-Item -ItemType Directory -Force -Path $dirQa | Out-Null
$log = Join-Path $dirQa ("produccion-" + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.log')
$soloQa = Read-Host 'Solo cuadros de revision, sin MP4? (s/N)'
if ($soloQa -match '^[sS]') {
  $c = Paso $log "Cuadros de revision de $video" { node scripts/producir.mjs $video --solo-qa }
} else {
  $c = Paso $log "Produciendo $video" { node scripts/producir.mjs $video }
}
if ($c -eq 0) {
  Escribir $log "`nListo. Avisale a Claude para que revise los cuadros y el MP4. Registro: $log" 'Green'
  Start-Process explorer.exe (Join-Path $Raiz "producciones\$video")
  exit 0
}
Escribir $log "`nHubo un problema (codigo $c). Avisale a Claude; el detalle esta en: $log" 'Red'
exit 1
