const pool = require("../database/"); 

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    // Performing a database query to retrieve inventory data based on classification_id
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    // Returning the resulting rows from the query
    return data.rows;
  } catch (error) {
    // Error handling: logging the error to the console
    console.error("getInventoryByClassificationId error " + error);
  }
}

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  try {
    // Performing a database query to retrieve all classification data
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
  } catch (error) {
    // Error handling: logging the error to the console
    console.error("getClassifications error " + error);
  }
}

/* ***************************
 *  Check for existing classification name
 * ************************** */
async function checkExistingClassification(classification_name){
  try {
    // Performing a database query to check if the classification name exists
    const sql = "SELECT * FROM classification WHERE classification_name = $1";
    const classificationTable = await pool.query(sql, [classification_name]);
    // Returning the count of rows as an indication of whether the classification name exists
    return classificationTable.rowCount;
  } catch (error) {
    // Error handling: returning the error message
    return error.message;
  }
}

/**
 * Retrieves inventory data for a given vehicle ID from the database.
 * WARNING: This function is susceptible to SQL injection attacks!
 * @param {number} vehicleId - The ID of the vehicle to retrieve inventory data for.
 * @returns {Promise<Array>} - A Promise that resolves with an array of inventory data objects.
 */
async function getInventory(vehicleId) {
  try{
    // Performing a database query to retrieve inventory data for a specific vehicle ID
    const sql = `SELECT * FROM public.inventory WHERE inv_id = $1`;
    const data = await pool.query(sql, [vehicleId]);
    // Returning the resulting rows from the query
    return data.rows;
  } catch (error) {
    // Error handling: logging the error to the console
    console.error("getInventory error " + error);
  }
}

/* ***************************
 *  Add a new classification
 * ************************** */
async function addClassification(newClassification){
  try{
    // Performing a database query to insert a new classification into the database
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [newClassification]);
  }catch (error){
    // Error handling: logging the error to the console
    console.error("addClassification error " + error);
  }
}

/* ***************************
 *  Add a new vehicle to inventory
 * ************************** */
async function addVehicle(
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
){
  try{
    // Performing a database query to insert a new vehicle into inventory
    const sql = "INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    return await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color]);
  }catch (error){
    // Error handling: logging the error to the console
    console.error("addVehicle error " + error);
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    // Performing a database query to update inventory data
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ]);
    return data.rows[0];
  } catch (error) {
    // Error handling: logging the error to the console
    console.error("updateInventory error: " + error);
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    // Performing a database query to delete an inventory item
    const sql = 'DELETE FROM inventory WHERE inv_id = $1';
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    // Error handling: creating a new error object
    new Error("Delete Inventory Error");
  }
}

/* ***************************
 *  Add Review Inventory Item
 * ************************** */
async function addReview(review_description, date, inv_id, account_id){
  try{
    const sql = `INSERT INTO review (review_text, review_date, inv_id, account_id) VALUES( $1, $2, $3, $4) RETURNING*`;
    const data = await pool.query(sql, [review_description, date, inv_id, account_id]);
    return data;
  }catch (error) {
    new Error("Add review to the inventory error");
  }
}

async function getReviews(vehicleId){
  try{
    const sql = `SELECT account_firstname, review_date, review_text FROM public.review AS rv JOIN public.account AS ac 
    ON rv.account_id = ac.account_id WHERE rv.inv_id = $1;`;
    const data = await pool.query(sql, [vehicleId]);
    return data.rows;
  }catch{
    new Error ("get review failed.");
  }
}

// Exporting functions to be used in other modules
module.exports = {
  getClassifications, 
  getInventoryByClassificationId, 
  getInventory, 
  addClassification, 
  addVehicle, 
  checkExistingClassification,
  updateInventory, 
  deleteInventoryItem,
  addReview,
  getReviews,
};
