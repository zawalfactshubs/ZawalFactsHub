// ========================
// Animal Facts JS
// ========================

let facts = [];
let currentFactIndex = 0;

// ===== DOM Elements =====
const factText = document.getElementById('fact-text');
const generateBtn = document.getElementById('generate-fact');
const animalGrid = document.getElementById('animal-facts-grid');
const shareModal = document.getElementById('share-modal');
const shareLinksContainer = document.getElementById('share-links');
const searchInput = document.getElementById('search-input');
const noResults = document.getElementById('no-results');

// ===== Load JSON =====
fetch('data/animals.json')
  .then(res => res.json())
  .then(data => {
    facts = data;
    showRandomFact();
    displayFacts(facts);
  })
  .catch(err => console.error('Error loading JSON:', err));

// ===== Random Fact =====
function showRandomFact() {
  if (!facts.length) return;
  currentFactIndex = Math.floor(Math.random() * facts.length);
  const fact = facts[currentFactIndex];
  factText.textContent = fact.fact;
}

// ===== Display Facts Grid =====
function displayFacts(factsToShow) {
  animalGrid.innerHTML = '';
  if (!factsToShow.length) return;
  
  factsToShow.forEach(fact => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginBottom = '20px';
    
    // ✅ SAFE TEXT
    const safeText = fact.fact.replace(/'/g, "\\'");
    
    card.innerHTML = `
      <img src="${fact.image}" alt="${fact.fact}" style="width:100%;border-radius:10px;">
      <div class="card-content" style="padding:10px;">
        <span class="did-you-know">Did you know?</span>
        <p>${fact.fact.replace("Did you know?","")}</p>
        <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:5px;">
          <button
            style="flex:1;padding:8px;background:#CD7F32;color:#F5F5F5;border:none;border-radius:8px;cursor:pointer;font-weight:700;"
            onclick="listenFact('${safeText}')">
            🗣️ Listen
          </button>

          <button
            style="flex:1;padding:8px;background:#CD7F32;color:#F5F5F5;border:none;border-radius:8px;cursor:pointer;font-weight:700;"
            onclick="event.stopPropagation(); shareCard(this)">
            📤 Share
          </button>

          <button
            style="flex:1;padding:8px;background:#CD7F32;color:#F5F5F5;border:none;border-radius:8px;cursor:pointer;font-weight:700;"
            onclick="downloadCard(this)">
            💾 Download
          </button>
        </div>
      </div>
    `;
    animalGrid.appendChild(card);
  });
}

// ===== Listen to Fact =====
function listenFact(text) {
  const msg = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(msg);
}

// ===== Native Share (WORKING) =====
window.nativeShare = function(text) {
  if (navigator.share) {
    navigator.share({
      title: "Zawal Facts Hub",
      text: text,
      url: location.href
    }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text + " — " + location.href)
      .then(() => alert("Link copied"));
  } else {
    alert(text);
  }
};

// ===== Share Modal (KEPT, NOT DELETED) =====
function openShareModal(fact) {
  const encodedFact = encodeURIComponent(fact + " - Zawal Facts Hub");
  shareLinksContainer.innerHTML = `
    <a href="https://api.whatsapp.com/send?text=${encodedFact}" target="_blank" class="share-icon">📱 WhatsApp</a>
    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedFact}" target="_blank" class="share-icon">📘 Facebook</a>
    <a href="https://twitter.com/intent/tweet?text=${encodedFact}" target="_blank" class="share-icon">🐦 X</a>
    <a href="#" onclick="alert('Instagram/TikTok sharing requires app');return false;" class="share-icon">📸 Instagram / TikTok</a>
    <a href="https://t.me/share/url?url=${encodedFact}&text=${encodedFact}" target="_blank" class="share-icon">✈ Telegram</a>
    <a href="https://www.pinterest.com/pin/create/button/?url=${encodedFact}&description=${encodedFact}" target="_blank" class="share-icon">📌 Pinterest</a>
    <a href="#" onclick="alert('Snapchat sharing requires app');return false;" class="share-icon">👻 Snapchat</a>
  `;
  shareModal.style.display = 'flex';
  shareModal.style.justifyContent = 'center';
  shareModal.style.alignItems = 'center';
}

function closeShareModal() {
  shareModal.style.display = 'none';
}

// ===== Download Card =====
function downloadCard(btn) {
  const card = btn.closest('.card');
  const buttons = card.querySelector('div[style*="display:flex"]');
  buttons.style.display = 'none';
  
  const footer = document.createElement('div');
  footer.textContent = 'Zawal Facts Hub';
  footer.style.cssText = `
    margin-top: 15px;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--light-text);
    background-color: var(--dark-bg);
    padding: 8px 12px;
    border-radius: 8px;
    text-align: center;
    width: 100%;
    display: block;
  `;
  card.querySelector('.card-content').appendChild(footer);
  
  setTimeout(() => {
    // Ultra-high-res for download
    html2canvas(card, { scale: 16, useCORS: true }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'animal-fact.png';
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

// ===== Share Card as Image =====
function shareCard(btn) {
  const card = btn.closest('.card');
  const buttons = card.querySelector('div[style*="display:flex"]');
  buttons.style.display = 'none';
  
  const footer = document.createElement('div');
  footer.textContent = 'Zawal Facts Hub';
  footer.style.cssText = `
    margin-top: 15px;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--light-text);
    background-color: var(--dark-bg);
    padding: 8px 12px;
    border-radius: 8px;
    text-align: center;
    width: 100%;
    display: block;
  `;
  card.querySelector('.card-content').appendChild(footer);
  
  setTimeout(() => {
    // High enough for sharing, but mobile safe
    html2canvas(card, { scale: 8, useCORS: true }).then(canvas => {
      canvas.toBlob(blob => {
        const file = new File([blob], 'animal-fact.png', { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({
            files: [file],
            title: 'Animal Fact',
            text: 'Check out this animal fact from Zawal Facts Hub!'
          }).catch(err => console.error('Share failed:', err));
        } else {
          const link = document.createElement('a');
          link.download = 'animal-fact.png';
          link.href = URL.createObjectURL(file);
          link.click();
        }
        
        buttons.style.display = 'flex';
        footer.remove();
      });
    }).catch(err => {
      console.error('html2canvas error:', err);
      buttons.style.display = 'flex';
      footer.remove();
    });
  }, 150);
}

// ===== Wrap Text =====
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let lines = [];
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  
  lines.push(line);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
}

// ===== Search =====
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase().trim();
  
  if (!query) {
    displayFacts(facts);
    noResults.style.display = 'none';
    return;
  }
  
  const filtered = facts.filter(f =>
    f.fact.toLowerCase().includes(query) ||
    f.category.toLowerCase().includes(query)
  );
  
  displayFacts(filtered);
  noResults.style.display = filtered.length === 0 ? 'block' : 'none';
});

searchInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    if (!searchInput.value.trim()) displayFacts(facts);
  }
});

// ===== Newsletter =====
function subscribe(event) {
  event.preventDefault();
  const email = document.getElementById('subscriber-email').value;
  if (email) alert(`Thank you! ${email} has been subscribed.`);
  document.getElementById('subscriber-email').value = '';
}

// ===== Event Listeners =====
generateBtn.addEventListener('click', showRandomFact);

// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});