// Needed Resources 
const express = require("express"); 
const router = new express.Router(); 
const accountController = require("../controllers/accountController"); 
const utilities = require("../utilities"); 
const regValidate = require('../utilities/account-validation'); 
const { render } = require("ejs"); 


// Route to handle requests for building login view
router.get(
    "/login", 
    utilities.handleErrors(accountController.buildLogin));

// Route to handle requests for building registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to handle requests for building the account view
router.get("/", 
        utilities.checkLogin, 
        utilities.handleErrors(accountController.buildAccount) 
        );

router.get("/update", utilities.handleErrors(accountController.buildUpdateAccount))


router.get("/logout", utilities.handleErrors(accountController.logout));

router.get("/review/edit/:inv_id", utilities.handleErrors(accountController.editReview));
router.get("/review/delete/:inv_id", utilities.handleErrors(accountController.deleteReview));

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(), 
    regValidate.checkRegData, 
    utilities.handleErrors(accountController.registerAccount) 
);

router.post(
    "/review/edit",
    regValidate.reviewRules(), 
    regValidate.checkReviewData,
    utilities.handleErrors(accountController.UpdateReview))
router.post(
    "/review/delete", 
    utilities.handleErrors(accountController.DeleteReviewConfirm))

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(), 
    regValidate.checkLoginData, 
    utilities.handleErrors(accountController.accountLogin) 
);

router.post("/update", utilities.handleErrors(accountController.updateAccount))

module.exports = router; 
