import { type Message, type NewMessage } from "@taskflow/db";
export declare function getMessages(limit?: number, _afterId?: string): Promise<Message[]>;
export declare function createMessage(data: Omit<NewMessage, "id" | "createdAt">): Promise<Message>;
//# sourceMappingURL=messageService.d.ts.map