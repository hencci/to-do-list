export const isDuplicateNewProject = (projects, newName) => {
    return projects.some(project => project.name.toLowerCase() === newName.toLowerCase());
};

export const isDuplicateNewTodo = (todos, newTitle) => {
    return todos.some(todo => todo.title.toLowerCase() === newTitle.toLowerCase());
};