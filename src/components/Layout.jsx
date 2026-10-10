import { useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Bell,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  Menu,
  Moon,
  ReceiptText,
  Search,
  Settings as SettingsIcon,
  Sun,
  Users,
  X,
} from 'lucide-react'
import { useStore } from '../store.jsx'
import { Avatar, IconButton } from './ui.jsx'
import { cn } from '../lib/utils.js'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: ListChecks },
  { to: '/invoices', label: 'Invoices', icon: ReceiptText },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

function Logo({ compact = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-fg">
        <span className="text-base font-bold">N</span>
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-chart-2" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight text-fg">Northwind</span>
          <span className="text-[11px] text-faint">Studio OS</span>
        </span>
      )}
    </Link>
  )
}

function Sidebar({ open, onClose }) {
  const { db } = useStore()
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-surface transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <Logo />
          <IconButton label="Close menu" className="lg:hidden" onClick={onClose}>
            <X size={18} />
          </IconButton>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-faint uppercase">Workspace</p>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-accent-soft text-accent' : 'text-muted hover:bg-surface-2 hover:text-fg',
                )
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-line p-3">
          <div className="flex items-center gap-3 rounded-xl bg-surface-2 px-3 py-2.5">
            <Avatar name={db.settings.ownerName} accent="indigo" size={34} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-fg">{db.settings.ownerName}</p>
              <p className="truncate text-[11px] text-faint">Workspace owner</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

function GlobalSearch() {
  const { db } = useStore()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return []
    const cl = db.clients
      .filter((c) => c.name.toLowerCase().includes(s))
      .slice(0, 3)
      .map((c) => ({ type: 'Client', label: c.name, to: `/clients/${c.id}` }))
    const pr = db.projects
      .filter((p) => p.name.toLowerCase().includes(s))
      .slice(0, 3)
      .map((p) => ({ type: 'Project', label: p.name, to: `/projects/${p.id}` }))
    const tk = db.tasks
      .filter((t) => t.title.toLowerCase().includes(s))
      .slice(0, 3)
      .map((t) => ({ type: 'Task', label: t.title, to: `/tasks` }))
    return [...cl, ...pr, ...tk]
  }, [q, db])

  const go = (to) => {
    navigate(to)
    setQ('')
    setOpen(false)
  }

  return (
    <div className="relative w-full max-w-sm">
      <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-faint" />
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search clients, projects, tasks…"
        className="h-9 w-full rounded-lg border border-line bg-surface-2 pr-3 pl-9 text-sm text-fg placeholder:text-faint focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      {open && q.trim() && (
        <div className="absolute top-11 z-50 w-full overflow-hidden rounded-xl border border-line bg-surface shadow-pop">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-xs text-faint">No matches for “{q}”.</p>
          ) : (
            results.map((r, i) => (
              <button
                key={`${r.to}-${i}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(r.to)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface-2"
              >
                <span className="truncate text-fg">{r.label}</span>
                <span className="ml-3 shrink-0 text-[11px] text-faint">{r.type}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

function Topbar({ onMenu }) {
  const { db, toggleTheme } = useStore()
  const dark = db.settings.theme === 'dark'
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-bg/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <IconButton label="Open menu" className="lg:hidden" onClick={onMenu}>
        <Menu size={20} />
      </IconButton>
      <div className="hidden flex-1 sm:block">
        <GlobalSearch />
      </div>
      <div className="flex flex-1 items-center justify-end gap-1 sm:flex-none">
        <IconButton label="Notifications" className="relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger" />
        </IconButton>
        <IconButton label="Toggle theme" onClick={toggleTheme}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </IconButton>
        <Link to="/settings" className="ml-1">
          <Avatar name={db.settings.ownerName} accent="indigo" size={32} className="ring-2 ring-line" />
        </Link>
      </div>
    </header>
  )
}

export default function Layout() {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen bg-bg">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
