# Onde Eu Parei - Projeto Seguro Viagem

## Pendências para Amanhã (26/07/2024)

### Sistema de Posts
- ✅ Correção de erros de tipagem no arquivo `posts.service.ts`
- ✅ Substituição da propriedade inexistente `description` por `resume` nos DTOs
- ✅ Correção dos campos do schema do Prisma para criação de mídias
- ⏳ Executar o seed de posts para popular o banco de dados
- ⏳ Testar o fluxo completo de criação e edição de posts
- ⏳ Verificar a funcionalidade de upload de imagens após as correções

### Sistema de Email
- ✅ Implementação básica do serviço de email com Nodemailer
- ✅ Suporte a templates HTML com Handlebars
- ✅ Suporte a anexos no serviço de email
- ⏳ Configurar Mailtrap para ambiente de testes
- ⏳ Implementar sistema de fila para emails (para evitar bloqueios em operações síncronas)

### Fluxo de Convites
- ✅ Correção do serviço de convites no backend
- ✅ Criação de template HTML para emails de convite
- ⏳ Testar o fluxo completo de envio de convites
- ⏳ Verificar se os emails estão chegando corretamente

### Próximos Passos
1. Executar o seed de posts e verificar se os dados são inseridos corretamente
2. Testar o sistema de upload de imagens para posts após as correções
3. Configurar o Mailtrap como servidor SMTP para testes de email
4. Implementar sistema de fila para processamento assíncrono de emails
5. Testar o fluxo completo de convites (envio → recebimento → aceitação)

### Notas Importantes
- O sistema de gerenciamento de mídia para posts está funcionando, mas precisa ser testado após as correções
- Considerar refatorar o código para usar tipos mais específicos em vez de `any[]` para `mediaItems`
- Verificar se as pastas de upload existem e têm as permissões corretas