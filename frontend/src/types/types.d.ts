import type { DateRange } from "react-day-picker";

enum insurerEnum{
  hero = "hero",
  mta = "mta"
}
export interface SecurityIntegration {
  id?:string;
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
