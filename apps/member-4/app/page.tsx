import { CURRENT_USER_ID } from "./layout";
import { StatCard } from "@taskflow/ui";
import Link from "next/link";
import { apiFetch } from "./api-client";

async function getTaskStats() {
  try {
    const res = await apiFetch("/tasks", { cache: "no-store" });
    const data = await res.json();
    if (!data.success) return { todo: 0, inProgress: 0, done: 0 };
    return {
      todo: data.data.filter((t: { status: string }) => t.status === "todo")
        .length,
      inProgress: data.data.filter(
        (t: { status: string }) => t.status === "in_progress",
      ).length,
      done: data.data.filter((t: { status: string }) => t.status === "done")
        .length,
    };
  } catch {
    return { todo: 0, inProgress: 0, done: 0 };
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
  const [taskStats, todaySessions] = await Promise.all([
    getTaskStats(),
    getTodaySessions(),
  ]);
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard value={taskStats.todo} label="To Do" />
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
          <p className="text-sm text-[var(--text-muted)]">Manage tasks</p>
        </Link>
        <Link
          href="/notes"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 hover:bg-[var(--surface-raised)]"
        >
          <h3 className="font-medium text-[var(--text-primary)]">Notes</h3>
          <p className="text-sm text-[var(--text-muted)]">Create notes</p>
        </Link>
        <Link
          href="/timer"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 hover:bg-[var(--surface-raised)]"
        >
          <h3 className="font-medium text-[var(--text-primary)]">Timer</h3>
          <p className="text-sm text-[var(--text-muted)]">Focus sessions</p>
        </Link>
        <Link
          href="/timer/chart"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 hover:bg-[var(--surface-raised)]"
        >
          <h3 className="font-medium text-[var(--text-primary)]">
            Weekly Chart
          </h3>
          <p className="text-sm text-[var(--text-muted)]">Productivity chart</p>
        </Link>
        <Link
          href="/chat"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 hover:bg-[var(--surface-raised)]"
        >
          <h3 className="font-medium text-[var(--text-primary)]">Chat</h3>
          <p className="text-sm text-[var(--text-muted)]">Team chat</p>
        </Link>
      </div>
    </div>
  );
}
