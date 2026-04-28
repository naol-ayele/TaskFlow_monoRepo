# PROMPT: Product Requirements Document — TaskFlow

# Usage: Paste this into OpenCode at the start of every session

# This is the single source of truth for the entire project

---

## PROJECT OVERVIEW

TaskFlow is a collaborative productivity monorepo built by a 4-person team. It consists of shared packages (ui, utils, db, api, feature-x, feature-y) and 4 individual Next.js apps (one per team member). All members share one database and one API. Members can create tasks, assign them to each other, write notes, and track focus sessions using a Pomodoro timer, can chat with the team.

**Monorepo:** pnpm workspaces + Turborepo
**Framework:** Next.js 15 (App Router)
**Language:** TypeScript strict mode
**Database:** SQLite via Drizzle ORM
**API:** Express.js on port 3005
**UI:** Tailwind CSS v4 + ShadCN components

---

## TEAM STRUCTURE

| Member   | App           | Primary Ownership                     |
| -------- | ------------- | ------------------------------------- |
| Member 1 | apps/member-1 | packages/ui + packages/utils          |
| Member 2 | apps/member-2 | packages/db + packages/api            |
| Member 3 | apps/member-3 | packages/feature-x (Task Manager)     |
| Member 4 | apps/member-4 | packages/feature-y (Notes + Pomodoro) |
| Member 5 | apps/member-5 | packages/feature-z (Team Chat)        |

All members contribute to shared packages and assemble features in their own app.

---

## PART A — FEATURE-X: TASK MANAGER

### Owner: Member 3 (packages/feature-x)

---

### A1. FEATURE OVERVIEW

The Task Manager allows all 4 team members to create, view, update, assign, and delete tasks in a shared workspace. Any member can assign a task to any other member. Tasks have a status lifecycle (todo → in_progress → done), a priority level, and an optional due date. Members can comment on any task to collaborate.

**Lives in:** `packages/feature-x`
**Consumed by:** all 4 member apps

---

### A2. USER STORIES

**Core**

- US-01: As a member, I want to create a task with a title, description, priority, and due date so that I can track work that needs to be done.
- US-02: As a member, I want to assign a task to another member so that responsibilities are clear.
- US-03: As a member, I want to update a task's status so that the team knows its progress.
- US-04: As a member, I want to delete a task I created so that the board stays clean.
- US-05: As a member, I want to see all tasks in the workspace so that I have full visibility.
- US-06: As a member, I want to filter tasks by status, priority, or assignee so that I can focus on what matters.

**Collaboration**

- US-07: As a member, I want to comment on a task so that I can ask questions or give updates.
- US-08: As a member, I want to see who created and who is assigned to each task so that accountability is clear.
- US-09: As a member, I want to see tasks sorted by due date so that I know what is most urgent.

**Live Collaboration**

- US-10: As a member, I want the task list to automatically refresh every 10 seconds so that I can see changes made by other members without manually reloading.
- US-11: As a member, I want a "Refetch" button so that I can manually pull the latest tasks at any time.

**Edge Cases**

- US-12: As a member, I should not be able to delete a task created by another member.
- US-13: As a member, I should see a clear empty state when no tasks exist yet.
- US-14: As a member, I should see an error message if a task fails to save due to an API error.

---

### A3. FUNCTIONAL REQUIREMENTS

**Live Collaboration Polling**

- FR-19: The task list must poll GET /api/tasks every 10 seconds automatically while the page is mounted.
- FR-20: A "Refetch" button must be visible at all times on the task list. Clicking it immediately fetches fresh data and resets the 10-second poll interval.
- FR-21: Polling must be paused when the browser tab is hidden (document.visibilityState === "hidden") and resumed when the tab becomes visible again.
- FR-22: If a poll request fails, the existing task list stays visible. Show a subtle "Last updated X seconds ago" indicator instead of an error screen.
- FR-23: Polling must not trigger while a form or modal is open to avoid disrupting in-progress user input.

**Task CRUD**

- FR-01: A task must have a title (required, max 120 characters).
- FR-02: Description is optional (max 500 characters).
- FR-03: Status must be one of: todo, in_progress, done. Default is todo.
- FR-04: Priority must be one of: low, medium, high. Default is medium.
- FR-05: Due date is optional. Must not be in the past when creating.
- FR-06: createdBy is set automatically from the current user session.
- FR-07: assignedTo is optional. Must reference a valid user id.
- FR-08: Only the task creator can delete the task.
- FR-09: Any member can update status, priority, assignee, or due date on any task.
- FR-10: updatedAt must refresh on every update.

