import express from "express";
import { fetchCompanies } from "../controllers/companiesController.js";

const router = express.Router();

router.get("/companies", fetchCompanies);

export default router;
