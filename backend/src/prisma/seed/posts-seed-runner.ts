/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client'
import { seedPosts } from './posts-seed'

/**
 * Script para executar apenas o seed de posts, categorias e tags
 * Este arquivo é executado pelo comando npm run seed:posts
 */
const prisma = new PrismaClient()

async function runPostsSeed() {
  try {
    console.log('Iniciando seed apenas para posts, categorias e tags...')

    // Executa apenas o seed de posts
    await seedPosts()

    console.log('Seed de posts concluído com sucesso!')
  } catch (error) {
    console.error('Erro durante o seed de posts:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executa o seed
runPostsSeed()
