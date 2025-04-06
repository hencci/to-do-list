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

    currentProject.todos.forEach((todo) => {
        const todoElement = document.createElement("div");
        todoElement.classList.add("todo");
        todoElement.textContent = `${todo.title} - ${todo.dueDate} (${todo.priority})`;
        todoContainer.appendChild(todoElement);
    });
};

const addTodoToCurrentProject = (todo) => {
    currentProject.todos.push(todo);
    saveProjects(projects);
    renderTodos();
};

export { setProjects, renderProjects, renderTodos, addTodoToCurrentProject };