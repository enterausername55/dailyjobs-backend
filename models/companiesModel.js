import { query } from "../config/db.js";

export const getCompanies = async () => {
  let sql = `
    SELECT id, company_name, url
    FROM companies
    ORDER BY company_name ASC
  `;

  const result = await query(sql);
  return result.rows;
};
