const instructorModel = require("../models/instructorModel");

// ✅ Controller to Fetch Registered Students
const fetchRegisteredStudents = async (req, res) => {
  const { instructorId, courseCode } = req.params;

  const students = await instructorModel.getRegisteredStudents(instructorId, courseCode);
  res.status(students.message ? 404 : 200).json(students);
};

// ✅ Controller to Fetch Teaching Assistants
const fetchTeachingAssistants = async (req, res) => {
  const { instructorId, courseCode } = req.params;

  const tas = await instructorModel.getTeachingAssistants(instructorId, courseCode);
  res.status(tas.message ? 404 : 200).json(tas);
};

// ✅ Controller to Fetch Instructor's Courses
const fetchInstructorCourses = async (req, res) => {
  const { instructorId } = req.params;

  const courses = await instructorModel.getInstructorCourses(instructorId);
  res.status(courses.message ? 404 : 200).json(courses);
};

module.exports = {
  fetchRegisteredStudents,
  fetchTeachingAssistants,
  fetchInstructorCourses,
};
