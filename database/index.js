const { Pool } = require("pg");
require("dotenv").config();

let pool;

// Validate NODE_ENV and set SSL options accordingly
if (process.env.NODE_ENV === "development") {
  // Development environment
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Accept self-signed certificates
    },
  });
} else {
  // Production or other environments
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Add SSL configurations for production environment if needed
  });
}

/**
 * Executes an SQL query using the connection pool.
 * The first parameter is the SQL query string.
 * The second parameter is an array of optional parameters for the query.
 * Returns a Promise that resolves with the query result.
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

// Export the query function
module.exports = { query };
