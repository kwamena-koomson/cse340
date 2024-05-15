const invModel = require("../models/inventory-model");
const Util = require("../utilities/");
const invCont = {};

// Function to build the inventory by classification view
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    
    // Check if data is empty
    if (data.length === 0) {
      throw new Error("No data found for the given classification ID.");
    }
    
    const grid = await Util.buildClassificationGrid(data);
    let nav = await Util.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

invCont.showVehicleDetail = async function(req, res, next) {
  try {
    const vehicleId = req.params.vehicleId;
    const vehicle = await invModel.getInventoryItemById(vehicleId);

    // Assuming vehicle includes 'attributes' property
    let nav = await Util.getNav();
    vehicle.inv_price = Number(vehicle.inv_price);
    
    // Assuming attributes is an object containing various vehicle attributes
    const attributes = {
      "Make": vehicle.inv_make,
      "Model": vehicle.inv_model,
      "Year": vehicle.inv_year,
      "Price": vehicle.inv_price,
      "Mileage": vehicle.inv_miles,
      "Color": vehicle.inv_color,
      "Description": vehicle.inv_description,
      // Add more attributes as needed
    };

    res.render("./inventory/vehicleDetail", {
      title: vehicle.inv_make + " " + vehicle.inv_model,
      nav,
      vehicle,
      thumbnail: vehicle.inv_thumbnail, // Assuming thumbnail is stored in 'inv_thumbnail' property
      makeAndModel: vehicle.inv_make + " " + vehicle.inv_model, // Construct makeAndModel property
      image: vehicle.inv_image, // Pass the 'image' property
      attributes: attributes // Pass the 'attributes' object
    });    
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;


