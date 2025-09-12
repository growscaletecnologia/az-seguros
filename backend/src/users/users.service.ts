import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserRepository } from './users.repository'
import { BadRequestError, ConflictError } from 'src/common/errors/http-errors'

@Injectable()
export class UsersService {
  userRepository = new UserRepository()

  async create(createUserDto: CreateUserDto) {
    const foundedUser = await this.userRepository.listByEmail(createUserDto.email)

    if (foundedUser) {
      // dispara 409 Conflict com mensagem clara
      throw new ConflictError('User already exists')
    }

    // aqui você chamaria o repo de verdade pra criar
    return await this.userRepository.create(createUserDto)
  }

  async findAll() {
    return await this.userRepository.listAll()
  }

  async findOne(id: string) {
    return await this.userRepository.listById(id)
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const foundedUser = await this.userRepository.listById(id)
    if (!foundedUser) {
      throw new BadRequestError('User not found')
    }

    return await this.userRepository.update(id, updateUserDto)
  }
  // só admin pode apagar usuários(aidcionar softDelete)
  async remove(id: string) {
    return `This action removes a #${id} user`
  }
}
