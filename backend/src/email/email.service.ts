import { Injectable, Logger } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import * as fs from 'fs'
import * as path from 'path'
import * as handlebars from 'handlebars'

/**
 * Interface para anexos de email
 */
export interface EmailAttachment {
  filename: string
  content?: Buffer | string
  path?: string
  contentType?: string
}

/**
 * Interface para opções de email
 */
export interface EmailOptions {
  to: string | string[]
  cc?: string | string[]
  bcc?: string | string[]
  subject: string
  text?: string
  html?: string
  template?: string
  context?: Record<string, any>
  attachments?: EmailAttachment[]
  priority?: 'high' | 'normal' | 'low'
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter
  private readonly logger = new Logger(EmailService.name)
  private readonly isDev = process.env.NODE_ENV !== 'production'
  private readonly templatesDir = path.join(process.cwd(), 'src/email/templates')

  constructor() {
    this.initializeTransporter()
  }

  /**
   * Inicializa o transporter do nodemailer
   * Em ambiente de desenvolvimento, usa o Ethereal para capturar emails
   * Em produção, usa as configurações do .env
   */
  private async initializeTransporter() {
    try {
      // Em ambiente de desenvolvimento, usar Ethereal para testes
      if (!this.isDev) {
        // Criar uma conta de teste no Ethereal
        const testAccount = await nodemailer.createTestAccount()
        this.logger.log('Conta de teste Ethereal criada para capturar emails em desenvolvimento')

        // Configurar o transporter com a conta de teste
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        })
      } else {
        // Em produção, usar as configurações do .env
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT ?? 587),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })
      }
    } catch (error) {
      this.logger.error(`Erro ao inicializar o transporter de email: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Envia um email com conteúdo HTML
   * @param to Destinatário do email
   * @param subject Assunto do email
   * @param html Conteúdo HTML do email
   * @returns Informações do email enviado
   */
  async sendHtml(to: string, subject: string, html: string) {
    return this.sendEmail({
      to,
      subject,
      html,
    })
  }

  /**
   * Envia um email usando um template
   * @param templateName Nome do arquivo de template (sem extensão)
   * @param options Opções do email
   * @returns Informações do email enviado
   */
  async sendTemplate(templateName: string, options: Omit<EmailOptions, 'html' | 'template'>) {
    const templatePath = path.join(this.templatesDir, `${templateName}.hbs`)

    try {
      // Verificar se o template existe
      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template ${templateName} não encontrado em ${templatePath}`)
      }

      // Ler o template
      const template = fs.readFileSync(templatePath, 'utf8')

      // Compilar o template com Handlebars
      const compiledTemplate = handlebars.compile(template)

      // Renderizar o template com os dados do contexto
      const html = compiledTemplate(options.context || {})

      // Enviar o email com o HTML renderizado
      return this.sendEmail({
        ...options,
        html,
      })
    } catch (error) {
      this.logger.error(`Erro ao processar template ${templateName}: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Envia um email com as opções especificadas
   * @param options Opções do email
   * @returns Informações do email enviado
   */
  async sendEmail(options: EmailOptions) {
    try {
      // Preparar as opções do email
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.MAIL_FROM ?? '"AZ Seguros" <no-reply@azseguros.com>',
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
        priority: options.priority,
      }

      // Enviar o email
      const info = await this.transporter.sendMail(mailOptions)

      // Em ambiente de desenvolvimento, exibir URL de visualização do Ethereal
      if (this.isDev) {
        this.logger.log(`Email enviado: ${info.messageId}`)
        this.logger.log(`URL de visualização: ${nodemailer.getTestMessageUrl(info)}`)
      }

      return info
    } catch (error) {
      this.logger.error(`Erro ao enviar email: ${error.message}`, error.stack)
      throw error
    }
  }
}
