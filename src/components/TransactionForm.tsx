import { useEffect, useMemo, useState } from 'react'
import { categoriesByType } from '@/utils/categories'
import type { Transaction } from '@/types/transaction'
import { toast } from 'react-hot-toast'

export type TransactionFormProps = {
  initial?: Partial<Transaction>
  onSubmit: (tx: Omit<Transaction, 'id'>) => Promise<any> | any
  onCancel?: () => void
}

export default function TransactionForm({ initial, onSubmit, onCancel }: TransactionFormProps) {
  const [amount, setAmount] = useState<string>(initial?.amount ? String(initial.amount) : '')
  const [type, setType] = useState<'income' | 'expense'>(initial?.type || 'expense')
  const [category, setCategory] = useState<string>(initial?.category || 'Food')
  const [date, setDate] = useState<string>(initial?.date || new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState<string>(initial?.notes || '')
  const [isRecurring, setIsRecurring] = useState<boolean>(Boolean(initial?.recurring))
  const [pattern, setPattern] = useState<'daily' | 'weekly' | 'monthly'>(initial?.recurring?.pattern || 'monthly')
  const [endDate, setEndDate] = useState<string>(initial?.recurring?.endDate || '')
  const [loading, setLoading] = useState(false)

  // Compute available categories by type
  const availableCategories = useMemo(() => categoriesByType(type), [type])

  // Ensure category stays valid when type changes
  useEffect(() => {
    if (!availableCategories.includes(category as any)) {
      setCategory(availableCategories[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amt = Number(amount)
    if (!isFinite(amt) || amt <= 0) {
      toast.error('Amount must be a positive number')
      return
    }
    try {
      setLoading(true)
      await onSubmit({
        amount: amt,
        type,
        category: category as any,
        date,
        notes: notes || undefined,
        recurring: isRecurring
          ? { pattern, startDate: date, endDate: endDate || undefined }
          : undefined,
      })
      setAmount('')
      setNotes('')
      setIsRecurring(false)
      toast.success('Saved')
    } catch (e: any) {
      toast.error(e?.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const isIncome = type === 'income'

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-3">
      <div className="md:col-span-1">
        <label className="text-xs opacity-70">Type</label>
        <select value={type} onChange={e => setType(e.target.value as any)} className="w-full glass p-2 mt-1">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div className="md:col-span-1">
        <label className="text-xs opacity-70">{isIncome ? 'Amount Received' : 'Amount Spent'}</label>
        <input value={amount} onChange={e => setAmount(e.target.value)} type="number" min={0} step="0.01" className="w-full glass p-2 mt-1" placeholder={isIncome ? 'e.g. 2500.00' : 'e.g. 45.99'} required />
      </div>
      <div className="md:col-span-2">
        <label className="text-xs opacity-70">{isIncome ? 'Income Source' : 'Expense Category'}</label>
        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full glass p-2 mt-1">
          {availableCategories.map(c => (
            <option key={c as string} value={c as string}>{c}</option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="text-xs opacity-70">Date</label>
        <input value={date} onChange={e => setDate(e.target.value)} type="date" className="w-full glass p-2 mt-1" required />
      </div>

      <div className="md:col-span-6">
        <label className="text-xs opacity-70">Notes</label>
        <input value={notes} onChange={e => setNotes(e.target.value)} type="text" className="w-full glass p-2 mt-1" placeholder={isIncome ? 'Optional: e.g. bonus, overtime, client name' : 'Optional: e.g. merchant, reason, details'} />
      </div>

      <div className="md:col-span-6 flex flex-col md:flex-row md:items-end gap-3">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} />
          <span className="text-sm">Recurring</span>
        </label>
        {isRecurring && (
          <>
            <div>
              <label className="text-xs opacity-70">Pattern</label>
              <select value={pattern} onChange={e => setPattern(e.target.value as any)} className="w-full glass p-2 mt-1">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="text-xs opacity-70">End Date</label>
              <input value={endDate} onChange={e => setEndDate(e.target.value)} type="date" className="w-full glass p-2 mt-1" />
            </div>
          </>
        )}
        <div className="ml-auto flex gap-2">
          {onCancel && (
            <button type="button" onClick={onCancel} className="px-3 py-2 rounded-lg border hover:bg-white/40">Cancel</button>
          )}
          <button disabled={loading} className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-500 shadow-soft disabled:opacity-50">
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  )
}
