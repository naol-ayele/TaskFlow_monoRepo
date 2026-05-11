"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTasks = getAllTasks;
exports.createTask = createTask;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
exports.getTaskComments = getTaskComments;
exports.addTaskComment = addTaskComment;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("@taskflow/db");
const utils_1 = require("@taskflow/utils");
async function getAllTasks(filters) {
    const conditions = [];
    if (filters?.status) {
        conditions.push((0, drizzle_orm_1.eq)(db_1.tasks.status, filters.status));
    }
    if (filters?.priority) {
        conditions.push((0, drizzle_orm_1.eq)(db_1.tasks.priority, filters.priority));
    }
    if (filters?.assignedTo) {
        conditions.push((0, drizzle_orm_1.eq)(db_1.tasks.assignedTo, filters.assignedTo));
    }
    let query = db_1.db.select().from(db_1.tasks);
    if (conditions.length > 0) {
        query = query.where((0, drizzle_orm_1.and)(...conditions));
    }
    if (filters?.sortBy === "dueDate") {
        query = query.orderBy(db_1.tasks.dueDate);
    }
    else if (filters?.sortBy === "priority") {
        const priorityOrder = (0, drizzle_orm_1.sql) `CASE ${db_1.tasks.priority} WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END`;
        query = query.orderBy(priorityOrder);
    }
    else {
        query = query.orderBy((0, drizzle_orm_1.desc)(db_1.tasks.createdAt));
    }
    return query.all();
}
async function createTask(data) {
    const id = (0, utils_1.generateId)("task");
    const now = new Date();
    const [task] = await db_1.db
        .insert(db_1.tasks)
        .values({
        id,
        title: data.title,
        description: data.description,
        status: data.status ?? "todo",
        priority: data.priority ?? "medium",
        dueDate: data.dueDate,
        createdBy: data.createdBy,
        assignedTo: data.assignedTo,
        createdAt: now,
        updatedAt: now,
    })
        .returning();
    return task;
}
async function updateTask(id, data) {
    const existing = await db_1.db.select().from(db_1.tasks).where((0, drizzle_orm_1.eq)(db_1.tasks.id, id)).get();
    if (!existing)
        return null;
    const [updated] = await db_1.db
        .update(db_1.tasks)
        .set({ ...data, updatedAt: new Date() })
        .where((0, drizzle_orm_1.eq)(db_1.tasks.id, id))
        .returning();
    return updated;
}
async function deleteTask(id, requestingUserId) {
    const existing = await db_1.db.select().from(db_1.tasks).where((0, drizzle_orm_1.eq)(db_1.tasks.id, id)).get();
    if (!existing)
        return false;
    if (existing.createdBy !== requestingUserId)
        return false;
    await db_1.db.delete(db_1.tasks).where((0, drizzle_orm_1.eq)(db_1.tasks.id, id)).run();
    return true;
}
async function getTaskComments(taskId) {
    return db_1.db
        .select()
        .from(db_1.taskComments)
        .where((0, drizzle_orm_1.eq)(db_1.taskComments.taskId, taskId))
        .orderBy(db_1.taskComments.createdAt)
        .all();
}
async function addTaskComment(taskId, data) {
    const id = (0, utils_1.generateId)("comment");
    const [comment] = await db_1.db
        .insert(db_1.taskComments)
        .values({
        id,
        taskId,
        authorId: data.authorId,
        body: data.body,
        createdAt: new Date(),
    })
        .returning();
    return comment;
}
