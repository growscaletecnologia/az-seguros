"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
	type Avaliation,
	AvaliationService,
} from "@/services/avaliation.service";
import {
	ChevronLeft,
	ChevronRight,
	Eye,
	Plus,
	Search,
	StarIcon,
	Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AvaliacoesAdminPage() {
	const [avaliacoes, setAvaliacoes] = useState<Avaliation[]>([]);
	const [filteredAvaliacoes, setFilteredAvaliacoes] = useState<Avaliation[]>(
		[],
	);
	const [loading, setLoading] = useState(true);
	const [selectedAvaliation, setSelectedAvaliation] =
		useState<Avaliation | null>(null);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(5);
	const [newAvaliation, setNewAvaliation] = useState({
		name: "",
		rating: 5,
		comment: "",
		location: "",
		avatar: "",
		active: true,
	});

	// Carregar avaliações
	const loadAvaliacoes = async () => {
		try {
			setLoading(true);
			const data = await AvaliationService.getAll(false); // Busca todas, incluindo inativas
			// Garantir que data seja sempre um array
			const avaliacoesArray = Array.isArray(data) ? data : [];
			setAvaliacoes(avaliacoesArray);
			setFilteredAvaliacoes(avaliacoesArray);
		} catch (error) {
			console.error("Erro ao carregar avaliações:", error);
			toast.error("Erro ao carregar avaliações");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadAvaliacoes();
	}, []);

	// Filtrar avaliações por nome
	useEffect(() => {
		if (searchTerm.trim() === "") {
			setFilteredAvaliacoes(avaliacoes);
			setCurrentPage(1);
		} else {
			const filtered = avaliacoes.filter((avaliation) =>
				avaliation.name.toLowerCase().includes(searchTerm.toLowerCase()),
			);
			setFilteredAvaliacoes(filtered);
			setCurrentPage(1);
		}
	}, [searchTerm, avaliacoes]);

	// Alternar status de ativação
	const handleToggleActive = async (id: string) => {
		try {
			await AvaliationService.toggleActive(id);
			toast.success("Status da avaliação atualizado com sucesso");
			loadAvaliacoes(); // Recarrega a lista
		} catch (error) {
			console.error("Erro ao atualizar status:", error);
			toast.error("Erro ao atualizar status da avaliação");
		}
	};

	// Excluir avaliação
	const handleDeleteAvaliation = async (id: string) => {
		if (
			window.confirm(
				"Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita.",
			)
		) {
			try {
				await AvaliationService.delete(id);
				toast.success("Avaliação excluída com sucesso");
				loadAvaliacoes(); // Recarrega a lista
			} catch (error) {
				console.error("Erro ao excluir avaliação:", error);
				toast.error("Erro ao excluir avaliação");
			}
		}
	};

	// Visualizar avaliação
	const handlePreview = (avaliation: Avaliation) => {
		setSelectedAvaliation(avaliation);
		setPreviewOpen(true);
	};

	// Criar nova avaliação
	const handleCreateAvaliation = async () => {
		try {
			await AvaliationService.create(newAvaliation);
			toast.success("Avaliação criada com sucesso");
			setCreateDialogOpen(false);
			// Limpar formulário
			setNewAvaliation({
				name: "",
				rating: 5,
				comment: "",
				location: "",
				avatar: "",
				active: true,
			});
			// Recarregar lista
			loadAvaliacoes();
		} catch (error) {
			console.error("Erro ao criar avaliação:", error);
			toast.error("Erro ao criar avaliação");
		}
	};

	// Função para renderizar estrelas
	const renderStars = (rating: number) => {
		return Array(5)
			.fill(0)
			.map((_, i) => (
				<StarIcon
					key={i}
					className={cn(
						"h-4 w-4",
						i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
					)}
				/>
			));
	};

	// Função para formatar data
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		}).format(date);
	};

	// Paginação
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredAvaliacoes.slice(
		indexOfFirstItem,
		indexOfLastItem,
	);
	const totalPages = Math.ceil(filteredAvaliacoes.length / itemsPerPage);

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

	return (
		<div className="container mx-auto py-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Gerenciamento de Avaliações</CardTitle>
					<Button onClick={() => setCreateDialogOpen(true)}>
						<Plus className="mr-2 h-4 w-4" />
						Nova Avaliação
					</Button>
				</CardHeader>
				<CardContent>
					{/* Filtro por nome */}
					<div className="mb-4 flex">
						<div className="relative flex-1">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
							<Input
								type="text"
								placeholder="Filtrar por nome do cliente..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-9"
							/>
						</div>
					</div>

					{loading ? (
						<div className="flex justify-center py-8">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
						</div>
					) : (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Nome</TableHead>
										<TableHead>Avaliação</TableHead>
										<TableHead>Destino</TableHead>
										<TableHead>Data</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">Ações</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{currentItems.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={6}
												className="text-center py-4 text-gray-500"
											>
												Nenhuma avaliação encontrada
											</TableCell>
										</TableRow>
									) : (
										currentItems.map((avaliation) => (
											<TableRow key={avaliation.id}>
												<TableCell className="font-medium">
													{avaliation.name}
												</TableCell>
												<TableCell>
													<div className="flex">
														{renderStars(avaliation.rating)}
													</div>
												</TableCell>
												<TableCell>{avaliation.location || "-"}</TableCell>
												<TableCell>
													{formatDate(avaliation.createdAt)}
												</TableCell>
												<TableCell>
													<div className="flex items-center space-x-2">
														<Switch
															checked={avaliation.active}
															onCheckedChange={() =>
																handleToggleActive(avaliation.id)
															}
														/>
														<Badge
															variant={
																avaliation.active ? "default" : "outline"
															}
														>
															{avaliation.active ? "Ativo" : "Inativo"}
														</Badge>
													</div>
												</TableCell>
												<TableCell className="text-right">
													<div className="flex justify-end space-x-2">
														<Button
															variant="outline"
															size="icon"
															onClick={() => handlePreview(avaliation)}
														>
															<Eye className="h-4 w-4" />
														</Button>
														<Button
															variant="outline"
															size="icon"
															onClick={() =>
																handleDeleteAvaliation(avaliation.id)
															}
															className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

							{/* Paginação */}
							{filteredAvaliacoes.length > 0 && (
								<div className="flex items-center justify-between space-x-2 py-4">
									<div className="text-sm text-gray-500">
										Mostrando {indexOfFirstItem + 1}-
										{Math.min(indexOfLastItem, filteredAvaliacoes.length)} de{" "}
										{filteredAvaliacoes.length} avaliações
									</div>
									<div className="flex items-center space-x-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => paginate(currentPage - 1)}
											disabled={currentPage === 1}
										>
											<ChevronLeft className="h-4 w-4" />
										</Button>
										{Array.from({ length: totalPages }, (_, i) => i + 1).map(
											(number) => (
												<Button
													key={number}
													variant={
														currentPage === number ? "default" : "outline"
													}
													size="sm"
													onClick={() => paginate(number)}
												>
													{number}
												</Button>
											),
										)}
										<Button
											variant="outline"
											size="sm"
											onClick={() => paginate(currentPage + 1)}
											disabled={currentPage === totalPages}
										>
											<ChevronRight className="h-4 w-4" />
										</Button>
									</div>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>

			{/* Modal de visualização */}
			<Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Visualizar Avaliação</DialogTitle>
						<DialogDescription>
							Detalhes completos da avaliação do usuário
						</DialogDescription>
					</DialogHeader>

					{selectedAvaliation && (
						<div className="space-y-4">
							<div className="flex items-center space-x-3">
								{selectedAvaliation.avatar ? (
									<img
										src={selectedAvaliation.avatar}
										alt={selectedAvaliation.name}
										className="w-12 h-12 rounded-full"
									/>
								) : (
									<div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
										<span className="text-blue-600 font-medium">
											{selectedAvaliation.name
												.split(" ")
												.map((n) => n[0])
												.join("")
												.toUpperCase()
												.substring(0, 2)}
										</span>
									</div>
								)}
								<div>
									<h3 className="font-semibold">{selectedAvaliation.name}</h3>
									{selectedAvaliation.location && (
										<p className="text-sm text-gray-500">
											Viagem para {selectedAvaliation.location}
										</p>
									)}
								</div>
							</div>

							<div className="flex">
								{renderStars(selectedAvaliation.rating)}
							</div>

							<div className="bg-gray-50 p-4 rounded-md">
								<p className="italic">"{selectedAvaliation.comment}"</p>
							</div>

							<div className="text-sm text-gray-500">
								<p>Criado em: {formatDate(selectedAvaliation.createdAt)}</p>
								<p>
									Última atualização: {formatDate(selectedAvaliation.updatedAt)}
								</p>
								<p>Status: {selectedAvaliation.active ? "Ativo" : "Inativo"}</p>
							</div>

							<div className="flex justify-end space-x-2 pt-4">
								<Button variant="outline" onClick={() => setPreviewOpen(false)}>
									Fechar
								</Button>
								<Button
									variant={
										selectedAvaliation.active ? "destructive" : "default"
									}
									onClick={() => {
										handleToggleActive(selectedAvaliation.id);
										setPreviewOpen(false);
									}}
								>
									{selectedAvaliation.active ? "Desativar" : "Ativar"}
								</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Modal para criar nova avaliação */}
			<Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Nova Avaliação</DialogTitle>
						<DialogDescription>
							Adicione uma nova avaliação de cliente ao sistema
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Nome do Cliente</Label>
							<Input
								id="name"
								value={newAvaliation.name}
								onChange={(e) =>
									setNewAvaliation({ ...newAvaliation, name: e.target.value })
								}
								placeholder="Nome completo"
								required
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="rating">Avaliação (1-5 estrelas)</Label>
							<Input
								id="rating"
								type="number"
								min="1"
								max="5"
								value={newAvaliation.rating}
								onChange={(e) =>
									setNewAvaliation({
										...newAvaliation,
										rating: Number.parseInt(e.target.value),
									})
								}
								required
							/>
							<div className="flex mt-1">
								{Array(5)
									.fill(0)
									.map((_, i) => (
										<StarIcon
											key={i}
											className={cn(
												"h-5 w-5 cursor-pointer",
												i < newAvaliation.rating
													? "text-yellow-400 fill-yellow-400"
													: "text-gray-300",
											)}
											onClick={() =>
												setNewAvaliation({ ...newAvaliation, rating: i + 1 })
											}
										/>
									))}
							</div>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="comment">Comentário</Label>
							<Textarea
								id="comment"
								value={newAvaliation.comment}
								onChange={(e) =>
									setNewAvaliation({
										...newAvaliation,
										comment: e.target.value,
									})
								}
								placeholder="O que o cliente achou do serviço?"
								required
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="location">Destino da Viagem</Label>
							<Input
								id="location"
								value={newAvaliation.location}
								onChange={(e) =>
									setNewAvaliation({
										...newAvaliation,
										location: e.target.value,
									})
								}
								placeholder="Ex: Japão, Europa, etc."
							/>
						</div>

						{/* <div className="grid gap-2">
              <Label htmlFor="avatar">URL do Avatar (opcional)</Label>
              <Input 
                id="avatar" 
                value={newAvaliation.avatar}
                onChange={(e) => setNewAvaliation({...newAvaliation, avatar: e.target.value})}
                placeholder="https://exemplo.com/avatar.jpg"
              />
            </div> */}

						<div className="flex items-center space-x-2">
							<Switch
								id="active"
								checked={newAvaliation.active}
								onCheckedChange={(checked) =>
									setNewAvaliation({ ...newAvaliation, active: checked })
								}
							/>
							<Label htmlFor="active">Ativo</Label>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setCreateDialogOpen(false)}
						>
							Cancelar
						</Button>
						<Button onClick={handleCreateAvaliation}>Salvar</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
