// hooks/usePreRegisterForm.ts
import { useStore } from "zustand"
import { preRegisterFormStore } from "@/stores/preregister-form-store"

export function usePreRegisterForm() {
  return useStore(preRegisterFormStore)
}
