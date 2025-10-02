import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mockApi, type TxFilters } from '@/services/mockApi'
import type { Transaction } from '@/types/transaction'

const KEY = (filters?: TxFilters) => ['transactions', filters]

export function useTransactions(filters?: TxFilters) {
  const qc = useQueryClient()

  const list = useQuery({
    queryKey: KEY(filters),
    queryFn: () => mockApi.list(filters),
    staleTime: 1000 * 10,
  })

  const create = useMutation({
    mutationFn: (tx: Omit<Transaction, 'id'>) => mockApi.create(tx),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY(filters) }),
  })

  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Transaction> }) => mockApi.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY(filters) }),
  })

  const remove = useMutation({
    mutationFn: (id: string) => mockApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY(filters) }),
  })

  return { list, create, update, remove }
}
