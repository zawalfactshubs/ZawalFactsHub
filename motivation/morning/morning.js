// ========================
// Morning Quotes JS (Hustle-style, limited to 100)
// ========================

const MAX_MORNING_QUOTES = 100;

let quotes = [];
let currentQuoteIndex = 0;
let currentPage = 1;

// ===== DOM Elements =====
const quoteText = document.getElementById('morning-quote-text');
const generateBtn = document.getElementById('generate-morning-quote');
const morningGrid = document.getElementById('morning-quotes-grid');
const shareModal = document.getElementById('share-modal');
const shareLinksContainer = document.getElementById('share-links');
const searchInput = document.getElementById('morning-search-input');
const noResults = document.getElementById('morning-no-results');

// ===== LOAD JSON (LIMITED TO 100) =====
fetch('data/morning.json')
  .then(res => res.json())
  .then(data => {
    quotes = data.slice(0, MAX_MORNING_QUOTES);
    showRandomMorningQuote();
    displayCurrentMorningPage(quotes, currentPage);
  })
  .catch(err => console.error('Error loading JSON:', err));

// ===== RANDOM QUOTE =====
function showRandomMorningQuote() {
  if (!quotes.length) return;
  currentQuoteIndex = Math.floor(Math.random() * quotes.length);
  const q = quotes[currentQuoteIndex];
  quoteText.textContent = `"${q.quote}" — ${q.author}`;
}

// ===== DISPLAY CURRENT PAGE (Hustle-style) =====
function displayCurrentMorningPage(list, page = 1) {
  displayItemsWithAds({
    items: list,
    grid: morningGrid,
    page: page,
    renderCard: (q) => {
      const card = document.createElement('div');
      card.className = 'card morning-card';
      card.innerHTML = `
        <div class="card-content">
          <p class="quote-text">${q.quote}</p>
          <p class="quote-author">– ${q.author}</p>
          <div class="card-buttons">
            <button onclick="listenCard('${escapeQuotes(q.quote)}','${escapeQuotes(q.author)}')">🗣️ Listen</button>
            <button onclick="shareCard(this, 'morning-quote.png')">📤 Share</button>
            <button onclick="downloadTip(this, 'morning-quote.png')">💾 Download</button>
          </div>
        </div>
      `;
      return card;
    }
  });
}

// ===== SEARCH =====
searchInput?.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase().trim();
  currentPage = 1;
  
  if (!query) {
    displayCurrentMorningPage(quotes, currentPage);
    noResults.style.display = 'none';
    return;
  }
  
  const filtered = quotes.filter(q =>
    q.quote.toLowerCase().includes(query) ||
    q.author.toLowerCase().includes(query) ||
    q.category?.toLowerCase().includes(query)
  );
  
  if (filtered.length) {
    displayCurrentMorningPage(filtered, 1);
    noResults.style.display = 'none';
  } else {
    morningGrid.innerHTML = '';
    noResults.style.display = 'block';
  }
});

// ===== RANDOM QUOTE BUTTON =====
generateBtn?.addEventListener('click', showRandomMorningQuote);

// ===== ESCAPE QUOTES =====
function escapeQuotes(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
hamburger?.addEventListener('click', () => navMenu?.classList.toggle('open'));