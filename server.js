import express from "express";
import cors from "cors";
import jobsRoutes from "./routes/jobsRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
//app.use(express.static("public"));

app.use("/api", jobsRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
