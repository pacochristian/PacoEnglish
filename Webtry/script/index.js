/* =========================================
   1. VARIABLES & STATE
   ========================================= */
let points = parseInt(localStorage.getItem("pacoPoints")) || 0;
let masteredWords = JSON.parse(localStorage.getItem("masteredWords")) || [];
let streak = localStorage.getItem("pacoStreak") || 0;
let lastDate = localStorage.getItem("pacoLastDate") || "";
let currentQuizWord = "";
let userLevel = "Beginner";

/* =========================================
   2. DOM ELEMENTS
   ========================================= */
const pacoBubble = document.getElementById("paco-bubble");
const pointsDisplay = document.getElementById("points");
const streakDisplay = document.getElementById("streak-count");
const englishWord = document.getElementById("english-word");
const definition = document.getElementById("definition");
const flashcard = document.getElementById("flashcard-container");
const wordGallery = document.getElementById("word-gallery");
const progressFill = document.getElementById("progress-fill");
const currentLevelText = document.getElementById("current-level");
const pointsToNextText = document.getElementById("points-to-next");

/* =========================================
   3. CORE FUNCTIONS (Logic)
   ========================================= */

// Fetch word from Internet
async function fetchRandomWord() {
  pacoBubble.innerText = "Paco is thinking... 🧠";
  try {
    const wordResponse = await fetch(
      "https://random-word-api.herokuapp.com/word?number=1"
    );
    const wordData = await wordResponse.json();
    const word = wordData[0];

    const dictResponse = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if (!dictResponse.ok) return fetchRandomWord(); // Retry if no definition

    const dictData = await dictResponse.json();
    return {
      word: dictData[0].word,
      definition: dictData[0].meanings[0].definitions[0].definition,
    };
  } catch (error) {
    pacoBubble.innerText = "Oops! Check your internet!";
    return null;
  }
}

function pacoSpeaks(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.pitch = 1.1;
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

function updateProgressBar() {
  let goal = 100;
  if (points >= 100) goal = 300;
  if (points >= 300) goal = 1000;

  const percentage = Math.min((points / goal) * 100, 100);
  progressFill.style.width = `${percentage}%`;
  pointsToNextText.innerText = goal - points;
}

function saveProgress() {
  localStorage.setItem("pacoPoints", points);
  localStorage.setItem("masteredWords", JSON.stringify(masteredWords));
}

/* =========================================
   4. EVENT LISTENERS
   ========================================= */

// NEW WORD BUTTON
document.getElementById("lesson-btn").addEventListener("click", async () => {
  document.getElementById("quiz-container").classList.add("hidden");
  const onlineWord = await fetchRandomWord();
  if (onlineWord) {
    englishWord.innerText = onlineWord.word;
    definition.innerText = onlineWord.definition;
    flashcard.classList.remove("hidden");
    pacoBubble.innerText = "Look what I found online!";
    setTimeout(() => pacoSpeaks(onlineWord.word), 500);
  }
});

// LEARNED IT BUTTON
document.getElementById("complete-btn").addEventListener("click", () => {
  points += 10;
  pointsDisplay.innerText = points;
  const word = englishWord.innerText;
  if (!masteredWords.includes(word)) {
    masteredWords.push(word);
    renderGallery();
  }
  flashcard.classList.add("hidden");
  pacoBubble.innerText = "Great job! +10 Taco Points!";
  saveProgress();
  updateProgressBar();
});

// QUIZ MODE BUTTON
document.getElementById("quiz-mode-btn").addEventListener("click", async () => {
  flashcard.classList.add("hidden");
  const onlineWord = await fetchRandomWord();
  if (onlineWord) {
    currentQuizWord = onlineWord.word;
    document.getElementById("quiz-definition").innerText =
      onlineWord.definition;
    document.getElementById("quiz-container").classList.remove("hidden");
    document.getElementById("quiz-feedback").innerText = "";
    document.getElementById("quiz-input").value = "";
    pacoBubble.innerText = "Can you guess this word?";
  }
});

// SUBMIT QUIZ
document.getElementById("submit-quiz-btn").addEventListener("click", () => {
  const userGuess = document
    .getElementById("quiz-input")
    .value.trim()
    .toLowerCase();
  if (userGuess === currentQuizWord.toLowerCase()) {
    points += 20;
    pointsDisplay.innerText = points;
    pacoBubble.innerText = "Correct! +20 Taco Points!";
    document.getElementById("quiz-feedback").innerText = "Success! 🎉";
    if (!masteredWords.includes(currentQuizWord))
      masteredWords.push(currentQuizWord);
    renderGallery();
    saveProgress();
    updateProgressBar();
  } else {
    document.getElementById(
      "quiz-feedback"
    ).innerText = `Wrong! It was ${currentQuizWord}`;
  }
});

// LOGIN LOGIC
document.getElementById("login-submit").addEventListener("click", () => {
  const name = document.getElementById("username-input").value;
  if (name) {
    pacoBubble.innerText = `Nice to meet you, ${name}!`;
    document.getElementById("login-modal").classList.add("hidden");
  }
});

// DARK MODE
document.getElementById("theme-toggle").addEventListener("click", () => {
  const theme =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "light"
      : "dark";
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("pacoTheme", theme);
});

// RESET
document.getElementById("reset-btn").addEventListener("click", () => {
  if (confirm("Reset everything?")) {
    localStorage.clear();
    window.location.reload();
  }
});

/* =========================================
   5. INITIALIZATION
   ========================================= */
function renderGallery() {
  wordGallery.innerHTML = masteredWords
    .map((w) => `<span class="learned-badge">✅ ${w}</span>`)
    .join("");
}

window.onload = () => {
  pointsDisplay.innerText = points;
  renderGallery();
  updateProgressBar();
  // Theme loading
  const savedTheme = localStorage.getItem("pacoTheme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
};
