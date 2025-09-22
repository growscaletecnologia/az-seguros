import { PrismaClient, Action } from '@prisma/client'

/**
 * Seed script for RBAC (Role-Based Access Control) initial data
 * Creates default roles and permissions for the system
 */
async function seedRbac() {
  const prisma = new PrismaClient()

  try {
    console.log('Starting RBAC seed...')

    // Create default permissions
    const resources = ['users', 'roles', 'permissions', 'plans', 'quotes', 'orders', 'coupons']
    const actions: Action[] = ['CREATE', 'READ', 'UPDATE', 'DELETE']

    console.log('Creating default permissions...')

    // Create permissions for each resource and action combination
    for (const resource of resources) {
      for (const action of actions) {
        // Skip irrelevant combinations
        await prisma.permission.upsert({
          where: {
            resource_action: {
              resource,
              action,
            },
          },
          update: {},
          create: {
            resource,
            action,
            description: `Permission to ${action} ${resource}`,
          },
        })
      }
    }

    console.log('Creating default roles...')

    // Create Admin role
    const adminRole = await prisma.role.upsert({
      where: { name: 'Admin' },
      update: {
        description: 'Administrator with full access',
        isSystem: true,
      },
      create: {
        name: 'Admin',
        description: 'Administrator with full access',
        isSystem: true,
      },
    })

    // Create Manager role
    const managerRole = await prisma.role.upsert({
      where: { name: 'Manager' },
      update: {
        description: 'Manager with access to most features',
        isSystem: true,
      },
      create: {
        name: 'Manager',
        description: 'Manager with access to most features',
        isSystem: true,
      },
    })

    // Create Customer role
    const customerRole = await prisma.role.upsert({
      where: { name: 'Customer' },
      update: {
        description: 'Regular customer with limited access',
        isSystem: true,
      },
      create: {
        name: 'Customer',
        description: 'Regular customer with limited access',
        isSystem: true,
      },
    })

    // Get all permissions
    const allPermissions = await prisma.permission.findMany()
    // Assign all permissions to Admin role
    console.log('Assigning permissions to Admin role...')
    for (const permission of allPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        },
        update: { allow: true },
        create: {
          roleId: adminRole.id,
          permissionId: permission.id,
          allow: true,
        },
      })
    }

    // Assign limited permissions to Manager role
    console.log('Assigning permissions to Manager role...')
    for (const permission of allPermissions) {
      // Managers can't delete users or manage roles/permissions
      if (
        (permission.resource === 'users' && permission.action === Action.DELETE) ||
        (permission.resource === 'roles' && permission.action === Action.DELETE) ||
        (permission.resource === 'permissions' && permission.action === Action.DELETE)
      ) {
        continue
      }

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: managerRole.id,
            permissionId: permission.id,
          },
        },
        update: { allow: true },
        create: {
          roleId: managerRole.id,
          permissionId: permission.id,
          allow: true,
        },
      })
    }

    // Assign very limited permissions to Customer role
    console.log('Assigning permissions to Customer role...')
    for (const permission of allPermissions) {
      // Customers can only read plans, create quotes, and manage their own orders
      if (
        (permission.resource === 'plans' && permission.action === Action.READ) ||
        (permission.resource === 'quotes' && [Action.CREATE, Action.READ].includes('READ')) ||
        (permission.resource === 'orders' && [Action.READ, Action.CREATE].includes('CREATE'))
      ) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: customerRole.id,
              permissionId: permission.id,
            },
          },
          update: { allow: true },
          create: {
            roleId: customerRole.id,
            permissionId: permission.id,
            allow: true,
          },
        })
      }
    }

    console.log('RBAC seed completed successfully!')
  } catch (error) {
    console.error('Error seeding RBAC data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Execute the seed function
seedRbac()
  .then(() => console.log('RBAC seed script completed'))
  .catch((e) => console.error('Error in RBAC seed script:', e))
