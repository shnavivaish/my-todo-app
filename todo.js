let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

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

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem('tasks', JSON.stringify(tasks));

  if (tasks[index].completed) {
    const completedCount = parseInt(localStorage.getItem('totalCompleted') || '0') + 1;
    localStorage.setItem('totalCompleted', completedCount);
    updateStreak();
    updateTaskHistory();  // ✅ Update weekly progress
  }

  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

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

function updateTaskHistory() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = days[new Date().getDay()];
  let taskHistory = JSON.parse(localStorage.getItem('taskHistory') || '{}');

  // Initialize if missing
  days.forEach(day => {
    if (!taskHistory[day]) taskHistory[day] = 0;
  });

  taskHistory[today]++;
  localStorage.setItem('taskHistory', JSON.stringify(taskHistory));
}

document.getElementById('task-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const taskInput = document.getElementById('task-input');
  if (taskInput.value.trim() !== '') {
    addTask(taskInput.value.trim());
    taskInput.value = '';
  }
});

window.onload = function () {
  renderTasks();
};

// 🌙 Dark Mode Toggle with Icon Swap
const darkToggleBtn = document.getElementById('toggle-dark-mode');
const toggleIcon = document.getElementById('toggle-icon');

darkToggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDark ? 'on' : 'off');
  toggleIcon.textContent = isDark ? '☀️' : '🌙';
});

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'on') {
    document.body.classList.add('dark-mode');
    toggleIcon.textContent = '☀️';
  }
});
