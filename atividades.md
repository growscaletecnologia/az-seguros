# Atividades Realizadas - Projeto Seguro Viagem

## Data: 📅 24/07/2024

### Backend

#### Melhorias no Sistema de Email
- Implementado suporte a templates HTML com Handlebars no serviço de email
- Adicionado suporte a anexos no EmailService
- Criado método `sendTemplate()` para envio de emails com templates Handlebars
- Implementadas interfaces `EmailOptions` e `EmailAttachment` para tipagem forte
- Criado template HTML para emails de convite (`invitation.hbs`)
- Atualizado o serviço de convites para usar o novo sistema de templates
- Testado o envio de emails com Ethereal (ambiente de desenvolvimento)
- Pesquisado e avaliado serviços SMTP gratuitos para testes (Mailtrap, SMTP2GO, SendPulse)

## Data: 📅 23/07/2024

## Frontend

### Modificação da Interface de Gerenciamento de Usuários
- Removida a funcionalidade de criação direta de usuários na página de administração
- Mantida apenas a opção de convidar novos usuários via sistema de convites
- Implementado modal dedicado para edição de usuários existentes
- Ajustada a interface para melhor experiência do usuário e fluxo de trabalho
- Removidas funções e estados relacionados à criação direta de usuários
- Simplificadas as funções de atualização de roles e permissões

### Melhorias no Middleware de Autenticação
- Adicionados logs de depuração no middleware `auto-permission.middleware.ts`
- Implementados pontos de log para rastreamento de:
  - Verificação de rotas públicas e protegidas
  - Extração e validação de tokens de autenticação
  - Busca de sessões no Redis
  - Verificação de permissões de usuários
  - Resultados de autorização (acesso permitido/negado)
- Mantida a estrutura de respostas de erro (401 para tokens inválidos, 403 para falta de permissão)

## Backend

### Implementação do Sistema de Monitoramento e Logs
- Criado modelo `Log` no schema do Prisma para armazenar registros de requisições
- Adicionado enum `HttpMethod` para padronizar os métodos HTTP no banco de dados
- Implementado middleware de logging (`LoggingMiddleware`) para registrar automaticamente todas as requisições
- Criado serviço de logs (`LogService`) para gerenciar a persistência dos registros
- Implementado serviço de métricas (`MetricsService`) para análise de dados de uso da API
- Criado controlador de monitoramento (`MonitoringController`) com endpoints para consulta de logs e métricas
- Adicionados decorators `SkipLogging` e `SkipThrottling` para controle fino de quais rotas devem ser monitoradas

### Implementação de Rate Limiting
- Configurado `ThrottlerModule` com limites diferentes para rotas públicas (30 req/min) e autenticadas (100 req/min)
- Criado guard personalizado (`CustomThrottlerGuard`) para aplicar regras específicas de rate limiting
- Implementada lógica para identificar usuários por ID ou IP para controle de limites

### Correções no Sistema de Convites (InvitationService)
- Corrigido problema no `invitation.service.ts` relacionado à propriedade `invitationExpires`
- Removidas referências a propriedades não existentes no modelo `User` do Prisma (`invitationToken` e `invitationExpires`)
- Criadas variáveis locais para armazenar dados de convite
- Atualizado método `acceptInvitation` para usar o token como ID
- Modificados os retornos dos métodos para usar as variáveis locais
- Adicionados comentários explicativos para melhorar a manutenção do código

### Correções no Sistema RBAC (Role-Based Access Control)
- Corrigido problema no arquivo `rbac-seed.ts` relacionado à comparação de tipos
- Substituída a string literal 'delete' por `Action.DELETE` nas comparações com o enum
- Corrigido erro de tipo na linha 25 do arquivo `rbac-seed.ts`
- Substituído `resourceAction` por `resource_action` para corresponder ao formato gerado pelo Prisma para chaves compostas
- Garantida compatibilidade com o schema do Prisma que define `@@unique([resource, action])` para o modelo Permission

### Testes e Validação
- Testadas as alterações feitas no `invitation.service.ts`
- Verificado o funcionamento do seed do RBAC após as correções
- Instaladas dependências necessárias para o sistema de monitoramento (@nestjs/throttler e prom-client)

## Próximos Passos

### Backend
- Configurar integração com Grafana para visualização das métricas coletadas
- Implementar dashboard administrativo para visualização de logs e métricas
- Verificar o fluxo completo de convites no frontend para garantir que as correções funcionem corretamente
- Executar testes adicionais para o sistema RBAC
- Revisar outros possíveis problemas de tipo no código

### Frontend
- Testar o fluxo completo de edição de usuários com o novo modal
- Implementar integração com os endpoints de convite corrigidos
- Atualizar componentes que interagem com o sistema RBAC
- Criar interface para visualização de métricas e logs (para administradores)

---

*Documento gerado em 22/09/2025*