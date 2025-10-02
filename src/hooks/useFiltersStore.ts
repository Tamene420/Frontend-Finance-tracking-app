import { create } from 'zustand'

export type FiltersState = {
  type?: 'income' | 'expense'
  category?: string
  from?: string
  to?: string
  q?: string
}

interface Store extends FiltersState {
  set: (patch: Partial<FiltersState>) => void
  reset: () => void
}

export const useFiltersStore = create<Store>((set) => ({
  type: undefined,
  category: undefined,
  from: undefined,
  to: undefined,
  q: '',
  set: (patch) => set((s) => ({ ...s, ...patch })),
  reset: () => set({ type: undefined, category: undefined, from: undefined, to: undefined, q: '' }),
}))
