import { FileText } from "lucide-react";
import { EmptyState, Spinner } from "@taskflow/ui";
import { NoteCard } from "./NoteCard";
import type { Note, User } from "@taskflow/db";

export interface NoteListProps {
  notes: Note[];
  currentUserId: string;
  members: User[];
  isLoading: boolean;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onToggleShare: (noteId: string, isShared: boolean) => void;
}

export function NoteList({
  notes,
  currentUserId,
  members,
  isLoading,
  onEdit,
  onDelete,
  onToggleShare,
}: NoteListProps) {
  const getAuthor = (userId: string) => {
    return members.find((m) => m.id === userId);
  };

  if (isLoading && notes.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="h-6 w-6" />}
        title="No notes yet"
        description="Create your first note to get started"
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          currentUserId={currentUserId}
          author={getAuthor(note.createdBy)}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleShare={onToggleShare}
        />
      ))}
    </div>
  );
}
