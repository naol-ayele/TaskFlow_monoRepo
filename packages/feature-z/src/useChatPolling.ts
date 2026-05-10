import { useRef, useEffect, useState, useCallback } from "react";
import type { Message } from "@taskflow/db";

export interface UseChatPollingOptions {
  intervalMs?: number;
  pauseWhenHidden?: boolean;
  enabled?: boolean;
}

export interface UseChatPollingReturn {
  messages: Message[];
  isLoading: boolean;
  isPolling: boolean;
  sendMessage: (
    body: string,
    relatedId?: string,
    relatedType?: "task" | "note",
  ) => Promise<void>;
  refetch: () => void;
}

export function useChatPolling(
  fetchMessages: () => Promise<Message[]>,
  sendMessageFn: (
    body: string,
    relatedId?: string,
    relatedType?: "task" | "note",
  ) => Promise<Message>,
  options: UseChatPollingOptions = {},
): UseChatPollingReturn {
  const { intervalMs = 5000, pauseWhenHidden = true, enabled = true } = options;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPollingRef = useRef(false);
  const isVisibleRef = useRef(true);

  const fetchAndUpdate = useCallback(async () => {
    if (
      !enabled ||
      isPollingRef.current ||
      (pauseWhenHidden && !isVisibleRef.current)
    ) {
      return;
    }

    isPollingRef.current = true;
    setIsLoading(true);

    try {
      const data = await fetchMessages();
      setMessages(data);
    } catch (error) {
      console.error("Chat polling error:", error);
    } finally {
      isPollingRef.current = false;
      setIsLoading(false);
    }
  }, [fetchMessages, enabled, pauseWhenHidden]);

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
      setIsPolling(true);
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
      setIsPolling(false);
    }

    return clearPollingInterval;
  }, [enabled, startPolling, clearPollingInterval]);

  const sendMessage = useCallback(
    async (body: string, relatedId?: string, relatedType?: "task" | "note") => {
      const newMessage = await sendMessageFn(body, relatedId, relatedType);
      setMessages((prev) => [...prev, newMessage]);
    },
    [sendMessageFn],
  );

  const refetch = useCallback(() => {
    fetchAndUpdate();
    if (intervalRef.current) {
      clearPollingInterval();
      intervalRef.current = setInterval(fetchAndUpdate, intervalMs);
    }
  }, [fetchAndUpdate, intervalMs, clearPollingInterval]);

  return {
    messages,
    isLoading,
    isPolling,
    sendMessage,
    refetch,
  };
}
