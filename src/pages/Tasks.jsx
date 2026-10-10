import { useMemo, useState } from 'react'
import { GripVertical, ListPlus, Plus, Search } from 'lucide-react'
import { useStore } from '../store.jsx'
import {
  Avatar,
  Badge,
  Button,
  Field,
  Input,
  Modal,
  PageHeader,
  Select,
} from '../components/ui.jsx'
import { TASK_COLUMNS, TASK_PRIORITY, TASK_STATUS } from '../data.js'
import { cn, relativeDue } from '../lib/utils.js'

export default function Tasks() {
  const { db, addTask, moveTask } = useStore()
  const { tasks, projects, members } = db
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [projectFilter, setProjectFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  const [dragOver, setDragOver] = useState(null)

  const projectById = Object.fromEntries(projects.map((p) => [p.id, p]))
  const memberById = Object.fromEntries(members.map((m) => [m.id, m]))

  const visible = useMemo(() => {
    const s = q.trim().toLowerCase()
    return tasks.filter((t) => {
      const matchesQ = !s || t.title.toLowerCase().includes(s)
      const matchesProject = projectFilter === 'all' || t.projectId === projectFilter
      const matchesAssignee = assigneeFilter === 'all' || t.assigneeId === assigneeFilter
      return matchesQ && matchesProject && matchesAssignee
    })
  }, [tasks, q, projectFilter, assigneeFilter])

  const [form, setForm] = useState({
    title: '',
    projectId: projects[0]?.id ?? '',
    assigneeId: members[0]?.id ?? '',
    priority: 'medium',
    status: 'todo',
    due: '',
  })

  const submit = () => {
    if (!form.title.trim()) return
    addTask({ ...form, due: form.due || null })
    setForm({ title: '', projectId: projects[0]?.id ?? '', assigneeId: members[0]?.id ?? '', priority: 'medium', status: 'todo', due: '' })
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        subtitle={`${tasks.filter((t) => t.status !== 'done').length} open · drag cards across columns`}
        actions={
          <Button variant="primary" onClick={() => setOpen(true)}>
            <Plus size={16} /> New task
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-faint" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tasks…" className="pl-9" />
        </div>
        <Select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="w-auto">
          <option value="all">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
        <Select value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value)} className="w-auto">
          <option value="all">All assignees</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {TASK_COLUMNS.map((col, idx) => {
          const colTasks = visible.filter((t) => t.status === col)
          const meta = TASK_STATUS[col]
          return (
            <div
              key={col}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(col)
              }}
              onDragLeave={() => setDragOver((c) => (c === col ? null : c))}
              onDrop={(e) => {
                e.preventDefault()
                const taskId = e.dataTransfer.getData('text/plain')
                if (taskId) moveTask(taskId, col)
                setDragOver(null)
              }}
              className={cn(
                'flex flex-col rounded-2xl border bg-surface-2/60 p-3 transition-colors',
                dragOver === col ? 'border-accent bg-accent-soft' : 'border-line',
              )}
            >
              <div className="mb-3 flex items-center gap-2 px-1">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: `var(--chart-${idx + 1})` }} />
                <span className="text-sm font-semibold text-fg">{meta.label}</span>
                <span className="tabular ml-auto rounded-md bg-surface-3 px-2 py-0.5 text-[11px] font-medium text-muted">
                  {colTasks.length}
                </span>
              </div>

              <div className="flex-1 space-y-2.5">
                {colTasks.map((t) => {
                  const due = relativeDue(t.due)
                  const project = projectById[t.projectId]
                  const assignee = memberById[t.assigneeId]
                  return (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', t.id)}
                      className="group cursor-grab rounded-xl border border-line bg-surface p-3 shadow-card active:cursor-grabbing"
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical size={14} className="mt-0.5 shrink-0 text-faint opacity-0 group-hover:opacity-100" />
                        <p className="min-w-0 flex-1 text-sm font-medium text-fg">{t.title}</p>
                      </div>
                      <p className="mt-1.5 pl-5 text-[11px] text-faint">{project?.name}</p>
                      <div className="mt-2.5 flex items-center justify-between pl-5">
                        <Badge tone={TASK_PRIORITY[t.priority].tone}>{TASK_PRIORITY[t.priority].label}</Badge>
                        <div className="flex items-center gap-2">
                          <span className={cn('text-[11px]', due.tone === 'danger' ? 'text-danger' : 'text-faint')}>{due.label}</span>
                          <Avatar name={assignee?.name ?? '—'} accent={assignee?.accent} size={24} />
                        </div>
                      </div>
                    </div>
                  )
                })}

                {colTasks.length === 0 && (
                  <div className="flex items-center justify-center rounded-xl border border-dashed border-line py-8 text-xs text-faint">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New task"
        description="Add it to a project and assign an owner."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={submit}>
              <ListPlus size={16} /> Create task
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Task title" className="sm:col-span-2">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Write onboarding copy" />
          </Field>
          <Field label="Project">
            <Select value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Assignee">
            <Select value={form.assigneeId} onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Priority">
            <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              {Object.entries(TASK_PRIORITY).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {TASK_COLUMNS.map((k) => (
                <option key={k} value={k}>
                  {TASK_STATUS[k].label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Due date" className="sm:col-span-2">
            <Input type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
          </Field>
        </div>
      </Modal>
    </div>
  )
}
