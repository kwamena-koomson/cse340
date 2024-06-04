const invModel = require("../models/inventory-model"); 
const utilities = require("../utilities/"); 
const { inventoryRules } = require("../utilities/management-validation"); 

const invCont = {}; 

/* ***************************
 *  Build management view
 * ************************** */

// Controller function to render the management view
invCont.buildManagement = async function(req, res, next){
    // Getting navigation data
    let nav = await utilities.getNav();
    // Getting management links
    const links = await utilities.getManagementLinks();
    // Building classification select list
    const classificationSelect = await utilities.buildClassificationList();
    // Rendering management view template
    res.render("./inventory/management", {
        title: "Vehicle Management", 
        nav, // Navigation data
        links, // Management links
        error: null,
        classificationSelect, 
    })
}

/* ***************************
 *  Build add classification view
 * ************************** */

// Controller function to render the add classification view
invCont.buildAddClassification = async function(req, res, next){
    // Getting navigation data
    let nav = await utilities.getNav();
    // Building form for adding new classification
    const form = await utilities.buildNewClassification();
    // Rendering add classification view template
    res.render("./inventory/add-classification", {
        title : "Add New Classification", 
        nav, 
        form, 
        errors:null,
    })
}

// Controller function to add a new classification
invCont.addClassification = async function (req, res) {
    // Getting navigation data
    let nav = await utilities.getNav();
    // Extracting classification name from request body
    const {classificationName} = req.body;
    // Adding classification to the database
    const newClassification = await invModel.addClassification(classificationName);
    
    // Handling success or failure of adding classification
    if (newClassification) {
        // Redirecting to management page if successful
        req.flash("notice", `${classificationName} has been added as a classification.`);
        res.redirect("./");
    } else {
        // Rendering add classification view with error if failed
        req.flash("notice", "Classification not added, try again");
        res.status(501).render("inventory/add-classification", {
            title: "Add New Classification", 
            nav, 
        });
    }
}

/* ***************************
 *  Build add inventory view
 * ************************** */

// Controller function to render the add inventory view
invCont.buildAddInventory = async function(req, res, next){
    // Getting navigation data
    let nav = await utilities.getNav();
    // Building classification select list
    const selectList = await utilities.buildClassificationList();
    // Rendering add inventory view template
    res.render("./inventory/add-inventory", {
        title : "Add New Vehicle", 
        nav, 
        selectList, 
        errors:null,
    })
}

// Controller function to add a new vehicle to inventory
invCont.addVehicle = async function(req, res, next){
    // Getting navigation data
    let nav = await utilities.getNav();
    // Extracting vehicle details from request body
    const {
        classification_id, 
        inv_make,
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_year, 
        inv_miles, 
        inv_color
    } = req.body;
    // Adding new vehicle to inventory
    const newVehicle = await invModel.addVehicle(
        classification_id,
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_year, 
        inv_miles, 
        inv_color,
    );
    
    // Handling success or failure of adding vehicle
    if (newVehicle) {
        // Redirecting to management page if successful
        req.flash("notice", `${inv_make} ${inv_model} has been added.`);
        res.redirect("./");
    } else {
        // Rendering add inventory view with error if failed
        req.flash("notice", "Vehicle not added, try again");
        res.status(501).render("inventory/add-inventory", {
            title: "Add New Vehicle", 
            nav, 
        });
    }
}

// Controller function to render inventory by classification view
invCont.buildByClassificationId = async function (req, res, next) {
    // Extracting classification ID from request parameters
    const classification_id = req.params.classificationId;
    // Getting inventory data by classification ID
    const data = await invModel.getInventoryByClassificationId(classification_id);
    // Building classification grid
    const grid = await utilities.buildClassificationGrid(data);
    // Getting navigation data
    let nav = await utilities.getNav();
    // Getting classification name
    const className = data[0].classification_name;
    // Rendering inventory by classification view template
    res.render("./inventory/classification", {
        title: className + " vehicles", 
        nav, 
        grid, 
    })
}

// Controller function to handle requests for building a single inventory page
invCont.BuildSinglePageId = async function(req, res, next) {  
    let reviews;  
    // Extracting vehicle ID from request parameters
    const vehicleId = req.params.singleViewId;
    // Retrieving inventory data for the specified vehicle ID
    const data = await invModel.getInventory(vehicleId);
    // Building a single view of the inventory data
    const singleView = await utilities.BuildSingleView(data);
    const getReviews = await invModel.getReviews(vehicleId)
    reviews = await utilities.reviewInventoryVew(getReviews);

    // Getting navigation data
    let nav = await utilities.getNav();
    // Generating a title for the single view based on the vehicle details
    const className = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
    // Rendering the single view page with the retrieved data
    res.render("./inventory/singleView", {
        title: className, 
        nav, 
        singleView, 
        inv_id: vehicleId,
        reviews,
    });
};

