"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessions = getSessions;
exports.createSession = createSession;
exports.getTeamSessions = getTeamSessions;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("@taskflow/db");
const utils_1 = require("@taskflow/utils");
async function getSessions(userId, date) {
    const conditions = [(0, drizzle_orm_1.eq)(db_1.pomodoroSessions.userId, userId)];
    if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        conditions.push((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(db_1.pomodoroSessions.completedAt, startOfDay), (0, drizzle_orm_1.lt)(db_1.pomodoroSessions.completedAt, endOfDay)));
    }
    return db_1.db
        .select()
        .from(db_1.pomodoroSessions)
        .where((0, drizzle_orm_1.and)(...conditions))
        .orderBy((0, drizzle_orm_1.desc)(db_1.pomodoroSessions.completedAt))
        .all();
}
async function createSession(data) {
    const id = (0, utils_1.generateId)("pomo");
    const [session] = await db_1.db
        .insert(db_1.pomodoroSessions)
        .values({
        id,
        userId: data.userId,
        taskId: data.taskId,
        durationMinutes: data.durationMinutes ?? 25,
        type: data.type ?? "focus",
        completedAt: new Date(),
    })
        .returning();
    return session;
}
async function getTeamSessions(date) {
    let conditions = [];
    if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        conditions = [
            (0, drizzle_orm_1.gte)(db_1.pomodoroSessions.completedAt, startOfDay),
            (0, drizzle_orm_1.lt)(db_1.pomodoroSessions.completedAt, endOfDay),
        ];
    }
    let query = db_1.db
        .select()
        .from(db_1.pomodoroSessions)
        .orderBy((0, drizzle_orm_1.desc)(db_1.pomodoroSessions.completedAt));
    if (conditions.length > 0) {
        query = query.where((0, drizzle_orm_1.and)(...conditions));
    }
    return query.all();
}
