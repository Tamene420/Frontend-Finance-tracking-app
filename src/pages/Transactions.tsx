import TransactionForm from '@/components/TransactionForm'
import TransactionList from '@/components/TransactionList'
import { useTransactions } from '@/hooks/useTransactions'

export default function Transactions() {
  const { create } = useTransactions()

  return (
    <div className="space-y-6">
      <div className="glass p-6 card-hover">
        <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
        <TransactionForm onSubmit={(tx) => create.mutateAsync(tx)} />
      </div>

      <div className="glass p-6 card-hover">
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>
        <TransactionList />
      </div>
    </div>
  )
}
