// Model works with the database.

const mongoose = require("mongoose");
const validator = require("validator"); // to validate email field
const bcryptjs = require("bcryptjs"); // to encrypt password

// Define the schema for the Login model, it's a blueprint for the data
const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// Create the Login model using the schema, it's a collection of documents
const LoginModel = mongoose.model("Login", LoginSchema);

// Login class to validate form data
class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }
  async register() {
    this.validate();
    if (this.errors.length > 0) return; // check 1 (form's field data)
    await this.userExists();

    if (this.errors.length > 0) return; // check 2 (userExists())

    const salt = bcryptjs.genSaltSync();
    const hash = bcryptjs.hashSync(this.body.password, salt);
    this.body.password = hash; // to hide password on db

    this.user = await LoginModel.create(this.body);
  }
  validate() {
    this.cleanUp();
    if (!validator.isEmail(this.body.email)) {
      this.errors.push("Invalid e-mail!");
    }
    if (this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push("The password requires between 3 and 50 characters!");
    }
  }
  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") this.body[key] = "";
    }
    // to exclude 'this.body._csrf'
    this.body = {
      email: this.body.email,
      password: this.body.password,
    };
  }
  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email });
    if (this.user) this.errors.push("This user already exists!");
  }
  async login() {
    this.validate();
    if (this.errors.length > 0) return;

    this.user = await LoginModel.findOne({ email: this.body.email });
    if (!this.user) return this.errors.push("User does not exist!");

    const isPassword = bcryptjs.compareSync(
      this.body.password,
      this.user.password
    );
    if (!isPassword) {
      this.errors.push("Incorrect password!");
      this.user = null;
      return;
    }
  }
}

module.exports = Login;
