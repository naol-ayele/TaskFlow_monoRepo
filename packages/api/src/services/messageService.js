"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = getMessages;
exports.createMessage = createMessage;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("@taskflow/db");
const utils_1 = require("@taskflow/utils");
async function getMessages(limit = 50, _afterId) {
    return db_1.db
        .select()
        .from(db_1.messages)
        .orderBy((0, drizzle_orm_1.desc)(db_1.messages.createdAt))
        .limit(limit)
        .all();
}
async function createMessage(data) {
    const id = (0, utils_1.generateId)("msg");
    const insertData = {
        id,
        body: data.body,
        authorId: data.authorId,
        createdAt: new Date(),
    };
    if (data.relatedId) {
        insertData.relatedId = data.relatedId;
    }
    if (data.relatedType) {
        insertData.relatedType = data.relatedType;
    }
    const [message] = await db_1.db.insert(db_1.messages).values(insertData).returning();
    return message;
}
