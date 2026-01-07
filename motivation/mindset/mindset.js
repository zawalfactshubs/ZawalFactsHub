// ========================
// Mindset Quotes JS (Hustle-style, limited to 100)
// ========================

const MAX_MINDSET_QUOTES = 100; // 🔒 HARD LIMIT

let quotes = [];
let currentQuoteIndex = 0;
let currentPage = 1;

// ===== DOM ELEMENTS =====
const quoteText = document.getElementById('mindset-quote-text');
const generateBtn = document.getElementById('generate-mindset-quote');
const mindsetGrid = document.getElementById('mindset-quotes-grid');
const searchInput = document.getElementById('mindset-search-input');
const noResults = document.getElementById('mindset-no-results');

// ===== LOAD JSON (LIMITED TO 100) =====
fetch('data/mindset.json')
  .then(res => res.json())
  .then(data => {
    quotes = data.slice(0, MAX_MINDSET_QUOTES); // 🔒 limit to 100
    showRandomMindsetQuote();
    displayMindsetItems(currentPage);
  })
  .catch(err => console.error('Error loading mindset JSON:', err));

// ===== RANDOM QUOTE =====
function showRandomMindsetQuote() {
  if (!quotes.length || !quoteText) return;
  currentQuoteIndex = Math.floor(Math.random() * quotes.length);
  const q = quotes[currentQuoteIndex];
  quoteText.textContent = `"${q.quote}" — ${q.author}`;
}

// ===== DISPLAY ITEMS WITH ADS & PAGINATION =====
function displayMindsetItems(page = 1, filteredItems = null) {
  const list = filteredItems || quotes;
  
  displayItemsWithAds({
    items: list,
    grid: mindsetGrid,
    page,
    renderCard: (item) => {
      const card = document.createElement('div');
      card.className = 'card mindset-card';
      
      card.innerHTML = `
        <div class="card-content">
          <p class="quote-text">${item.quote}</p>
          <p class="quote-author">– ${item.author}</p>
          <div class="card-buttons">
            <button onclick="listenCard('${escapeQuotes(item.quote)}','${escapeQuotes(item.author)}')">🗣️ Listen</button>
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
    displayMindsetItems(1);
    noResults.style.display = 'none';
    return;
  }
  
  const filtered = quotes.filter(q =>
    q.quote.toLowerCase().includes(query) ||
    q.author.toLowerCase().includes(query)
  );
  
  if (filtered.length) {
    displayMindsetItems(1, filtered);
    noResults.style.display = 'none';
  } else {
    mindsetGrid.innerHTML = '';
    noResults.style.display = 'block';
  }
});

// ===== GENERATE NEW RANDOM QUOTE =====
generateBtn?.addEventListener('click', showRandomMindsetQuote);

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
hamburger?.addEventListener('click', () => navMenu?.classList.toggle('open'));

// ===== SAFE STRING ESCAPE =====
function escapeQuotes(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}