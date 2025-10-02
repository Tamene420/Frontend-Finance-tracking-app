import { get, set } from 'idb-keyval'
import { addMonths, addWeeks, addDays, isAfter, isBefore, parseISO, formatISO } from 'date-fns'
import type { BudgetRule, Transaction } from '@/types/transaction'

const TX_KEY = 'ft.transactions.v1'
const BUDGET_KEY = 'ft.budgets.v1'

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// Ensure date string is yyyy-MM-dd
function toDateOnly(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatISO(d, { representation: 'date' })
}

export type TxFilters = {
  type?: 'income' | 'expense'
  category?: string
  from?: string
  to?: string
  q?: string
}

export const mockApi = {
  async list(filters?: TxFilters): Promise<Transaction[]> {
    const list: Transaction[] = (await get(TX_KEY)) || []
    const now = new Date()
    const withRecurring = await this._expandRecurring(list, now)
    let out = withRecurring
    if (filters) {
      out = out.filter(tx => {
        if (filters.type && tx.type !== filters.type) return false
        if (filters.category && tx.category !== filters.category) return false
        if (filters.from && isBefore(parseISO(tx.date), parseISO(filters.from))) return false
        if (filters.to && isAfter(parseISO(tx.date), parseISO(filters.to))) return false
        if (filters.q) {
          const q = filters.q.toLowerCase()
          if (!(tx.notes || '').toLowerCase().includes(q)) return false
        }
        return true
      })
    }
    // sort desc by date
    out.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    return out
  },

  async create(tx: Omit<Transaction, 'id'>): Promise<Transaction> {
    if (tx.amount <= 0) throw new Error('Amount must be positive')
    const list: Transaction[] = (await get(TX_KEY)) || []
    const newTx: Transaction = { ...tx, id: uid(), date: toDateOnly(tx.date) }
    list.push(newTx)
    await set(TX_KEY, list)
    return newTx
  },

  async update(id: string, patch: Partial<Transaction>): Promise<Transaction> {
    const list: Transaction[] = (await get(TX_KEY)) || []
    const idx = list.findIndex(t => t.id === id)
    if (idx === -1) throw new Error('Not found')
    const updated: Transaction = { ...list[idx], ...patch }
    if (updated.amount <= 0) throw new Error('Amount must be positive')
    if (updated.date) updated.date = toDateOnly(updated.date)
    list[idx] = updated
    await set(TX_KEY, list)
    return updated
  },

  async remove(id: string): Promise<void> {
    const list: Transaction[] = (await get(TX_KEY)) || []
    const next = list.filter(t => t.id !== id)
    await set(TX_KEY, next)
  },

  async clearAll(): Promise<void> {
    await set(TX_KEY, [])
  },

  async budgets(): Promise<BudgetRule[]> {
    return (await get(BUDGET_KEY)) || []
  },

  async setBudgets(rules: BudgetRule[]): Promise<void> {
    await set(BUDGET_KEY, rules)
  },

  async _expandRecurring(base: Transaction[], now: Date): Promise<Transaction[]> {
    // Generate future entries up to 2 months ahead for display purposes
    const expanded: Transaction[] = [...base]
    for (const tx of base) {
      if (!tx.recurring) continue
      let current = parseISO(tx.recurring.startDate)
      const end = tx.recurring.endDate ? parseISO(tx.recurring.endDate) : addMonths(now, 2)
      const step = (d: Date) =>
        tx.recurring!.pattern === 'daily'
          ? addDays(d, 1)
          : tx.recurring!.pattern === 'weekly'
          ? addWeeks(d, 1)
          : addMonths(d, 1)

      while (!isAfter(current, end)) {
        const dateOnly = toDateOnly(current)
        // skip the original record date to avoid duplicate of base item
        const exists = expanded.some(e => e.date === dateOnly && e.notes === tx.notes && e.amount === tx.amount && e.type === tx.type && e.category === tx.category)
        if (!exists) {
          expanded.push({ ...tx, id: `${tx.id}:${dateOnly}`, date: dateOnly })
        }
        current = step(current)
      }
    }
    return expanded
  },
}
