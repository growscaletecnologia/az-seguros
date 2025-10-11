import { SystemPageStatus, SystemPageType } from '@prisma/client'

export class SystemPage {
  id: string
  title: string
  slug: string
  content: string
  type: SystemPageType
  status: SystemPageStatus
  updatedBy?: string
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}
