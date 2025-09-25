"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { rolesService } from "@/services/api/rbac";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface GranularPermission {
	resource: string;
	canRead: boolean;
	canCreate: boolean;
	canUpdate: boolean;
	canDelete: boolean;
}

interface GranularPermissionsProps {
	roleId: number;
	onSuccess?: () => void;
}

/**
 * Componente para gerenciar permissões granulares baseadas nas páginas da sidebar
 */
export function GranularPermissions({
	roleId,
	onSuccess,
}: GranularPermissionsProps) {
	const [permissions, setPermissions] = useState<GranularPermission[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	// Recursos baseados nas páginas da sidebar
	const sidebarResources = [
		{ id: "dashboard", label: "Dashboard" },
		{ id: "usuarios", label: "Gestão de Usuários" },
		{ id: "rbac", label: "Permissões de Acesso" },
		{ id: "blog", label: "Blog" },
		{ id: "cupons", label: "Cupons de Desconto" },
		{ id: "pedidos", label: "Pedidos" },
		{ id: "integracoes", label: "Integrações" },
		{ id: "paginas", label: "Páginas" },
	];

	// Carrega as permissões atuais do papel
	useEffect(() => {
		const loadPermissions = async () => {
			try {
				setLoading(true);
				// Carrega o papel com suas permissões
				const role = await rolesService.getById(roleId);
				// Inicializa as permissões granulares para cada recurso da sidebar
				const granularPermissions = sidebarResources.map((resource) => {
					// Verifica se existem permissões para este recurso
					const resourcePermissions =
						role.permissions?.filter(
							(p) => p.permission?.resource === resource.id,
						) || [];
					// Mapeia as permissões existentes para o formato granular
					return {
						resource: resource.id,
						canRead: resourcePermissions.some(
							//@ts-ignore
							(p) => p.permission?.action === "READ" && p.allow,
						),
						canCreate: resourcePermissions.some(
							//@ts-ignore
							(p) => p.permission?.action === "CREATE" && p.allow,
						),
						canUpdate: resourcePermissions.some(
							//@ts-ignore
							(p) => p.permission?.action === "UPDATE" && p.allow,
						),
						canDelete: resourcePermissions.some(
							//@ts-ignore
							(p) => p.permission.action === "DELETE" && p.allow,
						),
					};
				});
				setPermissions(granularPermissions);
			} catch (error) {
				console.error(error);
				toast.error("Erro ao carregar permissões");
			} finally {
				setLoading(false);
			}
		};
		loadPermissions();
	}, [roleId]);

	// Atualiza o estado de uma permissão específica
	const handlePermissionChange = (
		resourceIndex: number,
		action: "canRead" | "canCreate" | "canUpdate" | "canDelete",
		value: boolean,
	) => {
		const updatedPermissions = [...permissions];
		updatedPermissions[resourceIndex] = {
			...updatedPermissions[resourceIndex],
			[action]: value,
		};
		setPermissions(updatedPermissions);
	};

	// Salva as permissões
	const handleSave = async () => {
		try {
			setSaving(true);
			// Converte as permissões granulares para o formato esperado pela API
			const permissionsToSave = {
				permissions: permissions.map((p) => ({
					resource: p.resource,
					canRead: p.canRead,
					canCreate: p.canCreate,
					canUpdate: p.canUpdate,
					canDelete: p.canDelete,
				})),
			};
			// Envia para a API
			await rolesService.updateGranularPermissions(roleId, permissionsToSave);
			toast.success("Permissões atualizadas com sucesso");
			onSuccess?.();
		} catch (error) {
			console.error(error);
			toast.error("Erro ao salvar permissões");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return <div className="flex justify-center p-4">Carregando...</div>;
	}

	return (
		<div className="space-y-6">
			<div className="max-h-[500px] overflow-y-auto pr-2">
				{sidebarResources.map((resource, index) => {
					const permission = permissions[index];
					return (
						<Card key={resource.id} className="mb-4">
							<CardHeader className="pb-2">
								<CardTitle className="text-lg">{resource.label}</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									{/* Visualizar */}
									<div className="space-y-2">
										<Label className="font-medium">Visualizar</Label>
										<RadioGroup
											value={permission.canRead ? "true" : "false"}
											onValueChange={(value) =>
												handlePermissionChange(
													index,
													"canRead",
													value === "true",
												)
											}
											className="flex flex-col space-y-1"
										>
											<div className="flex items-center space-x-2">
												<RadioGroupItem
													value="true"
													id={`read-yes-${resource.id}`}
												/>
												<Label htmlFor={`read-yes-${resource.id}`}>Sim</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem
													value="false"
													id={`read-no-${resource.id}`}
												/>
												<Label htmlFor={`read-no-${resource.id}`}>Não</Label>
											</div>
										</RadioGroup>
									</div>
									{/* Criar */}
									<div className="space-y-2">
										<Label className="font-medium">Criar</Label>
										<RadioGroup
											value={permission.canCreate ? "true" : "false"}
											onValueChange={(value) =>
												handlePermissionChange(
													index,
													"canCreate",
													value === "true",
												)
											}
											className="flex flex-col space-y-1"
										>
											<div className="flex items-center space-x-2">
												<RadioGroupItem
													value="true"
													id={`create-yes-${resource.id}`}
												/>
												<Label htmlFor={`create-yes-${resource.id}`}>Sim</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem
													value="false"
													id={`create-no-${resource.id}`}
												/>
												<Label htmlFor={`create-no-${resource.id}`}>Não</Label>
											</div>
										</RadioGroup>
									</div>

									{/* Editar */}
									<div className="space-y-2">
										<Label className="font-medium">Editar</Label>
										<RadioGroup
											value={permission.canUpdate ? "true" : "false"}
											onValueChange={(value) =>
												handlePermissionChange(
													index,
													"canUpdate",
													value === "true",
												)
											}
											className="flex flex-col space-y-1"
										>
											<div className="flex items-center space-x-2">
												<RadioGroupItem
													value="true"
													id={`update-yes-${resource.id}`}
												/>
												<Label htmlFor={`update-yes-${resource.id}`}>Sim</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem
													value="false"
													id={`update-no-${resource.id}`}
												/>
												<Label htmlFor={`update-no-${resource.id}`}>Não</Label>
											</div>
										</RadioGroup>
									</div>

									{/* Excluir */}
									<div className="space-y-2">
										<Label className="font-medium">Excluir</Label>
										<RadioGroup
											value={permission.canDelete ? "true" : "false"}
											onValueChange={(value) =>
												handlePermissionChange(
													index,
													"canDelete",
													value === "true",
												)
											}
											className="flex flex-col space-y-1"
										>
											<div className="flex items-center space-x-2">
												<RadioGroupItem
													value="true"
													id={`delete-yes-${resource.id}`}
												/>
												<Label htmlFor={`delete-yes-${resource.id}`}>Sim</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem
													value="false"
													id={`delete-no-${resource.id}`}
												/>
												<Label htmlFor={`delete-no-${resource.id}`}>Não</Label>
											</div>
										</RadioGroup>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			<Separator />

			<div className="flex justify-end">
				<Button onClick={handleSave} disabled={saving}>
					{saving ? "Salvando..." : "Salvar Permissões"}
				</Button>
			</div>
		</div>
	);
}