**Task Comments**

- FR-11: Comment body is required (max 300 characters).
- FR-12: Any member can comment on any task.
- FR-13: Comments cannot be edited or deleted (append-only).
- FR-14: Comments are displayed oldest-first under the task.

**Task Listing**

- FR-24: Default sort is by createdAt descending (newest first).
- FR-25: Members can filter by: status, priority, assignedTo.
- FR-26: Members can sort by: dueDate, priority, createdAt.
- FR-27: Task list must show: title, status, priority, assignee name, due date.
- FR-28: A "Refetch" button sits next to the task list heading. It shows a spinner while fetching.

---

### A4. USER FLOW

**Creating a Task**

1. Member opens their app and sees the Task Board.
2. Member clicks "New Task" button.
3. A form/modal opens with fields: title, description, priority, assignee, due date.
4. Member fills in title (required) and any optional fields.
5. Member clicks "Create Task".
6. App calls POST /api/tasks.
7. On success: modal closes, new task appears at top of the list.
8. On failure: error message shown inside the modal, form stays open.

**Updating Task Status**

1. Member sees a task card on the board.
2. Member clicks the status badge or a dropdown on the card.
3. Member selects new status (todo / in_progress / done).
4. App calls PATCH /api/tasks/:id with new status.
5. On success: card updates immediately (optimistic update).
6. On failure: card reverts to previous status, error toast shown.

**Assigning a Task**

1. Member opens task detail or clicks assign on a task card.
2. A dropdown shows all 4 team members.
3. Member selects an assignee.
4. App calls PATCH /api/tasks/:id with assignedTo.
5. On success: assignee name/avatar updates on the card.

**Adding a Comment**

1. Member opens task detail view.
2. Member types in the comment input at the bottom.
3. Member clicks "Post Comment".
4. App calls POST /api/tasks/:id/comments.
5. On success: comment appears at the bottom of the comment thread.
6. On failure: error shown, comment input preserved.

**Deleting a Task**

1. Member sees a delete button only on tasks they created.
2. Member clicks delete — a confirmation dialog appears.
3. Member confirms.
4. App calls DELETE /api/tasks/:id.
5. On success: task removed from the list.
6. On failure: error toast shown, task stays on the list.

---

### A5. EDGE CASES

| #     | Scenario                                      | Expected Behavior                                                                          |
| ----- | --------------------------------------------- | ------------------------------------------------------------------------------------------ |
| EC-01 | Member submits task with empty title          | Validation error shown inline: "Title is required"                                         |
| EC-02 | Title exceeds 120 characters                  | Input stops at 120 chars or shows "Max 120 characters"                                     |
| EC-03 | Due date set in the past                      | Validation error: "Due date must be today or in the future"                                |
| EC-04 | API is down when creating task                | Error message in modal: "Failed to create task. Please try again."                         |
| EC-05 | Two members update same task simultaneously   | Last write wins. No special conflict resolution needed.                                    |
| EC-06 | Member tries to delete another member's task  | Delete button not rendered. API also returns 403 if called directly.                       |
| EC-07 | Task list is empty                            | Show empty state: illustration + "No tasks yet. Create your first task."                   |
| EC-08 | Member double-clicks Create Task button       | Button disabled after first click until API responds.                                      |
| EC-09 | Comment body is empty                         | Submit button disabled until at least 1 character typed.                                   |
| EC-10 | assignedTo references a deleted user          | Show "Unknown member" as fallback. Never crash.                                            |
| EC-11 | Task has 100+ comments                        | Comments are paginated or virtualized (max 20 per load).                                   |
| EC-12 | Network is slow                               | Show loading skeleton on task list, spinner on form submit.                                |
| EC-13 | Poll fires while modal is open                | Skip that poll cycle silently. Resume polling after modal closes.                          |
| EC-14 | Poll fails due to API being down              | Keep showing last known data. Show subtle banner: "Having trouble connecting. Retrying..." |
| EC-15 | User clicks Refetch while a poll is in flight | Debounce — ignore the click if a fetch is already running.                                 |
| EC-16 | Tab is hidden for 5 minutes then refocused    | Resume polling immediately on visibility change and trigger one fetch right away.          |

