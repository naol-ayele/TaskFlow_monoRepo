import { useState, ChangeEvent } from "react";
import { Button, Input, Textarea, Modal } from "@taskflow/ui";
import type { Note, NewNote } from "@taskflow/db";

export interface NoteFormProps {
  initialValues?: Partial<Note>;
  onSubmit: (data: {
    title: string;
    body: string;
    isShared: boolean;
    createdBy: string;
  }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function NoteForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
}: NoteFormProps) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [body, setBody] = useState(initialValues?.body || "");
  const [isShared, setIsShared] = useState(initialValues?.isShared || false);
  const [error, setError] = useState("");

  const isEditing = !!initialValues?.id;
  const maxBodyLength = 5000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (title.length > 100) {
      setError("Title must be 100 characters or less");
      return;
    }
    if (!body.trim()) {
      setError("Body is required");
      return;
    }
    if (body.length > maxBodyLength) {
      setError(`Body must be ${maxBodyLength} characters or less`);
      return;
    }

    await onSubmit({
      title: title.trim(),
      body: body.trim(),
      isShared,
      createdBy: initialValues?.createdBy || "",
    });
  };

  return (
    <Modal
      isOpen
      onClose={onCancel}
      title={isEditing ? "Edit Note" : "New Note"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Title"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          placeholder="Enter note title"
          error={error && !title ? error : undefined}
          required
        />

        <Textarea
          label="Body"
          value={body}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setBody(e.target.value)
          }
          placeholder="Write your note..."
          maxLength={maxBodyLength}
          showCount
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isShared}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setIsShared(e.target.checked)
            }
            className="h-4 w-4 rounded border-[var(--border)]"
          />
          <span className="text-sm text-[var(--text-primary)]">
            Share with team
          </span>
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Create Note"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
