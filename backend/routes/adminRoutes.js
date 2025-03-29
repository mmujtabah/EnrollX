const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// ✅ Student Routes
router.get("/students", adminController.getAllStudents);
// ✅ Update Student Name Route
router.patch("/students/:rollNo", adminController.updateStudentName);


// ✅ Instructor Routes
router.get("/instructors", adminController.getAllInstructors);
router.post("/instructors", adminController.addInstructor);
router.put("/instructors/:id", adminController.updateInstructor);
router.delete("/instructors/:id", adminController.deleteInstructor);

// ✅ Course Routes
router.get("/courses", adminController.getAllCourses);
router.post("/courses", adminController.addCourse);
router.put("/courses/:courseCode", adminController.updateCourse);
router.delete("/courses/:courseCode", adminController.deleteCourse);

// ✅ Enrollment Routes
router.post("/enrollment", adminController.addEnrollment);
router.put("/enrollment/:rollNo", adminController.updateEnrollmentSemester);
router.delete("/enrollment/:enrollId", adminController.deleteEnrollment);

module.exports = router;
