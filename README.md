# TaskFlow

A collaborative team productivity app built as a **pnpm monorepo** with Turborepo. Five team members each own a Next.js app and a shared package, all communicating through a single Express API and SQLite database.

---

## Tech Stack

| Layer     | Technology                                |
| --------- | ----------------------------------------- |
| Monorepo  | pnpm workspaces + Turborepo               |
| Frontend  | Next.js 16, React 19, TypeScript (strict) |
| Styling   | Tailwind CSS v4 + ShadCN                  |
| API       | Express.js on port 3005                   |
| Database  | SQLite via Drizzle ORM (better-sqlite3)   |
| Dev Tools | tsx watch                                 |

---

## Project Structure

```
taskflow/
├── apps/
│   ├── member-1/        # Dashboard + Tasks + Notes + Timer + Chat
│   ├── member-2/        # Dashboard + Analytics + Tasks + Notes + Timer + Chat
│   ├── member-3/        # Dashboard + Kanban + Tasks + Notes + Timer + Chat
│   ├── member-4/        # Dashboard + Tasks + Notes + Timer (Pomodoro) + Weekly Chart + Chat
│   └── member-5/        # Dashboard + Tasks + Notes + Timer + Chat
├── packages/
│   ├── api/             # Express routes: tasks, notes, pomodoro, messages, users
│   ├── db/              # Drizzle schema, migrations, types
│   ├── ui/              # Shared components: Button, Card, Modal, Input, etc.
│   ├── utils/           # Shared utilities: formatDate, formatRelativeTime, generateId, etc.
│   ├── feature-x/       # Task Manager: TaskCard, TaskList, TaskForm, TaskDetail, TaskFilters
│   ├── feature-y/       # Notes + Pomodoro: NoteCard, NoteList, NoteForm, PomodoroTimer
│   ├── feature-z/       # Team Chat: ChatWindow, MessageBubble
│   ├── eslint-config/
│   └── typescript-config/
├── TASKFLOW.md          # Architecture rules
└── PRD-taskflow.md      # Full product requirements
```

---

## Team Ownership

| Member   | App             | Package                                 |
| -------- | --------------- | --------------------------------------- |
| Member 1 | `apps/member-1` | `packages/ui` + `packages/utils`        |
| Member 2 | `apps/member-2` | `packages/db` + `packages/api`          |
| Member 3 | `apps/member-3` | `packages/feature-x` (Task Manager)     |
| Member 4 | `apps/member-4` | `packages/feature-y` (Notes + Pomodoro) |
| Member 5 | `apps/member-5` | `packages/feature-z` (Team Chat)        |

---

## Database Schema

| Table              | Key Fields                                                               |
| ------------------ | ------------------------------------------------------------------------ |
| `users`            | id, name, email, avatarUrl, createdAt                                    |
| `tasks`            | id, title, description, status, priority, dueDate, createdBy, assignedTo |
| `taskComments`     | id, taskId, authorId, body, createdAt                                    |
| `notes`            | id, title, body, isShared, createdBy, createdAt, updatedAt               |
| `pomodoroSessions` | id, userId, taskId, durationMinutes, type, completedAt                   |
| `messages`         | id, body, authorId, relatedId, relatedType, createdAt                    |

All IDs use the `generateId("prefix")` utility — e.g. `task_a1b2c3d4`.

---

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 9+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd taskflow

# Install all dependencies
pnpm install

# Push database schema
pnpm --filter @taskflow/db db:push

# Seed the database with 5 users
cd packages/db
npx tsx seed.ts
cd ../..
```

### Running in Development

You need **two terminals**:

**Terminal 1 — API server:**

```bash
pnpm --filter @taskflow/api dev
# Runs on http://localhost:3005/api
```

**Terminal 2 — All apps:**

```bash
pnpm dev
# member-1: http://localhost:3000
# member-2: http://localhost:3001
# member-3: http://localhost:3002
# member-4: http://localhost:3003
# member-5: http://localhost:3004
```

### Building

```bash
pnpm build
# Expected: Tasks 7 successful, 7 total
```

---

## API Endpoints

All endpoints require the `x-user-id` header.

| Method | Endpoint                  | Description                                             |
| ------ | ------------------------- | ------------------------------------------------------- |
| GET    | `/api/tasks`              | List tasks (filterable by status, priority, assignedTo) |
| POST   | `/api/tasks`              | Create task                                             |
| PATCH  | `/api/tasks/:id`          | Update task                                             |
| DELETE | `/api/tasks/:id`          | Delete task                                             |
| GET    | `/api/tasks/:id`          | Get single task                                         |
| GET    | `/api/tasks/:id/comments` | Get task comments                                       |
| POST   | `/api/tasks/:id/comments` | Add comment                                             |
| GET    | `/api/notes`              | List notes (own + shared)                               |
| POST   | `/api/notes`              | Create note                                             |
| PATCH  | `/api/notes/:id`          | Update note                                             |
| DELETE | `/api/notes/:id`          | Delete note                                             |
| GET    | `/api/messages`           | List messages                                           |
| POST   | `/api/messages`           | Send message                                            |
| GET    | `/api/pomodoro`           | List sessions                                           |
| POST   | `/api/pomodoro`           | Save session                                            |
| GET    | `/api/users`              | List all users                                          |

---

## Features

### Tasks

- Create, edit, delete tasks
- Status: `todo` → `in progress` → `done`
- Priority: low, medium, high
- Due dates, assignee, comments
- List and Kanban board views
- Filter by status, priority, assignee

### Notes

- Create, edit, delete personal notes
- Share notes with the team
- Rich body text (up to 5000 chars)

### Pomodoro Timer (Member 4)

- 25-min focus / 5-min short break / 15-min long break
- Start, pause, resume, cancel
- Link sessions to tasks
- Persists across page navigation (React Context)
- Session history + today's stats
- Weekly chart

### Team Chat

- Real-time-like messaging (manual refresh)
- Color-coded member avatars
- Message attribution with member names

### Analytics (Member 2)

- Task completion stats
- Team productivity overview

---

## Architecture Rules

See `TASKFLOW.md` for the full rules. Key constraints:

- **Apps**: assembly only — no business logic, no direct DB access, no new components
- **Dependency direction**: `apps → features → ui/utils/db`; `api → db` only
- **Features cannot import from each other**
- **All IDs** via `generateId()` from `@taskflow/utils`
- **API responses**: always `{ success: true, data }` or `{ success: false, error }`
- **User identity**: hardcoded per app (`user_member1` through `user_member5`), no auth system

---

## User Identities (Dev)

| App      | User ID        | Name         |
| -------- | -------------- | ------------ |
| member-1 | `user_member1` | Member One   |
| member-2 | `user_member2` | Member Two   |
| member-3 | `user_member3` | Member Three |
| member-4 | `user_member4` | Member Four  |
| member-5 | `user_member5` | Member Five  |

---

## License

MIT
