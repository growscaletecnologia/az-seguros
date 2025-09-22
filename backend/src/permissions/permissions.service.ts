import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new permission
   * @param createPermissionDto - Data for creating a permission
   * @returns The created permission
   */
  async create(createPermissionDto: CreatePermissionDto) {
    return this.prisma.permission.create({
      data: createPermissionDto,
    })
  }

  /**
   * Get all permissions
   * @returns List of all permissions
   */
  async findAll() {
    return this.prisma.permission.findMany()
  }

  /**
   * Get a permission by ID
   * @param id - Permission ID
   * @returns The permission if found
   */
  async findOne(id: number) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    })

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`)
    }

    return permission
  }

  /**
   * Update a permission
   * @param id - Permission ID
   * @param updatePermissionDto - Data for updating the permission
   * @returns The updated permission
   */
  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    await this.findOne(id) // Check if exists

    return this.prisma.permission.update({
      where: { id },
      data: updatePermissionDto,
    })
  }

  /**
   * Delete a permission
   * @param id - Permission ID
   * @returns The deleted permission
   */
  async remove(id: number) {
    await this.findOne(id) // Check if exists

    return this.prisma.permission.delete({
      where: { id },
    })
  }

  /**
   * Find permissions by resource
   * @param resource - Resource name
   * @returns List of permissions for the resource
   */
  async findByResource(resource: string) {
    return this.prisma.permission.findMany({
      where: { resource },
    })
  }
}
