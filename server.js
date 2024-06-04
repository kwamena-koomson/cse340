const utilities = require("./utilities/")
/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
// Importing required modules
const express = require("express"); 
const expressLayouts = require("express-ejs-layouts"); 
const env = require("dotenv").config(); 
const app = express(); 
const static = require("./routes/static"); 
const inventoryRoute = require("./routes/inventoryRoute"); 
const baseController = require("./controllers/baseController"); 
const session = require("express-session"); 
const pool = require('./database/'); 
const accountRoute = require("./routes/accountRoute"); 
const bodyParser = require("body-parser"); 
const cookieParser = require("cookie-parser"); 
const favicon = require('serve-favicon');



/* ***********************
 * View Engine and Templates
 *************************/
// Set the view engine to EJS
app.set("view engine", "ejs");

// Use Express EJS layouts
app.use(expressLayouts);

// Set the layout file for all views
app.set("layout", "./layouts/layout");


/* ***********************
 * Middleware
 * ************************/
// Session middleware setup
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    // Create session table if missing
    createTableIfMissing: true,
    // Use the provided PostgreSQL connection pool
    pool,
  }),
  // Secret for session signing
  secret: process.env.SESSION_SECRET,
  // Forces the session to be saved back to the session store
  resave: true,
  // Forces a session that is "uninitialized" to be saved to the store
  saveUninitialized: true,
  // Name of the session ID cookie
  name: 'sessionId',
}));

// Express Messages Middleware
app.use(require('connect-flash')());
// Middleware to expose flash messages to views
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Parse JSON bodies
app.use(bodyParser.json());
// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());
// Middleware to check JWT token validity
app.use(utilities.checkJWTToken);

const auth = (req, res, next) => {
  if (res.locals.accountData && (res.locals.accountData.account_type === "Employee" || res.locals.accountData.account_type === "Admin")) {   
    next();
  } else {
    // If account type is not allowed, render login page with appropriate message
    res.redirect("account/login")
  }
};
/* ***********************
 * Routes
 *************************/
// Serve static files
app.use(static);

/* ***********************
 * Index Route
 * req: incoming request traffic from the browser
 * res: outgoing response traffic going from the application to the browser
 *************************/
// Handle requests to the root URL
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
// Mount inventory routes under the '/inv' prefix
app.use("/inv", inventoryRoute, auth);
// Route for intentional server error
app.use("/serverError", inventoryRoute);

// Account routes
// Mount account routes under the '/account' prefix
app.use("/account", accountRoute);

// File Not Found Route - must be the last route in the list
// Handle requests for paths that do not match any defined route
app.use(async (req, res, next) => {
  // Pass a 404 status code and a message to the error-handling middleware
  next({status: 404, message: "404 - you got lost?"});
});



/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oops! Something went wrong. How about trying a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;


/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app is listening on ${host}:${port}`)
});