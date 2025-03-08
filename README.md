### Instalação

correr conteudo do ./backend/config/queries.sql na base de dados para ter as tabelas necessárias

# Comandos, pela ordem

cd backend
composer install
cd ..
cd frontend
npm install

### Comandos iniciar servidor dependendo do sistema operativo e terminal

  - Apartir da raiz do projeto

## Linux, Mac e WSL

  chmod +x run_servers.sh

  ./run_servers.sh

## Windows com Powershell

  .\run_servers.ps1

  - Se o Windows bloquear a execução, ative scripts:

  Set-ExecutionPolicy Unrestricted -Scope CurrentUser

  .\run_servers.ps1


## Windows com CMD

  run_servers.bat
