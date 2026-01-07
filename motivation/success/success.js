// ========================
// Success Quotes JS (Hustle-style, limited to 100)
// ========================

const MAX_SUCCESS_QUOTES = 100;

let quotes = [];
let currentQuoteIndex = 0;
let currentPage = 1;

// ===== DOM Elements =====
const quoteText = document.getElementById('success-quote-text');
const generateBtn = document.getElementById('generate-success-quote');
const successGrid = document.getElementById('success-quotes-grid');
const searchInput = document.getElementById('success-search-input');
const noResults = document.getElementById('success-no-results');

// ===== LOAD JSON (LIMITED TO 100) =====
fetch('data/success.json')
  .then(res => res.json())
  .then(data => {
    quotes = data.slice(0, MAX_SUCCESS_QUOTES);
    showRandomSuccessQuote();
    displayCurrentSuccessPage(quotes, currentPage);
  })
  .catch(err => console.error('Error loading JSON:', err));

// ===== RANDOM QUOTE =====
function showRandomSuccessQuote() {
  if (!quotes.length || !quoteText) return;
  currentQuoteIndex = Math.floor(Math.random() * quotes.length);
  const q = quotes[currentQuoteIndex];
  quoteText.textContent = `"${q.quote}" — ${q.author}`;
}

// ===== DISPLAY CURRENT PAGE =====
function displayCurrentSuccessPage(list, page = 1) {
  displayItemsWithAds({
    items: list,
    grid: successGrid,
    page: page,
    renderCard: (q) => {
      const card = document.createElement('div');
      card.className = 'card success-card';
      card.innerHTML = `
        <div class="card-content">
          <p class="quote-text">${q.quote}</p>
          <p class="quote-author">– ${q.author}</p>
          <div class="card-buttons">
            <button onclick="listenCard('${escapeQuotes(q.quote)}','${escapeQuotes(q.author)}')">🗣️ Listen</button>
            <button onclick="shareCard(this, 'success-quote.png')">📤 Share</button>
            <button onclick="downloadTip(this, 'success-quote.png')">💾 Download</button>
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
    displayCurrentSuccessPage(quotes, 1);
    noResults.style.display = 'none';
    return;
  }
  
  const filtered = quotes.filter(q =>
    q.quote.toLowerCase().includes(query) ||
    q.author.toLowerCase().includes(query) ||
    q.category?.toLowerCase().includes(query)
  );
  
  if (filtered.length) {
    displayCurrentSuccessPage(filtered, 1);
    noResults.style.display = 'none';
  } else {
    successGrid.innerHTML = '';
    noResults.style.display = 'block';
  }
});

// ===== RANDOM QUOTE BUTTON =====
generateBtn?.addEventListener('click', showRandomSuccessQuote);

// ===== ESCAPE QUOTES =====
function escapeQuotes(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
hamburger?.addEventListener('click', () => navMenu?.classList.toggle('open'));