---

### A6. PERFORMANCE REQUIREMENTS

- Task list API response: under 300ms for up to 500 tasks.
- Task list renders without pagination up to 50 tasks. Above 50, paginate.
- Status update must feel instant — use optimistic update, rollback on failure.
- Search/filter input must be debounced at 300ms.
- Task form must not re-render on every keystroke — use controlled inputs carefully.
- Polling interval is exactly 10 seconds. Use useRef to hold the interval id and clear it on unmount.
- Polling must not cause visible flicker or list re-ordering while the user is scrolling.

---

### A7. COMPONENT CONTRACT

```ts
// TaskCard
interface TaskCardProps {
  task: Task;
  currentUserId: string;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  onAssign: (taskId: string, userId: string) => void;
  onDelete: (taskId: string) => void;
  onClick: (taskId: string) => void;
}

// TaskList
interface TaskListProps {
  tasks: Task[];
  currentUserId: string;
  isLoading: boolean;
  isPolling: boolean;
  lastUpdatedAt: Date | null;
  onRefetch: () => void;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  onAssign: (taskId: string, userId: string) => void;
  onDelete: (taskId: string) => void;
  onTaskClick: (taskId: string) => void;
}

// TaskForm
interface TaskFormProps {
  members: User[];
  onSubmit: (data: NewTask) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

// TaskDetail
interface TaskDetailProps {
  task: Task;
  comments: TaskComment[];
  members: User[];
  currentUserId: string;
  onStatusChange: (status: Task["status"]) => void;
  onCommentSubmit: (body: string) => Promise<void>;
}

// TaskFilters
interface TaskFiltersProps {
  members: User[];
  value: {
    status?: string;
    priority?: string;
    assignedTo?: string;
    sortBy?: string;
  };
  onChange: (filters: TaskFiltersProps["value"]) => void;
}

// useTaskPolling (custom hook — lives in packages/feature-x)
interface UseTaskPollingOptions {
  intervalMs?: number; // default 10000
  pauseWhenHidden?: boolean; // default true
  pauseWhenModalOpen?: boolean; // default true
}

interface UseTaskPollingReturn {
  tasks: Task[];
  isLoading: boolean;
  isPolling: boolean;
  lastUpdatedAt: Date | null;
  refetch: () => void;
}
```

---

### A8. API CONTRACT

```
POST /api/tasks
  Body:    { title, description?, priority, assignedTo?, dueDate? }
  Success: 201 { success: true, data: Task }
  Error:   400 { success: false, error: "Title is required" }

GET /api/tasks
  Query:   ?status=&priority=&assignedTo=&sortBy=
  Success: 200 { success: true, data: Task[] }

PATCH /api/tasks/:id
  Body:    { title?, description?, status?, priority?, assignedTo?, dueDate? }
  Success: 200 { success: true, data: Task }
  Error:   404 { success: false, error: "Task not found" }

DELETE /api/tasks/:id
  Header:  x-user-id: string
  Success: 200 { success: true }
  Error:   403 { success: false, error: "Not authorized" }
  Error:   404 { success: false, error: "Task not found" }

GET /api/tasks/:id/comments
  Success: 200 { success: true, data: TaskComment[] }

POST /api/tasks/:id/comments
  Body:    { body, authorId }
  Success: 201 { success: true, data: TaskComment }
  Error:   400 { success: false, error: "Comment body is required" }
```

---

## PART B — FEATURE-Y: NOTES + POMODORO TIMER

### Owner: Member 4 (packages/feature-y)

---

### B1. FEATURE OVERVIEW

Feature Y has two sub-features: a Notes system and a Pomodoro Timer. Notes can be private (only visible to the creator) or shared (visible to all members). The Pomodoro Timer lets members log focus sessions with optional links to a task. Members can view their own session history and see a team-wide productivity summary.

**Lives in:** `packages/feature-y`
**Consumed by:** all 4 member apps

---

### B2. USER STORIES

**Notes**

- US-13: As a member, I want to create a private note so that I can keep personal working notes.
- US-14: As a member, I want to share a note with the team so that knowledge is visible to everyone.
- US-15: As a member, I want to edit my own notes so that I can keep them up to date.
- US-16: As a member, I want to delete my own notes so that I can remove outdated content.
- US-17: As a member, I want to see all shared notes from all team members so that I stay informed.
- US-18: As a member, I should not be able to edit or delete another member's notes.

