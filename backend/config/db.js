const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  options: { encrypt: true, trustServerCertificate: true },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let poolPromise;

async function connectDB() {
  try {
    const pool = await new sql.ConnectionPool(config).connect();
    console.log("✅ Connected to SQL Server");
    return pool;
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1); // 🔥 Stop the server if DB connection fails
  }
}

// Initialize connection once
poolPromise = connectDB();

module.exports = { sql, poolPromise };
