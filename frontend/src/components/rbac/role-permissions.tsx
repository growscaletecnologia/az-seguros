'use-client'
import { useState, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { rolesService, permissionsService } from '@/services/api/rbac'
import type { Permission, RolePermission } from '@/types/rbac'
import { toast } from 'sonner'

interface RolePermissionsProps {
  roleId: number
  onSuccess: () => void
}

/**
 * Componente para gerenciar permissões de um papel
 */
export function RolePermissions({ roleId, onSuccess }: RolePermissionsProps) {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([])
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<Record<number, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Carrega todas as permissões e as permissões do papel
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Carrega todas as permissões
        const permissions = await permissionsService.getAll()
        setAllPermissions(permissions)
        
        // Carrega o papel com suas permissões
        const role = await rolesService.getById(roleId)
        setRolePermissions(role.permissions || [])
        
        // Inicializa o estado de seleção
        const permissionState: Record<number, boolean> = {}
        role.permissions?.forEach(rp => {
          permissionState[rp.permissionId] = rp.allow
        })
        setSelectedPermissions(permissionState)
      } catch (error) {
        console.error(error)
        toast.error('Erro ao carregar permissões')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [roleId])

  // Agrupa permissões por recurso
  const groupedPermissions = allPermissions.reduce<Record<string, Permission[]>>((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = []
    }
    acc[permission.resource].push(permission)
    return acc
  }, {})

  // Verifica se uma permissão está atribuída ao papel
  const isPermissionAssigned = (permissionId: number) => {
    return selectedPermissions[permissionId] === true
  }

  // Manipula a alteração de uma permissão
  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    setSelectedPermissions(prev => ({
      ...prev,
      [permissionId]: checked
    }))
  }

  // Salva as alterações nas permissões
  const handleSave = async () => {
    try {
      setSaving(true)
      
      // Identifica permissões a serem adicionadas
      const permissionsToAdd = Object.entries(selectedPermissions)
        .filter(([id, allow]) => allow)
        .map(([id]) => parseInt(id))
        .filter(id => !rolePermissions.some(rp => rp.permissionId === id && rp.allow))
      
      // Identifica permissões a serem removidas
      const permissionsToRemove = rolePermissions
        .filter(rp => rp.allow && !selectedPermissions[rp.permissionId])
        .map(rp => rp.permissionId)
      
      // Adiciona novas permissões
      if (permissionsToAdd.length > 0) {
        await rolesService.assignPermissions(roleId, {
          permissionIds: permissionsToAdd,
          allow: true
        })
      }
      
      // Remove permissões
      if (permissionsToRemove.length > 0) {
        await rolesService.removePermissions(roleId, permissionsToRemove)
      }
      
      toast.success('Permissões atualizadas com sucesso')
      onSuccess()
    } catch (error) {
      console.error(error)
      toast.error('Erro ao atualizar permissões')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-4">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="max-h-[400px] overflow-y-auto pr-2">
        {Object.entries(groupedPermissions).map(([resource, permissions]) => (
          <div key={resource} className="mb-6">
            <h3 className="text-lg font-medium mb-2 border-b pb-1">{resource}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {permissions.map(permission => (
                <div key={permission.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`permission-${permission.id}`}
                    checked={isPermissionAssigned(permission.id)}
                    onCheckedChange={(checked) => 
                      handlePermissionChange(permission.id, checked === true)
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={`permission-${permission.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission.action} {resource}
                    </label>
                    {permission.description && (
                      <p className="text-xs text-muted-foreground">
                        {permission.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Permissões'}
        </Button>
      </div>
    </div>
  )
}