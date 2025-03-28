const { sql, poolPromise } = require("../config/db");

// ✅ Register Student
exports.createStudent = async (name, rollNo, email, hashedPassword) => {
    const pool = await poolPromise;
    await pool.request()
        .input("name", sql.VarChar, name)
        .input("roll_no", sql.Char(9), rollNo)
        .input("email", sql.VarChar, email)
        .input("password", sql.VarChar, hashedPassword)
        .query(`INSERT INTO Students (name, roll_no, email, password) VALUES (@name, @roll_no, @email, @password)`);
};

// ✅ Fetch Student by Email
exports.getStudentByEmail = async (email) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("email", sql.VarChar, email)
        .query("SELECT * FROM Students WHERE email = @email");
    return result.recordset[0];
};

// ✅ Update Password
exports.updatePassword = async (email, newPassword) => {
    const pool = await poolPromise;
    await pool.request()
    .input("email", sql.VarChar, email)
        .input("password", sql.VarChar, newPassword)
        .query("UPDATE Students SET password = @password WHERE email = @email");
};

// ✅ Fetch Enrolled Courses
exports.getEnrolledCourses = async (rollNo) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("roll_no", sql.Char(9), rollNo)
        .query(`SELECT E.section_id, E.course_code, C.course_name, C.course_dep, C.credit_hr, C.course_type
                FROM Enrollment E
                JOIN Courses C ON E.course_code = C.course_code
                WHERE E.roll_no = @roll_no`);
    return result.recordset;
};