import { api } from "@/lib/api";

/** ====== DTOs oficiais da UI ====== */

export interface Passenger {
	age: number;
}

export interface QuoteRequestDto {
	slug: string; // ex: "europa"
	departureDate: string; // YYYY-MM-DD
	returnDate: string; // YYYY-MM-DD
	passengers: Passenger[]; // [{ age: 21 }, ...]
	couponCode?: string;
}
export interface Coverage {
  id: number;
  title: string;
  value: string;          // ex: "1000,00"
  slug: string;           // identificador único (ex: "despesas-odontologicas")
  type: 'USD' | 'BRL' | 'INCLUSO'; // tipo de valor
  displayOrder: number;
}
export interface QuoteResponse {
	id: number;
	code: number;
	name: string;
	slug: string;
	provider_code: string;
	provider_name: string;
	provider_terms_url?: string;
	totalPrice: number;
	totalPriceWithPixDiscount: number;
	dolar: number;
	currency: string;
	days: number;
	passengers: number;
	ageGroups: QuoteAgeGroup[];
	benefits: QuoteBenefit[];
	coverages: Coverage[];
  	coverageHighlight: Coverage[];
	couponApplied?: boolean
}

export interface QuoteAgeGroup {
	start: number;
	end: number;
	price: string; // a API retorna string
	priceIof: string;
	totalGroupValue: number;
}

export interface QuoteBenefit {
	id: number;
	name: string;
	code: number;
}

/** ====== Tipos internos (retorno cru da API) ======
 * São usados só para mapear o response real -> QuoteResponse
 */
type ApiQuotePlan = {
	code: number;
	name: string;
	slug: string;
	provider_code: string;
	provider_name: string;
	totalPrice: number;
	currency: string;
	days: number;
	passengers: number;
	ageGroups: {
		start: number;
		end: number;
		price: string; // vem como string
		priceIof: string; // vem como string
	}[];
	benefits: { id: number; name: string }[];
};

export const QuoteService = {
	async calculate(data: QuoteRequestDto): Promise<QuoteResponse[]> {
		const payload = {
			dateFormat: "Y-m-d",
			multitrip: false,
			couponCode: data.couponCode ? data.couponCode : undefined,
			departure: data.departureDate,
			arrival: data.returnDate,
			slug: data.slug,
			priceDetails: true,
			passengers: data.passengers.map((p) => ({
				type: "age",
				age: String(p.age),
			})),
		};

		const response = await api.post<QuoteResponse[]>("/quotes", payload);
		return response.data;
	},
};
