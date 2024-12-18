import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";

dotenv.config();

const DB_PATH = process.env.DB_PATH;

if (!DB_PATH) {
  throw new Error("DB_PATH is not defined in .env file");
}

const sqlite = new Database(path.join(__dirname, DB_PATH));
const db = drizzle({ client: sqlite, schema, logger: true });

export default db;
