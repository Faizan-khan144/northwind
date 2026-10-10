# Northwind — Client & Project Management

A modern, offline-first workspace for agencies and freelancers to manage **clients, projects, tasks and invoices** — all in one polished dashboard. Built with React 19, Vite and Tailwind CSS v4, and it works entirely in the browser with local persistence (no backend required).

> Demo data is seeded on first run. Everything you add is saved to `localStorage`, so refreshing keeps your changes.

---

## ✨ Features

- **Dashboard** — KPI tiles (active projects, open tasks, outstanding, monthly revenue), an 8-month revenue area chart, a task-status donut, project-progress list, upcoming deadlines and a live activity feed.
- **Clients** — searchable, filterable client directory with a rich detail view (contacts, linked projects, invoices, totals).
- **Projects** — card grid with status filters, progress bars, budgets and team avatars; detail view with budget-vs-spent, task list and linked invoices.
- **Tasks** — a drag-and-drop **Kanban board** (To do → In progress → Review → Done) with priorities, due-date intelligence and assignees.
- **Invoices** — billing table with paid / outstanding / overdue summaries, status filters and one-click "mark paid".
- **Global search** — instantly find any client, project or task from the top bar.
- **Dark & light themes** — persisted per device.
- **Fully responsive** — collapsible sidebar and adaptive layouts from mobile to widescreen.
- **Zero backend** — global state via React Context + `useReducer`, persisted to `localStorage`.

---

## 🧱 Tech Stack

| Layer      | Choice                          |
| ---------- | ------------------------------- |
| Framework  | React 19                        |
| Build tool | Vite 8                          |
| Styling    | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Routing    | React Router 7                  |
| Icons      | lucide-react                    |
| State      | React Context + `useReducer`    |
| Charts     | Hand-rolled SVG (no chart lib)  |
| Linting    | oxlint                          |

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open the printed URL (defaults to `http://127.0.0.1:1450`).

### Scripts

| Command           | Description                     |
| ----------------- | ------------------------------- |
| `npm run dev`     | Start the dev server            |
| `npm run build`   | Production build to `dist/`     |
| `npm run preview` | Preview the production build    |
| `npm run lint`    | Run oxlint                      |

---

## 📁 Project Structure

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
│  │  ├─ Clients.jsx / ClientDetail.jsx
│  │  ├─ Projects.jsx / ProjectDetail.jsx
│  │  ├─ Tasks.jsx
│  │  ├─ Invoices.jsx
│  │  ├─ Settings.jsx
│  │  └─ NotFound.jsx
│  ├─ App.jsx            # Routes
│  ├─ data.js            # Seed data + status metadata
│  ├─ store.jsx          # Context + reducer + persistence
│  ├─ index.css          # Tailwind + theme tokens
│  └─ main.jsx           # Entry
├─ index.html
└─ vite.config.js
```

---

## 🎨 Theming

Colors live as CSS custom properties in `src/index.css` and are exposed to Tailwind through `@theme inline`. Switching `html.dark` swaps the palette, so every component using tokens like `bg-surface` or `text-muted` adapts automatically.

---

## 📦 Data Model

| Entity   | Fields                                                                 |
| -------- | ---------------------------------------------------------------------- |
| Client   | name, contact, email, phone, industry, location, status, accent, since |
| Project  | name, clientId, status, progress, budget, spent, start, due, team, tags |
| Task     | title, projectId, assigneeId, status, priority, due                    |
| Invoice  | number, clientId, projectId, amount, status, issue, due                |
| Member   | name, role, email, accent                                              |

---

## 📝 License

MIT — free to use, modify and learn from.
