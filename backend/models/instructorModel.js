const { sql, poolPromise } = require("../config/db");

const getRegisteredStudents = async (instructorId, courseCode) => {
  try {
    const pool = await poolPromise;

    const students = await pool
      .request()
      .input("instructorId", sql.Char(9), instructorId)
      .input("courseCode", sql.VarChar(9), courseCode)
      .query(
        `SELECT cs.instructor_id, s.roll_no, s.name, cs.course_code, cs.section_id
         FROM Course_Sections cs 
         JOIN Enrollments e ON cs.section_id = e.section_id
         JOIN Students s ON e.roll_no = s.roll_no
         WHERE cs.instructor_id = @instructorId 
         AND cs.course_code = @courseCode`
      );

    return students.recordset.length > 0
      ? students.recordset
      : { message: "❌ No students found or unauthorized access" };
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    return { message: "❌ Internal Server Error" };
  }
};

const getTeachingAssistants = async (instructorId, courseCode) => {
  try {
    const pool = await poolPromise;

    const tas = await pool
      .request()
      .input("instructorId", sql.Char(9), instructorId)
      .input("courseCode", sql.VarChar(9), courseCode)
      .query(
        `SELECT i.id AS instructor_id, i.name AS instructor_name, 
                ta.roll_no AS ta_roll_no, s.name AS ta_name, cs.course_code, cs.section_id
         FROM Students s 
         JOIN TA ta ON s.roll_no = ta.roll_no
         JOIN Course_Section_TA cst ON ta.roll_no = cst.TA_roll_no
         JOIN Course_Sections cs ON cs.section_id = cst.section_id
         JOIN Instructors i ON i.id = cs.instructor_id
         WHERE cs.instructor_id = @instructorId 
         AND cs.course_code = @courseCode`
      );

    return tas.recordset.length > 0
      ? tas.recordset
      : { message: "❌ No TAs found or unauthorized access" };
  } catch (error) {
    console.error("❌ Error fetching TAs:", error);
    return { message: "❌ Internal Server Error" };
  }
};

const getInstructorCourses = async (instructorId) => {
  try {
    const pool = await poolPromise;

    const courses = await pool
      .request()
      .input("instructorId", sql.Char(9), instructorId)
      .query(
        `SELECT DISTINCT cs.course_code, c.course_name, cs.section_id
         FROM Course_Sections cs
         JOIN Courses c ON cs.course_code = c.course_code
         WHERE cs.instructor_id = @instructorId`
      );

    return courses.recordset.length > 0
      ? courses.recordset
      : { message: "❌ No courses found or unauthorized access" };
  } catch (error) {
    console.error("❌ Error fetching instructor's courses:", error);
    return { message: "❌ Internal Server Error" };
  }
};

module.exports = {
  getRegisteredStudents,
  getTeachingAssistants,
  getInstructorCourses,
};
