"use client";
import { CreateUserForm } from "@/components/rbac/create-user-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	type UpdateUserDto,
	type User,
	usersService,
} from "@/services/api/users";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

interface Cliente {
	id: string;
	nome: string;
	email: string;
	ativo: boolean;
	dataCriacao: string;
}

// Função para converter usuário da API para o formato da interface Cliente
const mapApiUserToCliente = (user: User): Cliente => {
	return {
		id: user.id,
		nome: user.name || "",
		email: user.email,
		ativo: user.status === "ACTIVE",
		dataCriacao: new Date().toISOString(), // A API não retorna data de criação
	};
};

const ClientesPage = () => {
	const [clientes, setClientes] = useState<Cliente[]>([]);
	const [loading, setLoading] = useState(true);
	const [editandoCliente, setEditandoCliente] = useState<Cliente | null>(null);

	// Carregar clientes da API (apenas usuários do tipo CUSTOMER)
	const carregarClientes = async () => {
		try {
			setLoading(true);
			const data = await usersService.getAll();
			const clientesMapeados = data
				.filter((user) => user.role === "CUSTOMER")
				.map(mapApiUserToCliente);
			setClientes(clientesMapeados);
		} catch (error) {
			console.error("Erro ao carregar clientes:", error);
			toast.error("Erro ao carregar clientes");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		carregarClientes();
	}, []);

	const atualizarCliente = async () => {
		if (!editandoCliente) return;

		try {
			const updateUserDto: UpdateUserDto = {
				name: editandoCliente.nome,
				email: editandoCliente.email,
				role: "CUSTOMER", // Sempre CUSTOMER nesta página
				status: editandoCliente.ativo ? "ACTIVE" : "INACTIVE",
			};

			await usersService.update(editandoCliente.id, updateUserDto);
			toast.success("Cliente atualizado com sucesso!");
			carregarClientes();
			setEditandoCliente(null);
		} catch (error) {
			console.error("Erro ao atualizar cliente:", error);
			toast.error("Erro ao atualizar cliente");
		}
	};

	const excluirCliente = async (id: string) => {
		if (!confirm("Tem certeza que deseja excluir este cliente?")) return;

		try {
			await usersService.remove(id);
			toast.success("Cliente excluído com sucesso!");
			carregarClientes();
		} catch (error) {
			console.error("Erro ao excluir cliente:", error);
			toast.error("Erro ao excluir cliente");
		}
	};

	const editarCliente = (cliente: Cliente) => {
		setEditandoCliente({ ...cliente });
	};

	const salvarEdicao = async () => {
		if (editandoCliente) {
			await atualizarCliente();
		}
	};

	const toggleCliente = async (id: string) => {
		const cliente = clientes.find((c) => c.id === id);
		if (!cliente) return;
		try {
			const updateUserDto: UpdateUserDto = {
				name: cliente.nome,
				email: cliente.email,
				role: "CUSTOMER",
				status: cliente.ativo ? "INACTIVE" : "ACTIVE",
			};

			await usersService.update(id, updateUserDto);
			toast.success(
				`Cliente ${cliente.ativo ? "desativado" : "ativado"} com sucesso!`,
			);
			carregarClientes();
		} catch (error) {
			console.error("Erro ao alterar status do cliente:", error);
			toast.error("Erro ao alterar status do cliente");
		}
	};

	return (
		<div className="container py-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Gerenciamento de Clientes</h1>
				<div className="flex gap-2">
					<Dialog>
						<DialogTrigger asChild>
							<Button>Adicionar Cliente</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[600px]">
							<DialogHeader>
								<DialogTitle>Adicionar Novo Cliente</DialogTitle>
							</DialogHeader>
							<Card>
								<CardContent className="pt-4">
									<CreateUserForm
										onSuccess={() => {
											carregarClientes();
											toast.success("Cliente criado com sucesso!");
										}}
										defaultRole="CUSTOMER"
										hideRoleSelection
									/>
								</CardContent>
							</Card>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Modal para edição de cliente */}
			<Dialog
				open={!!editandoCliente}
				onOpenChange={(open) => !open && setEditandoCliente(null)}
			>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Editar Cliente</DialogTitle>
					</DialogHeader>
					<Card>
						<CardContent className="pt-4">
							{editandoCliente && (
								<>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
										<div>
											<label className="block text-sm font-medium mb-2">
												Nome
											</label>
											<input
												type="text"
												className="w-full p-2 border rounded"
												value={editandoCliente.nome}
												onChange={(e) => {
													setEditandoCliente({
														...editandoCliente,
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
												value={editandoCliente.email}
												onChange={(e) => {
													setEditandoCliente({
														...editandoCliente,
														email: e.target.value,
													});
												}}
											/>
										</div>
									</div>

									<div className="mb-4">
										<label className="block text-sm font-medium mb-2">
											Status
										</label>
										<div className="flex space-x-4">
											<label className="flex items-center">
												<input
													type="radio"
													name="status"
													value="ativo"
													checked={editandoCliente.ativo}
													onChange={() =>
														setEditandoCliente({
															...editandoCliente,
															ativo: true,
														})
													}
													className="mr-2"
												/>
												Ativo
											</label>
											<label className="flex items-center">
												<input
													type="radio"
													name="status"
													value="inativo"
													checked={!editandoCliente.ativo}
													onChange={() =>
														setEditandoCliente({
															...editandoCliente,
															ativo: false,
														})
													}
													className="mr-2"
												/>
												Inativo
											</label>
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
											onClick={() => setEditandoCliente(null)}
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

			{/* Lista de clientes */}
			<div className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-xl font-semibold mb-4">Clientes Cadastrados</h2>

				{loading ? (
					<div className="flex justify-center items-center h-64">
						<p>Carregando clientes...</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full table-auto">
							<thead>
								<tr className="bg-gray-50">
									<th className="px-4 py-2 text-left">Nome</th>
									<th className="px-4 py-2 text-left">Email</th>
									<th className="px-4 py-2 text-left">Status</th>
									<th className="px-4 py-2 text-left">Ações</th>
								</tr>
							</thead>
							<tbody>
								{clientes.length === 0 ? (
									<tr>
										<td
											colSpan={4}
											className="px-4 py-2 text-center text-gray-500"
										>
											Nenhum cliente encontrado.
										</td>
									</tr>
								) : (
									clientes.map((cliente) => (
										<tr key={cliente.id} className="border-t">
											<td className="px-4 py-2">{cliente.nome}</td>
											<td className="px-4 py-2">{cliente.email}</td>
											<td className="px-4 py-2">
												<span
													className={`px-2 py-1 text-xs rounded ${
														cliente.ativo
															? "bg-green-100 text-green-800"
															: "bg-red-100 text-red-800"
													}`}
												>
													{cliente.ativo ? "Ativo" : "Inativo"}
												</span>
											</td>
											<td className="px-4 py-2">
												<div className="flex space-x-2">
													<button
														onClick={() => editarCliente(cliente)}
														className="bg-yellow-500 text-white px-3 py-1 text-xs rounded hover:bg-yellow-600"
													>
														Editar
													</button>
													<button
														onClick={() => toggleCliente(cliente.id)}
														className={`px-3 py-1 text-xs rounded ${
															cliente.ativo
																? "bg-orange-500 hover:bg-orange-600"
																: "bg-green-500 hover:bg-green-600"
														} text-white`}
													>
														{cliente.ativo ? "Desativar" : "Ativar"}
													</button>
													{/* <button
														onClick={() => excluirCliente(cliente.id)}
														className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600"
													>
														Excluir
													</button> */}
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
};

export default ClientesPage;
