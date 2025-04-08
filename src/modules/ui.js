import { Project } from './project';
import { Todo } from './todo';
import { saveProjects, loadProjects } from './storage';

let projects = [];
let currentProject = null;

const setProjects = (loadedProjects) => {
    projects = loadedProjects;
    if (!currentProject) currentProject = projects[0];
};

const renderProjects = () => {
    const projectContainer = document.getElementById("projects");
    projectContainer.innerHTML = "";

    projects.forEach((project) => {
        const projectElement = document.createElement("div");
        projectElement.textContent = project.name;
        projectElement.style.cursor = "pointer";

        projectElement.addEventListener("click", () => {
            currentProject = project;
            renderTodos();
        });

        projectContainer.appendChild(projectElement);
    });
};

const renderTodos = () => {
    const todoContainer = document.getElementById("todos");
    todoContainer.innerHTML = "";

    currentProject.todos.forEach((todo, index) => {
        const todoElement = document.createElement("div");
        todoElement.classList.add("todo");

        if (todo.completed) {
            todoElement.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;

        // Add class based on priority
        if (todo.priority === "high") {
            todoElement.classList.add("high-priority");
        } else if (todo.priority === "medium") {
            todoElement.classList.add("medium-priority");
        } else if (todo.priority === "low") {
            todoElement.classList.add("low-priority");
        }

        const text = document.createElement("span");
        text.textContent = `${todo.title} - ${todo.dueDate} (${todo.priority})`;
        text.style.color = "pointer";

        // Clicking opens the edit form
        text.addEventListener("click", () => {
            openEditForm(todo, index);
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent opening the edit form
            currentProject.todos.splice(index, 1);
            saveProjects(projects);
            renderTodos();
        });

        todoElement.appendChild(text);
        todoElement.appendChild(deleteBtn);
        todoContainer.appendChild(todoElement);
    });
};

const openEditForm = (todo, index) => {
    document.getElementById("editTodoForm").style.display = "block";
    document.getElementById("editTodoTitle").value = todo.title;
    document.getElementById("editTodoDescription").value = todo.description;
    document.getElementById("editTodoDueDate").value = todo.dueDate;
    document.getElementById("editTodoPriority").value = todo.priority;

    // Handle form submit inside this context
    const form = document.getElementById("editTodoForm");
    const clonedForm = form.cloneNode(true);
    form.parentNode.replaceChild(clonedForm, form);

    clonedForm.addEventListener("submit", (e) => {
        e.preventDefault();

        todo.title = document.getElementById("editTodoTitle").value;
        todo.description = document.getElementById("editTodoDescription").value;
        todo.dueDate = document.getElementById("editTodoDueDate").value;
        todo.priority = document.getElementById("editTodoPriority").value;

        saveProjects(projects);
        renderTodos();
        clonedForm.style.display = "none";
    });

    document.getElementById("cancelEditBtn").addEventListener("click", () => {
        clonedForm.style.display = "none";
    });
};

const addTodoToCurrentProject = (todo) => {
    currentProject.todos.push(todo);
    saveProjects(projects);
    renderTodos();
};

export { setProjects, renderProjects, renderTodos, addTodoToCurrentProject };