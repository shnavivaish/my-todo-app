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

// Render tasks to the page
function renderTasks() {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) li.classList.add('completed');

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})" />
      <span>${task.text}</span>
      <button onclick="deleteTask(${index})">❌</button>
    `;

    taskList.appendChild(li);
  });
}
// Personalized greeting
window.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username') || 'there';
  const greeting = document.getElementById('greeting');
  if (greeting) {
    greeting.textContent = `Welcome back, ${username}! 👋`;
  }

  // Retain dark mode
  if (localStorage.getItem("darkMode") === "on") {
    document.body.classList.add("dark-mode");
  }
});


// Toggle task completion
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem('tasks', JSON.stringify(tasks));

  if (tasks[index].completed) {
    const completedCount = parseInt(localStorage.getItem('totalCompleted') || '0') + 1;
    localStorage.setItem('totalCompleted', completedCount);

    updateStreak();
    updateWeeklyProgress(); // ✅ Track completion for the progress chart
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

// ✅ Update weekly progress data in localStorage
function updateWeeklyProgress() {
  const todayKey = new Date().toDateString();
  const progress = JSON.parse(localStorage.getItem('weeklyProgress') || '{}');

  progress[todayKey] = (progress[todayKey] || 0) + 1;

  // Keep only last 7 days
  const keys = Object.keys(progress);
  if (keys.length > 7) {
    const sorted = keys.sort((a, b) => new Date(a) - new Date(b));
    delete progress[sorted[0]];
  }

  localStorage.setItem('weeklyProgress', JSON.stringify(progress));
}

// Form submit handler
document.getElementById('task-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const taskInput = document.getElementById('task-input');
  if (taskInput.value.trim() !== '') {
    addTask(taskInput.value.trim());
    taskInput.value = '';
  }
});
function showDailyMotivation() {
  const messages = [
    "🌟 {name}, you’re doing amazing – keep it up!",
    "🔥 {name}, small steps every day lead to big results.",
    "💪 Believe in yourself, {name}, and all that you are.",
    "✨ {name}, focus on progress, not perfection!",
    "🚀 {name}, you’re one task closer to your goal!",
    "🌈 Today is a fresh start. Let’s go, {name}!",
    "🧠 One step at a time, one win at a time, {name}.",
    "🌸 {name}, be proud of how far you’ve come!",
    "☕ Deep breath, {name}. You got this!",
    "🌞 Make today count – you’re worth it, {name}!"
  ];

  const userName = localStorage.getItem('userName') || 'Friend';
  const today = new Date().toDateString();
  let lastDate = localStorage.getItem('motivationDate');
  let lastMessageIndex = parseInt(localStorage.getItem('motivationIndex') || '-1');

  if (lastDate !== today) {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * messages.length);
    } while (newIndex === lastMessageIndex);

    localStorage.setItem('motivationIndex', newIndex);
    localStorage.setItem('motivationDate', today);
    lastMessageIndex = newIndex;
  }

  const personalizedMessage = messages[lastMessageIndex].replace(/{name}/g, userName);
  document.getElementById('daily-motivation').textContent = personalizedMessage;
}

// Render tasks on load
window.onload = function () {
  renderTasks();
};
showDailyMotivation();

// 🌙 Dark Mode Toggle
const darkToggleBtn = document.getElementById('toggle-dark-mode');

darkToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode') ? 'on' : 'off');
});

// Set dark mode if stored preference is on
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'on') {
    document.body.classList.add('dark-mode');
  }
});
// Apply saved theme on load
const savedTheme = localStorage.getItem('selectedTheme') || 'pastel';
document.body.classList.add(`theme-${savedTheme}`);


// 🎨 Theme Handling
const themeSelect = document.getElementById('themeSelect');

if (themeSelect) {
  // Set initial theme based on saved preference
  const savedTheme = localStorage.getItem('selectedTheme') || 'pastel';
  document.body.classList.add(`theme-${savedTheme}`);
  themeSelect.value = savedTheme;

  themeSelect.addEventListener('change', () => {
    document.body.classList.remove(`theme-${savedTheme}`);
    const newTheme = themeSelect.value;
    document.body.classList.add(`theme-${newTheme}`);
    localStorage.setItem('selectedTheme', newTheme);
  });
}
