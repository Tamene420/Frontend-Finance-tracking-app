import { useState } from 'react'
import { useBudget } from '@/hooks/useBudget'
import { useTransactions } from '@/hooks/useTransactions'
import BudgetProgress from '@/components/BudgetProgress'
import type { BudgetRule } from '@/types/transaction'
import { expenseCategories } from '@/utils/categories'

export default function Settings() {
  const { budgets, setBudgets } = useBudget()
  const { list } = useTransactions()
  const [draft, setDraft] = useState<BudgetRule[]>([])

  const rules = budgets.data || []

  function ensureDraft() {
    if (draft.length === 0) setDraft(rules)
  }

  function addRule() {
    ensureDraft()
    setDraft(prev => [...prev, { id: cryptoRandomId(), category: 'Food', monthlyLimit: 100 }])
  }

  function updateRule(i: number, patch: Partial<BudgetRule>) {
    ensureDraft()
    setDraft(prev => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  }

  function removeRule(i: number) {
    ensureDraft()
    setDraft(prev => prev.filter((_, idx) => idx !== i))
  }

  function save() {
    setBudgets.mutate(draft)
  }

  function requestNotif() {
    if ('Notification' in window) Notification.requestPermission()
  }

  return (
    <div className="space-y-6">
      <div className="glass p-6 card-hover">
        <h2 className="text-xl font-semibold mb-2">Budgets</h2>
        <p className="text-sm opacity-80 mb-4">Set monthly budgets per category.</p>
        {(draft.length > 0 ? draft : rules).map((r, i) => (
          <div key={r.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="text-xs opacity-70">Category</label>
              <select value={r.category} onChange={e => updateRule(i, { category: e.target.value as any })} className="w-full glass p-2 mt-1">
                {expenseCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs opacity-70">Monthly Limit</label>
              <input type="number" min={0} step="0.01" value={r.monthlyLimit}
                     onChange={e => updateRule(i, { monthlyLimit: Number(e.target.value) })}
                     className="w-full glass p-2 mt-1" />
            </div>
            <div className="md:col-span-2 flex items-end gap-2">
              <button onClick={() => removeRule(i)} className="px-3 py-2 rounded-lg border hover:bg-white/40">Remove</button>
            </div>
          </div>
        ))}
        <div className="flex gap-2">
          <button onClick={addRule} className="px-3 py-2 rounded-lg border hover:bg-white/40">Add Category Budget</button>
          {draft.length > 0 && (
            <button onClick={save} className="px-3 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-500">Save Budgets</button>
          )}
        </div>
      </div>

      <div className="glass p-6 card-hover">
        <h2 className="text-xl font-semibold mb-2">Budget Progress</h2>
        <BudgetProgress rules={rules} txs={list.data || []} />
      </div>

      <div className="glass p-6 card-hover">
        <h2 className="text-xl font-semibold mb-2">Notifications</h2>
        <p className="text-sm opacity-80 mb-3">Enable browser notifications for upcoming recurring bills.</p>
        <button onClick={requestNotif} className="px-3 py-2 rounded-lg border hover:bg-white/40">Request Permission</button>
      </div>
    </div>
  )
}

function cryptoRandomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}
