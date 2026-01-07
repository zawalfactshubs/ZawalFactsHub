let tips = [];
let currentTip = null;

const tipText = document.getElementById('women-tip-text');
const generateBtn = document.getElementById('generate-women-tip');
const grid = document.getElementById('women-tips-grid');
const searchInput = document.getElementById('women-search-input');

let tipsPerPage = 15;
let currentPage = 1;

// ----------------- LOAD JSON -----------------
fetch('data/womens.json')
  .then(res => res.json())
  .then(data => {
    tips = data;
    showRandomTip();
    displayTips(tips, 1);
  });

// ----------------- RANDOM TIP -----------------
function showRandomTip() {
  if (!tips.length) return;
  currentTip = tips[Math.floor(Math.random() * tips.length)];
  tipText.textContent = currentTip.short;
}

// ----------------- DISPLAY TIPS -----------------
function displayTips(list, page = 1) {
  if (page === 1) grid.innerHTML = '';
  
  const start = (page - 1) * tipsPerPage;
  const end = start + tipsPerPage;
  const pageTips = list.slice(start, end);
  
  pageTips.forEach((t, index) => {
    const globalIndex = start + index;
    
    const card = document.createElement('div');
    card.className = 'card women-card health-card';
    
    card.innerHTML = `
      <div class="card-content">
        <h3>Tip ${globalIndex + 1}</h3>

        <p class="women-text health-text health-short">
          ${t.short}
        </p>

        <p class="women-text health-text">
          ${t.long}
        </p>

        <div class="card-buttons">
          <button onclick="listenCard(this)">🗣️ Listen</button>
          <button onclick="shareCard(this)">📤 Share</button>
          <button onclick="downloadTip(this)">💾 Download</button>
        </div>
      </div>
    `;
    
    grid.appendChild(card);
    
    // Insert ad every 10 cards
  if ((globalIndex + 1) % 15 === 0) {
    const adDiv = document.createElement('div');
    adDiv.className = 'ad-slot';
    adDiv.style.margin = '20px 0';
    adDiv.style.textAlign = 'center';
    adDiv.innerHTML = '<!-- Insert Google Adsense code here -->';
    grid.appendChild(adDiv);
  }
  });
  
  // ----------------- LOAD MORE -----------------
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
  const card = btn.closest('.women-card');
  const text = [...card.querySelectorAll('.health-text')]
    .map(p => p.textContent)
    .join('. ');
  
  speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

// ----------------- DOWNLOAD CARD -----------------
function downloadTip(btn) {
  const card = btn.closest('.women-card');
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
    html2canvas(card, { scale: 6, useCORS: true }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'women-health-tip.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      buttons.style.display = 'flex';
      footer.remove();
    });
  }, 150);
}

// ----------------- SHARE CARD IMAGE -----------------
function shareCard(btn) {
  const card = btn.closest('.women-card');
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
  
  html2canvas(card, { scale: 6, useCORS: true }).then(canvas => {
    canvas.toBlob(blob => {
      const file = new File([blob], 'women-health-tip.png', { type: 'image/png' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: 'Women’s Health Tip',
          text: 'Check out this women’s health tip from Zawal Facts Hub!'
        });
      } else {
        alert('Image sharing not supported on this device.');
      }
      
      buttons.style.display = 'flex';
      footer.remove();
    });
  });
}

// ----------------- SEARCH -----------------
function searchWomenTips() {
  const q = searchInput.value.toLowerCase().trim();
  
  const filtered = tips.filter(t =>
    t.short.toLowerCase().includes(q) ||
    t.long.toLowerCase().includes(q)
  );
  
  if (filtered.length) {
    currentPage = 1;
    displayTips(filtered, 1);
    document.getElementById('women-no-results').style.display = 'none';
  } else {
    grid.innerHTML = '';
    document.getElementById('women-no-results').style.display = 'block';
  }
}

// ----------------- EVENTS -----------------
generateBtn.addEventListener('click', showRandomTip);
searchInput.addEventListener('input', searchWomenTips);
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') searchWomenTips();
});

document.getElementById('hamburger')
  .addEventListener('click', () =>
    document.getElementById('nav-menu').classList.toggle('open')
  );