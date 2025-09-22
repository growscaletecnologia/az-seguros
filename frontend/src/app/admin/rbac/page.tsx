import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoleList } from "@/components/rbac/role-list"
import { PermissionList } from "@/components/rbac/permission-list"
import { InviteUserForm } from "@/components/rbac/invite-user-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Página de administração do sistema RBAC
 */
export default function RbacAdminPage() {
  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Controle de Acesso</h1>
        <p className="text-muted-foreground">
          Gerencie papéis, permissões e convide novos usuários para o sistema
        </p>
      </div>

      <Tabs defaultValue="roles">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="roles">Papéis</TabsTrigger>
          <TabsTrigger value="permissions">Permissões</TabsTrigger>
          <TabsTrigger value="invite">Convidar Usuário</TabsTrigger>
        </TabsList>
        
        <TabsContent value="roles" className="mt-6">
          <RoleList />
        </TabsContent>
        
        <TabsContent value="permissions" className="mt-6">
          <PermissionList />
        </TabsContent>
        
        <TabsContent value="invite" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Convidar Novo Usuário</CardTitle>
              <CardDescription>
                Envie um convite por email para um novo usuário se juntar ao sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InviteUserForm onSuccess={() => {
                // Limpar formulário ou mostrar mensagem de sucesso
              }} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}