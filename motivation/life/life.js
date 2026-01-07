// ========================
// Life Quotes JS (Hustle-style, limited to 100)
// ========================

const MAX_LIFE_QUOTES = 100; // 🔒 HARD LIMIT

let quotes = [];
let currentQuoteIndex = 0;
let currentPage = 1;

// ===== DOM Elements =====
const quoteText = document.getElementById('life-quote-text');
const generateBtn = document.getElementById('generate-life-quote');
const lifeGrid = document.getElementById('life-quotes-grid');
const shareModal = document.getElementById('share-modal');
const shareLinksContainer = document.getElementById('share-links');
const searchInput = document.getElementById('life-search-input');
const noResults = document.getElementById('life-no-results');

// ===== LOAD JSON (LIMITED TO 100) =====
fetch('data/life.json')
  .then(res => res.json())
  .then(data => {
    quotes = data.slice(0, MAX_LIFE_QUOTES); // 🔒 limit to 100
    showRandomLifeQuote();
    displayCurrentLifePage(quotes, currentPage);
  })
  .catch(err => console.error('Error loading JSON:', err));

// ===== RANDOM QUOTE =====
function showRandomLifeQuote() {
  if (!quotes.length) return;
  currentQuoteIndex = Math.floor(Math.random() * quotes.length);
  const q = quotes[currentQuoteIndex];
  quoteText.textContent = `"${q.quote}" — ${q.author}`;
}

// ===== DISPLAY CURRENT PAGE (Hustle-style) =====
function displayCurrentLifePage(list, page = 1) {
  displayItemsWithAds({
    items: list,
    grid: lifeGrid,
    page: page,
    renderCard: (q) => {
      const card = document.createElement('div');
      card.className = 'card life-card';
      card.innerHTML = `
        <div class="card-content">
          <p class="quote-text">${q.quote}</p>
          <p class="quote-author">– ${q.author}</p>
          <div class="card-buttons">
            <button onclick="listenCard('${escapeQuotes(q.quote)}','${escapeQuotes(q.author)}')">🗣️ Listen</button>
            <button onclick="shareCard(this)">📤 Share</button>
            <button onclick="downloadTip(this, 'life-quote.png')">💾 Download</button>
          </div>
        </div>
      `;
      return card;
    }
  });
}

// ===== LISTEN =====
function listenCard(text, author) {
  const msg = new SpeechSynthesisUtterance(`${text}. By ${author}`);
  speechSynthesis.speak(msg);
}

// ===== SEARCH =====
searchInput?.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase().trim();
  currentPage = 1;
  
  if (!query) {
    displayCurrentLifePage(quotes, currentPage);
    noResults.style.display = 'none';
    return;
  }
  
  const filtered = quotes.filter(q =>
    q.quote.toLowerCase().includes(query) ||
    q.author.toLowerCase().includes(query) ||
    (q.category && q.category.toLowerCase().includes(query))
  );
  
  if (filtered.length) {
    displayCurrentLifePage(filtered, 1);
    noResults.style.display = 'none';
  } else {
    lifeGrid.innerHTML = '';
    noResults.style.display = 'block';
  }
});

// ===== GENERATE RANDOM QUOTE =====
generateBtn?.addEventListener('click', showRandomLifeQuote);

// ===== SHARE MODAL =====
function shareCard(btn, filename = 'life-quote.png') {
  const card = btn.closest('.card');
  const buttons = card.querySelector('.card-buttons');
  buttons.style.display = 'none';
  
  const footer = addFooter(card);
  
  html2canvas(card, { scale: 8, useCORS: true }).then(canvas => {
    canvas.toBlob(blob => {
      const file = new File([blob], filename, { type: 'image/png' });
      
      if (navigator.canShare?.({ files: [file] })) {
        navigator.share({
          files: [file],
          title: 'Zawal Facts Hub',
          text: 'Life Quote from Zawal Facts Hub'
        });
      } else {
        openShareModal(`"${card.querySelector('.quote-text').textContent}" — ${card.querySelector('.quote-author').textContent}`);
      }
      
      buttons.style.display = 'flex';
      footer.remove();
    });
  });
}

function openShareModal(quote) {
  const encoded = encodeURIComponent(quote + " - Zawal Facts Hub");
  
  shareLinksContainer.innerHTML = `
    <a href="https://api.whatsapp.com/send?text=${encoded}" target="_blank" class="share-icon">📱 WhatsApp</a>
    <a href="https://www.facebook.com/sharer/sharer.php?u=${encoded}" target="_blank" class="share-icon">📘 Facebook</a>
    <a href="https://twitter.com/intent/tweet?text=${encoded}" target="_blank" class="share-icon">🐦 X</a>
    <a onclick="alert('Instagram/TikTok sharing requires mobile app');return false;" class="share-icon">📸 Instagram/TikTok</a>
    <a href="https://t.me/share/url?url=${encoded}&text=${encoded}" target="_blank" class="share-icon">✈ Telegram</a>
    <a href="https://www.pinterest.com/pin/create/button/?url=${encoded}&description=${encoded}" target="_blank" class="share-icon">📌 Pinterest</a>
    <a onclick="alert('Snapchat requires the mobile app');return false;" class="share-icon">👻 Snapchat</a>
  `;
  
  shareModal.style.display = 'flex';
  shareModal.style.justifyContent = 'center';
  shareModal.style.alignItems = 'center';
}

function closeShareModal() {
  shareModal.style.display = 'none';
}

// ===== DOWNLOAD =====
function downloadTip(btn, filename = 'life-quote.png') {
  const card = btn.closest('.card');
  const buttons = card.querySelector('.card-buttons');
  buttons.style.display = 'none';
  
  const footer = addFooter(card);
  
  setTimeout(() => {
    html2canvas(card, { scale: 8, useCORS: true }).then(canvas => {
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL();
      link.click();
      
      buttons.style.display = 'flex';
      footer.remove();
    });
  }, 150);
}

// ===== ESCAPE QUOTES =====
function escapeQuotes(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
hamburger?.addEventListener('click', () => navMenu?.classList.toggle('open'));