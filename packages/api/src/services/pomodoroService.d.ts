import { type PomodoroSession, type NewPomodoroSession } from "@taskflow/db";
export declare function getSessions(userId: string, date?: string): Promise<PomodoroSession[]>;
export declare function createSession(data: Omit<NewPomodoroSession, "id" | "completedAt">): Promise<PomodoroSession>;
export declare function getTeamSessions(date?: string): Promise<PomodoroSession[]>;
//# sourceMappingURL=pomodoroService.d.ts.map