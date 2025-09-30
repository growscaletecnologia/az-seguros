#!/bin/bash

# Script para desenvolvimento com Docker
# Facilita comandos comuns durante o desenvolvimento

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para exibir ajuda
show_help() {
    echo -e "${BLUE}Docker Development Helper${NC}"
    echo ""
    echo "Uso: $0 [COMANDO]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  up          - Iniciar todos os serviços em modo desenvolvimento"
    echo "  down        - Parar todos os serviços"
    echo "  restart     - Reiniciar todos os serviços"
    echo "  logs        - Mostrar logs do backend"
    echo "  shell       - Abrir shell no container do backend"
    echo "  db-migrate  - Executar migrações do Prisma"
    echo "  db-seed     - Executar seed do banco de dados"
    echo "  db-reset    - Resetar banco de dados (migrate + seed)"
    echo "  build       - Rebuild das imagens Docker"
    echo "  clean       - Limpar containers, imagens e volumes não utilizados"
    echo "  status      - Mostrar status dos containers"
    echo "  help        - Mostrar esta ajuda"
}

# Função para verificar se o Docker está rodando
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker não está rodando. Por favor, inicie o Docker primeiro.${NC}"
        exit 1
    fi
}

# Função para verificar se o arquivo .env existe
check_env() {
    if [ ! -f .env ]; then
        echo -e "${YELLOW}⚠️  Arquivo .env não encontrado. Copiando de .env.example...${NC}"
        if [ -f .env.example ]; then
            cp .env.example .env
            echo -e "${GREEN}✅ Arquivo .env criado. Por favor, configure as variáveis necessárias.${NC}"
        else
            echo -e "${RED}❌ Arquivo .env.example não encontrado.${NC}"
            exit 1
        fi
    fi
}

# Comandos
case "$1" in
    "up")
        echo -e "${BLUE}🚀 Iniciando serviços em modo desenvolvimento...${NC}"
        check_docker
        check_env
        docker-compose up -d
        echo -e "${GREEN}✅ Serviços iniciados!${NC}"
        echo -e "${YELLOW}📝 Para ver os logs: $0 logs${NC}"
        ;;
    
    "down")
        echo -e "${BLUE}🛑 Parando serviços...${NC}"
        check_docker
        docker-compose down
        echo -e "${GREEN}✅ Serviços parados!${NC}"
        ;;
    
    "restart")
        echo -e "${BLUE}🔄 Reiniciando serviços...${NC}"
        check_docker
        docker-compose restart
        echo -e "${GREEN}✅ Serviços reiniciados!${NC}"
        ;;
    
    "logs")
        echo -e "${BLUE}📋 Mostrando logs do backend...${NC}"
        check_docker
        docker-compose logs -f backend
        ;;
    
    "shell")
        echo -e "${BLUE}🐚 Abrindo shell no container do backend...${NC}"
        check_docker
        docker-compose exec backend sh
        ;;
    
    "db-migrate")
        echo -e "${BLUE}🗃️  Executando migrações do banco...${NC}"
        check_docker
        docker-compose exec backend npx prisma migrate dev
        echo -e "${GREEN}✅ Migrações executadas!${NC}"
        ;;
    
    "db-seed")
        echo -e "${BLUE}🌱 Executando seed do banco...${NC}"
        check_docker
        docker-compose exec backend npm run seed
        echo -e "${GREEN}✅ Seed executado!${NC}"
        ;;
    
    "db-reset")
        echo -e "${BLUE}🔄 Resetando banco de dados...${NC}"
        check_docker
        docker-compose exec backend npx prisma migrate reset --force
        echo -e "${GREEN}✅ Banco resetado!${NC}"
        ;;
    
    "build")
        echo -e "${BLUE}🔨 Rebuilding imagens Docker...${NC}"
        check_docker
        docker-compose build --no-cache
        echo -e "${GREEN}✅ Build concluído!${NC}"
        ;;
    
    "clean")
        echo -e "${BLUE}🧹 Limpando recursos Docker não utilizados...${NC}"
        check_docker
        docker system prune -f
        docker volume prune -f
        echo -e "${GREEN}✅ Limpeza concluída!${NC}"
        ;;
    
    "status")
        echo -e "${BLUE}📊 Status dos containers:${NC}"
        check_docker
        docker-compose ps
        ;;
    
    "help"|"")
        show_help
        ;;
    
    *)
        echo -e "${RED}❌ Comando desconhecido: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac