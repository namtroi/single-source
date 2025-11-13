import { Pool } from "pg";
import type { QueryResult } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
export default {
  query: (text: string, params: any[]): Promise<QueryResult<any>> => {
    return pool.query(text, params);
  },
};
pool.query('SELECT current_database(), current_user, inet_server_addr()', (err, res) => {
  if (err) {
    console.error('DB check failed:', err);
  } else {
    console.log('Connected to:', res.rows[0]);
  }
});

console.log("✅ Using connection string:", process.env.DATABASE_URL);
