import { Project } from './project';
import { Todo } from './todo';
import { saveProjects, loadProjects } from './storage';
import { renderProjects } from './ui';

let projects = loadProjects() || [Project("Default")];

const initApp = () => {
    renderProjects();
    
    document.getElementById("addProjectBtn").addEventListener("click", () => {
        const projectName = prompt("Enter project name:");
        if (projectName) {
            projects.push(new Project(projectName));
            saveProjects(projects);
            renderProjects();
        }
    });
};

export { initApp };