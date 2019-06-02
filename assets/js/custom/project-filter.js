---
---

const DEFAULT_THUMBNAIL = '{{site.baseurl}}/assets/images/project-thumbnails/default-thumbnail.jpg';

class ProjectFilter {
  constructor ({ clearElement, filterElements, filterOptions, projects, projectsElement, searchElement, tagOptions, tagsElement }) {
    this.clearElement = clearElement;
    this.filterElements = filterElements;
    this.filterOptions = filterOptions;
    this.filters = {};
    filterOptions.forEach(option => this.filters[option.name] = []);
    this.tagsElement = tagsElement;
    this.tagOptions = tagOptions;
    this.tags = [];
    this.searchElement = searchElement;
    this.search = "",
    this.projects = projects;
    this.projectsElement = projectsElement;
    this.addEventListeners();
    this.renderProjects();
  }

  get filteredProjects () {
    return this.projects
      .filter(this.applySearch.bind(this))
      .filter(this.applyFilters.bind(this))
      .filter(this.applyTags.bind(this));
  }

  addEventListeners () {
    const self = this;
    this.searchElement.on('input', event => this.updateSearch(event.target.value));
    this.filterElements.forEach(element => {
      element.find('input').change(function () {
        if (this.checked) self.addFilter(this.value);
        else self.removeFilter(this.value);
      });
    })
    this.tagsElement.on('change', event => this.updateTags(event.target.value));
    this.clearElement.on('click', () => this.clear());
  }

  addFilter (item) {
    const [filterName, value] = item.split('::');
    this.filters[filterName].push(value);
    this.renderProjects();
  }

  applySearch (project) {
    if (!this.search) return true;
    const { author, title, subtitle, tags } = project;
    if (title.toLowerCase().includes(this.search)) return true;
    if (subtitle.toLowerCase().includes(this.search)) return true;
    if (author.name.toLowerCase().includes(this.search)) return true;
    if (tags.some(tag => tag.toLowerCase().includes(this.search))) return true;
    return false;
  }

  applyFilters (project) {
    let passes = true;
    Object.keys(this.filters).forEach(key => {
      const filter = this.filters[key];
      if (filter.length) {
        if (!filter.includes(project[key])) {
          passes = false;
        }
      }
    });
    return passes;
  }

  applyTags (project) {
    if (!this.tags.length) return true;
    if (project.tags.some(tag => this.tags.includes(tag))) return true;
    return false;
  }

  clear () {
    this.tagsElement[0].selectize.clear();
    this.tags = [];
    this.filterElements.forEach(element => {
      element.find('input').attr('checked', false);
    });
    const newFilters = {};
    Object.keys(this.filters).forEach(key => newFilters[key] = []);
    this.filters = newFilters;
    this.renderProjects();
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
        <img src="${thumbnail || DEFAULT_THUMBNAIL }" />
        <div class="card-title">
          <h1>${title}</h1>
          <h2>${subtitle}</h2>
          <p>${author.name}</p>
        </div>
        <p class="card-description">${project.description}</p>
        <div class="card-tags">
          <p>Tags:&nbsp;</p>
          ${
            tags
              .map(tag => `<span class="card-tag">${tag}</span>`)
              .join('')
          }
        </div>
        <div class="card-button">
          <a class="primary-button" href="${project.url}">Go to project</a>
        </div>
      </div>
    `;
  }

  removeFilter (item) {
    const [filterName, value] = item.split('::');
    const options = this.filters[filterName];
    this.filters[filterName] = options.filter(option => option !== value);
    this.renderProjects();
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

  updateTags (tagsString) {
    this.tags = tagsString.split(',').filter(Boolean);
    this.renderProjects();
  }
}

Promise.all([
  fetch('{{site.baseurl}}/projects.json'),
  fetch('{{site.baseurl}}/filters.json'),
  fetch('{{site.baseurl}}/tags.json')
]).then(([
  projectsResponse,
  filtersResponse,
  tagsResponse
]) => {
  Promise.all([
    projectsResponse.json(),
    filtersResponse.json(),
    tagsResponse.json()
  ]).then(([
    projects,
    filterOptions,
    tagOptions
  ]) => {
    // initialize tag selector
    const tagsElement = $('#tags-selector').selectize({
      create: false,
      delimiter: ',',
      labelField: 'value',
      options: tagOptions.map(tag => ({ value: tag })),
      persist: false,
      searchField: ['value'],
      valueField: 'value',
    });

    new ProjectFilter({
      clearElement: $('#clear-project-filters'),
      filterElements: filterOptions.map(filter => $(`.project-filter.${filter.name}`)),
      filterOptions,
      projects: projects.map(project => ({ ...project, tags: project.tags.split(', ').filter(Boolean) })),
      projectsElement: $('.project-list'),
      searchElement: $('#project-search'),
      tagOptions,
      tagsElement,
    });

    // ability to toggle filter panel in/out
    const filterButton = $('.project-filter-button');
    filterButton.click(() => {
      if (filterButton.text() === 'Filter Projects') filterButton.text('Close Filters');
      else filterButton.text('Filter Projects');
      $('.project-filters').toggleClass('open');
      $('.projects-panel').toggleClass('filters-open');
    });
  });
});
