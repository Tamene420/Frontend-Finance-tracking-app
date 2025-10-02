import { useState } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
import { useFiltersStore } from '@/hooks/useFiltersStore'
import type { Transaction } from '@/types/transaction'
import { exportToCSV, importFromCSV } from '@/utils/exportToCSV'
import { toast } from 'react-hot-toast'

export default function TransactionList() {
  const filters = useFiltersStore()
  const { list, update, remove, create } = useTransactions(filters)
  const [editing, setEditing] = useState<Transaction | null>(null)

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const rows = await importFromCSV(file)
    await Promise.all(rows.map(r => create.mutateAsync(r)))
    toast.success(`Imported ${rows.length} transactions`)
    e.target.value = ''
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
        <select value={filters.type || ''} onChange={e => filters.set({ type: (e.target.value || undefined) as any })} className="glass p-2">
          <option value="">All Types</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input type="date" value={filters.from || ''} onChange={e => filters.set({ from: e.target.value || undefined })} className="glass p-2" />
        <input type="date" value={filters.to || ''} onChange={e => filters.set({ to: e.target.value || undefined })} className="glass p-2" />
        <input placeholder="Search notes" value={filters.q || ''} onChange={e => filters.set({ q: e.target.value })} className="glass p-2 flex-1" />
        <div className="ml-auto flex gap-2">
          <button onClick={() => list.data && exportToCSV('transactions.csv', list.data)} className="px-3 py-2 rounded-lg border hover:bg-white/40">Export CSV</button>
          <label className="px-3 py-2 rounded-lg border hover:bg-white/40 cursor-pointer">
            Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={onImport} />
          </label>
          <button onClick={() => filters.reset()} className="px-3 py-2 rounded-lg border hover:bg-white/40">Reset</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left opacity-70">
              <th className="py-2">Date</th>
              <th>Type</th>
              <th>Category</th>
              <th className="text-right">Amount</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.data?.map(tx => (
              <tr key={tx.id} className="border-t border-white/20">
                <td className="py-2">{tx.date}</td>
                <td>
                  <span className={tx.type === 'income' ? 'text-green-600' : 'text-red-600'}>{tx.type}</span>
                </td>
                <td>{tx.category}</td>
                <td className="text-right">{tx.amount.toFixed(2)}</td>
                <td className="max-w-[24ch] truncate" title={tx.notes}>{tx.notes}</td>
                <td className="text-right">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditing(tx)} className="px-2 py-1 rounded border hover:bg-white/40">Edit</button>
                    <button onClick={() => remove.mutate(tx.id)} className="px-2 py-1 rounded border hover:bg-white/40">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditModal tx={editing} onClose={() => setEditing(null)} onSave={(patch) => update.mutate({ id: editing.id, patch })} />)
      }
    </div>
  )
}

function EditModal({ tx, onClose, onSave }: { tx: Transaction; onClose: () => void; onSave: (patch: Partial<Transaction>) => void }) {
  const [amount, setAmount] = useState(String(tx.amount))
  const [date, setDate] = useState(tx.date)
  const [notes, setNotes] = useState(tx.notes || '')

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="glass p-4 w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-3">Edit Transaction</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs opacity-70">Amount</label>
            <input value={amount} onChange={e => setAmount(e.target.value)} type="number" min={0} step="0.01" className="w-full glass p-2 mt-1" />
          </div>
          <div>
            <label className="text-xs opacity-70">Date</label>
            <input value={date} onChange={e => setDate(e.target.value)} type="date" className="w-full glass p-2 mt-1" />
          </div>
          <div className="col-span-2">
            <label className="text-xs opacity-70">Notes</label>
            <input value={notes} onChange={e => setNotes(e.target.value)} type="text" className="w-full glass p-2 mt-1" />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 rounded-lg border hover:bg-white/40">Cancel</button>
          <button onClick={() => onSave({ amount: Number(amount), date, notes })} className="px-3 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-500">Save</button>
        </div>
      </div>
    </div>
  )
}
