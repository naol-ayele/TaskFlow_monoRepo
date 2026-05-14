import { Select } from "@taskflow/ui";
import type { User } from "@taskflow/db";
import type { ChangeEvent } from "react";

export interface TaskFiltersValue {
  status?: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
  assignedTo?: string;
  sortBy?: "dueDate" | "priority" | "createdAt";
}

export interface TaskFiltersProps {
  members: User[];
  value: TaskFiltersValue;
  onChange: (filters: TaskFiltersValue) => void;
}

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const priorityOptions = [
  { value: "", label: "All Priority" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const sortOptions = [
  { value: "createdAt", label: "Newest First" },
  { value: "dueDate", label: "Due Date" },
  { value: "priority", label: "Priority" },
];

export function TaskFilters({ members, value, onChange }: TaskFiltersProps) {
  const handleChange = (key: keyof TaskFiltersValue, newValue: string) => {
    const updated = { ...value };
    if (newValue === "" || newValue === undefined) {
      delete updated[key];
    } else {
      (updated as Record<string, unknown>)[key] = newValue;
    }
    onChange(updated);
  };

  const memberOptions = [
    { value: "", label: "All Members" },
    ...members.map((m) => ({ value: m.id, label: m.name })),
  ];

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        options={statusOptions}
        value={value.status || ""}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          handleChange("status", e.target.value)
        }
        className="w-32"
      />
      <Select
        options={priorityOptions}
        value={value.priority || ""}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          handleChange("priority", e.target.value)
        }
        className="w-32"
      />
      <Select
        options={memberOptions}
        value={value.assignedTo || ""}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          handleChange("assignedTo", e.target.value)
        }
        className="w-36"
      />
      <Select
        options={sortOptions}
        value={value.sortBy || "createdAt"}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          handleChange("sortBy", e.target.value)
        }
        className="w-32"
      />
    </div>
  );
}
