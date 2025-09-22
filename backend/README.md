# AZ Seguros - Backend

Este é o backend da aplicação AZ Seguros, desenvolvido com NestJS e Prisma ORM.

## Tecnologias Utilizadas

- **Node.js**: v22+
- **NestJS**: v11.1.6
- **Prisma ORM**: v6.15.0
- **Banco de Dados**: MariaDB/MySQL
- **Autenticação**: JWT, Passport
- **Cache**: Redis
- **Email**: Nodemailer
- **Documentação**: Swagger
- **Validação**: class-validator, class-transformer
- **Segurança**: Helmet, bcrypt

## Pré-requisitos

- Node.js v22+
- npm ou yarn
- Docker (recomendado para o banco de dados e Redis)

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd az-seguros/backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env`
   - Preencha as variáveis necessárias (banco de dados, Redis, SMTP, etc.)
```bash
cp .env.example .env
```

4. Inicie os serviços com Docker (opcional, mas recomendado):
```bash
docker-compose up -d
```

5. Execute as migrações do Prisma:
```bash
npx prisma migrate dev
```

## Executando o Projeto

### Ambiente de Desenvolvimento
```bash
npm run start:dev
```

### Ambiente de Produção
```bash
npm run build
npm run start:prod
```

### Testes
```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## Acessando o Swagger

A documentação da API está disponível através do Swagger UI. Após iniciar o servidor, acesse:

```
http://localhost:5000/api/docs
```

O Swagger fornece uma interface interativa para:
- Visualizar todos os endpoints disponíveis
- Testar as requisições diretamente pelo navegador
- Verificar os modelos de dados e DTOs
- Autenticar-se para testar endpoints protegidos

Para autenticar no Swagger:
1. Acesse o endpoint `/auth/login` e obtenha um token JWT
2. Clique no botão "Authorize" no topo da página
3. Insira o token no formato: `Bearer [seu-token]`
4. Agora você pode acessar os endpoints protegidos

## Estrutura do Projeto

```
src/
├── address/         # Módulo de endereços
├── admin/           # Módulo administrativo
├── auth/            # Autenticação e autorização
├── checkout/        # Processo de checkout
├── common/          # Utilitários comuns
├── email/           # Serviço de email
├── entities/        # Entidades de domínio
├── enums/           # Enumerações
├── prisma/          # Cliente e configurações do Prisma
├── redis/           # Configuração do Redis
├── users/           # Gerenciamento de usuários
└── main.ts          # Ponto de entrada da aplicação
```

## Contribuição

1. Certifique-se de seguir os padrões de código do projeto
2. Execute os testes antes de enviar um pull request
3. Mantenha a documentação atualizada

## Suporte

Para suporte, entre em contato com a equipe de desenvolvimento.
