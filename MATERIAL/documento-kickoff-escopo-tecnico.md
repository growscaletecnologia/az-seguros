# Documento de Kickoff – Projeto AZ Seguros

 
Documento de Kickoff – Projeto AZ Seguros  
Contratante:  Alessandro Azevedo  
Contratada:  Grow & Scale Tecnologia da Informação Ltda.  
Data da reunião inicial:  26/08/2025  
 
1. Objetivo  
Este documento formaliza o início do desenvolvimento da plataforma de cotação, 
comparação e venda de seguros de viagem da AZ Seguros, com base no contrato firmado, 
contemplando também as novas funcionalidades acordadas (módulo de markup por 
seguradora e cupons de desconto).  
 
2. Escopo Atualizado  
Funcionalidades Originais  
• Frontend e Backend completos  
• Painel Administrativo e Área do Cliente  
• Integração com duas seguradoras via API  
• Integração com gateway de pagamento Stone  
• Integração com n8n para automação de fluxos  
• Desenvolvimento de fluxo de conversa para chatbot conectado ao n8n  
• Entregas em ambiente de homologação  
Funcionalidades Incluídas Sem Custo Adicional  
• Módulo de Markup por Seguradora  – configuração do percentual de markup de 
cada seguradora no painel administrativo, aplicável automaticamente aos preços 
exibidos aos clientes.  
• Módulo de Cupons de Desconto  – criação e gestão de cupons no administrador, 
com aplicação pelo cliente no checkout.  
 
3. Telas do Front -End  
• Página Inicial  – apresentação institucional, diferenciais e botão para iniciar 
cotação.  

 
• Comparativo de Planos  – listagem de planos das seguradoras integradas, preços 
com markup aplicado ou não e filtros por cobertura/valor  sempre mostrar o va lor 
do seguro mais barato , veja imagem abaixo:  
•  
• Se vier na API os descontos prontos para a quantidade de passageiros, podemos 
calcular levando em conta o número de passageiros (caso não e steja na API 
faremos um aditivo a parte através de proposta).  
• Formulário de Cotação  – dados pessoais e informações da viagem, seleção de 
plano e validação de dados para envio às seguradoras . (Destino, Data  de 
Embarque (calendário), Data de Desembarque  (calendário), nome, e-mail e 
celular. (ao preencher conecta com rd station) . 
•  
• Ao inserir a data de embarque , precisa ter uma informação que a viagem deve 
iniciar no Brasil para que contemple o seguro  (talvez um check box que informe 
que a pessoa está no Brasil) em alguns casos a seguradora exige que a viagem 
comece no Brasil para que a cotação de seguro esteja com o valor correto , se já 
está em viagem ou no exterior não permitir a cota ção (travar os campos  
informando que n ão comercializa em viagem  e não permitir a cotação ). 


 
• Checkout  – resumo da cotação, campo para aplicação de cupom de desconto, 
pagamento via Stone.  (Os dados que são preenchidos no inicio, já vem 
preenchidos no check out, conforme print abaixo)  
 
• Área do Cliente  – histórico de compras, emissão de vouchers  (vai para o e-mail 
também) e solicitações de cancelamento/alterações.  
 
4. Funcionalidades do Painel Administrativo  
• Gerenciamento de Seguradoras  (cadastro, edição, definição de markup) 
• Gestão de Cupons de Desconto  (criar, editar, excluir, definir regras de validade)  
• Gestão de Clientes e Vendas  (listagem, histórico de compras/pagamentos  com a 
opção de exportar por excel , relatórios por seguradora)  
• Gestão de Conteúdos Institucionais  (alterar textos, imagens e informações do 
site)  
• Fazer orçamento de uma área personaliza da para a gestão de usuário 
personalizad a, onde o Alessandro pode escolher o que os demais usuários 
administrativos podem ver ou não.  
 
5. Integrações  
• Seguradoras  – integração inicial com duas APIs, alimentando os preços exibidos 
no comparativo.  
• Gateway de Pagamento Stone  – processamento dos pagamentos no checkout.  
• n8n – automação de fluxos (notificações, atualizações de status, integração com 
chatbot e fluxos externos).  


 
• Chatbot – fluxo de conversa integrado ao n8n para atendimento inicial, suporte 
durante a cotação e redirecionamento ao checkout.  
 
6. Cronograma do Projeto  
Etapa  Duração 
Estimada  Descrição  
Reunião Inicial (Kickoff)  1 dia  Alinhamento do escopo, telas e 
funcionalidades.  
Desenvolvimento do Front -
End  2 semanas  Implementação de todas as telas (pública, 
checkout e área do cliente).  
Integrações de Back -End 
(APIs + Stone)  5 semanas  Conexão com APIs das seguradoras, 
gateway Stone e regras de negócio.  
Chatbot + Fluxos via n8n  1 semana  Configuração do chatbot integrado ao n8n, 
fluxos de automação.  
Testes, Homologação e 
Ajustes Finais  1 a 2 semanas  Validação junto ao cliente em ambiente de 
homologação, ajustes finais.  
Deploy em Produção  1 dia  Publicação do sistema no ambiente 
definitivo.  
     Total estimado:  10 a 11 semanas.  
 
7. Condições de Entrega  
• Entregas realizadas em ambiente de homologação.  
• Cada entrega terá prazo de 7 dias corridos para homologação pela Contratante.  
• Alterações fora do escopo deverão ser formalizadas em aditivo contratual.  
 
8. Considerações Finais  
Este kickoff documenta todas as funcionalidades previstas no contrato original e as novas 
funcionalidades (markup por seguradora e cupons de desconto).  
O objetivo é garantir clareza, transparência e alinhamento de expectativas entre as partes, 
bem como registrar oficialmente o cronograma do projeto.  

 
 

