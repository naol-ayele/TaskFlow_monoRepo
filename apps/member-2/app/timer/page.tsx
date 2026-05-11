"use client";

import { useState, useEffect } from "react";
import {
  PomodoroTimer,
  SessionHistory,
  TeamSummary,
} from "@taskflow/feature-y";
import type { Task, PomodoroSession, User } from "@taskflow/db";
import { CURRENT_USER_ID } from "../layout";
import { apiFetch } from "../api-client";
import { useTimer } from "../timer-context";

const TIMER_DURATIONS: Record<string, number> = {
  focus: 25 * 60 * 1000,
  short_break: 5 * 60 * 1000,
  long_break: 15 * 60 * 1000,
};

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [selectedDuration, setSelectedDuration] = useState("focus");

  const {
    timerState,
    remainingMs,
    setSessionDuration,
    startTimer,
    pauseTimer,
    resumeTimer,
    cancelTimer,
  } = useTimer();

  useEffect(() => {
    apiFetch("/tasks")
      .then((r) => r.json())
      .then((d) => d.success && setTasks(d.data));

    apiFetch("/pomodoro")
      .then((r) => r.json())
      .then((d) => d.success && setSessions(d.data));

    apiFetch("/users")
      .then((r) => r.json())
      .then((d) => d.success && setMembers(d.data));
  }, []);

  const handleStart = (duration: number, type: string, taskId?: string) => {
    startTimer(duration, type as "focus" | "short_break" | "long_break");
  };

  const complete = async (s: {
    userId: string;
    taskId?: string;
    durationMinutes: number;
    type: string;
  }) => {
    await apiFetch("/pomodoro", {
      method: "POST",
      body: JSON.stringify(s),
    });
    apiFetch("/pomodoro")
      .then((r) => r.json())
      .then((d) => d.success && setSessions(d.data));
  };

  const totalDuration =
    TIMER_DURATIONS[selectedDuration] || TIMER_DURATIONS.focus;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h2 className="mb-4 text-xl font-bold text-[var(--text-primary)]">
          Pomodoro Timer
        </h2>
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => {
              setSelectedDuration("focus");
              setSessionDuration(TIMER_DURATIONS.focus, "focus");
            }}
            className={`px-3 py-1 rounded text-sm ${
              selectedDuration === "focus"
                ? "bg-[var(--accent)] text-black"
                : "border border-[var(--border)]"
            }`}
          >
            Focus (25m)
          </button>
          <button
            onClick={() => {
              setSelectedDuration("short_break");
              setSessionDuration(TIMER_DURATIONS.short_break, "short_break");
            }}
            className={`px-3 py-1 rounded text-sm ${
              selectedDuration === "short_break"
                ? "bg-[var(--accent)] text-black"
                : "border border-[var(--border)]"
            }`}
          >
            Short (5m)
          </button>
          <button
            onClick={() => {
              setSelectedDuration("long_break");
              setSessionDuration(TIMER_DURATIONS.long_break, "long_break");
            }}
            className={`px-3 py-1 rounded text-sm ${
              selectedDuration === "long_break"
                ? "bg-[var(--accent)] text-black"
                : "border border-[var(--border)]"
            }`}
          >
            Long (15m)
          </button>
        </div>
        <PomodoroTimer
          timerState={timerState}
          remainingMs={remainingMs}
          totalMs={totalDuration}
          onStart={handleStart}
          onPause={pauseTimer}
          onResume={resumeTimer}
          onCancel={cancelTimer}
          tasks={tasks}
          currentUserId={CURRENT_USER_ID}
          onSessionComplete={complete}
        />
      </div>
      <div>
        <h2 className="mb-4 text-xl font-bold text-[var(--text-primary)]">
          My Sessions
        </h2>
        <SessionHistory sessions={sessions} tasks={tasks} isLoading={false} />
      </div>
      <div className="lg:col-span-2">
        <h2 className="mb-4 text-xl font-bold text-[var(--text-primary)]">
          Team Summary
        </h2>
        <TeamSummary sessions={sessions} members={members} />
      </div>
    </div>
  );
}