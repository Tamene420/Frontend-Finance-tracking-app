import { useMemo } from 'react'
import type { BudgetRule } from '@/types/transaction'
import type { Transaction } from '@/types/transaction'

export default function BudgetProgress({ rules, txs }: { rules: BudgetRule[]; txs: Transaction[] }) {
  const byCat = useMemo(() => {
    const ym = new Date().toISOString().slice(0, 7)
    const map = new Map<string, number>()
    for (const t of txs) {
      if (t.type !== 'expense') continue
      if (t.date.slice(0, 7) !== ym) continue
      map.set(t.category, (map.get(t.category) || 0) + t.amount)
    }
    return map
  }, [txs])

  return (
    <div className="space-y-3">
      {rules.length === 0 && <div className="text-sm opacity-70">No budgets yet. Add some in Settings.</div>}
      {rules.map(r => {
        const spent = byCat.get(r.category) || 0
        const limit = Math.max(0, r.monthlyLimit || 0)
        const remainingRaw = limit - spent
        const remaining = Math.max(0, remainingRaw)
        const over = spent > limit

        // Percentages for the bar
        const pctSpent = limit > 0 ? Math.min(100, (spent / limit) * 100) : (spent > 0 ? 100 : 0)
        const pctRemain = limit > 0 ? Math.max(0, 100 - pctSpent) : 0

        return (
          <div key={r.id} className={`glass p-4 ${over ? 'ring-2 ring-rose-500' : ''}`}>
            <div className="flex justify-between items-start text-sm mb-2">
              <div className="font-medium">{r.category}</div>
              <div className="text-right space-y-0.5">
                <div>
                  <span className={`font-medium ${over ? 'text-rose-600' : 'text-primary-600'}`}>Spent:</span>{' '}
                  <span className={`${over ? 'text-rose-600' : 'opacity-90'}`}>{spent.toFixed(2)}</span>
                </div>
                {over ? (
                  <div className="text-rose-600">Over by {Math.abs(remainingRaw).toFixed(2)}</div>
                ) : (
                  <div className="text-emerald-600">Remaining: {remaining.toFixed(2)} / {limit.toFixed(2)}</div>
                )}
              </div>
            </div>

            <div className="h-2 rounded bg-white/30 overflow-hidden">
              <div className="h-full w-full relative">
                {/* Spent portion */}
                <div
                  className={`absolute inset-y-0 left-0 ${over ? 'bg-rose-500' : 'bg-primary-500'}`}
                  style={{ width: `${pctSpent}%` }}
                />
                {/* Remaining portion (only visible when not over) */}
                {!over && (
                  <div
                    className="absolute inset-y-0 right-0 bg-emerald-500/70"
                    style={{ width: `${pctRemain}%` }}
                  />
                )}
              </div>
            </div>

            {over && <div className="text-xs mt-2 text-rose-600">Overspending alert! Consider increasing your budget or reducing expenses.</div>}
          </div>
        )
      })}
    </div>
  )
}
