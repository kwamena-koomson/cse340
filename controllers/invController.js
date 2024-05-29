const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};


invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;

    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );

    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();

    // Render the classification view with the provided data
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      errors: null,
      grid,
    });
  } catch (error) {
    console.error("Error building classification view:", error);
    res.status(500).send("Internal Server Error"); 
  }
};


invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryByInvId(inv_id);
  const grid = await utilities.buildVehicleGrid(data);
  let nav = await utilities.getNav();


  const vehicleMake = data[0].inv_make;
  const vehicleModel = data[0].inv_model;
  const vehicleYear = data[0].inv_year;
  res.render("./inventory/vehicle", {
    title: vehicleYear + " " + vehicleMake + " " + vehicleModel,
    nav,
    errors: null,
    grid,
  });
};


invCont.buildBrokenPage = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/broken", {
    title: "Oops, error",
    nav,
    errors: null,
  });
};



invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  });
};


invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classSelect = await utilities.getClassSelect();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classSelect,
  });
};



invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};


invCont.buildAddclass = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/addclass", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};


invCont.addClass = async function (req, res, next) {
  const { classification_name } = req.body;

  const regResult = await invModel.addClass(classification_name);
  let nav = await utilities.getNav();

  if (regResult) {
    req.flash("success", "Classification added");
    res.status(200).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
    });
  } else {
    req.flash("error", "Class addition failed");
    res.status(501).render("./inventory/addclass", {
      title: "Add Classification",
      nav,
    });
  }
};


invCont.buildAddvehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classSelect = await utilities.getClassSelect();
  res.render("./inventory/addvehicle", {
    title: "Add Vehicle",
    nav,
    errors: null,
    classSelect,
  });
};



invCont.addVehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classSelect = await utilities.getClassSelect();
  // Extract vehicle information from the request body
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  // Add the new vehicle
  const regResult = await invModel.addVehicle(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  );

  if (regResult) {
    // Flash success message if vehicle is added successfully
    req.flash("success", "Vehicle added");
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
    });
  } else {
    // Flash error message if vehicle addition fails
    req.flash("error", "Vehicle addition failed");
    res.status(501).render("./inventory/addclass", {
      title: "Add Vehicle",
      nav,
      classSelect,
    });
  }
};



invCont.buildVehicleEdit = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.params.inv_id);
  let invData = (await invModel.getInventoryByInvId(inv_id))[0];
  let classSelect = await utilities.getClassSelect(invData.classification_id);
  let name = `${invData.inv_make} ${invData.inv_model}`;


  // Render the edit vehicle view with the provided data
  res.render("./inventory/edit-inventory", {
    title: "Edit " + name,
    nav,
    errors: null,
    classSelect: classSelect,
    inv_make: invData.inv_make,
    inv_model: invData.inv_model,
    inv_year: invData.inv_year,
    inv_description: invData.inv_description,
    inv_image: invData.inv_image,
    inv_thumbnail: invData.inv_thumbnail,
    inv_price: invData.inv_price,
    inv_miles: invData.inv_miles,
    inv_color: invData.inv_color,
    inv_id: invData.inv_id,
  });
};



invCont.updateVehicle = async function (req, res, next) {
  console.log('Received update request:', req.body);
  let nav = await utilities.getNav()
  const { 
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    inv_id
  } = req.body

  const updateResult = await invModel.updateVehicle(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
  )

  if (updateResult) {
    const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`
    const classSelect = await utilities.getClassSelect(classification_id)

    req.flash("success", `${itemName} was successfully updated`)
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      classSelect,
    })
  } else {
    const classSelect = await utilities.getClassSelect(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("error", "Sorry, the insert failed.")
    res.status(501).render("./inventory/editvehicle", {
      title: "Edit " + itemName,
      nav,
      errors: null,
      classSelect: classSelect,
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color,
      inv_id,
    })
  }
}




invCont.buildVehicleDeleteConfirm = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inv_id)
  let invData = (await invModel.getInventoryByInvId(inv_id))[0]
  let name = `${invData.inv_make} ${invData.inv_model}`
  res.render("./inventory/deleteconfirm", {
    title: `Delete ${name}`,
    nav,
    errors: null,
    inv_make: invData.inv_make, 
    inv_model: invData.inv_model, 
    inv_year: invData.inv_year,
    inv_price: invData.inv_price,
    inv_id: invData.inv_id,
  })
}



invCont.deleteVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classSelect = await utilities.getClassSelect()
  const { inv_make, inv_model, inv_year, inv_id } = req.body
  const name = `${inv_make} ${inv_model}`
  const deleteResult = await invModel.deleteVehicle(inv_id)

  if (deleteResult) {
    req.flash("success", `${name} was successfully deleted`)
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      classSelect,
    })
  } else {
    // Flash error message if vehicle deletion fails
    req.flash("error", "Sorry, the deletion failed.")
    res.status(501).render("./inventory/deleteconfirm", {
      title: `Delete ${name}`,
      nav,
      errors: null,
      inv_make, 
      inv_model, 
      inv_year,
      inv_id,
    })
  }
}

module.exports = invCont;