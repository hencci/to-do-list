import { format, parseISO } from "date-fns";
import { Project } from './project';
import { Todo } from './todo';
import { saveProjects, loadProjects } from './storage';
import { isDuplicateProject } from './validators';
import { isDuplicateNewProject, isDuplicateNewTodo } from "./newValidators";
import { showInlineMessage, clearInlineMessage } from './uiHelpers'

let projects = [];
let currentProject = null;

const projectContainer = document.getElementById("projects");
const addTodoTemplate = document.getElementById("addTodoBtnTemplate");

// ============================
// Utility Functions
// ============================

const addProjectBtn = document.getElementById("addProjectBtn");
const projectForm = document.getElementById("projectForm");
const projectNameInput = document.getElementById("projectNameInput");
const cancelProjectBtn = document.getElementById("cancelProjectBtn");

addProjectBtn.addEventListener("click", () => {
    projectForm.style.display = "block";
    projectNameInput.focus();
});

cancelProjectBtn.addEventListener("click", () => {
    projectForm.style.display = "none";
    projectNameInput.value = "";
});

projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = projectNameInput.value.trim();
    clearInlineMessage("projectError");

    if (!name) return;
    if (isDuplicateProject(projects, name)) {
        showInlineMessage("projectError", "Project name already exists.");
        return;
    }

    const newProject = new Project(name);
    projects.push(newProject);
    currentProject = newProject;
    updateStorageAndRender();

    projectForm.style.display = "none";
    projectNameInput.value = "";
});

const createButton = (text, className, handler) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    if (className) btn.classList.add(className);
    if (handler) btn.addEventListener("click", handler);
    return btn;
};

const updateStorageAndRender = () => {
    saveProjects(projects);
    renderProjects();
};

const getFormattedDate = (dateStr) => {
    try {
        return format(parseISO(dateStr), "MMM dd, yyyy");
    } catch {
        return "Invalid date";
    }
};

const showInlineMessag = (element, message) => {
    let msg = document.createElement("div");
    msg.classList.add("inline-message");
    msg.textContent = message;
    msg.style.color = "red";
    msg.style.fontSize = "0.8em";
    msg.style.marginTop = "4px";

    if (element.parentNode.querySelector(".inline-message")) {
        return; // Don't stack multiple messages
    }

    element.parentNode.appendChild(msg);

    setTimeout(() => {
        if (msg.parentNode) {
            msg.parentNode.removeChild(msg);
        }
    }, 3000); // Auto-remove after 3 seconds
};

// ============================
// Project Rendering
// ============================

const setProjects = (loadedProjects) => {
    projects = loadedProjects;
    if (!currentProject && projects.length > 0) {
        currentProject = projects[0];
    }
    renderProjects();
    renderTodos();
};

const renderProjects = () => {
    projectContainer.innerHTML = "";

    projects.forEach((project, index) => {
        const projectItem = document.createElement("div");
        projectItem.classList.add("project-item");

        const nameSpan = document.createElement("span");
        nameSpan.textContent = project.name;
        nameSpan.classList.add("project-name");

        const summary = document.createElement("span");
        summary.classList.add("project-summary");
        const completed = project.todos.filter(t => t.completed).length;
        summary.textContent = ` (${project.todos.length} | ${completed} done)`;

        const editBtn = createButton("✏️", "edit-project", (e) => {
            handleEditProject(e, project, nameSpan, projectItem)
        });
        const deleteBtn = createButton("🗑️", "delete-project", (e) => {
            handleDeleteProject(e, project, index)
        });

        projectItem.append(nameSpan, summary, editBtn, deleteBtn);
        projectItem.addEventListener("click", () => {
            currentProject = project;
            renderProjects();
        });

        if (project === currentProject) {
            projectItem.classList.add("active");
        
            // Add Todo button
            const addTodoBtn = addTodoTemplate.content.cloneNode(true).firstElementChild;
            addTodoBtn.addEventListener("click", () => {
                const todoForm = document.getElementById("todoForm");
                todoForm.reset();
                todoForm.style.display = "block";
            });
        
            projectItem.appendChild(addTodoBtn);
        
            // Add Todo container directly under the project
            const projectTodoContainer = document.createElement("div");
            projectTodoContainer.classList.add("project-todos");
            renderTodos(projectTodoContainer); // Modified to render into this container
            projectItem.appendChild(projectTodoContainer);
        }
        
        projectContainer.appendChild(projectItem);
    });
};

