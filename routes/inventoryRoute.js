// Needed resources
const express = require ("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const errorController = require("../controllers/errorController")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by single vehicle view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByVehicleId));

// Route to generate an intentional error process
router.get("/error", utilities.handleErrors(errorController.generateError))

module.exports = router