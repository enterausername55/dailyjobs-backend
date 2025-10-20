import { getJobs } from "../models/jobsModel.js";

export const fetchJobs = async (req, res) => {
  try {
    const { filter, letter, junior } = req.query;
    let jobs = await getJobs({ filter, letter, junior });

    // letter szűrés a cég nevére (ha kell)
    if (letter && letter !== "ALL") {
      jobs = jobs.filter((job) => {
        const firstChar = job.site[0].toUpperCase();
        if (letter === "0-9") return firstChar >= "0" && firstChar <= "9";
        return firstChar === letter;
      });
    }

    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
