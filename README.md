# 🗂 Kanban Board

A production-grade Kanban task management application built with React, Zustand, React Query, and Material UI.


---

## ✨ Features

- **4 Columns**: Backlog → In Progress → In Review → Done
- **Drag & Drop**: Move tasks between columns using `@dnd-kit/core`
- **Infinite Scroll**: Each column paginates automatically as you scroll
- **Search**: Real-time filtering across all columns by title or description
- **CRUD**: Create, edit, and delete tasks via a polished modal dialog
- **Priority Levels**: Low, Medium, High with color-coded badges
- **Data Caching**: React Query caches responses, with 2-min stale time
- **Optimistic Updates**: Moves feel instant with server reconciliation
- **Responsive**: Works on mobile, tablet, and desktop

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 |
| State Management | Zustand 4 |
| Data Fetching & Cache | TanStack React Query v5 |
| Component Library | Material UI v5 |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Mock API | json-server |
| Build Tool | Vite |
| HTTP Client | Axios |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ 
- npm v9+

### 1. Clone the repository

```bash
git clone https://github.com/your-username/kanban-board.git
cd kanban-board
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

This command starts **both** the mock API (port 4000) and the React dev server (port 3000) concurrently:

```bash
npm run dev
```

- **App**: http://localhost:3000
- **API**: http://localhost:4000/tasks

---

## 📁 Project Structure

```
kanban-board/
├── db.json                      # json-server mock database
├── index.html                   # HTML entry point
├── vite.config.js               # Vite + proxy config
├── package.json
└── src/
    ├── main.jsx                 # App bootstrap (QueryClient + MUI Theme)
    ├── App.jsx                  # Root layout: header, board, modal
    ├── components/
    │   ├── KanbanBoard.jsx      # DnD context orchestrator
    │   ├── KanbanColumn.jsx     # Column with infinite scroll + droppable
    │   ├── TaskCard.jsx         # Draggable task card
    │   ├── TaskModal.jsx        # Create / Edit modal
    │   └── SearchBar.jsx        # Global search input
    ├── hooks/
    │   └── useTasks.js          # React Query hooks (CRUD + move)
    ├── store/
    │   └── useStore.js          # Zustand global UI state
    └── utils/
        ├── api.js               # Axios API helpers
        └── theme.js             # MUI theme + column/priority config
```

---

## 🔌 API Endpoints

json-server exposes standard REST endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tasks` | List all tasks (supports `?column=`, `?q=`, `?_page=`, `?_limit=`) |
| `POST` | `/tasks` | Create a new task |
| `PATCH` | `/tasks/:id` | Partially update a task |
| `DELETE` | `/tasks/:id` | Delete a task |

### Task Schema

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "column": "backlog | in_progress | review | done",
  "priority": "low | medium | high",
  "createdAt": "ISO 8601 string"
}
```

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both API + client concurrently |
| `npm run client` | Start only the Vite client (port 3000) |
| `npm run api` | Start only json-server (port 4000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |

---

## 🧩 Key Implementation Decisions

### React Query Caching
- **staleTime**: 2 minutes — data from the last request won't trigger a background refetch within this window
- **gcTime**: 10 minutes — unused cache entries are evicted after 10 minutes
- Each column has its own query key `['tasks', column, searchQuery]`, so column-specific invalidation is scoped

### Drag & Drop Architecture
- `DndContext` wraps the entire board at the `KanbanBoard` level
- Each column is a `useDroppable` target
- Each task card is a `useSortable` item
- `closestCorners` collision detection handles overlapping drop zones
- `PointerSensor` with an `activationConstraint: { distance: 8 }` prevents accidental drags on click

### Infinite Scroll
- Each column uses `useInfiniteQuery` with page size of 8 tasks
- An `IntersectionObserver` watches a sentinel element at the bottom of each column
- When the sentinel enters the viewport, `fetchNextPage()` is called

### Zustand for UI State
- Modal open/close state, selected task, search query, and active drag task ID are all in Zustand
- Keeps server state (tasks data) purely in React Query, and UI state purely in Zustand — clean separation

---

## 🌐 Deployment

To deploy the React client, build it first:

```bash
npm run build
```

Then deploy the `dist/` folder to any static host (Vercel, Netlify, GitHub Pages).

> **Note**: For production, replace json-server with a real REST API. The `src/utils/api.js` file is the only place you need to update the `baseURL`.

---
<img width="1656" height="875" alt="image" src="https://github.com/user-attachments/assets/3f1e9087-7c39-4946-86c8-7550656035cc" />

## 📝 License

MIT
