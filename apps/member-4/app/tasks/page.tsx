"use client";
import { useState, useEffect, useCallback } from "react";
import { TaskList, TaskForm, type TaskFiltersValue } from "@taskflow/feature-x";
import { Button, Spinner } from "@taskflow/ui";
import { RefreshCcw } from "lucide-react";
import type { Task, User } from "@taskflow/db";
import { CURRENT_USER_ID } from "../layout";
import { apiFetch } from "../api-client";

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<TaskFiltersValue>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.priority) params.set("priority", filters.priority);
      if (filters.assignedTo) params.set("assignedTo", filters.assignedTo);
      if (filters.sortBy) params.set("sortBy", filters.sortBy);
      const res = await apiFetch(`/tasks?${params}`);
      const data = await res.json();
      if (data.success) setTasks(data.data);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
    apiFetch("/users")
      .then((r) => r.json())
      .then((d) => d.success && setMembers(d.data));
  }, [fetchTasks]);

  const handleStatusChange = async (taskId: string, status: Task["status"]) => {
    await apiFetch(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    fetchTasks();
  };

  const handleDelete = async (taskId: string) => {
    await apiFetch(`/tasks/${taskId}`, {
      method: "DELETE",
    });
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
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Tasks</h1>
        <div className="flex gap-2">
          <Button onClick={fetchTasks} variant="outline" title="Refresh">
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowForm(true)}>New Task</Button>
        </div>
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
        <TaskList
          tasks={tasks}
          currentUserId={CURRENT_USER_ID}
          members={members}
          isLoading={isLoading}
          isPolling={false}
          lastUpdatedAt={new Date()}
          filters={filters}
          onRefetch={fetchTasks}
          onStatusChange={handleStatusChange}
          onAssign={() => {}}
          onDelete={handleDelete}
          onTaskClick={(id) => (window.location.href = `/tasks/${id}`)}
          onFiltersChange={setFilters}
        />
      )}
    </div>
  );
}
