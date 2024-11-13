exports.globalMiddleware = (req, res, next) => {
  // 'locals' variable is accessible in all views/routes
  res.locals.errors = req.flash("errors"); // all error messages is going here!
  res.locals.success = req.flash("success");
  res.locals.user = req.session.user;
  next();
};

exports.otherMiddleware = (req, res, next) => {
  next();
};

exports.checkCsrfError = (err, req, res, next) => {
  console.log(err);

  if (err) return res.render("404");
};

exports.csrfMiddleware = (req, res, next) => {
  // it will add a CSRF token to all requests
  res.locals.csrfToken = req.csrfToken();
  next();
};

// Middleware to check if the user is logged in
exports.loginRequired = (req, res, next) => {
  if (!req.session.user) {
    req.flash("errors", "You need to login in!");
    req.session.save(() => res.redirect("/"));
    return;
  }
  next();
};
