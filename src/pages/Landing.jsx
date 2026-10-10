import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  FileSpreadsheet,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  ListChecks,
  MessageCircle,
  Moon,
  NotebookPen,
  ReceiptText,
  Search,
  Sun,
  UserPlus,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { useStore } from '../store.jsx'
import { useCountUp, useInView } from '../lib/hooks.js'
import { Button, Reveal } from '../components/ui.jsx'

const BUILT_FOR = [
  'Freelancers', 'Design studios', 'Web agencies', 'Dev shops', 'Marketing teams', 'Consultancies',
  'SaaS founders', 'Product teams', 'Remote squads', 'Solo operators',
]

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

const WORKFLOW = [
  { icon: UserPlus, title: 'Add a client', text: 'Names, contacts, industry and notes land in a connected client record.' },
  { icon: FolderKanban, title: 'Create a project', text: 'Give it a budget, a deadline and a team — progress follows automatically.' },
  { icon: ListChecks, title: 'Plan the board', text: 'Drag tasks through To do, In progress, Review and Done.' },
  { icon: ReceiptText, title: 'Invoice & follow up', text: 'Send from the same flow and watch paid versus outstanding.' },
  { icon: BarChart3, title: 'Review analytics', text: 'Revenue trends, completion rates and team workload in one chart.' },
]

const OLD_WAY = [
  'Email threads that never end',
  'Spreadsheets stale the moment they’re saved',
  'Group chats bury every decision',
  'Notebooks nobody can search',
  'No client history, no accountability',
  'Invoices chased through follow-ups',
]

const NEW_WAY = [
  'One workspace for clients, projects and tasks',
  'Kanban that mirrors your delivery flow',
  'Every change saved automatically',
  'Instant search across the whole workspace',
  'Full history for every client and project',
  'Invoices with paid / outstanding at a glance',
]

const PLANS = [
  {
    name: 'Starter', price: 'Free', note: 'for solo exploration',
    features: ['1 workspace seat', 'Up to 5 projects', 'Unlimited clients', 'Local data persistence'],
  },
  {
    name: 'Pro', price: '$29', note: 'per month, per seat', featured: true,
    features: ['Unlimited projects', 'Invoicing & exports', 'Priority support', 'Custom fields'],
  },
  {
    name: 'Studio', price: '$79', note: 'per month, for teams',
    features: ['Up to 10 seats', 'Roles & permissions', 'API access', 'Dedicated onboarding'],
  },
]

const FAQS = [
  { q: 'Do I need an account to use it?', a: 'No. Northwind runs entirely in your browser with zero signup. Open the app and start working immediately.' },
  { q: 'Where is my data stored?', a: 'Everything is saved to your browser via localStorage. Deleting site data resets the workspace to the demo seed.' },
  { q: 'Can I host it myself?', a: 'Yes — it is a standard React + Vite app. Run npm run build and host the dist/ folder on any static host.' },
  { q: 'Is a backend planned?', a: 'Roadmap includes optional sync (e.g. Supabase) behind the same action API, so the app can go multi-device without a rewrite.' },
  { q: 'Is it really free?', a: 'The app is MIT licensed and free to use, modify and learn from — forever.' },
]

function useAutoCycle(len, interval) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % len), interval)
    return () => clearInterval(t)
  }, [len, interval])
  return [idx, setIdx]
}

function Counter({ to, suffix = '', decimals = 0 }) {
  const [ref, inView] = useInView()
  const n = useCountUp(to, { run: inView, duration: 1200 })
  const shown = decimals ? n.toFixed(decimals) : Math.round(n).toLocaleString()
  return (
    <span ref={ref} className="tabular text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
      {shown}
      {suffix}
    </span>
  )
}

