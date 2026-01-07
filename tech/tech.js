let tips = [];
let currentTip = null;

// ================= PAGE CATEGORY =================
const pageCategory = document.body.dataset.category || 'gadgets';

// ================= DOM ELEMENTS =================
const tipText = document.querySelector('.tip-text');
const generateBtn = document.querySelector('.generate-tip');
const grid = document.querySelector('#tips-grid');
const searchInput = document.querySelector('.search-input');
const noResults = document.querySelector('.no-results');

let tipsPerPage = 15;
let currentPage = 1;

// ================= LOAD JSON =================
fetch(`data/${pageCategory}.json`)
  .then(res => res.json())
  .then(data => {
    tips = data;
    showRandomTip();
    displayTips(tips, 1);
  })
  .catch(err => console.error('Failed to load tips:', err));

// ================= RANDOM TIP =================
function showRandomTip() {
  if (!tips.length || !tipText) return;
  currentTip = tips[Math.floor(Math.random() * tips.length)];
  tipText.textContent = currentTip.short;
}

// ================= DISPLAY TIPS =================
function displayTips(list, page = 1) {
  if (!grid) return;
  if (page === 1) grid.innerHTML = '';
  
  const start = (page - 1) * tipsPerPage;
  const end = start + tipsPerPage;
  
  list.slice(start, end).forEach((t, index) => {
    const globalIndex = start + index;
    
    const card = document.createElement('div');
    card.className = 'card tech-card';
    card.innerHTML = `
      <div class="card-content">
        <h3>Tip ${globalIndex + 1}</h3>
        <p class="tech-text tech-short">${t.short}</p>
        <p class="tech-text">${t.long}</p>
        <div class="card-buttons">
          <button onclick="listenCard(this)">🗣️ Listen</button>
          <button onclick="shareCard(this)">📤 Share</button>
          <button onclick="downloadTip(this)">💾 Download</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
    
    // Insert Ad every 15 cards
    if ((globalIndex + 1) % 15 === 0) {
      const ad = document.createElement('div');
      ad.className = 'ad-slot';
      ad.style.cssText = 'margin:20px 0;text-align:center;';
      ad.innerHTML = '<!-- Adsense -->';
      grid.appendChild(ad);
    }
  });
  
  if (end < list.length) {
    const loadMore = document.createElement('button');
    loadMore.textContent = 'Load More';
    loadMore.className = 'load-more';
    loadMore.onclick = () => {
      currentPage++;
      displayTips(list, currentPage);
      loadMore.remove();
    };
    grid.appendChild(loadMore);
  }
}

// ================= LISTEN =================
function listenCard(btn) {
  const card = btn.closest('.card');
  const text = [...card.querySelectorAll('.tech-text')]
    .map(p => p.textContent)
    .join('. ');
  speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

// ================= FOOTER CREATOR =================
function addFooter(card) {
  const footer = document.createElement('div');
  footer.textContent = 'Zawal Facts Hub';
  footer.style.cssText = `
    margin-top:15px;
    font-size:1.1rem;
    font-weight:700;
    color:#F5F5F5;
    background:#1C2B2D;
    padding:8px 12px;
    border-radius:8px;
    text-align:center;
  `;
  card.querySelector('.card-content').appendChild(footer);
  return footer;
}

// ================= DOWNLOAD =================
function downloadTip(btn) {
  const card = btn.closest('.card');
  const buttons = card.querySelector('.card-buttons');
  buttons.style.display = 'none';
  
  const footer = addFooter(card);
  
  setTimeout(() => {
    html2canvas(card, { scale: 18, useCORS: true }).then(canvas => {
      const link = document.createElement('a');
      link.download = `${pageCategory}-tip.png`;
      link.href = canvas.toDataURL();
      link.click();
      buttons.style.display = 'flex';
      footer.remove();
    });
  }, 150);
}

// ================= SHARE =================
function shareCard(btn) {
  const card = btn.closest('.card');
  const buttons = card.querySelector('.card-buttons');
  buttons.style.display = 'none';
  
  const footer = addFooter(card);
  
  html2canvas(card, { scale: 8, useCORS: true }).then(canvas => {
    canvas.toBlob(blob => {
      const file = new File([blob], `${pageCategory}-tip.png`, { type: 'image/png' });
      
      if (navigator.canShare?.({ files: [file] })) {
        navigator.share({
          files: [file],
          title: 'Tip',
          text: `Tip from Zawal Facts Hub (${pageCategory})`
        });
      } else {
        alert('Sharing not supported on this device.');
      }
      
      buttons.style.display = 'flex';
      footer.remove();
    });
  });
}

// ================= SEARCH =================
function searchTips() {
  if (!searchInput) return;
  
  const q = searchInput.value.toLowerCase().trim();
  const filtered = tips.filter(t =>
    t.short.toLowerCase().includes(q) ||
    t.long.toLowerCase().includes(q)
  );
  
  currentPage = 1;
  grid.innerHTML = '';
  
  if (filtered.length) {
    displayTips(filtered, 1);
    if (noResults) noResults.style.display = 'none';
  } else {
    if (noResults) noResults.style.display = 'block';
  }
}

// ================= EVENTS =================
generateBtn?.addEventListener('click', showRandomTip);
searchInput?.addEventListener('input', searchTips);

// ================= HAMBURGER MENU =================
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger?.addEventListener('click', () => {
  nav?.classList.toggle('open');
});