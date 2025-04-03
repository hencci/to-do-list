class Project {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    removeTodo(todoTitle) {
        this.todos = this.todos.filter(todo => todo.title !== todoTitle);
    }
}

export { Project };