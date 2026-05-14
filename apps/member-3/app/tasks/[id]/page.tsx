"use client";

import { use, useState, useEffect } from "react";
import { TaskDetail } from "@taskflow/feature-x";
import type { Task, TaskComment, User } from "@taskflow/db";
import { CURRENT_USER_ID } from "../../layout";
import { apiFetch } from "../../api-client";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      setIsLoading(true);
      try {
        const res = await apiFetch(`/tasks/${id}`);
        const data = await res.json();
        if (data.success) setTask(data.data);

        const commentsRes = await apiFetch(`/tasks/${id}/comments`);
        const commentsData = await commentsRes.json();
        if (commentsData.success) setComments(commentsData.data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  if (isLoading || !task) {
    return <div className="p-4">Loading...</div>;
  }

  const handleStatusChange = async (status: Task["status"]) => {
    await apiFetch(`/tasks/${task.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    window.location.reload();
  };

  const handleCommentSubmit = async (body: string) => {
    await apiFetch(`/tasks/${task.id}/comments`, {
      method: "POST",
      body: JSON.stringify({ body, authorId: CURRENT_USER_ID }),
    });
    window.location.reload();
  };

  return (
    <TaskDetail
      task={task}
      comments={comments}
      members={members}
      currentUserId={CURRENT_USER_ID}
      onStatusChange={handleStatusChange}
      onCommentSubmit={handleCommentSubmit}
      onClose={() => (window.location.href = "/tasks")}
    />
  );
}
