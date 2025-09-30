import { Injectable } from '@nestjs/common'
import prisma from 'src/prisma/client'
import { CreateSettingDto } from './dto/create-setting.dto'
import { UpdateSettingDto } from './dto/update-setting.dto'

export interface GtmSettings {
  gtm_head_code: string
  gtm_body_code: string
}

@Injectable()
export class SettingsService {
  /**
   * Busca as configurações do Google Tag Manager
   * @returns Configurações do GTM ou valores padrão
   */
  async getGtmSettings(): Promise<GtmSettings> {
    try {
      const settings = await prisma.settings.findFirst({
        where: { key: 'gtm_settings' },
      })

      if (!settings) {
        return {
          gtm_head_code: '',
          gtm_body_code: '',
        }
      }

      return {
        gtm_head_code: settings.gtm_head_code || '',
        gtm_body_code: settings.gtm_body_code || '',
      }
    } catch (error) {
      console.error('Erro ao buscar configurações GTM:', error)
      return {
        gtm_head_code: '',
        gtm_body_code: '',
      }
    }
  }

  /**
   * Atualiza as configurações do Google Tag Manager
   * @param gtmSettings Configurações do GTM
   * @returns Configurações atualizadas
   */
  async updateGtmSettings(gtmSettings: GtmSettings): Promise<GtmSettings> {
    try {
      // Sanitiza os códigos GTM removendo scripts maliciosos
      const sanitizedHeadCode = this.sanitizeGtmCode(gtmSettings.gtm_head_code)
      const sanitizedBodyCode = this.sanitizeGtmCode(gtmSettings.gtm_body_code)

      const updatedSettings = await prisma.settings.upsert({
        where: { key: 'gtm_settings' },
        update: {
          gtm_head_code: sanitizedHeadCode,
          gtm_body_code: sanitizedBodyCode,
          updatedAt: new Date(),
        },
        create: {
          key: 'gtm_settings',
          value: 'Google Tag Manager Settings',
          description: 'Configurações do Google Tag Manager',
          gtm_head_code: sanitizedHeadCode,
          gtm_body_code: sanitizedBodyCode,
        },
      })

      return {
        gtm_head_code: updatedSettings.gtm_head_code || '',
        gtm_body_code: updatedSettings.gtm_body_code || '',
      }
    } catch (error) {
      console.error('Erro ao atualizar configurações GTM:', error)
      throw error
    }
  }

  /**
   * Sanitiza códigos GTM para prevenir XSS
   * @param code Código GTM a ser sanitizado
   * @returns Código sanitizado
   */
  private sanitizeGtmCode(code: string): string {
    if (!code) return ''

    // Remove scripts maliciosos mantendo apenas GTM válido
    const gtmPattern = /<!-- Google Tag Manager.*?-->[\s\S]*?<!-- End Google Tag Manager.*?-->/gi
    const noscriptPattern =
      /<!-- Google Tag Manager \(noscript\).*?-->[\s\S]*?<!-- End Google Tag Manager \(noscript\).*?-->/gi

    // Verifica se é um código GTM válido
    if (gtmPattern.test(code) || noscriptPattern.test(code)) {
      return code.trim()
    }

    // Se não for GTM válido, retorna vazio por segurança
    return ''
  }

  /**
   * Cria uma nova configuração no sistema
   * @param createSettingDto Dados para criar a configuração
   * @returns Configuração criada
   */
  async create(createSettingDto: CreateSettingDto) {
    try {
      const setting = await prisma.settings.create({
        data: {
          key: createSettingDto.key || `setting_${Date.now()}`,
          value: createSettingDto.value || '',
          description: createSettingDto.description || null,
          gtm_head_code: createSettingDto.gtm_head_code || null,
          gtm_body_code: createSettingDto.gtm_body_code || null,
        },
      })
      return setting
    } catch (error) {
      console.error('Erro ao criar configuração:', error)
      throw error
    }
  }

  /**
   * Lista todas as configurações do sistema
   * @returns Lista de configurações
   */
  async findAll() {
    try {
      const settings = await prisma.settings.findMany({
        orderBy: { createdAt: 'desc' },
      })
      return settings
    } catch (error) {
      console.error('Erro ao buscar configurações:', error)
      throw error
    }
  }

  /**
   * Busca uma configuração específica por ID
   * @param id ID da configuração
   * @returns Configuração encontrada
   */
  async findOne(id: string) {
    try {
      const setting = await prisma.settings.findUnique({
        where: { id },
      })
      return setting
    } catch (error) {
      console.error('Erro ao buscar configuração:', error)
      throw error
    }
  }

  /**
   * Atualiza uma configuração existente
   * @param id ID da configuração
   * @param updateSettingDto Dados para atualizar
   * @returns Configuração atualizada
   */
  async update(id: string, updateSettingDto: UpdateSettingDto) {
    try {
      const setting = await prisma.settings.update({
        where: { id },
        data: {
          key: updateSettingDto.key,
          value: updateSettingDto.value,
          description: updateSettingDto.description,
          gtm_head_code: updateSettingDto.gtm_head_code,
          gtm_body_code: updateSettingDto.gtm_body_code,
          updatedAt: new Date(),
        },
      })
      return setting
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error)
      throw error
    }
  }

  /**
   * Remove uma configuração do sistema
   * @param id ID da configuração
   * @returns Configuração removida
   */
  async remove(id: string) {
    try {
      const setting = await prisma.settings.delete({
        where: { id },
      })
      return setting
    } catch (error) {
      console.error('Erro ao remover configuração:', error)
      throw error
    }
  }
}
