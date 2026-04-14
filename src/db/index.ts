import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  pool: pg.Pool | undefined;
};

function getPool(): pg.Pool {
  if (!globalForDb.pool) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL is not set");
    }
    globalForDb.pool = new pg.Pool({ connectionString: url, max: 5 });
  }
  return globalForDb.pool;
}

export function getDb() {
  return drizzle(getPool(), { schema });
}
