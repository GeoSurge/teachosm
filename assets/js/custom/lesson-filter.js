const DEFAULT_PROFILE_IMAGE = '/assets/images/default-profile.jpg';

class LessonFilter {
  constructor ({ lessons, lessonsElement, searchElement }) {
    this.searchElement = searchElement;
    this.search = "",
    this.lessons = lessons;
    this.lessonsElement = lessonsElement;
    this.addEventListener();
    this.renderLessons();
  }

  get filteredLessons () {
    if (this.search) {
      return this.lessons
        .filter(this.applySearch.bind(this));
      // TODO - add filters and tags here
    }

    return this.lessons;
  }

  addEventListener () {
    this.searchElement.on('input', event => this.updateSearch(event.target.value));
  }

  applySearch (lesson) {
    const { author, title, subtitle, tags } = lesson;
    if (title.toLowerCase().includes(this.search)) return true;
    if (subtitle.toLowerCase().includes(this.search)) return true;
    if (author.name.toLowerCase().includes(this.search)) return true;
    if (tags.some(tag => tag.toLowerCase().includes(this.search))) return true;
    return false;
  }

  lessonHtml (lesson) {
    const {
      author,
      description,
      lessonTime,
      preparationTime,
      subtitle,
      tags,
      thumbnail,
      title,
      url,
    } = lesson;

    return `
      <div class="lesson-card">
        <img src="${author.image ? author.image : DEFAULT_PROFILE_IMAGE }" />
        <div class="card-title">
          <h1>${title}</h1>
          <h2>${subtitle}</h2>
          <p>${author.name}</p>
        </div>
        <p class="card-description">${lesson.description}</p>
        <div class="card-tags">
          <p>Tags:&nbsp;</p>
          ${tags.map(tag => `<span class="card-tag">${tag}</span>`)}
        </div>
        <div class="card-button">
          <a href="${lesson.url}">Go to lesson</a>
        </div>
      </div>
    `;
  }

  renderLessons () {
    this.lessonsElement.empty();
    this.filteredLessons.forEach(lesson => {
      this.lessonsElement.append(this.lessonHtml(lesson));
    });
  }

  updateSearch (searchString) {
    this.search = searchString.toLowerCase();
    this.renderLessons();
  }
}

fetch('/lessons.json')
  .then(results => results.json())
  .then(results => {
    const lessons = results.map(lesson => ({ ...lesson, tags: lesson.tags.split(', ') }));
    const searchElement = $('#lesson-search');
    const lessonsElement = $('.lesson-list');

    new LessonFilter({
      lessons,
      lessonsElement,
      searchElement,
    });
  });
