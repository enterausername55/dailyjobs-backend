// Hamburger menü logika
const menuToggle = document.getElementById("menu-toggle");
const nav = document.querySelector(".nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

document.addEventListener("click", (e) => {
  if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
    nav.classList.remove("open");
  }
});

const container = document.getElementById("jobs-container");
const filterSelect = document.getElementById("filter");
const juniorFilter = document.getElementById("junior-filter");
const letterFilterDiv = document.getElementById("letter-filter");

// Menü gombok
const jobsMenu = document.getElementById("menu-jobs");
const companiesMenu = document.getElementById("menu-companies");
const requestCompanyMenu = document.getElementById("menu-requestcompany");
const reportBugsMenu = document.getElementById("menu-reportbugs");
const hireMeMenu = document.getElementById("menu-hireme");

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

// === Állások API lekérés ===
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

// === Cégek API lekérés ===
async function fetchCompanies() {
  try {
    const res = await fetch(`/api/companies`);
    if (!res.ok) throw new Error("Hálózati hiba");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Hiba a companies API lekéréskor:", err);
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
        card.addEventListener("click", async (e) => {
          e.preventDefault();
          try {
            await fetch("/api/track/click", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ href: job.href }),
            });
          } catch (err) {
            console.error("Click tracking failed:", err);
          } finally {
            window.open(job.href, "_blank");
          }
        });
        card.innerHTML = `
          <div class="job-title">${job.title.replace(/"/g, "")}</div>
          <div class="dates">
            <div>
              ${job.click_count || ""} Megjelent: ${
          job.start_date ? job.start_date.split("T")[0].replace(/"/g, "") : ""
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

// === Cégek megjelenítése ===
async function renderCompanies() {
  container.innerHTML = "Betöltés...";

  const companies = await fetchCompanies();
  if (!companies.length) {
    container.innerHTML =
      "<p style='text-align:center'>Nincs cég az adatbázisban.</p>";
    return;
  }

  // Cégek csoportosítása kezdőbetű szerint
  const grouped = {};
  companies.forEach((c) => {
    const first = c.company_name[0]?.toUpperCase() || "#";
    if (!grouped[first]) grouped[first] = [];
    grouped[first].push(c);
  });

  // Külső wrapper a céges nézethez
  const outer = document.createElement("div");
  outer.className = "companies-container";

  Object.keys(grouped)
    .sort()
    .forEach((letter) => {
      const section = document.createElement("div");
      section.className = "company-section";

      const title = document.createElement("div");
      title.className = "company-title";
      title.textContent = letter;
      section.appendChild(title);

      const list = document.createElement("div");
      list.className = "company-list";

      grouped[letter]
        .sort((a, b) => a.company_name.localeCompare(b.company_name, "hu"))
        .forEach((c) => {
          const a = document.createElement("a");
          a.href = c.url;
          a.target = "_blank";
          a.textContent = c.company_name;
          list.appendChild(a);
        });

      section.appendChild(list);
      outer.appendChild(section);
    });

  // lecseréljük a container tartalmát
  container.innerHTML = "";
  container.appendChild(outer);
}

// === Új cég kérése ===
async function fetchRequestedCompanies() {
  try {
    const res = await fetch("/api/requested-companies");
    if (!res.ok) throw new Error("Hálózati hiba");
    return await res.json();
  } catch (err) {
    console.error("Hiba a requested companies API lekéréskor:", err);
    return [];
  }
}

async function renderRequestedCompanies() {
  container.innerHTML = "Betöltés...";

  const data = await fetchRequestedCompanies();
  container.innerHTML = "";

  const section = document.createElement("section");
  section.className = "requested-card-container";

  if (!data.length) {
    section.innerHTML =
      "<p style='text-align:center'>Még nincs beküldött kérés.</p>";
  } else {
    data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "requested-card";
      const statusClass =
        item.status === "approved"
          ? "status-approved"
          : item.status === "rejected"
          ? "status-rejected"
          : "status-pending";

      card.innerHTML = `
        <a href="${item.url}" target="_blank" class="company-name">${
        item.name
      }</a>
        <div class="company-url">${item.url}</div>
        <span class="status-badge ${statusClass}">${item.status}</span>
        <div class="comment">${item.comment || ""}</div>
      `;
      section.appendChild(card);
    });
  }

  // === Form rész ===
  const form = document.createElement("form");
  form.className = "request-form";
  form.innerHTML = `
    <h2>Új cég beküldése</h2>
    <label for="companyName">Cégnév</label>
    <input type="text" id="companyName" required />
    <label for="companyUrl">Cég weboldal (URL)</label>
    <input type="url" id="companyUrl" required />
    <button type="submit">Beküldés</button>
    <div class="message" id="request-message"></div>
  `;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("companyName").value.trim();
    const url = document.getElementById("companyUrl").value.trim();
    const msg = document.getElementById("request-message");
    msg.textContent = "";

    if (!name || !url) {
      msg.textContent = "Tölts ki minden mezőt!";
      msg.className = "message error";
      return;
    }

    try {
      const res = await fetch("/api/requested-companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url }),
      });

      if (res.ok) {
        msg.textContent = "✅ Kérés beküldve!";
        msg.className = "message success";
        form.reset();
        renderRequestedCompanies();
      } else {
        msg.textContent = "❌ Hiba történt a beküldéskor.";
        msg.className = "message error";
      }
    } catch (err) {
      console.error("Form beküldés hiba:", err);
      msg.textContent = "❌ Hálózati hiba.";
      msg.className = "message error";
    }
  });

  container.appendChild(section);
  container.appendChild(form);
}

function renderSoon() {
  container.innerHTML = "<p style='text-align:center'>Very soon.</p>";
}

async function renderJobsWrapper() {
  const jobs = await fetchJobs();
  renderJobsFromArray(jobs);
}

// === Menü váltások ===
jobsMenu.addEventListener("click", () => {
  document.querySelector(".page-title").textContent = "Mai álláshirdetések";
  document.querySelector(".filters").style.display = "flex";
  document.getElementById("letter-filter").style.display = "flex";
  renderJobsWrapper();
});

companiesMenu.addEventListener("click", async () => {
  document.querySelector(".page-title").textContent = "Cégek";
  document.querySelector(".filters").style.display = "none";
  document.getElementById("letter-filter").style.display = "none";
  await renderCompanies();
});

requestCompanyMenu.addEventListener("click", async () => {
  document.querySelector(".page-title").textContent = "Új cég kérése";
  document.querySelector(".filters").style.display = "none";
  document.getElementById("letter-filter").style.display = "none";
  await renderRequestedCompanies();
});

reportBugsMenu.addEventListener("click", () => {
  document.querySelector(".page-title").textContent = "SoonTM";
  document.querySelector(".filters").style.display = "none";
  document.getElementById("letter-filter").style.display = "none";
  renderSoon();
});

hireMeMenu.addEventListener("click", () => {
  document.querySelector(".page-title").textContent = "SoonTM";
  document.querySelector(".filters").style.display = "none";
  document.getElementById("letter-filter").style.display = "none";
  renderSoon();
});

// Event listener-ek
filterSelect.addEventListener("change", renderJobsWrapper);
juniorFilter.addEventListener("change", renderJobsWrapper);

// Inicializálás
renderJobsWrapper();

// === Pageview tracking ===
fetch("/api/track/pageview", { method: "POST" })
  .then(() => console.log("Pageview logged"))
  .catch((err) => console.error("Pageview log error:", err));
