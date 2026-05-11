import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";

const DB_PATH = path.resolve(process.cwd(), "../../taskflow.db");
const sqlite = new Database(DB_PATH);

export const db = drizzle(sqlite, { schema });
export * from "./schema";
export { sql } from "drizzle-orm";