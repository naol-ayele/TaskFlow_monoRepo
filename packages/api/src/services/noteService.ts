import { eq, or, desc } from "drizzle-orm";
import { db, notes, type Note, type NewNote } from "@taskflow/db";
import { generateId } from "@taskflow/utils";

export async function getAllNotes(userId: string): Promise<Note[]> {
  return db
    .select()
    .from(notes)
    .where(or(eq(notes.createdBy, userId), eq(notes.isShared, true)))
    .orderBy(desc(notes.updatedAt))
    .all();
}

export async function createNote(
  data: Omit<NewNote, "id" | "createdAt" | "updatedAt">,
): Promise<Note> {
  const id = generateId("note");
  const now = new Date();

  const [note] = await db
    .insert(notes)
    .values({
      id,
      title: data.title,
      body: data.body ?? "",
      isShared: data.isShared ?? false,
      createdBy: data.createdBy,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!note) throw new Error("Failed to create note");
  return note;
}

export async function updateNote(
  id: string,
  userId: string,
  data: Partial<Pick<NewNote, "title" | "body" | "isShared">>,
): Promise<Note | null> {
  const existing = await db.select().from(notes).where(eq(notes.id, id)).get();
  if (!existing) return null;
  if (existing.createdBy !== userId) return null;

  const [updated] = await db
    .update(notes)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(notes.id, id))
    .returning();

  if (!updated) return null;
  return updated;
}

export async function deleteNote(id: string, userId: string): Promise<boolean> {
  const existing = await db.select().from(notes).where(eq(notes.id, id)).get();
  if (!existing) return false;
  if (existing.createdBy !== userId) return false;

  await db.delete(notes).where(eq(notes.id, id)).run();
  return true;
}