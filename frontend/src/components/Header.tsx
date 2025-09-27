"use client";

import {
	LogOut,
	Menu,
	Phone,
	Settings,
	Shield,
	User,
	X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthService from "@/lib/services/auth-service";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
	const router = useRouter();

	// Verificar autenticação quando o componente montar
	useEffect(() => {
		const checkAuth = () => {
			const isAuth = AuthService.isAuthenticated();
			setIsAuthenticated(isAuth);
			
			if (isAuth) {
				const userData = AuthService.getUser();
				setUser(userData);
			}
		};

		checkAuth();
		// Adicionar um listener para mudanças no localStorage
		window.addEventListener("storage", checkAuth);
		
		return () => {
			window.removeEventListener("storage", checkAuth);
		};
	}, []);

	// Função para fazer logout
	const handleLogout = () => {
		AuthService.logout();
		setIsAuthenticated(false);
		setUser(null);
		router.push("/");
	};

	// Função para gerar as iniciais do nome do usuário
	const getUserInitials = () => {
		if (!user || !user.name) return "U";
		
		const nameParts = user.name.split(" ");
		if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
		
		return (
			nameParts[0].charAt(0).toUpperCase() + 
			nameParts[nameParts.length - 1].charAt(0).toUpperCase()
		);
	};

	return (
		<header className="bg-white shadow-lg fixed w-full top-0 z-50">
			<div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-14 sm:h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-1 sm:space-x-2">
						<Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
						<span className="text-lg sm:text-xl font-bold text-gray-900 truncate">
							Seguro Viagem
						</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
						<Link
							href="/planos"
							className="text-gray-700 hover:text-blue-600 font-medium text-sm lg:text-base"
						>
							Seguro Viagem
						</Link>
						<Link
							href="/faq"
							className="text-gray-700 hover:text-blue-600 font-medium text-sm lg:text-base"
						>
							FAQ
						</Link>
						<Link
							href="/ajuda"
							className="text-gray-700 hover:text-blue-600 font-medium text-sm lg:text-base"
						>
							Ajuda
						</Link>
						<div className="flex items-center space-x-2 lg:space-x-4">
							<div className="hidden lg:flex items-center space-x-1 text-green-600">
								<Phone className="h-4 w-4" />
								<span className="text-sm font-medium">0800 123 4567</span>
							</div>
							
							{isAuthenticated && user ? (
								<DropdownMenu>
									<DropdownMenuTrigger className="flex items-center justify-center h-9 w-9 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
										{getUserInitials()}
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-56">
										<DropdownMenuLabel>
											<div className="flex flex-col">
												<span className="font-medium">{user.name}</span>
												<span className="text-xs text-gray-500">{user.email}</span>
											</div>
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										
										{user.role === "CUSTOMER" ? (
											<>
												<DropdownMenuItem asChild>
													<Link href="/cliente" className="cursor-pointer w-full">
														<User className="mr-2 h-4 w-4" />
														<span>Área do Cliente</span>
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<Link href="/cliente/seguros" className="cursor-pointer w-full">
														<Shield className="mr-2 h-4 w-4" />
														<span>Meus Seguros</span>
													</Link>
												</DropdownMenuItem>
											</>
										) : (
											<DropdownMenuItem asChild>
												<Link href="/admin/painel" className="cursor-pointer w-full">
													<Settings className="mr-2 h-4 w-4" />
													<span>Área Administrativa</span>
												</Link>
											</DropdownMenuItem>
										)}
										
										<DropdownMenuSeparator />
										<DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
											<LogOut className="mr-2 h-4 w-4" />
											<span>Sair</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<Link
									href="/entrar"
									className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
								>
									<User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
									<span>Entrar</span>
								</Link>
							)}
						</div>
					</nav>

					{/* Mobile menu button */}
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="md:hidden p-1.5 sm:p-2 rounded-md text-gray-700 hover:text-blue-600"
						aria-label="Menu"
					>
						{isMenuOpen ? (
							<X className="h-5 w-5 sm:h-6 sm:w-6" />
						) : (
							<Menu className="h-5 w-5 sm:h-6 sm:w-6" />
						)}
					</button>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className="md:hidden py-3 sm:py-4 border-t border-gray-200">
						<div className="flex flex-col space-y-3 sm:space-y-4">
							<Link
								href="/planos"
								className="text-gray-700 hover:text-blue-600 font-medium px-1 py-1"
								onClick={() => setIsMenuOpen(false)}
							>
								Seguro Viagem
							</Link>
							<Link
								href="/faq"
								className="text-gray-700 hover:text-blue-600 font-medium px-1 py-1"
								onClick={() => setIsMenuOpen(false)}
							>
								FAQ
							</Link>
							<Link
								href="/ajuda"
								className="text-gray-700 hover:text-blue-600 font-medium px-1 py-1"
								onClick={() => setIsMenuOpen(false)}
							>
								Ajuda
							</Link>
							
							{/* Opções de usuário no menu mobile */}
							{isAuthenticated && user ? (
								<>
									<div className="pt-2 pb-1">
										<div className="flex items-center px-1">
											<div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white mr-2">
												{getUserInitials()}
											</div>
											<div className="flex flex-col">
												<span className="font-medium text-sm">{user.name}</span>
												<span className="text-xs text-gray-500">{user.email}</span>
											</div>
										</div>
									</div>
									<div className="border-t border-gray-100 my-2"></div>
									
									{user.role === "CUSTOMER" ? (
										<>
											<Link
												href="/cliente"
												className="flex items-center text-gray-700 hover:text-blue-600 font-medium px-1 py-1"
												onClick={() => setIsMenuOpen(false)}
											>
												<User className="h-4 w-4 mr-2" />
												Área do Cliente
											</Link>
											<Link
												href="/cliente/seguros"
												className="flex items-center text-gray-700 hover:text-blue-600 font-medium px-1 py-1"
												onClick={() => setIsMenuOpen(false)}
											>
												<Shield className="h-4 w-4 mr-2" />
												Meus Seguros
											</Link>
										</>
									) : (
										<Link
											href="/admin/painel"
											className="flex items-center text-gray-700 hover:text-blue-600 font-medium px-1 py-1"
											onClick={() => setIsMenuOpen(false)}
										>
											<Settings className="h-4 w-4 mr-2" />
											Área Administrativa
										</Link>
									)}
									
									<button
										onClick={() => {
											handleLogout();
											setIsMenuOpen(false);
										}}
										className="flex items-center text-red-600 hover:text-red-700 font-medium px-1 py-1 w-full text-left"
									>
										<LogOut className="h-4 w-4 mr-2" />
										Sair
									</button>
								</>
							) : (
								<Link
									href="/entrar"
									className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm w-full mt-2"
									onClick={() => setIsMenuOpen(false)}
								>
									<User className="h-3.5 w-3.5" />
									<span>Entrar</span>
								</Link>
							)}
							<div className="flex items-center space-x-1 text-green-600 px-1 py-1">
								<Phone className="h-4 w-4" />
								<span className="text-sm font-medium">0800 123 4567</span>
							</div>
							<Link
								href="/entrar"
								className="flex items-center justify-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
								onClick={() => setIsMenuOpen(false)}
							>
								<User className="h-4 w-4" />
								<span>Entrar</span>
							</Link>
						</div>
					</div>
				)}
			</div>
		</header>
	);
}
