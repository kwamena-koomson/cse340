const { Pool } = require("pg");
require("dotenv").config();

const isDevelopment = process.env.NODE_ENV === "development";

const poolConfig = {
    connectionString: process.env.DATABASE_URL,
};

if (isDevelopment) {
    // SSL configuration for development
    poolConfig.ssl = {
        rejectUnauthorized: false,
    };
} else {
    // Ensure SSL is used in production as well
    poolConfig.ssl = {
        rejectUnauthorized: true, // or false based on your requirements
    };
}

const pool = new Pool(poolConfig);

// Exporting a unified query method for both environments
module.exports = {
    async query(text, params) {
        try {
            const res = await pool.query(text, params);
            console.log("executed query", { text });
            return res;
        } catch (error) {
            console.error("error in query", { text, error });
            throw error;
        }
    },
};
