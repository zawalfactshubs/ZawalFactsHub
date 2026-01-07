// ========================
// Geography Facts JS
// ========================

let facts = [];
let currentFactIndex = 0;

// ===== DOM Elements =====
const factText = document.getElementById('geography-fact-text');
const generateBtn = document.getElementById('generate-geography-fact');
const geographyGrid = document.getElementById('geography-facts-grid');
const shareModal = document.getElementById('share-modal');
const shareLinksContainer = document.getElementById('share-links');
const searchInput = document.getElementById('geography-search-input');
const noResults = document.getElementById('geography-no-results');

// ===== Load JSON =====
fetch('data/geography.json')
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
  geographyGrid.innerHTML = '';
  if (!factsToShow.length) return;
  
  factsToShow.forEach(fact => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginBottom = '20px';
    
    // ✅ SAFE TEXT
    const safeText = fact.fact.replace(/'/g, "\\'");
    
    card.innerHTML = `
      <img src="images/${fact.image}" alt="${fact.fact}" style="width:100%;border-radius:10px;">
      <div class="card-content" style="padding:10px;">
        <span class="did-you-know">Did you know?</span>
        <p>${fact.fact.replace("Did you know?", "")}</p>

        <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:5px;">
          <button style="flex:1;padding:8px;background:#CD7F32;color:#F5F5F5;border:none;border-radius:8px;cursor:pointer;font-weight:700;"
                  onclick="listenFact('${safeText}')">
            🗣️ Listen
          </button>

          <button style="flex:1;padding:8px;background:#CD7F32;color:#F5F5F5;border:none;border-radius:8px;cursor:pointer;font-weight:700;"
                  onclick="event.stopPropagation(); nativeShare('${safeText}')">
            📤 Share
          </button>

          <button style="flex:1;padding:8px;background:#CD7F32;color:#F5F5F5;border:none;border-radius:8px;cursor:pointer;font-weight:700;"
                  onclick="downloadCard(this)">
            💾 Download
          </button>
        </div>
      </div>
    `;
    
    geographyGrid.appendChild(card);
  });
}

// ===== Listen to Fact =====
function listenFact(text) {
  const msg = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(msg);
}

// ===== Native Share =====
window.nativeShare = function(text) {
  if (navigator.share) {
    navigator.share({
      title: "Zawal Facts Hub",
      text: text,
      url: location.href
    }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text + " — " + location.href)
      .then(() => alert("Link copied"));
  } else {
    alert(text);
  }
};

// ===== Share Modal (kept, not used by button) =====
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
}

function closeShareModal() {
  shareModal.style.display = 'none';
}

// ===== Download Card =====
function downloadCard(btn) {
  const card = btn.closest('.card');
  const img = card.querySelector('img');
  const factTextValue = card.querySelector('p').innerText;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = img.src;
  
  image.onload = () => {
    canvas.width = 1200;
    canvas.height = 800;
    
    ctx.fillStyle = "#F5F5F5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const imgHeight = canvas.height * 0.6;
    ctx.drawImage(image, 0, 0, canvas.width, imgHeight);
    
    ctx.fillStyle = "#FFFFFF";
    ctx.globalAlpha = 0.9;
    ctx.fillRect(50, imgHeight + 30, canvas.width - 100, canvas.height - imgHeight - 80);
    ctx.globalAlpha = 1;
    
    ctx.fillStyle = "#CD7F32";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    wrapText(ctx, factTextValue, canvas.width / 2, imgHeight + 80, canvas.width - 120, 40);
    
    ctx.fillStyle = "#1C2B2D";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "right";
    ctx.fillText("© Zawal Facts Hub", canvas.width - 60, canvas.height - 30);
    
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'geography-fact.png';
    link.click();
  };
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

// ===== Event Listeners =====
generateBtn.addEventListener('click', showRandomFact);

// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});