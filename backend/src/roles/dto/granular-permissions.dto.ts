import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsEnum, IsNotEmpty } from 'class-validator'
import { Resource } from '../../rbac/enums/resource.enum'

/**
 * DTO para uma permissão granular individual
 */
export class GranularPermissionDto {
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
 * DTO para atualizar permissões granulares de uma role
 */
export class UpdateGranularPermissionsDto {
  @ApiProperty({
    description: 'Lista de permissões granulares para cada recurso',
    type: [GranularPermissionDto],
  })
  @IsNotEmpty({ message: 'As permissões são obrigatórias' })
  @IsArray({ message: 'As permissões devem ser uma lista' })
  permissions: GranularPermissionDto[]
}
