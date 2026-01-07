let tips = [];
let currentTip = null;

const tipText = document.getElementById('sleep-tip-text');
const generateBtn = document.getElementById('generate-sleep-tip');
const grid = document.getElementById('sleep-tips-grid');
const searchInput = document.getElementById('sleep-search-input');

let tipsPerPage = 15; // number of cards to show per batch
let currentPage = 1;

// ----------------- LOAD JSON -----------------
fetch('data/sleep.json')
  .then(res => res.json())
  .then(data => {
    tips = data;
    showRandomTip(); // short tonight's tip
    displayTips(tips, 1); // display first page
  });

// ----------------- RANDOM TIP -----------------
function showRandomTip() {
  if (!tips.length) return;
  currentTip = tips[Math.floor(Math.random() * tips.length)];
  tipText.textContent = currentTip.short; // stays short
}

// ----------------- DISPLAY TIPS WITH PAGINATION -----------------
function displayTips(list, page = 1) {
  if (page === 1) grid.innerHTML = ''; // clear only on first page
  
  const start = (page - 1) * tipsPerPage;
  const end = start + tipsPerPage;
  const pageTips = list.slice(start, end);
  
  pageTips.forEach((t, index) => {
    const globalIndex = start + index;
    const card = document.createElement('div');
    card.className = 'card health-card sleep-card';
    
    card.innerHTML = `
  <div class="card-content">
    <h3>Tip ${globalIndex + 1}</h3>

    <p class="sleep-text health-text health-short">
      ${t.short}
    </p>

    <p class="sleep-text health-text">
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
  
  // Add Load More button if more tips remain
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
      loadMoreBtn.remove(); // remove after click
    });
    grid.appendChild(loadMoreBtn);
  }
}

// ----------------- LISTEN (ENTIRE CARD) -----------------
function listenCard(btn) {
  const card = btn.closest('.card.sleep-card');
  const textElements = card.querySelectorAll('.sleep-text');
  let fullText = '';
  textElements.forEach(p => {
    fullText += p.textContent + '. ';
  });
  speechSynthesis.speak(new SpeechSynthesisUtterance(fullText));
}

// ----------------- SHARE -----------------
function shareTip(text) {
  navigator.share?.({ text }) || alert(text);
}

// ----------------- DOWNLOAD -----------------
function downloadTip(btn) {
  const card = btn.closest('.card.sleep-card');
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
      link.download = 'sleep-tip.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      buttons.style.display = 'flex';
      footer.remove();
    }).catch(err => {
      console.error('html2canvas error:', err);
      buttons.style.display = 'flex';
      footer.remove();
    });
  }, 150);
}

// ----------------- SEARCH -----------------
function searchSleepTips() {
  const query = searchInput.value.toLowerCase().trim();
  const filtered = tips.filter(t =>
    t.short.toLowerCase().includes(query) || t.long.toLowerCase().includes(query)
  );
  
  if (filtered.length) {
    currentPage = 1; // reset pagination
    displayTips(filtered, currentPage);
    document.getElementById('sleep-no-results').style.display = 'none';
  } else {
    grid.innerHTML = '';
    document.getElementById('sleep-no-results').style.display = 'block';
  }
}

// ----------------- EVENT LISTENERS -----------------
searchInput.addEventListener('input', searchSleepTips);
searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') searchSleepTips(); });
generateBtn.addEventListener('click', showRandomTip);
document.getElementById('hamburger')
  .addEventListener('click', () => document.getElementById('nav-menu').classList.toggle('open'));
  // ----------------- SHARE AS CARD IMAGE -----------------
function shareCard(btn) {
  const card = btn.closest('.card.sleep-card');
  
  // Temporarily hide buttons to make the card clean
  const buttons = card.querySelector('.card-buttons');
  buttons.style.display = 'none';
  
  // Optional: add footer like download
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
      const file = new File([blob], 'sleep-tip.png', { type: 'image/png' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: 'Sleep Tip',
          text: 'Check out this sleep tip from Zawal Facts Hub!'
        }).catch(err => console.error('Share failed:', err));
      } else {
        alert('Sharing image is not supported on this device.');
      }
      
      buttons.style.display = 'flex';
      footer.remove();
    });
  }).catch(err => {
    console.error('html2canvas error:', err);
    buttons.style.display = 'flex';
    footer.remove();
  });
}