"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { rolesService } from "@/services/api/rbac";
import type { Role } from "@/types/rbac";
import { Pencil, Plus, Shield, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GranularPermissions } from "./granular-permissions";
import { RoleForm } from "./role-form";
import { RolePermissions } from "./role-permissions";

/**
 * Componente para listar e gerenciar papéis (roles)
 */
export function RoleList() {
	const [roles, setRoles] = useState<Role[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedRole, setSelectedRole] = useState<Role | null>(null);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	// Carrega a lista de papéis
	const loadRoles = async () => {
		try {
			setLoading(true);
			const data = await rolesService.getAll();
			setRoles(data);
		} catch (error) {
			toast.error("Erro ao carregar papéis");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	// Carrega os papéis ao montar o componente
	useEffect(() => {
		loadRoles();
	}, []);

	// Manipula a exclusão de um papel
	const handleDelete = async (id: number) => {
		if (window.confirm("Tem certeza que deseja excluir este papel?")) {
			try {
				await rolesService.remove(id);
				toast.success("Papel excluído com sucesso");
				loadRoles();
			} catch (error) {
				toast.error("Erro ao excluir papel");
				console.error(error);
			}
		}
	};

	// Abre o diálogo de edição
	const openEditDialog = (role: Role) => {
		setSelectedRole(role);
		setIsEditOpen(true);
	};

	// Abre o diálogo de permissões
	const openPermissionsDialog = (role: Role) => {
		setSelectedRole(role);
		setIsPermissionsOpen(true);
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Papéis (Roles)</h2>
				<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Novo Papel
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[500px]">
						<DialogHeader>
							<DialogTitle>Criar Novo Papel</DialogTitle>
						</DialogHeader>
						<RoleForm
							onSuccess={() => {
								loadRoles();
								setIsCreateOpen(false);
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
							<TableHead>Nome</TableHead>
							<TableHead>Descrição</TableHead>
							<TableHead>Tipo</TableHead>
							<TableHead className="text-right">Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{roles.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} className="text-center">
									Nenhum papel encontrado
								</TableCell>
							</TableRow>
						) : (
							roles.map((role) => (
								<TableRow key={role.id}>
									<TableCell className="font-medium">{role.name}</TableCell>
									<TableCell>{role.description || "-"}</TableCell>
									<TableCell>
										{role.isSystem ? (
											<Badge variant="secondary">Sistema</Badge>
										) : (
											<Badge variant="outline">Personalizado</Badge>
										)}
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											{/* <Button
												variant="outline"
												size="icon"
												onClick={() => openPermissionsDialog(role)}
												title="Gerenciar Permissões"
											>
												<Shield className="h-4 w-4" />
											</Button> */}
											<Button
												variant="outline"
												size="icon"
												onClick={() => openEditDialog(role)}
												disabled={role.isSystem}
												title="Editar"
											>
												<Pencil className="h-4 w-4" />
											</Button>
											<Button
												variant="outline"
												size="icon"
												onClick={() => handleDelete(role.id)}
												disabled={role.isSystem}
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
			{selectedRole && (
				<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
					<DialogContent className="sm:max-w-[500px]">
						<DialogHeader>
							<DialogTitle>Editar Papel</DialogTitle>
						</DialogHeader>
						<RoleForm
							role={selectedRole}
							onSuccess={() => {
								loadRoles();
								setIsEditOpen(false);
							}}
						/>
					</DialogContent>
				</Dialog>
			)}

			{/* Diálogo de Permissões */}
			{selectedRole && (
				<Dialog open={isPermissionsOpen} onOpenChange={setIsPermissionsOpen}>
					<DialogContent className="sm:max-w-[700px]">
						<DialogHeader>
							<DialogTitle>
								Permissões do Papel: {selectedRole.name}
							</DialogTitle>
						</DialogHeader>
						<Tabs defaultValue="granular">
							<TabsList className="mb-4">
								<TabsTrigger value="granular">
									Permissões por Página
								</TabsTrigger>
								<TabsTrigger value="detailed">
									Permissões Detalhadas
								</TabsTrigger>
							</TabsList>
							<TabsContent value="granular">
								<GranularPermissions
									roleId={selectedRole.id}
									onSuccess={() => {
										loadRoles();
										setIsPermissionsOpen(false);
									}}
								/>
							</TabsContent>
							<TabsContent value="detailed">
								<RolePermissions
									roleId={selectedRole.id}
									onSuccess={() => {
										loadRoles();
										setIsPermissionsOpen(false);
									}}
								/>
							</TabsContent>
						</Tabs>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
