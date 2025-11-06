import express from "express";
import { pool } from "../config/db.js";
const router = express.Router();

// === Pageview ===
router.post("/track/pageview", async (req, res) => {
  try {
    await pool.query(`
      INSERT INTO stats (event_type, count)
      VALUES ('pageview', 1)
      ON CONFLICT (event_type)
      DO UPDATE SET count = stats.count + 1;
    `);
    res.sendStatus(200);
  } catch (err) {
    console.error("Pageview update error:", err.message);
    res.sendStatus(500);
  }
});

// === Kattintás egy állásra ===
router.post("/track/click", async (req, res) => {
  try {
    const { href } = req.body;
    if (!href) return res.status(400).json({ error: "Missing href" });

    const result = await pool.query(
      "UPDATE jobs SET click_count = click_count + 1 WHERE href = $1 RETURNING click_count;",
      [href]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({ newCount: result.rows[0].click_count });
  } catch (err) {
    console.error("Click update error:", err.message);
    res.sendStatus(500);
  }
});

export default router;
