import { Test, TestingModule } from '@nestjs/testing'
import { SessionService } from './session.service'
import { RedisService } from '../redis/redis.service'
import Redis from 'ioredis'

// Mock do Redis
const mockRedisClient = {
  set: jest.fn().mockResolvedValue('OK'),
  get: jest.fn(),
  del: jest.fn().mockResolvedValue(1),
}

// Mock do RedisService
const mockRedisService = {
  getClient: jest.fn().mockReturnValue(mockRedisClient),
}

describe('SessionService', () => {
  let service: SessionService
  let redisService: RedisService

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile()

    service = module.get<SessionService>(SessionService)
    redisService = module.get<RedisService>(RedisService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('createSession', () => {
    it('should create a session and return sessionId', async () => {
      const userId = 'user-123'
      const userData = { name: 'Test User', email: 'test@example.com' }

      // Executar o método
      const result = await service.createSession(userId, userData)

      // Verificar se o ID da sessão começa com o prefixo correto
      expect(result).toContain(`session:${userId}:`)

      // Verificar se o Redis foi chamado corretamente
      expect(mockRedisClient.set).toHaveBeenCalledTimes(2)
      expect(mockRedisClient.set.mock.calls[0][0]).toBe(result)
      expect(mockRedisClient.set.mock.calls[1][0]).toBe(`user:${userId}:session`)
    })
  })

  describe('validateSession', () => {
    it('should return session data if session is valid', async () => {
      const sessionId = 'session:user-123:1234567890'
      const sessionData = JSON.stringify({
        userId: 'user-123',
        userData: { name: 'Test User' },
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      })

      // Configurar o mock para retornar dados da sessão
      mockRedisClient.get.mockResolvedValueOnce(sessionData)

      // Executar o método
      const result = await service.validateSession(sessionId)

      // Verificar se os dados da sessão foram retornados corretamente
      expect(result).toBeDefined()
      expect(result.userId).toBe('user-123')
      expect(result.userData.name).toBe('Test User')

      // Verificar se o Redis foi chamado corretamente
      expect(mockRedisClient.get).toHaveBeenCalledWith(sessionId)
      expect(mockRedisClient.set).toHaveBeenCalledTimes(1) // Para atualizar lastActivity
    })

    it('should return null if session does not exist', async () => {
      const sessionId = 'session:user-123:1234567890'

      // Configurar o mock para retornar null (sessão não existe)
      mockRedisClient.get.mockResolvedValueOnce(null)

      // Executar o método
      const result = await service.validateSession(sessionId)

      // Verificar se retornou null
      expect(result).toBeNull()

      // Verificar se o Redis foi chamado corretamente
      expect(mockRedisClient.get).toHaveBeenCalledWith(sessionId)
      expect(mockRedisClient.set).not.toHaveBeenCalled() // Não deve atualizar lastActivity
    })
  })

  describe('getUserActiveSession', () => {
    it('should return session data if user has active session', async () => {
      const userId = 'user-123'
      const sessionId = 'session:user-123:1234567890'
      const sessionData = JSON.stringify({
        userId: 'user-123',
        userData: { name: 'Test User' },
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      })

      // Configurar os mocks
      mockRedisClient.get
        .mockResolvedValueOnce(sessionId) // Para a primeira chamada (obter sessionId)
        .mockResolvedValueOnce(sessionData) // Para a segunda chamada (obter dados da sessão)

      // Executar o método
      const result = await service.getUserActiveSession(userId)

      // Verificar se os dados da sessão foram retornados corretamente
      expect(result).toBeDefined()
      expect(result.userId).toBe('user-123')

      // Verificar se o Redis foi chamado corretamente
      expect(mockRedisClient.get).toHaveBeenCalledWith(`user:${userId}:session`)
    })

    it('should return null if user has no active session', async () => {
      const userId = 'user-123'

      // Configurar o mock para retornar null (usuário sem sessão)
      mockRedisClient.get.mockResolvedValueOnce(null)

      // Executar o método
      const result = await service.getUserActiveSession(userId)

      // Verificar se retornou null
      expect(result).toBeNull()

      // Verificar se o Redis foi chamado corretamente
      expect(mockRedisClient.get).toHaveBeenCalledWith(`user:${userId}:session`)
    })
  })

  describe('invalidateSession', () => {
    it('should invalidate session if it exists', async () => {
      const sessionId = 'session:user-123:1234567890'
      const sessionData = JSON.stringify({
        userId: 'user-123',
        userData: { name: 'Test User' },
      })

      // Configurar o mock para retornar dados da sessão
      mockRedisClient.get.mockResolvedValueOnce(sessionData)

      // Executar o método
      await service.invalidateSession(sessionId)

      // Verificar se o Redis foi chamado corretamente
      expect(mockRedisClient.get).toHaveBeenCalledWith(sessionId)
      expect(mockRedisClient.del).toHaveBeenCalledWith(`user:user-123:session`)
      expect(mockRedisClient.del).toHaveBeenCalledWith(sessionId)
    })

    it('should do nothing if session does not exist', async () => {
      const sessionId = 'session:user-123:1234567890'

      // Configurar o mock para retornar null (sessão não existe)
      mockRedisClient.get.mockResolvedValueOnce(null)

      // Executar o método
      await service.invalidateSession(sessionId)

      // Verificar se o Redis foi chamado corretamente
      expect(mockRedisClient.get).toHaveBeenCalledWith(sessionId)
      expect(mockRedisClient.del).not.toHaveBeenCalled() // Não deve excluir nada
    })
  })
})
