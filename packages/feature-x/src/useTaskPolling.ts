import { useEffect, useRef, useState, useCallback } from "react";
import type { Task } from "@taskflow/db";

export interface UseTaskPollingOptions {
  intervalMs?: number;
  pauseWhenHidden?: boolean;
  pauseWhenModalOpen?: boolean;
  enabled?: boolean;
}

export interface UseTaskPollingReturn {
  tasks: Task[];
  isLoading: boolean;
  isPolling: boolean;
  lastUpdatedAt: Date | null;
  refetch: () => void;
  setModalOpen: (open: boolean) => void;
}

export function useTaskPolling(
  fetchTasks: () => Promise<Task[]>,
  options: UseTaskPollingOptions = {},
): UseTaskPollingReturn {
  const {
    intervalMs = 10000,
    pauseWhenHidden = true,
    pauseWhenModalOpen = true,
    enabled = true,
  } = options;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPollingRef = useRef(false);
  const isVisibleRef = useRef(true);
  const isModalOpenRef = useRef(false);

  const fetchAndUpdate = useCallback(async () => {
    if (
      !enabled ||
      isPollingRef.current ||
      (pauseWhenHidden && !isVisibleRef.current) ||
      (pauseWhenModalOpen && isModalOpenRef.current)
    ) {
      return;
    }

    isPollingRef.current = true;
    setIsLoading(true);

    try {
      const data = await fetchTasks();
      setTasks(data);
      setLastUpdatedAt(new Date());
    } catch (error) {
      console.error("Polling error:", error);
    } finally {
      isPollingRef.current = false;
      setIsLoading(false);
    }
  }, [fetchTasks, enabled, pauseWhenHidden, pauseWhenModalOpen]);

  const clearPollingInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    clearPollingInterval();
    if (enabled) {
      fetchAndUpdate();
      intervalRef.current = setInterval(fetchAndUpdate, intervalMs);
    }
  }, [fetchAndUpdate, intervalMs, enabled, clearPollingInterval]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === "visible";
      if (document.visibilityState === "visible") {
        fetchAndUpdate();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    isVisibleRef.current = document.visibilityState === "visible";

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchAndUpdate]);

  useEffect(() => {
    fetchAndUpdate();
  }, []);

  useEffect(() => {
    if (enabled) {
      startPolling();
    } else {
      clearPollingInterval();
    }

    return clearPollingInterval;
  }, [enabled, startPolling, clearPollingInterval]);

  const refetch = useCallback(() => {
    fetchAndUpdate();
    if (intervalRef.current) {
      clearPollingInterval();
      intervalRef.current = setInterval(fetchAndUpdate, intervalMs);
    }
  }, [fetchAndUpdate, intervalMs, clearPollingInterval]);

  const setModalOpen = (open: boolean) => {
    isModalOpenRef.current = open;
  };

  return {
    tasks,
    isLoading,
    isPolling: !!intervalRef.current,
    lastUpdatedAt,
    refetch,
    setModalOpen,
  };
}
