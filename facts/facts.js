// ===== Hamburger Menu Toggle =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

// ===== Fact of the Day Generator =====
const factText = document.getElementById('fact-text');
const generateBtn = document.getElementById('generate-fact');

// Example facts (you will later replace with JSON 3000+ facts)
const facts = [
  "Honey never spoils.",
  "Octopuses have three hearts.",
  "Jellyfish have existed for over 500 million years.",
  "Wombats have cube-shaped poop.",
  "Penguins can drink seawater.",
  "Sea otters hold hands while sleeping.",
  "Bananas are berries, but strawberries aren't.",
  "The Moon is moving away from Earth 1.5 inches per year.",
  "Lightning strikes the Earth 100 times every second.",
  "There are more planets than stars in our galaxy.",
  "The Great Wall of China is visible from space only under certain conditions.",
  "Eiffel Tower can be 15 cm taller during hot days.",
  "The human brain has around 86 billion neurons.",
  "Your stomach gets a new lining every 3–4 days."
];

function showFact() {
  const randomIndex = Math.floor(Math.random() * facts.length);
  factText.textContent = facts[randomIndex];
}

// Initialize Fact of the Day
showFact();

// Generate Random Fact on Button Click
generateBtn.addEventListener('click', showFact);

// ===== Search Posts / Categories =====
function searchPosts() {
  const input = document.getElementById('search-input').value.toLowerCase();
  const cards = document.querySelectorAll('.card');
  let anyVisible = false;
  
  cards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const text = card.querySelector('p').textContent.toLowerCase();
    if (title.includes(input) || text.includes(input)) {
      card.style.display = 'block';
      anyVisible = true;
    } else {
      card.style.display = 'none';
    }
  });
  
  document.getElementById('no-results').style.display = anyVisible ? 'none' : 'block';
}

// ===== Newsletter Subscription =====
function subscribe(event) {
  event.preventDefault();
  const emailInput = document.getElementById('subscriber-email');
  const email = emailInput.value.trim();
  
  if (email) {
    alert(`Thank you! ${email} has been subscribed.`);
    emailInput.value = '';
  } else {
    alert("Please enter a valid email address.");
  }
}

// ===== Optional: Initialize saved state for future features =====
document.addEventListener('DOMContentLoaded', () => {
  // Future: Load saved facts or user preferences here
});
