// ================================
// GLOBAL QUOTE SYSTEM (ALL CATEGORIES)
// ================================

// ===== CONFIG =====
let quotes = [];
let currentQuoteIndex = 0;
let currentPage = 1;

// ===== DOM ELEMENTS (UNIVERSAL) =====
const quoteText = document.getElementById('quote-text');
const generateBtn = document.getElementById('generate-quote');
const quotesGrid = document.getElementById('quotes-grid');
const searchInput = document.getElementById('search-input');
const noResults = document.getElementById('no-results');

// ===== CATEGORY & JSON PATH =====
const body = document.body;
const category = body.dataset.category || 'hustle';
const jsonPath = `data/${category}.json`;

// ===== LOAD JSON =====
fetch(jsonPath)
  .then(res => res.json())
  .then(data => {
    quotes = data;
    showRandomQuote();
    displayCurrentPage(quotes, currentPage);
  })
  .catch(err => console.error(`Error loading ${jsonPath}:`, err));

// ================================
// QUOTE OF THE DAY (FROM HUSTLE)
// ================================
function showRandomQuote() {
  if (!quotes.length || !quoteText) return;
  
  currentQuoteIndex = Math.floor(Math.random() * quotes.length);
  const q = quotes[currentQuoteIndex];
  
  quoteText.textContent = `"${q.quote}" — ${q.author}`;
}

// ===== GENERATE NEW RANDOM =====
generateBtn?.addEventListener('click', showRandomQuote);

// ================================
// DISPLAY QUOTES GRID
// ================================
function displayCurrentPage(list, page = 1) {
  if (!quotesGrid) return;
  
  displayItemsWithAds({
    items: list,
    grid: quotesGrid,
    page,
    renderCard: (q) => {
      const card = document.createElement('div');
      card.className = 'card quote-card';
      
      card.innerHTML = `
        <div class="card-content">
          <p class="quote-text">${q.quote}</p>
          <p class="quote-author">${q.author}</p>
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

// ================================
// SEARCH (FROM HUSTLE)
// ================================
searchInput?.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase().trim();
  currentPage = 1;
  
  if (!query) {
    displayCurrentPage(quotes, 1);
    noResults.style.display = 'none';
    return;
  }
  
  const filtered = quotes.filter(q =>
    q.quote.toLowerCase().includes(query) ||
    q.author.toLowerCase().includes(query)
  );
  
  if (filtered.length) {
    displayCurrentPage(filtered, 1);
    noResults.style.display = 'none';
  } else {
    quotesGrid.innerHTML = '';
    noResults.style.display = 'block';
  }
});

// ================================
// HAMBURGER MENU
// ================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
hamburger?.addEventListener('click', () => navMenu?.classList.toggle('open'));

// ================================
// HELPERS
// ================================
function escapeQuotes(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}