import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateSettingDto } from './dto/create-setting.dto'
import { UpdateSettingDto } from './dto/update-setting.dto'
import { SettingsRepository } from './settings.repository'

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  /**
   * Cria uma nova configuração
   * @param createSettingDto Dados da configuração a ser criada
   * @returns A configuração criada
   */
  async create(createSettingDto: CreateSettingDto) {
    return this.settingsRepository.create(createSettingDto)
  }

  /**
   * Busca todas as configurações
   * @returns Lista de configurações
   */
  async findAll() {
    return this.settingsRepository.findAll()
  }

  /**
   * Busca uma configuração pelo ID
   * @param id ID da configuração
   * @returns A configuração encontrada
   * @throws NotFoundException se a configuração não for encontrada
   */
  async findOne(id: string) {
    const setting = await this.settingsRepository.findOne(id)
    if (!setting) {
      throw new NotFoundException(`Configuração com ID ${id} não encontrada`)
    }
    return setting
  }

  /**
   * Busca uma configuração pela chave
   * @param key Chave da configuração
   * @returns A configuração encontrada
   * @throws NotFoundException se a configuração não for encontrada
   */
  async findByKey(key: string) {
    const setting = await this.settingsRepository.findByKey(key)
    if (!setting) {
      throw new NotFoundException(`Configuração com chave ${key} não encontrada`)
    }
    return setting
  }

  /**
   * Atualiza uma configuração pelo ID
   * @param id ID da configuração
   * @param updateSettingDto Dados a serem atualizados
   * @returns A configuração atualizada
   * @throws NotFoundException se a configuração não for encontrada
   */
  async update(id: string, updateSettingDto: UpdateSettingDto) {
    await this.findOne(id)
    return this.settingsRepository.update(id, updateSettingDto)
  }

  /**
   * Remove uma configuração pelo ID
   * @param id ID da configuração
   * @returns A configuração removida
   * @throws NotFoundException se a configuração não for encontrada
   */
  async remove(id: string) {
    await this.findOne(id)
    return this.settingsRepository.remove(id)
  }

  /**
   * Busca ou cria configurações GTM
   * @returns Configurações GTM
   */
  async getGtmSettings() {
    return this.settingsRepository.findOrCreateGtmSettings()
  }

  /**
   * Atualiza as configurações GTM
   * @param gtmHeadCode Código GTM para o head
   * @param gtmBodyCode Código GTM para o body
   * @returns Configurações GTM atualizadas
   */
  async updateGtmSettings(gtmHeadCode: string, gtmBodyCode: string) {
    return this.settingsRepository.updateGtmSettings(gtmHeadCode, gtmBodyCode)
  }
}