function LiveBars() {
  const [heights, setHeights] = useState(Array(12).fill(6))
  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      setHeights([42, 58, 47, 63, 71, 60, 68, 82, 74, 88, 79, 95]),
    )
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div className="flex h-44 items-end gap-2">
      {heights.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm bg-chart-2/70 transition-[height] duration-700 ease-out"
          style={{ height: `${v}%`, transitionDelay: `${i * 45}ms` }}
        />
      ))}
    </div>
  )
}

function Nav() {
  const { db, toggleTheme } = useStore()
  const dark = db.settings.theme === 'dark'
  const links = [
    ['#features', 'Features'],
    ['#workflow', 'Workflow'],
    ['#product', 'Product'],
    ['#compare', 'Compare'],
    ['#pricing', 'Pricing'],
    ['#faq', 'FAQ'],
  ]
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-fg text-sm font-bold text-bg">N</span>
          <span className="text-sm font-semibold tracking-tight text-fg">Northwind</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted lg:flex">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="transition-colors hover:text-fg">{label}</a>
          ))}
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

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-grid pointer-events-none absolute inset-x-0 top-0 h-[640px]" />
      <div className="relative mx-auto max-w-6xl px-4 pt-24 pb-20 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
              Lightweight studio operating system
            </span>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="mt-6 text-6xl font-semibold tracking-tight text-fg sm:text-7xl lg:text-8xl">
              Run your studio
              <br />
              <span className="text-faint">from one place.</span>
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mx-auto mt-7 max-w-2xl text-xl leading-relaxed text-muted">
              Northwind keeps your clients, projects, tasks and invoices together in a single,
              fast workspace — so you spend less time managing work and more time doing it.
            </p>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button as={Link} to="/dashboard" variant="primary" size="lg">
                Open the app <ArrowRight size={17} />
              </Button>
              <Button as="a" href="#workflow" variant="outline" size="lg">
                See how it works
              </Button>
            </div>
          </Reveal>
          <Reveal delay={340}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-2 text-xs text-faint">
              {['Kanban tasks', 'Global search', 'Dark & light', 'Invoicing', 'Works offline'].map((p) => (
                <span key={p} className="rounded-full border border-line bg-surface/80 px-3 py-1">{p}</span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={400}>
            <div className="mt-12 flex justify-center">
              <a href="#product" className="flex flex-col items-center gap-1.5 text-[11px] text-faint transition-colors hover:text-fg">
                <span>Scroll to explore</span>
                <ChevronDown size={18} className="animate-bounce-down" />
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={480} y={40} className="relative mx-auto mt-16 max-w-5xl">
          <div className="rounded-2xl border border-line bg-surface p-4 shadow-pop sm:p-6">
            <div className="flex items-center gap-2 border-b border-line pb-3">
              <span className="h-3 w-3 rounded-full bg-surface-3" />
              <span className="h-3 w-3 rounded-full bg-surface-3" />
              <span className="h-3 w-3 rounded-full bg-surface-3" />
              <span className="ml-3 text-xs text-faint">northwind / dashboard</span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-5 sm:grid-cols-4">
              {[
                ['Active projects', '8'],
                ['Open tasks', '11'],
                ['Outstanding', '$19.4k'],
                ['Revenue (Oct)', '$31.2k'],
              ].map(([l, v]) => (
                <div key={l} className="rounded-lg border border-line bg-surface-2 p-3.5">
                  <p className="text-[10px] tracking-wide text-faint uppercase">{l}</p>
                  <p className="tabular mt-1 text-2xl font-semibold text-fg">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-line bg-surface-2 p-4">
              <LiveBars />
            </div>
          </div>

          <div className="animate-bob absolute -top-6 -right-2 hidden sm:block lg:-right-10">
            <div className="flex items-center gap-2.5 rounded-xl border border-line bg-bg p-3 shadow-pop">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-success-soft text-success">
                <Check size={15} />
              </span>
              <div>
                <p className="text-xs font-semibold text-fg">Task completed</p>
                <p className="text-[11px] text-faint">Invoice templating · 2m ago</p>
              </div>
            </div>
          </div>
          <div className="animate-bob-delay absolute -bottom-6 -left-2 hidden sm:block lg:-left-10">
            <div className="flex items-center gap-2.5 rounded-xl border border-line bg-bg p-3 shadow-pop">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-info-soft text-info">
                <ReceiptText size={15} />
              </span>
              <div>
                <p className="text-xs font-semibold text-fg">Invoice paid</p>
                <p className="text-[11px] text-faint">Acme Corp · $8,400</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function MarqueeBand() {
  const row = [...BUILT_FOR]
  return (
    <section className="marquee-paused overflow-hidden border-y border-line bg-surface py-7">
      <p className="mb-4 text-center text-xs tracking-widest text-faint uppercase">Built for</p>
      <div className="marquee-mask relative">
        <div className="animate-marquee flex w-max items-center gap-3">
          {[...row, ...row].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="whitespace-nowrap rounded-full border border-line bg-bg px-5 py-2 text-sm text-muted"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatsBand() {
  const stats = [
    { to: 6, suffix: '', label: 'Clients seeded' },
    { to: 8, suffix: '', label: 'Projects shipped' },
    { to: 11, suffix: '', label: 'Open tasks' },
    { to: 100, suffix: '%', label: 'Offline ready' },
  ]
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-4 py-20 sm:px-6 lg:grid-cols-4">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 90} className="text-center">
          <Counter to={s.to} suffix={s.suffix} />
          <p className="mt-2 text-sm text-muted">{s.label}</p>
        </Reveal>
      ))}
    </section>
  )
}

function Problem() {
  const pains = [
    [Inbox, 'Email threads', 'Every update buried in a chain that never ends.'],
    [FileSpreadsheet, 'Spreadsheets', 'Out of date the moment they are saved.'],
    [MessageCircle, 'Group chats', 'Decisions, deadlines and details lost forever.'],
    [NotebookPen, 'Notebooks', 'Nobody can search them, nobody remembers them.'],
  ]
  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="max-w-2xl">
          <Reveal>
            <p className="text-sm font-medium text-faint">The problem</p>
            <h2 className="mt-2 text-5xl font-semibold tracking-tight text-fg">
              Studio life lives in scattered places.
            </h2>
            <p className="mt-4 text-lg text-muted">
              Nobody can answer the simplest questions — which clients owe money, what shipped last
              month, what is due this week.
            </p>
          </Reveal>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pains.map(([Icon, t, d], i) => (
            <Reveal key={t} delay={i * 90}>
              <div className="hover-lift h-full rounded-xl border border-line bg-bg p-7">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-surface-2 text-muted">
                  <Icon size={19} />
                </span>
                <h3 className="mt-5 text-base font-semibold text-fg">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Workflow() {
  const [idx, setIdx] = useAutoCycle(WORKFLOW.length, 4000)
  const step = WORKFLOW[idx]
  return (
    <section id="workflow" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal>
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-faint">The workflow</p>
          <h2 className="mt-2 text-5xl font-semibold tracking-tight text-fg">
            From first client to final invoice.
          </h2>
        </div>
      </Reveal>
      <Reveal delay={120}>
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="space-y-2">
            {WORKFLOW.map((w, i) => (
              <div
                key={w.title}
                onMouseEnter={() => setIdx(i)}
                className={`rounded-xl border p-5 transition-all duration-300 ${
                  idx === i
                    ? 'border-line-strong bg-fg text-bg'
                    : 'border-line bg-surface text-muted opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <w.icon size={18} />
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${idx === i ? 'text-bg' : 'text-fg'}`}>
                      <span className="tabular mr-2 text-xs opacity-60">0{i + 1}</span>{w.title}
                    </p>
                    <p className={`mt-0.5 text-sm ${idx === i ? 'text-bg/70' : 'text-muted'}`}>{w.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            key={idx}
            className="animate-pop flex flex-col justify-center rounded-2xl border border-line bg-surface p-8 shadow-pop"
          >
            <div className="flex items-center gap-4">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-fg text-bg">
                <step.icon size={24} />
              </span>
              <div>
                <p className="text-sm text-faint">Step {idx + 1} / {WORKFLOW.length}</p>
                <p className="text-xl font-semibold text-fg">{step.title}</p>
              </div>
            </div>
            <p className="mt-6 text-lg leading-relaxed text-muted">{step.text}</p>
            <div className="mt-8 flex items-center gap-2">
              {WORKFLOW.map((_, i) => (
                <span
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                    i === idx ? 'w-8 bg-fg' : 'w-1.5 bg-surface-3'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function DemoMock({ active }) {
  if (active === 'dashboard') {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['Active projects', '8'],
          ['Open tasks', '11'],
          ['Outstanding', '$19.4k'],
          ['Revenue', '$31.2k'],
        ].map(([l, v]) => (
          <div key={l} className="rounded-lg border border-line bg-surface-2 p-3.5">
            <p className="text-[10px] tracking-wide text-faint uppercase">{l}</p>
            <p className="tabular mt-1 text-xl font-semibold text-fg">{v}</p>
          </div>
        ))}
        <div className="col-span-2 row-span-2 rounded-lg border border-line bg-surface-2 p-4">
          <p className="text-[10px] text-faint uppercase">Revenue trend</p>
          <LiveBars />
        </div>
        <div className="rounded-lg border border-line bg-surface-2 p-4">
          <p className="text-[10px] text-faint uppercase">Task status</p>
          <div className="mt-3 space-y-2.5">
            {[70, 45, 85].map((w, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted">
                  <span>{['To do', 'In progress', 'Done'][i]}</span>
                  <span>{[4, 3, 4][i]}</span>
                </div>
                <div className="h-2 rounded-full bg-surface-3">
                  <div className="h-2 rounded-full bg-chart-1" style={{ width: `${w}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  if (active === 'tasks') {
    return (
      <div className="grid grid-cols-3 gap-3">
        {['To do', 'In progress', 'Done'].map((col) => (
          <div key={col} className="rounded-lg border border-line bg-surface-2 p-3">
            <p className="px-1 pb-2 text-[10px] font-semibold text-faint uppercase">{col}</p>
            <div className="space-y-2.5">
              {[{ t: 'Wire onboarding screen', d: '2d left' }, { t: 'Homepage copy', d: '4d left' }].map((c) => (
                <div key={c.t} className="animate-pop rounded-lg border border-line bg-bg p-3">
                  <p className="text-xs text-fg">{c.t}</p>
                  <p className="mt-1.5 text-[10px] text-faint">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="space-y-3">
      {[
        ['Aug', 'Acme Corp · Website', '$12,400', 'paid'],
        ['Sep', 'Lumen Labs · Brand', '$4,800', 'outstanding'],
        ['Sep', 'Nova Works · Landing', '$9,200', 'paid'],
        ['Oct', 'Kite Studio · Sprints', '$8,400', 'overdue'],
      ].map(([m, client, amt, st]) => (
        <div key={client} className="animate-pop flex items-center gap-3 rounded-lg border border-line bg-surface-2 p-4">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-fg text-bg">
            <ReceiptText size={15} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-fg">{client}</p>
            <p className="text-[11px] text-faint">Invoice · {m}</p>
          </div>
          <span className={`tabular text-sm font-semibold ${st === 'paid' ? 'text-success' : st === 'overdue' ? 'text-danger' : 'text-warning'}`}>
            {amt}
          </span>
        </div>
      ))}
    </div>
  )
}

function ProductDemo() {
  const tabs = [
    ['dashboard', LayoutDashboard, 'Dashboard'],
    ['tasks', ListChecks, 'Tasks'],
    ['invoices', ReceiptText, 'Invoices'],
  ]
  const [idx, setIdx] = useAutoCycle(tabs.length, 4500)
  const active = tabs[idx][0]
  return (
    <section id="product" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-faint">The product</p>
            <h2 className="mt-2 text-5xl font-semibold tracking-tight text-fg">See it moving, live.</h2>
            <p className="mt-4 text-lg text-muted">
              Real modules, cycling automatically — not static screenshots.
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-12 flex justify-center">
            <div className="inline-flex rounded-lg border border-line bg-bg p-1">
              {tabs.map(([value, Icon, label], i) => (
                <button
                  key={value}
                  onClick={() => setIdx(i)}
                  className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                    i === idx ? 'bg-fg text-bg' : 'text-muted hover:bg-surface-2 hover:text-fg'
                  }`}
                >
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-4xl">
            <div className="rounded-2xl border border-line bg-bg p-4 shadow-pop sm:p-6">
              <div className="flex items-center gap-2 border-b border-line pb-3">
                <span className="h-3 w-3 rounded-full bg-surface-3" />
                <span className="h-3 w-3 rounded-full bg-surface-3" />
                <span className="h-3 w-3 rounded-full bg-surface-3" />
                <span className="ml-3 text-xs text-faint">northwind / {active}</span>
              </div>
              <div key={active} className="animate-pop pt-5">
                <DemoMock active={active} />
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-center gap-2">
            {tabs.map(([value], i) => (
              <button
                key={value}
                onClick={() => setIdx(i)}
                aria-label={value}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === idx ? 'w-10 bg-fg' : 'w-2 bg-surface-3'}`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="text-sm font-medium text-faint">Everything</p>
            <h2 className="mt-2 text-5xl font-semibold tracking-tight text-fg">A focused toolkit. Nothing wasted.</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Every module connects to the others, so a new client becomes a project, the project
              becomes tasks, and the work becomes an invoice.
            </p>
          </Reveal>
        </div>
        <div className="space-y-3 lg:col-span-7">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 70}>
              <div className="hover-lift group flex items-start gap-5 rounded-xl border border-line bg-surface p-6">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-fg transition-colors group-hover:bg-fg group-hover:text-bg">
                  <f.icon size={20} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-fg">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{f.text}</p>
                </div>
                <span className="tabular ml-auto hidden text-sm text-faint sm:block">0{i + 1}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Compare() {
  return (
    <section id="compare" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-faint">The comparison</p>
            <h2 className="mt-2 text-5xl font-semibold tracking-tight text-fg">The old way vs. Northwind.</h2>
          </div>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Reveal delay={80}>
            <div className="h-full rounded-2xl border border-line bg-bg p-8 opacity-90">
              <span className="inline-flex items-center gap-2 rounded-full bg-danger-soft px-3 py-1 text-xs font-medium text-danger">
                <X size={13} /> Traditional
              </span>
              <h3 className="mt-5 text-xl font-semibold text-fg">Scattered, reactive, opaque</h3>
              <ul className="mt-6 space-y-3.5">
                {OLD_WAY.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-sm text-muted">
                    <X size={16} className="mt-0.5 shrink-0 text-danger" /> {o}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="h-full rounded-2xl border border-line-strong bg-bg p-8 shadow-pop">
              <span className="inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1 text-xs font-medium text-success">
                <Zap size={13} /> Northwind
              </span>
              <h3 className="mt-5 text-xl font-semibold text-fg">Unified, proactive, transparent</h3>
              <ul className="mt-6 space-y-3.5">
                {NEW_WAY.map((n) => (
                  <li key={n} className="flex items-start gap-3 text-sm text-fg">
                    <Check size={16} className="mt-0.5 shrink-0 text-success" /> {n}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal>
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-medium text-faint">Pricing</p>
          <h2 className="mt-2 text-5xl font-semibold tracking-tight text-fg">Simple plans, no surprises</h2>
          <p className="mt-4 text-lg text-muted">Start free. Upgrade when your studio grows.</p>
        </div>
      </Reveal>
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        {PLANS.map((p, i) => (
          <Reveal key={p.name} delay={i * 110}>
            <div
              className={`hover-lift relative flex h-full flex-col rounded-2xl border p-8 ${
                p.featured ? 'border-line-strong bg-fg text-bg shadow-pop' : 'border-line bg-surface'
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-fg px-3 py-1 text-[11px] font-medium text-bg">
                  Most popular
                </span>
              )}
              <p className={`text-sm font-semibold ${p.featured ? 'text-bg' : 'text-fg'}`}>{p.name}</p>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className={`text-4xl font-semibold tracking-tight ${p.featured ? 'text-bg' : 'text-fg'}`}>{p.price}</span>
                <span className={`text-xs ${p.featured ? 'text-bg/60' : 'text-faint'}`}>{p.note}</span>
              </div>
              <ul className={`mt-6 flex-1 space-y-3 ${p.featured ? 'text-bg/80' : 'text-muted'}`}>
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check size={16} className={`mt-0.5 shrink-0 ${p.featured ? 'text-bg' : 'text-success'}`} /> {f}
                  </li>
                ))}
              </ul>
              <Button as={Link} to="/dashboard" variant={p.featured ? 'secondary' : 'outline'} className="mt-8 w-full">
                Open app
              </Button>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Faq() {
  const [openIdx, setOpenIdx] = useState(0)
  return (
    <section id="faq" className="border-t border-line">
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <Reveal>
          <div className="text-center">
            <p className="text-sm font-medium text-faint">FAQ</p>
            <h2 className="mt-2 text-5xl font-semibold tracking-tight text-fg">Questions, answered</h2>
          </div>
        </Reveal>
        <div className="mt-12 divide-y divide-line rounded-2xl border border-line bg-surface">
          {FAQS.map((f, i) => {
            const open = openIdx === i
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpenIdx(open ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-sm font-medium text-fg">{f.q}</span>
                  <span
                    className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 ${
                      open ? 'rotate-180 border-fg text-fg' : 'border-line text-faint'
                    }`}
                  >
                    <ChevronDown size={14} />
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-muted">{f.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  const points = ['No signup', 'Zero setup', 'Saved automatically', 'Works offline']
  return (
    <section className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal>
          <div className="rounded-3xl border border-line-strong bg-fg px-6 py-20 text-center sm:px-12">
            <h2 className="text-5xl font-semibold tracking-tight text-bg sm:text-6xl">
              Start in seconds.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-lg text-bg/70">
              Open the workspace and it loads with everything ready to explore. Your changes save
              automatically.
            </p>
            <div className="mt-8 flex justify-center">
              <Button as={Link} to="/dashboard" variant="secondary" size="lg">
                Open the app <ArrowRight size={17} />
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              {points.map((p) => (
                <span key={p} className="flex items-center gap-1.5 rounded-full border border-bg/20 px-3 py-1.5 text-xs text-bg/80">
                  <Check size={13} /> {p}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg">
      <Nav />
      <Hero />
      <MarqueeBand />
      <StatsBand />
      <Problem />
      <Workflow />
      <ProductDemo />
      <Features />
      <Compare />
      <Pricing />
      <Faq />
      <FinalCta />
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-fg text-xs font-bold text-bg">N</span>
            <span className="text-sm text-muted">Northwind — Studio OS</span>
          </div>
          <nav className="flex items-center gap-6 text-xs text-faint">
            <Link to="/dashboard" className="hover:text-fg">Dashboard</Link>
            <a href="#workflow" className="hover:text-fg">Workflow</a>
            <a href="#product" className="hover:text-fg">Product</a>
            <a href="#pricing" className="hover:text-fg">Pricing</a>
            <a href="#faq" className="hover:text-fg">FAQ</a>
          </nav>
          <p className="text-xs text-faint">© {new Date().getFullYear()} Northwind</p>
        </div>
      </footer>
    </div>
  )
}