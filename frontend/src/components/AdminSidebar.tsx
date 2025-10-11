"use client";
import {
	Activity,
	BookImage,
	BookKey,
	ChevronDown,
	ChevronRight,
	FileText,
	Fingerprint,
	Globe,
	LayoutDashboard,
	Link2,
	LogOut,
	Menu,
	MessageSquareQuote,
	Settings,
	ShoppingCart,
	Tag,
	UserRoundSearch,
	Users,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useState } from "react";

interface SidebarItem {
	id: string;
	label: string;
	href: string;
	icon: React.ReactNode;
	badge?: string;
}

const AdminSidebar = () => {
	const pathname = usePathname();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isMobileOpen, setIsMobileOpen] = useState(false);

	const sidebarItems: SidebarItem[] = [
		{
			id: "dashboard",
			label: "Dashboard",
			href: "/admin/painel",
			icon: <LayoutDashboard className="h-5 w-5" />,
		},
		{
			id: "usuarios",
			label: "Usuários",
			href: "/admin/usuarios",
			icon: <UserRoundSearch className="h-5 w-5" />,
		},
		{
			id: "clientes",
			label: "Clientes",
			href: "/admin/clientes",
			icon: <Users className="h-5 w-5" />,
		},
		{
			id: "cupons",
			label: "Cupons de Desconto",
			href: "/admin/cupons",
			icon: <Tag className="h-5 w-5" />,
		},
		// { xablau
		// 	id: "pedidos", xablaue
		// 	label: "Área de Pedidos", xablau 
		// 	href: "/admin/pedidos",
		// 	icon: <ShoppingCart className="h-5 w-5" />,
		// },
		{
			id: "blog",
			label: "Publicações (Blog)",
			href: "/admin/blog",
			icon: <BookImage className="h-5 w-5" />,
		},
		{
			id: "avaliacoes",
			label: "Avaliações",
			href: "/admin/avaliacoes",
			icon: <MessageSquareQuote className="h-5 w-5" />,
		},
		// {
		// 	id: "rbac",
		// 	label: "Perfis de Acesso",
		// 	href: "/admin/rbac",
		// 	icon: <Fingerprint className="h-5 w-5" />,
		// },
		{
			id: "conteudos",
			label: "Gestão do Sistema",
			href: "/admin/conteudos",
			icon: <BookKey className="h-5 w-5" />,
		},
	
		// {
		// 	id: "integrations",
		// 	label: "Integrações",
		// 	href: "/admin/integrations",
		// 	icon: <Globe className="h-5 w-5" />,
		// },

		{
			id: "logs",
			label: "Atividades do Sistema",
			href: "/admin/logs",
			icon: <Activity className="h-5 w-5" />,
		},
		{
			id: "activities",
			label: "Integração Seguradoras",
			href: "/admin/integrations",
			icon: <Link2 className="h-5 w-5" />,
		},

		{
			id: "configuracoes",
			label: "Configurações",
			href: "/admin/configuracoes",
			icon: <Settings className="h-5 w-5" />,
		},
	];

	const isActiveRoute = (href: string) => {
		return pathname === href;
	};

	const handleLogout = () => {
		// Simular logout
		alert("Logout realizado com sucesso!");
		window.location.href = "/entrar";
	};

	return (
		<>
			{/* Mobile menu button */}
		<div className="lg:hidden fixed top-20 left-4 z-40">
			<button
				onClick={() => setIsMobileOpen(!isMobileOpen)}
				className="p-2 bg-white rounded-lg shadow-md border"
			>
				{isMobileOpen ? (
					<X className="h-5 w-5" />
				) : (
					<Menu className="h-5 w-5" />
				)}
			</button>
		</div>

		{/* Mobile overlay */}
		{isMobileOpen && (
			<div
				className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
				onClick={() => setIsMobileOpen(false)}
			/>
		)}

		{/* Sidebar */}
		<div
			className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-lg z-40 transition-all duration-300
        ${isCollapsed ? "w-16" : "w-64"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
		>
				{/* Header */}
				<div className="p-2">
					<div className="flex items-center justify-between">
						{/* {!isCollapsed && (
							<div className="flex items-center space-x-2">
								<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
									<span className="text-white font-bold text-sm">SP</span>
								</div>
								<span className="font-semibold text-gray-900">
									Seguros Promo
								</span>
							</div>
						)} */}
						{/* <button
							onClick={() => setIsCollapsed(!isCollapsed)}
							className="hidden lg:block p-1 hover:bg-gray-100 rounded"
						>
							{isCollapsed ? (
								<ChevronRight className="h-4 w-4" />
							) : (
								<ChevronDown className="h-4 w-4" />
							)}
						</button> */}
					</div>
				</div>

				{/* Navigation */}
				<nav className="flex-1 p-4">
					<div className="space-y-2">
						{sidebarItems.map((item) => (
							<Link
								key={item.id}
								href={item.href}
								onClick={() => setIsMobileOpen(false)}
								className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                  ${
										isActiveRoute(item.href)
											? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
											: "text-gray-700 hover:bg-gray-100"
									}
                `}
							>
								<span
									className={`${isActiveRoute(item.href) ? "text-blue-700" : "text-gray-500"}`}
								>
									{item.icon}
								</span>
								{!isCollapsed && (
									<>
										<span className="font-medium">{item.label}</span>
										{item.badge && (
											<span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
												{item.badge}
											</span>
										)}
									</>
								)}
							</Link>
						))}
					</div>
				</nav>

				{/* Footer */}
				<div className="p-4 border-t border-gray-200">
					<button
						onClick={handleLogout}
						className={`
              flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors w-full
              text-gray-700 hover:bg-red-50 hover:text-red-700
            `}
					>
						<LogOut className="h-5 w-5" />
						{!isCollapsed && <span className="font-medium">Sair</span>}
					</button>
				</div>
			</div>

			{/* Main content spacer */}
			<div
				className={`${isCollapsed ? "lg:ml-16" : "lg:ml-64"} transition-all duration-300`}
			>
				{/* This div pushes the main content to the right */}
			</div>
		</>
	);
};

export default AdminSidebar;
