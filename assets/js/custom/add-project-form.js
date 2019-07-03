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

let projectImage, projectImageName, projectImageType;
const setProjectImage = image => {
  const reader = new FileReader();
  projectImageName = image.name;
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
  projectFileName = file.name;
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
  const parsedImageName = projectImageName.split('.');
  const imageResponse = await axios.post(projectImageUploadURL, {
    name: projectImageName,
    type: projectImageType,
  });
  // console.log('type: ', projectImageType);
  const imageUploadResponse = await axios.put(imageResponse.data.uploadURL, projectImage, {
    'Content-Type': projectImageType,
  });

  const parsedFileName = projectFileName.split('.');
  const fileResponse = await axios.post(projectFileUploadURL, {
    name: projectFileName,
    type: projectFileType,
  });
  const fileUploadResponse = await axios.put(fileResponse.data.uploadURL, projectFile, {
    'Content-Type': projectFileType,
  });

  const pullRequestURL = await axios.post(metadataUploadURL, {

  });
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

    nameSelector.on('change', event => setName(event.target.value));
    emailSelector.on('change', event => setEmail(event.target.value));
    titleSelector.on('change', event => setTitle(event.target.value));
    subtitleSelector.on('change', event => setSubtitle(event.target.value));
    descriptionSelector.on('change', event => setDescription(event.target.value));
    tagSelector.on('change', event => setTags(event.target.value));
    projectImageSelector.on('change', event => setProjectImage(event.target.files[0]));
    projectFileSelector.on('change', event => setProjectFile(event.target.files[0]));
  });
