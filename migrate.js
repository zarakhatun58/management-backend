import db from './db.js';

const createSchoolsTable = `
CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    contact VARCHAR(20),
    image VARCHAR(255),
    email_id VARCHAR(255)
);
`;

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255)
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