**Pomodoro Timer**

- US-19: As a member, I want to start a 25-minute focus timer so that I can work without distraction.
- US-20: As a member, I want to link my Pomodoro session to a task so that my time is tracked against work.
- US-21: As a member, I want to take a short break (5 min) or long break (15 min) after a session.
- US-22: As a member, I want to see how many sessions I completed today so that I can track my productivity.
- US-23: As a member, I want to see a team-wide session count so that I can see collective productivity.

---

### B3. FUNCTIONAL REQUIREMENTS

**Notes**

- FR-19: Note title is required (max 100 characters).
- FR-20: Note body is required (max 5000 characters). Supports plain text.
- FR-21: isShared defaults to false (private).
- FR-22: Creator can toggle isShared at any time.
- FR-23: Only the creator can edit or delete their note.
- FR-24: All members can read shared notes. Private notes are only visible to their creator.
- FR-25: Notes list shows: title, author name, isShared status, updatedAt.
- FR-26: Notes are sorted by updatedAt descending by default.

**Pomodoro Timer**

- FR-27: Timer types: focus (25 min default), short_break (5 min), long_break (15 min).
- FR-28: Duration is configurable: focus 15–60 min, short_break 1–15 min, long_break 10–30 min.
- FR-29: Timer has three states: idle, running, completed.
- FR-30: When timer completes, a session is automatically logged via POST /api/pomodoro.
- FR-31: Session can optionally be linked to an existing task (taskId).
- FR-32: Member can cancel a running timer. Cancelled sessions are NOT logged.
- FR-33: Session history shows: type, duration, linked task title, completedAt.
- FR-34: Daily summary shows: total focus sessions today, total focus minutes today.
- FR-35: Team summary shows: each member's session count for today.

---

### B4. USER FLOW

**Creating a Note**

1. Member navigates to the Notes section of their app.
2. Member clicks "New Note".
3. Form opens with: title, body, isShared toggle.
4. Member fills in title and body.
5. Member optionally toggles "Share with team".
6. Member clicks "Save Note".
7. App calls POST /api/notes.
8. On success: note appears in the list, form closes.
9. On failure: error shown in form, content preserved.

**Sharing / Unsharing a Note**

1. Member sees their note in the list.
2. Member clicks the share toggle on the note card.
3. App calls PATCH /api/notes/:id with { isShared: true/false }.
4. On success: note visibility updates immediately.

**Running a Pomodoro Session**

1. Member opens the Timer section.
2. Member selects session type (focus / short_break / long_break).
3. Member optionally selects a linked task from a dropdown.
4. Member clicks "Start".
5. Timer counts down visually.
6. On completion: session auto-logs, completion sound/notification shown.
7. Member is prompted to start a break or another focus session.

**Cancelling a Timer**

1. Member clicks "Cancel" while timer is running.
2. Confirmation: "Cancel this session? It won't be logged."
3. Member confirms — timer resets to idle, nothing logged.

---

### B5. EDGE CASES

| #     | Scenario                                          | Expected Behavior                                                                                                                                                                                                                                                        |
| ----- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| EC-13 | Note title is empty                               | Validation error: "Title is required"                                                                                                                                                                                                                                    |
| EC-14 | Note body exceeds 5000 characters                 | Counter shown. Input capped or error shown.                                                                                                                                                                                                                              |
| EC-15 | Member tries to edit another member's note        | Edit/delete buttons not rendered. API returns 403.                                                                                                                                                                                                                       |
| EC-16 | Member refreshes page mid-timer                   | Timer state is lost — show "Session was interrupted" on return.                                                                                                                                                                                                          |
| EC-17 | API fails when logging completed session          | Show error toast: "Session complete but failed to save. Try logging manually."                                                                                                                                                                                           |
| EC-18 | Member links Pomodoro to a task that gets deleted | Show "Deleted task" as fallback in session history. Never crash.                                                                                                                                                                                                         |
| EC-19 | Notes list is empty                               | Show empty state: "No notes yet. Create your first note."                                                                                                                                                                                                                |
| EC-20 | Team Pomodoro summary has zero sessions           | Show empty state: "No focus sessions logged yet. Be the first to start!" — never show zeros or blank space.                                                                                                                                                              |
| EC-21 | Member double-clicks Save Note                    | Button disabled after first click until API responds.                                                                                                                                                                                                                    |
| EC-22 | Timer runs in background tab                      | Timer MUST use timestamp-based countdown. Store startedAt = Date.now() when timer starts. Each tick calculates remaining = duration - (Date.now() - startedAt). Never rely on counting setInterval ticks — browsers throttle intervals in background tabs causing drift. |
| EC-23 | Duration set below minimum                        | Input enforces minimum (focus min: 15 min).                                                                                                                                                                                                                              |

