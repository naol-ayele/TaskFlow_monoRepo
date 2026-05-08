import { type Note, type NewNote } from "@taskflow/db";
export declare function getAllNotes(userId: string): Promise<Note[]>;
export declare function createNote(data: Omit<NewNote, "id" | "createdAt" | "updatedAt">): Promise<Note>;
export declare function updateNote(id: string, userId: string, data: Partial<Pick<NewNote, "title" | "body" | "isShared">>): Promise<Note | null>;
export declare function deleteNote(id: string, userId: string): Promise<boolean>;
//# sourceMappingURL=noteService.d.ts.map