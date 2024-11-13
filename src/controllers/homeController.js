// controler is responsible for handling the logic for each route.

const Contact = require("../models/ContactModel");

exports.index = async (req, res) => {
  res.locals.contacts = await Contact.search();
  res.render("index");
  return;
};
