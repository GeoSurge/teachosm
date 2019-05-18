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

fetch('/tags.json')
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

    tagSelector.on('change', event => console.log('tag: ', event.target.value));
  });
