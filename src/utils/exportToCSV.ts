import type { Transaction } from '@/types/transaction'

export function exportToCSV(filename: string, rows: Transaction[]) {
  const header = ['id','amount','type','category','date','notes']
  const lines = [header.join(',')]
  for (const r of rows) {
    const vals = [
      safe(r.id),
      String(r.amount),
      safe(r.type),
      safe(r.category),
      safe(r.date),
      safe(r.notes || ''),
    ]
    lines.push(vals.join(','))
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function importFromCSV(file: File): Promise<Omit<Transaction, 'id'>[]> {
  const text = await file.text()
  const [headerLine, ...rest] = text.split(/\r?\n/)
  const header = headerLine.split(',').map(h => h.trim())
  const idx = (name: string) => header.indexOf(name)
  const out: Omit<Transaction, 'id'>[] = []
  for (const line of rest) {
    if (!line.trim()) continue
    const cols = splitCSV(line)
    const amount = Number(cols[idx('amount')])
    const type = cols[idx('type')] as 'income' | 'expense'
    const category = cols[idx('category')] as any
    const date = cols[idx('date')]
    const notes = cols[idx('notes')] || undefined
    if (!isFinite(amount) || amount <= 0) continue
    out.push({ amount, type, category, date, notes })
  }
  return out
}

function safe(v: string) {
  if (v.includes(',') || v.includes('"') || v.includes('\n')) {
    return '"' + v.split('"').join('""') + '"'
  }
  return v
}

function splitCSV(line: string): string[] {
  const res: string[] = []
  let cur = ''
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQ) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++ } else { inQ = false }
      } else cur += ch
    } else {
      if (ch === ',') { res.push(cur); cur = '' }
      else if (ch === '"') { inQ = true }
      else cur += ch
    }
  }
  res.push(cur)
  return res.map(s => s.trim())
}
