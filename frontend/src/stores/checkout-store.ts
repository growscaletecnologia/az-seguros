import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";
// ajuste esse tipo se o seu QuoteResponse tiver diferenças
import type { QuoteResponse } from "@/services/quote.service";

export type CheckoutFormSnapshot = {
  destination: string;
  departure: string; // "YYYY-MM-DD"
  arrival: string;   // "YYYY-MM-DD"
  passengers: number;
  coupon?: string | null;
};

type CheckoutState = {
  plan: QuoteResponse | null;
  form: CheckoutFormSnapshot | null;
  setCheckout: (data: { plan: QuoteResponse; form: CheckoutFormSnapshot }) => void;
  reset: () => void;
};

export const checkoutStore = createStore<CheckoutState>()(
  persist(
    (set) => ({
      plan: null,
      form: null,
      setCheckout: ({ plan, form }) => set({ plan, form }),
      reset: () => set({ plan: null, form: null }),
    }),
    {
      name: "checkout-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// hook
import { useStore } from "zustand";
export function useCheckout() {
  return useStore(checkoutStore);
}
