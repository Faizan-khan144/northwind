import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  FolderKanban,
  Mail,
  MapPin,
  Phone,
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
import { CLIENT_STATUS, INVOICE_STATUS, PROJECT_STATUS } from '../data.js'
import { compactCurrency, currency, formatDate } from '../lib/utils.js'

export default function ClientDetail() {
  const { id } = useParams()
  const { db } = useStore()
  const { clients, projects, invoices, members } = db

  const client = clients.find((c) => c.id === id)
  if (!client) {
    return (
      <Card>
        <EmptyState
          icon={Building2}
          title="Client not found"
          description="This client may have been removed."
          action={
            <Button as={Link} to="/clients" variant="primary">
              Back to clients
            </Button>
          }
        />
      </Card>
    )
  }

  const clientProjects = projects.filter((p) => p.clientId === client.id)
  const clientInvoices = invoices.filter((i) => i.clientId === client.id)
  const memberById = Object.fromEntries(members.map((m) => [m.id, m]))
  const totalBilled = clientInvoices.reduce((s, i) => s + i.amount, 0)
  const outstanding = clientInvoices.filter((i) => i.status !== 'paid').reduce((s, i) => s + i.amount, 0)

  return (
    <div className="space-y-6">
      <Link to="/clients" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
        <ArrowLeft size={15} /> Clients
      </Link>

      <PageHeader
        title={client.name}
        subtitle={client.industry}
        actions={<Badge tone={CLIENT_STATUS[client.status].tone}>{CLIENT_STATUS[client.status].label}</Badge>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="flex items-center gap-4 p-5">
            <Avatar name={client.name} accent={client.accent} size={56} />
            <div>
              <p className="text-sm font-semibold text-fg">{client.contact}</p>
              <p className="text-xs text-faint">Primary contact</p>
            </div>
          </div>
          <div className="space-y-3 border-t border-line px-5 py-4 text-sm">
            <p className="flex items-center gap-2 text-muted">
              <Mail size={15} className="text-faint" /> {client.email}
            </p>
            <p className="flex items-center gap-2 text-muted">
              <Phone size={15} className="text-faint" /> {client.phone}
            </p>
            <p className="flex items-center gap-2 text-muted">
              <MapPin size={15} className="text-faint" /> {client.location}
            </p>
            <p className="flex items-center gap-2 text-muted">
              <CalendarDays size={15} className="text-faint" /> Client since {formatDate(client.since)}
            </p>
          </div>
          {client.notes && (
            <div className="border-t border-line px-5 py-4">
              <p className="text-[11px] font-semibold tracking-wide text-faint uppercase">Notes</p>
              <p className="mt-1.5 text-xs text-muted">{client.notes}</p>
            </div>
          )}
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Projects" value={clientProjects.length} icon={FolderKanban} accent={client.accent} />
            <StatCard label="Total billed" value={compactCurrency(totalBilled)} icon={Wallet} accent="emerald" />
            <StatCard label="Outstanding" value={compactCurrency(outstanding)} icon={ReceiptText} accent="amber" />
          </div>

          <Card>
            <CardHeader title="Projects" subtitle={`${clientProjects.length} linked`} />
            {clientProjects.length === 0 ? (
              <EmptyState icon={FolderKanban} title="No projects yet" description="Create a project for this client." />
            ) : (
              <div className="divide-y divide-line">
                {clientProjects.map((p) => {
                  const team = p.team.map((mid) => memberById[mid]).filter(Boolean)
                  return (
                    <Link key={p.id} to={`/projects/${p.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium text-fg">{p.name}</p>
                          <Badge tone={PROJECT_STATUS[p.status].tone}>{PROJECT_STATUS[p.status].label}</Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-faint">
                          {compactCurrency(p.spent)} of {compactCurrency(p.budget)} · due {formatDate(p.due)}
                        </p>
                      </div>
                      <div className="hidden w-28 sm:block">
                        <ProgressBar value={p.progress} accent={client.accent} showLabel />
                      </div>
                      <AvatarGroup people={team} size={24} max={3} />
                    </Link>
                  )
                })}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Invoices" subtitle={`${clientInvoices.length} total`} />
            <div className="divide-y divide-line">
              {clientInvoices.map((i) => (
                <div key={i.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-fg">{i.number}</p>
                    <p className="text-xs text-faint">Issued {formatDate(i.issue)} · due {formatDate(i.due)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="tabular text-sm font-medium text-fg">{currency(i.amount)}</span>
                    <Badge tone={INVOICE_STATUS[i.status].tone}>{INVOICE_STATUS[i.status].label}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
