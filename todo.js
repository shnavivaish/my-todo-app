let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

// Add a new task
function addTask(text, completed = false, priority = 'low', category = 'General', dueDate = '') {
  const task = {
    id: Date.now(),
    text,
    completed,
    priority,
    category,
    dueDate
  };

  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

const quotes = [
  "You got this! Every small step counts 💪",
  "Progress over perfection. Keep going! 🌟",
  "Believe in yourself and all that you are ✨",
  "One task at a time, one victory at a time 🏆",
  "Consistency is the secret sauce! 🔑",
  "Great things are done by a series of small things brought together 🎯",
  "Stay focused, stay positive, and finish strong! 💖",
  "Your dreams don’t work unless you do. Let’s get it! 🚀",
  "Start now. You’re closer than you think. 🌈"
];

// Format date as yyyy-mm-dd
function getTodayDateKey() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Get or set today's quote
function getQuoteOfTheDay() {
  const todayKey = getTodayDateKey();
  const savedData = JSON.parse(localStorage.getItem('quoteOfTheDay') || '{}');

  if (savedData.date === todayKey) {
    return savedData.quote;
  } else {
    const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    localStorage.setItem('quoteOfTheDay', JSON.stringify({ date: todayKey, quote: newQuote }));
    return newQuote;
  }
}

function displayQuoteOfTheDay() {
  document.getElementById('quote-text').textContent = getQuoteOfTheDay();
}

window.addEventListener('DOMContentLoaded', displayQuoteOfTheDay);


  const mascotImages = [
    "https://cdn-icons-png.flaticon.com/512/4712/4712104.png",  // robot
    "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",  // cat-bot
    "https://cdn-icons-png.flaticon.com/512/4712/4712025.png",  // waving bot
    "https://cdn-icons-png.flaticon.com/512/4712/4712055.png",  // book bot
    "https://cdn-icons-png.flaticon.com/512/4712/4712007.png"   // smiling bot
  ];

  const randomMascot = mascotImages[Math.floor(Math.random() * mascotImages.length)];
  document.getElementById("ai-mascot").src = randomMascot;


  const userName = localStorage.getItem('userName') || "friend";

  const personalizedQuotes = [
    `Hey ${userName}, you're unstoppable today! 💪`,
    `Keep shining, ${userName}! 🌟 You've got this.`,
    `Let’s tackle a task together, ${userName}! 🧠`,
    `${userName}, your goals are just a step away! 🚀`,
    `One task at a time, ${userName}. You’re doing amazing! ✨`
  ];

  const quote = personalizedQuotes[Math.floor(Math.random() * personalizedQuotes.length)];
  document.getElementById("ai-quote").textContent = quote;




// Render tasks to the page
function renderTasks() {
  const taskList = document.getElementById('task-list');
  if (!taskList) return; // Prevent crash if not found

  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) li.classList.add('completed');

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})" />
      <span>${task.text}</span>
      <button onclick="deleteTask(${index})" class="delete-btn">❌</button>

    `;

    taskList.appendChild(li);
  });
}

// Toggle task completion
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem('tasks', JSON.stringify(tasks));

  if (tasks[index].completed) {
    const completedCount = parseInt(localStorage.getItem('totalCompleted') || '0') + 1;
    localStorage.setItem('totalCompleted', completedCount);
    updateStreak();
    updateWeeklyProgress();
  }

  renderTasks();
}

// Delete a task
function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// Update streak logic
function updateStreak() {
  const today = new Date().toDateString();
  const lastStreakDate = localStorage.getItem('lastStreakDate');
  let streak = parseInt(localStorage.getItem('streak') || '0');

  if (lastStreakDate !== today) {
    streak++;
    localStorage.setItem('streak', streak);
    localStorage.setItem('lastStreakDate', today);
  }
}

// Update weekly progress
function updateWeeklyProgress() {
  const todayKey = new Date().toDateString();
  const progress = JSON.parse(localStorage.getItem('weeklyProgress') || '{}');

  progress[todayKey] = (progress[todayKey] || 0) + 1;

  // Limit to last 7 days
  const keys = Object.keys(progress);
  if (keys.length > 7) {
    const sorted = keys.sort((a, b) => new Date(a) - new Date(b));
    delete progress[sorted[0]];
  }

  localStorage.setItem('weeklyProgress', JSON.stringify(progress));
}

// 🌙 Dark Mode toggle
function setupDarkModeToggle() {
  const darkToggleBtn = document.getElementById('toggle-dark-mode');
  if (!darkToggleBtn) return;

  darkToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode') ? 'on' : 'off');
    darkToggleBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  });

  if (localStorage.getItem('darkMode') === 'on') {
    document.body.classList.add('dark-mode');
    darkToggleBtn.textContent = '☀️';
  }
}

// Personalized greeting + Event listeners
window.addEventListener('DOMContentLoaded', () => {
  // Greet user
  const username = localStorage.getItem('username') || 'there';
  const greeting = document.getElementById('greeting');
  if (greeting) {
    greeting.textContent = `Welcome back, ${username}! 👋`;
  }

  // Setup dark mode toggle
  setupDarkModeToggle();

  // Form submission
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');

  if (taskForm && taskInput) {
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = taskInput.value.trim();
      if (text !== '') {
        addTask(text);
        taskInput.value = '';
      }
    });
  }

  // Load tasks
  renderTasks();
});
