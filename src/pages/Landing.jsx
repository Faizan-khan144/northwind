import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  ChevronDown,
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
import { useCountUp, useInView } from '../lib/hooks.js'
import { Button, Reveal } from '../components/ui.jsx'

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

const STEPS = [
  { n: '01', title: 'Add a client', text: 'Names, contacts, industry and notes — everything in one place.' },
  { n: '02', title: 'Spin up projects', text: 'Set a budget, a deadline and a team. Progress is tracked per project.' },
  { n: '03', title: 'Ship and bill', text: 'Plan work on the board, mark it done, and invoice from the same flow.' },
]

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    note: 'For solo exploration',
    features: ['1 workspace seat', 'Up to 5 projects', 'Unlimited clients', 'Local data persistence'],
  },
  {
    name: 'Pro',
    price: '$29',
    note: 'per month, per seat',
    features: ['Unlimited projects', 'Invoicing & exports', 'Priority support', 'Custom fields'],
    featured: true,
  },
  {
    name: 'Studio',
    price: '$79',
    note: 'per month, for teams',
    features: ['Up to 10 seats', 'Roles & permissions', 'API access', 'Dedicated onboarding'],
  },
]

const FAQS = [
  { q: 'Do I need an account to use it?', a: 'No. Northwind runs entirely in your browser with zero signup. Open the app and start working immediately.' },
  { q: 'Where is my data stored?', a: 'Everything is saved to your browser via localStorage under a versioned key. Deleting site data resets the workspace to the demo seed.' },
  { q: 'Can I host it myself?', a: 'Yes — it is a standard React + Vite app. Run npm run build and host the dist/ folder on any static host.' },
  { q: 'Is a backend planned?', a: 'Roadmap includes optional sync (e.g. Supabase) behind the same action API, so the app can go multi-device without a rewrite.' },
  { q: 'Is it really free?', a: 'The app is MIT licensed and free to use, modify and learn from — forever.' },
]

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
    <div className="flex h-40 items-end gap-2">
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
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-fg text-sm font-bold text-bg">N</span>
          <span className="text-sm font-semibold tracking-tight text-fg">Northwind</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
          <a href="#features" className="transition-colors hover:text-fg">Features</a>
          <a href="#how" className="transition-colors hover:text-fg">How it works</a>
          <a href="#pricing" className="transition-colors hover:text-fg">Pricing</a>
          <a href="#faq" className="transition-colors hover:text-fg">FAQ</a>
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
    <section className="mx-auto max-w-6xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
            Lightweight studio operating system
          </span>
        </Reveal>
        <Reveal delay={90}>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-fg sm:text-6xl lg:text-7xl">
            Run your studio
            <br />
            from one place.
          </h1>
        </Reveal>
        <Reveal delay={180}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
            Northwind keeps your clients, projects, tasks and invoices together in a single,
            fast workspace — so you can spend less time managing work and more time doing it.
          </p>
        </Reveal>
        <Reveal delay={260}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button as={Link} to="/dashboard" variant="primary" size="lg">
              Open the app <ArrowRight size={17} />
            </Button>
            <Button as="a" href="#features" variant="outline" size="lg">
              Explore features
            </Button>
          </div>
        </Reveal>
        <Reveal delay={340}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-faint">
            {['Kanban tasks', 'Global search', 'Dark & light', 'Invoicing', 'Works offline'].map((p) => (
              <span key={p} className="rounded-full border border-line bg-surface px-3 py-1">
                {p}
              </span>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal delay={420} y={32} className="mx-auto mt-16 max-w-4xl">
        <div className="rounded-xl border border-line bg-surface p-4 shadow-card sm:p-6">
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
                <p className="tabular mt-1 text-xl font-semibold text-fg">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-line bg-surface-2 p-4">
            <LiveBars />
          </div>
        </div>
      </Reveal>
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
    <section className="border-y border-line bg-surface">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-14 sm:px-6 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 90} className="text-center">
            <Counter to={s.to} suffix={s.suffix} />
            <p className="mt-2 text-sm text-muted">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal>
        <div className="max-w-xl">
          <p className="text-sm font-medium text-faint">Features</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-fg">Everything a small studio needs</h2>
          <p className="mt-3 text-lg text-muted">A focused set of tools — nothing more, nothing less.</p>
        </div>
      </Reveal>
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 80}>
            <div className="hover-lift h-full rounded-xl border border-line bg-surface p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-surface-2 text-fg">
                <f.icon size={19} />
              </span>
              <h3 className="mt-5 text-base font-semibold text-fg">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="how" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal>
          <div className="max-w-xl">
            <p className="text-sm font-medium text-faint">How it works</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight text-fg">From first client to final invoice</h2>
          </div>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 110}>
              <div className="relative h-full overflow-hidden rounded-xl border border-line bg-bg p-7">
                <span className="tabular text-5xl font-semibold text-surface-3">{s.n}</span>
                <h3 className="mt-6 text-base font-semibold text-fg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ModulesPitch() {
  const modules = [
    [FolderKanban, 'Projects', 'Budgets, progress and team members on every job.'],
    [ListChecks, 'Tasks', 'A Kanban board that mirrors your delivery flow.'],
    [Users, 'Clients', 'A clean directory with contacts, notes and spend history.'],
    [ReceiptText, 'Invoices', 'Paid, outstanding and overdue totals at a glance.'],
  ]
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div>
            <p className="text-sm font-medium text-faint">Modules</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight text-fg">Built around how you actually work</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Every module connects to the others, so a new client instantly becomes a project,
              a project becomes tasks, and the work becomes an invoice.
            </p>
            <ul className="mt-8 space-y-6">
              {modules.map(([Icon, t, d]) => (
                <li key={t} className="flex gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-fg">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-fg">{t}</p>
                    <p className="mt-1 text-sm text-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={140}>
          <div className="rounded-xl border border-line bg-surface p-5">
            <p className="px-1 pb-4 text-xs text-faint">This week on the board</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                ['To do', 'bg-surface-2', [
                  ['Write onboarding copy', 'high'],
                  ['Scope check-in QR', 'low'],
                ]],
                ['In progress', 'bg-surface-2', [
                  ['Wire patient auth', 'urgent'],
                  ['Lead capture forms', 'medium'],
                ]],
                ['Done', 'bg-surface-2', [
                  ['SEO + sitemap', 'medium'],
                  ['Retention cohort', 'low'],
                ]],
              ].map(([name, colClass, cards]) => (
                <div key={name} className={colClass}>
                  <div className="rounded-lg bg-surface-2 p-2.5">
                    <div className="flex items-center justify-between px-1 pb-2">
                      <span className="text-[11px] font-semibold text-fg">{name}</span>
                    </div>
                    <div className="space-y-2">
                      {cards.map(([title, prio]) => (
                        <div key={title} className="rounded-lg border border-line bg-surface p-2.5">
                          <p className="text-xs leading-snug text-fg">{title}</p>
                          <div className="mt-2 flex items-center gap-1.5">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                prio === 'urgent' ? 'bg-danger' : prio === 'high' ? 'bg-warning' : 'bg-chart-3'
                              }`}
                            />
                            <span className="text-[10px] text-faint">{prio}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-medium text-faint">Pricing</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight text-fg">Simple plans, no surprises</h2>
            <p className="mt-3 text-lg text-muted">Start free. Upgrade when your studio grows.</p>
          </div>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 110}>
              <div
                className={`relative flex h-full flex-col rounded-xl border p-8 ${
                  p.featured ? 'border-fg bg-bg shadow-card' : 'border-line bg-surface'
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-fg px-3 py-1 text-[11px] font-medium text-bg">
                    Most popular
                  </span>
                )}
                <p className="text-sm font-semibold text-fg">{p.name}</p>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-4xl font-semibold tracking-tight text-fg">{p.price}</span>
                  <span className="text-xs text-faint">{p.note}</span>
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
                      <Check size={16} className="mt-0.5 shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button as={Link} to="/dashboard" variant={p.featured ? 'primary' : 'outline'} className="mt-8 w-full">
                  Open app
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Faq() {
  const [openIdx, setOpenIdx] = useState(0)
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <Reveal>
        <div className="text-center">
          <p className="text-sm font-medium text-faint">FAQ</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-fg">Questions, answered</h2>
        </div>
      </Reveal>
      <div className="mt-10 divide-y divide-line rounded-xl border border-line bg-surface">
        {FAQS.map((f, i) => {
          const open = openIdx === i
          return (
            <button
              key={f.q}
              onClick={() => setOpenIdx(open ? -1 : i)}
              className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="text-sm font-medium text-fg">{f.q}</span>
              <ChevronDown
                size={18}
                className={`mt-0.5 shrink-0 text-faint transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              />
            </button>
          )
        })}
      </div>
      <div className="px-6">
        {FAQS.map((f, i) =>
          openIdx === i ? (
            <p key={f.q} className="border-x border-b border-line bg-surface px-6 py-4 text-sm leading-relaxed text-muted">
              {f.a}
            </p>
          ) : null,
        )}
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <Reveal>
        <div className="rounded-2xl border border-line bg-fg px-6 py-16 text-center sm:px-12">
          <h2 className="text-3xl font-semibold tracking-tight text-bg sm:text-4xl">Start in seconds</h2>
          <p className="mx-auto mt-4 max-w-md text-base text-bg/70">
            Open the workspace and it loads with everything ready to explore. Your changes save
            automatically.
          </p>
          <div className="mt-8 flex justify-center">
            <Button as={Link} to="/dashboard" variant="secondary" size="lg">
              Open the app <ArrowRight size={17} />
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg">
      <Nav />
      <Hero />
      <StatsBand />
      <Features />
      <HowItWorks />
      <ModulesPitch />
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
            <a href="#features" className="hover:text-fg">Features</a>
            <a href="#pricing" className="hover:text-fg">Pricing</a>
            <a href="#faq" className="hover:text-fg">FAQ</a>
          </nav>
          <p className="text-xs text-faint">© {new Date().getFullYear()} Northwind</p>
        </div>
      </footer>
    </div>
  )
}