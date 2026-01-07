// ===============================
// GLOBAL STATS SYSTEM (CLEAN & SAFE)
// ===============================

// -------- CONFIG --------
const FACT_COOLDOWN_MINUTES = 5; // prevent refresh abuse

const ROOT_FOLDERS = ["facts", "motivation", "health", "tech", "lifehack"];

const INDEX_FILES = [
  "facts.html",
  "motivation.html",
  "health.html",
  "tech.html",
  "lifehack.html"
];

// -------- HELPERS --------
function getStat(key) {
  return JSON.parse(localStorage.getItem(key) || "0");
}

function setStat(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function increment(key) {
  setStat(key, getStat(key) + 1);
  updateStats();
}

// -------- UI UPDATE --------
function updateStats() {
  const likesEl = document.getElementById("likes-count");
  const ratingEl = document.getElementById("rating-count");
  const visitsEl = document.getElementById("visit-count");
  const factEl = document.getElementById("fact-count");
  
  if (likesEl) likesEl.textContent = getStat("likes");
  if (ratingEl) ratingEl.textContent = getStat("ratings");
  if (visitsEl) visitsEl.textContent = getStat("visits");
  if (factEl) factEl.textContent = getStat("factOpens");
}

// -------- VISITOR COUNTER (20 MIN RULE) --------
(function countVisit() {
  const now = Date.now();
  const lastVisit = getStat("lastVisitTime");
  const limit = 5 * 60 * 1000;
  
  if (!lastVisit || now - lastVisit > limit) {
    increment("visits");
    setStat("lastVisitTime", now);
  }
})();

// -------- FACT OPENS (FINAL & SAFE) --------
(function countFactOpen() {
  const path = window.location.pathname.toLowerCase();
  if (!path.endsWith(".html")) return;
  
  const parts = path.split("/").filter(Boolean);
  if (parts.length < 3) return; // must be leaf page
  
  const root = parts[0];
  const category = parts[1];
  const file = parts[parts.length - 1];
  
  if (!ROOT_FOLDERS.includes(root)) return;
  if (INDEX_FILES.includes(file)) return;
  
  const now = Date.now();
  const cooldown = FACT_COOLDOWN_MINUTES * 60 * 1000;
  
  const lastOpenKey = `lastFactOpen_${root}_${category}`;
  const lastOpenTime = getStat(lastOpenKey);
  
  if (lastOpenTime && now - lastOpenTime < cooldown) return;
  
  // ---- TOTAL FACT OPENS ----
  increment("factOpens");
  
  // ---- PER CATEGORY OPENS ----
  const categoryStats = getStat("factOpensByCategory") || {};
  categoryStats[`${root}/${category}`] =
    (categoryStats[`${root}/${category}`] || 0) + 1;
  
  setStat("factOpensByCategory", categoryStats);
  setStat(lastOpenKey, now);
})();

// -------- LIKE / RATE --------
document.getElementById("like-btn")?.addEventListener("click", () => increment("likes"));
document.getElementById("rate-btn")?.addEventListener("click", () => increment("ratings"));

// -------- LOAD UI --------
document.addEventListener("DOMContentLoaded", updateStats);