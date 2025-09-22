import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { rolesService } from '@/services/api/rbac'
import type { Role } from '@/types/rbac'
import { toast } from 'sonner'

// Schema de validação do formulário
const roleFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
})

type RoleFormValues = z.infer<typeof roleFormSchema>

interface RoleFormProps {
  role?: Role
  onSuccess: () => void
}

/**
 * Componente de formulário para criação e edição de papéis
 */
export function RoleForm({ role, onSuccess }: RoleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!role

  // Inicializa o formulário com os valores do papel, se estiver editando
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: role?.name || '',
      description: role?.description || '',
    },
  })

  // Manipula o envio do formulário
  const onSubmit = async (values: RoleFormValues) => {
    try {
      setIsSubmitting(true)
      
      if (isEditing && role) {
        await rolesService.update(role.id, values)
        toast.success('Papel atualizado com sucesso')
      } else {
        await rolesService.create({
          ...values,
          isSystem: false,
        })
        toast.success('Papel criado com sucesso')
      }
      
      onSuccess()
    } catch (error) {
      console.error(error)
      toast.error(isEditing ? 'Erro ao atualizar papel' : 'Erro ao criar papel')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do papel" {...field} />
              </FormControl>
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
                  placeholder="Descrição do papel e suas responsabilidades" 
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