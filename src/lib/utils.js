export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`
}

const CURRENCY = { USD: '$', EUR: '€', GBP: '£', PKR: '₨' }

export function currency(value, code = 'USD', opts = {}) {
  const symbol = CURRENCY[code] ?? '$'
  const n = Number(value || 0)
  const formatted = n.toLocaleString('en-US', {
    minimumFractionDigits: opts.decimals ?? 0,
    maximumFractionDigits: opts.decimals ?? 0,
  })
  return `${symbol}${formatted}`
}

export function compactCurrency(value, code = 'USD') {
  const symbol = CURRENCY[code] ?? '$'
  const n = Number(value || 0)
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1_000_000) return `${sign}${symbol}${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${sign}${symbol}${(abs / 1_000).toFixed(abs >= 10_000 ? 0 : 1)}k`
  return `${sign}${symbol}${abs}`
}

export function formatDate(iso, opts = {}) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    month: opts.month ?? 'short',
    day: 'numeric',
    year: opts.year ?? 'numeric',
  })
}

export function formatDateTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function daysBetween(a, b) {
  const d1 = new Date(a)
  const d2 = new Date(b)
  return Math.round((d2 - d1) / 86_400_000)
}

export function relativeDue(iso) {
  if (!iso) return { label: '—', tone: 'neutral' }
  const diff = daysBetween(new Date(), iso)
  if (diff === 0) return { label: 'Due today', tone: 'warn' }
  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, tone: 'danger' }
  if (diff === 1) return { label: 'Due tomorrow', tone: 'warn' }
  if (diff <= 7) return { label: `In ${diff} days`, tone: 'info' }
  return { label: formatDate(iso), tone: 'neutral' }
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export function percent(part, whole) {
  if (!whole) return 0
  return Math.min(100, Math.round((part / whole) * 100))
}

export function groupSum(items, key) {
  return items.reduce((acc, item) => {
    const k = item[key]
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})
}

export const ACCENTS = {
  indigo: '#6366f1',
  cyan: '#06b6d4',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
  violet: '#8b5cf6',
  sky: '#0ea5e9',
  orange: '#f97316',
}
