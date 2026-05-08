import { eq, and, desc, gte, lt, type SQL } from "drizzle-orm";
import {
  db,
  pomodoroSessions,
  type PomodoroSession,
  type NewPomodoroSession,
} from "@taskflow/db";
import { generateId } from "@taskflow/utils";

export async function getSessions(
  userId: string,
  date?: string,
): Promise<PomodoroSession[]> {
  let conditions: (SQL | undefined)[] = [eq(pomodoroSessions.userId, userId)];

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    conditions.push(
      and(
        gte(pomodoroSessions.completedAt, startOfDay),
        lt(pomodoroSessions.completedAt, endOfDay),
      ),
    );
  }

  const filteredConditions = conditions.filter(
    (c): c is SQL => c !== undefined && c !== null,
  );

  return db
    .select()
    .from(pomodoroSessions)
    .where(and(...filteredConditions))
    .orderBy(desc(pomodoroSessions.completedAt))
    .all();
}

export async function createSession(
  data: Omit<NewPomodoroSession, "id" | "completedAt">,
): Promise<PomodoroSession> {
  const id = generateId("pomo");

  const [session] = await db
    .insert(pomodoroSessions)
    .values({
      id,
      userId: data.userId,
      taskId: data.taskId,
      durationMinutes: data.durationMinutes ?? 25,
      type: data.type ?? "focus",
      completedAt: new Date(),
    })
    .returning();

  if (!session) throw new Error("Failed to create session");
  return session;
}

export async function getTeamSessions(
  date?: string,
): Promise<PomodoroSession[]> {
  let conditions: SQL[] = [];

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    conditions = [
      gte(pomodoroSessions.completedAt, startOfDay),
      lt(pomodoroSessions.completedAt, endOfDay),
    ];
  }

  let query = db
    .select()
    .from(pomodoroSessions)
    .$dynamic()
    .orderBy(desc(pomodoroSessions.completedAt));

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  return query.all();
}