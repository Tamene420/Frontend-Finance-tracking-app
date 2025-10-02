import { useEffect, useRef } from 'react'
import { useTransactions } from './useTransactions'
import { parseISO, addDays, isEqual } from 'date-fns'
import toast from 'react-hot-toast'

export function useReminders() {
  const { list } = useTransactions()
  const shown = useRef<Set<string>>(new Set())

  useEffect(() => {
    const tomorrow = addDays(new Date(), 1)
    const tomorrowDateStr = tomorrow.toISOString().slice(0, 10)

    for (const tx of list.data || []) {
      if (!tx.recurring) continue
      const due = parseISO(tx.date)
      if (isEqual(parseISO(tomorrowDateStr), parseISO(tx.date))) {
        const key = `${tx.id}:${tx.date}`
        if (!shown.current.has(key)) {
          shown.current.add(key)
          const msg = `${tx.category} is due tomorrow (${tx.amount.toFixed(2)})`
          toast(msg)
          if ('Notification' in window) {
            if (Notification.permission === 'granted') new Notification('Upcoming bill', { body: msg })
            else if (Notification.permission !== 'denied') Notification.requestPermission()
          }
        }
      }
    }
  }, [list.data])
}
