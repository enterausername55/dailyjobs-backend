import { query } from "../config/db.js";

export const getJobs = async ({ filter, letter, junior }) => {
  let sql = `
    SELECT j.id, j.title, j.href, j.start_date, j.end_date, c.company_name AS site
    FROM jobs j
    JOIN companies c ON j.company_id = c.id
    WHERE j.end_date IS NULL
  `;
  const params = [];

  // dátum szűrés
  if (filter) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let fromDate;
    switch (filter) {
      case "today":
        fromDate = today;
        break;
      case "yesterday":
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 1);
        break;
      case "last7":
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 6);
        break;
      case "last30":
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 29);
        break;
    }

    const fromDateStr = fromDate.toISOString().split("T")[0];

    params.push(fromDateStr);
    sql += ` AND j.start_date >= $${params.length}`;
  }

  // junior szűrés
  if (junior === "junior") {
    sql += ` AND LOWER(j.title) LIKE '%junior%'`;
  }

  sql += ` ORDER BY c.company_name, j.title`;

  const result = await query(sql, params);
  return result.rows;
};
