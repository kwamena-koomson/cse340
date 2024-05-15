/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController");
const u = require("./utilities/")
const session = require("express-session")
const bodyParser = require("body-parser")
const pool = require('./database/')
const app = express()

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("views", "./views")
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"))

// Index route
app.get("/", baseController.buildHome);

// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"))


app.get("/test", (req, res) => {
  res.render("test", { title: "Test" })
})

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ code: 404, message: 'Sorry, we appear to have lost that page.' })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || "5500"
const host = process.env.HOST || "localhost"

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log(`app listening on http://${host}:${port}`)
})
