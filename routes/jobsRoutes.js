import express from "express";
import { fetchJobs } from "../controllers/jobsController.js";

const router = express.Router();

router.get("/jobs", fetchJobs);

export default router;
