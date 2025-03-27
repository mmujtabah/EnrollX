const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { sql, poolPromise } = require("../db");

const router = express.Router();

// ✅ Register a Student
router.post("/register", async (req, res) => {
    const { name, rollNo, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const pool = await poolPromise;
        await pool.request()
            .input("name", sql.VarChar, name)
            .input("roll_no", sql.Char(9), rollNo)
            .input("email", sql.VarChar, email)
            .input("password", sql.VarChar, hashedPassword)
            .query("INSERT INTO Students (name, roll_no, email, password) VALUES (@name, @roll_no, @email, @password)");

        res.json({ message: "✅ Registration successful" });
    } catch (error) {
        res.status(500).json({ message: "❌ Registration failed", error });
    }
});

// ✅ Login Student
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("email", sql.VarChar, email)
            .query("SELECT * FROM Students WHERE email = @email");
        
        const student = result.recordset[0];
        if (!student) return res.status(400).json({ message: "User not found" });

        const validPassword = await bcrypt.compare(password, student.password);
        if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ roll_no: student.roll_no, email: student.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// ✅ Forgot Password
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("email", sql.VarChar, email)
            .query("SELECT * FROM Students WHERE email = @email");

        const student = result.recordset[0];
        if (!student) return res.status(400).json({ message: "User not found" });

        const newPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await pool.request()
            .input("email", sql.VarChar, email)
            .input("password", sql.VarChar, hashedPassword)
            .query("UPDATE Students SET password = @password WHERE email = @email");

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset - EnrollX",
            text: `Your new password is: ${newPassword}`
        });

        res.json({ message: "New password sent to your email." });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// ✅ Get Student Enrolled Courses
router.get("/:rollNo/course-details", async (req, res) => {
    const { rollNo } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("roll_no", sql.Char(9), rollNo)
            .query(`SELECT E.section_id, E.course_code, C.course_name, C.course_dep, C.credit_hr, C.course_type
                    FROM Enrollment E
                    JOIN Courses C ON E.course_code = C.course_code
                    WHERE E.roll_no = @roll_no`);
        
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: "Error fetching enrolled courses", error });
    }
});

module.exports = router;
