"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllNotes = getAllNotes;
exports.createNote = createNote;
exports.updateNote = updateNote;
exports.deleteNote = deleteNote;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("@taskflow/db");
const utils_1 = require("@taskflow/utils");
async function getAllNotes(userId) {
    return db_1.db
        .select()
        .from(db_1.notes)
        .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(db_1.notes.createdBy, userId), (0, drizzle_orm_1.eq)(db_1.notes.isShared, true)))
        .orderBy((0, drizzle_orm_1.desc)(db_1.notes.updatedAt))
        .all();
}
async function createNote(data) {
    const id = (0, utils_1.generateId)("note");
    const now = new Date();
    const [note] = await db_1.db
        .insert(db_1.notes)
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
    return note;
}
async function updateNote(id, userId, data) {
    const existing = await db_1.db.select().from(db_1.notes).where((0, drizzle_orm_1.eq)(db_1.notes.id, id)).get();
    if (!existing)
        return null;
    if (existing.createdBy !== userId)
        return null;
    const [updated] = await db_1.db
        .update(db_1.notes)
        .set({ ...data, updatedAt: new Date() })
        .where((0, drizzle_orm_1.eq)(db_1.notes.id, id))
        .returning();
    return updated;
}
async function deleteNote(id, userId) {
    const existing = await db_1.db.select().from(db_1.notes).where((0, drizzle_orm_1.eq)(db_1.notes.id, id)).get();
    if (!existing)
        return false;
    if (existing.createdBy !== userId)
        return false;
    await db_1.db.delete(db_1.notes).where((0, drizzle_orm_1.eq)(db_1.notes.id, id)).run();
    return true;
}
