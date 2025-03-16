const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { getStudentByEmail, updateStudentPassword } = require('../models/studentModel');
require('dotenv').config();

// User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await getStudentByEmail(email);
        if (!student) return res.status(400).json({ message: "User not found" });

        const validPassword = await bcrypt.compare(password, student.password);
        if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ roll_no: student.roll_no, email: student.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const student = await getStudentByEmail(email);
        if (!student) return res.status(400).json({ message: "User not found" });

        const newPassword = Math.random().toString(36).slice(-8);
        await updateStudentPassword(email, await bcrypt.hash(newPassword, 10));

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
        res.status(500).json({ message: "Server Error" });
    }
};
