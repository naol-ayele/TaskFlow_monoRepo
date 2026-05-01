import { Link } from "lucide-react";
import { formatDate } from "@taskflow/utils";
import type { Message, User } from "@taskflow/db";
import { Avatar, Badge } from "@taskflow/ui";
import { cn } from "@taskflow/ui/lib/utils";

export interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  authorName: string;
  members?: User[];
}

const memberColors: Record<string, string> = {
  user_member1: "bg-pink-500",
  user_member2: "bg-blue-500",
  user_member3: "bg-green-500",
  user_member4: "bg-purple-500",
  user_member5: "bg-orange-500",
};

function getMemberInitials(authorId: string): string {
  const num = authorId.replace("user_member", "");
  return `M${num}`;
}

function getMemberColor(authorId: string): string {
  return memberColors[authorId] || "bg-gray-500";
}

export function MessageBubble({
  message,
  isOwnMessage,
  authorName,
  members,
}: MessageBubbleProps) {
  const memberInitials = getMemberInitials(message.authorId);
  const memberColor = getMemberColor(message.authorId);

  return (
    <div className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : ""}`}>
      <Avatar
        name={memberInitials}
        size="sm"
        className={cn(memberColor, "text-white")}
      />
      <div
        className={`flex max-w-[70%] flex-col gap-1 ${
          isOwnMessage ? "items-end" : "items-start"
        }`}
      >
        {(message.relatedId || message.relatedType) && (
          <Badge variant="secondary" className="text-xs">
            <Link className="mr-1 h-3 w-3" />
            {message.relatedType === "task" ? "Task" : "Note"}
          </Badge>
        )}
        <div
          className={`rounded-lg px-3 py-2 ${
            isOwnMessage
              ? "bg-[var(--accent)] text-black"
              : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)]"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.body}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">{authorName}</span>
          <span className="text-xs text-[var(--text-muted)]">
            {formatDate(message.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
