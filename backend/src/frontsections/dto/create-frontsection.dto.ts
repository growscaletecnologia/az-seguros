import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsEnum } from 'class-validator'
import { FrontSectionStatus } from '@prisma/client'

/**
 * DTO para criação de Front Section
 * Define os campos necessários para criar uma nova seção frontal
 */
export class CreateFrontsectionDto {
  @ApiProperty({
    description: 'Título da seção',
    example: 'Melhor Preço',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({
    description: 'Descrição detalhada da seção',
    example: 'Garantimos o melhor preço do mercado ou devolvemos a diferença.',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({
    description: 'Nome do ícone do Lucide React (ex: DollarSign, Clock, Shield, Users)',
    example: 'DollarSign',
    enum: [
      // Ícones de negócios/financeiro
      'DollarSign',
      'Euro',
      'PoundSterling',
      'CreditCard',
      'Banknote',
      'TrendingUp',
      'TrendingDown',
      // Ícones de tempo/suporte
      'Clock',
      'Clock3',
      'Clock9',
      'Timer',
      'Hourglass',
      'Calendar',
      'CalendarDays',
      // Ícones de segurança
      'Shield',
      'ShieldCheck',
      'ShieldAlert',
      'Lock',
      'Unlock',
      'Key',
      'Eye',
      'EyeOff',
      // Ícones de pessoas/clientes
      'User',
      'Users',
      'UserCheck',
      'UserPlus',
      'UserX',
      'Heart',
      'Star',
      'Award',
      // Ícones de comunicação
      'Phone',
      'PhoneCall',
      'MessageCircle',
      'Mail',
      'Send',
      'Headphones',
      // Ícones de verificação/qualidade
      'CheckCircle',
      'CheckSquare',
      'Badge',
      'Trophy',
      'Target',
      'Zap',
      // Ícones de localização/viagem
      'MapPin',
      'Globe',
      'Plane',
      'Car',
      'Train',
      'Ship',
      'Compass',
      'Navigation',
      // Outros ícones úteis
      'Settings',
      'Cog',
      'Wrench',
      'Tool',
      'Package',
      'Gift',
      'Sparkles',
      'Rocket',
    ],
  })
  @IsString()
  @IsNotEmpty()
  icon: string

  @ApiProperty({
    description: 'Cor de fundo do ícone',
    example: 'blue',
    enum: ['blue', 'green', 'orange', 'red', 'purple', 'yellow', 'pink', 'gray'],
    default: 'blue',
  })
  @IsString()
  @IsOptional()
  bgColor?: string = 'blue'

  @ApiProperty({
    description: 'Ordem de exibição da seção',
    example: 1,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number = 0

  @ApiProperty({
    description: 'Status da seção',
    enum: FrontSectionStatus,
    example: FrontSectionStatus.ACTIVE,
    default: FrontSectionStatus.ACTIVE,
  })
  @IsEnum(FrontSectionStatus)
  @IsOptional()
  status?: FrontSectionStatus = FrontSectionStatus.ACTIVE
}
