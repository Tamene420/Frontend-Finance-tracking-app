import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts'
import { useMemo } from 'react'
import { useTransactions } from '@/hooks/useTransactions'

export default function IncomeExpenseLineChart() {
  const { list } = useTransactions()
  const data = useMemo(() => {
    const map = new Map<string, { month: string; income: number; expense: number }>()
    for (const tx of list.data || []) {
      const ym = tx.date.slice(0, 7)
      const row = map.get(ym) || { month: ym, income: 0, expense: 0 }
      if (tx.type === 'income') row.income += tx.amount
      else row.expense += tx.amount
      map.set(ym, row)
    }
    return Array.from(map.values()).sort((a, b) => (a.month > b.month ? 1 : -1))
  }, [list.data])

  return (
    <div className="glass p-4 card-hover h-80">
      <h3 className="text-sm font-semibold mb-2">Income vs Expense</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="month" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip formatter={(v: any) => Number(v).toFixed(2)} />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
