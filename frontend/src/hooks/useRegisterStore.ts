import { preRegisterFormStore } from "@/stores/preregister-form-store";
// hooks/usePreRegisterForm.ts
import { useStore } from "zustand";

export function usePreRegisterForm() {
	return useStore(preRegisterFormStore);
}
