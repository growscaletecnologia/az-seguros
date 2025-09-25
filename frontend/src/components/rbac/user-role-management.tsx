"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { rolesService, userRbacService } from "@/services/api/rbac";
import type { Role, UserRole } from "@/types/rbac";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UserRoleManagementProps {
	userId: string;
	userRoles: UserRole[];
	onRolesUpdated: () => void;
}

/**
 * Componente para gerenciar papéis de um usuário
 */
export function UserRoleManagement({
	userId,
	userRoles,
	onRolesUpdated,
}: UserRoleManagementProps) {
	const [roles, setRoles] = useState<Role[]>([]);
	const [selectedRoleId, setSelectedRoleId] = useState<string>("");
	const [loading, setLoading] = useState(true);
	const [assigning, setAssigning] = useState(false);
	const [removing, setRemoving] = useState(false);

	// Carrega todos os papéis disponíveis
	useEffect(() => {
		const loadRoles = async () => {
			try {
				setLoading(true);
				const data = await rolesService.getAll();
				setRoles(data);
			} catch (error) {
				console.error(error);
				toast.error("Erro ao carregar papéis");
			} finally {
				setLoading(false);
			}
		};

		loadRoles();
	}, []);

	// Filtra papéis que ainda não foram atribuídos ao usuário
	const availableRoles = roles.filter(
		(role) => !userRoles.some((userRole) => userRole.roleId === role.id),
	);

	// Atribui um papel ao usuário
	const handleAssignRole = async () => {
		if (!selectedRoleId) return;

		try {
			setAssigning(true);
			await userRbacService.assignRoles(userId, {
				roleIds: [Number.parseInt(selectedRoleId)],
			});
			toast.success("Papel atribuído com sucesso");
			setSelectedRoleId("");
			onRolesUpdated();
		} catch (error) {
			console.error(error);
			toast.error("Erro ao atribuir papel");
		} finally {
			setAssigning(false);
		}
	};

	// Remove um papel do usuário
	const handleRemoveRole = async (roleId: number) => {
		try {
			setRemoving(true);
			await userRbacService.removeRoles(userId, [roleId]);
			toast.success("Papel removido com sucesso");
			onRolesUpdated();
		} catch (error) {
			console.error(error);
			toast.error("Erro ao remover papel");
		} finally {
			setRemoving(false);
		}
	};

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-medium">Papéis do Usuário</h3>

			{/* Lista de papéis atribuídos */}
			<div className="flex flex-wrap gap-2 min-h-10">
				{userRoles.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						Nenhum papel atribuído
					</p>
				) : (
					userRoles.map((userRole) => {
						const role =
							roles.find((r) => r.id === userRole.roleId) || userRole.role;
						return (
							<Badge
								key={userRole.roleId}
								variant="secondary"
								className="flex items-center gap-1"
							>
								{role?.name || `Papel #${userRole.roleId}`}
								<Button
									variant="ghost"
									size="icon"
									className="h-4 w-4 rounded-full"
									onClick={() => handleRemoveRole(userRole.roleId)}
									disabled={
										removing || (role?.isSystem && userRoles.length === 1)
									}
									title="Remover papel"
								>
									<X className="h-3 w-3" />
								</Button>
							</Badge>
						);
					})
				)}
			</div>

			{/* Formulário para adicionar papel */}
			<div className="flex items-end gap-2">
				<div className="flex-1">
					<Select
						value={selectedRoleId}
						onValueChange={setSelectedRoleId}
						disabled={loading || availableRoles.length === 0}
					>
						<SelectTrigger>
							<SelectValue placeholder="Selecione um papel para adicionar" />
						</SelectTrigger>
						<SelectContent>
							{availableRoles.map((role) => (
								<SelectItem key={role.id} value={role.id.toString()}>
									{role.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<Button
					onClick={handleAssignRole}
					disabled={!selectedRoleId || assigning}
				>
					{assigning ? "Adicionando..." : "Adicionar"}
				</Button>
			</div>
		</div>
	);
}
