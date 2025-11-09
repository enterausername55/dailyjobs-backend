import { query } from "../config/db.js";

export async function getAllRequestedCompanies() {
  let sql = `
    SELECT * 
    FROM requested_companies 
    ORDER BY created_at DESC`;
  const result = await query(sql);
  return result.rows;
}

export async function createRequestedCompany(name, url) {
  let sql = `
    INSERT INTO requested_companies (name, url, status) 
    VALUES ($1, $2, 'pending') 
    RETURNING *`;
  const result = await query(sql, [name, url]);
  return result.rows[0];
}
