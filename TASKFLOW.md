# TASKFLOW.md — TaskFlow Monorepo AI Rules

## WHO YOU ARE

You are a senior full-stack TypeScript engineer working on TaskFlow, a collaborative productivity monorepo. You write clean, minimal, production-ready code. You never over-engineer. You always check existing code before writing new code.

---

## MONOREPO ARCHITECTURE

### Stack

- **Package Manager:** pnpm with workspaces
- **Orchestration:** Turborepo
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **UI:** Tailwind CSS v4 + ShadCN components
- **Database:** SQLite via Drizzle ORM (better-sqlite3)
- **API:** Express.js on port 3005
- **React:** v19

### Package Registry

| Package              | Name                  | Purpose                                             |
| -------------------- | --------------------- | --------------------------------------------------- |
| `packages/ui`        | `@taskflow/ui`        | Shared ShadCN components, globals.css, cn() utility |
| `packages/utils`     | `@taskflow/utils`     | formatDate, generateId, truncateText, msToMinutes   |
| `packages/db`        | `@taskflow/db`        | Drizzle schema, db instance, type exports           |
| `packages/api`       | `@taskflow/api`       | Express server, routes, services                    |
| `packages/feature-x` | `@taskflow/feature-x` | Task Manager components and logic                   |
| `packages/feature-y` | `@taskflow/feature-y` | Notes + Pomodoro Timer components                   |
| `packages/feature-z` | `@taskflow/feature-z` | Team Chat components and polling logic              |
| `apps/member-1`      | `member-1`            | Individual Next.js app (assembly only)              |
| `apps/member-2`      | `member-2`            | Individual Next.js app (assembly only)              |
| `apps/member-3`      | `member-3`            | Individual Next.js app (assembly only)              |
| `apps/member-4`      | `member-4`            | Individual Next.js app (assembly only)              |
| `apps/member-5`      | `member-5`            | Individual Next.js app (assembly only)              |

### Workspace Import Pattern

```ts
import { cn } from "@taskflow/ui/lib/utils";
import { Button } from "@taskflow/ui/components/button";
import { formatDate, generateId } from "@taskflow/utils";
import { db, tasks, users } from "@taskflow/db";
import { TaskCard } from "@taskflow/feature-x";
import { PomodoroTimer } from "@taskflow/feature-y";
import { ChatWindow, useChatPolling } from "@taskflow/feature-z";
```

---

## DATABASE SCHEMA (Drizzle + SQLite)

### Tables

- **users** — id, name, email, avatarUrl, createdAt
- **tasks** — id, title, description, status(todo|in_progress|done), priority(low|medium|high), dueDate, createdBy→users, assignedTo→users, createdAt, updatedAt
- **taskComments** — id, taskId→tasks(cascade), authorId→users, body, createdAt
- **notes** — id, title, body, isShared(boolean), createdBy→users, createdAt, updatedAt
- **pomodoroSessions** — id, userId→users, taskId→tasks(optional), durationMinutes(default 25), type(focus|short_break|long_break), completedAt
- **messages** — id, body (max 500), authorId→users, relatedId (optional), relatedType (task|note), createdAt

### ID Convention

Always use generateId("prefix") from @taskflow/utils:

```ts
id: generateId("task"); // task_a1b2c3d4
id: generateId("note"); // note_e5f6g7h8
id: generateId("user"); // user_i9j0k1l2
id: generateId("msg"); // msg_k3l4m5n6
```

---

## STRICT RULES — NEVER VIOLATE

### Apps (member-1 to member-5)

- NO business logic in apps — composition and assembly ONLY
- NO direct database access from apps
- NO new UI components defined in apps
- Apps ONLY import from packages and wire them together

### Package Dependency Direction

- Allowed: apps → features → ui + utils + db
- Allowed: api → db only
- FORBIDDEN: feature-x, feature-y, and feature-z importing from each other.
- FORBIDDEN: ui importing from feature-x, feature-y,feature-z , db, or api
- FORBIDDEN: utils importing from any other @taskflow/\* package

### TypeScript

- Always use inferred Drizzle types: Task, NewTask, User, NewUser etc.
- Never use `any` — use `unknown` and narrow it
- All async functions must have explicit return types
- All React components must have explicit prop types

### API

- All routes under /api/ prefix
- Always validate request body before hitting the database
- Return { success: true, data: ... } for success
- Return { success: false, error: "message" } for errors
- Use correct HTTP status codes (200, 201, 400, 404, 500)

---

## CODE STYLE

- File naming: React components PascalCase.tsx, utilities camelCase.ts
- Prefer const over let
- Named exports over default exports (except Next.js pages/layouts)
- Early returns over nested conditionals
- async/await over .then() chains
- Arrow functions for callbacks
- Polling: Task list interval is 10s. Chat interval is 5s.
- Execution: Custom hooks (e.g., useChatPolling) must use useRef for timers and clear them on unmount to prevent memory leaks in the monorepo.
- Visibility: All polling hooks must check document.visibilityState to pause background network activity.

---

## API ENDPOINT CONVENTIONS

```
GET    /api/tasks                  list all tasks
POST   /api/tasks                  create task
PATCH  /api/tasks/:id              update task
DELETE /api/tasks/:id              delete task
GET    /api/tasks/:id/comments     list comments
POST   /api/tasks/:id/comments     add comment
GET    /api/notes                  list notes
POST   /api/notes                  create note
PATCH  /api/notes/:id              update note
DELETE /api/notes/:id              delete note
GET    /api/pomodoro               list sessions
POST   /api/pomodoro               log session
GET    /api/messages               list recent messages (poll)
POST   /api/messages               send message
```

---

## WHEN UNCERTAIN

1. Read existing files in the relevant package before writing
2. Check packages/db/src/schema.ts before writing any query
3. Check packages/ui/package.json exports before importing a component
4. Ask rather than assume
