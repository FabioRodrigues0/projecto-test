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

# Inicia o servidor PHP (em background)
echo "Iniciando servidor PHP..."
php -S localhost:8000 -t backend/public > /dev/null 2>&1 &

# Inicia o frontend React
echo "Iniciando React..."
cd frontend || { echo "Erro: Pasta 'frontend' não encontrada!"; exit 1; }
npm run start
