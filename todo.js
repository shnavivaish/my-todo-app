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

// Render tasks on load
window.onload = function () {
  renderTasks();
};

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
