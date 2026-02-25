import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

// prepare: false recommended for serverless / postgres.js; max for connection pool
const client = postgres(connectionString, { prepare: false, max: 10 });

export const db = drizzle(client, { schema });

export type Schema = typeof schema;
