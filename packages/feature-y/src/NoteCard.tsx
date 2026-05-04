import { useState, MouseEvent } from "react";
import { Pencil, Trash2, Share2 } from "lucide-react";
import { Badge, Button } from "@taskflow/ui";
import { formatRelativeTime } from "@taskflow/utils";
import type { Note, User } from "@taskflow/db";
import { cn } from "@taskflow/ui/lib/utils";

export interface NoteCardProps {
  note: Note;
  currentUserId: string;
  author?: User;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onToggleShare: (noteId: string, isShared: boolean) => void;
}

export function NoteCard({
  note,
  currentUserId,
  author,
  onEdit,
  onDelete,
  onToggleShare,
}: NoteCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = note.createdBy === currentUserId;

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (showDeleteConfirm) {
      onDelete(note.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const handleEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onEdit(note);
  };

  const handleToggleShare = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onToggleShare(note.id, !note.isShared);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:bg-[var(--surface-raised)]",
        note.isShared && "border-[var(--accent)]",
      )}
    >
      <div className="flex items-start justify-between">
        <h3 className="flex-1 text-sm font-medium text-[var(--text-primary)]">
          {note.title}
        </h3>
        {isOwner && (
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleToggleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleEdit}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                showDeleteConfirm && "bg-red-500 text-white",
              )}
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <p className="line-clamp-3 text-xs text-[var(--text-muted)]">
        {note.body}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {note.isShared && (
          <Badge variant="default" className="text-xs">
            Shared
          </Badge>
        )}
        <span className="text-xs text-[var(--text-muted)]">
          {note.isShared ? "Shared by: " : "Created by: "}
          {author?.name || note.createdBy}
        </span>
        <span className="text-xs text-[var(--text-muted)]">
          {formatRelativeTime(note.updatedAt)}
        </span>
      </div>
    </div>
  );
}
