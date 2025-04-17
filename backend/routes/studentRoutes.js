// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { verifyToken, verifyRole } = require("../middleware/auth"); // ✅ import middleware

// Authentication Routes
router.post("/register", studentController.registerStudent);
router.post("/login", studentController.loginStudent);
router.post("/forgot-password", studentController.forgotPassword);

// Protected Routes (requires login)
router.get("/:rollNo/courses", verifyToken, verifyRole(['student']), studentController.getStudentCourses);
router.get("/:rollNo/courses-offered", verifyToken, verifyRole(['student']), studentController.getCoursesOffered);
router.delete("/:rollNo/drop-course/:courseCode", verifyToken, verifyRole(['student']), studentController.dropCourse);
router.post("/:rollNo/courses/:courseCode/:sectionId", verifyToken, verifyRole(['student']), studentController.enrollCourse);

module.exports = router;
