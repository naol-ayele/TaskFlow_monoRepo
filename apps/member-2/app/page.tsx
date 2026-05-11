import { apiFetch } from "./api-client";
import { StatCard } from "@taskflow/ui";
import Link from "next/link";

async function getTaskStats() {
  try {
    const res = await apiFetch("/tasks", { cache: "no-store" });
    const data = await res.json();
    if (!data.success) return { todo: 0, inProgress: 0, done: 0 };
    const tasks = data.data;
    return {
      todo: tasks.filter((t: { status: string }) => t.status === "todo").length,
      inProgress: tasks.filter(
        (t: { status: string }) => t.status === "in_progress",
      ).length,
      done: tasks.filter((t: { status: string }) => t.status === "done").length,
    };
  } catch {
    return { todo: 0, inProgress: 0, done: 0 };
  }
}

async function getTeamStats() {
  try {
    const res = await apiFetch("/tasks", { cache: "no-store" });
    const data = await res.json();
    return data.success ? { total: data.data.length } : { total: 0 };
  } catch {
    return { total: 0 };
  }
}

async function getTodaySessions() {
  try {
    const res = await apiFetch("/pomodoro", { cache: "no-store" });
    const data = await res.json();
    if (!data.success) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return data.data.filter(
      (s: { completedAt: string; type: string }) =>
        s.type === "focus" && new Date(s.completedAt) >= today,
    ).length;
  } catch {
    return 0;
  }
}

export default async function Page() {
  const [taskStats, teamStats, todaySessions] = await Promise.all([
    getTaskStats(),
    getTeamStats(),
    getTodaySessions(),
  ]);
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard value={taskStats.todo} label="My To Do" />
        <StatCard value={taskStats.inProgress} label="In Progress" />
        <StatCard value={taskStats.done} label="Done" accent />
        <StatCard value={todaySessions} label="Focus Today" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/tasks"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 hover:bg-[var(--surface-raised)]"
        >
          <h3 className="font-medium text-[var(--text-primary)]">Tasks</h3>
          <p className="text-sm text-[var(--text-muted)]">Manage team tasks</p>
        </Link>
        <Link
          href="/notes"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 hover:bg-[var(--surface-raised)]"
        >
          <h3 className="font-medium text-[var(--text-primary)]">Notes</h3>
          <p className="text-sm text-[var(--text-muted)]">
            Create and share notes
          </p>
        </Link>
        <Link
          href="/timer"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 hover:bg-[var(--surface-raised)]"
        >
          <h3 className="font-medium text-[var(--text-primary)]">Pomodoro</h3>
          <p className="text-sm text-[var(--text-muted)]">Focus sessions</p>
        </Link>
        <Link
          href="/chat"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 hover:bg-[var(--surface-raised)]"
        >
          <h3 className="font-medium text-[var(--text-primary)]">Chat</h3>
          <p className="text-sm text-[var(--text-muted)]">Team chat</p>
        </Link>
        <Link
          href="/analytics"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 hover:bg-[var(--surface-raised)]"
        >
          <h3 className="font-medium text-[var(--text-primary)]">Analytics</h3>
          <p className="text-sm text-[var(--text-muted)]">Team productivity</p>
          <p className="text-xs text-[var(--accent)] mt-2">
            Total: {teamStats.total}
          </p>
        </Link>
      </div>
    </div>
  );
}