import db from './db.js';

const createSchoolsTable = `
CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    image VARCHAR(255) NOT NULL,
    email_id VARCHAR(255) NOT NULL
);
`;

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    otp VARCHAR(6),
    otp_expiry DATETIME
);
`;


db.query(createSchoolsTable, (err, result) => {
    if (err) console.error('❌ Error creating schools table:', err);
    else console.log('✅ schools table created or already exists');
});

db.query(createUsersTable, (err, result) => {
    if (err) console.error('❌ Error creating users table:', err);
    else console.log('✅ users table created or already exists');
});


setTimeout(() => db.end(), 1000);
