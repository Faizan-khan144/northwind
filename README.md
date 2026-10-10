<div align="center">

# Northwind

**The all-in-one workspace to run a small studio — clients, projects, tasks and invoices in one clean dashboard.**

A modern, offline-first single-page application built with React 19, Vite and Tailwind CSS v4.
Runs entirely in the browser with zero backend and local persistence.

<br />

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white&style=flat-square)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white&style=flat-square)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com)
[![React Router](https://img.shields.io/badge/React_Router-7-ca4245?logo=reactrouter&logoColor=white&style=flat-square)](https://reactrouter.com)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](#license)

[Features](#features) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started) · [Architecture](#architecture) · [Roadmap](#roadmap)

</div>

---

## Overview

Northwind is a portfolio-grade **client & project management** app for agencies,
freelancers and small studios. It brings the day-to-day of running a studio into a
single, fast dashboard:

- Track every **client** and the **projects** attached to them.
- Move work forward on a **drag-and-drop Kanban board**.
- Issue and reconcile **invoices**, and always know what's outstanding.

There is no server to run. On first launch the app seeds a realistic demo dataset;
from then on everything you create is stored locally and survives refreshes.

> **Demo-ready.** Open it, click around, drag a card, add a client — no signup, no
> setup, no API keys.

---

## Features

### Dashboard
- KPI tiles: active projects, open tasks, outstanding balance and current-month revenue.
- An 8-month **revenue area chart** rendered as hand-rolled SVG.
- A **task-status donut** with a completion ratio in the center.
- Highest-progress project list, upcoming deadlines and a live **activity feed**.

### Clients
- Searchable, filterable directory (All / Active / Leads / Archived).
- Rich client detail page: contact block, linked projects, invoice history and totals.
- Add clients via a modal with an accent-colour picker.

### Projects
- Card grid with status filters, progress bars, budgets and stacked team avatars.
- Detail view with **budget vs. spent**, completion tracking, task list and linked invoices.
- Create projects against any client, with tags and due dates.

### Tasks
- **Drag-and-drop Kanban** across *To do → In progress → Review → Done*.
- Priority levels, due-date intelligence ("Due today", "3d overdue") and assignees.
- Filter by project, assignee or free-text search.

### Invoices
- Billing table with **Paid / Outstanding / Overdue** summaries.
- Status filters, due-date colouring and one-click **mark as paid**.
- Create invoices that automatically link to a client and project.

### Everywhere
- **Global search** for any client, project or task from the top bar.
- **Dark & light themes**, persisted per device.
- Fully **responsive** with a collapsible sidebar.
- No backend — state lives in a typed-in-spirit shape and persists to `localStorage`.

---

## Tech Stack

| Concern        | Choice                                              |
| -------------- | --------------------------------------------------- |
| UI framework   | React 19                                            |
| Build tool     | Vite 8                                              |
| Styling        | Tailwind CSS v4 via `@tailwindcss/vite`             |
| Routing        | React Router 7                                      |
| Icons          | `lucide-react`                                      |
| Global state   | React Context + `useReducer`                        |
| Persistence    | `localStorage` (versioned key)                      |
| Charts         | Custom SVG components (no charting library)         |
| Linting        | `oxlint`                                            |

---

## Getting Started

### Prerequisites

- **Node.js 18+** (Node 20+ recommended)
- npm (or pnpm / yarn)

### Install & run

```bash
git clone https://github.com/Faizan-khan144/northwind.git
cd northwind
npm install
npm run dev
```

The dev server prints a local URL (defaults to `http://127.0.0.1:1450`). Open it and
you're in — demo data loads automatically.

### Available scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite dev server            |
| `npm run build`   | Production build into `dist/`        |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run `oxlint` across the project      |

---

## Architecture

Northwind keeps a deliberately small, readable surface area.

```
        ┌─────────────────────────────────────────────────────────┐
        │                        Browser                          │
        │                                                         │
        │   main.jsx ──▶ <StoreProvider> ──▶ <BrowserRouter>      │
        │                      │                    │             │
        │               useReducer(db)         <Routes>           │
        │                      │                    │             │
        │              localStorage ◀──┐      <Layout> (sidebar,   │
        │                             │       topbar, search)     │
        │                             │            │             │
        │                        actions ───▶  pages/*           │
        │                    (add / update /      │              │
        │                     move / reset)   ui.jsx components   │
        └─────────────────────────────────────────────────────────┘
```

- **Single source of truth** — `src/store.jsx` holds the whole database via
  `useReducer`, exposes typed action helpers (`addClient`, `moveTask`, `toggleTheme`, …),
  and writes to `localStorage` on every change.
- **Presentational pages** — every page in `src/pages` reads from `useStore()` and
  composes primitives from `src/components/ui.jsx`.
- **Design tokens** — colours are CSS variables in `src/index.css`, surfaced to
  Tailwind through `@theme inline`, so theming is a matter of toggling `html.dark`.

### Project structure

```
northwind/
├─ public/
│  └─ favicon.svg
├─ src/
│  ├─ components/
│  │  ├─ Charts.jsx      # SVG area / bar / donut charts
│  │  ├─ Layout.jsx      # Sidebar, topbar, global search, theme toggle
│  │  └─ ui.jsx          # Design-system primitives (Card, Button, Badge…)
│  ├─ lib/
│  │  └─ utils.js        # Formatters and small helpers
│  ├─ pages/
│  │  ├─ Dashboard.jsx
│  │  ├─ Clients.jsx · ClientDetail.jsx
│  │  ├─ Projects.jsx · ProjectDetail.jsx
│  │  ├─ Tasks.jsx
│  │  ├─ Invoices.jsx
│  │  ├─ Settings.jsx
│  │  └─ NotFound.jsx
│  ├─ App.jsx            # Route table
│  ├─ data.js            # Seed data + status metadata
│  ├─ store.jsx          # Context + reducer + persistence
│  ├─ index.css          # Tailwind entry + theme tokens
│  └─ main.jsx           # Application entry point
├─ index.html
└─ vite.config.js
```

---

## Data Model

| Entity      | Key fields                                                                        |
| ----------- | --------------------------------------------------------------------------------- |
| **Client**  | `name`, `contact`, `email`, `phone`, `industry`, `location`, `status`, `accent`, `since` |
| **Project** | `name`, `clientId`, `status`, `progress`, `budget`, `spent`, `start`, `due`, `team`, `tags` |
| **Task**    | `title`, `projectId`, `assigneeId`, `status`, `priority`, `due`                    |
| **Invoice** | `number`, `clientId`, `projectId`, `amount`, `status`, `issue`, `due`              |
| **Member**  | `name`, `role`, `email`, `accent`                                                  |

### Status vocabularies

- **Client** — `active` · `lead` · `archived`
- **Project** — `planning` · `active` · `review` · `completed` · `onhold`
- **Task** — `todo` · `inprogress` · `review` · `done`
- **Invoice** — `draft` · `sent` · `paid` · `overdue`
- **Priority** — `low` · `medium` · `high` · `urgent`

---

## Theming

All colours are defined once as CSS custom properties in `src/index.css`:

```css
:root { --bg: #f5f6f8; --surface: #ffffff; --accent: #4f46e5; /* … */ }
.dark { --bg: #080d18; --surface: #0e1626; --accent: #6366f1; /* … */ }
```

They are exposed to Tailwind via `@theme inline`, producing utilities such as
`bg-surface`, `text-muted`, `border-line` and `text-accent`. Toggling the `dark`
class on `<html>` flips the entire palette — no per-component colour logic.

---

## Persistence

- Everything lives under a single versioned `localStorage` key: `northwind.db.v1`.
- The theme preference is stored separately as `northwind.theme`.
- **Settings → Danger zone → Reset** restores the original seed dataset.

> Clearing site data or using another browser resets the workspace to the demo seed.

---

## Roadmap

- [ ] Backend sync (Supabase / REST) behind the same action API
- [ ] Time tracking and timesheets per project
- [ ] Recurring invoices and PDF export
- [ ] File attachments on projects and tasks
- [ ] Calendar view for deadlines
- [ ] Team invitations and roles
- [ ] Command palette (⌘K)

---

## Contributing

Contributions, issues and feature requests are welcome.

1. Fork the repo and create a branch: `git checkout -b feature/amazing`
2. Make your changes and run `npm run lint` and `npm run build`
3. Commit using clear messages and open a pull request

---

## License

Released under the **MIT License** — free to use, modify and learn from.
