@echo off
REM Doble clic para ejecutar. No cierres la ventana hasta que termine.
chcp 65001 >nul
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0herramientas\producir.ps1"
echo.
pause
