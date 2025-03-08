# Detecta o sistema operacional
$OS = $env:OS

if ($OS -match "Windows_NT") {
    $SYSTEM = "Windows"
} else {
    $SYSTEM = "Desconhecido"
}

Write-Host "Sistema detectado: $SYSTEM"

# Função para verificar se um comando existe
function CommandExists($cmd) {
    return !!(Get-Command $cmd -ErrorAction SilentlyContinue)
}

# Verifica se PHP e NPM estão instalados
$commands = @("php", "npm")

foreach ($cmd in $commands) {
    if (!(CommandExists $cmd)) {
        Write-Host "Erro: $cmd não está instalado. Instale e tente novamente."
        exit 1
    }
}

# Inicia o servidor PHP em segundo plano
Write-Host "Iniciando servidor PHP..."
Start-Process -NoNewWindow -FilePath "php" -ArgumentList "-S localhost:8000 -t backend/public"

# Verifica se a pasta frontend existe antes de iniciar React
$frontendPath = "frontend"
if (!(Test-Path $frontendPath)) {
    Write-Host "Erro: Pasta 'frontend' não encontrada!"
    exit 1
}

# Inicia o frontend React
Write-Host "Iniciando React..."
Set-Location -Path $frontendPath
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run start"
