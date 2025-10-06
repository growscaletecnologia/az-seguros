export interface NormalizedPlan {
  id: string;
  insurer: string;
  name: string;
  price: number;
  currency: string;
  destination: string;
  coverage: {
    medical: number;
    baggage?: number;
    covid?: boolean;
  };
  days: number;
  markupApplied: boolean;
}