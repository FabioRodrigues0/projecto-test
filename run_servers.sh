#!/bin/bash

# Detecta o sistema operacional
OS="$(uname -s)"

case "$OS" in
    Linux*)   SYSTEM="Linux" ;;
    Darwin*)  SYSTEM="macOS" ;;
    CYGWIN*|MINGW*|MSYS*|MINGW32*|MINGW64*) SYSTEM="Windows" ;;
    *)        SYSTEM="Desconhecido" ;;
esac

echo "Sistema detectado: $SYSTEM"

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verifica se PHP e NPM estão instalados
for cmd in php npm; do
    if ! command_exists "$cmd"; then
        echo "Erro: $cmd não está instalado. Instale e tente novamente."
        exit 1
    fi
done

# Captura sinais de interrupção (Ctrl+C) para encerrar os processos corretamente
cleanup() {
    echo "Encerrando servidores..."
    kill -9 $PHP_PID $REACT_PID 2>/dev/null
    pkill -f "php -S localhost:8000"  # Mata qualquer instância remanescente do PHP
    exit 0
}
trap cleanup SIGINT SIGTERM

# Inicia o servidor PHP em background
echo "Iniciando servidor PHP..."
php -S localhost:8000 -t backend/public &
PHP_PID=$!  # Captura o PID do processo PHP

# Inicia o frontend React em background
echo "Iniciando React..."
cd frontend || { echo "Erro: Pasta 'frontend' não encontrada!"; exit 1; }
npm run start &
REACT_PID=$!  # Captura o PID do processo React

# Aguarda os processos rodarem
wait $PHP_PID $REACT_PID
