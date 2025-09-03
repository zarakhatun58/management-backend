
import { readFileSync } from 'fs';
import { join } from 'path';
import { getAllSchools } from '../models/schoolModel.js';
import db from './../db.js';

export function getSchools(req, res) {
  const { q = "", page = 1, limit = 6 } = req.query;

  getAllSchools((err, results) => {
  if (err) {
    console.error("❌ DB error in getAllSchools:", err);
    return res.status(500).json({ error: err.message });
  }

  if (!results || results.length === 0) {
    const jsonData = readFileSync(join(__dirname, "../schools.json"), "utf-8");
    results = JSON.parse(jsonData);
  }

   const search = (q || "").toLowerCase();

const filtered = results.filter((school) => {
  const name = school?.name || ""; 
  const city = school?.city || ""; 

  return name.toLowerCase().includes(search) || city.toLowerCase().includes(search);
});

    const pageNum = parseInt(page);
    const pageLimit = parseInt(limit);
    const totalPages = Math.ceil(filtered.length / pageLimit);
    const offset = (pageNum - 1) * pageLimit;

    const paginatedSchools = filtered.slice(offset, offset + pageLimit);

    res.json({
      schools: paginatedSchools,
      totalPages,
      currentPage: pageNum,
    });
  });
}


export function createSchool(req, res) {
  const safeValue = (v) => v ?? "";

  const { name, address, city, state, contact, email_id } = req.body;
  const image = req.file ? req.file.filename : "";

  const sql = `
    INSERT INTO schools (name, address, city, state, contact, image, email_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
  safeValue(name),
  safeValue(address),
  safeValue(city),
  safeValue(state),
  safeValue(contact),
  safeValue(image),
  safeValue(email_id),
], (err, result) => {
  if (err) {
    console.error("❌ Insert error:", err); 
    return res.status(500).json({ error: err.message }); 
  }

    const insertedId = result.insertId;
    db.query('SELECT * FROM schools WHERE id=?', [insertedId], (err2, rows) => {
      if (err2) return res.status(500).json(err2);
      res.json({ message: "School added successfully", school: rows[0] });
    });
  });
}

export function updateSchool(req, res) {
  const { id } = req.params;
  const { name, address, city, state, contact, email_id } = req.body;
  const updatedImage = req.file ? req.file.filename : undefined;

  let sql, params;
  if (updatedImage) {
    sql = `UPDATE schools SET name=?, address=?, city=?, state=?, contact=?, email_id=?, image=? WHERE id=?`;
    params = [name, address, city, state, contact, email_id, updatedImage, id];
  } else {
    sql = `UPDATE schools SET name=?, address=?, city=?, state=?, contact=?, email_id=? WHERE id=?`;
    params = [name, address, city, state, contact, email_id, id];
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);

    db.query('SELECT * FROM schools WHERE id=?', [id], (err2, rows) => {
      if (err2) return res.status(500).json(err2);
      res.json({ message: "School updated successfully", school: rows[0] }); 
    });
  });
}

export function deleteSchool(req, res) {
  const { id } = req.params;
  const sql = "DELETE FROM schools WHERE id=?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "School deleted successfully" });
  });
}

export function getSchoolById(req, res) {
  const { id } = req.params;
  const sql = "SELECT * FROM schools WHERE id=?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: "School not found" });
    res.json(results[0]);
  });
}
