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
							<Link
								href="/entrar"
								className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
							>
								<User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
								<span>Entrar</span>
							</Link>
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
