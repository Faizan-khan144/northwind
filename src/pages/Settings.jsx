import { useState } from 'react'
import { Moon, RotateCcw, Save, Sun, Trash2 } from 'lucide-react'
import { useStore } from '../store.jsx'
import { Button, Card, CardHeader, Field, Input, Modal, PageHeader, Select } from '../components/ui.jsx'
import { cn } from '../lib/utils.js'

export default function Settings() {
  const { db, setSettings, setTheme, reset } = useStore()
  const { settings } = db
  const [form, setForm] = useState({
    ownerName: settings.ownerName,
    company: settings.company,
    currency: settings.currency,
    weekStart: settings.weekStart,
  })
  const [saved, setSaved] = useState(false)
  const [confirm, setConfirm] = useState(false)

  const save = () => {
    setSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  const dark = settings.theme === 'dark'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your profile, workspace and appearance."
        actions={
          <Button variant="primary" onClick={save}>
            <Save size={16} /> {saved ? 'Saved!' : 'Save changes'}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Profile" subtitle="How you appear across the workspace" />
          <div className="space-y-4 px-5 py-5">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-xl font-bold text-accent-fg">
                {settings.ownerName.charAt(0)}
              </span>
              <div>
                <p className="text-sm font-semibold text-fg">{settings.ownerName}</p>
                <p className="text-xs text-faint">Workspace owner</p>
              </div>
            </div>
            <Field label="Full name">
              <Input value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} />
            </Field>
            <Field label="Company / studio">
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Workspace" subtitle="Defaults for billing and scheduling" />
          <div className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2">
            <Field label="Default currency">
              <Select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                <option value="USD">USD — $</option>
                <option value="EUR">EUR — €</option>
                <option value="GBP">GBP — £</option>
                <option value="PKR">PKR — ₨</option>
              </Select>
            </Field>
            <Field label="Week starts on">
              <Select value={form.weekStart} onChange={(e) => setForm({ ...form, weekStart: e.target.value })}>
                <option>Monday</option>
                <option>Sunday</option>
              </Select>
            </Field>
            <Field label="Invoice prefix" hint="Shown before invoice numbers" className="sm:col-span-2">
              <Input defaultValue="NW-" />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Appearance" subtitle="Theme preference for this device" />
          <div className="grid grid-cols-2 gap-4 px-5 py-5">
            <button
              onClick={() => setTheme('light')}
              className={cn(
                'flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-colors',
                !dark ? 'border-accent bg-accent-soft' : 'border-line hover:bg-surface-2',
              )}
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-surface-3 text-fg">
                <Sun size={18} />
              </span>
              <span className="text-sm font-medium text-fg">Light</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={cn(
                'flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-colors',
                dark ? 'border-accent bg-accent-soft' : 'border-line hover:bg-surface-2',
              )}
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-surface-3 text-fg">
                <Moon size={18} />
              </span>
              <span className="text-sm font-medium text-fg">Dark</span>
            </button>
          </div>
        </Card>

        <Card className="border-danger/40">
          <CardHeader title="Danger zone" subtitle="Reset the workspace back to demo data" />
          <div className="flex items-center justify-between gap-4 px-5 py-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-danger-soft text-danger">
                <Trash2 size={17} />
              </span>
              <div>
                <p className="text-sm font-medium text-fg">Reset all data</p>
                <p className="text-xs text-faint">Restores seed clients, projects and invoices.</p>
              </div>
            </div>
            <Button variant="danger" onClick={() => setConfirm(true)}>
              <RotateCcw size={16} /> Reset
            </Button>
          </div>
        </Card>
      </div>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Reset workspace data?"
        description="This clears everything you added and restores the demo dataset."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                reset()
                setConfirm(false)
              }}
            >
              Yes, reset
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">This action cannot be undone from inside the app.</p>
      </Modal>
    </div>
  )
}
