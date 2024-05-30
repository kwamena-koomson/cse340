const { Pool } = require("pg");
require("dotenv").config();

let pool;

if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Accept self-signed certificates
    },
    connectionTimeoutMillis: 5000, // Increase timeout to 5 seconds
  });
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Accept self-signed certificates for production as well
    },
    connectionTimeoutMillis: 5000, // Increase timeout to 5 seconds
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
    console.log("Executing query:", { text, params });
    const res = await pool.query(text, params);
    console.log("Executed query successfully:", { text });
    return res;
  } catch (error) {
    console.error("Error in query execution:", {
      text,
      params,
      errorMessage: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

module.exports = { query };
