const Contact = require("../models/ContactModel");

exports.index = (req, res) => {
  res.render("contacts", { contact: {} });
};

exports.register = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.register(); // to register

    if (contact.errors.length > 0) {
      req.flash("errors", contact.errors);
      req.session.save(() => res.redirect("/contact/index"));
      return;
    }
    req.flash("success", "Contact regitered successfully!");
    req.session.save(() => {
      res.redirect(`/contacts/index/${contact.contact._id}`); // redirect to the contact page with the contact's ID...
    });
    return;
  } catch (e) {
    return res.render("404");
  }
};

exports.editIndex = async (req, res) => {
  if (!req.params.id) return res.render("404");
  const contact = await Contact.searchById(req.params.id); // ... and pass it to searchById...

  if (!contact) return res.render("404");
  res.render("contacts", { contact }); // ... and then pass it to the view
};

exports.edit = async (req, res) => {
  try {
    if (!req.params.id) return res.render("404");
    const contact = new Contact(req.body);
    await contact.edit(req.params.id); // to edit

    if (contact.errors.length > 0) {
      req.flash("errors", contact.errors);
      req.session.save(() => res.redirect("/contact/index"));
      return;
    }
    req.flash("success", "Contact edited successfully!");
    req.session.save(() => {
      res.redirect(`/contacts/index/${contact.contact._id}`); // redirect to the contact page with the contact's ID...
    });
    return;
  } catch (e) {
    res.render("404");
  }
};

exports.delete = async (req, res) => {
  try {
    if (!req.params.id) return res.render("404");

    const contact = await Contact.delete(req.params.id);
    if (!contact) return res.render("404");

    req.flash("success", "Contact was deleted successfully!");
    req.session.save(() => res.redirect("/"));
    return;
  } catch (e) {
    res.render("404");
  }
};
