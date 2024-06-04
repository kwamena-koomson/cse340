const express = require('express'); 
const router = express.Router(); 

// Static Routes
// Set up "public" folder / subfolders for static files

// Middleware to serve static files from the "public" folder
router.use(express.static("public"));

// Middleware to serve static files from the "public/css" folder
router.use("/css", express.static(__dirname + "public/css"));

// Middleware to serve static files from the "public/js" folder
router.use("/js", express.static(__dirname + "public/js"));

// Middleware to serve static files from the "public/images" folder
router.use("/images", express.static(__dirname + "public/images"));

module.exports = router; 
