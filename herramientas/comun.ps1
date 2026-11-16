# Funciones comunes de los lanzadores (Windows PowerShell 5.1 o superior).
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$Raiz = Split-Path -Parent $PSScriptRoot
Set-Location $Raiz
New-Item -ItemType Directory -Force -Path (Join-Path $Raiz 'logs') | Out-Null

function Escribir($log, $texto, $color = 'Gray') {
  Write-Host $texto -ForegroundColor $color
  Add-Content -Path $log -Value $texto -Encoding UTF8
}

# Ejecuta un comando externo mostrando y guardando la salida. Devuelve el codigo de salida.
function Paso($log, $titulo, [scriptblock]$comando) {
  Escribir $log "`n== $titulo ==" 'Cyan'
  & $comando 2>&1 | ForEach-Object {
    $linea = "$_"
    Write-Host $linea
    Add-Content -Path $log -Value $linea -Encoding UTF8
  }
  return $LASTEXITCODE
}

function NodeDisponible() {
  return [bool](Get-Command node -ErrorAction SilentlyContinue)
}

function ListarProducciones() {
  $dir = Join-Path $Raiz 'producciones'
  if (-not (Test-Path $dir)) { return @() }
  return @(Get-ChildItem $dir -Directory | Where-Object {
    $_.Name -notlike '_*' -and $_.Name -notlike '0000-*' -and (Test-Path (Join-Path $_.FullName 'video.json'))
  } | Sort-Object Name | ForEach-Object { $_.Name })
}
