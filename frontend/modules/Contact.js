import validator from "validator";

export default class Contact {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
  }
  init() {
    this.event();
  }
  event() {
    if (!this.form) return; // pages without this form will stop here

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.validate();
    });
  }
  validate() {
    const fNameInput = this.form.querySelector("input[name='fName']");
    const emailInput = this.form.querySelector("input[name='email']");
    const phoneInput = this.form.querySelector("input[name='phone']");
    const spanArr = this.form.querySelectorAll("span");
    let error = false;

    if (spanArr.length > 0) spanArr.forEach((span) => span.remove()); // remove all span elements before fields validation
    if (fNameInput.value.length === 0) {
      this.warningMsg(fNameInput);
      error = true;
    }
    if (emailInput.value && !validator.isEmail(emailInput.value)) {
      this.warningMsg(emailInput);
      error = true;
    }
    if (!emailInput.value && !phoneInput.value) {
      this.warningMsg(emailInput);
      this.warningMsg(phoneInput);
      error = true;
    }
    if (!error) this.form.submit();
  }
  warningMsg(input) {
    const span = document.createElement("span");
    span.classList.add("text-danger", "mt-2");

    if (input.name === "fName" && !input.nextElementSibling) {
      span.textContent = "First name is required!";
      input.insertAdjacentElement("afterend", span);
    }
    if (input.name === "email" && input.value && !input.nextElementSibling) {
      span.textContent = "Invalid e-mail!";
      input.insertAdjacentElement("afterend", span);
    }
    if (input.name === "email" && !input.value && !input.nextElementSibling) {
      span.textContent = "At least one contact is required: e-mail or phone.";
      input.insertAdjacentElement("afterend", span);
    }
    if (input.name === "phone" && !input.nextElementSibling) {
      span.textContent = "At least one contact is required: e-mail or phone.";
      input.insertAdjacentElement("afterend", span);
    }
  }
}
