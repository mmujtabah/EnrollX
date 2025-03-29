const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createStudent, getStudentByRollNo, getEnrolledCourses, updatePassword, getCoursesOffered, getRegistrationPeriod, dropCourse} = require("../models/studentModel");
const sendResetEmail = require("../utils/emailService");

// ✅ Register Student
exports.registerStudent = async (req, res) => {
    const { name, rollNo, email, password } = req.body;

    try {
        // ✅ Backend validation for Roll Number length
        if (rollNo.length !== 8) {
            return res.status(400).json({ message: "❌ Roll number must be exactly 8 characters long" });
        }

        const existingStudent = await getStudentByRollNo(rollNo);
        if (existingStudent) {
            return res.status(400).json({ message: "❌ Student with this roll number already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await createStudent(name, rollNo, email, hashedPassword);

        res.json({ message: "✅ Registration successful" });
    } catch (error) {
        res.status(500).json({ message: "❌ Registration failed", error });
    }
};


// ✅ Login Student
exports.loginStudent = async (req, res) => {
    const { rollNo, password } = req.body;
    try {
        const student = await getStudentByRollNo(rollNo);
        if (!student) return res.status(404).json({ message: "❌ Student not found" });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: "❌ Invalid credentials" });

        const token = jwt.sign({ rollNo: student.roll_no }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "✅ Login successful", token, student });
    } catch (error) {
        res.status(500).json({ message: "❌ Login failed", error });
    }
};

// ✅ Forgot Password
exports.forgotPassword = async (req, res) => {
    const { rollNo } = req.body;
    try {
        const student = await getStudentByRollNo(rollNo);
        if (!student) return res.status(404).json({ message: "❌ Student not found" });

        const tempPassword = Math.random().toString(36).slice(-8);    
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        await updatePassword(rollNo, hashedPassword);

        await sendResetEmail(student.email, tempPassword); // ✅ Now correctly imported

        res.json({ message: "✅ Temporary password sent to your email" });
    } catch (error) {
        console.error("❌ Password reset error:", error);
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

// ✅ Get Courses Offered for the Next Semester
exports.getCoursesOffered = async (req, res) => {
    const { rollNo } = req.params;

    try {
        // Fetch the registration period details
        const registrationPeriod = await getRegistrationPeriod();

        if (!registrationPeriod || !registrationPeriod.is_active) {
            return res.status(400).json({ message: "❌ Registration period is not active. Please try again later." });
        }

        // Fetch the courses offered based on the student's next semester
        const courses = await getCoursesOffered(rollNo);

        if (courses.length === 0) {
            return res.status(404).json({ message: "❌ No courses are offered for the next semester." });
        }

        // Return the list of courses for the next semester
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "❌ Error fetching offered courses", error: error.message });
    }
};

// ✅ Drop a Registered Course
exports.dropCourse = async (req, res) => {
    try {
        const { rollNo, courseCode } = req.params;
        res.json(await dropCourse(rollNo, courseCode)); // ✅ Uses the message returned from model function
    } catch (error) {
        console.error("❌ Error dropping course:", error);
        res.status(500).json({ message: "❌ Error dropping course" });
    }
};
