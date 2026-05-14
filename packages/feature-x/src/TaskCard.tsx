import { useState, MouseEvent } from "react";
import { Trash2 } from "lucide-react";
import { Badge, Avatar, Button } from "@taskflow/ui";
import {
  getStatusColor,
  getPriorityColor,
  formatDate,
  isOverdue,
} from "@taskflow/utils";
import type { Task, User } from "@taskflow/db";
import { cn } from "@taskflow/ui/lib/utils";

export interface TaskCardProps {
  task: Task;
  currentUserId: string;
  assignee?: User;
  creator?: User;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  onAssign: (taskId: string, userId: string) => void;
  onDelete: (taskId: string) => void;
  onClick: (taskId: string) => void;
}

const statusOptions: Task["status"][] = ["todo", "in_progress", "done"];

export function TaskCard({
  task,
  currentUserId,
  assignee,
  creator,
  onStatusChange,
  onDelete,
  onClick,
}: TaskCardProps) {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const canDelete = task.createdBy === currentUserId;
  const taskIsOverdue = task.dueDate ? isOverdue(task.dueDate) : false;

  const handleStatusChange = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newStatus = e.currentTarget.value as Task["status"];
    onStatusChange(task.id, newStatus);
    setIsStatusOpen(false);
  };

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (showDeleteConfirm) {
      onDelete(task.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const handleCardClick = () => {
    onClick(task.id);
  };

  const statusColor = getStatusColor(task.status);
  const priorityColor = getPriorityColor(task.priority);

  return (
    <div
      className={cn(
        "group relative flex cursor-pointer flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:bg-[var(--surface-raised)]",
        taskIsOverdue && "border-red-500",
      )}
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between">
        <h3 className="flex-1 text-sm font-medium text-[var(--text-primary)]">
          {task.title}
        </h3>
        {canDelete && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100",
              showDeleteConfirm && "bg-red-500 text-white opacity-100",
            )}
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <span className="text-xs text-[var(--text-muted)]">
        Created by: {creator?.name || task.createdBy}
      </span>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className={cn("h-auto px-2 py-1 text-xs", statusColor)}
            onClick={(e: MouseEvent) => {
              e.stopPropagation();
              setIsStatusOpen(!isStatusOpen);
            }}
          >
            {task.status.replace("_", " ")}
          </Button>
          {isStatusOpen && (
            <div className="absolute left-0 top-full z-10 mt-1 flex flex-col rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-lg">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  value={status}
                  className="px-3 py-1.5 text-left text-xs text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
                  onClick={handleStatusChange}
                >
                  {status.replace("_", " ")}
                </button>
              ))}
            </div>
          )}
        </div>

        <Badge variant="secondary" className={cn("text-xs", priorityColor)}>
          {task.priority}
        </Badge>

        {task.dueDate && (
          <span
            className={cn(
              "text-xs",
              taskIsOverdue ? "text-red-500" : "text-[var(--text-muted)]",
            )}
          >
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      {assignee && (
        <div className="flex items-center gap-2">
          <Avatar
            name={assignee.name}
            avatarUrl={assignee.avatarUrl}
            size="sm"
          />
          <span className="text-xs text-[var(--text-muted)]">
            {assignee.name}
          </span>
        </div>
      )}
    </div>
  );
}
