"use client";

import {
	Menu,
	Phone,
	Settings,
	Settings2,
	Shield,
	User,
	X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<header className="bg-white shadow-lg fixed w-full top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-2">
						<Shield className="h-8 w-8 text-blue-600" />
						<span className="text-xl font-bold text-gray-900">
							Seguro Viagem
						</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-8">
						<Link
							href="/planos"
							className="text-gray-700 hover:text-blue-600 font-medium"
						>
							Seguro Viagem
						</Link>
						<Link
							href="/ajuda"
							className="text-gray-700 hover:text-blue-600 font-medium"
						>
							FAQ
						</Link>
						<Link
							href="/ajuda"
							className="text-gray-700 hover:text-blue-600 font-medium"
						>
							Ajuda
						</Link>
						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-1 text-green-600">
								<Phone className="h-4 w-4" />
								<span className="text-sm font-medium">0800 123 4567</span>
							</div>
							<Link
								href="/cliente"
								className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
							>
								<User className="h-4 w-4" />
								<span>Entrar</span>
							</Link>

							<Link
								href="/entrar"
								className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
							>
								<Settings className="h-4 w-4" />
								<span>Admin</span>
							</Link>
						</div>
					</nav>

					{/* Mobile menu button */}
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600"
					>
						{isMenuOpen ? (
							<X className="h-6 w-6" />
						) : (
							<Menu className="h-6 w-6" />
						)}
					</button>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className="md:hidden py-4 border-t border-gray-200">
						<div className="flex flex-col space-y-4">
							<Link
								href="/planos"
								className="text-gray-700 hover:text-blue-600 font-medium"
							>
								Seguro Viagem
							</Link>
							<Link
								href="/seguradoras"
								className="text-gray-700 hover:text-blue-600 font-medium"
							>
								Seguradoras
							</Link>
							<Link
								href="/ajuda"
								className="text-gray-700 hover:text-blue-600 font-medium"
							>
								Ajuda
							</Link>
							<div className="flex items-center space-x-1 text-green-600">
								<Phone className="h-4 w-4" />
								<span className="text-sm font-medium">0800 123 4567</span>
							</div>
							<Link
								href="/cliente"
								className="flex items-center justify-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
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
