"use client";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
	// ------------------ STATE CONTEÚDOS ------------------
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
	const [sectionTitle, setSectionTitle] = useState<string>("Por que escolher a SeguroViagem?");

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

	// ------------------ STATE SECTION “POR QUE ESCOLHER” ------------------
	const [sectionItems, setSectionItems] = useState([
		{
			id: 1,
			icone: "💰",
			titulo: "Melhor Preço",
			descricao: "Garantimos o melhor preço do mercado ou devolvemos a diferença.",
		},
		{
			id: 2,
			icone: "⏰",
			titulo: "Suporte 24h",
			descricao: "Atendimento especializado 24 horas por dia, 7 dias por semana.",
		},
		{
			id: 3,
			icone: "🛡️",
			titulo: "Compra Segura",
			descricao: "Transações 100% seguras com certificado SSL e criptografia.",
		},
		{
			id: 4,
			icone: "👥",
			titulo: "+1M Clientes",
			descricao: "Mais de 1 milhão de viajantes já confiaram em nossos serviços.",
		},
	]);

	const handleUpdateSection = (id: number, field: string, value: string) => {
		setSectionItems((prev) =>
			prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
		);
	};

	// ------------------ STATE HEADER & FOOTER ------------------
	const [headerFooter, setHeaderFooter] = useState({
		headerCode: "<!-- Código Google Tag Manager Header -->",
		footerCode: "<!-- Código Google Tag Manager Footer -->",
	});

	// ------------------ STATE AVALIAÇÕES ------------------
	const [avaliacoes, setAvaliacoes] = useState([
		{
			id: 1,
			cliente: "João Silva",
			comentario: "Excelente atendimento e seguro confiável!",
		},
		{
			id: 2,
			cliente: "Maria Souza",
			comentario: "Super fácil contratar e me senti protegida na viagem.",
		},
	]);

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Gestão de Páginas </h1>

			<Tabs defaultValue="conteudos">
				<TabsList className="mb-6">
					<TabsTrigger value="conteudos">Conteúdos</TabsTrigger>
					<TabsTrigger value="section">Seção: Por que escolher</TabsTrigger>
					<TabsTrigger value="headerFooter">Header & Footer</TabsTrigger>
					<TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
				</TabsList>

				{/* Aba Conteúdos */}
				<TabsContent value="conteudos">
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
											editandoConteudo
												? editandoConteudo.titulo
												: novoConteudo.titulo
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
										value={
											editandoConteudo
												? editandoConteudo.tipo
												: novoConteudo.tipo
										}
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
										editandoConteudo
											? editandoConteudo.conteudo
											: novoConteudo.conteudo
									}
									onChange={(e) => {
										if (editandoConteudo) {
											setEditandoConteudo({
												...editandoConteudo,
												conteudo: e.target.value,
											});
										} else {
											setNovoConteudo({
												...novoConteudo,
												conteudo: e.target.value,
											});
										}
									}}
									placeholder="Digite o conteúdo aqui..."
								/>
							</div>
							<div className="flex space-x-2">
								<button
									onClick={editandoConteudo ? salvarEdicao : criarConteudo}
									className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
													className={`px-2 py-1 text-xs rounded ${getTipoColor(
														conteudo.tipo,
													)}`}
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
												<p className="text-gray-700">{conteudo.conteudo}</p>
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
					</div>
				</TabsContent>

				{/* Aba Section */}
				<TabsContent value="section">
					<div className="bg-white p-6 rounded-lg shadow space-y-6">
						<h2 className="text-xl font-semibold mb-4">
							<CardTitle className="mb-4">Título da Seção</CardTitle>
							<Input
								value={sectionTitle}
								onChange={(e) => setSectionTitle(e.target.value)}
								placeholder="Ícone (emoji ou classe)"
							/>
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{sectionItems.map((item) => (
								<div key={item.id} className="border p-4 rounded space-y-3">
									<Input
										value={item.icone}
										onChange={(e) =>
											handleUpdateSection(item.id, "icone", e.target.value)
										}
										placeholder="Ícone (emoji ou classe)"
									/>
									<Input
										value={item.titulo}
										onChange={(e) =>
											handleUpdateSection(item.id, "titulo", e.target.value)
										}
										placeholder="Título"
									/>
									<Textarea
										value={item.descricao}
										onChange={(e) =>
											handleUpdateSection(
												item.id,
												"descricao",
												e.target.value,
											)
										}
										placeholder="Descrição"
									/>
								</div>
							))}
						</div>
						<Button className="bg-blue-600 text-white hover:bg-blue-700">
							Salvar Alterações
						</Button>
					</div>
				</TabsContent>

				{/* Aba Header/Footer */}
				<TabsContent value="headerFooter">
					<div className="bg-white p-6 rounded-lg shadow space-y-6">
						<h2 className="text-xl font-semibold mb-4">Header & Footer</h2>
						<div>
							<label className="block text-sm font-medium mb-2">Código Header</label>
							<Textarea
								className="h-32"
								value={headerFooter.headerCode}
								onChange={(e) =>
									setHeaderFooter({ ...headerFooter, headerCode: e.target.value })
								}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-2">Código Footer</label>
							<Textarea
								className="h-32"
								value={headerFooter.footerCode}
								onChange={(e) =>
									setHeaderFooter({ ...headerFooter, footerCode: e.target.value })
								}
							/>
						</div>
						<Button className="bg-blue-600 text-white hover:bg-blue-700">
							Salvar Alterações
						</Button>
					</div>
				</TabsContent>

				{/* Aba Avaliações */}
				<TabsContent value="avaliacoes">
					<div className="bg-white p-6 rounded-lg shadow space-y-6">
						<h2 className="text-xl font-semibold mb-4">Gerenciar Avaliações</h2>
						<div className="space-y-4">
							{avaliacoes.map((av) => (
								<div
									key={av.id}
									className="border p-4 rounded flex justify-between items-start"
								>
									<div>
										<p className="font-semibold">{av.cliente}</p>
										<p className="text-gray-600">{av.comentario}</p>
									</div>
									<div className="flex gap-2">
										<Button
											variant="outline"
											onClick={() =>
												setAvaliacoes((prev) =>
													prev.filter((item) => item.id !== av.id),
												)
											}
										>
											Excluir
										</Button>
									</div>
								</div>
							))}
						</div>
						<div className="border-t pt-4">
							<h3 className="text-lg font-semibold mb-2">Adicionar Avaliação</h3>
							<Input placeholder="Nome do cliente" className="mb-2" />
							<Textarea placeholder="Comentário" className="mb-2" />
							<Button className="bg-blue-600 text-white hover:bg-blue-700">
								Adicionar
							</Button>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default ConteudosPage;
