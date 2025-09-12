import { User } from './user.entity'

export class Address {
  id: string
  userId: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  deleted: boolean

  user?: User

  constructor(props: {
    id?: string
    userId: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
    deleted?: boolean
    user?: User
  }) {
    this.id = props.id ?? ''
    this.userId = props.userId
    this.street = props.street
    this.city = props.city
    this.state = props.state
    this.zipCode = props.zipCode
    this.country = props.country
    this.createdAt = props.createdAt ?? new Date()
    this.updatedAt = props.updatedAt ?? new Date()
    this.deletedAt = props.deletedAt
    this.deleted = props.deleted ?? false
    this.user = props.user
  }
}
