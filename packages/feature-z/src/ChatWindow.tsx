import { useState, useRef, useEffect, useCallback } from "react";
import { Send } from "lucide-react";
import { Button, Spinner, EmptyState } from "@taskflow/ui";
import { MessageBubble } from "./MessageBubble";
import type { Message, User } from "@taskflow/db";
import { cn } from "@taskflow/ui/lib/utils";

export interface ChatWindowProps {
  currentUserId: string;
  messages: Message[];
  members: User[];
  onSendMessage: (
    body: string,
    relatedItem?: { id: string; type: "task" | "note" },
  ) => Promise<void>;
  isLoading: boolean;
}

export function ChatWindow({
  currentUserId,
  messages,
  members,
  onSendMessage,
  isLoading,
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isUserAtBottomRef = useRef(true);
  const prevMessagesLengthRef = useRef(messages.length);

  const getAuthor = (authorId: string) => {
    return members.find((m) => m.id === authorId);
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    isUserAtBottomRef.current = isAtBottom;
  }, []);

  useEffect(() => {
    const isNewMessage = messages.length > prevMessagesLengthRef.current;
    const userSentMessage =
      isNewMessage &&
      messages.length > 0 &&
      messages[messages.length - 1]?.authorId === currentUserId;

    if ((isUserAtBottomRef.current || userSentMessage) && messages.length > 0) {
      scrollToBottom();
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages.length, currentUserId, scrollToBottom]);

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(newMessage.trim());
      setNewMessage("");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <div className="flex flex-col h-full min-h-0 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto min-h-0 p-4"
      >
        {isLoading && messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <Spinner />
          </div>
        ) : sortedMessages.length === 0 ? (
          <EmptyState
            title="No messages yet"
            description="Start a conversation with your team"
          />
        ) : (
          <div className="flex flex-col gap-4">
            {sortedMessages.map((message) => {
              if (!message?.authorId) return null;
              const author = getAuthor(message.authorId);
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwnMessage={message.authorId === currentUserId}
                  authorName={author?.name || "Unknown"}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="flex-shrink-0 border-t border-[var(--border)] p-4">
        <div className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 resize-none rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || isSending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
