const pool = require("../database/"); 

// Function to register an account in the database
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
        // SQL query to insert account details into the database
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        // Executing the SQL query with account details and returning the result
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        // Returning error message if registration fails
        return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
        // SQL query to check if the email exists in the database
        const sql = "SELECT * FROM account WHERE account_email = $1"
        // Executing the SQL query with the email and returning the count of rows
        const email = await pool.query(sql, [account_email])
        return email.rowCount
    } catch (error) {
        // Returning error message if an error occurs
        return error.message
    }
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail (account_email) {
    try {
        // SQL query to retrieve account data based on email
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
            [account_email])
        return result.rows[0] 
    } catch (error) {
        // Returning error message if no matching email is found
        return new Error("No matching email found")
    }
}

/* **********************
 *   Check for existing password
 * ********************* */
async function checkExistingPassword(account_email){
    try {
        // SQL query to check if the password exists in the database
        const sql = "SELECT * FROM account WHERE account_password = $1"
        // Executing the SQL query with the password and returning the count of rows
        const password = await pool.query(sql, [account_email])
        return password.rowCount
    } catch (error) {
        // Returning error message if an error occurs
        return error.message
    }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateAccount(
    account_firstname, 
    account_lastname, 
    account_email,
    account_id,
  ) {
    try {
      // Performing a database query to update inventory data
      const sql =
        "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
      const data = await pool.query(sql, [
        account_firstname, 
        account_lastname, 
        account_email,
        account_id,
      ]);
      return data.rows[0];
    } catch (error) {
      // Error handling: logging the error to the console
      console.error("updateAccount error: " + error);
    }
  }
async function updatePassword(
    account_password,
    account_id,
  ) {
    try {
      // Performing a database query to update inventory data
      const sql =
        "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *";
      const data = await pool.query(sql, [
        account_password,
        account_id,
      ]);
      return data.rows[0];
    } catch (error) {
      // Error handling: logging the error to the console
      console.error("updateAccount error: " + error);
    }
  }

  async function getAccountByID(account_id){
    try {
        const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM public.account WHERE account_id = $1 RETURNING *"
        const account = await pool.query(sql, [account_id])
        return account.rows[0]
    } catch (error) {
        // Returning error message if an error occurs
        return error.message
    }
}

async function getInventoryByReview(account_id){
  try{
    const sql = `SELECT iv.inv_id, review_id, inv_year, inv_make, inv_model, review_date FROM public.review AS rv JOIN public.inventory AS iv 
    ON rv.inv_id = iv.inv_id WHERE rv.account_id = $1`;
    const data = await pool.query(sql, [account_id]);
    return data.rows;
  }catch(error){
      return error.message;
  }
}

async function getReview(account_id, inv_id){
  try{
    const sql = `SELECT review_id, account_id, review_date, review_text, inv_year, inv_make, inv_model
                  FROM public.review AS rv JOIN public.inventory AS iv 
                  ON rv.inv_id = iv.inv_id WHERE account_id = $1 AND iv.inv_id = $2`
    const data = await pool.query(sql, [account_id, inv_id]);
    return data.rows;
  }catch(error){
    new Error(`getReview model ${error}`);
  }
}

async function UpdateReview(review_text, review_date, review_id){
  try {
      const sql = `UPDATE public.review SET review_text = $1, review_date = $2 WHERE review_id = $3 RETURNING *`
      const data = await pool.query(sql, [review_text, review_date, review_id]);
      return data.rows[0];
  } catch (error) {
    new Error(`error in the query UpdateReview ${error}`)
  }
}
async function deleteReview(review_id){
  try {
      const sql = `DELETE FROM public.review WHERE review_id = $1 RETURNING *`
      const data = await pool.query(sql, [review_id]);
      return data.rows[0];
  } catch (error) {
    new Error(`error in the query UpdateReview ${error}`)
  }
}
// Exporting functions to be used in other modules
module.exports = {
  registerAccount, 
  getAccountByEmail,
  checkExistingEmail, 
  checkExistingPassword, 
  updateAccount,
  updatePassword,
  getAccountByID,
  getInventoryByReview,
  getReview,
  UpdateReview,
  deleteReview,
}
