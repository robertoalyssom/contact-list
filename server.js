require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session"); // to manage sessions
const MongoStore = require("connect-mongo"); // to store sessions in MongoDB
const mongooseConnection = mongoose.connection; // to access the database connection
const flash = require("connect-flash");
const path = require("path");
const helmet = require("helmet"); // this package helps to secure our application by setting various HTTP headers
const csrf = require("csurf"); // to protect against CSRF attacks
// Import custom modules
const routes = require("./routes");
const {
  globalMiddleware,
  checkCsrfError,
  csrfMiddleware,
} = require("./src/middlewares/middleware");

// Initialize Express app
const app = express();

// Security configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https:", "data:"],
      },
    },
  })
);

// Database connection
mongoose
  .connect(process.env.CONNECTIONSTRING)
  .then(() => {
    console.log("Connected to database now!");
    app.emit("ready");
  })
  .catch((err) => console.log(err));

// Middleware setup
app.use(express.urlencoded({ extended: true })); // to post form data to the server
app.use(express.json()); // to post JSON data to the server
app.use(express.static(path.resolve(__dirname, "public")));
// app.use(globalMiddleware);

// Session configuration to store sessions in MongoDB
const sessionOption = session({
  secret: process.env.SECRET,
  store: new MongoStore({
    mongooseConnection,
    mongoUrl: process.env.CONNECTIONSTRING,
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});
app.use(sessionOption);
app.use(flash());

app.use(globalMiddleware);

//  CSRF protection
app.use(csrf());
app.use(checkCsrfError);
app.use(csrfMiddleware);

// View engine configuration
app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");

// Routes
app.use(routes);

// Server startup
app.on("ready", () => {
  app.listen(3000, () => {
    console.log("Access http://localhost:3000");
    console.log("Server running on port 3000");
  });
});
