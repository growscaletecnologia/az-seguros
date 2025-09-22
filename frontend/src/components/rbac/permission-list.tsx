'use client'
import { useState, useEffect } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { permissionsService } from '@/services/api/rbac'
import type { Permission } from '@/types/rbac'
import { PermissionForm } from './permission-form'
import { toast } from 'sonner'

/**
 * Componente para listar e gerenciar permissões
 */
export function PermissionList() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Carrega a lista de permissões
  const loadPermissions = async () => {
    try {
      setLoading(true)
      const data = await permissionsService.getAll()
      setPermissions(data)
    } catch (error) {
      toast.error('Erro ao carregar permissões')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Carrega as permissões ao montar o componente
  useEffect(() => {
    loadPermissions()
  }, [])

  // Manipula a exclusão de uma permissão
  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta permissão?')) {
      try {
        await permissionsService.remove(id)
        toast.success('Permissão excluída com sucesso')
        loadPermissions()
      } catch (error) {
        toast.error('Erro ao excluir permissão')
        console.error(error)
      }
    }
  }

  // Abre o diálogo de edição
  const openEditDialog = (permission: Permission) => {
    setSelectedPermission(permission)
    setIsEditOpen(true)
  }

  // Formata a ação para exibição
  const formatAction = (action: string) => {
    return action.charAt(0).toUpperCase() + action.slice(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Permissões</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Permissão
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Permissão</DialogTitle>
            </DialogHeader>
            <PermissionForm 
              onSuccess={() => {
                loadPermissions()
                setIsCreateOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center p-4">Carregando...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recurso</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Nenhuma permissão encontrada
                </TableCell>
              </TableRow>
            ) : (
              permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">{permission.resource}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {formatAction(permission.action)}
                    </Badge>
                  </TableCell>
                  <TableCell>{permission.description || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(permission)}
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(permission.id)}
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Diálogo de Edição */}
      {selectedPermission && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Permissão</DialogTitle>
            </DialogHeader>
            <PermissionForm 
              permission={selectedPermission} 
              onSuccess={() => {
                loadPermissions()
                setIsEditOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}