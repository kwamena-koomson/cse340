

const accountModel = require("../models/account-model"); 
const utilities = require("../utilities/"); 
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 
require("dotenv").config(); 

// Render the login page
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav(); 
  res.render("account/login", {
    title: "Login", 
    nav, 
    errors: null, 
  });
}

/* ****************************************
 *  Process Login request
 * *************************************** */
async function loginAccount(req, res) {
  let nav = await utilities.getNav(); 
  const { account_email, account_password } = req.body; 

  // Hash the password before storing
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Apologies, an error occurred while processing your registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  // Attempt to log in the user with the hashed password
  const regResult = await accountModel.loginAccount(
    account_email,
    hashedPassword
  );


  if (regResult) {
    req.flash("success", "You're logged in!");
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("error", "Login failed.");
    // If login fails, render the login page with an error message
    res.status(501).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  }
}

// Render the registration page
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav(); 
  res.render("account/register", {
    title: "Register", 
    nav, 
    errors: null, 
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res, next) {
  try {
    let nav = await utilities.getNav(); 
    const {
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    } = req.body; 

    const hashedPassword = await bcrypt.hash(account_password, 10);

    // Register the account
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult.rowCount) {
      req.flash(
        "success",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      return res.status(201).redirect("/account/account");
    } else {
      req.flash("error", "Unfortunately, the registration was unsuccessful.");
      return res.status(500).render("account/register", {
        title: "Register",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    next(error); 
  }
}


async function accountLogin(req, res) {
  let nav = await utilities.getNav(); 
  const { account_email, account_password } = req.body; 
  const accountData = await accountModel.getAccountByEmail(account_email); 
  if (!accountData) {
    req.flash("notice", "Please verify your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password; 
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 } 
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/account"); 
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}




async function buildAccount(req, res, next) {
  try {
    let nav = await utilities.getNav(); 
    res.render("account/account", {
      title: "Account", 
      nav, 
      errors: null, 
    });
  } catch (error) {
    next(error); 
  }
}


async function buildEditAccount(req, res, next) {
  try {
    const nav = await utilities.getNav(); 
    const { account_firstname, account_lastname, account_email } = res.locals.accountData; 
    const account_id = parseInt(req.params.account_id, 10); 
    console.log("Building edit account view for account ID:", account_id);
    
    res.render("account/editaccount", {
      title: "Edit Account Information", 
      nav, 
      errors: null, 
      account_firstname, 
      account_lastname, 
      account_email, 
      account_id, 
    });
  } catch (error) {
    next(error); 
  }
}


async function editAccountInfo(req, res) {
  let nav = await utilities.getNav(); 
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body; 

  // Update account info in the database
  const regResult = await accountModel.updateAccountInfo(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );
  if (regResult) {
    res.clearCookie("jwt");
    const accountData = await accountModel.getAccountById(account_id);
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 3600 * 1000,
    });
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });

    req.flash(
      "success",
      `Congratulations, ${account_firstname} you have successfully updated your account info.`
    );
    res.status(201).render("account/account", {
      title: "Edit Account Information",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    });
  } else {
    req.flash("error", "Sorry, the update failed.");
    res.status(501).render("account/editaccount", {
      title: "Edit Account Information",
      nav,
      errors: null,
      account_firstname: account_firstname,
      account_lastname: account_lastname,
      account_email: account_email,
    });
  }
}


async function editAccountPassword(req, res) {
  let nav = await utilities.getNav(); 
  const { account_password, account_id } = req.body; 

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash

("notice", 'Sorry, there was an error processing the registration.');
    return res.status(500).render("account/editaccount", {
      title: "Edit Account Information",
      nav,
      errors: null,
    });
  }

  // Update the password in the database
  const regResult = await accountModel.changeAccountPassword(hashedPassword, account_id);

  if (regResult) {
    const account = await accountModel.getAccountById(account_id);
    req.flash("success", `Congratulations, ${account.account_firstname}, you have successfully updated your account info.`);
    return res.status(201).render("account/account", {
      title: "Account Information",
      nav,
      errors: null,
      account_firstname: account.account_firstname,
    });
  } else {
    const account = await accountModel.getAccountById(account_id);
    req.flash("error", "Sorry, the update failed.");
    // If update fails, render the edit account page with an error message
    return res.status(501).render("account/editaccount", {
      title: "Edit Account Information",
      nav,
      errors: null,
    });
  }
}



async function logoutAccount(req, res, next) {
  res.clearCookie("jwt"); 
  res.redirect("/"); 
  return;
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  loginAccount,
  accountLogin,
  buildAccount,
  buildEditAccount,
  editAccountInfo,
  editAccountPassword,
  logoutAccount
};
