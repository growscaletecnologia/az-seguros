/* eslint-disable prettier/prettier */
import { config } from 'dotenv'
config() // carrega o .env da raiz do backend

import { PrismaClient, PostStatus, UserStatus, Action } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { seedFrontSections } from './frontsections-seed'

const prisma = new PrismaClient()

/**
 * Arquivo de seed único que consolida todos os seeds do sistema
 * Executa na ordem correta respeitando as dependências entre entidades
 *
 * Ordem de execução:
 * 1. RBAC (Roles e Permissions) - Base do sistema de autorização
 * 2. Admin User - Usuário administrador que depende das roles
 * 3. Posts System - Categorias, tags e posts (incluindo system posts)
 */

/**
 * Seed para RBAC (Role-Based Access Control)
 * Cria roles e permissions padrão do sistema
 */
async function seedRbac() {
  try {
    console.log('🔐 Iniciando seed de RBAC...')

    // Criar permissions padrão
    const resources = [
      'users',
      'roles',
      'permissions',
      'plans',
      'quotes',
      'orders',
      'coupons',
      'posts',
      'categories',
      'tags',
    ]
    const actions: Action[] = ['CREATE', 'READ', 'UPDATE', 'DELETE']

    console.log('📋 Criando permissions padrão...')

    // Criar permissions para cada combinação de resource e action
    for (const resource of resources) {
      for (const action of actions) {
        await prisma.permission.upsert({
          where: {
            resource_action: {
              resource,
              action,
            },
          },
          update: {},
          create: {
            resource,
            action,
            description: `Permission to ${action} ${resource}`,
          },
        })
      }
    }

    console.log('👥 Criando roles padrão...')

    // Criar role Admin
    const adminRole = await prisma.role.upsert({
      where: { name: 'Admin' },
      update: {
        description: 'Administrator with full access',
        isSystem: true,
      },
      create: {
        name: 'Admin',
        description: 'Administrator with full access',
        isSystem: true,
      },
    })

    // Criar role Manager
    const managerRole = await prisma.role.upsert({
      where: { name: 'Manager' },
      update: {
        description: 'Manager with access to most features',
        isSystem: true,
      },
      create: {
        name: 'Manager',
        description: 'Manager with access to most features',
        isSystem: true,
      },
    })

    // Criar role Customer
    const customerRole = await prisma.role.upsert({
      where: { name: 'Customer' },
      update: {
        description: 'Regular customer with limited access',
        isSystem: true,
      },
      create: {
        name: 'Customer',
        description: 'Regular customer with limited access',
        isSystem: true,
      },
    })

    // Obter todas as permissions
    const allPermissions = await prisma.permission.findMany()

    // Atribuir todas as permissions à role Admin
    console.log('🔑 Atribuindo permissions à role Admin...')
    for (const permission of allPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        },
        update: { allow: true },
        create: {
          roleId: adminRole.id,
          permissionId: permission.id,
          allow: true,
        },
      })
    }

    // Atribuir permissions limitadas à role Manager
    console.log('🔑 Atribuindo permissions à role Manager...')
    for (const permission of allPermissions) {
      // Managers não podem deletar usuários ou gerenciar roles/permissions
      if (
        (permission.resource === 'users' && permission.action === Action.DELETE) ||
        (permission.resource === 'roles' && permission.action === Action.DELETE) ||
        (permission.resource === 'permissions' && permission.action === Action.DELETE)
      ) {
        continue
      }

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: managerRole.id,
            permissionId: permission.id,
          },
        },
        update: { allow: true },
        create: {
          roleId: managerRole.id,
          permissionId: permission.id,
          allow: true,
        },
      })
    }

    // Atribuir permissions muito limitadas à role Customer
    console.log('🔑 Atribuindo permissions à role Customer...')
    for (const permission of allPermissions) {
      // Customers podem apenas ler planos, criar cotações e gerenciar seus próprios pedidos
      if (
        (permission.resource === 'plans' && permission.action === Action.READ) ||
        (permission.resource === 'quotes' &&
          (permission.action === Action.CREATE || permission.action === Action.READ)) ||
        (permission.resource === 'orders' &&
          (permission.action === Action.READ || permission.action === Action.CREATE))
      ) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: customerRole.id,
              permissionId: permission.id,
            },
          },
          update: { allow: true },
          create: {
            roleId: customerRole.id,
            permissionId: permission.id,
            allow: true,
          },
        })
      }
    }

    console.log('✅ RBAC seed concluído com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao criar seed de RBAC:', error)
    throw error
  }
}

/**
 * Seed para criar usuário administrador padrão
 * Depende do seed de RBAC para funcionar corretamente
 */
async function seedAdminUser() {
  try {
    console.log('👤 Iniciando seed de usuário administrador...')

    const SALT_ROUNDS = 12
    const defaultPassword = 'Admin@123'
    const passwordHash = await bcrypt.hash(defaultPassword, SALT_ROUNDS)
    const adminEmail = 'admin@azseguros.com'

    // Verificar se o admin já existe
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (existingAdmin) {
      console.log('⚠️  Usuário administrador já existe, pulando criação...')
      return
    }

    // Criar o usuário admin
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Administrador',
        password: passwordHash,
        status: UserStatus.ACTIVE,
        role: 'ADMIN', // Campo legado
        emailVerifiedAt: new Date(),
        isActive: true,
      },
    })

    console.log(`✅ Usuário administrador criado com ID: ${admin.id}`)

    // Buscar a role de Admin
    const adminRole = await prisma.role.findUnique({
      where: { name: 'Admin' },
    })

    if (!adminRole) {
      throw new Error('Role Admin não encontrada! Erro no seed de RBAC.')
    }

    // Associar o usuário à role Admin
    await prisma.userRole.create({
      data: {
        userId: admin.id,
        roleId: adminRole.id,
      },
    })

    console.log('✅ Usuário administrador associado à role Admin com sucesso!')
    console.log('-----------------------------------------------------')
    console.log('🔐 CREDENCIAIS DO ADMINISTRADOR PADRÃO:')
    console.log(`📧 Email: ${adminEmail}`)
    console.log(`🔑 Senha: ${defaultPassword}`)
    console.log('⚠️  IMPORTANTE: Altere esta senha após o primeiro login!')
    console.log('-----------------------------------------------------')
  } catch (error) {
    console.error('❌ Erro ao criar usuário administrador:', error)
    throw error
  }
}

