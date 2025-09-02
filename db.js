import mysql from "mysql2";
import dotenv from "dotenv";
import path from "path";


const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

console.log("Loaded ENV file:", envFile);
console.log("ENV DB_HOST:", process.env.DB_HOST);
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1); 
  }
  
  console.log("✅ MySQL Connected:", db.config.host, db.config.database);
});

export default db;
