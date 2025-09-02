# Projeto Seguros Viagem - Versão Atualizada

Este projeto foi desenvolvido e atualizado com base nas especificações fornecidas, incluindo sistema de autenticação com roles, área administrativa completa, área do cliente e funcionalidades de comparação de produtos.

## 🚀 Funcionalidades Implementadas

### Sistema de Autenticação e Roles
- ✅ Login funcional com redirecionamento baseado em roles
- ✅ Roles: Admin, Cliente, Gerente
- ✅ Controle de acesso por permissões (ver, editar, criar, excluir)

### Área Administrativa
- ✅ **Dashboard Admin** (`/admin/painel`)
- ✅ **Módulo Blog** (`/admin/blog`)
  - Criação, edição e listagem de posts
  - Status: publicado/rascunho
- ✅ **Módulo Integrações** (`/admin/integrations`)
  - Configuração de seguradoras
  - Token de acesso e markup
  - Opção "não configurar markup"
- ✅ **Módulo Cupons** (`/admin/cupons`)
  - Criação de cupons de desconto
  - Data de expiração
  - Limite de uso
- ✅ **Gestão de Usuários** (`/admin/usuarios`)
  - CRUD completo de usuários
  - Atribuição de roles e permissões
  - Sistema de radio buttons para permissões
- ✅ **Área de Pedidos** (`/admin/pedidos`)
  - Listagem de vendas
  - Filtro por cliente
  - Exportação para Excel (mock)
- ✅ **Gestão de Conteúdos** (`/admin/conteudos`)
  - Editor de conteúdo para páginas, banners, FAQ, termos

### Área do Cliente
- ✅ **Dashboard do Cliente** (`/cliente`)
- ✅ **Funcionalidade de Envio por E-mail**
  - Botão para enviar detalhes da apólice por e-mail
  - Simulação de envio

### Funcionalidades de Produto e Comparação
- ✅ **Detalhamento de Produtos**
  - Lista detalhada de coberturas conforme imagens fornecidas
  - Estrutura de dados em `src/lib/mock-products.ts`
- ✅ **Página de Comparação** (`/comparacao`)
  - Comparação lado a lado de produtos
  - Tabela expandida com todos os detalhes
  - Funcionalidade de envio da comparação por e-mail
- ✅ **Checkout Funcional** (`/checkout`)
  - Fluxo de compra em 3 etapas
  - Formulários de dados pessoais e pagamento

## 🛠️ Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em modo desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acessar a aplicação:**
   - URL: `http://localhost:3000`

## 🔐 Credenciais de Teste

### Admin
- Email: `admin@example.com`
- Senha: `admin123`
- Redirecionamento: `/admin/painel`

### Cliente
- Email: `cliente@example.com`
- Senha: `cliente123`
- Redirecionamento: `/cliente`

### Gerente
- Email: `gerente@example.com`
- Senha: `gerente123`
- Redirecionamento: `/admin/painel`

## 📁 Estrutura Principal

```
src/
├── app/
│   ├── admin/          # Área administrativa
│   ├── cliente/        # Área do cliente
│   ├── comparacao/     # Comparação de produtos
│   └── checkout/       # Finalização de compra
├── lib/
│   ├── mock-data.ts    # Dados de usuários
│   └── mock-products.ts # Dados de produtos
└── components/ui/      # Componentes básicos
```

## 🎯 Principais Melhorias Implementadas

1. **Sistema de Login com Roles** - Autenticação funcional com redirecionamento
2. **Área Administrativa Completa** - Todos os módulos solicitados
3. **Gestão de Usuários Avançada** - Roles e permissões granulares
4. **Comparação de Produtos** - Interface conforme especificações
5. **Área do Cliente Melhorada** - Envio por e-mail implementado
6. **Checkout Funcional** - Processo completo de compra

## 📝 Dados Mock Incluídos

- Usuários com diferentes roles e permissões
- Produtos de seguro com detalhes completos
- Apólices de exemplo para o cliente
- Cupons de desconto funcionais
- Posts de blog e conteúdos

---

**Versão:** 2.0.0 - Atualizada conforme especificações  
**Desenvolvido por:** Equipe de Desenvolvimento
