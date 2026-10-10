import { Link } from 'react-router-dom'
import {
  ArrowRight,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  Moon,
  ReceiptText,
  Search,
  Sun,
  Users,
  Zap,
} from 'lucide-react'
import { useStore } from '../store.jsx'
import { Button } from '../components/ui.jsx'

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: 'One dashboard',
    text: 'Projects, tasks, revenue and deadlines in a single glance — no tab juggling.',
  },
  {
    icon: Users,
    title: 'Clients & projects',
    text: 'Keep every account, contact and project linked together with full history.',
  },
  {
    icon: ListChecks,
    title: 'Kanban tasks',
    text: 'Drag work from To do to Done with priorities, owners and due dates.',
  },
  {
    icon: ReceiptText,
    title: 'Invoicing',
    text: 'Send invoices and always know what is paid, outstanding or overdue.',
  },
  {
    icon: Search,
    title: 'Instant search',
    text: 'Find any client, project or task from the top bar in milliseconds.',
  },
  {
    icon: Zap,
    title: 'No setup',
    text: 'Runs in your browser, saves automatically, and works offline out of the box.',
  },
]

function Nav() {
  const { db, toggleTheme } = useStore()
  const dark = db.settings.theme === 'dark'
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-fg text-sm font-bold text-bg">N</span>
          <span className="text-sm font-semibold tracking-tight text-fg">Northwind</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <a href="#features" className="transition-colors hover:text-fg">Features</a>
          <a href="#modules" className="transition-colors hover:text-fg">Modules</a>
          <a href="#start" className="transition-colors hover:text-fg">Get started</a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Button as={Link} to="/dashboard" variant="primary">
            Open app
          </Button>
        </div>
      </div>
    </header>
  )
}

function Preview() {
  const stats = [
    { label: 'Active projects', value: '8' },
    { label: 'Open tasks', value: '11' },
    { label: 'Outstanding', value: '$19.4k' },
    { label: 'Revenue (Oct)', value: '$31.2k' },
  ]
  const bars = [42, 55, 48, 63, 70, 66, 81, 92]
  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-card">
      <div className="flex items-center gap-2 border-b border-line pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-surface-3" />
        <span className="h-2.5 w-2.5 rounded-full bg-surface-3" />
        <span className="h-2.5 w-2.5 rounded-full bg-surface-3" />
        <span className="ml-3 text-xs text-faint">northwind / dashboard</span>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-line bg-surface-2 p-3">
            <p className="text-[10px] tracking-wide text-faint uppercase">{s.label}</p>
            <p className="tabular mt-1 text-lg font-semibold text-fg">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg border border-line bg-surface-2 p-4">
        <div className="flex h-28 items-end gap-2">
          {bars.map((b, i) => (
            <div key={i} className="flex-1 rounded-t bg-chart-1/80" style={{ height: `${b}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg">
      <Nav />

      <section className="mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Lightweight studio operating system
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
            Run your studio from one place.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted">
            Northwind keeps your clients, projects, tasks and invoices together in a single,
            fast workspace — so you can spend less time managing work and more time doing it.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button as={Link} to="/dashboard" variant="primary" size="lg">
              Open the app <ArrowRight size={16} />
            </Button>
            <Button as="a" href="#features" variant="outline" size="lg">
              Explore features
            </Button>
          </div>
          <p className="mt-4 text-xs text-faint">No signup · No backend · Saved in your browser</p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <Preview />
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold tracking-tight text-fg">Everything a small studio needs</h2>
          <p className="mt-2 text-sm text-muted">A focused set of tools — nothing more, nothing less.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-surface p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 text-fg">
                <f.icon size={18} />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-fg">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="modules" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-fg">Built around how you actually work</h2>
            <p className="mt-2 text-sm text-muted">
              Each module connects to the others, so a new client instantly becomes a project,
              a project becomes tasks, and the work becomes an invoice.
            </p>
            <ul className="mt-6 space-y-4">
              {[
                ['Clients', 'A clean directory with contacts, notes and spend history.'],
                ['Projects', 'Budgets, progress and team members on every job.'],
                ['Tasks', 'A Kanban board that mirrors your delivery flow.'],
                ['Invoices', 'Paid, outstanding and overdue totals at a glance.'],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fg" />
                  <span className="text-sm text-muted">
                    <span className="font-medium text-fg">{t}.</span> {d}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              [FolderKanban, 'Projects', '8 active'],
              [ListChecks, 'Tasks', '11 open'],
              [Users, 'Clients', '6 accounts'],
              [ReceiptText, 'Invoices', '4 pending'],
            ].map(([Icon, label, value]) => (
              <div key={label} className="rounded-xl border border-line bg-surface p-5">
                <Icon size={18} className="text-faint" />
                <p className="mt-6 text-xs text-faint">{label}</p>
                <p className="text-sm font-semibold text-fg">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="start" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-xl border border-line bg-surface px-6 py-14 text-center sm:px-12">
          <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">Start in seconds</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Open the workspace and it loads with everything ready to explore. Your changes save
            automatically.
          </p>
          <div className="mt-7 flex justify-center">
            <Button as={Link} to="/dashboard" variant="primary" size="lg">
              Open the app <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-fg text-xs font-bold text-bg">N</span>
            <span className="text-sm text-muted">Northwind — Studio OS</span>
          </div>
          <p className="text-xs text-faint">Built with React, Vite & Tailwind. © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}
