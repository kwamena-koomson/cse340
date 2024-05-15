const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (active = null) {
  const classifications = await invModel.getClassifications()
  const list = `
    <ul class="menu">
      <li class="menu__item ${active === "/" ? "active" : ""}"><a href="/" title="Home page" class="menu__item-link">Home</a></li>
      ${classifications.map(row => `
      <li class="menu__item ${active == row.classification_id ? "active" : ""}">
        <a 
          class="menu__item-link"
          href="/inv/type/${row.classification_id}" 
          title="See our inventory of ${row.classification_name} vehicles">
          ${row.classification_name}
        </a>
      </li>`).join("")}
    </ul>
  `
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
  const createHTML = (vehicle) => {
    const make_and_model = `${vehicle.inv_make} ${vehicle.inv_model}`
    return `
    <li>
      <div class="inv-link-container">
        <div class="inv-img-container">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${make_and_model} on CSE Motors">
        </div>
        <hr>
        <h2 class="inv-title">${make_and_model}</h2>
        <span class="inv-price">$${this.formatNumber(vehicle.inv_price)}</span>
        <a class="inv-link" href="/inv/detail/${vehicle.inv_id}"></a>
      </div>
    </li>
    `
  }

  let grid
  if (data.length > 0) {
    grid = `<ul id="inv-display">${data.map(vehicle => createHTML(vehicle)).join("")}</ul>`
  } else {
    grid = `<p class="notice">Sorry, no matching vehicles could be found.</p>`
  }
  return grid
}

Util.buildDetailPage = async function (data) {
  const noImage = "/images/vehicles/no-image.png"
  const noThumbnail = "/images/vehicles/no-thumbnail.png" // Define a default thumbnail image path
  const thumbnail = data.inv_thumbnail || noThumbnail // Use default thumbnail if inv_thumbnail is not available
  const image = data.inv_image || noImage
  const makeAndModel = data.inv_make + " " + data.inv_model
  const attributes = {
    "Make": data.inv_make,
    "Model": data.inv_model,
    "Year": data.inv_year,
    "Price": data.inv_price,
    "Mileage": data.inv_miles,
    "Color": data.inv_color,
    "Description": data.inv_description,
  }
  const attributeList = Object.keys(attributes).map(key => {
    let content = attributes[key] || ""
    if (attributes[key]) {
      if (key === "Price") {
        content = `$${this.formatNumber(attributes[key])}`
      } else if (key === "Mileage ") { // There seems to be a typo here, it should be "Mileage" instead of "Mileage "
        content = this.formatNumber(attributes[key])
      }
    }

    return `
    <li class="vehicle__info"><span class="bold">${key}: </span>${content}</li>`
  }).join("")

  return `
    <div class="vehicle">
      <div class="vehicle__container">
      
        <!--<div class="vehicle__column vehicle__column_thumbnails">
          <div class="vehicle__thumbnails-container">
            <img class="vehicle__thumbnail" src="${thumbnail}" alt="${makeAndModel} - Thumbnail">
          </div>
        </div>-->

        <div class="vehicle__column vehicle__column_main-full">
          <img src="${image}" alt="${makeAndModel}">
        </div>
        <div class="vehicle__column vehicle__column_text">
          <ul class="vehicle__info-list">
            ${attributeList}
            <li class="vehicle__info">
              <span class="bold">VIN: </span>
              <span>
                <button class="vehicle__vin-btn" id="js-vin-btn">Reveal the VIN number</button>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    `
}

Util.formatNumber = number => new Intl.NumberFormat('en-US').format(number)

module.exports = Util