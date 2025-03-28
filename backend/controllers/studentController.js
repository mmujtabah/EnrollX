const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createStudent, getStudentByEmail, getEnrolledCourses, updatePassword } = require("../models/studentModel");
const { sendResetEmail } = require("../utils/emailService");

// ✅ Register Student
exports.registerStudent = async (req, res) => {
    const { name, rollNo, email, password } = req.body;
    try {
        const existingStudent = await getStudentByEmail(email);
        if (existingStudent) return res.status(400).json({ message: "❌ Student already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await createStudent(name, rollNo, email, hashedPassword);

        res.json({ message: "✅ Registration successful" });
    } catch (error) {
        res.status(500).json({ message: "❌ Registration failed", error });
    }
};

// ✅ Login Student
exports.loginStudent = async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await getStudentByEmail(email);
        if (!student) return res.status(404).json({ message: "❌ Student not found" });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: "❌ Invalid credentials" });

        const token = jwt.sign({ id: student.roll_no }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, student });
    } catch (error) {
        res.status(500).json({ message: "❌ Login failed", error });
    }
};

// ✅ Forgot Password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const student = await getStudentByEmail(email);
        if (!student) return res.status(404).json({ message: "❌ Student not found" });

        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        await updatePassword(email, hashedPassword);
        await sendResetEmail(email, tempPassword);

        res.json({ message: "✅ Temporary password sent to your email" });
    } catch (error) {
        res.status(500).json({ message: "❌ Password reset failed", error });
    }
};

// ✅ Get Student's Enrolled Courses
exports.getStudentCourses = async (req, res) => {
    try {
        const courses = await getEnrolledCourses(req.params.rollNo);
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "❌ Error fetching enrolled courses", error });
    }
};
