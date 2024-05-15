// Needed Resources 
const express = require("express")
const router = new express.Router()
const u = require("../utilities/")
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to display vehicle details
router.get("/detail/:vehicleId", invController.showVehicleDetail);

module.exports = router;