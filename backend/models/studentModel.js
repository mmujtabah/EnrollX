const { sql, poolPromise } = require("../config/db");

// ✅ Register Student
exports.createStudent = async (name, rollNo, email, hashedPassword) => {
  const pool = await poolPromise;
  await pool
    .request()
    .input("name", sql.VarChar, name)
    .input("rollNo", sql.Char(8), rollNo)
    .input("email", sql.VarChar, email)
    .input("password", sql.VarChar, hashedPassword)
    .query(
      `INSERT INTO Students (name, roll_no, email, password) VALUES (@name, @rollNo, @email, @password)`
    );
};

// ✅ Fetch Student by RollNo
exports.getStudentByRollNo = async (rollNo) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("rollNo", sql.Char(8), rollNo)
    .query("SELECT * FROM Students WHERE roll_no = @rollNo");
  return result.recordset[0];
};

// ✅ Update Password
exports.updatePassword = async (rollNo, newPassword) => {
  const pool = await poolPromise;
  await pool
    .request()
    .input("rollNo", sql.Char(8), rollNo)
    .input("password", sql.VarChar, newPassword)
    .query("UPDATE Students SET password = @password WHERE roll_no = @rollNo");
};

// ✅ Fetch Enrolled Courses
exports.getEnrolledCourses = async (rollNo) => {
  const pool = await poolPromise;
  const result = await pool.request().input("rollNo", sql.Char(8), rollNo)
    .query(`SELECT E.section_id, E.course_code, C.course_name, C.course_dep, C.credit_hr, C.course_type
                FROM Enrollment E
                JOIN Courses C ON E.course_code = C.course_code
                WHERE E.roll_no = @rollNo`);
  return result.recordset;
};

// Fetch Courses Offered
exports.getCoursesOffered = async (rollNo) => {
  const pool = await poolPromise;
  const result = await pool.request().input("rollNo", sql.Char(8), rollNo)
    .query(`SELECT c.course_code, c.course_name, c.course_dep, c.credit_hr, c.course_type, c.course_semester
            FROM Courses c
            JOIN Course_Sections cs ON c.course_code = cs.course_code
            JOIN Registration_Period rp ON GETDATE() BETWEEN rp.start_datetime AND rp.end_datetime AND rp.is_active = 1
            WHERE c.course_semester = (
                SELECT MAX(e.semester) + 1
                FROM Enrollment e
                WHERE e.roll_no = @rollNo
            )
            ORDER BY c.course_semester;`);
  return result.recordset;
};

// Helper function to get the registration period
exports.getRegistrationPeriod = async () => {
  const pool = await poolPromise;
  const result = await pool.request()
      .query(`SELECT * FROM Registration_Period WHERE GETDATE() BETWEEN start_datetime AND end_datetime AND is_active = 1`);
  return result.recordset[0];
};

// Drop Enrolled Course
async function dropCourse(rollNo, courseCode) {
    try {
        const pool = await poolPromise;

        // Check if student exists
        const student = await pool
            .request()
            .input("rollNo", sql.VarChar, rollNo)
            .query("SELECT * FROM Students WHERE roll_no = @rollNo");

        if (student.recordset.length === 0) {
            return { message: "❌ Student not found" };
        }

        // Check if course exists
        const course = await pool
            .request()
            .input("courseCode", sql.VarChar, courseCode)
            .query("SELECT * FROM Courses WHERE course_code = @courseCode");

        if (course.recordset.length === 0) {
            return { message: "❌ Course not found" };
        }

        // Check if student is enrolled
        const enrollment = await pool
            .request()
            .input("rollNo", sql.VarChar, rollNo)
            .input("courseCode", sql.VarChar, courseCode)
            .query("SELECT * FROM Enrollment WHERE roll_no = @rollNo AND course_code = @courseCode");

        if (enrollment.recordset.length === 0) {
            return { message: "❌ Student is not enrolled in this course" };
        }

        // Delete enrollment
        await pool
            .request()
            .input("rollNo", sql.VarChar, rollNo)
            .input("courseCode", sql.VarChar, courseCode)
            .query("DELETE FROM Enrollment WHERE roll_no = @rollNo AND course_code = @courseCode");

        return { message: "✅ Course dropped successfully" };
    } catch (error) {
        return { message: "❌ Internal Server Error", error };
    }
}

module.exports = { dropCourse };
