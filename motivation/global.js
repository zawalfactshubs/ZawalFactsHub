/* ================= GLOBAL CONFIG ================= */
const ADS_INTERVAL = 15; // Insert ad after every 15 cards
const ITEMS_PER_PAGE = 15; // Number of items per page

/* ================= INSERT ADS ================= */
function insertAd(grid) {
  const ad = document.createElement('div');
  ad.className = 'ad-slot';
  ad.style.cssText = `
    margin: 10px 0;
    min-height: 10px;
    background-color: #1C2B2D;  /* same as card background */
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  // Leave it blank (no text inside)
  grid.appendChild(ad);
}

/* ================= LOAD MORE ================= */
function createLoadMore(grid, callback) {
  const btn = document.createElement('button');
  btn.className = 'load-more';
  btn.textContent = 'Load More';
  
  btn.onclick = () => {
    btn.remove();
    callback();
  };
  
  grid.appendChild(btn);
}

/* ================= FOOTER ================= */
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

/* ================= DOWNLOAD ================= */
function downloadTip(btn, filename = 'zawal-tip.png') {
  const card = btn.closest('.card');
  const buttons = card.querySelector('.card-buttons');
  buttons.style.display = 'none';
  
  const footer = addFooter(card);
  
  setTimeout(() => {
    html2canvas(card, { scale: 18, useCORS: true }).then(canvas => {
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL();
      link.click();
      
      buttons.style.display = 'flex';
      footer.remove();
    });
  }, 150);
}

/* ================= SHARE ================= */
function shareCard(btn, filename = 'zawal-tip.png') {
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
          text: 'Daily Tip from Zawal Facts Hub'
        });
      } else {
        alert('Sharing not supported.');
      }
      
      buttons.style.display = 'flex';
      footer.remove();
    });
  });
}

/* ================= DISPLAY ITEMS WITH ADS & LOAD MORE ================= */
function displayItemsWithAds({
  items = [], // array of tips or quotes
  grid, // the grid container
  page = 1, // current page
  renderCard // callback to render each card
}) {
  if (!grid) return;
  if (page === 1) grid.innerHTML = '';
  
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  items.slice(start, end).forEach((item, index) => {
    const globalIndex = start + index;
    const card = renderCard(item, globalIndex);
    grid.appendChild(card);
    
    // Insert ad after every ADS_INTERVAL cards (no duplicates)
    if ((globalIndex + 1) % ADS_INTERVAL === 0 && globalIndex + 1 !== items.length) {
      insertAd(grid);
    }
  });
  
  // Load more button if there are more items
  if (end < items.length) {
    createLoadMore(grid, () => {
      displayItemsWithAds({ items, grid, page: page + 1, renderCard });
    });
  }
}

/* ================= LISTEN TO CARD TEXT ================= */
function listenCard(text, author) {
  const msg = new SpeechSynthesisUtterance(`${text}. By ${author}`);
  speechSynthesis.speak(msg);
}

/* ================= ESCAPE QUOTES FOR INLINE JS ================= */
function escapeQuotes(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}