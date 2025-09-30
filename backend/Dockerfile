# Multi-stage Dockerfile para NestJS Backend
# Otimizado para produção com cache de dependências

# ===============================================
# Stage 1: Base - Configuração comum
# ===============================================
FROM node:22-alpine AS base

# Instalar dependências do sistema necessárias
RUN apk add --no-cache \
    dumb-init \
    curl \
    && rm -rf /var/cache/apk/*

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração do package
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# ===============================================
# Stage 2: Dependencies - Instalar dependências
# ===============================================
FROM base AS deps

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm ci --only=production=false && \
    npm cache clean --force

# ===============================================
# Stage 3: Builder - Build da aplicação
# ===============================================
FROM base AS builder

# Copiar dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY src ./src

# Gerar Prisma Client (o schema está em src/prisma/)
RUN npx prisma generate --schema=./src/prisma/schema.prisma

# Build da aplicação
RUN npm run build && \
    npm prune --production && \
    npm cache clean --force

# ===============================================
# Stage 4: Development - Para desenvolvimento local
# ===============================================
FROM base AS development

# Instalar dependências de desenvolvimento
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate --schema=./src/prisma/schema.prisma

# Expor porta
EXPOSE 3000

# Usar dumb-init para gerenciar processos
ENTRYPOINT ["dumb-init", "--"]

# Comando padrão para desenvolvimento (com hot-reload)
CMD ["npm", "run", "start:dev"]

# ===============================================
# Stage 5: Production - Para produção
# ===============================================
FROM node:22-alpine AS production

# Instalar apenas dependências mínimas do sistema
RUN apk add --no-cache dumb-init curl && \
    rm -rf /var/cache/apk/*

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar apenas os arquivos necessários para produção
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/src/prisma ./src/prisma

# Definir variáveis de ambiente para produção
ENV NODE_ENV=production
ENV PORT=3000

# Mudar para usuário não-root
USER nestjs

# Expor porta
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Usar dumb-init para gerenciar processos
ENTRYPOINT ["dumb-init", "--"]

# Comando padrão para produção
CMD ["node", "dist/main.js"]