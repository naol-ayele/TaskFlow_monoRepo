import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Play, Pause, Square } from "lucide-react";
import { Button, Select } from "@taskflow/ui";
import { formatDuration } from "@taskflow/utils";
import type { Task } from "@taskflow/db";
import { cn } from "@taskflow/ui/lib/utils";

export interface PomodoroTimerProps {
  timerState: "idle" | "running" | "paused" | "completed";
  remainingMs: number;
  totalMs: number;
  onStart: (totalMs: number, type: string, taskId?: string) => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  tasks: Task[];
  currentUserId: string;
  onSessionComplete?: (session: {
    userId: string;
    taskId?: string;
    durationMinutes: number;
    type: string;
  }) => Promise<void>;
}

export function PomodoroTimer({
  timerState,
  remainingMs,
  totalMs,
  onStart,
  onPause,
  onResume,
  onCancel,
  tasks,
  currentUserId,
  onSessionComplete,
}: PomodoroTimerProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const hasSavedSession = useRef(false);

  const sessionType =
    totalMs === 5 * 60 * 1000
      ? "short_break"
      : totalMs === 15 * 60 * 1000
        ? "long_break"
        : "focus";

  useEffect(() => {
    if (timerState === "idle" || timerState === "running") {
      hasSavedSession.current = false;
    }
  }, [timerState]);

  useEffect(() => {
    if (timerState === "completed" && onSessionComplete && !hasSavedSession.current) {
      hasSavedSession.current = true;
      const completedDurationMs = totalMs - remainingMs;
      const durationMinutes = Math.round(completedDurationMs / 60000);
      onSessionComplete({
        userId: currentUserId,
        taskId: selectedTaskId || undefined,
        durationMinutes,
        type: sessionType,
      });
    }
  }, [timerState, onSessionComplete, currentUserId, selectedTaskId, totalMs, remainingMs, sessionType]);

  const progress =
    timerState === "running" ||
    timerState === "paused" ||
    timerState === "completed"
      ? ((totalMs - remainingMs) / totalMs) * 100
      : 0;

  const taskOptions = [
    { value: "", label: "No task linked" },
    ...tasks
      .filter((t) => t.status !== "done")
      .map((t) => ({ value: t.id, label: t.title })),
  ];

  const handleCancel = () => {
    if (showCancelConfirm) {
      onCancel();
      setShowCancelConfirm(false);
    } else {
      setShowCancelConfirm(true);
      setTimeout(() => setShowCancelConfirm(false), 3000);
    }
  };

  const handleStart = () => {
    onStart(totalMs, sessionType, selectedTaskId || undefined);
  };

  return (
    <div className="flex flex-col items-center gap-6 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--border)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="283"
            strokeDashoffset={283 * (1 - progress / 100)}
            className="transition-all"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-[var(--text-primary)]">
            {formatDuration(remainingMs / 60000)}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {timerState === "idle" && (
          <Button onClick={handleStart}>
            <Play className="mr-2 h-4 w-4" />
            Start
          </Button>
        )}
        {timerState === "running" && (
          <Button variant="outline" onClick={onPause}>
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </Button>
        )}
        {(timerState === "running" || timerState === "paused") && (
          <Button
            variant={showCancelConfirm ? "destructive" : "outline"}
            onClick={handleCancel}
          >
            <Square className="mr-2 h-4 w-4" />
            {showCancelConfirm ? "Confirm Cancel" : "Cancel"}
          </Button>
        )}
        {timerState === "paused" && (
          <Button onClick={onResume}>
            <Play className="mr-2 h-4 w-4" />
            Resume
          </Button>
        )}
        {timerState === "completed" && (
          <Button onClick={handleStart}>
            {sessionType === "focus" ? "Start Focus" : "Take Break"}
          </Button>
        )}
      </div>

      <Select
        label="Link to Task"
        options={taskOptions}
        value={selectedTaskId}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          setSelectedTaskId(e.target.value)
        }
        className="w-full"
      />

      {timerState === "completed" && onSessionComplete && (
        <p className="text-sm text-green-500">
          {sessionType === "focus" ? "Session complete!" : "Break complete!"}
        </p>
      )}
    </div>
  );
}
