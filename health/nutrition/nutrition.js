let tips = [];
let currentTip = null;

const tipText = document.getElementById('nutrition-tip-text');
const generateBtn = document.getElementById('generate-nutrition-tip');
const grid = document.getElementById('nutrition-tips-grid');
const searchInput = document.getElementById('nutrition-search-input');

let tipsPerPage = 15;
let currentPage = 1;

// ----------------- LOAD JSON -----------------
fetch('data/nutrition.json')
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
    card.className = 'card health-card nutrition-card';
    
    card.innerHTML = `
      <div class="card-content">
        <h3>Tip ${globalIndex + 1}</h3>

        <p class="nutrition-text health-text health-short">
          ${t.short}
        </p>

        <p class="nutrition-text health-text">
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
    
    if ((globalIndex + 1) % 15 === 0) {
      const adDiv = document.createElement('div');
      adDiv.className = 'ad-slot';
      adDiv.style.margin = '20px 0';
      adDiv.style.textAlign = 'center';
      adDiv.innerHTML = '<!-- Insert Google Adsense code here -->';
      grid.appendChild(adDiv);
    }
  });
  
  if (end < list.length) {
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.textContent = 'Load More';
    loadMoreBtn.style.cssText = `
      display:block;
      margin:20px auto;
      padding:10px 20px;
      background:#CD7F32;
      color:#1C2B2D;
      border:none;
      border-radius:8px;
      font-weight:700;
      cursor:pointer;
    `;
    
    loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      displayTips(list, currentPage);
      loadMoreBtn.remove();
    });
    
    grid.appendChild(loadMoreBtn);
  }
}

// ----------------- LISTEN -----------------
function listenCard(btn) {
  const card = btn.closest('.card.nutrition-card');
  const textElements = card.querySelectorAll('.nutrition-text');
  let fullText = '';
  textElements.forEach(p => fullText += p.textContent + '. ');
  speechSynthesis.speak(new SpeechSynthesisUtterance(fullText));
}

// ----------------- DOWNLOAD -----------------
function downloadTip(btn) {
  const card = btn.closest('.card.nutrition-card');
  const buttons = card.querySelector('.card-buttons');
  buttons.style.display = 'none';
  
  const footer = document.createElement('div');
  footer.textContent = 'Zawal Facts Hub';
  footer.style.cssText = `
    margin-top: 15px;
    font-size: 1.1rem;
    font-weight: 700;
    color: #F5F5F5;
    background-color: #1C2B2D;
    padding: 8px 12px;
    border-radius: 8px;
    text-align: center;
    display: inline-block;
  `;
  card.querySelector('.card-content').appendChild(footer);
  
  setTimeout(() => {
    html2canvas(card, { scale: 6, useCORS: true }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'nutrition-tip.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      buttons.style.display = 'flex';
      footer.remove();
    });
  }, 150);
}

// ----------------- SHARE AS IMAGE -----------------
function shareCard(btn) {
  const card = btn.closest('.card.nutrition-card');
  const buttons = card.querySelector('.card-buttons');
  buttons.style.display = 'none';
  
  const footer = document.createElement('div');
  footer.textContent = 'Zawal Facts Hub';
  footer.style.cssText = `
    margin-top: 15px;
    font-size: 1.1rem;
    font-weight: 700;
    color: #F5F5F5;
    background-color: #1C2B2D;
    padding: 8px 12px;
    border-radius: 8px;
    text-align: center;
    display: inline-block;
  `;
  card.querySelector('.card-content').appendChild(footer);
  
  html2canvas(card, { scale: 6, useCORS: true }).then(canvas => {
    canvas.toBlob(blob => {
      const file = new File([blob], 'nutrition-tip.png', { type: 'image/png' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: 'Nutrition Tip',
          text: 'Check out this nutrition tip from Zawal Facts Hub!'
        });
      }
      
      buttons.style.display = 'flex';
      footer.remove();
    });
  });
}

// ----------------- SEARCH -----------------
function searchNutritionTips() {
  const query = searchInput.value.toLowerCase().trim();
  const filtered = tips.filter(t =>
    t.short.toLowerCase().includes(query) ||
    t.long.toLowerCase().includes(query)
  );
  
  if (filtered.length) {
    currentPage = 1;
    displayTips(filtered, currentPage);
    document.getElementById('nutrition-no-results').style.display = 'none';
  } else {
    grid.innerHTML = '';
    document.getElementById('nutrition-no-results').style.display = 'block';
  }
}

// ----------------- EVENTS -----------------
searchInput.addEventListener('input', searchNutritionTips);
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') searchNutritionTips(); });
generateBtn.addEventListener('click', showRandomTip);

document.getElementById('hamburger')
  .addEventListener('click', () =>
    document.getElementById('nav-menu').classList.toggle('open')
  );