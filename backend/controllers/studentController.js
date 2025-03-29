const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const studentModel = require("../models/studentModel");
const sendResetEmail = require("../utils/emailService");

// ✅ Register Student
async function registerStudent(req, res) {
    const { name, rollNo, email, password } = req.body;

    try {
        // ✅ Backend validation for Roll Number length
        if (rollNo.length !== 8) {
            return res.status(400).json({ message: "❌ Roll number must be exactly 8 characters long" });
        }

        const existingStudent = await studentModel.getStudentByRollNo(rollNo);
        if (existingStudent) {
            return res.status(400).json({ message: "❌ Student with this roll number already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await studentModel.createStudent(name, rollNo, email, hashedPassword);

        res.json({ message: "✅ Registration successful" });
    } catch (error) {
        res.status(500).json({ message: "❌ Registration failed", error });
    }
}

// ✅ Login Student
async function loginStudent(req, res) {
    const { rollNo, password } = req.body;
    try {
        const student = await studentModel.getStudentByRollNo(rollNo);
        if (!student) return res.status(404).json({ message: "❌ Student not found" });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: "❌ Invalid credentials" });

        const token = jwt.sign({ rollNo: student.roll_no }, process.env.JWT_SECRET, { expiresIn: "20m" });

        res.json({ message: "✅ Login successful", token, student });
    } catch (error) {
        res.status(500).json({ message: "❌ Login failed", error });
    }
}

// ✅ Forgot Password
async function forgotPassword(req, res) {
    const { rollNo } = req.body;
    try {
        const student = await studentModel.getStudentByRollNo(rollNo);
        if (!student) return res.status(404).json({ message: "❌ Student not found" });

        const tempPassword = Math.random().toString(36).slice(-8);    
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        await studentModel.updatePassword(rollNo, hashedPassword);

        await sendResetEmail(student.email, student.name, tempPassword); 

        res.json({ message: "✅ Temporary password sent to your email" });
    } catch (error) {
        console.error("❌ Password reset error:", error);
        res.status(500).json({ message: "❌ Password reset failed", error });
    }
}

// ✅ Get Student's Enrolled Courses
async function getStudentCourses(req, res) {
    try {
        const courses = await studentModel.getEnrolledCourses(req.params.rollNo);
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "❌ Error fetching enrolled courses", error });
    }
}

// ✅ Get Courses Offered for the Next Semester
async function getCoursesOffered(req, res) {
    const { rollNo } = req.params;

    try {
        // Fetch the registration period details
        const registrationPeriod = await studentModel.getRegistrationPeriod();

        if (!registrationPeriod || !registrationPeriod.is_active) {
            return res.status(400).json({ message: "❌ Registration period is not active. Please try again later." });
        }

        // Fetch the courses offered based on the student's next semester
        const courses = await studentModel.getCoursesOffered(rollNo);

        if (courses.length === 0) {
            return res.status(404).json({ message: "❌ No courses are offered for the next semester." });
        }

        // Return the list of courses for the next semester
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "❌ Error fetching offered courses", error: error.message });
    }
}

// ✅ Drop a Registered Course
async function dropCourse(req, res) {
    try {
        const { rollNo, courseCode } = req.params;
        res.json(await studentModel.dropCourse(rollNo, courseCode)); 
    } catch (error) {
        console.error("❌ Error dropping course:", error);
        res.status(500).json({ message: "❌ Error dropping course" });
    }
}

// ✅ Enroll in a Course
async function enrollCourse(req, res) {
    try {
        const { rollNo, courseCode, sectionId } = req.params;
        res.json(await studentModel.enrollCourse(rollNo, courseCode, sectionId));
    } catch (error) {
        console.error("❌ Error enrolling course:", error);
        res.status(500).json({ message: "❌ Error enrolling in course" });
    }
}

module.exports = {
    registerStudent,
    loginStudent,
    forgotPassword,
    getStudentCourses,
    getCoursesOffered,
    dropCourse,
    enrollCourse,
};
