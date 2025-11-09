import express from "express";
import cors from "cors";
import jobsRoutes from "./routes/jobsRoutes.js";
import companiesRoutes from "./routes/companiesRoutes.js";
import trackRoutes from "./routes/trackRoutes.js";
import requestedCompaniesRoutes from "./routes/requestedCompaniesRoutes.js";
import { pool } from "./config/db.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.static("public"));
app.use(express.json());

// === API endpoint hívások számlálása ===
app.use((req, res, next) => {
  // csak az "igazi" API endpointokat számoljuk, ne a /track-et
  if (req.path.startsWith("/api/") && !req.path.startsWith("/api/track")) {
    pool
      .query(
        `
      INSERT INTO stats (event_type, count)
      VALUES ($1, 1)
      ON CONFLICT (event_type)
      DO UPDATE SET count = stats.count + 1;
      `,
        [req.path]
      )
      .catch((err) => console.error("API count error:", err.message));
  }
  next();
});

app.use("/api", jobsRoutes);
app.use("/api", companiesRoutes);
app.use("/api", trackRoutes);
app.use("/api", requestedCompaniesRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
