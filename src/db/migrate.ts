import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import database from "@/db";
import config from "../../drizzle.config";

function migrateDb(db: typeof database) {
  migrate(db, { migrationsFolder: config.out! });
}

migrateDb(database);