---

### B6. PERFORMANCE REQUIREMENTS

- Notes API response: under 200ms for up to 200 notes.
- Notes list renders up to 30 without pagination. Above 30, paginate or lazy load.
- Timer implementation MUST use Date.now() delta pattern — store startedAt timestamp on Start, compute remaining on every tick as (durationMs - (Date.now() - startedAt)). A setInterval tick-counter is FORBIDDEN for this reason: browsers throttle background tab intervals to ~1/min, which causes a 25-minute session to take far longer than 25 minutes.
- The setInterval in the timer is only a display refresh trigger (runs every 1000ms). It does NOT count time.
- Session history loads last 30 sessions by default.
- Team summary is fetched fresh on page load — no caching needed.

---

### B7. COMPONENT CONTRACT

```ts
// NoteCard
interface NoteCardProps {
  note: Note;
  currentUserId: string;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onToggleShare: (noteId: string, isShared: boolean) => void;
}

// NoteForm
interface NoteFormProps {
  initialValues?: Partial<Note>;
  onSubmit: (data: NewNote) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

// NoteList
interface NoteListProps {
  notes: Note[];
  currentUserId: string;
  isLoading: boolean;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onToggleShare: (noteId: string, isShared: boolean) => void;
}

// PomodoroTimer
interface PomodoroTimerProps {
  tasks: Task[];
  currentUserId: string;
  onSessionComplete: (session: NewPomodoroSession) => Promise<void>;
}

// SessionHistory
interface SessionHistoryProps {
  sessions: PomodoroSession[];
  tasks: Task[];
  isLoading: boolean;
}

// TeamSummary
interface TeamSummaryProps {
  sessions: PomodoroSession[];
  members: User[];
  emptyStateMessage?: string; // default: "No focus sessions logged yet. Be the first to start!"
}
```

---

### B8. API CONTRACT

```
POST /api/notes
  Body:    { title, body, isShared?, createdBy }
  Success: 201 { success: true, data: Note }
  Error:   400 { success: false, error: "Title is required" }

GET /api/notes
  Query:   ?userId= (returns own notes + all shared notes)
  Success: 200 { success: true, data: Note[] }

PATCH /api/notes/:id
  Body:    { title?, body?, isShared? }
  Header:  x-user-id: string
  Success: 200 { success: true, data: Note }
  Error:   403 { success: false, error: "Not authorized" }
  Error:   404 { success: false, error: "Note not found" }

DELETE /api/notes/:id
  Header:  x-user-id: string
  Success: 200 { success: true }
  Error:   403 { success: false, error: "Not authorized" }

GET /api/pomodoro
  Query:   ?userId= &date= (ISO date string for daily filter)
  Success: 200 { success: true, data: PomodoroSession[] }

POST /api/pomodoro
  Body:    { userId, taskId?, durationMinutes, type }
  Success: 201 { success: true, data: PomodoroSession }
  Error:   400 { success: false, error: "userId is required" }
```

---

## PART C — SHARED PACKAGES

### Owners: Member 1 (ui + utils), Member 2 (db + api)

---

### C1. packages/ui — Component Requirements

Member 1 must build and export these components minimum:

| Component  | Props Summary                                 | Used By                     |
| ---------- | --------------------------------------------- | --------------------------- |
| Button     | variant, size, disabled, onClick, children    | everywhere                  |
| Card       | className, children                           | task cards, note cards      |
| Badge      | variant (status/priority colors), children    | task status, priority       |
| Modal      | isOpen, onClose, title, children              | task form, note form        |
| Input      | label, error, ...HTMLInputProps               | all forms                   |
| Textarea   | label, error, maxLength, ...HTMLTextareaProps | note body, task description |
| Select     | label, options, value, onChange               | assignee, priority, filter  |
| Spinner    | size                                          | loading states              |
| EmptyState | icon, title, description, action?             | empty lists                 |
| Avatar     | name, avatarUrl?, size                        | user display                |

