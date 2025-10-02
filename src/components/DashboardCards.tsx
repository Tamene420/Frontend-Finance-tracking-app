import { useMemo } from 'react'
import { useTransactions } from '@/hooks/useTransactions'

export default function DashboardCards() {
  const { list } = useTransactions()

  const { income, expense, balance, monthIncome, monthExpense, lastIncome, lastExpense } = useMemo(() => {
    const now = new Date()
    const ym = now.toISOString().slice(0, 7)
    const last = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7)
    let income = 0, expense = 0, monthIncome = 0, monthExpense = 0, lastIncome = 0, lastExpense = 0
    for (const tx of list.data || []) {
      const amt = tx.amount
      if (tx.type === 'income') income += amt
      else expense += amt
      const ymTx = tx.date.slice(0, 7)
      if (ymTx === ym) {
        if (tx.type === 'income') monthIncome += amt; else monthExpense += amt
      }
      if (ymTx === last) {
        if (tx.type === 'income') lastIncome += amt; else lastExpense += amt
      }
    }
    return { income, expense, balance: income - expense, monthIncome, monthExpense, lastIncome, lastExpense }
  }, [list.data])

  function delta(curr: number, prev: number) {
    if (prev === 0) return curr > 0 ? 100 : 0
    return Math.round(((curr - prev) / prev) * 100)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card title="Total Income" value={income} accent="from-green-400 to-emerald-500" subtitle={`MoM ${delta(monthIncome, lastIncome)}%`} />
      <Card title="Total Expense" value={expense} accent="from-rose-400 to-red-500" subtitle={`MoM ${delta(monthExpense, lastExpense)}%`} />
      <Card title="Balance" value={balance} accent="from-primary-400 to-indigo-600" />
    </div>
  )
}

function Card({ title, value, accent, subtitle }: { title: string; value: number; accent: string; subtitle?: string }) {
  return (
    <div className="relative glass p-6 card-hover overflow-hidden">
      <div className={`absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-tr ${accent} opacity-30 blur-2xl`} />
      <div className="text-xs opacity-70">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value.toFixed(2)}</div>
      {subtitle && <div className="mt-1 text-xs opacity-70">{subtitle}</div>}
    </div>
  )
}
