import { Clock } from "lucide-react";
import { EmptyState, Spinner } from "@taskflow/ui";
import type { PomodoroSession, Task } from "@taskflow/db";
import { formatDate, formatDuration } from "@taskflow/utils";

export interface SessionHistoryProps {
  sessions: PomodoroSession[];
  tasks: Task[];
  isLoading: boolean;
}

export function SessionHistory({
  sessions,
  tasks,
  isLoading,
}: SessionHistoryProps) {
  const getTask = (taskId: string | null | undefined): Task | undefined => {
    if (!taskId) return undefined;
    return tasks.find((t) => t.id === taskId);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaySessions = sessions.filter(
    (s) => s.completedAt && new Date(s.completedAt) >= today,
  );
  const focusSessions = todaySessions.filter((s) => s.type === "focus");
  const totalMinutes = focusSessions.reduce(
    (acc, s) => acc + s.durationMinutes,
    0,
  );

  if (isLoading && sessions.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--text-muted)]">Today's Sessions</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {focusSessions.length}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--text-muted)]">Today's Focus Time</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {formatDuration(totalMinutes)}
          </p>
        </div>
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          icon={<Clock className="h-6 w-6" />}
          title="No sessions yet"
          description="Start a focus session to track your productivity"
        />
      ) : (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Recent Sessions</h3>
          {sessions.slice(0, 10).map((session) => {
            const task = getTask(session.taskId);
            return (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {session.type.replace("_", " ")}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {task ? task.title : "Deleted task"}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm text-[var(--text-primary)]">
                    {formatDuration(session.durationMinutes)}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {formatDate(session.completedAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
