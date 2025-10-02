export const expenseCategories = [
  'Food',
  'Rent',
  'Utilities',
  'Transport',
  'Shopping',
  'Entertainment',
  'Health',
  'Other',
] as const

export const incomeCategories = [
  'Salary',
  'Investment',
  'Other Income',
] as const

// Flat list if needed elsewhere
export const categories = [
  ...new Set<string>([...expenseCategories, ...incomeCategories] as unknown as string[]),
] as unknown as readonly string[]

export function categoriesByType(type: 'income' | 'expense'): readonly string[] {
  return (type === 'income' ? incomeCategories : expenseCategories) as readonly string[]
}
