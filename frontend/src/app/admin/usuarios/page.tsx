"use client";
import { CreateUserForm } from "@/components/rbac/create-user-form";
import { InviteUserForm } from "@/components/rbac/invite-user-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import AuthService from "@/lib/services/auth-service";
import { userRbacService } from "@/services/api/rbac";
import {
	CreateUserDto,
	type UpdateUserDto,
	type User,
	usersService,
} from "@/services/api/users";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

interface Usuario {
	id: string;
	nome: string;
	email: string;
	role: string;
	permissoes: {
		ver: boolean;
		editar: boolean;
		criar: boolean;
		excluir: boolean;
	};
	ativo: boolean;
	dataCriacao: string;
}

// Função para converter usuário da API para o formato da interface
const mapApiUserToUsuario = (user: User): Usuario => {
	// Determinar permissões com base nos dados do usuário
	const permissoes = {
		ver: false,
		editar: false,
		criar: false,
		excluir: false,
	};

	// Se o usuário tem permissões diretas, verificamos elas
	if (user.userPermissions) {
		user.userPermissions.forEach((up) => {
			if (up.permission) {
				if (up.permission.action === "read" && up.allow) permissoes.ver = true;
				if (up.permission.action === "update" && up.allow)
					permissoes.editar = true;
				if (up.permission.action === "create" && up.allow)
					permissoes.criar = true;
				if (up.permission.action === "delete" && up.allow)
					permissoes.excluir = true;
			}
		});
	}

	return {
		id: user.id,
		nome: user.name || "",
		email: user.email,
		role: user.role.toLowerCase(),
		permissoes,
		ativo: user.status === "ACTIVE",
		dataCriacao: new Date().toISOString(), // A API não retorna data de criação
	};
};

