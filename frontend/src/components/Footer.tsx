import {
	Facebook,
	Instagram,
	Mail,
	MapPin,
	Phone,
	Shield,
	Twitter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
	return (
		<footer className="bg-slate-800 dark:bg-gray-900 text-white">
			<div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
					{/* Logo e Descrição */}
					{/* <div className="col-span-1 md:col-span-2">
						<div className="flex items-center space-x-2 mb-4">
							<Shield className="h-8 w-8 text-blue-400" />
							<span className="text-xl font-bold">SeguroViagem</span>
						</div>
						<p className="text-gray-300 mb-4 max-w-md">
							A melhor plataforma para comparar e contratar seguros de viagem.
							Proteção completa para suas aventuras pelo mundo.
						</p>
						<div className="flex space-x-4">
							<Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
							<Instagram className="h-5 w-5 text-gray-400 hover:text-pink-400 cursor-pointer" />
							<Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
						</div>
					</div> */}

					{/*Formas de pagamento*/}
					<div className="flex flex-col items-center">
						<h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Formas de Pagamento</h3>
						<div className="flex flex-row gap-2 justify-center items-center">
							<Image
								alt="Cartão de Crédito"
								width={300}
								height={30}
								className="w-auto h-6 sm:h-8"
								src={"/cards-footer-icon.svg"}
							/>
							<Image
								alt="Pix"
								width={80}
								height={30}
								className="w-auto h-6 sm:h-8"
								src={"/pix-footer-icon.svg"}
							/>
							<Image
								alt="Boleto"
								width={40}
								height={30}
								className="w-auto h-6 sm:h-8"
								src={"/boleto-footer-icon.svg"}
							/>
						</div>
					</div>

					{/* Contato */}
					<div className="flex flex-col items-center w-full">
						<h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contato</h3>
						<div className="flex flex-col items-center">
							<ul className="space-y-2">
								<li className="flex items-center space-x-2">
									<Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-400" />
									<span className="text-xs sm:text-sm text-gray-300">0800 123 4567</span>
								</li>
								<li className="flex items-center space-x-2">
									<Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400" />
									<span className="text-xs sm:text-sm text-gray-300">
										contato@seguroviagem.com
									</span>
								</li>
								<li className="flex items-center space-x-2">
									<MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400" />
									<span className="text-xs sm:text-sm text-gray-300">São Paulo, SP</span>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
						<div className="flex flex-row items-center gap-1 sm:gap-2">
							<p className="text-xs sm:text-sm">Desenvolvido com ❤️ por </p>
							<a
								href="https://growscale.com.br/"
								target="_blank"
								rel="noreferrer"
							>
								<Image
									alt="logo-grow"
									width={80}
									height={40}
									className="w-20 sm:w-24 h-auto"
									src={"/logo-grow&scale.svg"}
								></Image>
							</a>
						</div>
						<p className="text-white text-xs sm:text-sm">
							© 2025 Seguro Viagem. Todos os direitos reservados.
						</p>
						<div className="flex space-x-4 sm:space-x-6">
							<Link
								href="/politicas"
								className="text-white hover:text-white text-xs sm:text-sm transition-colors"
							>
								Política de Privacidade
							</Link>
							<Link
								href="/termos"
								className="text-white hover:text-white text-xs sm:text-sm transition-colors"
							>
								Termos de Uso
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
