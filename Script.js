// ----------------------------------------------
// 1. TASK MANAGER MODULE (DOM manipulation, events, localStorage)
// ----------------------------------------------
let tasks = [];

// Load tasks from localStorage
function loadTasksFromStorage() {
  const stored = localStorage.getItem('mindfulTasks');
  if(stored) {
    tasks = JSON.parse(stored);
  } else {
    tasks = [];
  }
  renderTaskList();
}

function saveTasksToStorage() {
  localStorage.setItem('mindfulTasks', JSON.stringify(tasks));
}

function renderTaskList() {
  const container = document.getElementById('taskListContainer');
  if(!container) return;
  if(tasks.length === 0) {
    container.innerHTML = `<div style="text-align:center; color:#64748b; padding:10px;">✨ No pending tasks — enjoy your calm!</div>`;
    return;
  }
  // build tasks with delete button per item
  let html = '';
  tasks.forEach((task, index) => {
    html += `
      <div class="task-item" data-task-index="${index}">
        <span class="task-text">${escapeHtml(task)}</span>
        <button class="delete-task" data-idx="${index}" aria-label="Delete task">✖</button>
      </div>
    `;
  });
  container.innerHTML = html;
  // attach delete events to each delete button
  document.querySelectorAll('.delete-task').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-idx'));
      if(!isNaN(idx)) {
        tasks.splice(idx, 1);
        saveTasksToStorage();
        renderTaskList();
      }
    });
  });
}

function addTask() {
  const input = document.getElementById('taskInput');
  const taskText = input.value.trim();
  if(taskText === "") {
    const feedback = document.createElement('div');
    feedback.innerText = "⚠️ Please enter a task.";
    feedback.style.color = "#dc2626";
    feedback.style.fontSize = "0.75rem";
    const parent = input.parentNode;
    const oldMsg = parent.querySelector('.input-feedback');
    if(oldMsg) oldMsg.remove();
    feedback.classList.add('input-feedback');
    parent.appendChild(feedback);
    setTimeout(() => feedback.remove(), 1500);
    return;
  }
  tasks.push(taskText);
  saveTasksToStorage();
  renderTaskList();
  input.value = "";
  const oldMsg = input.parentNode.querySelector('.input-feedback');
  if(oldMsg) oldMsg.remove();
}

function clearAllTasks() {
  if(tasks.length === 0) return;
  if(confirm("Clear all tasks? This cannot be undone.")) {
    tasks = [];
    saveTasksToStorage();
    renderTaskList();
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if(m === '&') return '&amp;';
    if(m === '<') return '&lt;';
    if(m === '>') return '&gt;';
    return m;
  }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
    return c;
  });
}

// ----------------------------------------------
// 2. MOOD TRACKER + QUOTE GENERATOR (events, DOM manipulation, local storage)
// ----------------------------------------------
let moodEntries = [];

function loadMoodHistory() {
  const stored = localStorage.getItem('moodHistory');
  if(stored) {
    moodEntries = JSON.parse(stored);
  } else {
    moodEntries = [];
  }
  renderMoodHistory();
}

function saveMoodHistory() {
  localStorage.setItem('moodHistory', JSON.stringify(moodEntries));
}

function renderMoodHistory() {
  const historyDiv = document.getElementById('moodHistoryList');
  if(!historyDiv) return;
  if(moodEntries.length === 0) {
    historyDiv.innerHTML = '<i>No entries yet. Log your mood!</i>';
    return;
  }
  let historyHtml = '';
  // show last 5 entries for brevity (recent first)
  const recent = [...moodEntries].reverse().slice(0, 6);
  recent.forEach(entry => {
    const date = new Date(entry.timestamp);
    const timeStr = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
    historyHtml += `<div style="background:#f1f5f9; margin:4px 0; padding:4px 8px; border-radius: 30px; font-size:0.8rem;">${entry.mood}  —  ${timeStr}</div>`;
  });
  historyDiv.innerHTML = historyHtml;
}

function logMood() {
  const select = document.getElementById('moodSelect');
  const selectedMood = select.value;
  const newEntry = {
    mood: selectedMood,
    timestamp: Date.now()
  };
  moodEntries.push(newEntry);
  saveMoodHistory();
  renderMoodHistory();
  const feedbackDiv = document.getElementById('moodFeedback');
  feedbackDiv.innerHTML = `✅ Mood "${selectedMood}" logged! Stay mindful.`;
  feedbackDiv.style.opacity = '1';
  setTimeout(() => {
    feedbackDiv.innerHTML = '';
  }, 2000);
}

