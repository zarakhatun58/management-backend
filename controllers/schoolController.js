
import { readFileSync } from 'fs';
import { dirname } from "path";
import { fileURLToPath } from "url";
import { join } from 'path';
import {
  getAllSchools,
  addSchool,
  getSchoolById as getSchoolByIdModel,
  updateSchool as updateSchoolModel,
  deleteSchool as deleteSchoolModel,
} from "../models/schoolModel.js";
import db from './../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Get schools with pagination + search
export function getSchools(req, res) {
  const { q = "", page = 1, limit = 6 } = req.query;

  getAllSchools((err, results) => {
    if (err) {
      console.error("❌ DB error in getAllSchools:", err);
      return res.status(500).json({ error: err.message });
    }

    let schools = results;
    if (!schools || schools.length === 0) {
      const jsonData = readFileSync(join(__dirname, "../schools.json"), "utf-8");
      schools = JSON.parse(jsonData);
    }

    const search = (q || "").toLowerCase();
    const filtered = schools.filter((s) => {
      const name = s?.name || "";
      const city = s?.city || "";
      return (
        name.toLowerCase().includes(search) ||
        city.toLowerCase().includes(search)
      );
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

// ✅ Create a new school
export function createSchool(req, res) {
  const safeValue = (v) => v ?? "";

  const { name, address, city, state, contact, email_id } = req.body;
  const image = req.file ? req.file.filename : "";

  addSchool(
    {
      name: safeValue(name),
      address: safeValue(address),
      city: safeValue(city),
      state: safeValue(state),
      contact: safeValue(contact),
      image: safeValue(image),
      email_id: safeValue(email_id),
    },
    (err, result) => {
      if (err) {
        console.error("❌ Insert error:", err);
        return res.status(500).json({ error: err.message });
      }

      const insertedId = result.insertId;
      getSchoolByIdModel(insertedId, (err2, rows) => {
        if (err2) return res.status(500).json(err2);
        res.json({ message: "School added successfully", school: rows[0] });
      });
    }
  );
}

// ✅ Update school
export function updateSchool(req, res) {
  const { id } = req.params;
  const { name, address, city, state, contact, email_id } = req.body;
  const updatedImage = req.file ? req.file.filename : null;

  updateSchoolModel(
    id,
    { name, address, city, state, contact, email_id, image: updatedImage },
    (err, result) => {
      if (err) return res.status(500).json(err);

      getSchoolByIdModel(id, (err2, rows) => {
        if (err2) return res.status(500).json(err2);
        res.json({ message: "School updated successfully", school: rows[0] });
      });
    }
  );
}

// ✅ Delete school
export function deleteSchool(req, res) {
  const { id } = req.params;
  deleteSchoolModel(id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "School deleted successfully" });
  });
}

// ✅ Get school by ID
export function getSchoolById(req, res) {
  const { id } = req.params;
  getSchoolByIdModel(id, (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0)
      return res.status(404).json({ message: "School not found" });
    res.json(results[0]);
  });
}