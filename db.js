import mysql from "mysql2";
import dotenv from "dotenv";
import path from "path";

// Load env file only in local development
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });
  console.log("✅ Loaded local .env file");
}

console.log("🌍 Environment:", process.env.NODE_ENV);
console.log("ENV DB_HOST:", process.env.DB_HOST || process.env.MYSQLHOST);

const db = mysql.createConnection({
  host: process.env.DB_HOST || process.env.MYSQLHOST,
  port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
  user: process.env.DB_USER || process.env.MYSQLUSER,
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
  database: process.env.DB_NAME || process.env.MYSQLDATABASE,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  }
  console.log("✅ MySQL Connected:", db.config.host, db.config.database);
});

export default db;
