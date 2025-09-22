import { Injectable } from '@nestjs/common'
import { RedisService } from '../redis/redis.service'

// Tempo de vida da sessão em segundos (7 dias)
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

@Injectable()
export class SessionService {
  constructor(private readonly redisService: RedisService) {}

  /**
   * Cria uma nova sessão para o usuário
   * @param userId ID do usuário
   * @param userData Dados do usuário a serem armazenados na sessão
   * @returns ID da sessão criada
   */
  async createSession(userId: string, userData: any): Promise<string> {
    const sessionId = `session:${userId}:${Date.now()}`
    const client = this.redisService.getClient()
    
    // Armazena os dados da sessão no Redis
    await client.set(
      sessionId,
      JSON.stringify({
        userId,
        userData,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      }),
      'EX',
      SESSION_TTL_SECONDS
    )

    // Armazena referência da sessão ativa para o usuário
    await client.set(`user:${userId}:session`, sessionId, 'EX', SESSION_TTL_SECONDS)
    
    return sessionId
  }

  /**
   * Verifica se uma sessão está ativa
   * @param sessionId ID da sessão
   * @returns Dados da sessão se estiver ativa, null caso contrário
   */
  async validateSession(sessionId: string): Promise<any | null> {
    const client = this.redisService.getClient()
    const sessionData = await client.get(sessionId)
    
    if (!sessionData) {
      return null
    }
    
    const session = JSON.parse(sessionData)
    
    // Atualiza o timestamp de última atividade
    session.lastActivity = new Date().toISOString()
    await client.set(sessionId, JSON.stringify(session), 'EX', SESSION_TTL_SECONDS)
    
    return session
  }

  /**
   * Verifica se o usuário tem uma sessão ativa
   * @param userId ID do usuário
   * @returns Dados da sessão se estiver ativa, null caso contrário
   */
  async getUserActiveSession(userId: string): Promise<any | null> {
    const client = this.redisService.getClient()
    const sessionId = await client.get(`user:${userId}:session`)
    
    if (!sessionId) {
      return null
    }
    
    return this.validateSession(sessionId)
  }

  /**
   * Invalida uma sessão
   * @param sessionId ID da sessão
   */
  async invalidateSession(sessionId: string): Promise<void> {
    const client = this.redisService.getClient()
    const sessionData = await client.get(sessionId)
    
    if (sessionData) {
      const session = JSON.parse(sessionData)
      // Remove a referência da sessão ativa para o usuário
      await client.del(`user:${session.userId}:session`)
      // Remove a sessão
      await client.del(sessionId)
    }
  }

  /**
   * Invalida todas as sessões de um usuário
   * @param userId ID do usuário
   */
  async invalidateAllUserSessions(userId: string): Promise<void> {
    const client = this.redisService.getClient()
    const sessionId = await client.get(`user:${userId}:session`)
    
    if (sessionId) {
      // Remove a sessão
      await client.del(sessionId)
      // Remove a referência da sessão ativa para o usuário
      await client.del(`user:${userId}:session`)
    }
  }
}