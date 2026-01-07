let quotes = [];
let currentQuoteIndex = 0;
let currentPage = 1;

// ===== DOM ELEMENTS =====
const quoteText = document.getElementById('confidence-quote-text');
const generateBtn = document.getElementById('generate-confidence-quote');
const grid = document.getElementById('confidence-quotes-grid');
const searchInput = document.getElementById('confidence-search-input');
const noResults = document.getElementById('confidence-no-results');

// ===== LOAD JSON =====
fetch('data/confidence.json')
  .then(res => res.json())
  .then(data => {
    quotes = data;
    showRandomQuote();
    displayCurrentPage(quotes, currentPage);
  })
  .catch(err => console.error('Error loading confidence JSON:', err));

// ===== RANDOM QUOTE =====
function showRandomQuote() {
  if (!quotes.length || !quoteText) return;
  
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  // Display author below the quote like Hustle
  quoteText.innerHTML = `"${q.quote}" <br> — ${q.author}`;
}

// ===== DISPLAY PAGE =====
function displayCurrentPage(list, page = 1) {
  displayItemsWithAds({
    items: list,
    grid,
    page,
    renderCard: (q) => {
      const card = document.createElement('div');
      card.className = 'card confidence-card';
      
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

// ===== SEARCH =====
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
    grid.innerHTML = '';
    noResults.style.display = 'block';
  }
});

// ===== BUTTON =====
generateBtn?.addEventListener('click', showRandomQuote);

// ===== MENU =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
hamburger?.addEventListener('click', () => navMenu?.classList.toggle('open'));

// ===== HELPER =====
function escapeQuotes(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}