import express from "express";
//import pkg from "pg";
//const { Pool } = pkg;
import cors from "cors";
import jobsRoutes from "./routes/jobsRoutes.js";
import companiesRoutes from "./routes/companiesRoutes.js";

const app = express();

/*const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});*/

app.use(cors({ origin: "*" }));
app.use(express.static("public"));
app.use("/api", jobsRoutes);
app.use("/api", companiesRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
