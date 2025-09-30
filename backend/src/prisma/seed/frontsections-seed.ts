/* eslint-disable prettier/prettier */
import { PrismaClient, FrontSectionStatus } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Seed para FrontSections - Seção "Por que escolher"
 * Cria os 4 blocos iniciais da seção com ícones do Lucide React
 */
export async function seedFrontSections() {
  try {
    console.log('🎯 Iniciando seed de Front Sections...')

    // Dados dos 4 blocos iniciais baseados na imagem fornecida
    const frontSections = [
      {
        title: 'Melhor Preço',
        description: 'Garantimos o melhor preço do mercado ou devolvemos a diferença.',
        icon: 'DollarSign', // Ícone de cifrão do Lucide React
        bgColor: 'orange',
        order: 1,
        status: FrontSectionStatus.ACTIVE,
      },
      {
        title: 'Suporte 24h',
        description: 'Atendimento especializado 24 horas por dia, 7 dias por semana.',
        icon: 'Clock', // Ícone de relógio do Lucide React
        bgColor: 'red',
        order: 2,
        status: FrontSectionStatus.ACTIVE,
      },
      {
        title: 'Compra Segura',
        description: 'Transações 100% seguras com certificado SSL e criptografia.',
        icon: 'Shield', // Ícone de escudo do Lucide React
        bgColor: 'blue',
        order: 3,
        status: FrontSectionStatus.ACTIVE,
      },
      {
        title: '+1M Clientes',
        description: 'Mais de 1 milhão de viajantes já confiaram em nossos serviços.',
        icon: 'Users', // Ícone de usuários do Lucide React
        bgColor: 'purple',
        order: 4,
        status: FrontSectionStatus.ACTIVE,
      },
    ]

    console.log('📝 Criando Front Sections...')

    // Criar cada seção usando upsert para evitar duplicatas
    for (const section of frontSections) {
      await prisma.frontSection.upsert({
        where: {
          // Usar uma combinação única para identificar registros existentes
          id: `frontsection-${section.order}`, // ID customizado baseado na ordem
        },
        update: {
          title: section.title,
          description: section.description,
          icon: section.icon,
          bgColor: section.bgColor,
          order: section.order,
          status: section.status,
        },
        create: {
          id: `frontsection-${section.order}`, // ID customizado
          title: section.title,
          description: section.description,
          icon: section.icon,
          bgColor: section.bgColor,
          order: section.order,
          status: section.status,
        },
      })

      console.log(`✅ Front Section criada: ${section.title}`)
    }

    console.log('🎯 Seed de Front Sections concluído com sucesso!')
  } catch (error) {
    console.error('❌ Erro no seed de Front Sections:', error)
    throw error
  }
}

/**
 * Lista de ícones disponíveis no Lucide React para referência:
 *
 * Ícones de negócios/financeiro:
 * - DollarSign, Euro, PoundSterling, CreditCard, Banknote, TrendingUp, TrendingDown
 *
 * Ícones de tempo/suporte:
 * - Clock, Clock3, Clock9, Timer, Hourglass, Calendar, CalendarDays
 *
 * Ícones de segurança:
 * - Shield, ShieldCheck, ShieldAlert, Lock, Unlock, Key, Eye, EyeOff
 *
 * Ícones de pessoas/clientes:
 * - User, Users, UserCheck, UserPlus, UserX, Heart, Star, Award
 *
 * Ícones de comunicação:
 * - Phone, PhoneCall, MessageCircle, Mail, Send, Headphones
 *
 * Ícones de verificação/qualidade:
 * - CheckCircle, CheckSquare, Badge, Award, Trophy, Target, Zap
 *
 * Ícones de localização/viagem:
 * - MapPin, Globe, Plane, Car, Train, Ship, Compass, Navigation
 *
 * Outros ícones úteis:
 * - Settings, Cog, Wrench, Tool, Package, Gift, Sparkles, Rocket
 */
