import { Address } from './address.entity'

export enum Role {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
}

export class User {
  id: string
  email: string
  name?: string
  phone?: string
  cpfCnpj?: string
  birthDate?: Date
  password: string
  oldPassword?: string

  addresses?: Address[]

  role: Role
  status: UserStatus
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  deleted: boolean

  constructor(props: {
    id?: string
    email: string
    name?: string
    phone?: string
    cpfCnpj?: string
    birthDate?: Date
    password: string
    oldPassword?: string
    addresses?: Address[]
    role?: Role
    status?: UserStatus
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
    deleted?: boolean
  }) {
    this.id = props.id ?? ''
    this.email = props.email
    this.name = props.name
    this.phone = props.phone
    this.cpfCnpj = props.cpfCnpj
    this.birthDate = props.birthDate
    this.password = props.password
    this.oldPassword = props.oldPassword
    this.addresses = props.addresses
    this.role = props.role ?? Role.CUSTOMER
    this.status = props.status ?? UserStatus.PENDING
    this.createdAt = props.createdAt ?? new Date()
    this.updatedAt = props.updatedAt ?? new Date()
    this.deletedAt = props.deletedAt
    this.deleted = props.deleted ?? false
  }
}
