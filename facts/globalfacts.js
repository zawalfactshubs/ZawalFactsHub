const MAX_VISIBLE_FACTS = 100;

// ========================
// GLOBAL FACTS ENGINE (ALL-IN-ONE)
// ========================

let facts = [];
let currentPage = 1;
const PER_PAGE = 15;

// ===== CONFIG =====
const {
  jsonPath,
  pageCategory,
  gridId,
  factTextId,
  generateBtnId,
  searchInputId,
  noResultsId,
  enableDownloadShare
} = window.FACTS_CONFIG;

// ===== DOM =====
const grid = document.getElementById(gridId);
const factText = document.getElementById(factTextId);
const generateBtn = document.getElementById(generateBtnId);
const searchInput = document.getElementById(searchInputId);
const noResults = document.getElementById(noResultsId);

// ========================
// LOAD JSON
// ========================
fetch(jsonPath)
  .then(res => res.json())
  .then(data => {
    facts = data.slice(0, MAX_VISIBLE_FACTS); // 🔒 limit facts safely
    showRandomFact();
    displayFacts(facts, 1);
  })
  .catch(err => console.error("JSON load error:", err));

// ========================
// RANDOM FACT
// ========================
function showRandomFact() {
  if (!facts.length) return;
  const fact = facts[Math.floor(Math.random() * facts.length)];
  factText.textContent = fact.fact;
}

// ========================
// DISPLAY FACTS
// ========================
function displayFacts(list, page) {
  if (page === 1) grid.innerHTML = '';
  
  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const slice = list.slice(start, end);
  
  slice.forEach((fact, index) => {
    const globalIndex = start + index;
    const safeText = fact.fact.replace(/'/g, "\\'");
    
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginBottom = '20px';
    
    card.innerHTML = `
      <img src="${fact.image}" style="width:100%;border-radius:10px;">
      <div class="card-content" style="padding:10px;">
        <span class="did-you-know">Did you know?</span>
        <p>${fact.fact.replace("Did you know?", "")}</p>

        <div class="card-buttons" style="display:flex;gap:5px;margin-top:8px;">
          <button onclick="listenFact('${safeText}')">🗣️ Listen</button>
          ${enableDownloadShare ? `
            <button onclick="shareCard(this)">📤 Share</button>
            <button onclick="downloadTip(this)">💾 Download</button>
          ` : ``}
        </div>
      </div>
    `;
    
    styleButtons(card);
    grid.appendChild(card);
    
    // ===== ADS EVERY 15 =====
    if ((globalIndex + 1) % 15 === 0) {
      const ad = document.createElement('div');
      ad.className = 'ad-slot';
      ad.style.cssText = 'margin:20px 0;text-align:center;';
      ad.innerHTML = '<!-- Adsense -->';
      grid.appendChild(ad);
    }
  });
  
  // ===== LOAD MORE =====
  if (end < list.length) {
    const loadMore = document.createElement('button');
    loadMore.textContent = 'Load More';
    styleLoadMore(loadMore);
    
    loadMore.onclick = () => {
      currentPage++;
      displayFacts(list, currentPage);
      loadMore.remove();
    };
    
    grid.appendChild(loadMore);
  }
}

// ========================
// STYLES
// ========================
function styleButtons(card) {
  card.querySelectorAll('button').forEach(btn => {
    btn.style.cssText = `
      flex:1;
      padding:8px;
      background:#CD7F32;
      color:#1C2B2D;
      border:none;
      border-radius:8px;
      font-weight:700;
      cursor:pointer;
    `;
  });
}

function styleLoadMore(btn) {
  btn.style.cssText = `
    display:block;
    margin:20px auto;
    padding:10px 20px;
    background:#CD7F32;
    color:#1C2B2D;
    border:none;
    border-radius:8px;
    font-weight:700;
    cursor:pointer;
    font-size:1rem;
  `;
}

// ========================
// LISTEN (TTS)
// ========================
window.listenFact = function(text) {
  const msg = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(msg);
};

// ========================
// SEARCH
// ========================
searchInput.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase().trim();
  
  if (!q) {
    currentPage = 1;
    displayFacts(facts, 1);
    noResults.style.display = 'none';
    return;
  }
  
  const filtered = facts.filter(f =>
    f.fact.toLowerCase().includes(q)
  );
  
  currentPage = 1;
  displayFacts(filtered, 1);
  noResults.style.display = filtered.length ? 'none' : 'block';
});

// ========================
// EVENTS
// ========================
generateBtn.addEventListener('click', showRandomFact);

// ========================
// SHARE + DOWNLOAD
// ========================
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

window.shareCard = function(btn) {
  if (!enableDownloadShare) return;
  
  const card = btn.closest('.card');
  const buttons = card.querySelector('.card-buttons');
  buttons.style.display = 'none';
  
  const footer = addFooter(card);
  
  html2canvas(card, { scale: 8, useCORS: true }).then(canvas => {
    canvas.toBlob(blob => {
      const file = new File([blob], `${pageCategory}-fact.png`, {
        type: 'image/png'
      });
      
      if (navigator.canShare?.({ files: [file] })) {
        navigator.share({
          files: [file],
          title: 'Zawal Facts Hub',
          text: pageCategory
        });
      }
      
      buttons.style.display = 'flex';
      footer.remove();
    });
  });
};

window.downloadTip = function(btn) {
  if (!enableDownloadShare) return;
  
  const card = btn.closest('.card');
  const buttons = card.querySelector('.card-buttons');
  buttons.style.display = 'none';
  
  const footer = addFooter(card);
  
  html2canvas(card, { scale: 18, useCORS: true }).then(canvas => {
    const a = document.createElement('a');
    a.download = `${pageCategory}-fact.png`;
    a.href = canvas.toDataURL();
    a.click();
    
    buttons.style.display = 'flex';
    footer.remove();
  });
};