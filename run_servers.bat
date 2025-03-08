@echo off
echo Detectando sistema operacional...

:: Verifica se está no Windows
ver | find "Windows" > nul
if %ERRORLEVEL% == 0 (
    echo Sistema detectado: Windows
    powershell -ExecutionPolicy Bypass -File server.ps1
    exit
)

:: Caso contrário, assume que é Linux/macOS/WSL
echo Sistema detectado: Linux/macOS
bash server.sh
