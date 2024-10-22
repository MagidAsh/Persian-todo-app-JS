const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const editButton = document.getElementById("edit-button");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.querySelector("tbody");
const deleteAllButton = document.getElementById("delete-all-button");
const filterButtons = document.querySelectorAll(".filter-todos");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
console.log(todos);

const e2p = (s) => s.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

// saveToLocalStorage function for Storing todos in local storage

const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

// generateId function for Creating a unique id for each todo

const generateId = () => {
  return Math.round(
    Math.random() * Math.random() * Math.pow(10, 15)
  ).toString();
};

// showAlert function for Show a success or error message to the user

const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);

  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};

// displayTodos function for Show todos dynamically

const displayTodos = (data) => {
  let todoList = data ? data : todos;

  todosBody.innerHTML = "";

  // console.log(todoList);

  if (!todoList.length) {
    todosBody.innerHTML = "<tr><td colSpan='4'>هیچ عنوانی یافت نشد!</td></tr>";
    return;
  }
  todoList.forEach((todo) => {
    todosBody.innerHTML += `
    <tr>
      <td>${todo.task}</td>
      <td>${e2p(todo.date) ? e2p(todo.date) : "بدون تاریخ"}</td>
      <td>${todo.completed ? "تکمیل شده" : "در حال انجام"}</td>
      <td>
        <button onclick="edithandler('${todo.id}')">ویرایش</button>
        <button onclick="toggleHandler('${todo.id}')">
        ${todo.completed ? "قبل" : "بعد"}</button>
        <button onclick="deleteHandler('${todo.id}')">حذف</button>
      </td>
    </tr>`;
  });
};

// showAlert function for Getting todo values

const addHandler = () => {
  const task = taskInput.value;
  const date = dateInput.value;
  const todo = {
    id: generateId(),
    task,
    date,
    completed: false,
  };

  if (task) {
    todos.push(todo);
    saveToLocalStorage();
    displayTodos();
    taskInput.value = "";
    dateInput.value = "";
    console.log(todos);
    showAlert("تودو با موفقیت اضافه شد", "success");
  } else {
    showAlert("لطفا تودو را کامل وارد کنید!", "error");
  }
};

// deleteAllHandler function for Ability to delete all todos

const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveToLocalStorage();
    displayTodos();
    showAlert("همه تودوها حذف گردید", "success");
  } else {
    showAlert("هیچ تودویی برای حذف کردن وجو ندارد!", "error");
  }
};

// deleteHandler function for Ability to delete a specific todo

const deleteHandler = (id) => {
  const newTodos = todos.filter((todo) => todo.id !== id);
  todos = newTodos;
  saveToLocalStorage();
  displayTodos();
  showAlert("حذف شد", "success");
};

// toggleHandler function for Changing the status of todos

const toggleHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
  saveToLocalStorage();
  displayTodos();
  showAlert("وضعیت تودو تغییر کرد", "success");
};

// edithandler function for Making it possible to edit the todo

const edithandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  taskInput.value = todo.task;
  dateInput.value = todo.date;
  addButton.style.display = "none";
  editButton.style.display = "inline-block";
  editButton.dataset.id = id;
};

// applyEditHandler function for Apply the edited changes to the todos

const applyEditHandler = (event) => {
  const id = event.target.dataset.id;
  const todo = todos.find((todo) => todo.id === id);
  todo.task = taskInput.value;
  todo.date = dateInput.value;
  taskInput.value = "";
  dateInput.value = "";
  editButton.style.display = "none";
  addButton.style.display = "inline-block";
  saveToLocalStorage();
  displayTodos();
  showAlert("تودو با موفقیت ویرایش شد", "success");
};

// filterHandler function for Todo filtering

const filterHandler = (event) => {
  let filteredTodos = null;
  const filter = event.target.dataset.filter;

  switch (filter) {
    case "pending":
      filteredTodos = todos.filter((todo) => todo.completed === false);
      break;
    case "completed":
      filteredTodos = todos.filter((todo) => todo.completed === true);
      break;
    default:
      filteredTodos = todos;
      break;
  }
  displayTodos(filteredTodos);
};
// Events

window.addEventListener("load", () => displayTodos());
addButton.addEventListener("click", addHandler);
deleteAllButton.addEventListener("click", deleteAllHandler);
editButton.addEventListener("click", applyEditHandler);
filterButtons.forEach((button) => {
  button.addEventListener("click", filterHandler);
});
