import { eq, and, desc, sql, type SQL } from "drizzle-orm";
import {
  db,
  tasks,
  taskComments,
  users,
  type Task,
  type NewTask,
  type TaskComment,
  type NewTaskComment,
} from "@taskflow/db";
import { generateId } from "@taskflow/utils";

export interface TaskFilters {
  status?: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
  assignedTo?: string;
  sortBy?: "dueDate" | "priority" | "createdAt";
}

export async function getAllTasks(filters?: TaskFilters): Promise<Task[]> {
  let conditions: SQL[] = [];

  if (filters?.status) {
    conditions.push(eq(tasks.status, filters.status));
  }
  if (filters?.priority) {
    conditions.push(eq(tasks.priority, filters.priority));
  }
  if (filters?.assignedTo) {
    conditions.push(eq(tasks.assignedTo, filters.assignedTo));
  }

  let query = db.select().from(tasks).$dynamic();

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  if (filters?.sortBy === "dueDate") {
    query = query.orderBy(tasks.dueDate);
  } else if (filters?.sortBy === "priority") {
    const priorityOrder = sql`CASE ${tasks.priority} WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END`;
    query = query.orderBy(priorityOrder);
  } else {
    query = query.orderBy(desc(tasks.createdAt));
  }

  return query.all();
}

export async function createTask(
  data: Omit<NewTask, "id" | "createdAt" | "updatedAt">,
): Promise<Task> {
  const id = generateId("task");
  const now = new Date();

  const [task] = await db
    .insert(tasks)
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

  if (!task) throw new Error("Failed to create task");
  return task;
}

export async function updateTask(
  id: string,
  data: Partial<
    Pick<
      NewTask,
      "title" | "description" | "status" | "priority" | "assignedTo" | "dueDate"
    >
  >,
): Promise<Task | null> {
  const existing = await db.select().from(tasks).where(eq(tasks.id, id)).get();
  if (!existing) return null;

  const [updated] = await db
    .update(tasks)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tasks.id, id))
    .returning();

  if (!updated) return null;
  return updated;
}

export async function deleteTask(
  id: string,
  requestingUserId: string,
): Promise<boolean> {
  const existing = await db.select().from(tasks).where(eq(tasks.id, id)).get();
  if (!existing) return false;
  if (existing.createdBy !== requestingUserId) return false;

  await db.delete(tasks).where(eq(tasks.id, id)).run();
  return true;
}

export async function getTaskComments(taskId: string) {
  return db
    .select({
      id: taskComments.id,
      taskId: taskComments.taskId,
      authorId: taskComments.authorId,
      body: taskComments.body,
      createdAt: taskComments.createdAt,
      authorName: users.name,
    })
    .from(taskComments)
    .leftJoin(users, eq(taskComments.authorId, users.id))
    .where(eq(taskComments.taskId, taskId))
    .orderBy(taskComments.createdAt)
    .all();
}

export async function addTaskComment(
  taskId: string,
  data: Omit<NewTaskComment, "id" | "taskId" | "createdAt">,
): Promise<TaskComment> {
  const id = generateId("comment");

  const [comment] = await db
    .insert(taskComments)
    .values({
      id,
      taskId,
      authorId: data.authorId,
      body: data.body,
      createdAt: new Date(),
    })
    .returning();

  if (!comment) throw new Error("Failed to add comment");
  return comment;
}

export async function getTaskById(id: string): Promise<Task | null> {
  const task = await db.select().from(tasks).where(eq(tasks.id, id)).get();
  return task ?? null;
}