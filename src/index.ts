import dotenv from "dotenv";
dotenv.config();

import db from "./db";
import { translationPairs } from "./db/schema";

async function main() {
  // const user: typeof usersTable.$inferInsert = {
  //   name: "John",
  //   age: 30,
  //   email: "john@example.com",
  // };
  // await db.insert(usersTable).values(user);
  // console.log("New user created!");
  const pairs = await db.select().from(translationPairs);
  console.log("Getting all pairs from the database: ", pairs);
}

main();
