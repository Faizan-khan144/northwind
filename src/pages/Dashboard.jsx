import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  CalendarClock,
  FolderKanban,
  ListChecks,
  Plus,
  ReceiptText,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react'
import { useStore } from '../store.jsx'
import { AreaChart, Donut } from '../components/Charts.jsx'
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  PageHeader,
  ProgressBar,
  Reveal,
  StatCard,
} from '../components/ui.jsx'
import { INVOICE_STATUS, PROJECT_STATUS, TASK_COLUMNS, TASK_STATUS } from '../data.js'
import { compactCurrency, currency, formatDate, formatDateTime, relativeDue } from '../lib/utils.js'

const ACTIVITY_ICON = {
  task: ListChecks,
  invoice: Wallet,
  project: FolderKanban,
  client: Users,
}

const QUICK_ACTIONS = [
  { to: '/clients', icon: UserPlus, label: 'New client', hint: 'Clients' },
  { to: '/projects', icon: FolderKanban, label: 'New project', hint: 'Projects' },
  { to: '/tasks', icon: ListChecks, label: 'New task', hint: 'Tasks' },
  { to: '/invoices', icon: ReceiptText, label: 'New invoice', hint: 'Invoices' },
]

export default function Dashboard() {
  const { db } = useStore()
  const { projects, tasks, invoices, activities, members, revenue, clients } = db

  const activeProjects = projects.filter((p) => p.status === 'active' || p.status === 'review')
  const openTasks = tasks.filter((t) => t.status !== 'done')
  const outstanding = invoices.filter((i) => i.status !== 'paid').reduce((s, i) => s + i.amount, 0)
  const thisMonth = revenue.at(-1)?.value ?? 0
  const prevMonth = revenue.at(-2)?.value ?? 0
  const revenueDelta = prevMonth ? Math.round(((thisMonth - prevMonth) / prevMonth) * 100) : 0

  const byStatus = TASK_COLUMNS.map((s, i) => ({
    label: TASK_STATUS[s].label,
    value: tasks.filter((t) => t.status === s).length,
    color: `var(--chart-${i + 1})`,
  }))

  const memberById = Object.fromEntries(members.map((m) => [m.id, m]))
  const clientById = Object.fromEntries(clients.map((c) => [c.id, c]))

  const upcoming = [...openTasks]
    .filter((t) => t.due)
    .sort((a, b) => new Date(a.due) - new Date(b.due))
    .slice(0, 6)

  const topProjects = [...projects]
    .filter((p) => p.status !== 'completed')
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5)

  const workload = members.map((m) => {
    const assigned = tasks.filter((t) => t.assigneeId === m.id)
    const open = assigned.filter((t) => t.status !== 'done').length
    return { m, total: assigned.length, open, pct: assigned.length ? Math.round((open / assigned.length) * 100) : 0 }
  })

  const awaiting = invoices
    .filter((i) => i.status !== 'paid')
    .sort((a, b) => new Date(a.due) - new Date(b.due))
    .slice(0, 5)

  const doneShare = tasks.length ? Math.round((tasks.filter((t) => t.status === 'done').length / tasks.length) * 100) : 0

  return (
    <div className="space-y-8">
      <Reveal y={10}>
        <PageHeader
          title="Dashboard"
          subtitle={`Welcome back — here's what's moving across ${projects.length} projects.`}
          actions={
            <Button as={Link} to="/projects" variant="primary" size="md">
              <Plus size={16} /> New project
            </Button>
          }
        />
      </Reveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Reveal delay={40}><StatCard label="Active projects" value={activeProjects.length} animate={activeProjects.length} delta={12} icon={FolderKanban} /></Reveal>
        <Reveal delay={90}><StatCard label="Open tasks" value={openTasks.length} animate={openTasks.length} delta={-4} icon={ListChecks} /></Reveal>
        <Reveal delay={140}><StatCard label="Outstanding" value={compactCurrency(outstanding)} delta={8} icon={Wallet} /></Reveal>
        <Reveal delay={190}>
          <StatCard label="Revenue (Oct)" value={compactCurrency(thisMonth)} animate={thisMonth} format={(n) => compactCurrency(n)} delta={revenueDelta} icon={TrendingUp} />
        </Reveal>
      </div>

      <Reveal delay={80}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className="hover-lift group flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3.5"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-fg transition-colors group-hover:bg-fg group-hover:text-bg">
                <a.icon size={18} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-fg">{a.label}</span>
                <span className="block text-[11px] text-faint">{a.hint}</span>
              </span>
            </Link>
          ))}
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Reveal delay={60} className="xl:col-span-2">
          <Card className="h-full">
            <CardHeader
              title="Revenue trend"
              subtitle="Paid + invoiced, last 8 months"
              action={<Badge tone="success" dot>On track</Badge>}
            />
            <div className="px-4 pt-4 pb-2">
              <AreaChart data={revenue} height={240} />
              <div className="flex justify-between px-1 pt-1">
                {revenue.map((r) => (
                  <span key={r.month} className="text-[10px] font-medium text-faint">
                    {r.month}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-8 border-t border-line px-5 py-3.5">
              <div>
                <p className="text-[11px] text-faint">This month</p>
                <p className="tabular text-base font-semibold text-fg">{currency(thisMonth)}</p>
              </div>
              <div>
                <p className="text-[11px] text-faint">Avg / month</p>
                <p className="tabular text-base font-semibold text-fg">
                  {currency(Math.round(revenue.reduce((s, r) => s + r.value, 0) / revenue.length))}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-faint">Best month</p>
                <p className="tabular text-base font-semibold text-fg">
                  {compactCurrency(Math.max(...revenue.map((r) => r.value)))}
                </p>
              </div>
            </div>
          </Card>
        </Reveal>

        <Reveal delay={120}>
          <Card className="h-full">
            <CardHeader title="Tasks by status" subtitle={`${tasks.length} total`} />
            <div className="flex flex-col items-center gap-4 px-5 py-6">
              <Donut
                segments={byStatus}
                size={178}
                thickness={18}
                centerLabel={`${doneShare}%`}
                centerSub="completed"
              />
              <div className="grid w-full grid-cols-2 gap-2">
                {byStatus.map((s) => (
                  <div key={s.label} className="flex items-center gap-2 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-muted">{s.label}</span>
                    <span className="tabular ml-auto font-medium text-fg">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Reveal delay={60} className="xl:col-span-2">
          <Card>
            <CardHeader
              title="Project progress"
              subtitle="Highest completion first"
              action={
                <Button as={Link} to="/projects" variant="ghost" size="sm">
                  View all <ArrowUpRight size={14} />
                </Button>
              }
            />
            <div className="divide-y divide-line">
              {topProjects.map((p) => (
                <Link
                  key={p.id}
                  to={`/projects/${p.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-fg">{p.name}</p>
                      <Badge tone={PROJECT_STATUS[p.status].tone}>{PROJECT_STATUS[p.status].label}</Badge>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-faint">
                      {clientById[p.clientId]?.name} · due {formatDate(p.due)}
                    </p>
                  </div>
                  <div className="hidden w-44 sm:block">
                    <ProgressBar value={p.progress} accent={clientById[p.clientId]?.accent} showLabel />
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </Reveal>

        <div className="space-y-4">
          <Reveal delay={100}>
            <Card>
              <CardHeader title="Upcoming deadlines" subtitle="Next tasks due" />
              <div className="divide-y divide-line">
                {upcoming.map((t) => {
                  const due = relativeDue(t.due)
                  return (
                    <div key={t.id} className="flex items-center gap-3 px-5 py-3.5">
                      <Avatar name={memberById[t.assigneeId]?.name ?? '—'} accent={memberById[t.assigneeId]?.accent} size={32} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-fg">{t.title}</p>
                        <p className="text-[11px] text-faint">{clientById[projects.find((p) => p.id === t.projectId)?.clientId]?.name}</p>
                      </div>
                      <Badge tone={due.tone}>{due.label}</Badge>
                    </div>
                  )
                })}
              </div>
            </Card>
          </Reveal>

          <Reveal delay={140}>
            <Card>
              <CardHeader title="Awaiting payment" subtitle="Unpaid invoices, soonest first" action={
                <Button as={Link} to="/invoices" variant="ghost" size="sm">
                  View all <ArrowUpRight size={14} />
                </Button>
              } />
              <div className="divide-y divide-line">
                {awaiting.map((i) => {
                  return (
                    <div key={i.id} className="flex items-center gap-3 px-5 py-3.5">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-muted">
                        <ReceiptText size={15} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-fg">{clientById[i.clientId]?.name ?? 'Client'}</p>
                        <p className="text-[11px] text-faint">Invoice #{i.number}</p>
                      </div>
                      <div className="text-right">
                        <p className="tabular text-sm font-semibold text-fg">{currency(i.amount)}</p>
                        <Badge tone={INVOICE_STATUS[i.status].tone}>{INVOICE_STATUS[i.status].label}</Badge>
                      </div>
                    </div>
                  )
                })}
                {awaiting.length === 0 && <p className="px-5 py-6 text-center text-sm text-faint">Nothing outstanding. Nice.</p>}
              </div>
            </Card>
          </Reveal>

          <Reveal delay={180}>
            <Card>
              <CardHeader title="Recent activity" subtitle="Latest across the workspace" />
              <div className="divide-y divide-line">
                {activities.slice(0, 4).map((a) => {
                  const Icon = ACTIVITY_ICON[a.type] ?? CalendarClock
                  return (
                    <div key={a.id} className="flex items-start gap-3 px-5 py-3">
                      <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-surface-3 text-muted">
                        <Icon size={14} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-fg">{a.message}</p>
                        <p className="mt-0.5 text-[11px] text-faint">
                          {memberById[a.actorId]?.name ?? 'Northwind'} · {formatDateTime(a.at)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </Reveal>
        </div>
      </div>

      <Reveal delay={120}>
        <Card>
          <CardHeader title="Team workload" subtitle="Open tasks per member" />
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
            {workload.map(({ m: member, total, open, pct }) => (
              <div key={member.id} className="rounded-xl border border-line bg-surface-2 p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={member.name} accent={member.accent} size={36} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-fg">{member.name}</p>
                    <p className="text-[11px] text-faint">{member.role}</p>
                  </div>
                  <span className="ml-auto rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-fg">
                    {open}/{total}
                  </span>
                </div>
                <ProgressBar value={pct} accent={member.accent} className="mt-3.5" />
                <p className="mt-1.5 text-[11px] text-faint">{pct}% of tasks still open</p>
              </div>
            ))}
          </div>
        </Card>
      </Reveal>
    </div>
  )
}