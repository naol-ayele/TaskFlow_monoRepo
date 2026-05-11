"use client";

import { useState, useEffect } from "react";
import { NoteList, NoteForm } from "@taskflow/feature-y";
import { Button, Spinner } from "@taskflow/ui";
import type { Note, User } from "@taskflow/db";
import { CURRENT_USER_ID } from "../layout";
import { apiFetch } from "../api-client";

export default function Page() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch("/notes");
      const data = await res.json();
      if (data.success) setNotes(data.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async (data: {
    title: string;
    body: string;
    isShared: boolean;
    createdBy: string;
  }) => {
    setIsSubmitting(true);
    try {
      const res = await apiFetch("/notes", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setShowForm(false);
        fetchNotes();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (note: Note) => setEditingNote(note);
  const handleDelete = async (noteId: string) => {
    await apiFetch(`/notes/${noteId}`, {
      method: "DELETE",
    });
    fetchNotes();
  };
  const handleToggleShare = async (noteId: string, isShared: boolean) => {
    await apiFetch(`/notes/${noteId}`, {
      method: "PATCH",
      body: JSON.stringify({ isShared }),
    });
    fetchNotes();
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Notes</h1>
        <Button onClick={() => setShowForm(true)}>New Note</Button>
      </div>

      {showForm && (
        <NoteForm
          onSubmit={handleCreateNote}
          onCancel={() => setShowForm(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {editingNote && (
        <NoteForm
          initialValues={editingNote}
          onSubmit={async (data: {
            title: string;
            body: string;
            isShared: boolean;
            createdBy: string;
          }) => {
            await apiFetch(`/notes/${editingNote.id}`, {
              method: "PATCH",
              body: JSON.stringify(data),
            });
            setEditingNote(null);
            fetchNotes();
          }}
          onCancel={() => setEditingNote(null)}
          isSubmitting={isSubmitting}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <NoteList
          notes={notes}
          currentUserId={CURRENT_USER_ID}
          members={members}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleShare={handleToggleShare}
        />
      )}
    </div>
  );
}