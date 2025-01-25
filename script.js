// Получение всех пользователей из LocalStorage
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// Сохранение пользователей в LocalStorage
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Функция регистрации
const registrationForm = document.getElementById("registration-form");
if (registrationForm) {
  registrationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("reg-username").value.trim();
    const password = document.getElementById("reg-password").value.trim();

    if (!username || !password) {
      alert("Введите логин и пароль!");
      return;
    }

    const users = getUsers();
    if (users.some(user => user.username === username)) {
      alert("Такой пользователь уже существует!");
      return;
    }

    const newUser = { username, password, isBanned: false, isMuted: false, progress: {} };
    users.push(newUser);
    saveUsers(users);
    alert("Регистрация успешна!");
    registrationForm.reset();
  });
}

// Функция авторизации
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    const users = getUsers();
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      if (user.isBanned) {
        alert("Ваш аккаунт заблокирован!");
        return;
      }
      alert("Вход успешен!");
      localStorage.setItem("currentUser", username);
      window.location.href = username === "Админ" ? "admin.html" : "tasks.html";
    } else {
      alert("Неверный логин или пароль!");
    }
  });
}

// Управление пользователями (админ-панель)
function banUser(username) {
  const users = getUsers();
  const user = users.find(u => u.username === username);
  if (user) {
    user.isBanned = true;
    saveUsers(users);
    alert(`Пользователь ${username} забанен.`);
  } else {
    alert("Пользователь не найден!");
  }
}

function unbanUser(username) {
  const users = getUsers();
  const user = users.find(u => u.username === username);
  if (user) {
    user.isBanned = false;
    saveUsers(users);
    alert(`Пользователь ${username} разбанен.`);
  } else {
    alert("Пользователь не найден!");
  }
}

function muteUser(username) {
  const users = getUsers();
  const user = users.find(u => u.username === username);
  if (user) {
    user.isMuted = true;
    saveUsers(users);
    alert(`Пользователь ${username} получил мут.`);
  } else {
    alert("Пользователь не найден!");
  }
}

function unmuteUser(username) {
  const users = getUsers();
  const user = users.find(u => u.username === username);
  if (user) {
    user.isMuted = false;
    saveUsers(users);
    alert(`Пользователь ${username} размучен.`);
  } else {
    alert("Пользователь не найден!");
  }
}

function changePassword(username, newPassword) {
  const users = getUsers();
  const user = users.find(u => u.username === username);
  if (user) {
    user.password = newPassword;
    saveUsers(users);
    alert(`Пароль пользователя ${username} изменен.`);
  } else {
    alert("Пользователь не найден!");
  }
}

function getProgress(username) {
  const users = getUsers();
  const user = users.find(u => u.username === username);
  if (user) {
    return user.progress;
  }
  return null;
}

// Задания для пользователя
const tasks = [
  { id: 1, question: "2 + 2 = ?", answer: "4", completed: false },
  { id: 2, question: "1 + 1 = ?", answer: "2", completed: false },
  { id: 3, question: "5 + 5 = ?", answer: "10", completed: false }
];

const taskList = document.getElementById("task-list");
if (taskList) {
  tasks.forEach((task) => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    taskDiv.innerHTML = `
      <p><strong>Задание ${task.id}:</strong> ${task.question}</p>
      <input type="text" id="answer-${task.id}" placeholder="Ваш ответ">
      <button onclick="checkAnswer(${task.id})">Проверить</button>
    `;
    taskList.appendChild(taskDiv);
  });
}

function checkAnswer(id) {
  const task = tasks.find((t) => t.id === id);
  const userAnswer = document.getElementById(`answer-${id}`).value.trim();
  if (task && userAnswer === task.answer) {
    alert("Правильно!");
    task.completed = true;
    document.getElementById(`answer-${id}`).disabled = true;
  } else {
    alert("Неправильно, попробуйте снова!");
  }
}

// Чат для пользователя
const chatWindow = document.getElementById("chat-window");
const chatInput = document.getElementById("chat-input");
const sendMessageButton = document.getElementById("send-message");

if (chatWindow && sendMessageButton) {
  sendMessageButton.addEventListener("click", () => {
    const username = localStorage.getItem("currentUser");
    const user = getUsers().find(u => u.username === username);

    if (user && user.isMuted) {
      alert("Вы не можете отправлять сообщения, так как вы замучены.");
      return;
    }

    const message = chatInput.value.trim();
    if (message) {
      const messageDiv = document.createElement("div");
      messageDiv.className = "message";
      messageDiv.innerHTML = `<strong>Вы:</strong> ${message}`;
      chatWindow.appendChild(messageDiv);
      chatInput.value = "";
      chatWindow.scrollTop = chatWindow.scrollHeight;
    } else {
      alert("Введите сообщение!");
    }
  });
}

// Панель администратора
const adminForm = document.getElementById("admin-username");
if (adminForm) {
  document.getElementById("ban-button").addEventListener("click", () => {
    const username = adminForm.value.trim();
    banUser(username);
  });

  document.getElementById("unban-button").addEventListener("click", () => {
    const username = adminForm.value.trim();
    unbanUser(username);
  });

  document.getElementById("mute-button").addEventListener("click", () => {
    const username = adminForm.value.trim();
    muteUser(username);
  });

  document.getElementById("unmute-button").addEventListener("click", () => {
    const username = adminForm.value.trim();
    unmuteUser(username);
  });

  document.getElementById("change-password-button").addEventListener("click", () => {
    const username = adminForm.value.trim();
    const newPassword = document.getElementById("new-password").value.trim();
    changePassword(username, newPassword);
  });

  document.getElementById("check-progress-button").addEventListener("click", () => {
    const username = adminForm.value.trim();
    const progress = getProgress(username);
    if (progress) {
      document.getElementById("progress-output").textContent = JSON.stringify(progress, null, 2);
    } else {
      alert("Пользователь не найден!");
    }
  });
}