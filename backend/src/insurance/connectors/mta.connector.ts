import { Injectable, Logger } from '@nestjs/common'
import { InsuranceConnectorBase } from './insurance.connector.base'
import { QuoteRequestDto } from '../dto/quote-request.dto'
import { NormalizedPlan } from '../dto/normalized-plan.dto'
import prisma from 'src/prisma/client'
import { TokenService } from '../services/token.service'
import { BadRequestError } from 'src/common/errors/http-errors'
import { InsurerAgeGroup, InsurerDestiny, InsurerPlan } from 'src/types/types'
import { InsurerCodeEnum } from '@prisma/client'

@Injectable()
export class MTAConnector extends InsuranceConnectorBase {
  baseUrl = ''

  private readonly logger = new Logger(MTAConnector.name)
  constructor(tokenService: TokenService) {
    super(tokenService) // Passa o tokenService para o construtor da classe base
  }

  async authenticate(id?: string): Promise<string> {
    console.log('[MTAConnector] authenticate() called')
    return this.withErrorHandling(async () => {
      const credentials = await prisma.securityIntegration.findFirst({
        where: { id: id },
      })
      console.log('[MTAConnector] Credentials:', credentials)
      if (!credentials) {
        console.log('[MTAConnector] Hero credentials not found')
        throw new Error('Hero credentials not found')
      }

      // Usa a authUrl completa diretamente
      const fullAuthUrl = credentials.authUrl
      if (!fullAuthUrl) {
        throw new Error('authUrl is not defined in credentials')
      }

      this.initializeAxios()
      this.logger.debug('Authenticating with Hero API...')
      console.log('[MTAConnector] Authenticating with Hero API...')
      console.log('[MTAConnector] fullAuthUrl:', fullAuthUrl)

      try {
        const { data } = await this.axiosInstance.post(
          fullAuthUrl,
          {
            username: credentials.username,
            grant_type: credentials.grantType,
            client_id: credentials.clientId,
            client_secret: credentials.clientSecret,
            password: credentials.password,
            scope: credentials.scope,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        )
        console.log('[MTAConnector] Auth response:', data)

        await this.tokenService.updateTokens(
          credentials.id,
          data.access_token,
          data.refresh_token,
          data.expires_in,
        )

        this.logger.debug('Successfully authenticated with Hero API')
        console.log('[MTAConnector] Successfully authenticated with Hero API')
        return data.access_token
      } catch (err) {
        console.log('[MTAConnector] Error during authentication:', err)
        throw err
      }
    })
  }

  async getPlans(id?: string): Promise<NormalizedPlan[]> {
    return this.withErrorHandling(async () => {
      const credentials = await prisma.securityIntegration.findFirst({ where: { id } })
      if (!credentials) throw new Error('Hero credentials not found')

      const fullBaseUrl = credentials.baseUrl
      if (!fullBaseUrl) throw new Error('baseUrl is not defined in credentials')

      this.initializeAxios()

      if (!credentials.accessToken) {
        console.log('[MTAConnector] No accessToken, authenticating...')
        credentials.accessToken = await this.authenticate(id)
      }

      const fullPlansUrl = `${fullBaseUrl}getPlans`
      console.log('[MTAConnector] fullPlansUrl:', fullPlansUrl)

      try {
        if (!credentials.accessToken) throw new BadRequestError('No accessToken found')

        const { data } = await this.axiosInstance.get(fullPlansUrl, {
          headers: {
            Authorization: `Bearer ${credentials.accessToken}`,
            'Content-Type': 'application/json',
          },
        })

        const plansArray = Object.values(data.data).filter((item) => typeof item === 'object')

        // 🔹 Sincronização com o banco de dados

        // for (const plan of plansArray as InsurerPlan[]) {
        //   const existingPlan = await prisma.insurerPlan.findFirst({
        //     where: { externalId: plan.id, securityIntegrationId: credentials.id },
        //     include: { destinies: { include: { ageGroups: true } } },
        //   })

        //   if (!existingPlan) {
        //     await prisma.insurerPlan.create({
        //       data: {
        //         externalId: plan.id,
        //         additionalId: plan.additional_id,
        //         ref: plan.ref,
        //         slug: plan.slug,
        //         is: plan.is,
        //         isShow: plan.is_show,
        //         name: plan.name,
        //         multitrip: Boolean(plan.multitrip),
        //         securityIntegrationId: credentials.id,
        //         destinies: {
        //           create: plan.destinies.map((dest: HeroDestiny) => ({
        //             name: dest.destiny.name,
        //             slug: dest.destiny.slug,
        //             displayOrder: dest.destiny.display_order,
        //             destinyCode: dest.destiny.destiny_code,
        //             crmBonusValue: dest.destiny.crm_bonus_value,
        //             ageGroups: {
        //               create: dest.age.map((a: HeroAgeGroup) => ({
        //                 start: a.start,
        //                 end: a.end,
        //                 price: parseFloat(a.price.replace(',', '.')),
        //                 priceIof: parseFloat(a.price_iof),
        //               })),
        //             },
        //           })),
        //         },
        //       },
        //     })
        //     console.log(`[DB] Plano ${plan.name} criado.`)
        //   } else {
        //     // 👉 Plano já existe — vamos comparar as faixas etárias
        //     let needsUpdate = false

        //     for (const dest of plan.destinies) {
        //       const existingDest = existingPlan.destinies.find((d) => d.slug === dest.destiny.slug)
        //       if (!existingDest) {
        //         needsUpdate = true
        //         break
        //       }

        //       const newAges = dest.age.map((a: any) => ({
        //         start: a.start,
        //         end: a.end,
        //         price: parseFloat(a.price.replace(',', '.')),
        //         priceIof: parseFloat(a.price_iof),
        //       }))

        //       const oldAges = existingDest.ageGroups.map((ag) => ({
        //         start: ag.start,
        //         end: ag.end,
        //         price: parseFloat(ag.price.toString()),
        //         priceIof: parseFloat(ag.priceIof?.toString() || '0'),
        //       }))

        //       const diff = JSON.stringify(newAges) !== JSON.stringify(oldAges)
        //       if (diff) {
        //         needsUpdate = true
        //         // atualiza os valores dessa faixa
        //         await prisma.insurerPlanAgeGroup.deleteMany({
        //           where: { insurerPlanDestinyId: existingDest.id },
        //         })
        //         await prisma.insurerPlanAgeGroup.createMany({
        //           data: newAges.map((a) => ({
        //             insurerPlanDestinyId: existingDest.id,
        //             start: a.start,
        //             end: a.end,
        //             price: a.price,
        //             priceIof: a.priceIof,
        //           })),
        //         })
        //         console.log(`[DB] Atualizado valores de idade para destino ${existingDest.slug}`)
        //       }
        //     }

        //     if (!needsUpdate) {
        //       console.log(`[DB] Plano ${plan.name} sem alterações, ignorado.`)
        //     }
        //   }
        // }
  for (const plan of plansArray as InsurerPlan[]) {
    const existingPlan = await prisma.insurerPlan.findFirst({
      where: { externalId: plan.id, securityIntegrationId: credentials.id },
      include: {
        destinies: { include: { ageGroups: true } },
        coverages: { include: { coverage: true } },
      },
    })

    if (!existingPlan) {
      // 🔹 Cria o plano novo
      const createdPlan = await prisma.insurerPlan.create({
        data: {
          externalId: plan.id,
          additionalId: plan.additional_id,
          ref: plan.ref,
          slug: plan.slug,
          is: plan.is,
          isShow: plan.is_show,
          name: plan.name,
          multitrip: Boolean(plan.multitrip),
          securityIntegrationId: credentials.id,
          destinies: {
            create: plan.destinies.map((dest: InsurerDestiny) => ({
              name: dest.destiny.name,
              slug: dest.destiny.slug,
              displayOrder: dest.destiny.display_order,
              destinyCode: dest.destiny.destiny_code,
              crmBonusValue: dest.destiny.crm_bonus_value,
              ageGroups: {
                create: dest.age.map((a: InsurerAgeGroup) => ({
                  start: a.start,
                  end: a.end,
                  price: parseFloat(a.price.replace(',', '.')),
                  priceIof: parseFloat(a.price_iof),
                })),
              },
            })),
          },
        },
      })
      console.log(`[DB] Plano ${plan.name} criado.`)

      // 🔹 Cria as coberturas (se existirem)
      if (plan.coverages && plan.coverages.length > 0) {
        for (const c of plan.coverages) {
          const cov = c.coverage
          if (!cov?.slug) continue

          // verifica se a cobertura já existe
          let coverage = await prisma.coverage.findUnique({ where: { slug: cov.slug } })
          if (!coverage) {
            coverage = await prisma.coverage.create({
              data: {
                title: cov.title || cov.name,
                name: cov.name,
                slug: cov.slug,
                highlight: cov.highlight,
                content: cov.content,
                displayOrder: cov.display_order,
              },
            })
            console.log(`[DB] Coverage ${cov.name} criada.`)
          }

          // cria o vínculo com o plano
          await prisma.planCoverage.create({
            data: {
              insurerPlanId: createdPlan.id,
              coverageId: coverage.id,
              value: c.is,
              coverageType: c.coverage_type,
            },
          })
        }
      }
    } else {
      // 🔹 Plano já existe — atualiza se necessário
      let needsUpdate = false

      // verifica atualizações nas faixas etárias
      for (const dest of plan.destinies) {
        const existingDest = existingPlan.destinies.find((d) => d.slug === dest.destiny.slug)
        if (!existingDest) {
          needsUpdate = true
          break
        }

        const newAges = dest.age.map((a: any) => ({
          start: a.start,
          end: a.end,
          price: parseFloat(a.price.replace(',', '.')),
          priceIof: parseFloat(a.price_iof),
        }))

        const oldAges = existingDest.ageGroups.map((ag) => ({
          start: ag.start,
          end: ag.end,
          price: parseFloat(ag.price.toString()),
          priceIof: parseFloat(ag.priceIof?.toString() || '0'),
        }))

        const diff = JSON.stringify(newAges) !== JSON.stringify(oldAges)
        if (diff) {
          needsUpdate = true
          await prisma.insurerPlanAgeGroup.deleteMany({
            where: { insurerPlanDestinyId: existingDest.id },
          })
          await prisma.insurerPlanAgeGroup.createMany({
            data: newAges.map((a) => ({
              insurerPlanDestinyId: existingDest.id,
              start: a.start,
              end: a.end,
              price: a.price,
              priceIof: a.priceIof,
            })),
          })
          console.log(`[DB] Atualizado valores de idade para destino ${existingDest.slug}`)
        }
      }

      // 🔹 Atualiza ou insere coberturas (se vierem)
      if (plan.coverages && plan.coverages.length > 0) {
        for (const c of plan.coverages) {
          const cov = c.coverage
          if (!cov?.slug) continue

          // procura cobertura no catálogo
          let coverage = await prisma.coverage.findUnique({ where: { slug: cov.slug } })
          if (!coverage) {
            coverage = await prisma.coverage.create({
              data: {
                title: cov.title || cov.name,
                name: cov.name,
                slug: cov.slug,
                highlight: cov.highlight,
                content: cov.content,
                displayOrder: cov.display_order,
              },
            })
            console.log(`[DB] Coverage ${cov.name} criada.`)
          }

          // verifica se o plano já possui essa cobertura
          const existingCoverage = existingPlan.coverages.find((pc) => pc.coverage.slug === cov.slug)

          if (!existingCoverage) {
            await prisma.planCoverage.create({
              data: {
                insurerPlanId: existingPlan.id,
                coverageId: coverage.id,
                value: c.is,
                coverageType: c.coverage_type,
              },
            })
            console.log(`[DB] Coverage ${cov.name} vinculada ao plano ${existingPlan.name}`)
          } else if (
            existingCoverage.value !== c.is ||
            existingCoverage.coverageType !== c.coverage_type
          ) {
            await prisma.planCoverage.update({
              where: { id: existingCoverage.id },
              data: {
                value: c.is,
                coverageType: c.coverage_type,
              },
            })
            console.log(`[DB] Coverage ${cov.name} atualizada para plano ${existingPlan.name}`)
          }
        }
      }

    if (!needsUpdate) {
      console.log(`[DB] Plano ${plan.name} sem alterações relevantes.`)
    }
  }
}


        // Normalização continua igual
        const processedData = { plans: plansArray, metadata: data.metadata || {} }
        const normalizedPlans = this.normalizePlans(processedData, credentials.id)

        await this.getTodayCotation()

        return normalizedPlans
      } catch (err) {
        console.error('[MTAConnector] Error during getPlans:', err)
        throw err
      }
    })
  }

  async getTodayCotation() {
    console.log('[CURRENCYCONECTOR] - querying data...')
    return this.withErrorHandling(async () => {
         const credentials = await prisma.securityIntegration.findFirst({where: {insurerCode: InsurerCodeEnum.mta}})
      if (!credentials) throw new Error('mta credentials not found')

      const fullBaseUrl = credentials.baseUrl
      if (!fullBaseUrl) throw new Error('baseUrl is not defined in credentials')

      this.initializeAxios()

      if (!credentials.accessToken) {
        console.log('[MTAConnector] No accessToken, authenticating...')
        credentials.accessToken = await this.authenticate(credentials.id)
      }

      const fullPlansUrl = `${fullBaseUrl}getCotationUsd`
      console.log('[MTAConnector] fullPlansUrl:', fullPlansUrl)

      try {
        if (!credentials.accessToken) throw new BadRequestError('No accessToken found')

        const { data } = await this.axiosInstance.get(fullPlansUrl, {
          headers: {
            Authorization: `Bearer ${credentials.accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        console.log(data)
        console.log('[CURRENCYCONECTOR] - upsertting data')
        await prisma.dollarCotation.upsert({
          where: {
            id: 1, // Supondo que o registro tenha um ID fixo (por exemplo, 1)
          },
          update: {
            price: data.data?.price || '0.00',
            priceRaw: data.data?.price_raw || '0',
            updatedAt: new Date(),
          },
          create: {
            id: 1, // Certifique-se de que o ID seja único
            price: data.data?.price || '0.00',
            priceRaw: data.data?.price_raw || '0',
            updatedAt: new Date(),
          },
        })

         const EuroUrl = `${fullBaseUrl}getCotationEur`
         const { data:euroData } = await this.axiosInstance.get(EuroUrl, {
          headers: {
            Authorization: `Bearer ${credentials.accessToken}`,
            'Content-Type': 'application/json',
          },
        })

        await prisma.euroCotation.upsert({
          where: {
            id: 1, // Supondo que o registro tenha um ID fixo (por exemplo, 1)
          },
          update: {
            price: euroData?.data?.price || '0.00',
            priceRaw: euroData?.data?.price_raw || '0',
            updatedAt: new Date(),
          },
          create: {
            id: 1, // Certifique-se de que o ID seja único
            price: euroData?.data?.price || '0.00',
            priceRaw: euroData?.data?.price_raw || '0',
            updatedAt: new Date(),
          },
        })
      } catch (err) {
        console.error('[MTAConnector] Error during getPlans:', err)
        throw err
      }

      
    })
  }
  protected async normalizePlans(
    rawData: { plans: any[]; metadata: any },
    insurerId: string,
  ): Promise<NormalizedPlan[]> {
    const appliedMarkUp = await this.applyMarkup(rawData.plans, insurerId)

    return appliedMarkUp.map((plan) => {
      console.log('[MTAConnector] Normalizing plan:', plan)

      return {
        name: plan.name,
        slug: plan.slug || plan.name.toLowerCase().replace(/\s+/g, '-'),
        group: plan.group || plan.name,
        currency: plan.currency || 'USD',
        is: plan.is || '',
        is_receptive: plan.is_receptive || 0,
        is_travel_extension: plan.is_travel_extension || 0,
        is_default: plan.is_default || 0,
        min_days_qtd: plan.min_days_qtd || 0,
        min_passengers_qtd: plan.min_passengers_qtd || 0,
        categories: plan.categories || [],
        can_show_local_currency: plan.can_show_local_currency || 0,
        locate_currency: plan.locate_currency || 'USD',
        plan_id: plan.plan_id,
        price: plan.price || '0.00',
        price_raw: plan.price_raw || '0',
        price_to_calc: plan.price_to_calc || '0.00',
        price_to_calc_raw: plan.price_to_calc_raw || '0',
        price_to_calc_currency_bill: plan.price_to_calc_currency_bill || 'USD',
        cocation_usd: plan.cocation_usd || '0.00',
        cocation_usd_raw: plan.cocation_usd_raw || '0',
        cocation_eur: plan.cocation_eur || '0.00',
        cocation_eur_raw: plan.cocation_eur_raw || '0',
        days: plan.days || 0,
        additional_id: plan.additional_id || 0,
        currency_bill: plan.currency_bill || 'USD',
        coverages: (plan.coverages || []).map((coverage: any) => ({
          is: coverage.is || '',
          coverage_type: coverage.coverage_type || '',
          coverage: {
            id: coverage.coverage?.id || 0,
            title: coverage.coverage?.title || '',
            name: coverage.coverage?.name || '',
            slug: coverage.coverage?.slug || '',
            highlight: coverage.coverage?.highlight || '',
            content: coverage.coverage?.content || '',
            display_order: coverage.coverage?.display_order || 0,
          },
        })),
      }
    })
  }

  async getCotation(params?: QuoteRequestDto, id?: string) {
    console.log('[MTAConnector] getCotation() called with params:', params)
    return this.withErrorHandling(async () => {
      const credentials = await prisma.securityIntegration.findFirst({
        where: { id: id },
      })
      //console.log('[MTAConnector] getCotation credentials:', credentials);
      if (!credentials) {
        console.log('[MTAConnector] MTA credentials not found')
        throw new Error('MTA credentials not found')
      }

      // Usa a baseUrl completa diretamente
      const fullBaseUrl = credentials.baseUrl
      if (!fullBaseUrl) {
        throw new Error('baseUrl is not defined in credentials')
      }

      this.initializeAxios()

      // Verifica se existe accessToken válido, senão autentica
      if (!credentials.accessToken) {
        console.log('[MTAConnector] No accessToken, authenticating...')
        credentials.accessToken = await this.authenticate(id)
      }

      this.logger.debug('Requesting quotes from MTA API...')
      const fullPlansUrl = `${fullBaseUrl}cotation`
      //console.log('[MTAConnector] fullPlansUrl:', fullPlansUrl);

      try {
        if (credentials.accessToken) {
          const { data } = await this.axiosInstance.post(fullPlansUrl, params, {
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
          })
          //console.log('[MTAConnector] API response:', data);

          // Transform the indexed object into an array
          const plansArray = Object.values(data.data).filter((item) => typeof item === 'object')
          console.log('[MTAConnector] Transformed plans array:', plansArray)

          // Process data directly without Zod validation
          const processedData = { plans: plansArray, metadata: data.metadata || {} }
          console.log('[MTAConnector] Processed data (without validation):', processedData)

          // Normalize and apply markup
          const normalizedPlans = this.normalizePlans(processedData, id || '')
          console.log('[MTAConnector] Normalized plans:', normalizedPlans)

          return normalizedPlans
        } else {
          throw new BadRequestError('No accessToken found')
        }
      } catch (err) {
        console.error('[MTAConnector] Error during getPlans:', err)
        throw err
      }
    })
  }

  private determineCoverageType(age: number): string {
    console.log('[MTAConnector] determineCoverageType called with age:', age)
    if (age < 18) return 'CHILD'
    if (age >= 65) return 'SENIOR'
    return 'ADULT'
  }
}