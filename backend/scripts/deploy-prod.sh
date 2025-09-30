#!/bin/bash

# Script para Deploy em Produção - Ubuntu 22 LTS
# AZ Seguros Backend - NestJS com Docker

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configurações
PROJECT_NAME="az-seguros"
BACKUP_DIR="/opt/backups/${PROJECT_NAME}"
LOG_FILE="/var/log/${PROJECT_NAME}-deploy.log"

# Função para logging
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Função para exibir ajuda
show_help() {
    echo -e "${BLUE}🚀 Deploy em Produção - AZ Seguros Backend${NC}"
    echo ""
    echo "Uso: $0 [COMANDO]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  deploy      - Deploy completo em produção"
    echo "  backup      - Fazer backup do banco de dados"
    echo "  restore     - Restaurar backup do banco"
    echo "  update      - Atualizar aplicação (pull + rebuild)"
    echo "  logs        - Mostrar logs da aplicação"
    echo "  status      - Status dos serviços"
    echo "  stop        - Parar todos os serviços"
    echo "  start       - Iniciar todos os serviços"
    echo "  restart     - Reiniciar todos os serviços"
    echo "  cleanup     - Limpeza de recursos não utilizados"
    echo "  health      - Verificar saúde da aplicação"
    echo "  help        - Mostrar esta ajuda"
}

# Verificar se está rodando como root ou com sudo
check_permissions() {
    if [[ $EUID -ne 0 ]]; then
        error "Este script deve ser executado como root ou com sudo"
    fi
}

# Verificar dependências do sistema
check_dependencies() {
    log "🔍 Verificando dependências do sistema..."
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        error "Docker não está instalado"
    fi
    
    # Verificar Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose não está instalado"
    fi
    
    # Verificar Git
    if ! command -v git &> /dev/null; then
        error "Git não está instalado"
    fi
    
    success "Todas as dependências estão instaladas"
}

# Verificar arquivo .env
check_env_file() {
    log "📋 Verificando arquivo .env..."
    
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            warning "Arquivo .env não encontrado. Copiando de .env.example..."
            cp .env.example .env
            error "Configure as variáveis no arquivo .env antes de continuar"
        else
            error "Arquivo .env.example não encontrado"
        fi
    fi
    
    # Verificar variáveis obrigatórias
    required_vars=("POSTGRES_DB" "POSTGRES_USER" "POSTGRES_PASSWORD" "API_SECRET")
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" .env; then
            error "Variável ${var} não encontrada no arquivo .env"
        fi
    done
    
    success "Arquivo .env configurado corretamente"
}

# Criar diretórios necessários
create_directories() {
    log "📁 Criando diretórios necessários..."
    
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$(dirname "$LOG_FILE")"
    mkdir -p "./uploads/posts"
    mkdir -p "./config"
    
    success "Diretórios criados"
}

# Fazer backup do banco de dados
backup_database() {
    log "💾 Fazendo backup do banco de dados..."
    
    if docker-compose -f docker-compose.prod.yaml ps postgres | grep -q "Up"; then
        BACKUP_FILE="${BACKUP_DIR}/backup_$(date +%Y%m%d_%H%M%S).sql"
        
        docker-compose -f docker-compose.prod.yaml exec -T postgres pg_dump \
            -U "${POSTGRES_USER}" \
            -d "${POSTGRES_DB}" > "$BACKUP_FILE"
        
        # Comprimir backup
        gzip "$BACKUP_FILE"
        
        success "Backup criado: ${BACKUP_FILE}.gz"
        
        # Manter apenas os últimos 7 backups
        find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +7 -delete
    else
        warning "PostgreSQL não está rodando, pulando backup"
    fi
}

# Restaurar backup
restore_database() {
    if [ -z "$1" ]; then
        error "Especifique o arquivo de backup: $0 restore <arquivo_backup.sql.gz>"
    fi
    
    BACKUP_FILE="$1"
    
    if [ ! -f "$BACKUP_FILE" ]; then
        error "Arquivo de backup não encontrado: $BACKUP_FILE"
    fi
    
    log "🔄 Restaurando backup: $BACKUP_FILE"
    
    # Descomprimir se necessário
    if [[ "$BACKUP_FILE" == *.gz ]]; then
        gunzip -c "$BACKUP_FILE" | docker-compose -f docker-compose.prod.yaml exec -T postgres psql \
            -U "${POSTGRES_USER}" \
            -d "${POSTGRES_DB}"
    else
        docker-compose -f docker-compose.prod.yaml exec -T postgres psql \
            -U "${POSTGRES_USER}" \
            -d "${POSTGRES_DB}" < "$BACKUP_FILE"
    fi
    
    success "Backup restaurado com sucesso"
}

