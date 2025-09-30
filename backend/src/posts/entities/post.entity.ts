import { PostStatus } from '@prisma/client'

export class Post {
  id: string
  title: string
  description?: string
  resume: string
  content: string
  userId: string
  metadata?: Record<string, string>
  status: PostStatus
  slug: string
  fullUrl?: string
  coverImage?: string
  createdAt: Date
  updatedAt: Date
  updatedBy?: string
}
