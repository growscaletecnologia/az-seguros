# 🚀 Guia de Deploy em Produção - AZ Seguros Backend

## 📋 Pré-requisitos

### Sistema Operacional
- **Ubuntu 22.04 LTS** (recomendado)
- Mínimo 4GB RAM, 2 CPU cores
- 20GB de espaço em disco disponível

### Dependências Necessárias

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências básicas
sudo apt install -y curl wget git unzip software-properties-common

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Reiniciar para aplicar permissões do Docker
sudo reboot
```

## 🔧 Configuração Inicial

### 1. Clonar o Repositório

```bash
# Criar diretório para o projeto
sudo mkdir -p /opt/az-seguros
sudo chown $USER:$USER /opt/az-seguros
cd /opt/az-seguros

# Clonar repositório (substitua pela URL real)
git clone <URL_DO_REPOSITORIO> .
cd backend
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar variáveis (use nano, vim ou outro editor)
nano .env
```

**Variáveis obrigatórias no .env:**

```env
# Database
POSTGRES_DB=az_seguros_prod
POSTGRES_USER=az_user
POSTGRES_PASSWORD=SUA_SENHA_SUPER_SEGURA_AQUI
POSTGRES_PORT=5432

# Redis
REDIS_PORT=6379

# API
API_SECRET=SUA_CHAVE_JWT_SUPER_SEGURA_AQUI
NODE_ENV=production
API_MODE=PROD

# Timezone
TZ=America/Sao_Paulo

# Email (configure conforme seu provedor)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app

# URLs
FRONTEND_URL=https://seu-dominio.com
BACKEND_URL=https://api.seu-dominio.com
```

### 3. Configurar Permissões

```bash
# Tornar script executável
chmod +x scripts/deploy-prod.sh

# Criar diretórios necessários
sudo mkdir -p /opt/backups/az-seguros
sudo mkdir -p /var/log
sudo chown $USER:$USER /opt/backups/az-seguros
```

## 🚀 Deploy

### Deploy Completo (Primeira vez)

```bash
# Executar deploy completo
sudo ./scripts/deploy-prod.sh deploy
```

Este comando irá:
1. ✅ Verificar dependências
2. ✅ Validar arquivo .env
3. ✅ Criar diretórios necessários
4. ✅ Fazer backup (se houver dados)
5. ✅ Fazer build das imagens Docker
6. ✅ Iniciar todos os serviços
7. ✅ Executar migrações do banco
8. ✅ Verificar saúde da aplicação

### Atualizações Futuras

```bash
# Para atualizações de código
sudo ./scripts/deploy-prod.sh update
```

## 📊 Monitoramento e Manutenção

### Comandos Úteis

```bash
# Ver status dos serviços
sudo ./scripts/deploy-prod.sh status

# Ver logs em tempo real
sudo ./scripts/deploy-prod.sh logs

# Verificar saúde da aplicação
sudo ./scripts/deploy-prod.sh health

# Fazer backup manual
sudo ./scripts/deploy-prod.sh backup

# Parar serviços
sudo ./scripts/deploy-prod.sh stop

# Iniciar serviços
sudo ./scripts/deploy-prod.sh start

# Reiniciar serviços
sudo ./scripts/deploy-prod.sh restart

# Limpeza de recursos não utilizados
sudo ./scripts/deploy-prod.sh cleanup
```

### Logs Importantes

```bash
# Logs da aplicação
sudo docker-compose -f docker-compose.prod.yaml logs backend

# Logs do PostgreSQL
sudo docker-compose -f docker-compose.prod.yaml logs postgres

# Logs do Redis
sudo docker-compose -f docker-compose.prod.yaml logs redis

# Logs do sistema
sudo tail -f /var/log/az-seguros-deploy.log
```

## 🔒 Configurações de Segurança

### 1. Firewall (UFW)

```bash
# Habilitar firewall
sudo ufw enable

# Permitir SSH
sudo ufw allow ssh

# Permitir HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Permitir porta da aplicação (apenas se necessário)
sudo ufw allow 3000

# Ver status
sudo ufw status
```

### 2. SSL/TLS com Nginx (Recomendado)

```bash
# Instalar Nginx
sudo apt install nginx

# Instalar Certbot para SSL gratuito
sudo apt install certbot python3-certbot-nginx

# Configurar SSL
sudo certbot --nginx -d seu-dominio.com -d api.seu-dominio.com
```

**Configuração Nginx exemplo:**

```nginx
# /etc/nginx/sites-available/az-seguros
server {
    listen 80;
    server_name api.seu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.seu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/api.seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.seu-dominio.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Backup Automático

```bash
# Criar cron job para backup diário
sudo crontab -e

# Adicionar linha (backup às 2h da manhã)
0 2 * * * /opt/az-seguros/backend/scripts/deploy-prod.sh backup
```

## 🔧 Configurações Avançadas

### 1. Monitoramento com Prometheus + Grafana

```yaml
# Adicionar ao docker-compose.prod.yaml
  prometheus:
    image: prom/prometheus:latest
    container_name: az_prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./config/prometheus.yml:/etc/prometheus/prometheus.yml
    networks:
      - az_network

  grafana:
    image: grafana/grafana:latest
    container_name: az_grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - az_network
```

### 2. Configuração de Recursos

**Limites recomendados para produção:**

```yaml
# No docker-compose.prod.yaml
deploy:
  resources:
    limits:
      cpus: '2.0'
      memory: 2G
    reservations:
      cpus: '0.5'
      memory: 512M
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro de permissão Docker:**
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```

2. **Porta já em uso:**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

3. **Erro de migração do banco:**
   ```bash
   sudo docker-compose -f docker-compose.prod.yaml exec backend npx prisma migrate reset --force
   sudo docker-compose -f docker-compose.prod.yaml exec backend npx prisma migrate deploy
   ```

4. **Problemas de memória:**
   ```bash
   # Verificar uso de recursos
   sudo docker stats
   
   # Limpar recursos não utilizados
   sudo ./scripts/deploy-prod.sh cleanup
   ```

### Logs de Debug

```bash
# Logs detalhados do backend
sudo docker-compose -f docker-compose.prod.yaml logs backend --tail=200

# Entrar no container para debug
sudo docker-compose -f docker-compose.prod.yaml exec backend sh

# Verificar conectividade do banco
sudo docker-compose -f docker-compose.prod.yaml exec postgres psql -U az_user -d az_seguros_prod -c "\dt"
```

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs primeiro
2. Consulte a documentação do NestJS
3. Verifique issues no repositório
4. Entre em contato com a equipe de desenvolvimento

---

**⚠️ Importante:** Sempre faça backup antes de atualizações em produção!

**🔐 Segurança:** Nunca commite arquivos .env com dados sensíveis no repositório!