import { NormalizedPlan } from './normalized-plan.dto';

export interface QuoteResponse {
  meta: {
    requestId: string;
    destination: string;
    days: number;
    passengers: number;
    averageAge: number;
    ageGroup: string;
    insurers: {
      total: number;
      successful: number;
      failed: number;
    };
    timing: {
      total: number;
      cache: number;
      external: number;
    };
    preview?: boolean;
  };
  plans: NormalizedPlan[];
}