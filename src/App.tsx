import { NavLink, Route, Routes } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useDarkMode } from './hooks/useDarkMode'
import { useReminders } from './hooks/useReminders'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Settings from './pages/Settings'

export default function App() {
  const { isDark, toggle } = useDarkMode()
  useReminders()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg link-hover ${isActive ? 'text-primary-600 dark:text-primary-400 font-semibold' : 'text-gray-500 dark:text-gray-300'}`

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-gray-900/50 border-b border-white/20 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-500 to-purple-500 shadow-soft" />
            <span className="text-lg font-semibold">Finance Tracker</span>
          </div>
          <nav className="flex items-center gap-2 text-sm">
            <NavLink to="/" className={linkClass} end>Dashboard</NavLink>
            <NavLink to="/transactions" className={linkClass}>Transactions</NavLink>
            <NavLink to="/settings" className={linkClass}>Settings</NavLink>
            <button
              aria-label="Toggle dark mode"
              onClick={toggle}
              className="ml-2 p-2 rounded-lg border border-white/30 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/10 transition"
            >
              {isDark ? '🌙' : '☀️'}
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <Dashboard />
                </motion.div>
              }
            />
            <Route
              path="/transactions"
              element={
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <Transactions />
                </motion.div>
              }
            />
            <Route
              path="/settings"
              element={
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <Settings />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}
