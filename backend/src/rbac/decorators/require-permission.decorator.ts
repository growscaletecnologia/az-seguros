import { SetMetadata } from '@nestjs/common'
import { Action } from '@prisma/client'
import { Resource } from '../enums/resource.enum'

export interface RequiredPermission {
  resource: Resource | string
  action: Action
}

export const PERMISSIONS_KEY = 'permissions'

/**
 * Decorator to specify required permissions for a controller method
 * @param resource - The resource being accessed (use Resource enum)
 * @param action - The action being performed
 * @returns Decorator function
 */
export const RequirePermission = (permission: RequiredPermission) =>
  SetMetadata(PERMISSIONS_KEY, permission)
