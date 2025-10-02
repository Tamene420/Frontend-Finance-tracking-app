import DashboardCards from '@/components/DashboardCards'
import ExpensePieChart from '@/components/Charts/ExpensePieChart'
import MonthlyBarChart from '@/components/Charts/MonthlyBarChart'
import IncomeExpenseLineChart from '@/components/Charts/IncomeExpenseLineChart'

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="glass p-6 card-hover col-span-1 lg:col-span-3">
        <h2 className="text-xl font-semibold">Welcome 👋</h2>
        <p className="text-sm opacity-80 mt-1">Your finances at a glance. Add transactions to see charts and insights.</p>
      </div>
      <div className="lg:col-span-3">
        <DashboardCards />
      </div>
      <div className="lg:col-span-2">
        <IncomeExpenseLineChart />
      </div>
      <div>
        <ExpensePieChart />
      </div>
      <div className="lg:col-span-3">
        <MonthlyBarChart />
      </div>
    </div>
  )
}
