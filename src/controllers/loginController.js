// Whenever 'req.session.user' has user data, it is logged in

const Login = require("../models/LoginModel");

// GET
exports.index = (req, res) => {
  if (req.session.user) res.render("login-loggedin");
  else res.render("login");
};

// Register POST
exports.register = async (req, res) => {
  const login = new Login(req.body); // 'req.body' is an object with the form data
  await login.register();

  try {
    if (login.errors.length > 0) {
      // to display error messages, not to validate
      req.flash("errors", login.errors);
      req.session.save(() => {
        // save section to make sure the flash messages are displayed before redirecting
        return res.redirect("/login/index"); // redirect to route
      });
      return;
    }
    req.flash("success", "Your user has been created successfully!");
    req.session.save(() => {
      return res.redirect("/login/index");
    });
  } catch (e) {
    console.log(e);
    res.render("404");
  }
};

// Login POST
exports.login = async (req, res) => {
  const login = new Login(req.body);
  await login.login();

  try {
    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      req.session.save(() => {
        return res.redirect("/login/index");
      });
      return;
    }
    req.flash("success", "Your are logged in!");
    req.session.user = login.user; // to save the user's data in the session
    req.session.save(() => {
      return res.redirect("/login/index");
    });
  } catch (e) {
    console.log(e);
    res.render("404");
  }
};

// Logout GET
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login/index");
};
