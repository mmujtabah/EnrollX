const express = require("express");
const router = express.Router();
const instructorController = require("../controllers/instructorController");

// Route to Get Registered Students
router.get("/:instructorId/students/:courseCode", instructorController.fetchRegisteredStudents);

// Route to Get Teaching Assistants
router.get("/:instructorId/tas/:courseCode", instructorController.fetchTeachingAssistants);

// Route to Get Courses Taught by an Instructor
router.get("/:instructorId/courses", instructorController.fetchInstructorCourses);

module.exports = router;
