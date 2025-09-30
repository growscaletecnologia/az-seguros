import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserRepository } from './users.repository'
import { BadRequestError, ConflictError } from 'src/common/errors/http-errors'
import * as bcrypt from 'bcrypt'
import { UserStatus } from 'src/generated/prisma'

@Injectable()
export class UsersService {
  userRepository = new UserRepository()
  private readonly SALT_ROUNDS = 12

  async create(createUserDto: CreateUserDto) {
    const foundedUser = await this.userRepository.listByEmail(createUserDto.email)

    if (foundedUser) {
      // dispara 409 Conflict com mensagem clara
      throw new ConflictError('User already exists')
    }
    if (!createUserDto.role) {
      throw new BadRequestError('Role is required')
    }
    const userStatus: UserStatus = createUserDto.status ?? 'PENDING'
    const passwordHash = await bcrypt.hash(createUserDto.password, this.SALT_ROUNDS)
    const user = await this.userRepository.create({
      email: createUserDto.email.toLowerCase().trim(),
      name: createUserDto.name,
      cpfCnpj: createUserDto.cpfCnpj,
      phone: createUserDto.phone,
      birthDate: createUserDto.birthDate,
      password: passwordHash,
      role: createUserDto.role ?? 'CUSTOMER',
      status: userStatus,
      createdAt: new Date(),
      addresses: createUserDto.addresses || [],
    })

    return { id: user.id, email: user.email, name: user.name, role: user.role, status: user.status }
  }

  async verifyEmail(id: string) {
    const user = await this.userRepository.verifyEmail(id)
    return { id: user.id, email: user.email, emailVerifiedAt: user.emailVerifiedAt }
  }
  // async toggleUserStatus(id: string) {
  //   const user = await this.userRepository.listById(id)
  //   if (!user) {
  //     throw new BadRequestError('User not found')
  //   }

  //   const newStatus = user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE

  //   return await this.userRepository.update(id, { status: newStatus })
  // }

  async findAll() {
    return await this.userRepository.listAll()
  }

  async findOne(id: string) {
    return await this.userRepository.listById(id)
  }

  async findByEmail(email: string) {
    return await this.userRepository.listByEmail(email)
  }
  async setPasswordById(id: string, newPassword: string) {
    const passwordHash = await bcrypt.hash(newPassword, this.SALT_ROUNDS)
    return await this.userRepository.update(id, { password: passwordHash })
  }
  async update(id: string, updateUserDto: UpdateUserDto, currentUserId?: string) {
    const foundedUser = await this.userRepository.listById(id)
    if (!foundedUser) {
      throw new BadRequestError('User not found')
    }

    // Impedir que o usuário desative a si mesmo
    if (currentUserId && currentUserId === id && updateUserDto.status === 'INACTIVE') {
      throw new BadRequestError('Você não pode desativar sua própria conta')
    }

    return await this.userRepository.update(id, updateUserDto)
  }
  // só admin pode apagar usuários(aidcionar softDelete)
  async remove(id: string) {
    const foundedUser = await this.userRepository.listById(id)
    if (!foundedUser) {
      throw new BadRequestError('User not found')
    }

    return await this.userRepository.delete(id)
  }
}
