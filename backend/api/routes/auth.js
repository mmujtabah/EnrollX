const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { sql, poolPromise } = require("../db");  // ✅ Corrected path

const router = express.Router();

// ✅ Register New Student
router.post("/register", async (req, res) => {
    const { name, rollNo, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const pool = await poolPromise;
  
      await pool
        .request()
        .input("name", sql.VarChar, name)
        .input("roll_no", sql.VarChar, rollNo)  // ✅ Match DB column name
        .input("email", sql.VarChar, email)
        .input("password", sql.VarChar, hashedPassword)
        .query("INSERT INTO Students (name, roll_no, email, password) VALUES (@name, @roll_no, @email, @password)");  // ✅ Ensure @roll_no matches above
  
      res.json({ message: "✅ Registration successful" });
    } catch (err) {
      console.error("❌ Registration Error:", err);  // 🔴 Log error details
      res.status(500).json({ error: "❌ Registration failed", details: err.message });
    }
  });
  
module.exports = router;
