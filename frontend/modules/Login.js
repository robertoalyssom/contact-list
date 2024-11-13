import validator from "validator";

export default class Login {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
  }
  init() {
    this.events();
  }
  events() {
    if (!this.form) return;

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.validate(e);
    });
  }
  validate(e) {
    const el = e.target;
    const emailImput = el.querySelector("input[name='email']");
    const passwordImput = el.querySelector("input[name='password']");
    const spanMsg = el.querySelector("span.text-danger");
    let error = false;

    if (spanMsg) spanMsg.remove();
    if (!validator.isEmail(emailImput.value)) {
      this.warningMsg(emailImput);
      error = true;
    }
    if (spanMsg) spanMsg.remove();
    if (passwordImput.value.length < 3 || passwordImput.value.length > 50) {
      this.warningMsg(passwordImput);
      error = true;
    }
    if (!error) el.submit();
  }
  warningMsg(input) {
    const span = document.createElement("span");
    span.classList.add("text-danger", "mt-1");
    if (input.name === "email" && !input.nextElementSibling) {
      span.textContent = "Invalid e-mail!";
      input.insertAdjacentElement("afterend", span);
    }
    if (input.name === "password" && !input.nextElementSibling) {
      span.textContent = "The password requires between 3 and 50 characters!";
      input.insertAdjacentElement("afterend", span);
    }
  }
}
