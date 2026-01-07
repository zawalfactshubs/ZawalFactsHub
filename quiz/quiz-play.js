/* =========================
   STATE & ELEMENTS
========================= */

let quizData = {};
let currentCategory = "animal";
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
const questionPerSet = 10;
let currentSet = 0;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");

/* =========================
   DAILY LIMIT (5 SETS / DAY)
========================= */

const MAX_SETS_PER_DAY = 5;
const todayKey = "quizDate";
const setKey = "setsPlayed";

function checkDailyLimit() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem(todayKey);
  
  if (savedDate !== today) {
    localStorage.setItem(todayKey, today);
    localStorage.setItem(setKey, "0");
  }
  
  return parseInt(localStorage.getItem(setKey) || "0");
}

function increaseSetCount() {
  let count = checkDailyLimit();
  localStorage.setItem(setKey, count + 1);
}

/* =========================
   LOAD CATEGORY
========================= */

async function loadCategory(category, btn) {
  currentCategory = category;
  currentIndex = 0;
  currentSet = 0;
  score = 0;
  
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  if (btn) btn.classList.add("active");
  
  try {
    const response = await fetch(`quiz-data/${category}.json`);
    quizData[category] = await response.json();
  } catch (err) {
    questionEl.textContent = "Failed to load questions.";
    optionsEl.innerHTML = "";
    feedbackEl.textContent = "";
    return;
  }
  
  loadQuestion();
}

/* =========================
   LOAD QUESTION
========================= */

function loadQuestion() {
  clearInterval(timer);
  timeLeft = 15;
  
  const questions = quizData[currentCategory];
  if (!questions) return;
  
  const start = currentSet * questionPerSet;
  const end = Math.min(start + questionPerSet, questions.length);
  
  /* 🔒 DAILY LIMIT CHECK */
  if (currentIndex >= end) {
    
    increaseSetCount();
    const playedToday = checkDailyLimit();
    
    if (playedToday >= MAX_SETS_PER_DAY) {
      showLockScreen();
      return;
    }
    
    if (end < questions.length) {
      currentSet++;
      currentIndex = currentSet * questionPerSet;
      loadQuestion();
      return;
    } else {
      questionEl.textContent = `Quiz Finished! Final Score: ${score}/${questions.length}`;
      optionsEl.innerHTML = "";
      feedbackEl.textContent = "";
      return;
    }
  }
  
  const q = questions[currentIndex];
  questionEl.textContent = q.q;
  optionsEl.innerHTML = "";
  feedbackEl.textContent = "";
  
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => answer(i);
    optionsEl.appendChild(btn);
  });
  
  startTimer();
  updateFooter();
}

/* =========================
   ANSWER
========================= */

function answer(index) {
  clearInterval(timer);
  const correct = quizData[currentCategory][currentIndex].answer;
  const buttons = optionsEl.querySelectorAll("button");
  
  buttons.forEach((b, i) => {
    if (i === correct) b.style.background = "#2ecc71";
    if (i === index && i !== correct) b.style.background = "#e74c3c";
    b.disabled = true;
  });
  
  if (index === correct) {
    score++;
    feedbackEl.textContent = "Correct ✅";
  } else {
    feedbackEl.textContent = "Wrong ❌";
  }
  
  updateFooter();
}

/* =========================
   NEXT QUESTION
========================= */

function nextQuestion() {
  currentIndex++;
  loadQuestion();
}

/* =========================
   TIMER
========================= */

function startTimer() {
  timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      feedbackEl.textContent = "Time up ⏰";
      nextQuestion();
      return;
    }
    feedbackEl.textContent = `⏱ ${timeLeft}s`;
    timeLeft--;
  }, 1000);
}

/* =========================
   FOOTER
========================= */

function updateFooter() {
  let footer = document.getElementById("quiz-footer");
  if (!footer) {
    footer = document.createElement("div");
    footer.id = "quiz-footer";
    footer.style.textAlign = "center";
    footer.style.marginTop = "2rem";
    footer.style.color = "#CD7F32";
    document.querySelector(".quiz-box").appendChild(footer);
  }
  
  footer.innerHTML = `
    Score: ${score} | Set: ${currentSet + 1}/5
  `;
}

/* =========================
   LOCK SCREEN
========================= */

function showLockScreen() {
  questionEl.innerHTML = "Daily Limit Reached 🚫";
  optionsEl.innerHTML = `
    <p>You’ve completed today’s free quizzes.</p>
    <button onclick="goPremium()">Unlock Premium 🔓</button><br><br>
    <button onclick="support()">Support & Unlock 1 More Set ❤️</button>
  `;
  feedbackEl.textContent = "";
}

function goPremium() {
  window.location.href = "premium.html";
}

function support() {
  window.open("https://your-sponsor-link.com", "_blank");
  let count = checkDailyLimit();
  localStorage.setItem(setKey, count - 1);
  loadQuestion();
}

/* =========================
   AUTO LOAD
========================= */

loadCategory("animal");