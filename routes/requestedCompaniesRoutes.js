import express from "express";
import {
  getRequestedCompanies,
  postRequestedCompany,
} from "../controllers/requestedCompaniesController.js";

const router = express.Router();

router.get("/requested-companies", getRequestedCompanies);
router.post("/requested-companies", postRequestedCompany);

export default router;
