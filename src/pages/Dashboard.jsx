import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  CalendarClock,
  FolderKanban,
  ListChecks,
  Plus,
  TrendingUp,
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
  StatCard,
} from '../components/ui.jsx'
import { PROJECT_STATUS, TASK_COLUMNS, TASK_STATUS } from '../data.js'
import { compactCurrency, currency, formatDate, formatDateTime, relativeDue } from '../lib/utils.js'

const ACTIVITY_ICON = {
  task: ListChecks,
  invoice: Wallet,
  project: FolderKanban,
  client: Users,
}

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back — here's what's moving across ${projects.length} projects.`}
        actions={
          <Button as={Link} to="/projects" variant="primary" size="md">
            <Plus size={16} /> New project
          </Button>
        }
      />

      <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active projects" value={activeProjects.length} delta={12} icon={FolderKanban} accent="indigo" />
        <StatCard label="Open tasks" value={openTasks.length} delta={-4} icon={ListChecks} accent="cyan" />
        <StatCard label="Outstanding" value={compactCurrency(outstanding)} delta={8} icon={Wallet} accent="amber" />
        <StatCard label="Revenue (Oct)" value={compactCurrency(thisMonth)} delta={revenueDelta} icon={TrendingUp} accent="emerald" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Revenue trend"
            subtitle="Paid + invoiced, last 8 months"
            action={<Badge tone="success" dot>On track</Badge>}
          />
          <div className="px-4 pt-4 pb-2">
            <AreaChart data={revenue} height={230} />
            <div className="flex justify-between px-1 pt-1">
              {revenue.map((r) => (
                <span key={r.month} className="text-[10px] font-medium text-faint">
                  {r.month}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6 border-t border-line px-5 py-3">
            <div>
              <p className="text-[11px] text-faint">This month</p>
              <p className="tabular text-sm font-semibold text-fg">{currency(thisMonth)}</p>
            </div>
            <div>
              <p className="text-[11px] text-faint">Avg / month</p>
              <p className="tabular text-sm font-semibold text-fg">
                {currency(Math.round(revenue.reduce((s, r) => s + r.value, 0) / revenue.length))}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-faint">Best month</p>
              <p className="tabular text-sm font-semibold text-fg">
                {compactCurrency(Math.max(...revenue.map((r) => r.value)))}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Tasks by status" subtitle={`${tasks.length} total`} />
          <div className="flex flex-col items-center gap-4 px-5 py-6">
            <Donut
              segments={byStatus}
              size={168}
              thickness={18}
              centerLabel={`${Math.round((tasks.filter((t) => t.status === 'done').length / tasks.length) * 100)}%`}
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
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
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
                className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-2"
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
                <div className="hidden w-40 sm:block">
                  <ProgressBar value={p.progress} accent={clientById[p.clientId]?.accent} showLabel />
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Upcoming deadlines" subtitle="Next tasks due" />
            <div className="divide-y divide-line">
              {upcoming.map((t) => {
                const due = relativeDue(t.due)
                return (
                  <div key={t.id} className="flex items-center gap-3 px-5 py-3">
                    <Avatar name={memberById[t.assigneeId]?.name ?? '—'} accent={memberById[t.assigneeId]?.accent} size={30} />
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

          <Card>
            <CardHeader title="Recent activity" subtitle="Latest across the workspace" />
            <div className="divide-y divide-line">
              {activities.slice(0, 5).map((a) => {
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
        </div>
      </div>
    </div>
  )
}
