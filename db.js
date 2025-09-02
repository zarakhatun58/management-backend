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
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  }
  console.log("✅ MySQL Connected:", db.config.host, db.config.database);
});

export default db;
