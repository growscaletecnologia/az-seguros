import { Action } from '@prisma/client'

export class Permission {
  id: number
  resource: string
  action: Action
  description?: string
  createdAt: Date
  updatedAt: Date
}
