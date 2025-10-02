import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useMemo } from 'react'
import { useTransactions } from '@/hooks/useTransactions'

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#84cc16', '#06b6d4', '#f97316', '#14b8a6', '#8b5cf6', '#ef4444']

export default function ExpensePieChart() {
  const { list } = useTransactions()
  const data = useMemo(() => {
    const map = new Map<string, number>()
    for (const tx of list.data || []) {
      if (tx.type !== 'expense') continue
      map.set(tx.category, (map.get(tx.category) || 0) + tx.amount)
    }
    return Array.from(map, ([name, value]) => ({ name, value }))
  }, [list.data])

  return (
    <div className="glass p-4 card-hover h-80">
      <h3 className="text-sm font-semibold mb-2">Category Breakdown</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: any) => Number(v).toFixed(2)} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