// inspiring quotes array
const quotes = [
  "🌸 Every day is a new beginning.",
  "🌿 Breathe deeply, you are enough.",
  "💫 The present moment is all you have.",
  "🌈 Choose joy, even in small things.",
  "🌟 You are the artist of your own life.",
  "🍃 Let go of what you can't control.",
  "💖 Gratitude turns what we have into enough.",
  "🌻 Small steps lead to giant leaps.",
  "✨ Your vibe attracts your tribe.",
  "🕊️ Peace begins with a smile."
];

function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteBox = document.getElementById('inspireQuote');
  if(quoteBox) {
    quoteBox.innerHTML = `“${quotes[randomIndex]}”`;
  }
}

function setInitialQuote() {
  displayRandomQuote();
}

// ----------------------------------------------
// 3. GRATITUDE SCORE + AFFIRMATION (interactive counter & DOM)
// ----------------------------------------------
let gratitudePoints = 0;

function loadGratitudePoints() {
  const storedPoints = localStorage.getItem('gratitudeScoreValue');
  if(storedPoints !== null && !isNaN(parseInt(storedPoints))) {
    gratitudePoints = parseInt(storedPoints);
  } else {
    gratitudePoints = 0;
  }
  updateGratitudeUI();
}

function saveGratitudePoints() {
  localStorage.setItem('gratitudeScoreValue', gratitudePoints);
}

function updateGratitudeUI() {
  const scoreSpan = document.getElementById('gratitudeScore');
  if(scoreSpan) scoreSpan.innerText = gratitudePoints;
  const affirmationDiv = document.getElementById('affirmationMsg');
  if(gratitudePoints === 0) affirmationDiv.innerHTML = "💖 Click +1 to boost your vibe";
  else if(gratitudePoints > 0 && gratitudePoints < 5) affirmationDiv.innerHTML = "🙏 Small gratitude ripples create big waves!";
  else if(gratitudePoints >= 5 && gratitudePoints < 12) affirmationDiv.innerHTML = "🌞 You're radiating kindness! Keep going.";
  else affirmationDiv.innerHTML = "🌈 Wow, you're a gratitude champion! ✨";
}

function incrementGratitude() {
  gratitudePoints += 1;
  saveGratitudePoints();
  updateGratitudeUI();
  const btn = document.getElementById('gratefulUp');
  if(btn) {
    btn.style.transform = "scale(0.95)";
    setTimeout(() => { if(btn) btn.style.transform = ""; }, 120);
  }
}

function resetGratitude() {
  if(confirm("Reset gratitude score to zero?")) {
    gratitudePoints = 0;
    saveGratitudePoints();
    updateGratitudeUI();
  }
}

// Random affirmation feature
const affirmations = [
  "I am capable of amazing things.",
  "Every day, I grow stronger.",
  "I deserve peace and happiness.",
  "Challenges help me evolve.",
  "My potential is limitless.",
  "I attract positivity naturally.",
  "I am grounded, focused, and kind.",
  "My mind is clear; my heart is open.",
  "I appreciate this moment fully.",
  "I breathe in calm, breathe out worry."
];

function showRandomAffirmation() {
  const randIdx = Math.floor(Math.random() * affirmations.length);
  const msgDiv = document.getElementById('affirmationMsg');
  if(msgDiv) {
    msgDiv.innerHTML = `✨ "${affirmations[randIdx]}" ✨`;
  }
}

// ----------------------------------------------
// LIVE DATE UPDATE (DOM manipulation)
// ----------------------------------------------
function updateLiveDate() {
  const dateElem = document.getElementById('liveDate');
  if(dateElem) {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElem.innerText = now.toLocaleDateString(undefined, options);
  }
}

// ----------------------------------------------
// INITIALIZE APP & ATTACH EVENT LISTENERS
// ----------------------------------------------
function initApp() {
  // load stored data
  loadTasksFromStorage();
  loadMoodHistory();
  loadGratitudePoints();

  // set date & quotes
  updateLiveDate();
  setInitialQuote();

  // --- Task events ---
  document.getElementById('addTaskBtn').addEventListener('click', addTask);
  document.getElementById('clearAllTasksBtn').addEventListener('click', clearAllTasks);
  // allow pressing Enter in task input
  const taskInput = document.getElementById('taskInput');
  if(taskInput) {
    taskInput.addEventListener('keypress', (e) => {
      if(e.key === 'Enter') addTask();
    });
  }

  // --- Mood events ---
  document.getElementById('logMoodBtn').addEventListener('click', logMood);
  document.getElementById('refreshQuoteBtn').addEventListener('click', displayRandomQuote);

  // --- Gratitude events ---
  document.getElementById('gratefulUp').addEventListener('click', incrementGratitude);
  document.getElementById('gratefulReset').addEventListener('click', resetGratitude);
  document.getElementById('randomAffirmationBtn').addEventListener('click', showRandomAffirmation);
}

// start everything once DOM loaded
document.addEventListener('DOMContentLoaded', initApp);
