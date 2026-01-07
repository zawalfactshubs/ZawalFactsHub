const MAX_HUSTLE_QUOTES = 100;

let quotes = [];
let currentQuoteIndex = 0;

/* ===== DOM ELEMENTS ===== */
const quoteText = document.getElementById('hustle-quote-text');
const generateBtn = document.getElementById('generate-hustle-quote');
const hustleGrid = document.getElementById('hustle-quotes-grid');
const searchInput = document.getElementById('hustle-search-input');
const noResults = document.getElementById('hustle-no-results');

/* ===== PAGINATION ===== */
let currentPage = 1;

/* ===== LOAD JSON ===== */
fetch('data/hustle.json')
  .then(res => res.json())
  .then(data => {
    quotes = data.slice(0, MAX_HUSTLE_QUOTES);
    showRandomHustleQuote();
    displayCurrentHustlePage(quotes, currentPage);
  })
  .catch(err => console.error('Error loading JSON:', err));

/* ===== RANDOM QUOTE ===== */
function showRandomHustleQuote() {
  if (!quotes.length || !quoteText) return;
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  quoteText.textContent = `"${q.quote}" — ${q.author}`;
}

/* ===== DISPLAY PAGE ===== */
function displayCurrentHustlePage(list, page = 1) {
  displayItemsWithAds({
    items: list,
    grid: hustleGrid,
    page,
    renderCard: (q) => {
      const card = document.createElement('div');
      card.className = 'card hustle-card';
      card.innerHTML = `
        <div class="card-content">
          <p class="quote-text">${q.quote}</p>
          <p class="quote-author">– ${q.author}</p>
          <div class="card-buttons">
            <button onclick="listenCard('${escapeQuotes(q.quote)}','${escapeQuotes(q.author)}')">🗣️ Listen</button>
            <button onclick="shareCard(this)">📤 Share</button>
            <button onclick="downloadTip(this)">💾 Download</button>
          </div>
        </div>
      `;
      return card;
    }
  });
}

/* ===== SEARCH ===== */
searchInput?.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase().trim();
  currentPage = 1;
  
  if (!query) {
    displayCurrentHustlePage(quotes, 1);
    noResults.style.display = 'none';
    return;
  }
  
  const filtered = quotes.filter(q =>
    q.quote.toLowerCase().includes(query) ||
    q.author.toLowerCase().includes(query)
  );
  
  if (filtered.length) {
    displayCurrentHustlePage(filtered, 1);
    noResults.style.display = 'none';
  } else {
    hustleGrid.innerHTML = '';
    noResults.style.display = 'block';
  }
});

/* ===== GENERATE ===== */
generateBtn?.addEventListener('click', showRandomHustleQuote);

/* ===== MENU ===== */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger?.addEventListener('click', () => {
  navMenu?.classList.toggle('open');
});

/* ===== ESCAPE ===== */
function escapeQuotes(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}