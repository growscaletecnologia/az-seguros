/* eslint-disable prettier/prettier */
import { PrismaClient, PostStatus } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Seed para dados iniciais do sistema de gerenciamento de conteúdo (CMS)
 * Cria categorias, tags e posts de exemplo
 */
export async function seedPosts() {
  try {
    // Verifica se já existem categorias
    const existingCategories = await prisma.category.findMany()
    if (existingCategories.length === 0) {
      console.log('Criando categorias iniciais...')
      await prisma.category.createMany({
        data: [
          { name: 'Blog', slug: 'blog', description: 'Artigos do blog' },
          { name: 'Institucional', slug: 'institucional', description: 'Páginas institucionais' },
          {
            name: 'Dicas de Viagem',
            slug: 'dicas-de-viagem',
            description: 'Dicas úteis para viajantes',
          },
          { name: 'Seguros', slug: 'seguros', description: 'Informações sobre seguros' },
        ],
      })
    }

    // Verifica se já existem tags
    const existingTags = await prisma.tag.findMany()
    if (existingTags.length === 0) {
      console.log('Criando tags iniciais...')
      await prisma.tag.createMany({
        data: [
          { name: 'Viagem', slug: 'viagem', description: 'Conteúdo relacionado a viagens' },
          { name: 'Seguro', slug: 'seguro', description: 'Conteúdo sobre seguros' },
          { name: 'Internacional', slug: 'internacional', description: 'Viagens internacionais' },
          { name: 'Dicas', slug: 'dicas', description: 'Dicas e recomendações' },
          { name: 'Saúde', slug: 'saude', description: 'Saúde durante viagens' },
        ],
      })
    }

    // Verifica se já existem posts
    const existingPosts = await prisma.post.findMany()
    if (existingPosts.length === 0) {
      console.log('Criando post de exemplo...')

      // Busca o usuário admin para associar ao post
      const admin = await prisma.user.findFirst({
        where: { email: 'admin@azseguros.com' },
      })

      if (!admin) {
        console.log('Usuário admin não encontrado. Pulando criação de posts.')
        return
      }

      // Busca categorias e tags para associar ao post
      const institucionalCategory = await prisma.category.findFirst({
        where: { slug: 'institucional' },
      })

      const viagemTag = await prisma.tag.findFirst({
        where: { slug: 'viagem' },
      })

      const seguroTag = await prisma.tag.findFirst({
        where: { slug: 'seguro' },
      })

      if (!institucionalCategory || !viagemTag || !seguroTag) {
        console.log('Categorias ou tags não encontradas. Pulando criação de posts.')
        return
      }

      // Cria um post de exemplo
      const post = await prisma.post.create({
        data: {
          title: 'Sobre Nós',
          slug: 'sobre-nos',
          description: 'Página institucional sobre a empresa',
          resume: 'Conheça mais sobre nossa empresa e nossos serviços de seguro viagem.',
          content: `
            <h1>Sobre Nossa Empresa</h1>
            <p>Somos uma empresa especializada em seguros de viagem, oferecendo as melhores coberturas para garantir sua tranquilidade durante suas viagens nacionais e internacionais.</p>
            <h2>Nossa Missão</h2>
            <p>Proporcionar segurança e tranquilidade para nossos clientes em suas jornadas pelo mundo, com atendimento personalizado e coberturas abrangentes.</p>
            <h2>Nossos Valores</h2>
            <ul>
              <li>Transparência</li>
              <li>Confiabilidade</li>
              <li>Excelência no atendimento</li>
              <li>Inovação</li>
            </ul>
          `,
          userId: admin.id,
          status: PostStatus.PUBLISHED,
          publishedAt: new Date(),
          metadata: {
            title: 'Sobre Nós | Seguro Viagem',
            description: 'Conheça mais sobre nossa empresa de seguros de viagem',
            keywords: 'seguro viagem, sobre nós, institucional',
          },
        },
      })

      // Associa o post à categoria
      await prisma.postCategory.create({
        data: {
          postId: post.id,
          categoryId: institucionalCategory.id,
        },
      })

      // Associa o post às tags
      await prisma.postTag.createMany({
        data: [
          {
            postId: post.id,
            tagId: viagemTag.id,
          },
          {
            postId: post.id,
            tagId: seguroTag.id,
          },
        ],
      })

      // Cria uma mídia para o post
      await prisma.postMedia.create({
        data: {
          postId: post.id,
          url: 'about-us-banner.jpg',
          type: 'image',
          title: 'Banner Sobre Nós',
          alt: 'Imagem representativa da empresa',
          isMain: true,
        },
      })

      console.log('Post de exemplo criado com sucesso!')
    }
  } catch (error) {
    console.error('Erro ao criar seeds para o CMS:', error)
  }
}