const UsuariosPage = () => {
	const [usuarios, setUsuarios] = useState<Usuario[]>([]);
	const [loading, setLoading] = useState(true);
	const [isInviteOpen, setIsInviteOpen] = useState(false);

	const [editandoUsuario, setEditandoUsuario] = useState<Usuario | null>(null);

	// Carregar usuários da API
	const carregarUsuarios = async () => {
		try {
			setLoading(true);
			const data = await usersService.getAll();
			const usuariosMapeados = data.map(mapApiUserToUsuario);
			console.log("usuarios Mapeados", usuariosMapeados);
			const usuariosSemCustomer = usuariosMapeados.filter(
				(u) => u.role !== "customer",
			);
			setUsuarios(usuariosSemCustomer);
		} catch (error) {
			console.error("Erro ao carregar usuários:", error);
			toast.error(
				`Erro ao carregar usuários: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		carregarUsuarios();
	}, []);

	const permissoesPadrao = {
		ADMIN: { ver: true, editar: true, criar: true, excluir: true },
		MANAGER: { ver: true, editar: true, criar: true, excluir: false },
		CUSTOMER: { ver: true, editar: false, criar: false, excluir: false },
	};

	/**
	 * Maps Portuguese role names to English backend values
	 */
	const mapRoleToBackend = (role: string): string => {
		const roleMapping: Record<string, string> = {
			admin: "ADMIN",
			gerente: "MANAGER",
			cliente: "CUSTOMER",
		};
		return roleMapping[role.toLowerCase()] || "CUSTOMER";
	};

	/**
	 * Maps English backend role values to Portuguese display names
	 */
	const mapRoleToDisplay = (role: string): string => {
		const roleMapping: Record<string, string> = {
			ADMIN: "admin",
			MANAGER: "gerente",
			CUSTOMER: "cliente",
		};
		return roleMapping[role.toUpperCase()] || "cliente";
	};

	const atualizarUsuario = async () => {
		if (!editandoUsuario) return;

		try {
			const updateUserDto: UpdateUserDto = {
				name: editandoUsuario.nome,
				email: editandoUsuario.email,
				role: mapRoleToBackend(editandoUsuario.role) as
					| "ADMIN"
					| "MANAGER"
					| "CUSTOMER",
				status: editandoUsuario.ativo ? "ACTIVE" : "INACTIVE",
			};

			await usersService.update(editandoUsuario.id, updateUserDto);
			toast.success("Usuário atualizado com sucesso!");
			carregarUsuarios();
			setEditandoUsuario(null);
		} catch (error) {
			console.error("Erro ao atualizar usuário:", error);
			toast.error(
				`Erro ao atualizar usuário: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
			);
		}
	};

	const excluirUsuario = async (id: string) => {
		try {
			await usersService.remove(id);
			toast.success("Usuário excluído com sucesso!");
			carregarUsuarios();
		} catch (error) {
			console.error("Erro ao excluir usuário:", error);
			toast.error(
				`Erro ao excluir usuário: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
			);
		}
	};

	// Função antiga removida para evitar duplicação
	// A função criarUsuario já foi implementada acima com integração à API

	const editarUsuario = (usuario: Usuario) => {
		setEditandoUsuario({ ...usuario });
	};

	const salvarEdicao = async () => {
		if (editandoUsuario) {
			await atualizarUsuario();
		}
	};

	const toggleUsuario = async (id: string) => {
		const usuario = usuarios.find((u) => u.id === id);
		if (!usuario) return;

		// Verificar se o usuário está tentando desativar sua própria conta
		const currentUser = AuthService.getUser();
		if (currentUser && currentUser.id === id && usuario.ativo) {
			toast.error("Você não pode desativar sua própria conta!");
			return;
		}

		try {
			const updateUserDto: UpdateUserDto = {
				name: usuario.nome,
				email: usuario.email,
				role: mapRoleToBackend(usuario.role) as
					| "ADMIN"
					| "MANAGER"
					| "CUSTOMER",
				status: usuario.ativo ? "INACTIVE" : "ACTIVE",
			};

			await usersService.update(id, updateUserDto);
			toast.success(
				`Usuário ${usuario.ativo ? "desativado" : "ativado"} com sucesso!`,
			);
			carregarUsuarios();
		} catch (error) {
			console.error("Erro ao alterar status do usuário:", error);
			toast.error(
				`Erro ao alterar status do usuário: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
			);
		}
	};

	const atualizarRole = (role: string, isEditing = false) => {
		const permissoes =
			permissoesPadrao[role as keyof typeof permissoesPadrao] ||
			permissoesPadrao.CUSTOMER;

		if (isEditing && editandoUsuario) {
			setEditandoUsuario({ ...editandoUsuario, role, permissoes });
		}
	};

	const atualizarPermissao = (
		permissao: keyof Usuario["permissoes"],
		valor: boolean,
		isEditing = false,
	) => {
		if (isEditing && editandoUsuario) {
			setEditandoUsuario({
				...editandoUsuario,
				permissoes: { ...editandoUsuario.permissoes, [permissao]: valor },
			});
		}
	};

	return (
		<div className="container py-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Gestão de Usuários do Sistema</h1>
				<div className="flex gap-2">
					<Dialog>
						{/* <DialogTrigger asChild>
							<Button variant="outline">Convidar Usuário</Button>
						</DialogTrigger> */}
						<DialogContent className="sm:max-w-[600px]">
							<DialogHeader>
								<DialogTitle>Convidar Novo Usuário</DialogTitle>
							</DialogHeader>
							<Card>
								<CardContent className="pt-4">
									<InviteUserForm
										onSuccess={() => {
											toast.success("Convite enviado com sucesso!");
											carregarUsuarios();
										}}
									/>
								</CardContent>
							</Card>
						</DialogContent>
					</Dialog>

					<Dialog>
						<DialogTrigger asChild>
							<Button>Adicionar Usuário</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[600px]">
							<DialogHeader>
								<DialogTitle>Adicionar Novo Usuário</DialogTitle>
							</DialogHeader>
							<Card>
								<CardContent className="pt-4">
									<CreateUserForm
										onSuccess={() => {
											carregarUsuarios();
										}}
									/>
								</CardContent>
							</Card>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Modal para edição de usuário */}
			<Dialog
				open={!!editandoUsuario}
				onOpenChange={(open) => !open && setEditandoUsuario(null)}
			>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Editar Usuário</DialogTitle>
					</DialogHeader>
					<Card>
						<CardContent className="pt-4">
							{editandoUsuario && (
								<>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
										<div>
											<label className="block text-sm font-medium mb-2">
												Nome
											</label>
											<input
												type="text"
												className="w-full p-2 border rounded"
												value={editandoUsuario.nome}
												onChange={(e) => {
													setEditandoUsuario({
														...editandoUsuario,
														nome: e.target.value,
													});
												}}
											/>
										</div>

										<div>
											<label className="block text-sm font-medium mb-2">
												Email
											</label>
											<input
												type="email"
												className="w-full p-2 border rounded"
												value={editandoUsuario.email}
												onChange={(e) => {
													setEditandoUsuario({
														...editandoUsuario,
														email: e.target.value,
													});
												}}
											/>
										</div>
									</div>

									<div className="mb-4">
										<label className="block text-sm font-medium mb-2">
											Role
										</label>
										<div className="flex space-x-4">
											{(["admin", "gerente", "cliente"] as const).map(
												(role) => (
													<label key={role} className="flex items-center">
														<input
															type="radio"
															name="role"
															value={role}
															checked={editandoUsuario.role === role}
															onChange={() => atualizarRole(role, true)}
															className="mr-2"
														/>
														{role.charAt(0).toUpperCase() + role.slice(1)}
													</label>
												),
											)}
										</div>
									</div>

									<div className="flex space-x-2">
										<Button
											onClick={salvarEdicao}
											className="bg-blue-500 hover:bg-blue-600"
										>
											Salvar Alterações
										</Button>
										<Button
											variant="outline"
											onClick={() => setEditandoUsuario(null)}
										>
											Cancelar
										</Button>
									</div>
								</>
							)}
						</CardContent>
					</Card>
				</DialogContent>
			</Dialog>

			{/* Lista de usuários */}
			<div className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-xl font-semibold mb-4">Usuários Existentes</h2>

				<div className="overflow-x-auto">
					<table className="w-full table-auto">
						<thead>
							<tr className="bg-gray-50">
								<th className="px-4 py-2 text-left">Nome</th>
								<th className="px-4 py-2 text-left">Email</th>
								<th className="px-4 py-2 text-left">Role</th>
								<th className="px-4 py-2 text-left">Status</th>
								<th className="px-4 py-2 text-left">Ações</th>
							</tr>
						</thead>
						<tbody>
							{usuarios.map((usuario) => (
								<tr key={usuario.id} className="border-t">
									<td className="px-4 py-2">{usuario.nome}</td>
									<td className="px-4 py-2">{usuario.email}</td>
									<td className="px-4 py-2">
										<span
											className={`px-2 py-1 text-xs rounded ${
												usuario.role === "admin"
													? "bg-red-100 text-red-800"
													: usuario.role === "gerente"
														? "bg-blue-100 text-blue-800"
														: "bg-green-100 text-green-800"
											}`}
										>
											{usuario.role}
										</span>
									</td>
									{/* <td className="px-4 py-2">
										<div className="flex space-x-1">
											{Object.entries(usuario.permissoes).map(
												([perm, ativo]) => (
													<span
														key={perm}
														className={`px-1 py-0.5 text-xs rounded ${
															ativo
																? "bg-green-100 text-green-800"
																: "bg-gray-100 text-gray-500"
														}`}
													>
														{perm.charAt(0).toUpperCase()}
													</span>
												),
											)}
										</div>
									</td> */}
									<td className="px-4 py-2">
										<span
											className={`px-2 py-1 text-xs rounded ${
												usuario.ativo
													? "bg-green-100 text-green-800"
													: "bg-red-100 text-red-800"
											}`}
										>
											{usuario.ativo ? "Ativo" : "Inativo"}
										</span>
									</td>
									<td className="px-4 py-2">
										<div className="flex space-x-2">
											<button
												onClick={() => editarUsuario(usuario)}
												className="bg-yellow-500 text-white px-3 py-1 text-xs rounded hover:bg-yellow-600"
											>
												Editar
											</button>
											<button
												onClick={() => toggleUsuario(usuario.id)}
												disabled={
													AuthService.getUser()?.id === usuario.id &&
													usuario.ativo
												}
												className={`px-3 py-1 text-xs rounded ${
													AuthService.getUser()?.id === usuario.id &&
													usuario.ativo
														? "bg-gray-400 cursor-not-allowed"
														: usuario.ativo
															? "bg-orange-500 hover:bg-orange-600"
															: "bg-green-500 hover:bg-green-600"
												} text-white`}
												title={
													AuthService.getUser()?.id === usuario.id &&
													usuario.ativo
														? "Você não pode desativar sua própria conta"
														: undefined
												}
											>
												{usuario.ativo ? "Desativar" : "Ativar"}
											</button>
											{/* <button
												onClick={() => excluirUsuario(usuario.id)}
												className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600"
											>
												Excluir
											</button> */}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default UsuariosPage;
