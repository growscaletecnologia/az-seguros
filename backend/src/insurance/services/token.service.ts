import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'
import { ConfigService } from '@nestjs/config'
import prisma from 'src/prisma/client'
import { CryptoUtil } from '../utils/crypto.util'
import axios from 'axios'

@Injectable()
export class TokenService implements OnModuleInit {
  private readonly logger = new Logger(TokenService.name)
  private readonly algorithm = 'aes-256-gcm'
  private readonly key: Buffer
  private readonly renewalThreshold = 5 * 60 * 1000 // 5 minutes in ms
  private readonly tokenRefreshInterval = 60 * 1000 // Check every minute

  constructor(private readonly configService: ConfigService) {
    const encryptionKey = this.configService.get<string>('ENCRYPTION_KEY')
    if (!encryptionKey) {
      throw new Error('ENCRYPTION_KEY environment variable is not set')
    }
    this.key = Buffer.from(encryptionKey, 'hex')
  }

  async onModuleInit() {
    // Start token renewal monitoring
    this.startTokenRenewalMonitoring()
  }

  private async encryptToken(token: string): Promise<string> {
    return CryptoUtil.encrypt(token, this.key)
  }

  private async decryptToken(encryptedToken: string): Promise<string> {
    return CryptoUtil.decrypt(encryptedToken, this.key)
  }

  private startTokenRenewalMonitoring() {
    setInterval(async () => {
      try {
        await this.checkAndRenewTokens()
      } catch (error) {
        this.logger.error('Error in token renewal monitoring:', error)
      }
    }, this.tokenRefreshInterval)
  }

  private async checkAndRenewTokens() {
    const integrations = await prisma.securityIntegration.findMany({
      where: {
        ativa: true,
        NOT: { tokenExpiresAt: null },
      },
    })

    for (const integration of integrations) {
      try {
        await this.checkAndRenewToken(integration)
      } catch (error) {
        this.logger.error(`Error renewing token for ${integration.insurerName}:`, error)
      }
    }
  }

  private async checkAndRenewToken(integration: any) {
    if (!integration.tokenExpiresAt) return

    const now = Date.now()
    const expiresAt = new Date(integration.tokenExpiresAt).getTime()

    if (expiresAt - now <= this.renewalThreshold) {
      await this.renewToken(integration)
    }
  }

  private async renewToken(integration: any) {
    try {
      // Skip if no refresh token
      if (!integration.refreshToken) {
        this.logger.warn(`No refresh token available for ${integration.insurerName}`)
        return
      }

      const refreshToken = await this.decryptToken(integration.refreshToken)
      const tokenEndpoint = integration.authUrl || `${integration.baseUrl}/oauth/token`

      const response = await axios.post(tokenEndpoint, {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: integration.clientId,
        client_secret: integration.clientSecret,
      })

      await this.updateTokens(
        integration.id,
        response.data.access_token,
        response.data.refresh_token,
        response.data.expires_in,
      )

      this.logger.log(`Successfully renewed token for ${integration.insurerName}`)
    } catch (error) {
      this.logger.error(`Failed to renew token for ${integration.insurerName}:`, error)
      throw error
    }
  }

  async updateTokens(
    insurerId: string,
    accessToken: string,
    refreshToken?: string,
    expiresIn?: number,
  ): Promise<void> {
    console.log('chamou aqui')
    console.log(
      'fileds to update',
      {
        accessToken,
        refreshToken,
        expiresIn,
      },
      'id',
      insurerId,
    )
    try {
      await prisma.securityIntegration.update({
        where: { id: insurerId },
        data: {
          accessToken: accessToken,
          refreshToken: refreshToken,
          expiresIn,
          updatedAt: new Date(),
        },
      })
    } catch (error) {
      this.logger.error('Error updating tokens:', error)
      throw new Error('Failed to update tokens')
    }
  }

  async getTokens(
    insurerId: string,
    autoRenew = true,
  ): Promise<{
    accessToken: string
    refreshToken?: string
    tokenExpiresAt?: Date
  }> {
    const integration = await prisma.securityIntegration.findUnique({
      where: { id: insurerId },
    })

    if (!integration?.accessToken) {
      throw new Error('No token found for this insurer')
    }

    // Check if token needs renewal
    if (
      autoRenew &&
      integration.tokenExpiresAt &&
      new Date(integration.tokenExpiresAt).getTime() - Date.now() <= this.renewalThreshold
    ) {
      await this.checkAndRenewToken(integration)
      return this.getTokens(insurerId, false) // Prevent infinite recursion
    }

    const accessToken = await this.decryptToken(integration.accessToken)
    const refreshToken = integration.refreshToken
      ? await this.decryptToken(integration.refreshToken)
      : undefined

    return {
      accessToken,
      refreshToken,
      tokenExpiresAt: integration.tokenExpiresAt || undefined,
    }
  }

  async removeTokens(insurerId: string): Promise<void> {
    try {
      await prisma.securityIntegration.update({
        where: { id: insurerId },
        data: {
          accessToken: null,
          refreshToken: null,
          expiresIn: null,
          tokenExpiresAt: null,
        },
      })
    } catch (error) {
      this.logger.error('Error removing tokens:', error)
      throw new Error('Failed to remove tokens')
    }
  }
}
