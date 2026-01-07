/* =========================================================
   ZAWAL FACTS HUB – SCRIPT.JS
   Full Working Version (Menu removed)
========================================================= */

/* ===================== DOM ELEMENTS ===================== */
const factTextEl = document.getElementById("fact-text");
const searchInputEl = document.getElementById("search-input");
const noResultsEl = document.getElementById("no-results");
const postsContainer = document.querySelector(".posts");

const likeBtn = document.getElementById("like-btn");
const rateBtn = document.getElementById("rate-btn");

const likesCountEl = document.getElementById("likes-count");
const ratingCountEl = document.getElementById("rating-count");
const visitCountEl = document.getElementById("visit-count");
const factCountEl = document.getElementById("fact-count");

/* ===================== DATA ===================== */
let stats = {
  likes: 0,
  ratings: 0,
  visits: 0,
  factOpens: 0
};

let factsData = [];
let motivationData = [];
let techTipsData = [];
let healthTipsData = [];
let lifeHacksData = [];

/* ===================== PAGE INIT ===================== */
document.addEventListener("DOMContentLoaded", () => {
  initStats();
  incrementCounter("visits");

  initDarkModeToggle();
  initGlowClickEffect();


  /* ===================== LOAD DATA ===================== */
  Promise.all([
    fetch("data/facts.json").then(r => r.json()),
    fetch("data/motivation.json").then(r => r.json()),
    fetch("data/tech.json").then(r => r.json()),
    fetch("data/health.json").then(r => r.json()),
    fetch("data/lifehacks.json").then(r => r.json())
  ]).then(([facts, motivation, tech, health, hacks]) => {
    factsData = facts;
    motivationData = motivation;
    techTipsData = tech;
    healthTipsData = health;
    lifeHacksData = hacks;

    showFactOfDay();
    renderAllPosts(getAllData());
  });
});

/* ===================== HELPERS ===================== */
function getAllData() {
  return [
    ...factsData,
    ...motivationData,
    ...techTipsData,
    ...healthTipsData,
    ...lifeHacksData
  ];
}

/* ===================== STATS ===================== */
function initStats() {
  const saved = localStorage.getItem("zawal_stats");
  if (saved) stats = JSON.parse(saved);
  updateCounters();
}

function updateCounters() {
  if (!likesCountEl) return;

  likesCountEl.textContent = stats.likes;
  ratingCountEl.textContent = stats.ratings;
  visitCountEl.textContent = stats.visits;
  factCountEl.textContent = stats.factOpens;

  localStorage.setItem("zawal_stats", JSON.stringify(stats));
}

function incrementCounter(name) {
  stats[name] = (stats[name] || 0) + 1;
  updateCounters();
}

/* ===================== FACT OF THE DAY ===================== */
function showFactOfDay() {
  if (!factTextEl || !factsData.length) return;

  const random = factsData[Math.floor(Math.random() * factsData.length)];
  factTextEl.textContent = random.text;
  incrementCounter("factOpens");
}

/* ===================== RENDER POSTS ===================== */
function renderAllPosts(data) {
  if (!postsContainer) return;

  postsContainer.innerHTML = "";

  if (!data.length) {
    if (noResultsEl) noResultsEl.style.display = "block";
    return;
  } else {
    if (noResultsEl) noResultsEl.style.display = "none";
  }

  const grouped = data.reduce((acc, item) => {
    const cat = item.category || "General";
    const sub = item.subcategory || "General";

    acc[cat] ??= {};
    acc[cat][sub] ??= [];
    acc[cat][sub].push(item);

    return acc;
  }, {});

  for (const category in grouped) {
    addHeading("h2", category, "category-heading");

    for (const subcat in grouped[category]) {
      addHeading("h3", subcat, "subcategory-heading");

      grouped[category][subcat].forEach(item => {
        postsContainer.appendChild(createCard(item));
      });
    }
  }
}

function addHeading(tag, text, className) {
  const el = document.createElement(tag);
  el.textContent = text;
  el.className = className;
  postsContainer.appendChild(el);
}

function createCard(item) {
  const card = document.createElement("div");
  card.className = "card";

  const safeText = item.text.replace(/'/g, "\\'");

  card.innerHTML = `
    <img src="${item.image || "default.jpg"}" alt="" loading="lazy">
    <div class="card-content">
      <p>${item.text}</p>
      <div class="card-buttons">
        <button onclick="event.stopPropagation(); shareFact('${safeText}')">Share</button>
        <button onclick="readFact('${safeText}')">🔊 Listen</button>
      </div>
    </div>
  `;

  return card;
}

/* ===================== SEARCH ===================== */
function searchAllCategories() {
  if (!searchInputEl) return;

  const query = searchInputEl.value.toLowerCase().trim();

  if (!query) {
    renderAllPosts(getAllData());
    return;
  }

  const filtered = getAllData().filter(item =>
    item.text.toLowerCase().includes(query) ||
    item.category?.toLowerCase().includes(query) ||
    item.subcategory?.toLowerCase().includes(query)
  );

  renderAllPosts(filtered);
}

if (searchInputEl) {
  searchInputEl.addEventListener("input", searchAllCategories);
}

/* ===================== SHARE & AUDIO ===================== */
function readFact(text) {
  speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

/* ===================== DARK MODE ===================== */
function initDarkModeToggle() {
  const btn = document.createElement("button");
  btn.className = "dark-mode-toggle";
  btn.textContent = "🌙";

  document.body.appendChild(btn);

  btn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    btn.textContent = document.body.classList.contains("light-mode") ? "🌞" : "🌙";
  });
}

