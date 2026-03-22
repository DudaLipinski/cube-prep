import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalDb = globalThis as unknown as {
  pgPool?: Pool;
};

const pool =
  globalDb.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (!globalDb.pgPool) {
  globalDb.pgPool = pool;
}

export const db = drizzle(pool);
