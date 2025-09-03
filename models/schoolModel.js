import db from '../db.js';

export function getAllSchools(callback) {
  db.query("SELECT * FROM schools", (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
}

export function addSchool(school, callback) {
  const { name,address,city,state,contact,image,email_id } = school;
  const sql = 'INSERT INTO schools (name,address,city,state,contact,image,email_id) VALUES (?,?,?,?,?,?,?)';
  db.query(sql, [name,address,city,state,contact,image,email_id], callback);
}

export function getSchoolById(id, callback) {
  const sql = "SELECT * FROM schools WHERE id = ?";
  db.query(sql, [id], callback);
}

export function updateSchool(id, school, callback) {
  const { name, address, city, state, contact, image, email_id } = school;
  const sql = `
    UPDATE schools
    SET name = ?, address = ?, city = ?, state = ?, contact = ?, email_id = ?, image = COALESCE(?, image)
    WHERE id = ?`;

  db.query(sql, [name, address, city, state, contact, email_id, image, id], callback);
}


export function deleteSchool(id, callback) {
  const sql = "DELETE FROM schools WHERE id = ?";
  db.query(sql, [id], callback);
}