"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { TaskForm } from "@taskflow/feature-x";
import { Button, Spinner } from "@taskflow/ui";
import type { Task, User } from "@taskflow/db";
import { CURRENT_USER_ID } from "../../layout";
import { apiFetch } from "../../api-client";

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch("/tasks");
      const data = await res.json();
      if (data.success) setTasks(data.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    apiFetch("/users")
      .then((r) => r.json())
      .then((d) => d.success && setMembers(d.data));
  }, []);

  const todoTasks = useMemo(
    () => tasks.filter((t) => t.status === "todo"),
    [tasks],
  );
  const progressTasks = useMemo(
    () => tasks.filter((t) => t.status === "in_progress"),
    [tasks],
  );
  const doneTasks = useMemo(
    () => tasks.filter((t) => t.status === "done"),
    [tasks],
  );

  const handleStatusChange = async (taskId: string, status: Task["status"]) => {
    await apiFetch(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    fetchTasks();
  };

  const handleDelete = async (taskId: string) => {
    await apiFetch(`/tasks/${taskId}`, { method: "DELETE" });
    fetchTasks();
  };

  const handleCreate = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setShowForm(false);
        fetchTasks();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">
          Kanban Board
        </h1>
        <Button onClick={() => setShowForm(true)}>New Task</Button>
      </div>
      {showForm && (
        <TaskForm
          members={members}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {isLoading && tasks.length === 0 ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="mb-4 font-semibold text-[var(--text-muted)]">
              To Do ({todoTasks.length})
            </h2>
            <div className="flex flex-col gap-2">
              {todoTasks.map((t) => (
                <KanbanCard
                  key={t.id}
                  task={t}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  currentUserId={CURRENT_USER_ID}
                />
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="mb-4 font-semibold text-blue-500">
              In Progress ({progressTasks.length})
            </h2>
            <div className="flex flex-col gap-2">
              {progressTasks.map((t) => (
                <KanbanCard
                  key={t.id}
                  task={t}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  currentUserId={CURRENT_USER_ID}
                />
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="mb-4 font-semibold text-green-500">
              Done ({doneTasks.length})
            </h2>
            <div className="flex flex-col gap-2">
              {doneTasks.map((t) => (
                <KanbanCard
                  key={t.id}
                  task={t}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  currentUserId={CURRENT_USER_ID}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KanbanCard({
  task,
  onStatusChange,
  onDelete,
  currentUserId,
}: {
  task: Task;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  onDelete: (taskId: string) => void;
  currentUserId: string;
}) {
  const statusOptions: Task["status"][] = ["todo", "in_progress", "done"];
  return (
    <div
      className="rounded border border-[var(--border)] bg-[var(--background)] p-3 cursor-pointer"
      onClick={() => {
        window.location.href = `/tasks/${task.id}`;
      }}
    >
      <p className="text-sm font-medium text-[var(--text-primary)]">
        {task.title}
      </p>
      <div className="mt-2 flex gap-1">
        {statusOptions.map((s) => (
          <button
            key={s}
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(task.id, s);
            }}
            className={`text-xs px-2 py-1 rounded ${task.status === s ? "bg-[var(--accent)] text-black" : "bg-[var(--surface-raised)]"}`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
        {task.createdBy === currentUserId && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="text-xs px-2 py-1 rounded bg-red-500 text-white"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
