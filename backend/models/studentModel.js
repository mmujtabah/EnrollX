const { sql, poolPromise } = require("../config/db");

const studentModel = {
  // ✅ Register Student
  createStudent: async (name, rollNo, email, hashedPassword) => {
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
  },

  // ✅ Fetch Student by RollNo
  getStudentByRollNo: async (rollNo) => {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("rollNo", sql.Char(8), rollNo)
      .query("SELECT * FROM Students WHERE roll_no = @rollNo");
    return result.recordset[0];
  },

  // ✅ Update Password
  updatePassword: async (rollNo, newPassword) => {
    const pool = await poolPromise;
    await pool
      .request()
      .input("rollNo", sql.Char(8), rollNo)
      .input("password", sql.VarChar, newPassword)
      .query(
        "UPDATE Students SET password = @password WHERE roll_no = @rollNo"
      );
  },

  // ✅ Fetch Enrolled Courses
  getEnrolledCourses: async (rollNo) => {
    const pool = await poolPromise;
    const result = await pool.request().input("rollNo", sql.Char(8), rollNo)
      .query(`SELECT E.section_id, E.course_code, C.course_name, C.course_dep, C.credit_hr, C.course_type
                FROM Enrollments E
                JOIN Courses C ON E.course_code = C.course_code
                WHERE E.roll_no = @rollNo`);
    return result.recordset;
  },

  getCoursesOffered: async (rollNo) => {
    const pool = await poolPromise;
    const result = await pool.request().input("rollNo", sql.Char(8), rollNo)
      .query(`SELECT c.course_code, c.course_name, c.course_dep, c.credit_hr, c.course_type, c.course_semester
            FROM Courses c
            JOIN Course_Sections cs ON c.course_code = cs.course_code
            JOIN Registration_Period rp ON GETDATE() BETWEEN rp.start_datetime AND rp.end_datetime AND rp.is_active = 1
            WHERE c.course_semester = (
                SELECT MAX(e.semester) + 1
                FROM Enrollments e
                WHERE e.roll_no = @rollNo
            )
            ORDER BY c.course_semester;`);
    return result.recordset;
  },

  getRegistrationPeriod: async () => {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query(
        `SELECT * FROM Registration_Period WHERE GETDATE() BETWEEN start_datetime AND end_datetime AND is_active = 1`
      );
    return result.recordset[0];
  },

  dropCourse: async function (rollNo, courseCode) {
    try {
      const pool = await poolPromise;

      const student = await pool
        .request()
        .input("rollNo", sql.Char(8), rollNo)
        .query("SELECT * FROM Students WHERE roll_no = @rollNo");

      if (student.recordset.length === 0) {
        return { message: "❌ Student not found" };
      }

      const course = await pool
        .request()
        .input("courseCode", sql.VarChar(9), courseCode)
        .query("SELECT * FROM Courses WHERE course_code = @courseCode");

      if (course.recordset.length === 0) {
        return { message: "❌ Course not found" };
      }

      const enrollment = await pool
        .request()
        .input("rollNo", sql.Char(8), rollNo)
        .input("courseCode", sql.VarChar(9), courseCode)
        .query(
          "SELECT * FROM Enrollments WHERE roll_no = @rollNo AND course_code = @courseCode"
        );

      if (enrollment.recordset.length === 0) {
        return { message: "❌ Student is not enrolled in this course" };
      }

      await pool
        .request()
        .input("rollNo", sql.Char(8), rollNo)
        .input("courseCode", sql.VarChar(9), courseCode)
        .query(
          "DELETE FROM Enrollments WHERE roll_no = @rollNo AND course_code = @courseCode"
        );

      return { message: "✅ Course dropped successfully" };
    } catch (error) {
      console.error("❌ Error dropping course:", error);
      return { message: "❌ Internal Server Error" };
    }
  },

  // ✅ Enroll in a Course
  enrollCourse: async (rollNo, courseCode, sectionId) => {
    try {
      const pool = await poolPromise;

      const regPeriodResult = await pool.request().query(
        `SELECT * FROM Registration_Period 
         WHERE GETDATE() BETWEEN start_datetime AND end_datetime 
         AND is_active = 1`
      );

      if (regPeriodResult.recordset.length === 0) {
        return { message: "❌ Registration period is closed." };
      }

      const student = await pool
        .request()
        .input("rollNo", sql.Char(8), rollNo)
        .query("SELECT * FROM Students WHERE roll_no = @rollNo");

      if (student.recordset.length === 0) {
        return { message: "❌ Student not found" };
      }

      const course = await pool
        .request()
        .input("courseCode", sql.VarChar(9), courseCode)
        .query("SELECT * FROM Courses WHERE course_code = @courseCode");

      if (course.recordset.length === 0) {
        return { message: "❌ Course not found" };
      }

      const courseTypeResult = await pool
        .request()
        .input("courseCode", sql.VarChar(9), courseCode)
        .query("SELECT course_type FROM Courses WHERE course_code = @courseCode");

      const courseType = courseTypeResult.recordset[0]?.type;

      const coreSectionResult = await pool
        .request()
        .input("rollNo", sql.Char(8), rollNo)
        .query(
          `SELECT TOP 1 section_id 
         FROM Enrollments E
         JOIN Courses C ON E.course_code = C.course_code
         WHERE E.roll_no = @rollNo AND C.course_type = 'core'`
        );

      const existingCoreSection = coreSectionResult.recordset[0]?.section_id;

      if (
        courseType === "core" &&
        existingCoreSection &&
        existingCoreSection !== sectionId
      ) {
        return {
          message: `❌ You must enroll in core courses under section ${existingCoreSection}`,
        };
      }

      const enrolledCreditsResult = await pool
        .request()
        .input("rollNo", sql.Char(8), rollNo)
        .query(
          `SELECT SUM(C.credit_hr) AS totalCredits 
         FROM Enrollments E 
         JOIN Courses C ON E.course_code = C.course_code 
         WHERE E.roll_no = @rollNo`
        );

      const currentCredits =
        enrolledCreditsResult.recordset[0].totalCredits || 0;

      const courseCreditsResult = await pool
        .request()
        .input("courseCode", sql.VarChar(9), courseCode)
        .query("SELECT credit_hr FROM Courses WHERE course_code = @courseCode");

      const newCourseCredits = courseCreditsResult.recordset[0].credit_hr;

      if (currentCredits + newCourseCredits > 18) {
        return { message: "❌ Credit hour limit exceeded (18 max)" };
      }

      const enrollmentCheck = await pool
        .request()
        .input("rollNo", sql.Char(8), rollNo)
        .input("courseCode", sql.VarChar(9), courseCode)
        .query(
          "SELECT * FROM Enrollments WHERE roll_no = @rollNo AND course_code = @courseCode"
        );

      if (enrollmentCheck.recordset.length > 0) {
        return { message: "❌ Student is already enrolled in this course" };
      }

      const semesterResult = await pool
        .request()
        .input("rollNo", sql.Char(8), rollNo)
        .query(
          "SELECT MAX(semester) + 1 AS nextSemester FROM Enrollments WHERE roll_no = @rollNo"
        );

      let semester = semesterResult.recordset[0]?.nextSemester || 1;

      // ✅ Enroll the student in the course with semester
      await pool
        .request()
        .input("rollNo", sql.Char(8), rollNo)
        .input("courseCode", sql.VarChar(9), courseCode)
        .input("sectionId", sql.Char(9), sectionId)
        .input("semester", sql.Int, semester)
        .query(
          "INSERT INTO Enrollments (roll_no, course_code, section_id, semester) VALUES (@rollNo, @courseCode, @sectionId, @semester)"
        );

      return { message: "✅ Course enrolled successfully" };
    } catch (error) {
      console.error("❌ Error enrolling course:", error);
      return { message: "❌ Internal Server Error" };
    }
  },
};

module.exports = studentModel;
