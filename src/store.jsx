import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import {
  activities as seedActivities,
  clients as seedClients,
  invoices as seedInvoices,
  members as seedMembers,
  projects as seedProjects,
  revenueSeries as seedRevenue,
  tasks as seedTasks,
} from './data.js'
import { uid } from './lib/utils.js'

const STORAGE_KEY = 'northwind.db.v1'
const THEME_KEY = 'northwind.theme'

function makeInitialState() {
  return {
    clients: seedClients,
    projects: seedProjects,
    tasks: seedTasks,
    invoices: seedInvoices,
    activities: seedActivities,
    members: seedMembers,
    revenue: seedRevenue,
    settings: {
      company: 'Northwind Studio',
      currency: 'USD',
      ownerName: 'Faizan Khan',
      weekStart: 'Monday',
      theme: 'light',
    },
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { ...state, [action.key]: [action.item, ...state[action.key]] }
    case 'UPDATE':
      return {
        ...state,
        [action.key]: state[action.key].map((it) =>
          it.id === action.id ? { ...it, ...action.patch } : it,
        ),
      }
    case 'REMOVE':
      return { ...state, [action.key]: state[action.key].filter((it) => it.id !== action.id) }
    case 'LOG': {
      const entry = { id: uid('a'), at: new Date().toISOString(), ...action.entry }
      return { ...state, activities: [entry, ...state.activities].slice(0, 40) }
    }
    case 'SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.patch } }
    case 'RESET':
      return makeInitialState()
    default:
      return state
  }
}

const StoreContext = createContext(null)

function loadState() {
  const base = makeInitialState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const storedTheme = localStorage.getItem(THEME_KEY)
    if (!raw) return { ...base, settings: { ...base.settings, theme: storedTheme || base.settings.theme } }
    const parsed = JSON.parse(raw)
    return {
      ...base,
      ...parsed,
      settings: { ...base.settings, ...parsed.settings, theme: storedTheme || parsed.settings?.theme || base.settings.theme },
    }
  } catch {
    return base
  }
}

export function StoreProvider({ children }) {
  const [db, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
    } catch {}
  }, [db])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', db.settings.theme === 'dark')
  }, [db.settings.theme])

  const actions = useMemo(
    () => ({
      add: (key, item) => dispatch({ type: 'ADD', key, item }),
      update: (key, id, patch) => dispatch({ type: 'UPDATE', key, id, patch }),
      remove: (key, id) => dispatch({ type: 'REMOVE', key, id }),

      addClient: (payload) => {
        const item = { id: uid('c'), status: 'lead', accent: 'indigo', since: new Date().toISOString().slice(0, 10), ...payload }
        dispatch({ type: 'ADD', key: 'clients', item })
        dispatch({ type: 'LOG', entry: { type: 'client', message: `New client added: ${item.name}`, actorId: 'm1' } })
        return item
      },
      addProject: (payload) => {
        const item = { id: uid('p'), status: 'planning', progress: 0, spent: 0, team: [], tags: [], start: new Date().toISOString().slice(0, 10), ...payload }
        dispatch({ type: 'ADD', key: 'projects', item })
        dispatch({ type: 'LOG', entry: { type: 'project', message: `Project created: ${item.name}`, actorId: 'm1' } })
        return item
      },
      addTask: (payload) => {
        const item = { id: uid('t'), status: 'todo', priority: 'medium', ...payload }
        dispatch({ type: 'ADD', key: 'tasks', item })
        return item
      },
      addInvoice: (payload) => {
        const item = { id: uid('i'), status: 'draft', issue: new Date().toISOString().slice(0, 10), ...payload }
        dispatch({ type: 'ADD', key: 'invoices', item })
        return item
      },

      moveTask: (id, status) => {
        dispatch({ type: 'UPDATE', key: 'tasks', id, patch: { status } })
        dispatch({ type: 'LOG', entry: { type: 'task', message: `Task moved to ${status}`, actorId: 'm1' } })
      },

      setTheme: (theme) => {
        try {
          localStorage.setItem(THEME_KEY, theme)
        } catch {}
        dispatch({ type: 'SETTINGS', patch: { theme } })
      },
      toggleTheme: () => {
        const next = db.settings.theme === 'dark' ? 'light' : 'dark'
        try {
          localStorage.setItem(THEME_KEY, next)
        } catch {}
        dispatch({ type: 'SETTINGS', patch: { theme: next } })
      },
      setSettings: (patch) => dispatch({ type: 'SETTINGS', patch }),
      reset: () => {
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch {}
        dispatch({ type: 'RESET' })
      },
    }),
    [db.settings.theme],
  )

  const value = useMemo(() => ({ db, ...actions }), [db, actions])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore() ko <StoreProvider> ke andar use karo.')
  return ctx
}
