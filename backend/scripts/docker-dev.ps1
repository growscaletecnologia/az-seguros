# Script PowerShell para desenvolvimento com Docker
# Facilita comandos comuns durante o desenvolvimento

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

# Função para exibir mensagens coloridas
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    } else {
        $input | Write-Output
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

# Função para exibir ajuda
function Show-Help {
    Write-ColorOutput Blue "Docker Development Helper"
    Write-Output ""
    Write-Output "Uso: .\docker-dev.ps1 [COMANDO]"
    Write-Output ""
    Write-Output "Comandos disponíveis:"
    Write-Output "  up          - Iniciar todos os servicos em modo desenvolvimento"
    Write-Output "  down        - Parar todos os servicos"
    Write-Output "  restart     - Reiniciar todos os servicos"
    Write-Output "  logs        - Mostrar logs do backend"
    Write-Output "  shell       - Abrir shell no container do backend"
    Write-Output "  db-migrate  - Executar migracoes do Prisma"
    Write-Output "  db-seed     - Executar seed do banco de dados"
    Write-Output "  db-reset    - Resetar banco de dados (migrate + seed)"
    Write-Output "  db-studio   - Abrir Prisma Studio para visualizar o banco"
    Write-Output "  build       - Rebuild das imagens Docker"
    Write-Output "  clean       - Limpar containers, imagens e volumes nao utilizados"
    Write-Output "  status      - Mostrar status dos containers"
    Write-Output "  help        - Mostrar esta ajuda"
}

# Função para verificar se o Docker está rodando
function Test-Docker {
    try {
        docker info | Out-Null
        return $true
    } catch {
        Write-ColorOutput Red "Docker nao esta rodando. Por favor, inicie o Docker primeiro."
        exit 1
    }
}

# Função para verificar se o arquivo .env existe
function Test-EnvFile {
    if (-not (Test-Path ".env")) {
        Write-ColorOutput Yellow "Arquivo .env nao encontrado. Copiando de .env.example..."
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
            Write-ColorOutput Green "Arquivo .env criado. Por favor, configure as variaveis necessarias."
        } else {
            Write-ColorOutput Red "Arquivo .env.example nao encontrado."
            exit 1
        }
    }
}

# Executar comandos baseado no parâmetro
switch ($Command.ToLower()) {
    "up" {
        Write-ColorOutput Blue "Iniciando servicos em modo desenvolvimento..."
        Test-Docker
        Test-EnvFile
        docker-compose up -d
        Write-ColorOutput Green "Servicos iniciados!"
        Write-ColorOutput Yellow "Para ver os logs: .\docker-dev.ps1 logs"
    }
    
    "down" {
        Write-ColorOutput Blue "Parando servicos..."
        Test-Docker
        docker-compose down
        Write-ColorOutput Green "Servicos parados!"
    }
    
    "restart" {
        Write-ColorOutput Blue "Reiniciando servicos..."
        Test-Docker
        docker-compose restart
        Write-ColorOutput Green "Servicos reiniciados!"
    }
    
    "logs" {
        Write-ColorOutput Blue "Mostrando logs do backend..."
        Test-Docker
        docker-compose logs -f backend
    }
    
    "shell" {
        Write-ColorOutput Blue "Abrindo shell no container do backend..."
        Test-Docker
        docker-compose exec backend sh
    }
    
    "db-migrate" {
        Write-ColorOutput Blue "Executando migracoes do banco..."
        Test-Docker
        docker-compose exec backend npx prisma migrate dev
        Write-ColorOutput Green "Migracoes executadas!"
    }
    
    "db-seed" {
        Write-ColorOutput Blue "Executando seed do banco..."
        Test-Docker
        docker-compose exec backend npm run seed
        Write-ColorOutput Green "Seed executado!"
    }
    
    "db-reset" {
        Write-ColorOutput Blue "Resetando banco de dados..."
        Test-Docker
        docker-compose exec backend npx prisma migrate reset --force
        Write-ColorOutput Green "Banco resetado!"
    }
    
    "db-studio" {
        Write-ColorOutput Blue "Abrindo Prisma Studio..."
        Write-ColorOutput Yellow "Prisma Studio estará disponível em: http://localhost:5555"
        Write-ColorOutput Yellow "Pressione Ctrl+C para parar o Prisma Studio"
        Test-Docker
        docker-compose exec backend npx prisma studio --port 5555 --hostname 0.0.0.0
    }
    
    "build" {
        Write-ColorOutput Blue "Rebuilding imagens Docker..."
        Test-Docker
        docker-compose build --no-cache
        Write-ColorOutput Green "Build concluido!"
    }
    
    "clean" {
        Write-ColorOutput Blue "Limpando recursos Docker nao utilizados..."
        Test-Docker
        docker system prune -f
        docker volume prune -f
        Write-ColorOutput Green "Limpeza concluida!"
    }
    
    "status" {
        Write-ColorOutput Blue "Status dos containers:"
        Test-Docker
        docker-compose ps
    }
    
    "help" {
        Show-Help
    }
    
    default {
        Write-ColorOutput Red "Comando desconhecido: $Command"
        Write-Output ""
        Show-Help
        exit 1
    }
}