import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { permissionsService } from '@/services/api/rbac'
import type { Permission, Action } from '@/types/rbac'
import { toast } from 'sonner'

// Schema de validação do formulário
const permissionFormSchema = z.object({
  resource: z.string().min(2, 'Recurso deve ter pelo menos 2 caracteres'),
  action: z.enum(['create', 'read', 'update', 'delete', 'assign'] as const),
  description: z.string().optional(),
})

type PermissionFormValues = z.infer<typeof permissionFormSchema>

interface PermissionFormProps {
  permission?: Permission
  onSuccess: () => void
}

/**
 * Componente de formulário para criação e edição de permissões
 */
export function PermissionForm({ permission, onSuccess }: PermissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!permission

  // Lista de ações disponíveis
  const actions: Action[] = ['create', 'read', 'update', 'delete', 'assign']

  // Inicializa o formulário com os valores da permissão, se estiver editando
  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      resource: permission?.resource || '',
      action: permission?.action || 'read',
      description: permission?.description || '',
    },
  })

  // Manipula o envio do formulário
  const onSubmit = async (values: PermissionFormValues) => {
    try {
      setIsSubmitting(true)
      
      if (isEditing && permission) {
        await permissionsService.update(permission.id, values)
        toast.success('Permissão atualizada com sucesso')
      } else {
        await permissionsService.create(values)
        toast.success('Permissão criada com sucesso')
      }
      
      onSuccess()
    } catch (error) {
      console.error(error)
      toast.error(isEditing ? 'Erro ao atualizar permissão' : 'Erro ao criar permissão')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="resource"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recurso</FormLabel>
              <FormControl>
                <Input placeholder="Nome do recurso (ex: users, roles)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="action"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ação</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma ação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {actions.map(action => (
                    <SelectItem key={action} value={action}>
                      {action.charAt(0).toUpperCase() + action.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrição da permissão" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}