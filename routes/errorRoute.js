const express = require("express");
const router = express.Router();
const errorController = require("../controllers/errorController");

// Route to trigger the error page
router.get("/", (req, res, next) => {
  // Extract status code from URL query parameter
  let status = req.query.status;
  if (status === '500') {status = parseInt(status)}
  // Convert non-server error codes and string status to 404
  if (status < 400 || status >= 600 || /^[a-zA-Z]+$/.test(status)) {
    status = 406;
  }
  // Delegate rendering logic to the error controller
  errorController.showErrorPage(req, res, next, status);
});

module.exports = router;