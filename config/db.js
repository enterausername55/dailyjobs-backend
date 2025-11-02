import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const local = process.env.NODE_ENV !== "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: local ? false : { rejectUnauthorized: false },
});

// Helper függvény a query-khez
const query = (text, params) => pool.query(text, params);

export { pool, query };
