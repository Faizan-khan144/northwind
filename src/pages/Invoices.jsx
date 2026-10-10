import { useMemo, useState } from 'react'
import { CheckCircle2, Download, FileText, Plus, Receipt } from 'lucide-react'
import { useStore } from '../store.jsx'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Modal,
  PageHeader,
  Select,
  StatCard,
  Tabs,
} from '../components/ui.jsx'
import { INVOICE_STATUS } from '../data.js'
import { compactCurrency, currency, formatDate, relativeDue } from '../lib/utils.js'

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
]

export default function Invoices() {
  const { db, addInvoice, update } = useStore()
  const { invoices, clients, projects } = db
  const [tab, setTab] = useState('all')
  const [open, setOpen] = useState(false)

  const clientById = Object.fromEntries(clients.map((c) => [c.id, c]))
  const projectById = Object.fromEntries(projects.map((p) => [p.id, p]))

  const filtered = useMemo(() => (tab === 'all' ? invoices : invoices.filter((i) => i.status === tab)), [invoices, tab])

  const paid = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const outstanding = invoices.filter((i) => i.status === 'sent' || i.status === 'draft').reduce((s, i) => s + i.amount, 0)
  const overdue = invoices.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.amount, 0)

  const nextNumber = `NW-${1050 + invoices.length}`

  const [form, setForm] = useState({
    clientId: clients[0]?.id ?? '',
    projectId: projects[0]?.id ?? '',
    amount: '',
    issue: new Date().toISOString().slice(0, 10),
    due: '',
    status: 'draft',
  })

  const clientProjects = projects.filter((p) => p.clientId === form.clientId)

  const submit = () => {
    if (!form.clientId || !form.amount) return
    addInvoice({
      number: nextNumber,
      clientId: form.clientId,
      projectId: form.projectId,
      amount: Number(form.amount),
      issue: form.issue,
      due: form.due,
      status: form.status,
    })
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        subtitle={`${invoices.length} invoices · ${currency(paid + outstanding + overdue)} lifetime`}
        actions={
          <>
            <Button variant="secondary" size="md">
              <Download size={16} /> Export
            </Button>
            <Button variant="primary" onClick={() => setOpen(true)}>
              <Plus size={16} /> New invoice
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Paid" value={compactCurrency(paid)} icon={CheckCircle2} accent="emerald" />
        <StatCard label="Outstanding" value={compactCurrency(outstanding)} icon={Receipt} accent="indigo" />
        <StatCard label="Overdue" value={compactCurrency(overdue)} icon={FileText} accent="rose" />
      </div>

      <div className="flex items-center justify-between">
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
      </div>

      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={Receipt} title="No invoices" description="Create your first invoice to start billing." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[11px] font-semibold tracking-wide text-faint uppercase">
                  <th className="px-5 py-3">Invoice</th>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Project</th>
                  <th className="px-5 py-3">Due</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((i) => {
                  const due = relativeDue(i.due)
                  return (
                    <tr key={i.id} className="transition-colors hover:bg-surface-2">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-fg">{i.number}</p>
                        <p className="text-[11px] text-faint">Issued {formatDate(i.issue)}</p>
                      </td>
                      <td className="px-5 py-3.5 text-muted">{clientById[i.clientId]?.name}</td>
                      <td className="px-5 py-3.5 text-muted">{projectById[i.projectId]?.name ?? '—'}</td>
                      <td className="px-5 py-3.5">
                        <span className={due.tone === 'danger' ? 'text-danger' : 'text-muted'}>{formatDate(i.due)}</span>
                      </td>
                      <td className="tabular px-5 py-3.5 text-right font-medium text-fg">{currency(i.amount)}</td>
                      <td className="px-5 py-3.5">
                        <Badge tone={INVOICE_STATUS[i.status].tone}>{INVOICE_STATUS[i.status].label}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {i.status === 'paid' ? (
                          <span className="text-xs text-faint">Settled</span>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => update('invoices', i.id, { status: 'paid' })}>
                            Mark paid
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New invoice"
        description={`Next number ${nextNumber}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={submit}>
              Create invoice
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Client">
            <Select
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value, projectId: projects.find((p) => p.clientId === e.target.value)?.id ?? '' })}
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Project">
            <Select value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
              {clientProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Amount (USD)">
            <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="5000" />
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {Object.entries(INVOICE_STATUS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Issue date">
            <Input type="date" value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })} />
          </Field>
          <Field label="Due date">
            <Input type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
          </Field>
        </div>
      </Modal>
    </div>
  )
}
