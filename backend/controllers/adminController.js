const adminModel = require("../models/adminModel");

// Get all students
const getAllStudents = async (req, res) => {
    try {
        const result = await adminModel.getAllStudents();
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all instructors
const getAllInstructors = async (req, res) => {
    try {
        const result = await adminModel.getAllInstructors();
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a new instructor
const addInstructor = async (req, res) => {
    const { id, email, password, name } = req.body;
    try {
        await adminModel.addInstructor(id, email, password, name);
        res.status(201).json({ message: "Instructor added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update instructor details
const updateInstructor = async (req, res) => {
    const { id } = req.params;
    const { email, password, name } = req.body;
    try {
        await adminModel.updateInstructor(id, email, password, name);
        res.status(200).json({ message: "Instructor updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete instructor
const deleteInstructor = async (req, res) => {
    const { id } = req.params;
    try {
        await adminModel.deleteInstructor(id);
        res.status(200).json({ message: "Instructor deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const result = await adminModel.getAllCourses();
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a course
const addCourse = async (req, res) => {
    const { courseCode, courseName, courseDep, creditHr, courseType, prereqCourse } = req.body;
    try {
        await adminModel.addCourse(courseCode, courseName, courseDep, creditHr, courseType, prereqCourse);
        res.status(201).json({ message: "Course added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a course
const updateCourse = async (req, res) => {
    const { courseCode } = req.params;
    const { courseName, courseDep, prereqCourse } = req.body;
    try {
        await adminModel.updateCourse(courseCode, courseName, courseDep, prereqCourse);
        res.status(200).json({ message: "Course updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a course
const deleteCourse = async (req, res) => {
    const { courseCode } = req.params;
    try {
        await adminModel.deleteCourse(courseCode);
        res.status(200).json({ message: "Course deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add Enrollment
const addEnrollment = async (req, res) => {
    const { enrollId, rollNo, sectionId, courseCode, semester } = req.body;
    try {
        await adminModel.addEnrollment(enrollId, rollNo, sectionId, courseCode, semester);
        res.status(201).json({ message: "Enrollment added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Enrollment Semester
const updateEnrollmentSemester = async (req, res) => {
    const { rollNo } = req.params;
    const { semester } = req.body;
    try {
        await adminModel.updateEnrollmentSemester(rollNo, semester);
        res.status(200).json({ message: "Enrollment updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Enrollment
const deleteEnrollment = async (req, res) => {
    const { enrollId } = req.params;
    try {
        await adminModel.deleteEnrollment(enrollId);
        res.status(200).json({ message: "Enrollment deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateStudentName = async (req, res) => {
    const { rollNo  } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Student name is required" });
    }

    try {
        await adminModel.updateStudentName(rollNo , name);
        res.status(200).json({ message: "Student name updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllStudents,
    getAllInstructors,
    addInstructor,
    updateInstructor,
    deleteInstructor,
    getAllCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    addEnrollment,
    updateEnrollmentSemester,
    deleteEnrollment,
    updateStudentName
};
