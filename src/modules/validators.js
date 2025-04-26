export const isDuplicateProject = (projects, name) => {
    return projects.some(p => p.name.toLowerCase() === name.toLowerCase());
};

export const isDuplicateTodo = (todos, title) => {
    return todos.some(t => t.title.toLowerCase() === title.toLowerCase());
};