const pool = require("../database/");


async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    // SQL query to insert new account into the database
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
    return result;
  } catch (error) {
    console.error("Error en registerAccount:", error.message);
    throw new Error(error.message);
  }
}



async function loginAccount(account_email, account_password) {
  try {
    // SQL query to select account with provided email and password
    const sql =
      "SELECT * FROM account WHERE account_email = $1 AND account_password = $2";
    const accountMatch = await pool.query(sql, [
      account_email,
      account_password,
    ]);
    return accountMatch.rows;
  } catch (error) {
    return error.message;
  }
}



async function checkExistingEmail(account_email) {
  try {
    // SQL query to check if account with given email already exists
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}


async function checkAccountPassword(account_email, account_password) {
  try {
    // SQL query to check if account with given email and password exists
    const sql =
      "SELECT * FROM account WHERE account_email = $1 AND account_password = $2";
    const attemptMatch = await pool.query(sql, [
      account_email,
      account_password,
    ]);
    return attemptMatch.rowCount;
  } catch (error) {
    return error.message;
  }
}



async function getAccountByEmail(account_email) {
  try {
    // SQL query to select account data by email
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}



async function getAccountById(account_id) {
  try {
    // get account info on account_id, returns 0 or 1 AND all account info
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1",
      [account_id]
    );

    return result.rows[0];
  } catch (error) {
    return new Error("No matching account found");
  }
}


async function updateAccountInfo(
  account_firstname,
  account_lastname,
  account_email,
  account_id
) {
  try {
    const result = await pool.query(
      "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4",
      [account_firstname, account_lastname, account_email, account_id]
    );
    return result.rowCount;
  } catch (error) {
    console.error("updateaccountinfo error " + error);
  }
}


async function changeAccountPassword(account_password, account_id) {
  try {
    const result = await pool.query(
      "UPDATE account SET account_password = $1 WHERE account_id = $2",
      [account_password, account_id]
    );
    return result.rowCount;
  } catch (error) {
    console.error("changeaccountpassword error " + error);
  }
}


module.exports = {
  registerAccount,
  loginAccount,
  checkExistingEmail,
  checkAccountPassword,
  getAccountByEmail,
  getAccountById,
  updateAccountInfo,
  changeAccountPassword
};