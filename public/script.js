const container = document.getElementById("jobs-container");
const filterSelect = document.getElementById("filter");
const juniorFilter = document.getElementById("junior-filter");
const letterFilterDiv = document.getElementById("letter-filter");

// Betűszűrő gombok
const letters = ["ALL", "0-9", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
let activeLetter = "ALL";

letters.forEach((letter) => {
  const btn = document.createElement("button");
  btn.textContent = letter;
  btn.addEventListener("click", () => {
    activeLetter = letter;
    document
      .querySelectorAll("#letter-filter button")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderJobsWrapper();
  });
  if (letter === "ALL") btn.classList.add("active");
  letterFilterDiv.appendChild(btn);
});

// API lekérés
async function fetchJobs() {
  try {
    const params = new URLSearchParams({
      filter: filterSelect.value,
      letter: activeLetter,
      junior: juniorFilter.value,
    });
    const res = await fetch(`/api/jobs?${params}`);
    if (!res.ok) throw new Error("Hálózati hiba");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Hiba a jobs API lekéréskor:", err);
    return [];
  }
}

function renderJobsFromArray(jobs) {
  container.innerHTML = "";

  if (jobs.length === 0) {
    container.innerHTML =
      "<p style='text-align:center'>Nincs a kiválasztott időszakban új állás.</p>";
    return;
  }

  const jobsBySite = {};
  jobs.forEach((job) => {
    if (!jobsBySite[job.site]) jobsBySite[job.site] = [];
    jobsBySite[job.site].push(job);
  });

  Object.keys(jobsBySite).forEach((site) => {
    const section = document.createElement("div");
    section.className = "site-section";

    const siteTitle = document.createElement("div");
    siteTitle.className = "site-title";
    siteTitle.textContent = site.replace(/"/g, "");
    section.appendChild(siteTitle);

    const cardContainer = document.createElement("div");
    cardContainer.className = "card-container";

    jobsBySite[site]
      .sort((a, b) => a.title.localeCompare(b.title, "hu"))
      .forEach((job) => {
        const card = document.createElement("a");
        card.className = "card";
        card.href = job.href;
        card.target = "_blank";
        card.innerHTML = `
          <div class="job-title">${job.title.replace(/"/g, "")}</div>
          <div class="dates">
            <div>
              Posted: ${
                job.start_date
                  ? job.start_date.split("T")[0].replace(/"/g, "")
                  : ""
              }
            </div>
          </div>
        `;
        cardContainer.appendChild(card);
      });

    section.appendChild(cardContainer);
    container.appendChild(section);
  });
}

async function renderJobsWrapper() {
  const jobs = await fetchJobs();
  renderJobsFromArray(jobs);
}

// Event listener-ek
filterSelect.addEventListener("change", renderJobsWrapper);
juniorFilter.addEventListener("change", renderJobsWrapper);

// Inicializálás
renderJobsWrapper();
