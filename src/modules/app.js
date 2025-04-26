import { Project } from './project';
import { Todo } from './todo';
import { saveProjects, loadProjects } from './storage';
import { setProjects, renderProjects, addTodoToCurrentProject } from './ui';
import { isDuplicateTodo } from './validators';

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
        clearInlineMessage("todoError")

        const title = document.getElementById("todoTitle").value.trim();
        const description = document.getElementById("todoDescription").value;
        const dueDate = document.getElementById("todoDueDate").value;
        const priority = document.getElementById("todoPriority").value;

        if (!title || !dueDate || !priority) return;

        if (isDuplicateTodo(currentProject.todos, title)) {
            showInlineMessage("todoError", "Todo title already exists in this project.");
            return;
        }
        
        const newTodo = new Todo(title, description, dueDate, priority);
        addTodoToCurrentProject(newTodo);
        todoForm.reset();
        todoForm.style.display = "none";
    });
};

export { initApp };