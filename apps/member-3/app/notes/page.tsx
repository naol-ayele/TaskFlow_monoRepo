"use client";
import { useState, useEffect } from "react";
import { NoteList, NoteForm } from "@taskflow/feature-y";
import { Button, Spinner } from "@taskflow/ui";
import type { Note, User } from "@taskflow/db";
import { CURRENT_USER_ID } from "../layout";
import { apiFetch } from "../api-client";

export default function Page() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);
  const fetchNotes = async () => {
    setLoad(true);
    const r = await apiFetch("/notes");
    const d = await r.json();
    if (d.success) setNotes(d.data);
    setLoad(false);
  };
  const handleCreate = async (data: any) => {
    await apiFetch("/notes", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setShowForm(false);
    fetchNotes();
  };
  const handleEdit = (n: Note) => setEditing(n);
  const handleDelete = async (id: string) => {
    await apiFetch(`/notes/${id}`, { method: "DELETE" });
    fetchNotes();
  };
  const handleToggle = async (id: string, isShared: boolean) => {
    await apiFetch(`/notes/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ isShared }),
    });
    fetchNotes();
  };

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Notes</h1>
        <Button onClick={() => setShowForm(true)}>New Note</Button>
      </div>
      {showForm && (
        <NoteForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          isSubmitting={false}
        />
      )}
      {editing && (
        <NoteForm
          initialValues={editing}
          onSubmit={async (d) => {
            await apiFetch(`/notes/${editing.id}`, {
              method: "PATCH",
              body: JSON.stringify(d),
            });
            setEditing(null);
            fetchNotes();
          }}
          onCancel={() => setEditing(null)}
          isSubmitting={false}
        />
      )}
      {load ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <NoteList
          notes={notes}
          currentUserId={CURRENT_USER_ID}
          members={[]}
          isLoading={load}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleShare={handleToggle}
        />
      )}
    </div>
  );
}
