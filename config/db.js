import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

// Pool létrehozása a DB kapcsolathoz
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Egyszerű helper, ha a pool query-t akarjuk használni
const query = (text, params) => pool.query(text, params);

export { pool, query };
