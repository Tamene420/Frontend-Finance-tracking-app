import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mockApi } from '@/services/mockApi'
import type { BudgetRule } from '@/types/transaction'

const KEY = ['budgets'] as const

export function useBudget() {
  const qc = useQueryClient()
  const budgets = useQuery({ queryKey: KEY, queryFn: () => mockApi.budgets() })

  const setBudgets = useMutation({
    mutationFn: (rules: BudgetRule[]) => mockApi.setBudgets(rules),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })

  return { budgets, setBudgets }
}
