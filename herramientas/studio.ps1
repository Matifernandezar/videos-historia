# ABRIR-STUDIO: abre Remotion Studio (demo y referencias, o un video).
. (Join-Path $PSScriptRoot 'comun.ps1')
if (-not (Test-Path (Join-Path $Raiz 'node_modules'))) { Write-Host 'Faltan dependencias: primero ejecuta INSTALAR-Y-PROBAR.cmd' -ForegroundColor Yellow; exit 1 }
$lista = ListarProducciones
Write-Host '  0. Demo, prueba de render y referencias (personaje e ilustraciones)' -ForegroundColor Cyan
for ($i = 0; $i -lt $lista.Count; $i++) { Write-Host ("  {0}. {1}" -f ($i + 1), $lista[$i]) }
$r = Read-Host 'Que abrir? [Enter = 0]'
if ([string]::IsNullOrWhiteSpace($r) -or $r -eq '0') { node scripts/studio.mjs; exit $LASTEXITCODE }
$n = [int]$r
if ($n -lt 1 -or $n -gt $lista.Count) { Write-Host 'Numero invalido.' -ForegroundColor Red; exit 1 }
node scripts/studio.mjs $lista[$n - 1]
