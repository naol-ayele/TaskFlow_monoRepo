import { type Task, type NewTask, type TaskComment, type NewTaskComment } from "@taskflow/db";
export interface TaskFilters {
    status?: "todo" | "in_progress" | "done";
    priority?: "low" | "medium" | "high";
    assignedTo?: string;
    sortBy?: "dueDate" | "priority" | "createdAt";
}
export declare function getAllTasks(filters?: TaskFilters): Promise<Task[]>;
export declare function createTask(data: Omit<NewTask, "id" | "createdAt" | "updatedAt">): Promise<Task>;
export declare function updateTask(id: string, data: Partial<Pick<NewTask, "title" | "description" | "status" | "priority" | "assignedTo" | "dueDate">>): Promise<Task | null>;
export declare function deleteTask(id: string, requestingUserId: string): Promise<boolean>;
export declare function getTaskComments(taskId: string): Promise<TaskComment[]>;
export declare function addTaskComment(taskId: string, data: Omit<NewTaskComment, "id" | "taskId" | "createdAt">): Promise<TaskComment>;
//# sourceMappingURL=taskService.d.ts.map