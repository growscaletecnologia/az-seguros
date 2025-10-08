export interface NormalizedPlan {
  name: string;
  slug: string;
  group: string;
  currency: string;
  is: string;
  is_receptive: number;
  is_travel_extension: number;
  is_default: number;
  min_days_qtd: number;
  min_passengers_qtd: number;
  categories: any[]; // Pode ser ajustado para um tipo mais específico se necessário
  can_show_local_currency: number;
  locate_currency: string;
  plan_id: number;
  price: string;
  price_with_markup?: string;
  price_raw: string;
  price_to_calc: string;
  price_to_calc_raw: string;
  price_to_calc_currency_bill: string;
  cocation_usd: string;
  cocation_usd_raw: string;
  cocation_eur: string;
  cocation_eur_raw: string;
  days: number;
  additional_id: number;
  currency_bill: string;
  coverages: Coverage[];
}

export interface Coverage {
  is: string;
  coverage_type: string;
  coverage: CoverageDetails;
}

export interface CoverageDetails {
  id: number;
  title: string;
  name: string;
  slug: string;
  highlight: string;
  content: string;
  display_order: number;
}