/**
 * Seed para sistema de posts (CMS)
 * Cria categorias, tags e posts do sistema
 */
async function seedPosts() {
  try {
    console.log('📝 Iniciando seed do sistema de posts...')

    // Verificar se já existem categorias
    const existingCategories = await prisma.category.findMany()
    if (existingCategories.length === 0) {
      console.log('📂 Criando categorias iniciais...')
      await prisma.category.createMany({
        data: [
          { name: 'Blog', slug: 'blog', description: 'Artigos do blog' },
          { name: 'Institucional', slug: 'institucional', description: 'Páginas institucionais' },
          {
            name: 'Sistema',
            slug: 'sistema',
            description: 'Páginas do sistema (Termos, Políticas, etc.)',
          },
          {
            name: 'Dicas de Viagem',
            slug: 'dicas-de-viagem',
            description: 'Dicas úteis para viajantes',
          },
          { name: 'Seguros', slug: 'seguros', description: 'Informações sobre seguros' },
        ],
      })
    }

    // Verificar se já existem tags
    const existingTags = await prisma.tag.findMany()
    if (existingTags.length === 0) {
      console.log('🏷️  Criando tags iniciais...')
      await prisma.tag.createMany({
        data: [
          { name: 'Viagem', slug: 'viagem', description: 'Conteúdo relacionado a viagens' },
          { name: 'Seguro', slug: 'seguro', description: 'Conteúdo sobre seguros' },
          { name: 'Internacional', slug: 'internacional', description: 'Viagens internacionais' },
          { name: 'Dicas', slug: 'dicas', description: 'Dicas e recomendações' },
          { name: 'Saúde', slug: 'saude', description: 'Saúde durante viagens' },
          { name: 'Sistema', slug: 'sistema', description: 'Conteúdo do sistema' },
          { name: 'Legal', slug: 'legal', description: 'Conteúdo legal e jurídico' },
          { name: 'Suporte', slug: 'suporte', description: 'Conteúdo de suporte ao usuário' },
        ],
      })
    }

    // Verificar se já existem posts
    const existingPosts = await prisma.post.findMany()
    if (existingPosts.length === 0) {
      console.log('📄 Criando posts do sistema...')

      // Buscar o usuário admin para associar aos posts
      const admin = await prisma.user.findFirst({
        where: { email: 'admin@azseguros.com' },
      })

      if (!admin) {
        throw new Error('Usuário admin não encontrado! Execute primeiro o seed de admin.')
      }

      // Buscar categorias e tags para associar aos posts
      const sistemaCategory = await prisma.category.findFirst({
        where: { slug: 'sistema' },
      })

      const institucionalCategory = await prisma.category.findFirst({
        where: { slug: 'institucional' },
      })

      const blogCategory = await prisma.category.findFirst({
        where: { slug: 'blog' },
      })

      const sistemaTag = await prisma.tag.findFirst({
        where: { slug: 'sistema' },
      })

      const legalTag = await prisma.tag.findFirst({
        where: { slug: 'legal' },
      })

      const suporteTag = await prisma.tag.findFirst({
        where: { slug: 'suporte' },
      })

      const viagemTag = await prisma.tag.findFirst({
        where: { slug: 'viagem' },
      })

      const turismoTag = await prisma.tag.findFirst({
        where: { slug: 'dicas' },
      })

      if (
        !sistemaCategory ||
        !institucionalCategory ||
        !blogCategory ||
        !sistemaTag ||
        !legalTag ||
        !suporteTag ||
        !viagemTag ||
        !turismoTag
      ) {
        throw new Error('Categorias ou tags não encontradas! Erro na criação das categorias/tags.')
      }

      // 1. System Page: Termos de Uso
      await prisma.systemPage.create({
        data: {
          type: 'TERMS',
          title: 'Termos de Uso',
          slug: 'termos-de-uso',
          content: `
            <h1>Termos de Uso</h1>
           <h2 style="font-size: 1.875rem; font-weight: 700; color: #1f2937; margin-bottom: 1.5rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem;">
        Termos de Uso
    </h2>
    <section style="background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); border-radius: 0.75rem; overflow: hidden; margin-bottom: 4rem;">
        
        <!-- Detalhes dos Termos de Uso - Aceitação -->
        <details style="border-bottom: 1px solid #f3f4f6;">
            <summary style="display: flex; justify-content: space-between; align-items: center; width: 100%; text-align: left; padding: 1.25rem 1.5rem; outline: none; background-color: #f9fafb; transition: background-color 0.15s ease;">
                <span style="font-size: 1.125rem; font-weight: 600; color: #1f2937; padding-right: 1rem;">
                    1. Aceitação e Objeto dos Serviços
                </span>
                <!-- Ícone Chevron SVG -->
                <svg class="chevron-icon" style="height: 1.5rem; width: 1.5rem; color: #4f46e5; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </summary>
            <!-- Conteúdo -->
            <div style="font-size: 0.9375rem; color: #374151; padding: 1rem 1.5rem 1.5rem 1.5rem; line-height: 1.6;">
                <p style="margin-top: 0;">Ao acessar ou utilizar qualquer parte dos serviços de simulação, cotação e aquisição de seguros oferecidos pela Seguros Alfa, você **concorda e se submete** a estes Termos de Uso. Este Termo rege sua relação com a Seguros Alfa e suas parceiras seguradoras.</p>
            </div>
        </details>

        <!-- Detalhes dos Termos de Uso - Responsabilidade -->
        <details style="border-bottom: 1px solid #f3f4f6;">
            <summary style="display: flex; justify-content: space-between; align-items: center; width: 100%; text-align: left; padding: 1.25rem 1.5rem; outline: none; background-color: #f9fafb;">
                <span style="font-size: 1.125rem; font-weight: 600; color: #1f2937; padding-right: 1rem;">
                    2. Precisão das Informações
                </span>
                <!-- Ícone Chevron SVG -->
                <svg class="chevron-icon" style="height: 1.5rem; width: 1.5rem; color: #4f46e5; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </summary>
            <!-- Conteúdo -->
            <div style="font-size: 0.9375rem; color: #374151; padding: 1rem 1.5rem 1.5rem 1.5rem; line-height: 1.6;">
                <p style="margin-top: 0;">O usuário é o **único responsável** pela veracidade, precisão e atualização dos dados cadastrais e das informações de risco fornecidas durante a cotação e contratação da apólice. A inexatidão das informações pode resultar na negativa de cobertura pela seguradora, conforme previsto no Código Civil e nas normas da SUSEP.</p>
            </div>
        </details>
        
        <!-- Detalhes dos Termos de Uso - Pagamento -->
        <details style="border-bottom: 1px solid #f3f4f6;">
            <summary style="display: flex; justify-content: space-between; align-items: center; width: 100%; text-align: left; padding: 1.25rem 1.5rem; outline: none; background-color: #f9fafb;">
                <span style="font-size: 1.125rem; font-weight: 600; color: #1f2937; padding-right: 1rem;">
                    3. Condições de Pagamento e Cancelamento
                </span>
                <!-- Ícone Chevron SVG -->
                <svg class="chevron-icon" style="height: 1.5rem; width: 1.5rem; color: #4f46e5; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </summary>
            <!-- Conteúdo -->
            <div style="font-size: 0.9375rem; color: #374151; padding: 1rem 1.5rem 1.5rem 1.5rem; line-height: 1.6;">
                <p style="margin-top: 0;">O pagamento do prêmio do seguro deve ser efetuado conforme as condições acordadas na Proposta de Seguro. O cancelamento antecipado seguirá as regras da seguradora, podendo gerar a devolução do prêmio não utilizado, descontados os custos administrativos e impostos, conforme regulamentação vigente.</p>
            </div>
        </details>

        <!-- Detalhes dos Termos de Uso - Links e Terceiros -->
        <details>
            <summary style="display: flex; justify-content: space-between; align-items: center; width: 100%; text-align: left; padding: 1.25rem 1.5rem; outline: none; background-color: #f9fafb;">
                <span style="font-size: 1.125rem; font-weight: 600; color: #1f2937; padding-right: 1rem;">
                    4. Links e Propriedade Intelectual
                </span>
                <!-- Ícone Chevron SVG -->
                <svg class="chevron-icon" style="height: 1.5rem; width: 1.5rem; color: #4f46e5; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </summary>
            <!-- Conteúdo -->
            <div style="font-size: 0.9375rem; color: #374151; padding: 1rem 1.5rem 1.5rem 1.5rem; line-height: 1.6;">
                <p style="margin-top: 0;">Todo o conteúdo do site (textos, gráficos, logotipos) é de propriedade da Seguros Alfa ou de seus licenciadores e protegido pelas leis de direitos autorais. A Seguros Alfa não se responsabiliza por sites de terceiros vinculados ao nosso.</p>
            </div>
        </details>
    </section>
          `,
          status: 'PUBLISHED',
        },
      })

      // 2. System Page: Políticas de Privacidade
      await prisma.systemPage.create({
        data: {
          type: 'POLICIES',
          title: 'Políticas de Privacidade',
          slug: 'politicas-de-privacidade',
          content: `
           <h2 style="font-size: 1.875rem; font-weight: 700; color: #1f2937; margin-bottom: 1.5rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem;">
        Políticas de Privacidade
    </h2>
    <section style="background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); border-radius: 0.75rem; overflow: hidden; margin-bottom: 4rem;">
        
        <!-- Detalhes da Política - Coleta de Dados -->
        <details style="border-bottom: 1px solid #f3f4f6;">
            <summary style="display: flex; justify-content: space-between; align-items: center; width: 100%; text-align: left; padding: 1.25rem 1.5rem; outline: none; background-color: #f9fafb;">
                <span style="font-size: 1.125rem; font-weight: 600; color: #1f2937; padding-right: 1rem;">
                    1. Dados Coletados e Finalidade
                </span>
                <!-- Ícone Chevron SVG -->
                <svg class="chevron-icon" style="height: 1.5rem; width: 1.5rem; color: #4f46e5; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </summary>
            <!-- Conteúdo -->
            <div style="font-size: 0.9375rem; color: #374151; padding: 1rem 1.5rem 1.5rem 1.5rem; line-height: 1.6;">
                <p style="margin-top: 0;">Coletamos dados pessoais (como nome, CPF, endereço, e-mail, telefone e informações específicas de risco do bem segurado) para fins de **cotação, emissão de apólice e gestão de sinistros**. O tratamento é realizado em estrita conformidade com a Lei Geral de Proteção de Dados (LGPD) - Lei n.º 13.709/2018.</p>
            </div>
        </details>

        <!-- Detalhes da Política - Compartilhamento -->
        <details style="border-bottom: 1px solid #f3f4f6;">
            <summary style="display: flex; justify-content: space-between; align-items: center; width: 100%; text-align: left; padding: 1.25rem 1.5rem; outline: none; background-color: #f9fafb;">
                <span style="font-size: 1.125rem; font-weight: 600; color: #1f2937; padding-right: 1rem;">
                    2. Compartilhamento e Transferência
                </span>
                <!-- Ícone Chevron SVG -->
                <svg class="chevron-icon" style="height: 1.5rem; width: 1.5rem; color: #4f46e5; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </summary>
            <!-- Conteúdo -->
            <div style="font-size: 0.9375rem; color: #374151; padding: 1rem 1.5rem 1.5rem 1.5rem; line-height: 1.6;">
                <p style="margin-top: 0;">Os dados são compartilhados **estritamente com as seguradoras parceiras** para a emissão e gestão do seguro. Também poderemos compartilhar dados com autoridades competentes em caso de obrigação legal ou ordem judicial. Não comercializamos ou alugamos dados pessoais.</p>
            </div>
        </details>

        <!-- Detalhes da Política - Segurança e Retenção -->
        <details style="border-bottom: 1px solid #f3f4f6;">
            <summary style="display: flex; justify-content: space-between; align-items: center; width: 100%; text-align: left; padding: 1.25rem 1.5rem; outline: none; background-color: #f9fafb;">
                <span style="font-size: 1.125rem; font-weight: 600; color: #1f2937; padding-right: 1rem;">
                    3. Segurança e Período de Retenção
                </span>
                <!-- Ícone Chevron SVG -->
                <svg class="chevron-icon" style="height: 1.5rem; width: 1.5rem; color: #4f46e5; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </summary>
            <!-- Conteúdo -->
            <div style="font-size: 0.9375rem; color: #374151; padding: 1rem 1.5rem 1.5rem 1.5rem; line-height: 1.6;">
                <p style="margin-top: 0;">Utilizamos medidas técnicas e organizacionais avançadas para proteger seus dados. Retemos suas informações apenas pelo tempo necessário para cumprir as finalidades de tratamento, respeitando os prazos legais de guarda e responsabilidade.</p>
            </div>
        </details>

        <!-- Detalhes da Política - Direitos do Titular (LGPD) -->
        <details>
            <summary style="display: flex; justify-content: space-between; align-items: center; width: 100%; text-align: left; padding: 1.25rem 1.5rem; outline: none; background-color: #f9fafb;">
                <span style="font-size: 1.125rem; font-weight: 600; color: #1f2937; padding-right: 1rem;">
                    4. Direitos do Titular (LGPD)
                </span>
                <!-- Ícone Chevron SVG -->
                <svg class="chevron-icon" style="height: 1.5rem; width: 1.5rem; color: #4f46e5; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </summary>
            <!-- Conteúdo -->
            <div style="font-size: 0.9375rem; color: #374151; padding: 1rem 1.5rem 1.5rem 1.5rem; line-height: 1.6;">
                <p style="margin-top: 0;">Você pode exercer, a qualquer momento, os direitos previstos na LGPD, incluindo o acesso aos dados, a correção, a eliminação, a anonimização e a portabilidade. Para isso, entre em contato com nosso Encarregado de Dados (DPO) através dos canais de atendimento.</p>
            </div>
        </details>
    </section>

    <!-- Rodapé -->
    <div style="margin-top: 3rem; text-align: center; color: #4b5563; padding-bottom: 2rem;">
        <p style="font-size: 0.875rem; margin-bottom: 0.5rem;">Documentos atualizados em Setembro de 2025.</p>
        <a href="#" style="color: #4f46e5; text-decoration: none; font-weight: 600; font-size: 0.875rem;">
            Entre em Contato com o DPO
        </a>
    </div>
          `,
          status: 'PUBLISHED',
        },
      })

      // 3. System Page: FAQ
      await prisma.systemPage.create({
        data: {
          type: 'FAQ',
          title: 'Perguntas Frequentes (FAQ)',
          slug: 'faq',
          content: `
           <h2 style="font-size: 1.875rem; font-weight: 700; color: #1f2937; text-align: center; margin-bottom: 1.5rem; margin-top: 2.5rem;">
        Perguntas Frequentes (FAQ)
    </h2>
    <section style="background-color: #ffffff; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); border-radius: 1rem; overflow: hidden; margin-bottom: 4rem;">

        <!-- ITEM 1 -->
        <details style="border-bottom: 1px solid #e5e7eb;">
            <summary style="display: flex; justify-content: space-between; align-items: center; width: 100%; text-align: left; padding: 1.25rem 1.5rem; outline: none;">
                <span style="font-size: 1.125rem; font-weight: 600; color: #1f2937; padding-right: 1rem;">
                    O que é o seguro viagem e por que eu preciso dele?
                </span>
                <!-- Ícone Chevron SVG -->
                <svg class="chevron-icon" style="height: 1.5rem; width: 1.5rem; color: #4f46e5; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </summary>
            <!-- Conteúdo da Resposta -->
            <div style="font-size: 1rem; color: #4b5563; padding: 0 1.5rem 1.25rem 1.5rem; line-height: 1.625;">
                O seguro viagem cobre despesas médicas, hospitalares e imprevistos durante sua viagem, garantindo tranquilidade em caso de acidentes, doenças, perda de bagagem ou atrasos de voo. Em muitos destinos internacionais, como os do Tratado de Schengen, o seguro é **obrigatório**.
            </div>
        </details>

        <!-- ITEM 2 -->
        <details style="border-bottom: 1px solid #e5e7eb;">
            <summary style="display: flex; justify-content: space-between; align-items: center; width: 100%; text-align: left; padding: 1.25rem 1.5rem; outline: none;">
                <span style="font-size: 1.125rem; font-weight: 600; color: #1f2937; padding-right: 1rem;">
                    O seguro é obrigatório para viajar para a Europa?
                </span>
                <!-- Ícone Chevron SVG -->
                <svg class="chevron-icon" style="height: 1.5rem; width: 1.5rem; color: #4f46e5; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </summary>
            <!-- Conteúdo da Resposta -->
            <div style="font-size: 1rem; color: #4b5563; padding: 0 1.5rem 1.25rem 1.5rem; line-height: 1.625;">
                Sim, para os países da União Europeia que fazem parte do **Tratado de Schengen**, é exigida a contratação de um seguro viagem com cobertura mínima de €30.000 (trinta mil euros) para despesas médicas e repatriação. Sempre verifique os requisitos do seu destino.
            </div>
        </details>

        <!-- ITEM 3 -->
        <details style="border-bottom: 1px solid #e5e7eb;">
            <summary style="display: flex; justify-content: space-between; align-items: center; width: 100%; text-align: left; padding: 1.25rem 1.5rem; outline: none;">
                <span style="font-size: 1.125rem; font-weight: 600; color: #1f2937; padding-right: 1rem;">
                    A cobertura vale a partir de quando e onde?
                </span>
                <!-- Ícone Chevron SVG -->
                <svg class="chevron-icon" style="height: 1.5rem; width: 1.5rem; color: #4f46e5; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </summary>
            <!-- Conteúdo da Resposta -->
            <div style="font-size: 1rem; color: #4b5563; padding: 0 1.5rem 1.25rem 1.5rem; line-height: 1.625;">
                A cobertura do seguro viagem passa a valer a partir da **data e hora de embarque** informada na contratação. É fundamental que a viagem se inicie no Brasil (ou no país de origem declarado). Viagens já em andamento não podem ser seguradas.
            </div>
        </details>

        <!-- ITEM 4 -->
        <details style="border-bottom: 1px solid #e5e7eb;">
            <summary style="display: flex; justify-content: space-between; align-items: center; width: 100%; text-align: left; padding: 1.25rem 1.5rem; outline: none;">
                <span style="font-size: 1.125rem; font-weight: 600; color: #1f2937; padding-right: 1rem;">
                    O que acontece se eu precisar usar o seguro durante a viagem?
                </span>
                <!-- Ícone Chevron SVG -->
                <svg class="chevron-icon" style="height: 1.5rem; width: 1.5rem; color: #4f46e5; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </summary>
            <!-- Conteúdo da Resposta -->
            <div style="font-size: 1rem; color: #4b5563; padding: 0 1.5rem 1.25rem 1.5rem; line-height: 1.625;">
                Você deve entrar em contato com a **central de atendimento da seguradora 24h por dia** (o número estará na sua apólice). Eles fornecerão orientação em português sobre hospitais credenciados, clínicas e os procedimentos para acionamento do seguro, sem custo adicional no momento do atendimento.
            </div>
        </details>

        <!-- ITEM 5 -->
        <details style="border-bottom: 1px solid #e5e7eb;">
            <summary style="display: flex; justify-content: space-between; align-items: center; width: 100%; text-align: left; padding: 1.25rem 1.5rem; outline: none;">
                <span style="font-size: 1.125rem; font-weight: 600; color: #1f2937; padding-right: 1rem;">
                    Posso cancelar ou alterar o seguro depois de comprar?
                </span>
                <!-- Ícone Chevron SVG -->
                <svg class="chevron-icon" style="height: 1.5rem; width: 1.5rem; color: #4f46e5; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </summary>
            <!-- Conteúdo da Resposta -->
            <div style="font-size: 1rem; color: #4b5563; padding: 0 1.5rem 1.25rem 1.5rem; line-height: 1.625;">
                Sim, geralmente é possível solicitar o cancelamento e reembolso integral dentro do prazo legal (7 dias após a compra) ou antes do início da vigência do seguro. Após a data de início da viagem (embarque), o cancelamento não será mais permitido.
            </div>
        </details>

        <!-- ITEM 6 (Último item, sem borda inferior) -->
        <details>
            <summary style="display: flex; justify-content: space-between; align-items: center; width: 100%; text-align: left; padding: 1.25rem 1.5rem; outline: none;">
                <span style="font-size: 1.125rem; font-weight: 600; color: #1f2937; padding-right: 1rem;">
                    Como recebo minha apólice de seguro e o que ela inclui?
                </span>
                <!-- Ícone Chevron SVG -->
                <svg class="chevron-icon" style="height: 1.5rem; width: 1.5rem; color: #4f46e5; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </summary>
            <!-- Conteúdo da Resposta -->
            <div style="font-size: 1rem; color: #4b5563; padding: 0 1.5rem 1.25rem 1.5rem; line-height: 1.625;">
                Após a confirmação do pagamento, você receberá a **apólice completa por e-mail** (verifique a caixa de spam). A apólice inclui todos os detalhes da cobertura contratada, o telefone de contato da seguradora e as instruções de uso.
            </div>
        </details>

    </section>

    <!-- SEÇÃO 2: TERMOS DE USO -->
    <h2 style="font-size: 1.875rem; font-weight: 700; color: #1f2937; text-align: center; margin-bottom: 1.5rem; margin-top: 2.5rem;">
        Termos de Uso
    </h2>
    <section style="background-color: #ffffff; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); border-radius: 1rem; overflow: hidden; margin-bottom: 4rem;">
        <!-- Detalhes dos Termos de Uso (em formato de accordion) -->
        <details>
            <summary style="display: flex; justify-content: space-between; align-items: center; width: 100%; text-align: left; padding: 1.25rem 1.5rem; outline: none;">
                <span style="font-size: 1.125rem; font-weight: 600; color: #1f2937; padding-right: 1rem;">
                    Clique aqui para ler os Termos e Condições Gerais
                </span>
                <!-- Ícone Chevron SVG -->
                <svg class="chevron-icon" style="height: 1.5rem; width: 1.5rem; color: #4f46e5; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </summary>
            <!-- Conteúdo dos Termos (Placeholder) -->
            <div style="font-size: 0.875rem; color: #374151; padding: 0 1.5rem 1.25rem 1.5rem;">
                <div style="margin-top: 1rem;">
                    <p style="font-weight: 700; font-size: 1rem; color: #1f2937; margin-top: 0; margin-bottom: 0.5rem;">1. Aceitação dos Termos</p>
                    <p style="margin-top: 0; margin-bottom: 1rem;">Ao utilizar nossos serviços (incluindo a simulação e compra de seguro viagem), você concorda integralmente em cumprir e se vincular a estes Termos de Uso. Caso não concorde com qualquer parte dos termos, o uso dos serviços deverá ser descontinuado.</p>
                </div>
                
                <div style="margin-top: 1rem;">
                    <p style="font-weight: 700; font-size: 1rem; color: #1f2937; margin-top: 0; margin-bottom: 0.5rem;">2. Licença e Uso</p>
                    <p style="margin-top: 0; margin-bottom: 1rem;">O serviço é fornecido 'como está' e 'conforme disponível'. É concedida uma licença limitada, não exclusiva e não transferível para acessar e utilizar o serviço estritamente para fins pessoais e não comerciais.</p>
                </div>
                
                <div style="margin-top: 1rem;">
                    <p style="font-weight: 700; font-size: 1rem; color: #1f2937; margin-top: 0; margin-bottom: 0.5rem;">3. Responsabilidades do Usuário</p>
                    <p style="margin-top: 0; margin-bottom: 1rem;">Você é responsável por manter a confidencialidade de suas informações de conta e por todas as atividades que ocorrem sob sua conta. Você garante que todos os dados fornecidos são verdadeiros, precisos e completos.</p>
                </div>
                
                <div style="margin-top: 1rem;">
                    <p style="font-weight: 700; font-size: 1rem; color: #1f2937; margin-top: 0; margin-bottom: 0.5rem;">4. Limitação de Responsabilidade</p>
                    <p style="margin-top: 0; margin-bottom: 1rem;">Na máxima extensão permitida pela lei, não seremos responsáveis por danos indiretos, incidentais, especiais, consequenciais ou exemplares resultantes do seu uso ou incapacidade de usar os serviços.</p>
                </div>
                
                <p style="font-size: 0.75rem; color: #6b7280; margin-top: 1rem;">Última atualização: Setembro de 2025.</p>
            </div>
        </details>
    </section>

    <!-- SEÇÃO 3: POLÍTICAS DE PRIVACIDADE -->
    <h2 style="font-size: 1.875rem; font-weight: 700; color: #1f2937; text-align: center; margin-bottom: 1.5rem; margin-top: 2.5rem;">
        Políticas de Privacidade
    </h2>
    <section style="background-color: #ffffff; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); border-radius: 1rem; overflow: hidden;">
        <!-- Detalhes da Política de Privacidade (em formato de accordion) -->
        <details>
            <summary style="display: flex; justify-content: space-between; align-items: center; width: 100%; text-align: left; padding: 1.25rem 1.5rem; outline: none;">
                <span style="font-size: 1.125rem; font-weight: 600; color: #1f2937; padding-right: 1rem;">
                    Clique aqui para ler a Política de Privacidade Completa (LGPD)
                </span>
                <!-- Ícone Chevron SVG -->
                <svg class="chevron-icon" style="height: 1.5rem; width: 1.5rem; color: #4f46e5; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </summary>
            <!-- Conteúdo da Política (Placeholder) -->
            <div style="font-size: 0.875rem; color: #374151; padding: 0 1.5rem 1.25rem 1.5rem;">
                <div style="margin-top: 1rem;">
                    <p style="font-weight: 700; font-size: 1rem; color: #1f2937; margin-top: 0; margin-bottom: 0.5rem;">1. Coleta e Finalidade dos Dados (LGPD)</p>
                    <p style="margin-top: 0; margin-bottom: 1rem;">Coletamos dados pessoais (nome, CPF, e-mail, telefone, dados de viagem e pagamento) estritamente necessários para emitir a apólice de seguro e cumprir as obrigações legais e regulatórias. O tratamento de dados é baseado no consentimento e na execução de contrato.</p>
                </div>
                
                <div style="margin-top: 1rem;">
                    <p style="font-weight: 700; font-size: 1rem; color: #1f2937; margin-top: 0; margin-bottom: 0.5rem;">2. Compartilhamento de Informações</p>
                    <p style="margin-top: 0; margin-bottom: 1rem;">Seus dados são compartilhados apenas com parceiros essenciais: as **Seguradoras** (para emissão da apólice) e plataformas de pagamento (para processamento da transação). Não vendemos, alugamos ou trocamos suas informações com terceiros para fins de marketing.</p>
                </div>
                
                <div style="margin-top: 1rem;">
                    <p style="font-weight: 700; font-size: 1rem; color: #1f2937; margin-top: 0; margin-bottom: 0.5rem;">3. Segurança dos Dados</p>
                    <p style="margin-top: 0; margin-bottom: 1rem;">Empregamos medidas de segurança técnicas e administrativas para proteger seus dados pessoais contra acesso não autorizado, destruição, perda, alteração ou divulgação. Todos os dados sensíveis são criptografados.</p>
                </div>
                
                <div style="margin-top: 1rem;">
                    <p style="font-weight: 700; font-size: 1rem; color: #1f2937; margin-top: 0; margin-bottom: 0.5rem;">4. Direitos do Titular</p>
                    <p style="margin-top: 0; margin-bottom: 1rem;">Conforme a Lei Geral de Proteção de Dados (LGPD), você tem o direito de confirmar a existência do tratamento, acessar seus dados, corrigi-los, pedir a anonimização, bloqueio ou eliminação, e revogar o consentimento a qualquer momento.</p>
                </div>
                
                <p style="font-size: 0.75rem; color: #6b7280; margin-top: 1rem;">Última atualização: Setembro de 2025.</p>
            </div>
        </details>
    </section>

    <!-- Adiciona uma área de contato simples no final -->
    <div style="margin-top: 3rem; text-align: center; color: #4b5563;">
        <p style="font-size: 1.125rem; margin-bottom: 0.5rem;">Ainda tem dúvidas? Fale conosco!</p>
        <a href="#" style="color: #4f46e5; text-decoration: none; font-weight: 500;">
            Suporte ao Cliente 24h
        </a>
    </div>
          `,
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      })

      // 4. Post de exemplo: Sobre Nós
      const sobrePost = await prisma.post.create({
        data: {
          title: 'Sobre Nós',
          slug: 'sobre-nos',
          description: 'Página institucional sobre a empresa',
          resume: 'Conheça mais sobre nossa empresa e nossos serviços de seguro viagem.',
          content: `
            <h1>Sobre Nossa Empresa</h1>
            
            <p>Somos uma empresa especializada em seguros de viagem, comprometida em oferecer proteção e tranquilidade para seus momentos de lazer e negócios.</p>
            
            <h2>Nossa Missão</h2>
            <p>Proporcionar segurança e paz de espírito para viajantes através de soluções de seguro personalizadas e atendimento de excelência.</p>
            
            <h2>Nossa Visão</h2>
            <p>Ser a referência em seguros de viagem, reconhecida pela qualidade dos serviços e pela confiança dos clientes.</p>
            
            <h2>Nossos Valores</h2>
            <ul>
              <li>Transparência em todas as relações</li>
              <li>Excelência no atendimento</li>
              <li>Inovação constante</li>
              <li>Compromisso com o cliente</li>
            </ul>
          `,
          userId: admin.id,
          status: PostStatus.PUBLISHED,
          publishedAt: new Date(),
          metadata: {
            title: 'Sobre Nós | AZ Seguros',
            description: 'Conheça mais sobre nossa empresa de seguros de viagem',
            keywords: 'sobre nós, empresa, seguro viagem, institucional',
          },
        },
      })

      // Associar o post à categoria institucional
      await prisma.postCategory.create({
        data: { postId: sobrePost.id, categoryId: institucionalCategory.id },
      })

      // 5. Posts de Blog de Viagem
      const blogPosts = [
        {
          title: 'Destinos Imperdíveis na Europa: Guia Completo para Sua Próxima Viagem',
          slug: 'destinos-imperdiveis-europa-guia-completo',
          description: 'Descubra os melhores destinos europeus para sua próxima aventura',
          resume:
            'Um guia completo com os destinos mais incríveis da Europa, dicas de viagem e informações sobre seguro viagem obrigatório.',
          content: `
            <h1>Destinos Imperdíveis na Europa</h1>
            
            <p>A Europa oferece uma diversidade incrível de destinos, cada um com sua própria personalidade e charme único. Neste guia, vamos explorar os lugares mais fascinantes do continente.</p>
            
            <h2>Paris, França</h2>
            <p>A Cidade Luz continua sendo um dos destinos mais românticos do mundo. Não deixe de visitar a Torre Eiffel, o Louvre e passear pelos charmosos cafés de Montmartre.</p>
            
            <h2>Roma, Itália</h2>
            <p>A Cidade Eterna oferece uma viagem no tempo através de suas ruínas antigas, arte renascentista e culinária incomparável.</p>
            
            <h2>Barcelona, Espanha</h2>
            <p>Com sua arquitetura única de Gaudí, praias mediterrâneas e vida noturna vibrante, Barcelona é um destino que combina cultura e diversão.</p>
            
            <h2>Amsterdã, Holanda</h2>
            <p>Os canais pitorescos, museus de classe mundial e a atmosfera liberal fazem de Amsterdã um destino único na Europa.</p>
            
            <h2>Importante: Seguro Viagem Obrigatório</h2>
            <p>Lembre-se de que para viajar para países do Espaço Schengen, o seguro viagem é obrigatório com cobertura mínima de €30.000.</p>
          `,
          coverImage:
            'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop',
          fullUrl: 'https://azseguros.com/blog/destinos-imperdiveis-europa-guia-completo',
        },
        {
          title: 'Aventuras na América do Sul: Roteiro de 15 Dias Pelos Andes',
          slug: 'aventuras-america-sul-roteiro-andes',
          description: 'Explore as maravilhas dos Andes em um roteiro épico de 15 dias',
          resume:
            'Descubra paisagens de tirar o fôlego, culturas ancestrais e aventuras inesquecíveis em uma jornada pelos Andes sul-americanos.',
          content: `
            <h1>Aventuras na América do Sul: Roteiro pelos Andes</h1>
            
            <p>Os Andes oferecem algumas das paisagens mais espetaculares do mundo. Este roteiro de 15 dias levará você através de três países incríveis.</p>
            
            <h2>Dias 1-5: Peru - Cusco e Machu Picchu</h2>
            <p>Comece sua jornada na antiga capital do Império Inca. Aclimatize-se em Cusco antes de partir para a trilha inca rumo a Machu Picchu.</p>
            
            <h2>Dias 6-10: Bolívia - Salar de Uyuni</h2>
            <p>Atravesse a fronteira para a Bolívia e maravilhe-se com o maior deserto de sal do mundo. As paisagens surrealistas são inesquecíveis.</p>
            
            <h2>Dias 11-15: Chile - Deserto do Atacama</h2>
            <p>Termine sua aventura no deserto mais árido do mundo, com seus gêiseres, lagunas coloridas e céus estrelados únicos.</p>
            
            <h2>Dicas de Segurança</h2>
            <p>Para aventuras em alta altitude, é essencial ter um seguro viagem com cobertura para atividades de aventura e emergências médicas.</p>
          `,
          coverImage:
            'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&h=600&fit=crop',
          fullUrl: 'https://azseguros.com/blog/aventuras-america-sul-roteiro-andes',
        },
        {
          title: 'Tailândia: O Paraíso Tropical do Sudeste Asiático',
          slug: 'tailandia-paraiso-tropical-sudeste-asiatico',
          description: 'Descubra as belezas naturais e culturais da Tailândia',
          resume:
            'Das praias paradisíacas aos templos dourados, a Tailândia oferece uma experiência única que combina relaxamento e aventura.',
          content: `
            <h1>Tailândia: O Paraíso Tropical</h1>
            
            <p>A Tailândia é um destino que encanta viajantes do mundo inteiro com sua combinação única de praias paradisíacas, cultura rica e hospitalidade incomparável.</p>
            
            <h2>Bangkok: A Capital Vibrante</h2>
            <p>Comece sua jornada na capital, explorando templos dourados, mercados flutuantes e a famosa vida noturna da cidade.</p>
            
            <h2>Ilhas do Sul: Phuket e Koh Phi Phi</h2>
            <p>As ilhas do sul oferecem algumas das praias mais bonitas do mundo, perfeitas para relaxar e praticar esportes aquáticos.</p>
            
            <h2>Norte Cultural: Chiang Mai</h2>
            <p>No norte, descubra a cultura tradicional tailandesa, templos antigos e a oportunidade de interagir com elefantes de forma ética.</p>
            
            <h2>Culinária Tailandesa</h2>
            <p>Não deixe de experimentar a autêntica culinária local, desde o famoso Pad Thai até pratos mais exóticos nos mercados de rua.</p>
            
            <h2>Seguro Viagem para a Ásia</h2>
            <p>Para viagens ao sudeste asiático, recomendamos seguro com cobertura para doenças tropicais e atividades aquáticas.</p>
          `,
          coverImage:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
          fullUrl: 'https://azseguros.com/blog/tailandia-paraiso-tropical-sudeste-asiatico',
        },
        {
          title: 'Japão: Entre Tradição e Modernidade',
          slug: 'japao-tradicao-modernidade',
          description: 'Uma jornada fascinante pelo país do sol nascente',
          resume:
            'Explore o contraste único entre a tradição milenar e a tecnologia de ponta que define o Japão moderno.',
          content: `
            <h1>Japão: Entre Tradição e Modernidade</h1>
            
            <p>O Japão oferece uma experiência de viagem única, onde arranha-céus futuristas convivem harmoniosamente com templos milenares.</p>
            
            <h2>Tóquio: A Metrópole do Futuro</h2>
            <p>A capital japonesa é um caldeirão de inovação, com seus bairros únicos como Shibuya, Harajuku e o tradicional Asakusa.</p>
            
            <h2>Kyoto: O Coração Cultural</h2>
            <p>A antiga capital preserva a essência tradicional do Japão com seus milhares de templos, jardins zen e o famoso distrito de Gion.</p>
            
            <h2>Monte Fuji: Símbolo Nacional</h2>
            <p>A montanha sagrada oferece paisagens deslumbrantes e experiências espirituais únicas, especialmente durante a temporada de escalada.</p>
            
            <h2>Cultura e Etiqueta</h2>
            <p>Entender a cultura japonesa enriquece enormemente a experiência de viagem. Respeito, pontualidade e cortesia são fundamentais.</p>
            
            <h2>Seguro Viagem no Japão</h2>
            <p>Embora o Japão seja muito seguro, os custos médicos podem ser altos. Um bom seguro viagem é essencial.</p>
          `,
          coverImage:
            'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
          fullUrl: 'https://azseguros.com/blog/japao-tradicao-modernidade',
        },
        {
          title: 'Austrália: Terra dos Contrastes e Aventuras',
          slug: 'australia-terra-contrastes-aventuras',
          description: 'Explore a diversidade única do continente australiano',
          resume:
            'Das cidades cosmopolitas às paisagens selvagens do Outback, a Austrália oferece aventuras para todos os gostos.',
          content: `
            <h1>Austrália: Terra dos Contrastes</h1>
            
            <p>A Austrália é um continente de contrastes extremos, oferecendo desde cidades modernas até paisagens selvagens únicas no mundo.</p>
            
            <h2>Sydney: A Cidade Ícone</h2>
            <p>Com sua famosa Opera House e Harbour Bridge, Sydney combina beleza natural com sofisticação urbana.</p>
            
            <h2>Grande Barreira de Coral</h2>
            <p>Um dos ecossistemas mais ricos do planeta, perfeito para mergulho e snorkeling em águas cristalinas.</p>
            
            <h2>Outback: O Coração Selvagem</h2>
            <p>Explore o interior árido e misterioso da Austrália, incluindo o icônico Uluru (Ayers Rock).</p>
            
            <h2>Melbourne: Capital Cultural</h2>
            <p>Conhecida por sua cena artística vibrante, cafés excepcionais e arquitetura vitoriana preservada.</p>
            
            <h2>Vida Selvagem Única</h2>
            <p>Encontre cangurus, coalas, wombats e muitas outras espécies que só existem na Austrália.</p>
            
            <h2>Seguro Viagem na Austrália</h2>
            <p>Para atividades de aventura como mergulho e trilhas no Outback, certifique-se de ter cobertura adequada.</p>
          `,
          coverImage:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
          fullUrl: 'https://azseguros.com/blog/australia-terra-contrastes-aventuras',
        },
      ]

      // Criar posts de blog de viagem
      for (const postData of blogPosts) {
        const post = await prisma.post.create({
          data: {
            title: postData.title,
            slug: postData.slug,
            description: postData.description,
            resume: postData.resume,
            content: postData.content,
            coverImage: postData.coverImage,
            fullUrl: postData.fullUrl,
            userId: admin.id,
            status: PostStatus.PUBLISHED,
            publishedAt: new Date(),
          },
        })

        // Associar à categoria Blog
        await prisma.postCategory.create({
          data: { postId: post.id, categoryId: blogCategory.id },
        })

        // Associar às tags relevantes
        await prisma.postTag.createMany({
          data: [
            { postId: post.id, tagId: viagemTag.id },
            { postId: post.id, tagId: turismoTag.id },
          ],
        })
      }

      // 6. Avaliações fictícias
      const avaliacoes = [
        {
          name: 'Maria Silva',
          rating: 5,
          comment:
            'Excelente atendimento! Contratei o seguro para minha viagem à Europa e tive total tranquilidade. O processo foi rápido e o suporte foi excepcional.',
          location: 'São Paulo, SP',
        },
        {
          name: 'João Santos',
          rating: 5,
          comment:
            'Precisei usar o seguro durante minha viagem ao Japão e fui muito bem atendido. Recomendo a todos que viajam com frequência.',
          location: 'Rio de Janeiro, RJ',
        },
        {
          name: 'Ana Costa',
          rating: 4,
          comment:
            'Ótima experiência! O site é fácil de usar e consegui comparar várias opções de seguro. Preços competitivos e cobertura completa.',
          location: 'Belo Horizonte, MG',
        },
        {
          name: 'Carlos Oliveira',
          rating: 5,
          comment:
            'Já contratei várias vezes e sempre tive uma experiência positiva. Atendimento rápido e eficiente, principalmente em situações de emergência.',
          location: 'Porto Alegre, RS',
        },
        {
          name: 'Fernanda Lima',
          rating: 5,
          comment:
            'Viajei para a Tailândia e tive um problema de saúde. O seguro cobriu tudo e o atendimento foi impecável. Muito obrigada!',
          location: 'Brasília, DF',
        },
        {
          name: 'Roberto Mendes',
          rating: 4,
          comment:
            'Bom custo-benefício e processo de contratação simples. Usei para uma viagem de negócios aos EUA e correu tudo bem.',
          location: 'Salvador, BA',
        },
        {
          name: 'Juliana Ferreira',
          rating: 5,
          comment:
            'Atendimento personalizado e muito profissional. Conseguiram me ajudar a escolher o melhor plano para minha lua de mel na Grécia.',
          location: 'Curitiba, PR',
        },
        {
          name: 'Pedro Almeida',
          rating: 5,
          comment:
            'Excelente relação custo-benefício! Já indiquei para vários amigos e todos ficaram satisfeitos com o serviço.',
          location: 'Fortaleza, CE',
        },
        {
          name: 'Camila Rodrigues',
          rating: 4,
          comment:
            'Processo de contratação muito fácil e intuitivo. Recebi a apólice rapidamente e pude viajar com tranquilidade.',
          location: 'Recife, PE',
        },
        {
          name: 'Lucas Barbosa',
          rating: 5,
          comment:
            'Tive que cancelar minha viagem por motivos pessoais e o seguro cobriu os custos. Atendimento excepcional em um momento difícil.',
          location: 'Goiânia, GO',
        },
      ]

      // Criar avaliações
      for (const avaliacaoData of avaliacoes) {
        await prisma.avaliation.create({
          data: {
            name: avaliacaoData.name,
            rating: avaliacaoData.rating,
            comment: avaliacaoData.comment,
            location: avaliacaoData.location,
            active: true,
          },
        })
      }

      console.log('✅ System pages criadas com sucesso!')
      console.log('✅ Posts de blog de viagem criados com sucesso!')
      console.log('✅ Avaliações fictícias criadas com sucesso!')
    }
  } catch (error) {
    console.error('❌ Erro ao criar seed de posts:', error)
    throw error
  }
}

/**
 * Função principal que executa todos os seeds na ordem correta
 */
async function main() {
  try {
    console.log('🚀 Iniciando seed completo do sistema...')
    console.log('=====================================')

    // 1. Seed de RBAC (base do sistema)
    await seedRbac()
    console.log('')

    // 2. Seed de usuário admin (depende do RBAC)
    await seedAdminUser()
    console.log('')

    // 3. Seed de posts (depende do usuário admin)
    await seedPosts()
    console.log('')

    // 4. Seed de Front Sections (seção "Por que escolher")
    await seedFrontSections()
    console.log('')

    console.log('🎉 Seed completo executado com sucesso!')
    console.log('=====================================')
  } catch (error) {
    console.error('💥 Erro durante a execução do seed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar o seed principal
main()
  .then(() => console.log('✅ Script de seed finalizado'))
  .catch((e) => {
    console.error('❌ Erro no script de seed:', e)
    process.exit(1)
  })
