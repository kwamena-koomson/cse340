const { Pool } = require("pg");
require("dotenv").config();

let pool;

if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false, // Disable SSL for development
  });
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false, // Disable SSL for production as well
  });
}

/**
 * Executes an SQL query using the connection pool.
 * @param {string} text The SQL query string.
 * @param {Array} params Optional parameters for the query.
 * @returns {Promise} A promise that resolves with the query result.
 */
async function query(text, params) {
  try {
    const res = await pool.query(text, params);
    console.log("Executed query:", { text });
    return res;
  } catch (error) {
    console.error("Error in query:", { text });
    throw error;
  }
}

module.exports = { query };