const handleEditProject = (e, project, nameSpan, container) => {
    e.stopPropagation();
    const input = document.createElement("input");
    input.type = "text";
    input.value = project.name;
    input.classList.add("edit-input");

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const newName = input.value.trim();
            if (newName && !isDuplicateNewProject(projects.filter(p => p !== project), newName)) {
                project.name = newName;
                updateStorageAndRender();
            } else {
                showInlineMessag(input, "Project name already exists!");
            }
        }
    });

    container.replaceChild(input, nameSpan);
    input.focus();
};

const handleDeleteProject = (e, project, index) => {
    e.stopPropagation();
    if (project === currentProject) {
        alert("Cannot delete the active project. Switch to another project first.");
        return;
    }

    if (confirm(`Are you sure you want to delete the project "${project.name}"?`)) {
        projects.splice(index, 1);
        if (!projects.includes(currentProject)) {
            currentProject = projects[0] || null;
        }
        updateStorageAndRender();
    }
};

// ============================
// Todo Rendering
// ============================

const renderTodos = (container) => {
    if (!container || !currentProject) return;
    container.innerHTML = "";

    currentProject.todos.forEach((todo, index) => {
        const todoElement = document.createElement("div");
        todoElement.classList.add("todo");

        const due = document.createElement("span");
        due.classList.add("todo-due");
        due.textContent = `Due: ${getFormattedDate(todo.dueDate)}`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.addEventListener("change", () => {
            todo.completed = checkbox.checked;
            updateStorageAndRender();
        });

        const text = document.createElement("span");
        text.textContent = `${todo.title} - (${todo.priority})`;
        text.style.cursor = "pointer";
        text.addEventListener("click", () => openEditForm(todo, index));

        const deleteBtn = createButton("❌", null, (e) => {
            e.stopPropagation();
            currentProject.todos.splice(index, 1);
            updateStorageAndRender();
        });
        deleteBtn.style.marginLeft = "10px";

        // Style by priority and status
        if (todo.completed) todoElement.classList.add("completed");
        todoElement.classList.add(`${todo.priority}-priority`);

        todoElement.append(checkbox, text, due, deleteBtn);
        container.appendChild(todoElement);
    });
};

// ============================
// Todo Edit Form
// ============================

const openEditForm = (todo, index) => {
    const form = document.getElementById("editTodoForm");
    form.style.display = "block";

    form["editTodoTitle"].value = todo.title;
    form["editTodoDescription"].value = todo.description;
    form["editTodoDueDate"].value = todo.dueDate;
    form["editTodoPriority"].value = todo.priority;

    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    newForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newTitle = newForm["editTodoTitle"].value.trim();
    
        if (!isDuplicateNewTodo(currentProject.todos.filter(t => t !== todo), newTitle)) {
            todo.title = newTitle;
            todo.description = newForm["editTodoDescription"].value;
            todo.dueDate = newForm["editTodoDueDate"].value;
            todo.priority = newForm["editTodoPriority"].value;
            updateStorageAndRender();
            newForm.style.display = "none";
        } else {
            showInlineMessag(newForm["editTodoTitle"], "Todo title already exists!");
        }
    });

    newForm["cancelEditBtn"].addEventListener("click", () => {
        newForm.style.display = "none";
    });
};

// ============================
// Add Todo
// ============================

const addTodoToCurrentProject = (todo) => {
    if (!currentProject) return;
    currentProject.todos.push(todo);
    updateStorageAndRender();
};

// Cancel button for Add Todo
const cancelBtn = document.getElementById("cancelTodoBtn");
if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
        document.getElementById("todoForm").style.display = "none";
    });
}

const getCurrentProject = () => currentProject;
export {
    setProjects,
    renderProjects,
    renderTodos,
    addTodoToCurrentProject,
    getCurrentProject
};