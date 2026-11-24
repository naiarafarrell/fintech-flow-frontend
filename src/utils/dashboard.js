/**
 * Agregações do dashboard. O backend não tem rota de resumo,
 * então tudo é derivado de GET /api/transactions (usado com useMemo).
 */
export function summarize(transactions) {
  let income = 0, expense = 0, incomeCount = 0, expenseCount = 0
  for (const t of transactions) {
    if (t.type === 'income') { income += t.amount; incomeCount++ }
    else { expense += t.amount; expenseCount++ }
  }
  return { income, expense, balance: income - expense, incomeCount, expenseCount, total: transactions.length }
}

/** Série mensal (entradas, saídas e saldo) dos últimos `months` meses com movimento. */
export function monthlySeries(transactions, months = 6) {
  const map = new Map()
  for (const t of transactions) {
    const key = t.date.slice(0, 7)
    const row = map.get(key) ?? { key, income: 0, expense: 0 }
    row[t.type === 'income' ? 'income' : 'expense'] += t.amount
    map.set(key, row)
  }
  return [...map.values()]
    .sort((a, b) => a.key.localeCompare(b.key))
    .slice(-months)
    .map((r) => ({ ...r, balance: r.income - r.expense }))
}

/** Despesas agrupadas por categoria (maiores primeiro; excedente vira "Outras"). */
export function expensesByCategory(transactions, top = 6) {
  const map = new Map()
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    const cat = t.category || 'Sem categoria'
    map.set(cat, (map.get(cat) ?? 0) + t.amount)
  }
  const sorted = [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  if (sorted.length <= top) return sorted
  const rest = sorted.slice(top).reduce((s, c) => s + c.value, 0)
  return [...sorted.slice(0, top), { name: 'Outras', value: rest }]
}
