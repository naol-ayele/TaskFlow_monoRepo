"use client";
import { useState, useEffect, useCallback } from "react";
import { ChatWindow } from "@taskflow/feature-z";
import { RefreshCcw } from "lucide-react";
import { Button } from "@taskflow/ui";
import { type Message, type User } from "@taskflow/db";
import { CURRENT_USER_ID } from "../layout";
import { apiFetch } from "../api-client";

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch("/messages");
      const data = await res.json();
      if (data.success) setMessages(data.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    apiFetch("/users")
      .then((r) => r.json())
      .then((d) => d.success && setMembers(d.data));
  }, []);

  const handleSend = async (body: string) => {
    await apiFetch("/messages", {
      method: "POST",
      body: JSON.stringify({ body }),
    });
    fetchMessages();
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-4 flex items-center gap-2">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">
          Team Chat
        </h1>
        <Button
          onClick={fetchMessages}
          variant="outline"
          size="sm"
          title="Refresh"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 min-h-0">
        <ChatWindow
          currentUserId={CURRENT_USER_ID}
          messages={messages}
          members={members}
          onSendMessage={handleSend}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}