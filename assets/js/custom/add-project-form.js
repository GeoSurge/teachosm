const form = $("#add-project-form");
form.validate({
  errorPlacement: (error, element) => element.before(error),
  rules: {
    confirmEmail: {
      equalTo: "#email"
    }
  }
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