All components must:

- Use Tailwind CSS v4 classes only
- Accept className prop for overrides
- Be exported from packages/ui via the exports field in package.json

---

### C2. packages/utils — Function Requirements

Member 1 must export these utilities minimum:

```ts
formatDate(date: Date): string
// "Jan 15, 2026"

formatRelativeTime(date: Date): string
// "2 hours ago", "yesterday", "3 days ago"

generateId(prefix: string): string
// "task_a1b2c3d4"

truncateText(text: string, maxLength: number): string
// "This is a long te..."

msToMinutes(ms: number): number
// 90000 → 1

formatDuration(minutes: number): string
// 25 → "25:00", counts down

isOverdue(dueDate: Date): boolean
// true if dueDate is before today

getPriorityColor(priority: "low" | "medium" | "high"): string
// returns Tailwind class string

getStatusColor(status: "todo" | "in_progress" | "done"): string
// returns Tailwind class string
```

---

### C3. packages/db — Schema and Query Requirements

Member 2 must ensure:

- All 5 tables exist: users, tasks, taskComments, notes, pomodoroSessions
- All type exports exist: User, NewUser, Task, NewTask, TaskComment, NewTaskComment, Note, NewNote, PomodoroSession, NewPomodoroSession
- drizzle.config.ts points to correct db path
- db instance is exported as named export `db`

---

### C4. packages/api — Route Requirements

Member 2 must implement all routes defined in A8 and B8 above.

Additional requirements:

- All routes must be in separate route files (tasks.ts, notes.ts, pomodoro.ts)
- A services file per domain handles db queries (taskService.ts, noteService.ts, pomodoroService.ts)
- server.ts only mounts routers — no business logic in server.ts
- All user identity is passed via x-user-id request header (no auth system needed)

---

## PART D — INDIVIDUAL APPS

### Each member owns their own app

---

### D1. Rules for All Apps

- ONLY import from @taskflow/\* packages
- NO business logic — only state management for UI and API calls
- NO direct database access
- NO new component definitions
- Each app must have its own layout.tsx that imports @taskflow/ui/globals.css
- Each app must add @taskflow/ui, @taskflow/feature-x, @taskflow/feature-y to transpilePackages in next.config.ts

---

### D2. Minimum Pages Per App

Each member's app must have at minimum:

| Route         | Description                                              |
| ------------- | -------------------------------------------------------- |
| `/`           | Dashboard — shows task summary + session count for today |
| `/tasks`      | Full task board with filters                             |
| `/tasks/[id]` | Task detail with comments                                |
| `/notes`      | Notes list (own + shared)                                |
| `/timer`      | Pomodoro timer + session history                         |

---

### D3. Individual Creativity

Each member must demonstrate personal creativity in their own app. Suggestions:

- Member 1: Focus on UI polish — dark mode toggle, custom color scheme
- Member 2: Add a team analytics page using session and task data
- Member 3: Add a kanban board view for tasks (column per status)
- Member 4: Add a weekly productivity chart using session history

These are suggestions — each member chooses their own extension as long as it uses only the shared packages.

---

## PART E — GLOBAL CONSTRAINTS

- No authentication system required. User identity is passed as a hardcoded userId per app (e.g. member-1 app always uses userId "user_member1").
- No WebSocket or Socket.io. Collaboration is achieved via polling — the task list polls GET /api/tasks every 10 seconds.
- No file uploads.
- No external APIs or third-party services.
- All data lives in a single SQLite file at the monorepo root (taskflow.db).
- The API must be running for apps to work. All apps point to http://localhost:3005/api.

---

## PART F — FEATURE-Z: TEAM CHAT

Owner: Member 5 (packages/feature-z)
F1. FEATURE OVERVIEW

Team Chat provides a centralized communication hub for all 4 (now 5) team members. It consists of a "Global Channel" for general talk and the ability to link messages to specific Tasks or Notes. Following the project's technical constraints, it uses Short Polling rather than WebSockets.

