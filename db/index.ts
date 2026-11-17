import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

let database: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (database) return database;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) throw new Error("Set TURSO_DATABASE_URL to connect the scoring database.");

  database = drizzle(createClient({ url, authToken }), { schema });
  return database;
}
