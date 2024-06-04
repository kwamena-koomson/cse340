const utilities = require(".") 
const { body, validationResult } = require("express-validator") 
const validate = {} 
const accountModel = require("../models/account-model") 

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () => { 
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), 
    
        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), 
    
        // valid email is required and cannot already exist in the database
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail() 
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists){
                    throw new Error("Email exists. Please log in or use different email")
                }
            }),
    
        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ********************************************************
 * Check data and return errors or continue to registration
 * ********************************************************/
validate.checkRegData = async (req, res, next) => { 
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/* **********************************
*  Login Data Validation Rules
* ********************************* */
validate.loginRules = () => { 
    return [    
        // valid email is required and cannot already exist in the database
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail() 
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (!emailExists){
                    throw new Error("Email or Password Incorrect.")
                }
            }),
    ]
}

/* *************************************************
 * Check data and return errors or continue to login
 * ************************************************* */
validate.checkLoginData = async (req, res, next) => { 
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
        return
    }
    next()
}

validate.reviewRules = () => {
    return [
        body("review_text")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please enter a review text"),
    ]
}
validate.checkReviewData = async (req, res, next) => {
    const {review_text, review_date, review_id, inv_id} = req.body;
    const account_id = res.locals.accountData.account_id;
    const getReview = await accountModel.getReview(account_id,inv_id);
    const vehicleName = `${getReview[0].inv_year} ${getReview[0].inv_make} ${getReview[0].inv_model}`;
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()){
        let nav = await utilities.getNav()
        res.render(`account/update-review`, {
            errors,
            title: "Edit " + vehicleName,
            nav,
            reviewText: review_text,
            date : review_date,
            inv_id,
            review_id,
        })
        return
    }
    next()
}
module.exports = validate 
