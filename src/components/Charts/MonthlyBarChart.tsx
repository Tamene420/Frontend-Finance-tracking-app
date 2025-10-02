import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useMemo } from 'react'
import { useTransactions } from '@/hooks/useTransactions'

export default function MonthlyBarChart() {
  const { list } = useTransactions()
  const data = useMemo(() => {
    const map = new Map<string, number>()
    for (const tx of list.data || []) {
      if (tx.type !== 'expense') continue
      const ym = tx.date.slice(0, 7)
      map.set(ym, (map.get(ym) || 0) + tx.amount)
    }
    return Array.from(map, ([month, expense]) => ({ month, expense })).sort((a, b) => (a.month > b.month ? 1 : -1))
  }, [list.data])

  return (
    <div className="glass p-4 card-hover h-80">
      <h3 className="text-sm font-semibold mb-2">Monthly Expenses</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="month" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip formatter={(v: any) => Number(v).toFixed(2)} />
          <Bar dataKey="expense" fill="#ef4444" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
