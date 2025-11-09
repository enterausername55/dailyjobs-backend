import {
  getAllRequestedCompanies,
  createRequestedCompany,
} from "../models/requestedCompaniesModel.js";

export async function getRequestedCompanies(req, res) {
  try {
    const companies = await getAllRequestedCompanies();
    res.json(companies);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
}

export async function postRequestedCompany(req, res) {
  try {
    const { name, url } = req.body;
    if (!name || !url) {
      return res.status(400).json({ error: "Name and URL required" });
    }
    const newCompany = await createRequestedCompany(name, url);
    res.status(201).json(newCompany);
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: "Database error" });
  }
}
