import { Users } from "lucide-react";
import { EmptyState } from "@taskflow/ui";
import type { PomodoroSession, User } from "@taskflow/db";

export interface TeamSummaryProps {
  sessions: PomodoroSession[];
  members: User[];
  emptyStateMessage?: string;
}

export function TeamSummary({
  sessions,
  members,
  emptyStateMessage = "No focus sessions logged yet. Be the first to start!",
}: TeamSummaryProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaySessions = sessions.filter(
    (s) =>
      s.completedAt && new Date(s.completedAt) >= today && s.type === "focus",
  );

  const memberStats = members.map((member) => {
    const memberSessions = todaySessions.filter((s) => s.userId === member.id);
    const count = memberSessions.length;
    const minutes = memberSessions.reduce(
      (acc, s) => acc + s.durationMinutes,
      0,
    );
    return { member, count, minutes };
  });

  const totalSessions = todaySessions.length;
  const totalMinutes = todaySessions.reduce(
    (acc, s) => acc + s.durationMinutes,
    0,
  );

  if (totalSessions === 0) {
    return (
      <EmptyState
        icon={<Users className="h-6 w-6" />}
        title={emptyStateMessage}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--text-muted)]">
            Team Sessions Today
          </p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {totalSessions}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--text-muted)]">Team Focus Time</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Team Members</h3>
        {memberStats.map(({ member, count, minutes }) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3"
          >
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {member.name}
            </span>
            <div className="flex gap-4 text-sm">
              <span className="text-[var(--text-muted)]">{count} sessions</span>
              <span className="text-[var(--text-muted)]">{minutes}m</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
