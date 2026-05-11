"use client";
import { useState, useEffect } from "react";
import { TeamSummary } from "@taskflow/feature-y";
import type { Task, PomodoroSession, User } from "@taskflow/db";
import { apiFetch } from "../api-client";

async function getAllData() {
  const [tasksRes, pomoRes, usersRes] = await Promise.all([
    apiFetch("/tasks").then((r) => r.json()),
    apiFetch("/pomodoro?team=true").then((r) => r.json()),
    apiFetch("/notes").then((r) => r.json()),
  ]);
  return {
    tasks: tasksRes.success ? tasksRes.data : [],
    sessions: pomoRes.success ? pomoRes.data : [],
    users: usersRes.success ? usersRes.data : [],
  };
}

export default function Page() {
  const [data, setData] = useState<{
    tasks: Task[];
    sessions: PomodoroSession[];
    users: User[];
  }>({ tasks: [], sessions: [], users: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllData().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  const completedTasks = data.tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = data.tasks.filter(
    (t) => t.status === "in_progress",
  ).length;
  const totalTasks = data.tasks.length;
  const totalSessions = data.sessions.filter((s) => s.type === "focus").length;

  if (loading) return <div className="p-8">Loading analytics...</div>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">
        Team Analytics
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--text-muted)]">Total Tasks</p>
          <p className="text-3xl font-bold text-[var(--text-primary)]">
            {totalTasks}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--text-muted)]">In Progress</p>
          <p className="text-3xl font-bold text-blue-500">{inProgressTasks}</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--text-muted)]">Completed</p>
          <p className="text-3xl font-bold text-green-500">{completedTasks}</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--text-muted)]">Focus Sessions</p>
          <p className="text-3xl font-bold text-[var(--accent)]">
            {totalSessions}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="mb-4 text-lg font-semibold">Team Pomodoro</h2>
        <TeamSummary sessions={data.sessions} members={data.users} />
      </div>
    </div>
  );
}