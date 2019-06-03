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

let projectImage, projectImageName;
const setProjectImage = image => {
  const reader = new FileReader();
  reader.onloadend = () => {
    projectImageName = image.name;
    projectImage = reader.result;
    $('#projectImageLabel').html('<i class="fa fa-check"></i><br />Image Uploaded!');
  }
  reader.readAsDataURL(image);
};

let projectFile, projectFileName;
const setProjectFile = file => {
  const reader = new FileReader();
  projectFileName = file.name;
  reader.onloadend = () => {
    projectFile = reader.result;
    $('#projectFileLabel').html('<i class="fa fa-check"></i><br />File Uploaded!');
  }
  reader.readAsDataURL(file);
};

const pullRequestURL = '';
const projectImageUploadURL = 'https://ohwy7x30i8.execute-api.us-east-1.amazonaws.com/dev/requestUploadURL';
const projectFileUploadURL = '';

const submitForm = async () => {
  // const parsedImageName = projectImageName.split('.');
  // const imageResponse = await axios.post(projectImageUploadURL, {
  //   name: projectImageName,
  //   type: `image/${parsedImageName[parsedImageName.length - 1]}`,
  // });

  // console.log('response: ', imageResponse);

  // const parsedFileName = projectFileName.split('.');
  // const fileResponse = await axios.post(projectFileUploadURL, {
  //   name: projectFileName,
  //   type: `image/${parsedFileName[parsedFileName.length - 1]}`,
  // });


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
