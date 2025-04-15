import { Project } from './project';
import { Todo } from './todo';
import { saveProjects, loadProjects } from './storage';
import { setProjects, renderProjects, addTodoToCurrentProject } from './ui';

let projects = loadProjects().map((p) => {
    const project = new Project(p.name);
    p.todos.forEach((t) => {
        const todo = new Todo(t.title, t.description, t.dueDate, t.priority, t.notes, t.checklist);
        todo.completed = t.completed;
        project.addTodo(todo);
    });
    return project;
});

const initApp = () => {
    setProjects(projects);
    renderProjects();

    const todoForm = document.getElementById("todoForm");
    const addTodoBtn = document.getElementById("addTodoBtn");
    const cancelTodoBtn = document.getElementById("cancelTodoBtn");

    addTodoBtn.addEventListener("click", () => {
        todoForm.style.display = "block";
    });

    cancelTodoBtn.addEventListener("click", () => {
        todoForm.style.display = "none";
    });

    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("todoTitle").value;
        const description = document.getElementById("todoDescription").value;
        const dueDate = document.getElementById("todoDueDate").value;
        const priority = document.getElementById("todoPriority").value;

        if (title && dueDate && priority) {
            const newTodo = new Todo(title, description, dueDate, priority);
            addTodoToCurrentProject(newTodo);
            todoForm.reset();
            todoForm.style.display = "none";
        }
    });
};

export { initApp };