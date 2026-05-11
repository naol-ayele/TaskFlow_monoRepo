import { desc } from "drizzle-orm";
import { db, messages, type Message, type NewMessage } from "@taskflow/db";
import { generateId } from "@taskflow/utils";

export async function getMessages(
  limit = 50,
  _afterId?: string,
): Promise<Message[]> {
  return db
    .select()
    .from(messages)
    .orderBy(desc(messages.createdAt))
    .limit(limit)
    .all();
}

export async function createMessage(
  data: Omit<NewMessage, "id" | "createdAt">,
): Promise<Message> {
  const id = generateId("msg");

  const insertData = {
    id,
    body: data.body,
    authorId: data.authorId,
    createdAt: new Date(),
    ...(data.relatedId && { relatedId: data.relatedId }),
    ...(data.relatedType && { relatedType: data.relatedType }),
  };

  const [message] = await db.insert(messages).values(insertData).returning();

  if (!message) throw new Error("Failed to create message");
  return message;
}