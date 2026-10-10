import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Plus, Search, FolderPlus } from 'lucide-react'
import { useStore } from '../store.jsx'
import {
  AvatarGroup,
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Modal,
  PageHeader,
  ProgressBar,
  Select,
  Tabs,
  Textarea,
} from '../components/ui.jsx'
import { PROJECT_STATUS } from '../data.js'
import { compactCurrency, formatDate } from '../lib/utils.js'

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'planning', label: 'Planning' },
  { value: 'review', label: 'Review' },
  { value: 'completed', label: 'Done' },
  { value: 'onhold', label: 'On hold' },
]

export default function Projects() {
  const { db, addProject } = useStore()
  const { projects, clients, members } = db
  const [tab, setTab] = useState('all')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)

  const clientById = Object.fromEntries(clients.map((c) => [c.id, c]))
  const memberById = Object.fromEntries(members.map((m) => [m.id, m]))

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return projects.filter((p) => {
      const matchesTab = tab === 'all' || p.status === tab
      const matchesQ = !s || p.name.toLowerCase().includes(s) || (clientById[p.clientId]?.name || '').toLowerCase().includes(s)
      return matchesTab && matchesQ
    })
  }, [projects, tab, q, clientById])

  const [form, setForm] = useState({
    name: '',
    clientId: clients[0]?.id ?? '',
    budget: '',
    due: '',
    status: 'planning',
    description: '',
    tags: '',
  })

  const submit = () => {
    if (!form.name.trim() || !form.clientId) return
    addProject({
      name: form.name,
      clientId: form.clientId,
      budget: Number(form.budget) || 0,
      due: form.due || null,
      status: form.status,
      description: form.description,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    })
    setForm({ name: '', clientId: clients[0]?.id ?? '', budget: '', due: '', status: 'planning', description: '', tags: '' })
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} projects · ${projects.filter((p) => p.status === 'active').length} active`}
        actions={
          <Button variant="primary" onClick={() => setOpen(true)}>
            <Plus size={16} /> New project
          </Button>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
        <div className="relative w-full max-w-xs">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-faint" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects…" className="pl-9" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={FolderPlus}
            title="No projects found"
            description="Adjust the filters or start a new project."
            action={
              <Button variant="primary" onClick={() => setOpen(true)}>
                <Plus size={16} /> New project
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="stagger grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => {
            const client = clientById[p.clientId]
            const team = p.team.map((id) => memberById[id]).filter(Boolean)
            return (
              <Card key={p.id} className="flex flex-col p-5 transition-colors hover:border-line-strong">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link to={`/projects/${p.id}`} className="block truncate text-sm font-semibold text-fg hover:text-accent">
                      {p.name}
                    </Link>
                    <Link to={`/clients/${client?.id}`} className="mt-0.5 block truncate text-xs text-faint hover:text-muted">
                      {client?.name}
                    </Link>
                  </div>
                  <Badge tone={PROJECT_STATUS[p.status].tone}>{PROJECT_STATUS[p.status].label}</Badge>
                </div>

                <p className="mt-3 line-clamp-2 text-xs text-muted">{p.description}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-muted">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-[11px] text-faint">
                    <span>Progress</span>
                    <span className="tabular font-medium text-muted">{p.progress}%</span>
                  </div>
                  <ProgressBar value={p.progress} accent={client?.accent} />
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-faint">
                      <CalendarDays size={13} /> {formatDate(p.due)}
                    </span>
                    <span className="tabular text-muted">
                      {compactCurrency(p.spent)} / {compactCurrency(p.budget)}
                    </span>
                  </div>
                  <AvatarGroup people={team} size={26} />
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create a project"
        description="Link it to a client so billing stays tidy."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={submit}>
              Create project
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Project name" className="sm:col-span-2">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Website redesign" />
          </Field>
          <Field label="Client">
            <Select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Budget (USD)">
            <Input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="12000" />
          </Field>
          <Field label="Due date">
            <Input type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {Object.entries(PROJECT_STATUS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Tags" hint="Comma separated" className="sm:col-span-2">
            <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Web App, Design" />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short summary of scope…" />
          </Field>
        </div>
      </Modal>
    </div>
  )
}
