export type Category =
  | 'Food'
  | 'Rent'
  | 'Utilities'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Health'
  | 'Salary'
  | 'Investment'
  | 'Other'

export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  amount: number // cents stored as number for precision or keep as float with care
  type: TransactionType
  category: Category
  date: string // ISO string (yyyy-MM-dd)
  notes?: string
  recurring?: {
    pattern: 'daily' | 'weekly' | 'monthly'
    startDate: string // ISO date
    endDate?: string // ISO date
    nextOccurrence?: string // ISO date
  }
}

export interface BudgetRule {
  id: string
  category: Category
  monthlyLimit: number
}

export interface DateRange {
  from?: string // ISO date
  to?: string // ISO date
}
