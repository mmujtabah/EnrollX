const { sql, poolPromise } = require("../config/db");

// ✅ Register Student
exports.createStudent = async (name, rollNo, email, hashedPassword) => {
    const pool = await poolPromise;
    await pool.request()
        .input("name", sql.VarChar, name)
        .input("rollNo", sql.Char(8), rollNo)
        .input("email", sql.VarChar, email)
        .input("password", sql.VarChar, hashedPassword)
        .query(`INSERT INTO Students (name, roll_no, email, password) VALUES (@name, @rollNo, @email, @password)`);
};

// ✅ Fetch Student by RollNo
exports.getStudentByRollNo = async (rollNo) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("rollNo", sql.Char(8), rollNo)
        .query("SELECT * FROM Students WHERE roll_no = @rollNo");
    return result.recordset[0];
};

// ✅ Update Password
exports.updatePassword = async (rollNo, newPassword) => {
    const pool = await poolPromise;
    await pool.request()
        .input("rollNo", sql.Char(8), rollNo)
        .input("password", sql.VarChar, newPassword)
        .query("UPDATE Students SET password = @password WHERE roll_no = @rollNo");
};

// ✅ Fetch Enrolled Courses
exports.getEnrolledCourses = async (rollNo) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("rollNo", sql.Char(8), rollNo)
        .query(`SELECT E.section_id, E.course_code, C.course_name, C.course_dep, C.credit_hr, C.course_type
                FROM Enrollment E
                JOIN Courses C ON E.course_code = C.course_code
                WHERE E.rollNo = @rollNo`);
    return result.recordset;
};
