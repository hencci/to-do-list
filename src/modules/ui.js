import { Project } from './project';
import { Todo } from './todo';
import { saveProjects, loadProjects } from './storage';

const projects = loadProjects() || [Project("Default")];

const renderProjects = () => {
    const projectContainer = document.getElementById("projects");
    projectContainer.innerHTML = "";
    
    projects.forEach((project) => {
        const projectElement = document.createElement("div");
        projectElement.textContent = project.name;
        projectElement.addEventListener("click", () => renderTodos(project));
        projectContainer.appendChild(projectElement);
    });
};

const renderTodos = (project) => {
    const todoContainer = document.getElementById("todos");
    todoContainer.innerHTML = "";

    project.todos.forEach((todo) => {
        const todoElement = document.createElement("div");
        todoElement.textContent = `${todo.title} - ${todo.dueDate}`;
        todoContainer.appendChild(todoElement);
    });
};

export { renderProjects, renderTodos };