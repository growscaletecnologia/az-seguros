import { Injectable } from '@nestjs/common'

import { CreateSettingDto } from './dto/create-setting.dto'
import { UpdateSettingDto } from './dto/update-setting.dto'
import prisma from 'src/prisma/client'

@Injectable()
export class SettingsRepository {
  /**
   * Cria uma nova configuração
   * @param data Dados da configuração a ser criada
   * @returns A configuração criada
   */
  async create(data: CreateSettingDto) {
    return prisma.settings.create({
      data,
    })
  }

  /**
   * Busca todas as configurações
   * @returns Lista de configurações
   */
  async findAll() {
    return prisma.settings.findMany()
  }

  /**
   * Busca uma configuração pelo ID
   * @param id ID da configuração
   * @returns A configuração encontrada ou null
   */
  async findOne(id: string) {
    return prisma.settings.findUnique({
      where: { id },
    })
  }

  /**
   * Busca uma configuração pela chave
   * @param key Chave da configuração
   * @returns A configuração encontrada ou null
   */
  async findByKey(key: string) {
    return prisma.settings.findUnique({
      where: { key },
    })
  }

  /**
   * Atualiza uma configuração pelo ID
   * @param id ID da configuração
   * @param data Dados a serem atualizados
   * @returns A configuração atualizada
   */
  async update(id: string, data: UpdateSettingDto) {
    return prisma.settings.update({
      where: { id },
      data,
    })
  }

  /**
   * Remove uma configuração pelo ID
   * @param id ID da configuração
   * @returns A configuração removida
   */
  async remove(id: string) {
    return prisma.settings.delete({
      where: { id },
    })
  }

  /**
   * Busca ou cria configurações GTM
   * @returns Configurações GTM
   */
  async findOrCreateGtmSettings() {
    const gtmSettings = await prisma.settings.findFirst({
      where: {
        key: 'gtm_settings',
      },
    })

    if (gtmSettings) {
      return gtmSettings
    }

    return prisma.settings.create({
      data: {
        key: 'gtm_settings',
        value: 'GTM Settings',
        description: 'Configurações do Google Tag Manager',
        gtm_head_code: '',
        gtm_body_code: '',
      },
    })
  }

  /**
   * Atualiza as configurações GTM
   * @param gtmHeadCode Código GTM para o head
   * @param gtmBodyCode Código GTM para o body
   * @returns Configurações GTM atualizadas
   */
  async updateGtmSettings(gtmHeadCode: string, gtmBodyCode: string) {
    const gtmSettings = await this.findOrCreateGtmSettings()

    return prisma.settings.update({
      where: { id: gtmSettings.id },
      data: {
        gtm_head_code: gtmHeadCode,
        gtm_body_code: gtmBodyCode,
      },
    })
  }
}
