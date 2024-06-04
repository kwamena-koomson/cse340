const utilities = require(".") 
const { body, validationResult } = require("express-validator") 
const validate = {} 
const invModel = require("../models/inventory-model") 

/* **********************************
 * Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => { 
    return [
        body("classificationName") 
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please enter a classification name with at least three characters.") 
            .custom(async (classification_name) => { 
                const classificationExists = await invModel.checkExistingClassification(classification_name)
                if (classificationExists) {
                    throw new Error("Classification already exists.")
                }
            }),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => { 
    const { classification_name } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) { 
        let nav = await utilities.getNav()
        const form = await utilities.buildNewClassification()
        res.render("inventory/add-classification", { 
            errors,
            title: "Add New Classification",
            nav,
            form,
            classification_name,
        })
        return
    }
    next() 
}

validate.inventoryRules = () => { 
    return [
        // Validation rules for various fields
    ]
}

validate.checkInventoryData = async (req, res, next) => { 
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) { 
        let nav = await utilities.getNav()
        const selectList = await utilities.buildClassificationList()
        res.render("inventory/add-inventory", { 
            title: "Add New Vehicle",
            nav,
            errors,
            selectList,
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
        })
        return
    }
    next() 
}

module.exports = validate 
