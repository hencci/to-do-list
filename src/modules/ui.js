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

    projects.forEach((project, index) => {
        const projectItem = document.createElement("div");
        projectItem.classList.add("project-item");
        
        // Display area
        const nameSpan = document.createElement("span");
        nameSpan.textContent = project.name;
        nameSpan.classList.add("project-name");

        // Add task summary
        const completed = project.todos.filter(todo => todo.completed).length;
        const total = project.todos.length;
        const summary = document.createElement("span");
        summary.classList.add("project-summary");
        summary.textContent = ` (${total} | ${completed} done)`;

        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️";
        editBtn.classList.add("edit-project");
        editBtn.classList.add("edit-project");
        editBtn.addEventListener("click", (e) => {
            e.stopPropagation();

            const input = document.createElement("input");
            input.type = "text";
            input.value = project.name;
            input.classList.add("edit-input");

            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    const newName = input.value.trim();
                    if (newName) {
                        project.name = newName;
                        saveProjects(projects);
                        renderProjects();
                        renderTodos();
                    }
                }
            });
            projectItem.replaceChild(input, nameSpan);
            input.focus();
        });

        // Click to set current project
        projectItem.addEventListener("click", () => {
            currentProject = project;
            renderProjects();
            renderTodos();
        });

        // Show which one is selected
        if (currentProject === project) {
            projectItem.classList.add("active");
        }

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";
        deleteBtn.classList.add("delete-project");
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent setting project

            if (project === currentProject) {
                alert("Cannot delete the active project. Switch to another project first.");
                return;
            }

            if (confirm(`Are you sure you want to delete the project "${project.name}"?`)) {
                projects.splice(index, 1);
                saveProjects(projects);

                // Fallback to first project if current was deleted
                if (!projects.includes(currentProject)) {
                    currentProject = projects[0];
                }

                renderProjects();
                renderTodos();
            }
        });

        projectItem.appendChild(nameSpan);
        projectItem.appendChild(editBtn);
        projectItem.appendChild(deleteBtn);
        projectContainer.appendChild(projectItem);
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

        // Toggle completed state
        checkbox.addEventListener("change", () => {
            todo.completed = checkbox.checked;
            saveProjects(projects);
            renderTodos(); // re-render to apply styles
        });

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

        todoElement.appendChild(checkbox);
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