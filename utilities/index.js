const invModel = require("../models/inventory-model")
const Util = {}

/* ***********************************
 * Constructs the nav HTML unordered list
 * *********************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    // console.log(data)
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list += 
            '<a href="/inv/type/' +
            row.classification_id + 
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
            list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **********************************
 * Build the classification view HTML
 * ********************************** */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li class="grid-display">'
            grid += '<A href="../../inv/detail/'+ vehicle.inv_id
            + '" title="View ' + vehicle.inv_year + ' ' + vehicle.inv_make + ' '+ vehicle.inv_model
            + 'details"><img src="' + vehicle.inv_thumbnail
            + '" alt="Image of '+ vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model
            +' on CSE Motors"></a>'
            grid += '<div class="namePrice">'
            grid += '<hr>'
            grid += '<h2 class="vehicleTitle">'
            grid += '<a href="../../inv/detail' + vehicle.inv_id +'" title="View '
            + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span class="priceField">$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **********************************
 * Build the single vehicle inventory view HTML
 * ********************************** */
Util.buildVehicleInfo = async function(data) {
    let grid
    if(data.length > 0) {
        grid = '<div id="vehicle-info">'
        data.forEach(vehicle => {
            grid += '<img src="' + vehicle.inv_image
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
            +' on CSE Motors">'
            grid += '<div class="vehicle-display">'
            grid += '<span class="price"><strong>Price:</strong> $ '
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '<hr class="vehicleInfo">'
            grid += '<p class="description"><strong>Description:</strong> ' + vehicle.inv_description
            grid += '</p>'
            grid += '<span class="vehicleColor"><strong>Color:</strong> ' + vehicle.inv_color 
            grid += '</span>'
            grid += '<br>'
            grid += '<span class="vehicleMiles"><strong>Mileage:</strong> '
            + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</span>'
            grid += '</div>'
            
        })
        grid += '</div>'
    } else {
        grid += '<p class="notice">Sorry, no matcing vehicles could be found.</p>'
    }
    return grid
}

/* ****************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 * **************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util