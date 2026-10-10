import { useId } from 'react'

export function AreaChart({ data = [], height = 200, accent = 'var(--chart-1)' }) {
  const gid = useId().replace(/:/g, '')
  const width = 640
  const padX = 8
  const padY = 18
  const max = Math.max(...data.map((d) => d.value), 1)
  const min = 0
  const stepX = (width - padX * 2) / Math.max(data.length - 1, 1)

  const points = data.map((d, i) => {
    const x = padX + i * stepX
    const y = padY + (1 - (d.value - min) / (max - min)) * (height - padY * 2)
    return { x, y, ...d }
  })

  const line = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`
      const prev = points[i - 1]
      const cx = (prev.x + p.x) / 2
      return `C ${cx} ${prev.y} ${cx} ${p.y} ${p.x} ${p.y}`
    })
    .join(' ')

  const area = `${line} L ${points.at(-1).x} ${height - padY} L ${points[0].x} ${height - padY} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id={`area-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.32" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={padX}
          x2={width - padX}
          y1={padY + t * (height - padY * 2)}
          y2={padY + t * (height - padY * 2)}
          stroke="var(--border)"
          strokeDasharray="3 6"
        />
      ))}

      <path d={area} fill={`url(#area-${gid})`} />
      <path d={line} fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />

      {points.map((p) => (
        <circle key={p.month} cx={p.x} cy={p.y} r="3.5" fill="var(--surface)" stroke={accent} strokeWidth="2" />
      ))}
    </svg>
  )
}

export function BarChart({ data = [], height = 160 }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map((d, i) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-md transition-all duration-500"
              style={{ height: `${(d.value / max) * 100}%`, backgroundColor: `var(--chart-${(i % 5) + 1})` }}
            />
          </div>
          <span className="text-[10px] font-medium text-faint">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

export function Donut({ segments = [], size = 160, thickness = 16, centerLabel, centerSub }) {
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  let offset = 0

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--surface-3)" strokeWidth={thickness} />
        {segments.map((s) => {
          const len = (s.value / total) * circumference
          const el = (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${len} ${circumference - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          )
          offset += len
          return el
        })}
      </svg>
      <div className="absolute flex flex-col items-center">
        {centerLabel && <span className="text-xl font-semibold text-fg">{centerLabel}</span>}
        {centerSub && <span className="text-[11px] text-faint">{centerSub}</span>}
      </div>
    </div>
  )
}
