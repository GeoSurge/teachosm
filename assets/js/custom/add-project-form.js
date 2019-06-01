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
      alert("Submitted!");
    },
  });
  form.removeClass('hidden');
}

let tags;
const setTags = tagsString => {
  tags = tagsString.split(',');
}

let projectImage;
const setProjectImage = image => {
  const reader = new FileReader();
  reader.onloadend = () => {
    projectImage = reader.result;
    $('#projectImageLabel').html('<i class="fa fa-check"></i><br />Image Uploaded!');
  }
  reader.readAsDataURL(image);
};

let projectFile;
const setProjectFile = file => {
  const reader = new FileReader();
  reader.onloadend = () => {
    projectFile = reader.result;
    $('#projectFileLabel').html('<i class="fa fa-check"></i><br />File Uploaded!');
  }
  reader.readAsDataURL(file);
};


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

    const projectImageSelector = $('#projectImage');
    const projectFileSelector = $('#projectFile');

    tagSelector.on('change', event => setTags(event.target.value));
    projectImageSelector.on('change', event => setProjectImage(event.target.files[0]));
    projectFileSelector.on('change', event => setProjectFile(event.target.files[0]));
  });
