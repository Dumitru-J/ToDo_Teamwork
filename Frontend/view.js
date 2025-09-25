



// view.js hier sollen die Todos der User gerendert werden


export function showMessage(message) {
  swal(message);
}

export function showUserDashboard(email) {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("dashboardSection").classList.remove("hidden");
    document.getElementById("userEmail").textContent = `Eingeloggt als: ${email}`;
}

export function showLoginForm() {
    document.getElementById("dashboardSection").classList.add("hidden");
    document.getElementById("loginSection").classList.remove("hidden");
    document.getElementById("userEmail").textContent = "";
}

export function renderToDos(todos) {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  todos.forEach(todo => {
    const li = document.createElement("li");
    li.classList.add("liste"); // CSS-Klasse für Listenelemente

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.classList.add("todo-checkbox");
    // Event-Listener später im Controller binden

    const span = document.createElement("span");
    span.textContent = todo.task;
    if (todo.completed) {
      span.classList.add("completed"); // CSS-Klasse bei erledigten Aufgaben
    } else {
      span.classList.remove("completed");
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Löschen";
    deleteBtn.classList.add("liste-btn"); // CSS-Klasse für Buttons
    // Event-Listener später im Controller binden

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}





