import type { DateRange } from "react-day-picker";

enum insurerEnum {
	hero = "hero",
	mta = "mta",
}
export interface SecurityIntegration {
	id?: string;
	insurerName: string;
	insurerCode: "mta" | "hero" | "";
	baseUrl: string;
	authUrl: string;
	grantType: "password" | "client_credentials" | "authorization_code";
	clientId: number;
	clientSecret: string;
	username: string;
	password: string;
	scope?: string | null;
	ativa: boolean;
	markUp?: number | null;
}

export interface PreRegisterForm {
	name: string;
	email: string;
	phone: string;
	range: DateRange | undefined;
	passengers: string;
	destination: string;
	step?: number;
	coupon?: string;
	term?: boolean;
}


export interface PlanInfo {
  code: number
  name: string
  slug: string

  provider_code: string
  provider_name: string
  provider_terms_url: string | null

  totalPrice: number
  totalPriceWithPixDiscount: number
  dolar: number
  currency: 'BRL' | 'USD' | 'EUR' | string // pode adaptar se usar enum
  days: number
  passengers: number

  ageGroups: PlanAgeGroup[]
  benefits: PlanBenefit[]

  destination: string
  departure: string // ou Date, dependendo de como manipula no backend
  arrival: string // idem
}

export interface PlanAgeGroup {
  start: number
  end: number
  price: number
  priceIof: number
  totalGroupValue: number
}

export interface PlanBenefit {
  id: number
  code: number
  category_name: string
  name: string
  long_description: string | null
}


export interface PreRegisterForm {
  name?: string;
  email?: string;
  phone?: string;
  destination: string;
  range?: { from: Date; to: Date };
  passengers: string | number;
  step?: number;
  coupon?: string;
  term?: boolean;
}
