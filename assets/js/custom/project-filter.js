const DEFAULT_PROFILE_IMAGE = '/assets/images/default-profile.jpg';

class ProjectFilter {
  constructor ({ projects, projectsElement, searchElement }) {
    this.searchElement = searchElement;
    this.search = "",
    this.projects = projects;
    this.projectsElement = projectsElement;
    this.addEventListener();
    this.renderProjects();
  }

  get filteredProjects () {
    if (this.search) {
      return this.projects
        .filter(this.applySearch.bind(this));
      // TODO - add filters and tags here
    }

    return this.projects;
  }

  addEventListener () {
    this.searchElement.on('input', event => this.updateSearch(event.target.value));
  }

  applySearch (project) {
    const { author, title, subtitle, tags } = project;
    if (title.toLowerCase().includes(this.search)) return true;
    if (subtitle.toLowerCase().includes(this.search)) return true;
    if (author.name.toLowerCase().includes(this.search)) return true;
    if (tags.some(tag => tag.toLowerCase().includes(this.search))) return true;
    return false;
  }

  projectHtml (project) {
    const {
      author,
      description,
      projectTime,
      preparationTime,
      subtitle,
      tags,
      thumbnail,
      title,
      url,
    } = project;

    return `
      <div class="project-card">
        <img src="${author.image ? author.image : DEFAULT_PROFILE_IMAGE }" />
        <div class="card-title">
          <h1>${title}</h1>
          <h2>${subtitle}</h2>
          <p>${author.name}</p>
        </div>
        <p class="card-description">${project.description}</p>
        <div class="card-tags">
          <p>Tags:&nbsp;</p>
          ${tags.map(tag => `<span class="card-tag">${tag}</span>`)}
        </div>
        <div class="card-button">
          <a href="${project.url}">Go to project</a>
        </div>
      </div>
    `;
  }

  renderProjects () {
    this.projectsElement.empty();
    this.filteredProjects.forEach(project => {
      this.projectsElement.append(this.projectHtml(project));
    });
  }

  updateSearch (searchString) {
    this.search = searchString.toLowerCase();
    this.renderProjects();
  }
}

fetch('/projects.json')
  .then(results => results.json())
  .then(results => {
    const projects = results.map(project => ({ ...project, tags: project.tags.split(', ') }));
    const searchElement = $('#project-search');
    const projectsElement = $('.project-list');

    new ProjectFilter({
      projects,
      projectsElement,
      searchElement,
    });
  });