/* ===================== GLOW CLICK ===================== */
function initGlowClickEffect() {
  document.querySelectorAll("button, .nav-menu a").forEach(el => {
    el.addEventListener("click", () => {
      document
        .querySelectorAll(".clicked")
        .forEach(c => c.classList.remove("clicked"));
      el.classList.add("clicked");
    });
  });
}

/* ===================== LIKES & RATINGS ===================== */
if (likeBtn) {
  likeBtn.addEventListener("click", () => {
    incrementCounter("likes");
    showButtonMessage(likeBtn, "Thanks ❤️");
  });
}

if (rateBtn) {
  rateBtn.addEventListener("click", () => {
    incrementCounter("ratings");
    showButtonMessage(rateBtn, "Thanks ⭐");
  });
}

/* ===================== BUTTON MESSAGE ===================== */
function showButtonMessage(btn, text) {
  const msg = document.createElement("span");
  msg.className = "btn-msg";
  msg.textContent = text;

  btn.parentElement.style.position = "relative";
  btn.parentElement.appendChild(msg);

  setTimeout(() => msg.remove(), 2000);
}

/* ===================== NATIVE SHARE (FINAL) ===================== */
window.nativeShare = function (text) {
  if (navigator.share) {
    navigator.share({
      title: "Zawal Facts Hub",
      text,
      url: location.href
    }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text + " — " + location.href)
      .then(() => alert("Link copied"));
  } else {
    alert(text);
  }
};

/* ===================== SHARE ALIASES (KEEP COMPATIBILITY) ===================== */
window.shareContent = function (text) {
  nativeShare(text);
};

window.shareFact = function (text) {
  nativeShare(text);
};

window.openShareModal = function (text) {
  nativeShare(text);
};

if (!navigator.share && !navigator.clipboard) {
  console.warn("Sharing not supported");
}
// ===============================
// Subcategory Tabs Generator with Auto-Scroll & Active State
// ===============================

const subcategories = {
  facts: ['Animal', 'Humans', 'Plant', 'Nature', 'Science', 'History', 'Funweird', 'Tech', 'Space', 'Geography', 'Psychology', 'Food', 'Sport', 'WorldRecord'],
  motivation: ['Success', 'Life', 'Hustle', 'Mindset', 'Confidence', 'Overthinking', 'Study', 'Morning', 'Strength'],
  health: ["womens", "Men", 'Nutrition', 'fitness', 'Mental', 'Sleep', 'Hydration', 'Weight', 'Immune', 'Healthyhabits'],
  tech: ['Gadgets', 'Apps', 'AI', 'Programming', 'Cybersecurity', 'Cloud', 'future', 'Networking'],
  lifehacks: ['Daily Hacks', 'Money Hacks', 'Phone Hacks', 'Home Hacks', 'Study Hacks', 'Emergency Hacks', 'Productivity', 'Health Hacks']
};

// Slugify function for folder/file names
function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

// Generate and inject subcategory tabs
function injectSubcategoryTabs(category) {
  if (!subcategories[category]) return;
  
  const container = document.createElement('div');
  container.className = 'quiz-tabs';
  
  const currentPath = window.location.pathname.toLowerCase();
  let activeSet = false;
  
  subcategories[category].forEach((sub) => {
    const btn = document.createElement('button');
    btn.className = 'tab';
    btn.textContent = sub;
    
    const mainFolder = category === 'lifehacks' ? 'tutorials' : category;
    const subFolder = slugify(sub);
    const targetUrl = `/${mainFolder}/${subFolder}/${subFolder}.html`;
    
    // Set active if URL includes subfolder and no other active set yet
    if (!activeSet && currentPath.includes(`/${subFolder}/`)) {
      btn.classList.add('active');
      activeSet = true;
    }
    
    // Click event: remove active from all, set clicked, scroll, navigate
    btn.addEventListener('click', () => {
      container.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      window.location.href = targetUrl;
    });
    
    container.appendChild(btn);
  });
  
  // If no active tab matched URL, default to first tab
  if (!activeSet && container.firstChild) {
    container.firstChild.classList.add('active');
  }
  
  const mainContent = document.querySelector('.fact-of-day') || document.querySelector('.posts');
  if (mainContent) mainContent.parentNode.insertBefore(container, mainContent);
  
  // Scroll the active tab into view on page load
  const activeBtn = container.querySelector('.tab.active');
  if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center' });
}

// Auto-detect page category and inject tabs
function detectAndInjectTabs() {
  const path = window.location.pathname.toLowerCase();
  
  if (path.includes('/facts/')) injectSubcategoryTabs('facts');
  else if (path.includes('/motivation/')) injectSubcategoryTabs('motivation');
  else if (path.includes('/health/')) injectSubcategoryTabs('health');
  else if (path.includes('/tech/')) injectSubcategoryTabs('tech');
  else if (path.includes('/tutorials/') || path.includes('/lifehacks/')) injectSubcategoryTabs('lifehacks');
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', detectAndInjectTabs);