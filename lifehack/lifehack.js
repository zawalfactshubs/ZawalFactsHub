let tips = [];
let currentTip = null;

// Detect page category from data attribute or URL
const pageCategory = document.body.dataset.category || 'gadgets'; // set <body data-category="gadgets">

// Generic DOM elements
const tipText = document.querySelector('.tip-text');
const generateBtn = document.querySelector('.generate-tip');
const grid = document.querySelector('#tips-grid');
const searchInput = document.querySelector('.search-input');

let tipsPerPage = 10;
let currentPage = 1;

// ----------------- LOAD JSON -----------------
fetch(`data/${pageCategory}.json`)
  .then(res => res.json())
  .then(data => {
    tips = data;
    showRandomTip();
    displayTips(tips, 1);
  });

// ----------------- RANDOM TIP -----------------
function showRandomTip() {
  if (!tips.length || !tipText) return;
  currentTip = tips[Math.floor(Math.random() * tips.length)];
  tipText.textContent = currentTip.short;
}

// ----------------- DISPLAY TIPS -----------------
function displayTips(list, page = 1) {
  if (!grid) return;
  if (page === 1) grid.innerHTML = '';
  
  const start = (page - 1) * tipsPerPage;
  const end = start + tipsPerPage;
  const pageTips = list.slice(start, end);
  
  pageTips.forEach((t, index) => {
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
    
    if ((globalIndex + 1) % 10 === 0) {
      const adDiv = document.createElement('div');
      adDiv.className = 'ad-slot';
      adDiv.style.margin = '20px 0';
      adDiv.style.textAlign = 'center';
      adDiv.innerHTML = '<!-- Adsense -->';
      grid.appendChild(adDiv);
    }
  });
  
  if (end < list.length) {
    const btn = document.createElement('button');
    btn.textContent = 'Load More';
    btn.className = 'load-more';
    btn.addEventListener('click', () => {
      currentPage++;
      displayTips(list, currentPage);
      btn.remove();
    });
    grid.appendChild(btn);
  }
}

// ----------------- LISTEN -----------------
function listenCard(btn) {
  const card = btn.closest('.card');
  const text = [...card.querySelectorAll('.tech-text')]
    .map(p => p.textContent)
    .join('. ');
  speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

// ----------------- DOWNLOAD -----------------
function downloadTip(btn) {
  const card = btn.closest('.card');
  const buttons = card.querySelector('.card-buttons');
  buttons.style.display = 'none';
  
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
    display:inline-block;
  `;
  
  card.querySelector('.card-content').appendChild(footer);
  
  setTimeout(() => {
    html2canvas(card, { scale: 18, useCORS: true }).then(canvas => {
      const link = document.createElement('a');
      link.download = `${pageCategory}-tip.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      buttons.style.display = 'flex';
      footer.remove();
    });
  }, 150);
}

// ----------------- SHARE IMAGE -----------------
function shareCard(btn) {
  const card = btn.closest('.card');
  const buttons = card.querySelector('.card-buttons');
  buttons.style.display = 'none';
  
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
    display:inline-block;
  `;
  
  card.querySelector('.card-content').appendChild(footer);
  
  html2canvas(card, { scale: 8, useCORS: true }).then(canvas => {
    canvas.toBlob(blob => {
      const file = new File([blob], `${pageCategory}-tip.png`, { type: 'image/png' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: 'Tip',
          text: `Tip from Zawal Facts Hub (${pageCategory})`
        });
      } else {
        alert('Sharing not supported.');
      }
      
      buttons.style.display = 'flex';
      footer.remove();
    });
  });
}

// ----------------- SEARCH -----------------
function searchTips() {
  if (!searchInput) return;
  const q = searchInput.value.toLowerCase().trim();
  const filtered = tips.filter(t =>
    t.short.toLowerCase().includes(q) || t.long.toLowerCase().includes(q)
  );
  
  if (filtered.length) {
    currentPage = 1;
    displayTips(filtered, 1);
    document.querySelector('.no-results').style.display = 'none';
  } else {
    grid.innerHTML = '';
    document.querySelector('.no-results').style.display = 'block';
  }
}

// ----------------- EVENTS -----------------
if (generateBtn) generateBtn.addEventListener('click', showRandomTip);
if (searchInput) {
  searchInput.addEventListener('input', searchTips);
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') searchTips();
  });
}

const hamburger = document.getElementById('hamburger');
if (hamburger) {
  hamburger.addEventListener('click', () =>
    document.getElementById('nav-menu').classList.toggle('open')
  );
}