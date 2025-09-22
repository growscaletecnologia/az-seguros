import { PrismaClient, UserStatus } from '@prisma/client'
import * as bcrypt from 'bcrypt'

/**
 * Seed script para criar um usuário administrador padrão
 * Este script deve ser executado apenas uma vez para configuração inicial
 */
async function seedAdminUser() {
  const prisma = new PrismaClient()
  const SALT_ROUNDS = 12

  try {
    console.log('Iniciando seed de usuário administrador padrão...')

    // Senha padrão para o admin (deve ser alterada após o primeiro login)
    const defaultPassword = 'Admin@123'
    const passwordHash = await bcrypt.hash(defaultPassword, SALT_ROUNDS)

    // Dados do usuário admin
    const adminEmail = 'admin@azseguros.com'
    // Verificar se o admin já existe
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (existingAdmin) {
      console.log('Usuário administrador já existe, pulando criação...')
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
        emailVerifiedAt: new Date(), // Já verificado por padrão
        isActive: true,
      },
    })

    console.log(`Usuário administrador criado com ID: ${admin.id}`)

    // Buscar a role de Admin
    const adminRole = await prisma.role.findUnique({
      where: { name: 'Admin' },
    })

    if (!adminRole) {
      console.error('Role Admin não encontrada! Execute primeiro o rbac-seed.ts')
      return
    }

    // Associar o usuário à role Admin
    await prisma.userRole.create({
      data: {
        userId: admin.id,
        roleId: adminRole.id,
      },
    })

    console.log('Usuário administrador associado à role Admin com sucesso!')
    console.log('-----------------------------------------------------')
    console.log('CREDENCIAIS DO ADMINISTRADOR PADRÃO:')
    console.log(`Email: ${adminEmail}`)
    console.log(`Senha: ${defaultPassword}`)
    console.log('IMPORTANTE: Altere esta senha após o primeiro login!')
    console.log('-----------------------------------------------------')
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar a função de seed
seedAdminUser()
  .then(() => console.log('Seed de administrador concluído com sucesso!'))
  .catch((e) => console.error('Erro no script de seed de administrador:', e))
