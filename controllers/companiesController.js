import { getCompanies } from "../models/companiesModel.js";

export const fetchCompanies = async (req, res) => {
  try {
    let companies = await getCompanies();
    res.json(companies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
