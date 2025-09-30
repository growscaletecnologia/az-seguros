import { ApiProperty } from '@nestjs/swagger'
import { FrontSection, FrontSectionStatus } from '@prisma/client'

/**
 * Entidade que representa uma seção frontal
 */
export class FrontsectionEntity implements FrontSection {
  @ApiProperty({
    description: 'ID único da seção',
    example: 'clxxxxx',
  })
  id: string

  @ApiProperty({
    description: 'Título da seção',
    example: 'Melhor Preço',
  })
  title: string

  @ApiProperty({
    description: 'Descrição da seção',
    example: 'Garantimos o melhor preço do mercado ou devolvemos a diferença.',
  })
  description: string

  @ApiProperty({
    description: 'Nome do ícone',
    example: 'DollarSign',
  })
  icon: string

  @ApiProperty({
    description: 'Cor de fundo do ícone',
    example: 'blue',
  })
  bgColor: string

  @ApiProperty({
    description: 'Ordem de exibição',
    example: 1,
  })
  order: number

  @ApiProperty({
    description: 'Status da seção',
    enum: FrontSectionStatus,
    example: FrontSectionStatus.ACTIVE,
  })
  status: FrontSectionStatus

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Data de atualização',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date
}
