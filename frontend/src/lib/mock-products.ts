export interface ProductDetail {
	id: string;
	label: string;
	value: string;
	icon?: string;
}

export interface Product {
	id: number;
	seguradora: string;
	plano: string;
	preco: number;
	precoOriginal: number;
	coberturaMedica: number;
	coberturaBagagem: number;
	coberturaCancelamento: number;
	coberturaPandemia: boolean;
	coberturaPraticaEsportiva: boolean;
	avaliacoes: number;
	totalAvaliacoes: number;
	destaque: string;
	beneficios: string[];
	detalhes: ProductDetail[];
}

export const mockProducts: Product[] = [
	{
		id: 1,
		seguradora: "ITA",
		plano: "ITA 150 Europa +Telemedicina Albert Einstein",
		preco: 285.54,
		precoOriginal: 300.57,
		coberturaMedica: 150000,
		coberturaBagagem: 1000,
		coberturaCancelamento: 5000,
		coberturaPandemia: true,
		coberturaPraticaEsportiva: true,
		avaliacoes: 4.8,
		totalAvaliacoes: 1247,
		destaque: "Mais Vendido",
		beneficios: [
			"Cobertura COVID-19",
			"Telemedicina Albert Einstein",
			"Cancelamento de viagem",
			"Prática de esportes",
		],
		detalhes: [
			{ id: "emissao_viagem", label: "Permite emissão em viagem?", value: "NÃO" },
			{ id: "validade_geografica", label: "Validade Geográfica", value: "EUROPA" },
			{ id: "franquia_dmh", label: "Franquia de DMH", value: "NÃO" },
			{
				id: "despesa_medica_total",
				label: "Despesa Médica Hospitalar Total",
				value: "USD 150.000",
			},
			{
				id: "despesa_medica_hospitalar",
				label: "Despesa Médica Hospitalar",
				value: "USD 150.000",
			},
			{
				id: "cobertura_esportes",
				label: "Cobertura Médica para Prática de Esportes",
				value: "USD 10.000",
			},
			{
				id: "cobertura_gestante",
				label: "Cobertura Médica para Gestante",
				value: "USD 30.000",
			},
			{ id: "telemedicina", label: "Telemedicina", value: "SIM" },
			{ id: "cobertura_odontologica", label: "Cobertura Odontológica", value: "USD 1.000" },
		],
	},
	{
		id: 2,
		seguradora: "Intermac",
		plano: "Intermac Promocional I60 Europa +Covid-19",
		preco: 169.66,
		precoOriginal: 178.59,
		coberturaMedica: 60000,
		coberturaBagagem: 800,
		coberturaCancelamento: 3000,
		coberturaPandemia: true,
		coberturaPraticaEsportiva: false,
		avaliacoes: 4.6,
		totalAvaliacoes: 892,
		destaque: "Melhor Preço",
		beneficios: [
			"Cobertura COVID-19",
			"Atendimento em português",
			"Cancelamento de viagem",
			"Regresso sanitário",
		],
		detalhes: [
			{
				id: "emissao_viagem",
				label: "Permite emissão em viagem?",
				value: "SIM, VERIFICAR CARÊNCIA PARA O INÍCIO DA VIAGEM",
			},
			{
				id: "validade_geografica",
				label: "Validade Geográfica",
				value: "INTERNACIONAL EXCETO EUA E CANADÁ",
			},
			{ id: "franquia_dmh", label: "Franquia de DMH", value: "NÃO" },
			{
				id: "despesa_medica_total",
				label: "Despesa Médica Hospitalar Total",
				value: "USD 60.000",
			},
			{
				id: "despesa_medica_hospitalar",
				label: "Despesa Médica Hospitalar",
				value: "USD 60.000",
			},
			{
				id: "cobertura_esportes",
				label: "Cobertura Médica para Prática de Esportes",
				value: "DENTRO DMH",
			},
			{
				id: "cobertura_gestante",
				label: "Cobertura Médica para Gestante",
				value: "DENTRO DMH - ATÉ 28 SEMANAS",
			},
			{ id: "telemedicina", label: "Telemedicina", value: "-" },
			{ id: "cobertura_odontologica", label: "Cobertura Odontológica", value: "USD 500" },
		],
	},
];

export const getProductById = (id: number): Product | undefined => {
	return mockProducts.find((product) => product.id === id);
};

export const getProductsForComparison = (ids: number[]): Product[] => {
	return mockProducts.filter((product) => ids.includes(product.id));
};
