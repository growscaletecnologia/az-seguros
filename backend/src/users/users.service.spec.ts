import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { UserRepository } from './users.repository'
import { ConflictError, BadRequestError, NotFoundError } from 'src/common/errors/http-errors'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from './dto/create-user.dto'

// Mock do UserRepository
jest.mock('./users.repository')

describe('UsersService', () => {
  let service: UsersService
  let userRepository: UserRepository

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile()

    service = module.get<UsersService>(UsersService)
    userRepository = service.userRepository
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    // Mock do bcrypt.hash
    const originalHash = bcrypt.hash
    beforeAll(() => {
      bcrypt.hash = jest.fn().mockImplementation((password, salt) => {
        return Promise.resolve(`hashed_${password}`)
      })
    })
    
    afterAll(() => {
      bcrypt.hash = originalHash
    })

    it('should create a user successfully', async () => {
      // Arrange
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        role: 'CUSTOMER',
        cpfCnpj: '12345678900',
        phone: '11999999999',
        birthDate: new Date('1990-01-01'),
      }

      const createdUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'CUSTOMER',
        status: 'PENDING',
      }

      // Mock do método listByEmail para retornar null (usuário não existe)
      jest.spyOn(userRepository, 'listByEmail').mockResolvedValue(null)
      
      // Mock do método create para retornar o usuário criado
      jest.spyOn(userRepository, 'create').mockResolvedValue({
        ...createdUser,
        password: 'hashed_password123',
      } as any)

      // Act
      const result = await service.create(createUserDto as CreateUserDto)

      // Assert
      expect(result).toEqual(createdUser)
      expect(userRepository.listByEmail).toHaveBeenCalledWith('test@example.com')
      expect(userRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed_password123',
        role: 'CUSTOMER',
      }))
    })

    it('should throw ConflictError if user already exists', async () => {
      // Arrange
      const createUserDto = {
        email: 'existing@example.com',
        name: 'Existing User',
        password: 'password123',
        role: 'CUSTOMER',
      }

      // Mock do método listByEmail para retornar um usuário existente
      jest.spyOn(userRepository, 'listByEmail').mockResolvedValue({
        id: 'existing-user',
        email: 'existing@example.com',
      } as any)

      // Act & Assert
      await expect(service.create(createUserDto as CreateUserDto)).rejects.toThrow(ConflictError)
      expect(userRepository.listByEmail).toHaveBeenCalledWith('existing@example.com')
      expect(userRepository.create).not.toHaveBeenCalled()
    })

    it('should throw BadRequestError if role is not provided', async () => {
      // Arrange
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        role: undefined,
      } as any

      // Mock do método listByEmail para retornar null (usuário não existe)
      jest.spyOn(userRepository, 'listByEmail').mockResolvedValue(null)

      // Act & Assert
      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestError)
      expect(userRepository.listByEmail).toHaveBeenCalledWith('test@example.com')
      expect(userRepository.create).not.toHaveBeenCalled()
    })

    it('should trim and lowercase email', async () => {
      // Arrange
      const createUserDto = {
        email: '  TEST@Example.com  ',
        name: 'Test User',
        password: 'password123',
        role: 'CUSTOMER',
      }

      // Mock do método listByEmail para retornar null (usuário não existe)
      jest.spyOn(userRepository, 'listByEmail').mockResolvedValue(null)
      
      // Mock do método create para retornar o usuário criado
      jest.spyOn(userRepository, 'create').mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'CUSTOMER',
        status: 'PENDING',
        password: 'hashed_password123',
      } as any)

      // Act
      await service.create(createUserDto as CreateUserDto)

      // Assert
      expect(userRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        email: 'test@example.com',
      }))
    })
  })

  describe('update', () => {
    // Mock do bcrypt.hash
    const originalHash = bcrypt.hash
    beforeAll(() => {
      bcrypt.hash = jest.fn().mockImplementation((password, salt) => {
        return Promise.resolve(`hashed_${password}`)
      })
    })
    
    afterAll(() => {
      bcrypt.hash = originalHash
    })

    it('should update a user successfully', async () => {
      // Arrange
      const userId = 'user-123'
      const updateUserDto = {
        name: 'Updated Name',
        phone: '11988888888',
      }

      const existingUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        phone: '11999999999',
      }

      const updatedUser = {
        ...existingUser,
        name: 'Updated Name',
        phone: '11988888888',
      }

      // Mock do método listById para retornar o usuário existente
      jest.spyOn(userRepository, 'listById').mockResolvedValue(existingUser as any)
      
      // Mock do método update para retornar o usuário atualizado
      jest.spyOn(userRepository, 'update').mockResolvedValue(updatedUser as any)

      // Act
      const result = await service.update(userId, updateUserDto)

      // Assert
      expect(result).toEqual(updatedUser)
      expect(userRepository.listById).toHaveBeenCalledWith(userId)
      expect(userRepository.update).toHaveBeenCalledWith(userId, updateUserDto)
    })

    it('should throw NotFoundError if user does not exist', async () => {
      // Arrange
      const userId = 'non-existent-user'
      const updateUserDto = {
        name: 'Updated Name',
      }

      // Mock do método listById para retornar null (usuário não existe)
      jest.spyOn(userRepository, 'listById').mockResolvedValue(null)

      // Act & Assert
      await expect(service.update(userId, updateUserDto)).rejects.toThrow(NotFoundError)
      expect(userRepository.listById).toHaveBeenCalledWith(userId)
      expect(userRepository.update).not.toHaveBeenCalled()
    })

    it('should update user password with hashed value', async () => {
      // Arrange
      const userId = 'user-123'
      const updateUserDto = {
        password: 'newpassword123',
      }

      const existingUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed_oldpassword',
      }

      const updatedUser = {
        ...existingUser,
        password: 'hashed_newpassword123',
      }

      // Mock do método listById para retornar o usuário existente
      jest.spyOn(userRepository, 'listById').mockResolvedValue(existingUser as any)
      
      // Mock do método update para retornar o usuário atualizado
      jest.spyOn(userRepository, 'update').mockResolvedValue(updatedUser as any)

      // Act
      const result = await service.update(userId, updateUserDto)

      // Assert
      expect(result).toEqual(updatedUser)
      expect(userRepository.listById).toHaveBeenCalledWith(userId)
      expect(userRepository.update).toHaveBeenCalledWith(userId, {
        password: 'hashed_newpassword123',
      })
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10)
    })

    it('should update user email with trimmed and lowercase value', async () => {
      // Arrange
      const userId = 'user-123'
      const updateUserDto = {
        email: '  UPDATED@Example.com  ',
      }

      const existingUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
      }

      const updatedUser = {
        ...existingUser,
        email: 'updated@example.com',
      }

      // Mock do método listById para retornar o usuário existente
      jest.spyOn(userRepository, 'listById').mockResolvedValue(existingUser as any)
      
      // Mock do método listByEmail para verificar se o novo email já existe
      jest.spyOn(userRepository, 'listByEmail').mockResolvedValue(null)
      
      // Mock do método update para retornar o usuário atualizado
      jest.spyOn(userRepository, 'update').mockResolvedValue(updatedUser as any)

      // Act
      const result = await service.update(userId, updateUserDto)

      // Assert
      expect(result).toEqual(updatedUser)
      expect(userRepository.listById).toHaveBeenCalledWith(userId)
      expect(userRepository.listByEmail).toHaveBeenCalledWith('updated@example.com')
      expect(userRepository.update).toHaveBeenCalledWith(userId, {
        email: 'updated@example.com',
      })
    })

    it('should throw ConflictError if new email already exists for another user', async () => {
      // Arrange
      const userId = 'user-123'
      const updateUserDto = {
        email: 'existing@example.com',
      }

      const existingUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
      }

      const existingEmailUser = {
        id: 'another-user',
        email: 'existing@example.com',
      }

      // Mock do método listById para retornar o usuário existente
      jest.spyOn(userRepository, 'listById').mockResolvedValue(existingUser as any)
      
      // Mock do método listByEmail para retornar outro usuário com o mesmo email
      jest.spyOn(userRepository, 'listByEmail').mockResolvedValue(existingEmailUser as any)

      // Act & Assert
      await expect(service.update(userId, updateUserDto)).rejects.toThrow(ConflictError)
      expect(userRepository.listById).toHaveBeenCalledWith(userId)
      expect(userRepository.listByEmail).toHaveBeenCalledWith('existing@example.com')
      expect(userRepository.update).not.toHaveBeenCalled()
    })
  })

  describe('verifyEmail', () => {
    it('should verify user email successfully', async () => {
      // Arrange
      const userId = 'user-123'
      const verifiedUser = {
        id: userId,
        email: 'test@example.com',
        emailVerifiedAt: new Date(),
      }

      // Mock do método verifyEmail
      jest.spyOn(userRepository, 'verifyEmail').mockResolvedValue(verifiedUser as any)

      // Act
      const result = await service.verifyEmail(userId)

      // Assert
      expect(result).toEqual({
        id: userId,
        email: 'test@example.com',
        emailVerifiedAt: expect.any(Date),
      })
      expect(userRepository.verifyEmail).toHaveBeenCalledWith(userId)
    })
  })

  describe('findAll', () => {
    it('should return all users', async () => {
      // Arrange
      const users = [
        { id: 'user-1', email: 'user1@example.com' },
        { id: 'user-2', email: 'user2@example.com' },
      ]

      // Mock do método listAll
      jest.spyOn(userRepository, 'listAll').mockResolvedValue(users as any)

      // Act
      const result = await service.findAll()

      // Assert
      expect(result).toEqual(users)
      expect(userRepository.listAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a user by id', async () => {
      // Arrange
      const userId = 'user-123'
      const user = { id: userId, email: 'test@example.com' }

      // Mock do método listById
      jest.spyOn(userRepository, 'listById').mockResolvedValue(user as any)

      // Act
      const result = await service.findOne(userId)

      // Assert
      expect(result).toEqual(user)
      expect(userRepository.listById).toHaveBeenCalledWith(userId)
    })
  })
})
