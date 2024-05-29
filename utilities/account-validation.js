const accountModel = require("../models/account-model");
const utilities = require("../utilities");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), 


    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),


      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() 
      .withMessage("Please provide a valid email address.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error("Email already exists. Please log in or use a different email");
        }
      }),

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
      .withMessage("Password does not meet the requirements"),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() 
      .withMessage("Please enter a valid email.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (!emailExists) {
          throw new Error(
            "Email does not exist. Please register or try another email"
          );
        }
      }),

    body("account_password").trim(),
  ];
};

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email, account_password } = req.body;
  let errors = [];
  const passwordMatch = await accountModel.checkAccountPassword(
    account_email,
    account_password
  );
  if (!passwordMatch) {
    let error = new Error("Incorrect password.");
    errors.push(error);
    // throw error
  }
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};



validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), 
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), 

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() 
      .withMessage("Please enter a valid email address"),
  ]
}


validate.changePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[?!.*@])[A-Za-z\d?!.*@]{12,}$/)
      .withMessage("Password does not meet requirements."),
  ]
}



validate.checkEditAccountData = async (req, res, next) => {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const account = await accountModel.getAccountById(account_id)
  if (account_email != account.account_email) {
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExists){
      errors.push("This email already exists. Please log in or use a different email.")
    }
  }
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.render("./account/editaccount", {
      errors,
      title: "Edit Account Information",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

module.exports = validate;