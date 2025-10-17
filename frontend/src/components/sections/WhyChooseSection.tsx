"use client";

import {
	type FrontSection,
	frontSectionsService,
} from "@/services/frontsections.service";
import {
	Car,
	CheckCircle,
	Clock,
	Cog,
	Compass,
	DollarSign,
	Gift,
	Globe,
	Heart,
	type LucideIcon,
	MapPin,
	Navigation,
	Package,
	Plane,
	Rocket,
	Settings,
	Shield,
	Ship,
	Sparkles,
	Star,
	//Tool,
	Target,
	Train,
	Users,
	Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Mapeamento de nomes de ícones para componentes Lucide React
 * Baseado na lista de ícones disponíveis no DTO do backend
 */
const iconMap: Record<string, LucideIcon> = {
	// Ícones financeiros
	DollarSign,

	// Ícones de tempo
	Clock,

	// Ícones de segurança
	Shield,

	// Ícones de pessoas
	Users,

	// Ícones de avaliação
	Star,
	Heart,
	CheckCircle,

	// Ícones de localização e viagem
	Globe,
	MapPin,
	Plane,
	Car,
	Train,
	Ship,
	Compass,
	Navigation,

	// Outros ícones úteis
	Settings,
	Cog,
	Wrench,
	//Tool,
	Target,
	Package,
	Gift,
	Sparkles,
	Rocket,
};

/**
 * Mapeamento de cores para classes CSS do Tailwind
 */
const colorMap: Record<string, { bg: string; bgHover: string; text: string }> =
	{
		blue: {
			bg: "bg-blue-100",
			bgHover: "group-hover:bg-blue-200",
			text: "text-blue-600",
		},
		green: {
			bg: "bg-green-100",
			bgHover: "group-hover:bg-green-200",
			text: "text-green-600",
		},
		orange: {
			bg: "bg-orange-100",
			bgHover: "group-hover:bg-orange-200",
			text: "text-orange-600",
		},
		red: {
			bg: "bg-red-100",
			bgHover: "group-hover:bg-red-200",
			text: "text-red-600",
		},
		purple: {
			bg: "bg-purple-100",
			bgHover: "group-hover:bg-purple-200",
			text: "text-purple-600",
		},
		yellow: {
			bg: "bg-yellow-100",
			bgHover: "group-hover:bg-yellow-200",
			text: "text-yellow-600",
		},
		pink: {
			bg: "bg-pink-100",
			bgHover: "group-hover:bg-pink-200",
			text: "text-pink-600",
		},
		gray: {
			bg: "bg-gray-100",
			bgHover: "group-hover:bg-gray-200",
			text: "text-gray-600",
		},
	};

interface WhyChooseSectionProps {
	title?: string;
	subtitle?: string;
	className?: string;
}

/**
 * Componente da seção "Por que escolher"
 * Consome dados dinâmicos do backend via API
 */
export function WhyChooseSection({
	title = "Por que escolher a SeguroViagem?",
	subtitle = "Somos a plataforma líder em seguros de viagem no Brasil, com mais de 1 milhão de clientes satisfeitos.",
	className = "",
}: WhyChooseSectionProps) {
	const [sections, setSections] = useState<FrontSection[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	/**
	 * Carrega as seções ativas do backend
	 */
	useEffect(() => {
		const loadSections = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await frontSectionsService.getPublicSections();

				// Ordena as seções pela propriedade 'order'
				const sortedSections = data.sort((a, b) => a.order - b.order);
				setSections(sortedSections);
			} catch (err) {
				console.error("Erro ao carregar seções:", err);
				//setError('Erro ao carregar informações. Tente novamente mais tarde.');

				// Fallback para dados estáticos em caso de erro
				setSections([
					{
						id: "1",
						title: "Melhor Preço",
						description:
							"Garantimos o melhor preço do mercado ou devolvemos a diferença.",
						icon: "DollarSign",
						bgColor: "orange",
						order: 1,
						status: "ACTIVE" as any,
						createdAt: "",
						updatedAt: "",
					},
					{
						id: "2",
						title: "Suporte 24h",
						description:
							"Atendimento especializado 24 horas por dia, 7 dias por semana.",
						icon: "Clock",
						bgColor: "red",
						order: 2,
						status: "ACTIVE" as any,
						createdAt: "",
						updatedAt: "",
					},
					{
						id: "3",
						title: "Compra Segura",
						description:
							"Transações 100% seguras com certificado SSL e criptografia.",
						icon: "Shield",
						bgColor: "blue",
						order: 3,
						status: "ACTIVE" as any,
						createdAt: "",
						updatedAt: "",
					},
					{
						id: "4",
						title: "+1M Clientes",
						description:
							"Mais de 1 milhão de viajantes já confiaram em nossos serviços.",
						icon: "Users",
						bgColor: "purple",
						order: 4,
						status: "ACTIVE" as any,
						createdAt: "",
						updatedAt: "",
					},
				]);
			} finally {
				setLoading(false);
			}
		};

		loadSections();
	}, []);

	/**
	 * Renderiza o ícone baseado no nome
	 */
	const renderIcon = (iconName: string, colorClasses: string) => {
		const IconComponent = iconMap[iconName] || DollarSign; // Fallback para DollarSign
		return <IconComponent className={`h-8 w-8 ${colorClasses}`} />;
	};

	/**
	 * Obtém as classes de cor baseado no nome da cor
	 */
	const getColorClasses = (colorName: string) => {
		return colorMap[colorName] || colorMap.blue; // Fallback para azul
	};

	if (loading) {
		return (
			<section className={`py-16 bg-gray-50 ${className}`}>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<div className="h-8 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse"></div>
						<div className="h-6 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="text-center">
								<div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
								<div className="h-6 bg-gray-200 rounded w-24 mx-auto mb-2 animate-pulse"></div>
								<div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className={`py-16 bg-gray-50 ${className}`}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
						{title}
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
				</div>

				{error && (
					<div className="text-center mb-8">
						<p className="text-red-600 bg-red-50 p-4 rounded-lg inline-block">
							{error}
						</p>
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{sections.map((section) => {
						const colorClasses = getColorClasses(section.bgColor);

						return (
							<div key={section.id} className="text-center group">
								<div
									className={`${colorClasses.bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${colorClasses.bgHover} transition-colors`}
								>
									{renderIcon(section.icon, colorClasses.text)}
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-2">
									{section.title}
								</h3>
								<p className="text-gray-600">{section.description}</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
