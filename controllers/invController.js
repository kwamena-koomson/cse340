const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ******************************
 * Build inventory by classification view
 * ****************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    // console.log(className)
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid
    })
}

/* ********************************
 * Build inventory by single vehicle view
 * ******************************** */
invCont.buildByVehicleId = async function (req, res, next) {
    const inv_id = req.params.inventoryId
    const response = await invModel.getInventoryByInventoryId(inv_id)
    const buildArea = await utilities.buildVehicleInfo(response)
    let nav = await utilities.getNav()
    const vehicleName = response[0].inv_year + ' ' + response[0].inv_make + ' ' + response[0].inv_model
    // console.log(vehicleName)
    res.render("./inventory/inventory", {
        title: vehicleName,
        nav,
        buildArea
    })
}

module.exports = invCont