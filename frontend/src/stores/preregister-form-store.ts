import { PreRegisterForm } from "@/types/types"
import { createStore } from "zustand/vanilla"
import { persist } from "zustand/middleware"

interface PreRegisterFormState {
  formData: PreRegisterForm | null
  setField: <K extends keyof PreRegisterForm>(
    field: K,
    value: PreRegisterForm[K]
  ) => void
  setForm: (data: PreRegisterForm) => void
  reset: () => void
}

export const preRegisterFormStore = createStore<PreRegisterFormState>()(
  persist(
    (set, get) => ({
      formData: null,

      setField: (field, value) => {
        const current = get().formData
        if (!current) {
          console.warn("[PreRegisterFormStore] Ignorado setField porque formData = null")
          return
        }
        const updated = { ...current, [field]: value }
        console.log("[PreRegisterFormStore] setField:", field, "=", value, "->", updated)
        set({ formData: updated })
      },

      setForm: (data) => {
        console.log("[PreRegisterFormStore] setForm:", data)
        set({ formData: data })
      },

      reset: () => {
        console.log("[PreRegisterFormStore] reset -> null")
        set({ formData: null })
      },
    }),
    {
      name: "pre-register-form", 
    }
  )
)
