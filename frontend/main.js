import "core-js/stable";
import "regenerator-runtime/runtime";
// import "./assets/css/style.css";
import Login from "./modules/Login";
import Contact from "./modules/Contact";

const login = new Login(".form-login");
const register = new Login(".form-register");
login.init();
register.init();

const contact = new Contact(".contact-form");
contact.init();
