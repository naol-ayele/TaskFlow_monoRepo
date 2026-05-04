"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";

export type TimerState = "idle" | "running" | "paused" | "completed";

export type SessionType = "focus" | "short_break" | "long_break";

interface TimerContextType {
  timerState: TimerState;
  remainingMs: number;
  totalMs: number;
  sessionType: SessionType;
  setSessionDuration: (durationMs: number, type: SessionType) => void;
  startTimer: (totalMs: number, type: SessionType) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  cancelTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

interface TimerProviderProps {
  children: ReactNode;
}

export function TimerProvider({ children }: TimerProviderProps) {
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [remainingMs, setRemainingMs] = useState(25 * 60 * 1000);
  const [totalMs, setTotalMs] = useState(25 * 60 * 1000);
  const [sessionType, setSessionType] = useState<SessionType>("focus");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [pausedAt, setPausedAt] = useState<number | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [, setTick] = useState(0);

  const clearTickInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const getRemainingTime = useCallback(() => {
    if (!startedAt) return totalMs;
    const elapsed = Date.now() - startedAt;
    const remaining = totalMs - elapsed;
    return Math.max(0, remaining);
  }, [startedAt, totalMs]);

  useEffect(() => {
    if (timerState !== "running") {
      clearTickInterval();
      return;
    }

    intervalRef.current = setInterval(() => {
      setTick((t) => t + 1);
      const remaining = getRemainingTime();
      setRemainingMs(remaining);

      if (remaining <= 0) {
        setTimerState("completed");
        clearTickInterval();
      }
    }, 1000);

    return clearTickInterval;
  }, [timerState, getRemainingTime, clearTickInterval]);

  const startTimer = useCallback((newTotalMs: number, type: SessionType) => {
    setTotalMs(newTotalMs);
    setRemainingMs(newTotalMs);
    setSessionType(type);
    setStartedAt(Date.now());
    setPausedAt(null);
    setTimerState("running");
  }, []);

  const pauseTimer = useCallback(() => {
    const currentRemaining = getRemainingTime();
    setPausedAt(Date.now());
    setRemainingMs(currentRemaining);
    setTimerState("paused");
    clearTickInterval();
  }, [getRemainingTime, clearTickInterval]);

  const resumeTimer = useCallback(() => {
    const remainingWhenPaused = remainingMs;
    setStartedAt(Date.now() - (totalMs - remainingWhenPaused));
    setPausedAt(null);
    setTimerState("running");
  }, [pausedAt, remainingMs, totalMs]);

  const cancelTimer = useCallback(() => {
    setTimerState("idle");
    setRemainingMs(totalMs);
    setStartedAt(null);
    setPausedAt(null);
    clearTickInterval();
    setTick((t) => t + 1);
  }, [totalMs, clearTickInterval]);

  const setSessionDuration = useCallback((durationMs: number, type: SessionType) => {
    setSessionType(type);
    setTotalMs(durationMs);
    setRemainingMs(durationMs);
    setTimerState("idle");
    setStartedAt(null);
    setPausedAt(null);
    clearTickInterval();
  }, [clearTickInterval]);

  useEffect(() => {
    setRemainingMs(getRemainingTime());
  }, [getRemainingTime]);

  return (
    <TimerContext.Provider
      value={{
        timerState,
        remainingMs,
        totalMs,
        sessionType,
        setSessionDuration,
        startTimer,
        pauseTimer,
        resumeTimer,
        cancelTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within TimerProvider");
  }
  return context;
}
