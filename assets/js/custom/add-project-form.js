---
---

const initializeForm = () => {
  const form = $("#add-project-form");
  form.validate({
    errorPlacement: (error, element) => element.before(error),
    rules: {
      confirmEmail: {
        equalTo: "#email",
      },
      projectImage: {
        required: true,
      },
      projectFile: {
        required: true,
      },
    },
    messages: {
      projectImage: {
        required: 'Please add a thumbnail image',
      },
      projectFile: {
        required: 'Please upload your project content',
      },
    },
  });
  form.children("div").steps({
    headerTag: "h1",
    bodyTag: "section",
    transitionEffect: "slideLeft",
    onStepChanging: (event, currentIndex, newIndex) => {
      form.validate().settings.ignore = ":disabled,:hidden";
      return form.valid();
    },
    onFinishing: (event, currentIndex) => {
      form.validate().settings.ignore = ":disabled";
      return form.valid();
    },
    onFinished: (event, currentIndex) => {
      submitForm();
    },
  });
  form.removeClass('hidden');
}

let name;
const setName = value => name = value;

let email;
const setEmail = value => email = value;

let title;
const setTitle = value => title = value;

let subtitle;
const setSubtitle = value => subtitle = value;

let description;
const setDescription = value => description = value;

let tags;
const setTags = tagsString => tags = tagsString.split(',');

let audience;
const setAudience = value => audience = value;

let difficulty;
const setDifficulty = value => difficulty = value;

let preparationTime;
const setPreparationTime = value => preparationTime = value;

let projectTime;
const setProjectTime = value => projectTime = value;

let type;
const setType = value => type = value;

let projectImage, projectImageName, projectImageType;
const setProjectImage = image => {
  const reader = new FileReader();
  projectImageName = `${Date.now()}-${image.name}`;
  projectImageType = image.type;
  reader.onloadend = () => {
    projectImage = reader.result;
    $('#projectImageLabel').html('<i class="fa fa-check"></i><br />Image Uploaded!');
  }
  reader.readAsArrayBuffer(image);
};

let projectFile, projectFileName, projectFileType;
const setProjectFile = file => {
  const reader = new FileReader();
  projectFileName = `${Date.now()}-${file.name}`;
  projectFileType = file.type;
  reader.onloadend = () => {
    projectFile = reader.result;
    $('#projectFileLabel').html('<i class="fa fa-check"></i><br />File Uploaded!');
  }
  reader.readAsArrayBuffer(file);
};

const projectImageUploadURL = 'https://ohwy7x30i8.execute-api.us-east-1.amazonaws.com/dev/requestUploadURL_pics';
const projectFileUploadURL = 'https://ohwy7x30i8.execute-api.us-east-1.amazonaws.com/dev/requestUploadURL_content';
const pullRequestURL = 'https://p3keskibu8.execute-api.us-east-1.amazonaws.com/dev/posts';

const submitForm = async () => {
  const imageResponse = await axios.post(
    projectImageUploadURL,
    {
      name: projectImageName,
      type: projectImageType,
    }
  );
  const imageUploadResponse = await axios.put(
    imageResponse.data.uploadURL,
    projectImage,
    {
      'Content-Type': projectImageType,
    }
  );
  // const fileResponse = await axios.post(
  //   projectFileUploadURL,
  //   {
  //     name: projectFileName,
  //     type: projectFileType,
  //   }
  // );
  // const fileUploadResponse = await axios.put(
  //   fileResponse.data.uploadURL,
  //   projectFile,
  //   {
  //     'Content-Type': projectFileType,
  //   }
  // );

  const pullRequestData = {
    audience,
    author: name,
    description,
    difficulty,
    email,
    filename: projectFileName,
    group: '',
    layout: 'project',
    preparation_time: preparationTime,
    project_time: projectTime,
    subtitle,
    tags,
    thumbnail: projectImageName,
    title,
    type,
    url: `${Date.now()}-${parseInt(Math.random() * 1000000)}`,
  };

  const pullRequestResponse = await axios.post(
    pullRequestURL,
    pullRequestData,
    {
      'Content-Type': 'application/json',
    }
  );
}

fetch('{{site.baseurl}}/tags.json')
  .then(response => response.json())
  .then(tags => {
    initializeForm(); // need to set up query-steps before selectize, otherwise it will wipe out the tag options

    const tagSelector = $('#tagSelector').selectize({
      create: false,
      delimiter: ',',
      labelField: 'value',
      options: tags.map(tag => ({ value: tag })),
      persist: false,
      searchField: ['value'],
      valueField: 'value',
    });

    const nameSelector = $('#name');
    const emailSelector = $('#email');
    const titleSelector = $('#title');
    const subtitleSelector = $('#subtitle');
    const descriptionSelector = $('#description');
    const projectImageSelector = $('#projectImage');
    const projectFileSelector = $('#projectFile');

    const audienceSelector = $('.audience-filter');
    const difficultySelector = $('.difficulty-filter');
    const preparationTimeSelector = $('.preparation-time-filter');
    const projectTimeSelector = $('.project-time-filter');
    const typeSelector = $('.type-filter');

    nameSelector.on('change', event => setName(event.target.value));
    emailSelector.on('change', event => setEmail(event.target.value));
    titleSelector.on('change', event => setTitle(event.target.value));
    subtitleSelector.on('change', event => setSubtitle(event.target.value));
    descriptionSelector.on('change', event => setDescription(event.target.value));
    tagSelector.on('change', event => setTags(event.target.value));
    projectImageSelector.on('change', event => setProjectImage(event.target.files[0]));
    projectFileSelector.on('change', event => setProjectFile(event.target.files[0]));
    audienceSelector.on('change', event => setAudience(event.target.value));
    difficultySelector.on('change', event => setDifficulty(event.target.value));
    preparationTimeSelector.on('change', event => setPreparationTime(event.target.value));
    projectTimeSelector.on('change', event => setProjectTime(event.target.value));
    typeSelector.on('change', event => setType(event.target.value));
  });
