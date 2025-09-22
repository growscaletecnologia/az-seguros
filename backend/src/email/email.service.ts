import { Injectable, Logger } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter
  private readonly logger = new Logger(EmailService.name)

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  async sendHtml(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM ?? '"AZ Seguros" <no-reply@azseguros.com>',
      to,
      subject,
      html,
    })
  }
}
