const saveProjects = (projects) => {
    localStorage.setItem('projects', JSON.stringify(projects));
};

const loadProjects = () => {
    const projects = localStorage.getItem('projects');
    return projects ? JSON.parse(projects) : [];
};

export { saveProjects, loadProjects };