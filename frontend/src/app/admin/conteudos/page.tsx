"use client";
import React, { useState } from "react";

interface Conteudo {
	id: number;
	titulo: string;
	tipo: "pagina" | "banner" | "faq" | "termo";
	conteudo: string;
	ativo: boolean;
	dataAtualizacao: string;
}

const ConteudosPage = () => {
	const [conteudos, setConteudos] = useState<Conteudo[]>([
		{
			id: 1,
			titulo: "Página Inicial - Banner Principal",
			tipo: "banner",
			conteudo: "Encontre o melhor seguro viagem com os melhores preços!",
			ativo: true,
			dataAtualizacao: "2024-01-15",
		},
		{
			id: 2,
			titulo: "Termos de Uso",
			tipo: "termo",
			conteudo: "Estes são os termos de uso da nossa plataforma...",
			ativo: true,
			dataAtualizacao: "2024-01-10",
		},
		{
			id: 3,
			titulo: "FAQ - Perguntas Frequentes",
			tipo: "faq",
			conteudo: "Como funciona o seguro viagem?\nO seguro viagem é...",
			ativo: true,
			dataAtualizacao: "2024-01-12",
		},
	]);

	const [editandoConteudo, setEditandoConteudo] = useState<Conteudo | null>(null);
	const [novoConteudo, setNovoConteudo] = useState({
		titulo: "",
		tipo: "pagina" as "pagina" | "banner" | "faq" | "termo",
		conteudo: "",
	});

	const criarConteudo = () => {
		const conteudo: Conteudo = {
			id: Date.now(),
			...novoConteudo,
			ativo: true,
			dataAtualizacao: new Date().toISOString().split("T")[0],
		};
		setConteudos([...conteudos, conteudo]);
		setNovoConteudo({ titulo: "", tipo: "pagina", conteudo: "" });
		alert("Conteúdo criado com sucesso!");
	};

	const editarConteudo = (conteudo: Conteudo) => {
		setEditandoConteudo({ ...conteudo });
	};

	const salvarEdicao = () => {
		if (editandoConteudo) {
			const conteudoAtualizado = {
				...editandoConteudo,
				dataAtualizacao: new Date().toISOString().split("T")[0],
			};
			setConteudos(
				conteudos.map((c) => (c.id === editandoConteudo.id ? conteudoAtualizado : c)),
			);
			setEditandoConteudo(null);
			alert("Conteúdo atualizado com sucesso!");
		}
	};

	const toggleConteudo = (id: number) => {
		setConteudos(conteudos.map((c) => (c.id === id ? { ...c, ativo: !c.ativo } : c)));
	};

	const excluirConteudo = (id: number) => {
		if (confirm("Tem certeza que deseja excluir este conteúdo?")) {
			setConteudos(conteudos.filter((c) => c.id !== id));
			alert("Conteúdo excluído com sucesso!");
		}
	};

	const getTipoColor = (tipo: string) => {
		switch (tipo) {
			case "banner":
				return "bg-purple-100 text-purple-800";
			case "faq":
				return "bg-blue-100 text-blue-800";
			case "termo":
				return "bg-orange-100 text-orange-800";
			case "pagina":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Gestão de Conteúdos</h1>

			{/* Formulário para criar/editar conteúdo */}
			<div className="bg-white p-6 rounded-lg shadow mb-6">
				<h2 className="text-xl font-semibold mb-4">
					{editandoConteudo ? "Editar Conteúdo" : "Criar Novo Conteúdo"}
				</h2>

				<div className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-2">Título</label>
							<input
								type="text"
								className="w-full p-2 border rounded"
								value={
									editandoConteudo ? editandoConteudo.titulo : novoConteudo.titulo
								}
								onChange={(e) => {
									if (editandoConteudo) {
										setEditandoConteudo({
											...editandoConteudo,
											titulo: e.target.value,
										});
									} else {
										setNovoConteudo({
											...novoConteudo,
											titulo: e.target.value,
										});
									}
								}}
								placeholder="Título do conteúdo"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2">Tipo</label>
							<select
								className="w-full p-2 border rounded"
								value={editandoConteudo ? editandoConteudo.tipo : novoConteudo.tipo}
								onChange={(e) => {
									const tipo = e.target.value as
										| "pagina"
										| "banner"
										| "faq"
										| "termo";
									if (editandoConteudo) {
										setEditandoConteudo({ ...editandoConteudo, tipo });
									} else {
										setNovoConteudo({ ...novoConteudo, tipo });
									}
								}}
							>
								<option value="pagina">Página</option>
								<option value="banner">Banner</option>
								<option value="faq">FAQ</option>
								<option value="termo">Termo/Política</option>
							</select>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">Conteúdo</label>
						<textarea
							className="w-full p-2 border rounded h-40"
							value={
								editandoConteudo ? editandoConteudo.conteudo : novoConteudo.conteudo
							}
							onChange={(e) => {
								if (editandoConteudo) {
									setEditandoConteudo({
										...editandoConteudo,
										conteudo: e.target.value,
									});
								} else {
									setNovoConteudo({ ...novoConteudo, conteudo: e.target.value });
								}
							}}
							placeholder="Digite o conteúdo aqui..."
						/>
						<p className="text-sm text-gray-600 mt-1">
							Suporte básico para Markdown. Use \n para quebras de linha.
						</p>
					</div>

					<div className="flex space-x-2">
						<button
							onClick={editandoConteudo ? salvarEdicao : criarConteudo}
							className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
							disabled={
								!(editandoConteudo
									? editandoConteudo.titulo && editandoConteudo.conteudo
									: novoConteudo.titulo && novoConteudo.conteudo)
							}
						>
							{editandoConteudo ? "Salvar Alterações" : "Criar Conteúdo"}
						</button>

						{editandoConteudo && (
							<button
								onClick={() => setEditandoConteudo(null)}
								className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
							>
								Cancelar
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Lista de conteúdos */}
			<div className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-xl font-semibold mb-4">Conteúdos Existentes</h2>

				<div className="space-y-4">
					{conteudos.map((conteudo) => (
						<div key={conteudo.id} className="border p-4 rounded">
							<div className="flex justify-between items-start">
								<div className="flex-1">
									<div className="flex items-center space-x-3 mb-2">
										<h3 className="font-semibold">{conteudo.titulo}</h3>
										<span
											className={`px-2 py-1 text-xs rounded ${getTipoColor(conteudo.tipo)}`}
										>
											{conteudo.tipo}
										</span>
										<span
											className={`px-2 py-1 text-xs rounded ${
												conteudo.ativo
													? "bg-green-100 text-green-800"
													: "bg-red-100 text-red-800"
											}`}
										>
											{conteudo.ativo ? "Ativo" : "Inativo"}
										</span>
									</div>

									<p className="text-gray-600 text-sm mb-2">
										Última atualização: {conteudo.dataAtualizacao}
									</p>

									<div className="bg-gray-50 p-3 rounded text-sm">
										<p className="text-gray-700">
											{conteudo.conteudo.length > 200
												? `${conteudo.conteudo.substring(0, 200)}...`
												: conteudo.conteudo}
										</p>
									</div>
								</div>

								<div className="flex flex-col space-y-2 ml-4">
									<button
										onClick={() => editarConteudo(conteudo)}
										className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
									>
										Editar
									</button>

									<button
										onClick={() => toggleConteudo(conteudo.id)}
										className={`px-3 py-1 text-sm rounded ${
											conteudo.ativo
												? "bg-orange-500 hover:bg-orange-600"
												: "bg-green-500 hover:bg-green-600"
										} text-white`}
									>
										{conteudo.ativo ? "Desativar" : "Ativar"}
									</button>

									<button
										onClick={() => excluirConteudo(conteudo.id)}
										className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
									>
										Excluir
									</button>
								</div>
							</div>
						</div>
					))}
				</div>

				{conteudos.length === 0 && (
					<div className="text-center py-8 text-gray-500">
						Nenhum conteúdo encontrado. Crie o primeiro conteúdo acima.
					</div>
				)}
			</div>
		</div>
	);
};

export default ConteudosPage;
