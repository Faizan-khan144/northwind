import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Mail, MapPin, Plus, Search, UserPlus } from 'lucide-react'
import { useStore } from '../store.jsx'
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Modal,
  PageHeader,
  Select,
  Tabs,
} from '../components/ui.jsx'
import { CLIENT_STATUS } from '../data.js'
import { formatDate } from '../lib/utils.js'

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'lead', label: 'Leads' },
  { value: 'archived', label: 'Archived' },
]

const ACCENT_OPTIONS = ['indigo', 'cyan', 'emerald', 'amber', 'rose', 'violet', 'sky', 'orange']

export default function Clients() {
  const { db, addClient } = useStore()
  const { clients, projects } = db
  const [tab, setTab] = useState('all')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return clients.filter((c) => {
      const matchesTab = tab === 'all' || c.status === tab
      const matchesQ =
        !s ||
        c.name.toLowerCase().includes(s) ||
        c.contact?.toLowerCase().includes(s) ||
        c.industry?.toLowerCase().includes(s)
      return matchesTab && matchesQ
    })
  }, [clients, tab, q])

  const projectCount = (clientId) => projects.filter((p) => p.clientId === clientId).length

  const [form, setForm] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    industry: '',
    location: '',
    status: 'lead',
    accent: 'indigo',
  })

  const submit = () => {
    if (!form.name.trim()) return
    addClient({ ...form, accent: form.accent })
    setForm({ name: '', contact: '', email: '', phone: '', industry: '', location: '', status: 'lead', accent: 'indigo' })
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        subtitle={`${clients.length} accounts across your studio`}
        actions={
          <Button variant="primary" onClick={() => setOpen(true)}>
            <Plus size={16} /> Add client
          </Button>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
        <div className="relative w-full max-w-xs">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-faint" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clients…" className="pl-9" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={UserPlus}
            title="No clients found"
            description="Try a different filter or add your first client."
            action={
              <Button variant="primary" onClick={() => setOpen(true)}>
                <Plus size={16} /> Add client
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <Card key={c.id} className="group p-5 transition-colors hover:border-line-strong">
              <div className="flex items-start gap-3">
                <Avatar name={c.name} accent={c.accent} size={44} />
                <div className="min-w-0 flex-1">
                  <Link to={`/clients/${c.id}`} className="block truncate text-sm font-semibold text-fg hover:text-accent">
                    {c.name}
                  </Link>
                  <p className="truncate text-xs text-faint">{c.contact}</p>
                </div>
                <Badge tone={CLIENT_STATUS[c.status].tone}>{CLIENT_STATUS[c.status].label}</Badge>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-muted">
                <p className="flex items-center gap-2">
                  <Building2 size={13} className="text-faint" /> {c.industry}
                </p>
                <p className="flex items-center gap-2 truncate">
                  <Mail size={13} className="text-faint" /> {c.email}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={13} className="text-faint" /> {c.location}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs">
                <span className="text-faint">Since {formatDate(c.since)}</span>
                <span className="font-medium text-fg">{projectCount(c.id)} projects</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add a new client"
        description="Create an account to link projects and invoices."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={submit}>
              Create client
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Company name" className="sm:col-span-2">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Acme Inc." />
          </Field>
          <Field label="Contact person">
            <Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Jane Doe" />
          </Field>
          <Field label="Industry">
            <Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="SaaS" />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@acme.com" />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 000 0000" />
          </Field>
          <Field label="Location">
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Country" />
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="lead">Lead</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </Select>
          </Field>
          <Field label="Accent" className="sm:col-span-2">
            <div className="flex flex-wrap gap-2">
              {ACCENT_OPTIONS.map((a) => (
                <button
                  key={a}
                  onClick={() => setForm({ ...form, accent: a })}
                  className={`h-7 w-7 rounded-full ring-2 transition-all ${form.accent === a ? 'ring-fg' : 'ring-transparent'}`}
                  style={{ backgroundColor: `var(--chart-${(ACCENT_OPTIONS.indexOf(a) % 5) + 1})` }}
                  aria-label={a}
                />
              ))}
            </div>
          </Field>
        </div>
      </Modal>
    </div>
  )
}