# Deploy completo
deploy() {
    log "🚀 Iniciando deploy em produção..."
    
    # Verificações iniciais
    check_permissions
    check_dependencies
    check_env_file
    create_directories
    
    # Fazer backup antes do deploy
    backup_database
    
    # Parar serviços existentes
    log "⏹️  Parando serviços existentes..."
    docker-compose -f docker-compose.prod.yaml down --remove-orphans
    
    # Atualizar código (se estiver em um repositório Git)
    if [ -d ".git" ]; then
        log "📥 Atualizando código..."
        git pull origin main || git pull origin master
    fi
    
    # Build das imagens
    log "🔨 Fazendo build das imagens..."
    docker-compose -f docker-compose.prod.yaml build --no-cache
    
    # Iniciar serviços
    log "▶️  Iniciando serviços..."
    docker-compose -f docker-compose.prod.yaml up -d
    
    # Aguardar serviços ficarem prontos
    log "⏳ Aguardando serviços ficarem prontos..."
    sleep 30
    
    # Executar migrações
    log "🗃️  Executando migrações do banco..."
    docker-compose -f docker-compose.prod.yaml exec backend npx prisma migrate deploy
    
    # Verificar saúde da aplicação
    health_check
    
    success "🎉 Deploy concluído com sucesso!"
    log "📊 Acesse os logs com: $0 logs"
    log "📈 Verifique o status com: $0 status"
}

# Atualizar aplicação
update() {
    log "🔄 Atualizando aplicação..."
    
    backup_database
    
    if [ -d ".git" ]; then
        git pull origin main || git pull origin master
    fi
    
    docker-compose -f docker-compose.prod.yaml build --no-cache
    docker-compose -f docker-compose.prod.yaml up -d
    
    # Executar migrações
    docker-compose -f docker-compose.prod.yaml exec backend npx prisma migrate deploy
    
    success "Aplicação atualizada"
}

# Verificar saúde da aplicação
health_check() {
    log "🏥 Verificando saúde da aplicação..."
    
    # Verificar se os containers estão rodando
    if ! docker-compose -f docker-compose.prod.yaml ps | grep -q "Up"; then
        error "Alguns serviços não estão rodando"
    fi
    
    # Verificar endpoint de health
    sleep 10
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        success "✅ Aplicação está saudável"
    else
        error "❌ Aplicação não está respondendo no endpoint de health"
    fi
}

# Limpeza de recursos
cleanup() {
    log "🧹 Limpando recursos não utilizados..."
    
    docker system prune -f
    docker volume prune -f
    docker image prune -f
    
    success "Limpeza concluída"
}

# Comandos principais
case "$1" in
    "deploy")
        deploy
        ;;
    
    "backup")
        backup_database
        ;;
    
    "restore")
        restore_database "$2"
        ;;
    
    "update")
        update
        ;;
    
    "logs")
        docker-compose -f docker-compose.prod.yaml logs -f --tail=100 backend
        ;;
    
    "status")
        echo -e "${BLUE}📊 Status dos containers:${NC}"
        docker-compose -f docker-compose.prod.yaml ps
        echo ""
        echo -e "${BLUE}💾 Uso de recursos:${NC}"
        docker stats --no-stream
        ;;
    
    "stop")
        log "⏹️  Parando serviços..."
        docker-compose -f docker-compose.prod.yaml down
        success "Serviços parados"
        ;;
    
    "start")
        log "▶️  Iniciando serviços..."
        docker-compose -f docker-compose.prod.yaml up -d
        success "Serviços iniciados"
        ;;
    
    "restart")
        log "🔄 Reiniciando serviços..."
        docker-compose -f docker-compose.prod.yaml restart
        success "Serviços reiniciados"
        ;;
    
    "cleanup")
        cleanup
        ;;
    
    "health")
        health_check
        ;;
    
    "help"|"")
        show_help
        ;;
    
    *)
        error "Comando desconhecido: $1"
        show_help
        exit 1
        ;;
esac