Lives in: packages/feature-z
Consumed by: all 5 member apps
F2. USER STORIES

    US-24: As a member, I want to send a message to the team chat so that I can communicate in real-time.

    US-25: As a member, I want to see a list of recent messages from all team members.

    US-26: As a member, I want my messages to show my name and a timestamp so others know who said what.

    US-27: As a member, I want to "tag" a Task or Note in a message so that we can discuss specific items.

    US-28: As a member, I want the chat to stay updated automatically so I don't miss new messages.

F3. FUNCTIONAL REQUIREMENTS

Message Lifecycle

    FR-36: A message must have a body (required, max 500 characters).

    FR-37: Messages are append-only (cannot be edited or deleted to keep complexity medium).

    FR-38: Messages can optionally include a relatedId and relatedType (task or note).

    FR-39: Messages must be stored with a createdAt timestamp.

Live Chat Polling

    FR-40: The chat window must poll GET /api/messages every 5 seconds (more frequent than tasks) while the chat component is visible.

    FR-41: Polling must pause when the tab is hidden and resume on focus.

    FR-42: When the user sends a message, the list should update optimistically (show the message immediately in a "sending" state).

Display

    FR-43: Chat list should automatically scroll to the bottom when new messages arrive.

    FR-44: Messages sent by the "current user" should be visually aligned differently (e.g., right-aligned) than messages from others.

F4. USER FLOW

Sending a Message

1.  Member opens the Chat sidebar or page.
2.  Member types a message into the input field.
3.  Member clicks "Send" or presses "Enter".
4.  App calls POST /api/messages.
5.  On success: Message state changes from "sending" to "sent."
6.  On failure: Message shows a "retry" icon or error toast.

F5. COMPONENT CONTRACT

```ts
// ChatWindow
interface ChatWindowProps {
  currentUserId: string;
  messages: ChatMessage[];
  onSendMessage: (
    body: string,
    relatedItem?: { id: string; type: "task" | "note" },
  ) => Promise<void>;
  isLoading: boolean;
}

// MessageBubble
interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  authorName: string;
}

// useChatPolling (custom hook)
interface UseChatPollingReturn {
  messages: ChatMessage[];
  sendMessage: (body: string) => void;
  isPolling: boolean;
}
```

F6. API CONTRACT
GET /api/messages
Query: ?limit=50&afterId=
Success: 200 { success: true, data: ChatMessage[] }

POST /api/messages
Body: { body, authorId, relatedId?, relatedType? }
Success: 201 { success: true, data: ChatMessage }

F7. INDIVIDUAL CREATIVITY (Member 5)

    Idea 1: Add Emoji Reactions to messages (stored as a simple JSON array in the message table).

    Idea 2: Create a "Chat Sidebar" that can be toggled open from any page (tasks, timer, etc.) so the user can chat while working.

    Idea 3: Implement @mentions that highlight a user's name in a different color when they are mentioned in a message.

## DONE CRITERIA — FULL PROJECT

The project is complete when:

- [ ] pnpm install runs without errors
- [ ] pnpm dev starts all 4 apps and the API without errors
- [ ] All 5 database tables exist after running pnpm db:push
- [ ] All API endpoints respond correctly (manual test or automated)
- [ ] feature-x exports: TaskCard, TaskList, TaskForm, TaskDetail, TaskFilters, useTaskPolling
- [ ] feature-y exports: NoteCard, NoteList, NoteForm, PomodoroTimer, SessionHistory, TeamSummary
- [ ] Task list auto-refreshes every 10 seconds across all apps
- [ ] Refetch button is visible and functional on the task list
- [ ] Polling pauses when tab is hidden and resumes on tab focus
- [ ] Polling pauses when a modal is open
- [ ] PomodoroTimer uses Date.now() delta — verified by switching tabs mid-session
- [ ] TeamSummary shows empty state copy when no sessions exist for the day
- [ ] All 5 apps render without TypeScript errors
- [ ] Each app has all 5 required routes
- [ ] feature-z exports: ChatWindow, MessageBubble, useChatPolling.
- [ ] Chat polls every 5 seconds.
- [ ] Chat automatically scrolls to the bottom on new messages.
- [ ] Member 5 app has a dedicated /chat route.
- [ ] Messages correctly display the author's name from the users table.
- [ ] No business logic exists inside any app folder
- [ ] No cross-package imports violate the dependency direction rules
- [ ] Each member's app has at least one individual creative extension
- [ ] Root README.md documents how to run the project
