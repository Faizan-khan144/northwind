import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  FolderKanban,
  ListChecks,
  ReceiptText,
  Wallet,
} from 'lucide-react'
import { useStore } from '../store.jsx'
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardHeader,
  EmptyState,
  PageHeader,
  ProgressBar,
  StatCard,
} from '../components/ui.jsx'
import { INVOICE_STATUS, PROJECT_STATUS, TASK_STATUS } from '../data.js'
import { compactCurrency, currency, formatDate, relativeDue } from '../lib/utils.js'

export default function ProjectDetail() {
  const { id } = useParams()
  const { db } = useStore()
  const { projects, clients, tasks, invoices, members } = db

  const project = projects.find((p) => p.id === id)
  if (!project) {
    return (
      <Card>
        <EmptyState
          icon={FolderKanban}
          title="Project not found"
          description="It may have been removed."
          action={
            <Button as={Link} to="/projects" variant="primary">
              Back to projects
            </Button>
          }
        />
      </Card>
    )
  }

  const client = clients.find((c) => c.id === project.clientId)
  const memberById = Object.fromEntries(members.map((m) => [m.id, m]))
  const team = project.team.map((mid) => memberById[mid]).filter(Boolean)
  const projectTasks = tasks.filter((t) => t.projectId === project.id)
  const projectInvoices = invoices.filter((i) => i.projectId === project.id)
  const doneCount = projectTasks.filter((t) => t.status === 'done').length
  const remaining = Math.max(project.budget - project.spent, 0)

  return (
    <div className="space-y-6">
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
        <ArrowLeft size={15} /> Projects
      </Link>

      <PageHeader
        title={project.name}
        subtitle={
          <>
            <Link to={`/clients/${client?.id}`} className="hover:text-fg">
              {client?.name}
            </Link>
          </>
        }
        actions={<Badge tone={PROJECT_STATUS[project.status].tone}>{PROJECT_STATUS[project.status].label}</Badge>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Progress" value={`${project.progress}%`} icon={ListChecks} accent={client?.accent} />
        <StatCard label="Budget" value={compactCurrency(project.budget)} icon={Wallet} accent="indigo" />
        <StatCard label="Spent" value={compactCurrency(project.spent)} icon={ReceiptText} accent="amber" />
        <StatCard label="Remaining" value={compactCurrency(remaining)} icon={Wallet} accent="emerald" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Overview" subtitle={project.description} action={<AvatarGroup people={team} size={28} />} />
          <div className="space-y-4 px-5 py-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-xs text-faint">
                <span>Overall completion</span>
                <span className="tabular font-medium text-muted">{project.progress}%</span>
              </div>
              <ProgressBar value={project.progress} accent={client?.accent} />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-xs text-faint">
                <span>Budget used</span>
                <span className="tabular font-medium text-muted">
                  {currency(project.spent)} / {currency(project.budget)}
                </span>
              </div>
              <ProgressBar value={(project.spent / project.budget) * 100} accent="amber" />
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <CalendarDays size={14} className="text-faint" /> Start {formatDate(project.start)}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={14} className="text-faint" /> Due {formatDate(project.due)}
              </span>
              <span className="tabular">
                {doneCount}/{projectTasks.length} tasks done
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.tags.map((t) => (
                <span key={t} className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-muted">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Team" subtitle={`${team.length} members`} />
          <div className="divide-y divide-line">
            {team.map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-5 py-3">
                <Avatar name={m.name} accent={m.accent} size={36} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-fg">{m.name}</p>
                  <p className="truncate text-xs text-faint">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Tasks" subtitle={`${projectTasks.length} total · ${doneCount} done`} />
          {projectTasks.length === 0 ? (
            <EmptyState icon={ListChecks} title="No tasks yet" description="Break the project into tasks." />
          ) : (
            <div className="divide-y divide-line">
              {projectTasks.map((t) => {
                const due = relativeDue(t.due)
                const assignee = memberById[t.assigneeId]
                return (
                  <div key={t.id} className="flex items-center gap-3 px-5 py-3">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${t.status === 'done' ? 'bg-success' : 'bg-border-strong'}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm ${t.status === 'done' ? 'text-faint line-through' : 'text-fg'}`}>
                        {t.title}
                      </p>
                    </div>
                    <Badge tone={TASK_STATUS[t.status].tone}>{TASK_STATUS[t.status].label}</Badge>
                    <Badge tone={due.tone} className="hidden sm:inline-flex">
                      {due.label}
                    </Badge>
                    <Avatar name={assignee?.name ?? '—'} accent={assignee?.accent} size={28} />
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Invoices" subtitle={`${projectInvoices.length} linked`} />
          {projectInvoices.length === 0 ? (
            <EmptyState icon={ReceiptText} title="No invoices" description="Bill this project from Invoices." />
          ) : (
            <div className="divide-y divide-line">
              {projectInvoices.map((i) => (
                <div key={i.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-fg">{i.number}</p>
                    <p className="text-xs text-faint">due {formatDate(i.due)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="tabular text-sm text-fg">{currency(i.amount)}</span>
                    <Badge tone={INVOICE_STATUS[i.status].tone}>{INVOICE_STATUS[i.status].label}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
