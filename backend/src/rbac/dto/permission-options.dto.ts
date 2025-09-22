import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { Resource } from '../enums/resource.enum'

/**
 * DTO para opções granulares de permissões
 */
export class PermissionOptionsDto {
  @ApiProperty({
    description: 'Recurso ao qual a permissão se aplica',
    enum: Resource,
    example: Resource.USUARIOS,
  })
  @IsNotEmpty({ message: 'O recurso é obrigatório' })
  @IsEnum(Resource, { message: 'Recurso inválido' })
  resource: Resource

  @ApiProperty({
    description: 'Permissão para visualizar o recurso',
    example: true,
  })
  @IsBoolean({ message: 'A permissão de visualização deve ser um booleano' })
  canRead: boolean

  @ApiProperty({
    description: 'Permissão para criar o recurso',
    example: true,
  })
  @IsBoolean({ message: 'A permissão de criação deve ser um booleano' })
  canCreate: boolean

  @ApiProperty({
    description: 'Permissão para editar o recurso',
    example: true,
  })
  @IsBoolean({ message: 'A permissão de edição deve ser um booleano' })
  canUpdate: boolean

  @ApiProperty({
    description: 'Permissão para excluir o recurso',
    example: false,
  })
  @IsBoolean({ message: 'A permissão de exclusão deve ser um booleano' })
  canDelete: boolean
}

/**
 * DTO para criação de role com permissões granulares
 */
export class CreateRoleWithPermissionsDto {
  @ApiProperty({
    description: 'Nome da role',
    example: 'Editor de Blog',
  })
  @IsNotEmpty({ message: 'O nome da role é obrigatório' })
  @IsString({ message: 'O nome da role deve ser uma string' })
  name: string

  @ApiProperty({
    description: 'Descrição da role',
    example: 'Pode criar e editar posts do blog, mas não pode excluí-los',
  })
  @IsString({ message: 'A descrição deve ser uma string' })
  description: string

  @ApiProperty({
    description: 'Lista de permissões granulares para cada recurso',
    type: [PermissionOptionsDto],
  })
  @IsNotEmpty({ message: 'As permissões são obrigatórias' })
  permissions: PermissionOptionsDto[]
}
