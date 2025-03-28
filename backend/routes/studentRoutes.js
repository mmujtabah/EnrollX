const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// ✅ Authentication Routes
router.post("/register", studentController.registerStudent);
router.post("/login", studentController.loginStudent);
router.post("/forgot-password", studentController.forgotPassword);

// ✅ Get Student's Enrolled Courses
router.get("/:rollNo/course-details", studentController.getStudentCourses);

module.exports = router;
