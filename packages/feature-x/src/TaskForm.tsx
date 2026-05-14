import { useState, ChangeEvent } from "react";
import { Button, Input, Textarea, Select, Modal } from "@taskflow/ui";
import type { User, NewTask } from "@taskflow/db";

export interface TaskFormProps {
  members: User[];
  onSubmit: (data: {
    title: string;
    description?: string;
    priority: string;
    assignedTo?: string;
    dueDate?: Date;
    status: string;
  }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function TaskForm({
  members,
  onSubmit,
  onCancel,
  isSubmitting,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (title.length > 120) {
      setError("Title must be 120 characters or less");
      return;
    }
    if (description && description.length > 500) {
      setError("Description must be 500 characters or less");
      return;
    }

    const dueDateObj = dueDate ? new Date(dueDate) : undefined;
    if (dueDateObj && dueDateObj < new Date()) {
      setError("Due date must be today or in the future");
      return;
    }

    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      assignedTo: assignedTo || undefined,
      dueDate: dueDateObj,
      status: "todo",
    });
  };

  const memberOptions = [
    { value: "", label: "Unassigned" },
    ...members.map((m) => ({ value: m.id, label: m.name })),
  ];

  return (
    <Modal isOpen onClose={onCancel} title="Create Task">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Title"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          placeholder="Enter task title"
          error={error && !title ? error : undefined}
          required
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
          placeholder="Enter task description (optional)"
          maxLength={500}
          showCount
        />

        <Select
          label="Priority"
          options={priorityOptions}
          value={priority}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setPriority(e.target.value as "low" | "medium" | "high")
          }
        />

        <Select
          label="Assignee"
          options={memberOptions}
          value={assignedTo}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setAssignedTo(e.target.value)
          }
        />

        <Input
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setDueDate(e.target.value)
          }
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
