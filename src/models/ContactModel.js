// Model works with the database

const mongoose = require("mongoose");
const validator = require("validator");

// Define the schema for the Contact model, it's a blueprint for the data
const ContactSchema = new mongoose.Schema({
  fName: { type: String, required: true },
  lName: { type: String, required: false, default: "" },
  email: { type: String, required: false, default: "" },
  phone: { type: String, required: false, default: "" },
  createdOn: { type: Date, default: Date.now },
  description: String,
});

// Create the Contact model using the schema, it's a collection of documents
const ContactModel = mongoose.model("Contact", ContactSchema);

// Constructor function to validate the form
function Contact(body) {
  this.body = body;
  this.errors = [];
  this.contact = null;
}
// Register contact
Contact.prototype.register = async function () {
  this.validate();
  if (this.errors.length > 0) return;
  this.contact = await ContactModel.create(this.body); // register contact in db and save in 'this.contact');
};
Contact.prototype.validate = function () {
  this.cleanUp();
  if (!this.body.fName) this.errors.push("First name is required!");
  if (this.body.email && !validator.isEmail(this.body.email))
    this.errors.push("Invalid e-mail!");
  if (!this.body.email && !this.body.phone)
    this.errors.push("At least one contact is required: e-mail or phone.");
};
Contact.prototype.cleanUp = function () {
  for (const key in this.body) {
    if (typeof this.body[key] !== "string") this.body[key] = "";
  }
  // to exclude 'this.body._csrf'
  this.body = {
    lName: this.body.lName,
    fName: this.body.fName,
    email: this.body.email,
    phone: this.body.phone,
  };
};
// Edit contact
Contact.prototype.edit = async function (id) {
  if (typeof id !== "string") return;
  this.validate();

  if (this.errors.length > 0) return;
  this.contact = await ContactModel.findByIdAndUpdate(id, this.body, {
    new: true,
  });
};
// Static functions/methods. It doesn't need to be instantiated to be used so it don't have access to the 'this'
Contact.searchById = async function (id) {
  if (typeof id !== "string") return;
  const contact = await ContactModel.findById(id);
  return contact;
};
// Search contact
Contact.search = async function () {
  const contacts = await ContactModel.find().sort({ createdON: -1 });
  return contacts;
};
// Delete contact
Contact.delete = async function (id) {
  if (typeof id !== "string") return;
  const contact = await ContactModel.findOneAndDelete({ _id: id });
  return contact;
};

module.exports = Contact;
