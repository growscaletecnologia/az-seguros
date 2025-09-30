# 🐳 Dockerização do Backend - AZ Seguros

Este documento descreve como usar Docker para desenvolvimento e produção do backend NestJS.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Desenvolvimento Local](#desenvolvimento-local)
- [Produção](#produção)
- [Scripts Auxiliares](#scripts-auxiliares)
- [Comandos Úteis](#comandos-úteis)
- [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

O backend foi dockerizado com as seguintes características:

### ✅ **Desenvolvimento**
- **Hot-reload** automático quando o código é alterado
- **Volume mounting** para sincronização de código em tempo real
- **Debugging** habilitado
- **Banco PostgreSQL** e **Redis** em containers separados
- **PgAdmin** para gerenciamento do banco

### 🚀 **Produção**
- **Multi-stage build** otimizado para menor tamanho de imagem
- **Usuário não-root** para segurança
- **Health checks** configurados
- **Limites de recursos** definidos
- **Nginx** como reverse proxy (opcional)

## 🛠️ Desenvolvimento Local

### Pré-requisitos

- Docker Desktop instalado e rodando
- Arquivo `.env` configurado (será criado automaticamente se não existir)

### Iniciando o Ambiente

#### Opção 1: Usando Scripts (Recomendado)

**Windows (PowerShell):**
```powershell
.\scripts\docker-dev.ps1 up
```

**Linux/Mac:**
```bash
chmod +x scripts/docker-dev.sh
./scripts/docker-dev.sh up
```

#### Opção 2: Docker Compose Direto

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f backend
```

### Serviços Disponíveis

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Backend API | http://localhost:3000 | API NestJS |
| PostgreSQL | localhost:5432 | Banco de dados |
| Redis | localhost:6379 | Cache |
| PgAdmin | http://localhost:5050 | Interface do banco |

**Credenciais PgAdmin:**
- Email: `admin@admin.com`
- Senha: `admin`

### Comandos de Desenvolvimento

```bash
# Ver status dos containers
docker-compose ps

# Parar todos os serviços
docker-compose down

# Reiniciar um serviço específico
docker-compose restart backend

# Executar comandos no container
docker-compose exec backend npm run test
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npm run seed

# Abrir shell no container
docker-compose exec backend sh
```

### Hot-Reload

O hot-reload está configurado através de volume mounting:

```yaml
volumes:
  - ./src:/app/src:ro          # Código fonte
  - ./prisma:/app/prisma:ro    # Schema Prisma
  - /app/node_modules          # Evita conflitos
```

**Mudanças que ativam hot-reload:**
- ✅ Arquivos `.ts` em `src/`
- ✅ Arquivos Prisma em `prisma/`
- ❌ `package.json` (requer rebuild)
- ❌ Variáveis de ambiente (requer restart)

## 🚀 Produção

### Build para Produção

```bash
# Build da imagem de produção
docker build --target production -t az-backend:prod .

# Ou usando docker-compose
docker-compose -f docker-compose.prod.yaml build
```

### Deploy em Produção

```bash
# Iniciar em produção
docker-compose -f docker-compose.prod.yaml up -d

# Verificar status
docker-compose -f docker-compose.prod.yaml ps

# Ver logs
docker-compose -f docker-compose.prod.yaml logs -f backend
```

### Configurações de Produção

#### Otimizações Implementadas:

1. **Multi-stage Build**
   - Imagem final menor (~200MB vs ~800MB)
   - Apenas dependências de produção
   - Código compilado (JavaScript)

2. **Segurança**
   - Usuário não-root (`nestjs:nodejs`)
   - Filesystem read-only
   - Sem privilégios elevados

3. **Performance**
   - Limites de CPU e memória
   - PostgreSQL otimizado
   - Redis com configurações de produção

4. **Monitoramento**
   - Health checks configurados
   - Logs estruturados
   - Métricas de recursos

## 🔧 Scripts Auxiliares

### Windows (PowerShell)

```powershell
# Comandos disponíveis
.\scripts\docker-dev.ps1 help

# Exemplos
.\scripts\docker-dev.ps1 up          # Iniciar serviços
.\scripts\docker-dev.ps1 logs        # Ver logs
.\scripts\docker-dev.ps1 shell       # Abrir shell
.\scripts\docker-dev.ps1 db-migrate  # Executar migrações
.\scripts\docker-dev.ps1 db-seed     # Executar seed
.\scripts\docker-dev.ps1 clean       # Limpar recursos
```

### Linux/Mac (Bash)

```bash
# Comandos disponíveis
./scripts/docker-dev.sh help

# Exemplos
./scripts/docker-dev.sh up          # Iniciar serviços
./scripts/docker-dev.sh logs        # Ver logs
./scripts/docker-dev.sh shell       # Abrir shell
./scripts/docker-dev.sh db-migrate  # Executar migrações
./scripts/docker-dev.sh db-seed     # Executar seed
./scripts/docker-dev.sh clean       # Limpar recursos
```

## 📝 Comandos Úteis

### Gerenciamento de Containers

```bash
# Listar containers rodando
docker ps

# Parar todos os containers
docker stop $(docker ps -q)

# Remover containers parados
docker container prune

# Ver uso de recursos
docker stats
```

### Gerenciamento de Imagens

```bash
# Listar imagens
docker images

# Remover imagens não utilizadas
docker image prune

# Rebuild sem cache
docker-compose build --no-cache backend
```

### Banco de Dados

```bash
# Conectar ao PostgreSQL
docker-compose exec postgres psql -U $POSTGRES_USER -d $POSTGRES_DB

# Backup do banco
docker-compose exec postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U $POSTGRES_USER -d $POSTGRES_DB < backup.sql
```

### Logs e Debugging

```bash
# Logs de um serviço específico
docker-compose logs -f backend

# Logs com timestamp
docker-compose logs -f -t backend

# Últimas 100 linhas
docker-compose logs --tail=100 backend

# Inspecionar container
docker inspect az_backend_dev
```

## 🔍 Troubleshooting

### Problemas Comuns

#### 1. **Container não inicia**

```bash
# Verificar logs
docker-compose logs backend

# Verificar se as portas estão livres
netstat -tulpn | grep :3000

# Verificar variáveis de ambiente
docker-compose exec backend env
```

#### 2. **Hot-reload não funciona**

```bash
# Verificar volumes montados
docker-compose exec backend ls -la /app/src

# Reiniciar container
docker-compose restart backend

# Verificar se o arquivo está sendo sincronizado
docker-compose exec backend cat /app/src/main.ts
```

#### 3. **Erro de conexão com banco**

```bash
# Verificar se o PostgreSQL está rodando
docker-compose ps postgres

# Testar conexão
docker-compose exec backend npx prisma db pull

# Verificar logs do banco
docker-compose logs postgres
```

#### 4. **Problemas de permissão**

```bash
# No Linux/Mac, ajustar permissões
sudo chown -R $USER:$USER .

# Verificar usuário no container
docker-compose exec backend whoami
```

#### 5. **Falta de espaço em disco**

```bash
# Limpar recursos não utilizados
docker system prune -a

# Verificar uso de espaço
docker system df

# Remover volumes não utilizados
docker volume prune
```

### Comandos de Diagnóstico

```bash
# Informações do Docker
docker info

# Verificar saúde dos containers
docker-compose ps

# Inspecionar rede
docker network ls
docker network inspect backend_az_network

# Verificar volumes
docker volume ls
docker volume inspect backend_pgdata
```

## 📊 Monitoramento

### Health Checks

Todos os serviços possuem health checks configurados:

```bash
# Verificar saúde dos serviços
docker-compose ps

# Status detalhado
docker inspect --format='{{.State.Health.Status}}' az_backend_dev
```

### Métricas de Recursos

```bash
# Uso de recursos em tempo real
docker stats

# Uso de espaço
docker system df

# Logs de sistema
docker events
```

## 🔄 Workflow de Desenvolvimento vs Produção

### Desenvolvimento Local

1. **Código é montado via volume** - mudanças refletem imediatamente
2. **Hot-reload ativo** - servidor reinicia automaticamente
3. **Debugging habilitado** - sourcemaps disponíveis
4. **PgAdmin disponível** - interface gráfica do banco
5. **Logs verbosos** - informações detalhadas

### Produção

1. **Código compilado na imagem** - não há volumes de código
2. **Processo otimizado** - apenas JavaScript compilado
3. **Usuário não-root** - maior segurança
4. **Limites de recursos** - CPU e memória controlados
5. **Health checks** - monitoramento automático

## 🚀 Deploy e Atualizações

### Desenvolvimento Local

**Não é necessário acessar o container** para atualizações:
- Mudanças no código são refletidas automaticamente
- Hot-reload cuida das atualizações
- Apenas reinicie se mudar `package.json` ou variáveis de ambiente

### Produção

**Para atualizações em produção:**

```bash
# 1. Build nova imagem
docker-compose -f docker-compose.prod.yaml build backend

# 2. Parar serviço atual
docker-compose -f docker-compose.prod.yaml stop backend

# 3. Iniciar nova versão
docker-compose -f docker-compose.prod.yaml up -d backend

# 4. Verificar saúde
docker-compose -f docker-compose.prod.yaml ps backend
```

**Zero-downtime deployment:**

```bash
# 1. Build nova imagem com tag
docker build --target production -t az-backend:v2.0 .

# 2. Atualizar docker-compose.prod.yaml com nova tag
# 3. Rolling update
docker-compose -f docker-compose.prod.yaml up -d --no-deps backend
```

---

## 📞 Suporte

Para problemas ou dúvidas sobre a dockerização:

1. Verifique os logs: `docker-compose logs backend`
2. Consulte este documento
3. Verifique issues conhecidos no repositório
4. Entre em contato com a equipe de desenvolvimento

---

**Última atualização:** Janeiro 2025