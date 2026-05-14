import { useState } from "react";
import { Badge, Avatar, Button, Modal } from "@taskflow/ui";
import type { Task, User } from "@taskflow/db";
import { formatDate } from "@taskflow/utils";
import { getStatusColor, getPriorityColor } from "@taskflow/utils";

interface TaskCommentWithAuthor extends TaskComment {
  authorName?: string;
}

export interface TaskDetailProps {
  task: Task;
  comments: TaskCommentWithAuthor[];
  members: User[];
  currentUserId: string;
  onStatusChange: (status: Task["status"]) => void;
  onCommentSubmit: (body: string) => Promise<void>;
  onClose: () => void;
}

const statusOptions: Task["status"][] = ["todo", "in_progress", "done"];

export function TaskDetail({
  task,
  comments,
  members,
  currentUserId,
  onStatusChange,
  onCommentSubmit,
  onClose,
} : TaskDetailProps) {
  const [commentBody, setCommentBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusValue, setStatusValue] = useState(task.status);

  const getAuthor = (authorId: string) => {
    return members.find((m) => m.id === authorId);
  };

  const sortedComments = [...comments].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const handleCommentSubmit = async () => {
    if (!commentBody.trim()) return;
    setIsSubmitting(true);
    try {
      await onCommentSubmit(commentBody.trim());
      setCommentBody("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (newStatus: Task["status"]) => {
    setStatusValue(newStatus);
    onStatusChange(newStatus);
  };

  return (
    <Modal isOpen onClose={onClose} title={task.title} className="max-w-2xl">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-4">
          <Badge variant="secondary" className={getStatusColor(statusValue)}>
            {statusValue.replace("_", " ")}
          </Badge>
          <Badge
            variant="secondary"
            className={getPriorityColor(task.priority)}
          >
            {task.priority}
          </Badge>
          {task.dueDate && (
            <span className="text-sm text-[var(--text-muted)]">
              Due: {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        {task.description && (
          <p className="text-sm text-[var(--text-primary)]">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-muted)]">Status:</span>
          <select
            value={statusValue}
            onChange={(e) =>
              handleStatusChange(e.target.value as Task["status"])
            }
            className="rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-sm text-[var(--text-primary)]"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s} className="bg-[var(--surface)]">
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t border-[var(--border)] pt-4">
          <h3 className="mb-3 text-sm font-medium text-[var(--text-primary)]">
            Comments
          </h3>
          <div className="mb-4 flex max-h-60 flex-col gap-3 overflow-y-auto">
            {sortedComments.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">
                No comments yet
              </p>
            ) : (
              sortedComments.map((comment) => {
                const author = getAuthor(comment.authorId);
                const displayName = comment.authorName || author?.name || "Unknown";
                return (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar name={displayName} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium">
                          {displayName}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-primary)]">
                        {comment.body}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 rounded border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
            />
            <Button
              size="sm"
              onClick={handleCommentSubmit}
              disabled={!commentBody.trim() || isSubmitting}
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
