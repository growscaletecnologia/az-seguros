"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { type Profile, profilesService } from "@/services/profiles.service";
import {
	Eye,
	MoreHorizontal,
	Pencil,
	Plus,
	Search,
	Trash2,
	UserCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfilesPage() {
	const router = useRouter();
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
	const pageSize = 10;

	// Carregar perfis
	const loadProfiles = async () => {
		try {
			setLoading(true);
			const response = await profilesService.getProfiles({
				page: currentPage,
				limit: pageSize,
				search: searchTerm,
			});

			setProfiles(response.data);
			setTotalPages(Math.ceil(response.total / pageSize));
		} catch (error) {
			console.error("Erro ao carregar perfis:", error);
			toast.error("Não foi possível carregar os perfis");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadProfiles();
	}, [currentPage, searchTerm]);

	// Manipuladores de eventos
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setCurrentPage(1); // Resetar para a primeira página ao buscar
		loadProfiles();
	};

	const handleDeleteClick = (id: string) => {
		setProfileToDelete(id);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (!profileToDelete) return;

		try {
			await profilesService.deleteProfile(profileToDelete);
			toast.success("Perfil excluído com sucesso");
			loadProfiles();
		} catch (error) {
			console.error("Erro ao excluir perfil:", error);
			toast.error("Erro ao excluir perfil");
		} finally {
			setDeleteDialogOpen(false);
			setProfileToDelete(null);
		}
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	// Renderizar páginas de paginação
	const renderPaginationItems = () => {
		const items = [];
		const maxVisiblePages = 5;

		let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
		const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

		if (endPage - startPage + 1 < maxVisiblePages) {
			startPage = Math.max(1, endPage - maxVisiblePages + 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			items.push(
				<PaginationItem key={i}>
					<PaginationLink
						onClick={() => handlePageChange(i)}
						isActive={currentPage === i}
					>
						{i}
					</PaginationLink>
				</PaginationItem>,
			);
		}

		return items;
	};

	return (
		<div className="container mx-auto py-6">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-2xl font-bold">
								Perfis de Acesso
							</CardTitle>
							<CardDescription>
								Gerencie os perfis de acesso do sistema
							</CardDescription>
						</div>
						<Button onClick={() => router.push("/admin/profiles/new")}>
							<Plus className="mr-2 h-4 w-4" />
							Novo Perfil
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{/* Barra de busca */}
					<form onSubmit={handleSearch} className="flex gap-2 mb-6">
						<Input
							placeholder="Buscar perfis..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="max-w-md"
						/>
						<Button type="submit" variant="outline">
							<Search className="h-4 w-4" />
						</Button>
					</form>

					{/* Tabela de perfis */}
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Nome</TableHead>
									<TableHead>Data de Criação</TableHead>
									<TableHead>Última Atualização</TableHead>
									<TableHead className="text-right">Ações</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{loading ? (
									<TableRow>
										<TableCell colSpan={4} className="text-center py-10">
											Carregando...
										</TableCell>
									</TableRow>
								) : profiles.length === 0 ? (
									<TableRow>
										<TableCell colSpan={4} className="text-center py-10">
											Nenhum perfil encontrado
										</TableCell>
									</TableRow>
								) : (
									profiles.map((profile) => (
										<TableRow key={profile.id}>
											<TableCell className="font-medium">
												{profile.name}
											</TableCell>
											<TableCell>{formatDate(profile.createdAt)}</TableCell>
											<TableCell>{formatDate(profile.updatedAt)}</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="icon">
															<MoreHorizontal className="h-4 w-4" />
															<span className="sr-only">Abrir menu</span>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={() =>
																router.push(`/admin/profiles/${profile.id}`)
															}
														>
															<Pencil className="mr-2 h-4 w-4" />
															Editar
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleDeleteClick(profile.id)}
															className="text-red-600"
														>
															<Trash2 className="mr-2 h-4 w-4" />
															Excluir
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>

					{/* Paginação */}
					{totalPages > 1 && (
						<div className="mt-4 flex justify-center">
							<Pagination>
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious
											onClick={() =>
												handlePageChange(Math.max(1, currentPage - 1))
											}
											disabled={currentPage === 1}
										/>
									</PaginationItem>

									{renderPaginationItems()}

									<PaginationItem>
										<PaginationNext
											onClick={() =>
												handlePageChange(Math.min(totalPages, currentPage + 1))
											}
											disabled={currentPage === totalPages}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Diálogo de confirmação de exclusão */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
						<AlertDialogDescription>
							Tem certeza que deseja excluir este perfil? Esta ação não pode ser
							desfeita.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							className="bg-red-600 hover:bg-red-700"
						>
							Excluir
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
