import { RefreshCw, CheckSquare } from "lucide-react";
import { Button, Spinner, EmptyState } from "@taskflow/ui";
import { TaskCard } from "./TaskCard";
import { TaskFilters, type TaskFiltersValue } from "./TaskFilters";
import type { Task, User } from "@taskflow/db";
import { formatRelativeTime } from "@taskflow/utils";

export interface TaskListProps {
  tasks: Task[];
  currentUserId: string;
  members: User[];
  isLoading: boolean;
  isPolling: boolean;
  lastUpdatedAt: Date | null;
  filters: TaskFiltersValue;
  onRefetch: () => void;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  onAssign: (taskId: string, userId: string) => void;
  onDelete: (taskId: string) => void;
  onTaskClick: (taskId: string) => void;
  onFiltersChange: (filters: TaskFiltersValue) => void;
}

export function TaskList({
  tasks,
  currentUserId,
  members,
  isLoading,
  isPolling,
  lastUpdatedAt,
  filters,
  onRefetch,
  onStatusChange,
  onAssign,
  onDelete,
  onTaskClick,
  onFiltersChange,
}: TaskListProps) {
  const getAssignee = (userId: string | null | undefined): User | undefined => {
    if (userId === null || userId === undefined) return undefined;
    return members.find((m) => m.id === userId);
  };

  const getCreator = (userId: string): User | undefined => {
    return members.find((m) => m.id === userId);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Tasks
        </h2>
        <div className="flex items-center gap-3">
          {lastUpdatedAt && (
            <span className="text-xs text-[var(--text-muted)]">
              Updated {formatRelativeTime(lastUpdatedAt)}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefetch}
            disabled={!isPolling && isLoading}
          >
            {isLoading && !tasks.length ? (
              <Spinner size="sm" />
            ) : (
              <RefreshCw
                className={`h-4 w-4 ${isPolling ? "animate-spin" : ""}`}
              />
            )}
            <span className="ml-2">Refetch</span>
          </Button>
        </div>
      </div>

      <TaskFilters
        members={members}
        value={filters}
        onChange={onFiltersChange}
      />

      {isLoading && tasks.length > 0 && (
        <div className="flex justify-center py-2">
          <Spinner />
        </div>
      )}

      {tasks.length === 0 && !isLoading ? (
        <EmptyState
          icon={<CheckSquare className="h-6 w-6" />}
          title="No tasks yet"
          description="Create your first task to get started"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              currentUserId={currentUserId}
              assignee={getAssignee(task.assignedTo ?? undefined)}
              creator={getCreator(task.createdBy)}
              onStatusChange={onStatusChange}
              onAssign={onAssign}
              onDelete={onDelete}
              onClick={onTaskClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
