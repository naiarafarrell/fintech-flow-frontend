const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const brlCompact = new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 })

export const formatCurrency = (v) => brl.format(v)
export const formatCompact = (v) => brlCompact.format(v)

/** "2026-05-01" -> "01/05/2026" (sem passar por Date, evita bug de fuso) */
export const formatDate = (ymd) => {
  const [y, m, d] = String(ymd).slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
export const monthLabel = (key) => {
  const [y, m] = key.split('-')
  return `${MONTHS[Number(m) - 1]}/${y.slice(2)}`
}

export const todayYMD = () => {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('') || '?'
