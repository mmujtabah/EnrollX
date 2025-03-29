const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// ✅ Authentication Routes
router.post("/register", studentController.registerStudent);
router.post("/login", studentController.loginStudent);
router.post("/forgot-password", studentController.forgotPassword);

// ✅ Get Student's Enrolled Courses
router.get("/:rollNo/courses-details", studentController.getStudentCourses);

// ✅ Get Courses Offered for Next Semester
router.get("/:rollNo/courses-offered", studentController.getCoursesOffered);

// ✅ Drop a Course
router.delete("/:rollNo/drop-course/:courseCode", studentController.dropCourse);



module.exports = router;
