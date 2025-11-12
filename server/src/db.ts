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
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Connection failed:", err);
  } else {
    console.log("Connected to Supabase! Server time:", res.rows[0]);
  }
});
