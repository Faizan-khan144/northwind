import { useEffect } from 'react'
import { X } from 'lucide-react'
import { ACCENTS, cn, initials } from '../lib/utils.js'

export function Avatar({ name, accent = 'indigo', size = 36, className = '' }) {
  const color = ACCENTS[accent] ?? ACCENTS.indigo
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white', className)}
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.38 }}
      title={name}
    >
      {initials(name)}
    </span>
  )
}

export function AvatarGroup({ people = [], size = 28, max = 4 }) {
  const shown = people.slice(0, max)
  const extra = people.length - shown.length
  return (
    <div className="flex items-center">
      {shown.map((p, i) => (
        <span key={p.id} className={cn(i > 0 && '-ml-2')} style={{ zIndex: shown.length - i }}>
          <Avatar name={p.name} accent={p.accent} size={size} className="ring-2 ring-surface" />
        </span>
      ))}
      {extra > 0 && (
        <span
          className="-ml-2 inline-flex items-center justify-center rounded-full bg-surface-3 text-[11px] font-semibold text-muted ring-2 ring-surface"
          style={{ width: size, height: size }}
        >
          +{extra}
        </span>
      )}
    </div>
  )
}

const TONE_CLASS = {
  neutral: 'bg-surface-3 text-muted',
  accent: 'bg-accent-soft text-accent',
  success: 'bg-success-soft text-success',
  warn: 'bg-warning-soft text-warning',
  info: 'bg-info-soft text-info',
  danger: 'bg-danger-soft text-danger',
}

export function Badge({ tone = 'neutral', children, className = '', dot = false }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap',
        TONE_CLASS[tone] ?? TONE_CLASS.neutral,
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

const BTN_VARIANT = {
  primary: 'bg-accent text-accent-fg hover:brightness-110 shadow-sm',
  secondary: 'bg-surface-2 text-fg hover:bg-surface-3 border border-line',
  outline: 'border border-line-strong text-fg hover:bg-surface-2',
  ghost: 'text-muted hover:bg-surface-2 hover:text-fg',
  danger: 'bg-danger text-white hover:brightness-110',
}
const BTN_SIZE = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-3.5 text-sm gap-2',
  lg: 'h-10 px-4 text-sm gap-2',
}

export function Button({ variant = 'secondary', size = 'md', className = '', as: Tag = 'button', ...props }) {
  return (
    <Tag
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-50',
        BTN_VARIANT[variant] ?? BTN_VARIANT.secondary,
        BTN_SIZE[size] ?? BTN_SIZE.md,
        className,
      )}
      {...props}
    />
  )
}

export function IconButton({ className = '', label, children, ...props }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors',
        'hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function Card({ className = '', children, as: Tag = 'div', ...props }) {
  return (
    <Tag className={cn('rounded-xl border border-line bg-surface shadow-card', className)} {...props}>
      {children}
    </Tag>
  )
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 border-b border-line px-5 py-4', className)}>
      <div>
        <h3 className="text-sm font-semibold text-fg">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-faint">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function StatCard({ label, value, delta, icon: Icon }) {
  const up = typeof delta === 'number' ? delta >= 0 : null
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-faint uppercase">{label}</span>
        {Icon && (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-muted">
            <Icon size={17} />
          </span>
        )}
      </div>
      <div className="mt-3 flex items-end gap-2">
        <span className="tabular text-2xl font-semibold tracking-tight text-fg">{value}</span>
        {up !== null && (
          <span className={cn('mb-1 text-xs font-semibold', up ? 'text-success' : 'text-danger')}>
            {up ? '▲' : '▼'} {Math.abs(delta)}%
          </span>
        )}
      </div>
    </Card>
  )
}

export function ProgressBar({ value = 0, accent = 'indigo', className = '', showLabel = false }) {
  const color = ACCENTS[accent] ?? ACCENTS.indigo
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      {showLabel && <span className="tabular w-9 text-right text-xs font-medium text-muted">{pct}%</span>}
    </div>
  )
}

export function Modal({ open, onClose, title, description, children, footer, width = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('animate-scale relative z-10 w-full rounded-xl border border-line bg-surface shadow-pop', width)}>
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-fg">{title}</h2>
            {description && <p className="mt-0.5 text-xs text-faint">{description}</p>}
          </div>
          <IconButton label="Close" onClick={onClose}>
            <X size={18} />
          </IconButton>
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-line px-5 py-4">{footer}</div>}
      </div>
    </div>
  )
}

export function Field({ label, hint, children, className = '' }) {
  return (
    <label className={cn('block', className)}>
      {label && <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>}
      {children}
      {hint && <span className="mt-1 block text-[11px] text-faint">{hint}</span>}
    </label>
  )
}

const INPUT_CLASS =
  'w-full rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-fg placeholder:text-faint ' +
  'transition-colors focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30'

export function Input({ className = '', ...props }) {
  return <input className={cn(INPUT_CLASS, className)} {...props} />
}

export function Textarea({ className = '', rows = 3, ...props }) {
  return <textarea rows={rows} className={cn(INPUT_CLASS, 'resize-none', className)} {...props} />
}

export function Select({ className = '', children, ...props }) {
  return (
    <select className={cn(INPUT_CLASS, 'appearance-none pr-8', className)} {...props}>
      {children}
    </select>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      {Icon && (
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-surface-3 text-faint">
          <Icon size={22} />
        </span>
      )}
      <div>
        <p className="text-sm font-semibold text-fg">{title}</p>
        {description && <p className="mt-1 text-xs text-faint">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-fg sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-line bg-surface-2 p-0.5">
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            value === t.value ? 'bg-surface text-fg shadow-sm' : 'text-faint hover:text-fg',
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
