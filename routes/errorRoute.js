const express = require("express");
const router = express.Router();
const errorController = require("../controllers/errorController");

// Route to trigger the error page
router.get("/", (req, res, next) => {

  let status = req.query.status;
  if (status === '500') {status = parseInt(status)}

  if (status < 400 || status >= 600 || /^[a-zA-Z]+$/.test(status)) {
    status = 406;
  }

  errorController.showErrorPage(req, res, next, status);
});

module.exports = router;