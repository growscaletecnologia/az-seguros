import { preRegisterFormStore } from "@/stores/preregister-form-store";

import { useStore } from "zustand";

export function usePreRegisterForm() {
	return useStore(preRegisterFormStore);
}