// Controller function to handle server errors
invCont.serverError = (req, res, next) => {
    // Creating an error object
    const error = new Error("yep");
    // Passing the error to the next middleware
    next(error);
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */

// Controller function to get inventory by classification ID in JSON format
invCont.getInventoryJSON = async (req, res, next) => {
    // Extracting classification ID from request parameters
    const classification_id = parseInt(req.params.classification_id);
    // Getting inventory data by classification ID
    const invData = await invModel.getInventory(classification_id);
    // Returning inventory data in JSON format
    if (invData[0].inv_id) {
        return res.json(invData);
    } else {
        // Handling error if no data returned
        next(new Error("No data returned"));
    }
}

// Controller function to render the edit inventory view
invCont.editInventory = async (req, res, next) => {
    // Extracting inventory ID from request parameters
    const inventoryId = parseInt(req.params.inventoryId);
    // Getting navigation data
    let nav = await utilities.getNav();
    // Getting inventory data for the specified ID
    const inventoryData = await invModel.getInventory(inventoryId);
    // Generating inventory name
    const inventoryName = `${inventoryData[0].inv_make} ${inventoryData[0].inv_model}` 
    // Building classification select list
    const selectList = await utilities.buildClassificationList(inventoryData[0].classification_id);
    // Rendering edit inventory view template
    res.render("./inventory/edit-inventory", {
        title : inventoryName + "Edit New Vehicle", 
        nav, // Navigation data
        selectList: selectList, 
        errors:null,
        inv_id: inventoryData[0].inv_id,
        inv_make: inventoryData[0].inv_make,
        inv_model: inventoryData[0].inv_model,
        inv_year: inventoryData[0].inv_year,
        inv_description: inventoryData[0].inv_description,
        inv_image: inventoryData[0].inv_image,
        inv_thumbnail: inventoryData[0].inv_thumbnail,
        inv_price: inventoryData[0].inv_price,
        inv_miles: inventoryData[0].inv_miles,
        inv_color: inventoryData[0].inv_color,
        classification_id: inventoryData[0].classification_id,
    })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */

// Controller function to update inventory data
invCont.updateInventory = async function (req, res, next) {
    // Getting navigation data
    let nav = await utilities.getNav();
    // Extracting inventory details from request body
    const { 
        inv_id, 
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_year, 
        inv_miles, 
        inv_color, 
        classification_id 
    } = req.body;
    // Updating inventory data
    const updateResult = await invModel.updateInventory(
        inv_id,  
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    );

    // Handling success or failure of updating inventory data
    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model;
        req.flash("notice", `The ${itemName} was successfully updated.`);
        res.redirect("/inv/");
    } else {
        // Rendering edit inventory view with error if failed
        const classificationSelect = await utilities.buildClassificationList(classification_id);
        const itemName = `${inv_make} ${inv_model}`;
        req.flash("notice", "Sorry, the insert failed.");
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit " + itemName, 
            nav, 
            classificationSelect: classificationSelect,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        });
    }
}

// Controller function to render the delete confirmation view
invCont.deleteItem = async (req, res, next) => {
    // Extracting inventory ID from request parameters
    const inventoryId = parseInt(req.params.inventoryId);
    // Getting navigation data
    let nav = await utilities.getNav();
    // Getting inventory data for the specified ID
    const inventoryData = await invModel.getInventory(inventoryId);
    // Generating inventory name
    const inventoryName = `${inventoryData[0].inv_make} ${inventoryData[0].inv_model}` 
    // Rendering delete confirmation view template
    res.render("./inventory/delete-confirm", {
        title : inventoryName + "Delete View Vehicle",
        nav, 
        errors:null,
        inv_id: inventoryData[0].inv_id,
        inv_make: inventoryData[0].inv_make,
        inv_model: inventoryData[0].inv_model,
        inv_year: inventoryData[0].inv_year,
        inv_price: inventoryData[0].inv_price,
    })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */

// Controller function to delete inventory data
invCont.deleteInventory = async function (req, res, next) {
    // Extracting inventory ID from request body
    const inv_id = parseInt(req.body.inv_id)
    // Deleting inventory item
    const deleteResult = await invModel.deleteInventoryItem(inv_id)

    // Handling success or failure of deleting inventory data
    if (deleteResult) {
        req.flash("notice", `The item was successfully deleted.`);
        res.redirect("/inv/");
    } else {
        const itemName = `${inv_make} ${inv_model}`;
        req.flash("notice", "Sorry, the delete failed.");
        res.redirect("inv/delete/inv_id");
    }
}

invCont.addReview = async function (req, res,next){
    const { review_description,inv_id, account_id} = req.body;
    const date = new Date();
    const reviewData = await invModel.addReview(review_description, 
                                                date, 
                                                parseInt(inv_id), 
                                                parseInt(account_id)
                                                );
    if (reviewData){
        req.flash("notice", "Review Added");
        res.redirect(`/inv/detail/${inv_id}`);
    }else{
        req.flash("notice", "Adding review failed");
        res.redirect(`/inv/detail/${inv_id}`);
    }
}

module.exports = invCont; 
