const { sql, poolPromise } = require("../config/db");

const adminModel = {
    // ✅ Get all students
    getAllStudents: async () => {
        const pool = await poolPromise;
        return pool.request().query(`SELECT * FROM Students`);
    },

    // ✅ Get all instructors
    getAllInstructors: async () => {
        const pool = await poolPromise;
        return pool.request().query(`SELECT * FROM Instructors`);
    },

    // ✅ Add a new instructor
    addInstructor: async (id, email, password, name) => {
        const pool = await poolPromise;
        return pool.request()
            .input("id", sql.Char(9), id)
            .input("email", sql.NVarChar(255), email)
            .input("password", sql.NVarChar(255), password)
            .input("name", sql.NVarChar(255), name)
            .query(`
                INSERT INTO Instructors (id, email, password, name) 
                VALUES (@id, @email, @password, @name)
            `);
    },

    // ✅ Update an instructor's details
    updateInstructor: async (id, email, password, name) => {
        const pool = await poolPromise;
        return pool.request()
            .input("id", sql.Char(9), id)
            .input("email", sql.NVarChar(255), email)
            .input("password", sql.NVarChar(255), password)
            .input("name", sql.NVarChar(255), name)
            .query(`
                UPDATE Instructors 
                SET email = @email, password = @password, name = @name 
                WHERE id = @id
            `);
    },

    // ✅ Delete an instructor
    deleteInstructor: async (id) => {
        const pool = await poolPromise;
        return pool.request()
            .input("id", sql.Char(9), id)
            .query(`DELETE FROM Instructors WHERE id = @id`);
    },

    // ✅ Get all courses
    getAllCourses: async () => {
        const pool = await poolPromise;
        return pool.request().query(`SELECT * FROM Courses`);
    },

    // ✅ Add a course
    addCourse: async (courseCode, courseName, courseDep, creditHr, courseType, prereqCourse) => {
        const pool = await poolPromise;
        return pool.request()
            .input("courseCode", sql.VarChar(20), courseCode)
            .input("courseName", sql.NVarChar(255), courseName)
            .input("courseDep", sql.NVarChar(100), courseDep)
            .input("creditHr", sql.Int, creditHr)
            .input("courseType", sql.NVarChar(50), courseType)
            .input("prereqCourse", sql.VarChar(20), prereqCourse)
            .query(`
                INSERT INTO Courses (course_code, course_name, course_dep, credit_hr, course_type, prereq_course_code) 
                VALUES (@courseCode, @courseName, @courseDep, @creditHr, @courseType, @prereqCourse)
            `);
    },

    // ✅ Update a course
    updateCourse: async (courseCode, courseName, courseDep, prereqCourse) => {
        const pool = await poolPromise;
        return pool.request()
            .input("courseCode", sql.VarChar(20), courseCode)
            .input("courseName", sql.NVarChar(255), courseName)
            .input("courseDep", sql.NVarChar(100), courseDep)
            .input("prereqCourse", sql.VarChar(20), prereqCourse)
            .query(`
                UPDATE Courses 
                SET course_name = @courseName, course_dep = @courseDep, prereq_course_code = @prereqCourse 
                WHERE course_code = @courseCode
            `);
    },

    // ✅ Delete a course
    deleteCourse: async (courseCode) => {
        const pool = await poolPromise;
        return pool.request()
            .input("courseCode", sql.VarChar(20), courseCode)
            .query(`DELETE FROM Courses WHERE course_code = @courseCode`);
    },

    // ✅ Manage Enrollments
    addEnrollment: async (enrollId, rollNo, sectionId, courseCode, semester) => {
        const pool = await poolPromise;
        return pool.request()
            .input("enrollId", sql.Int, enrollId)
            .input("rollNo", sql.Char(8), rollNo)
            .input("sectionId", sql.Char(9), sectionId)
            .input("courseCode", sql.VarChar(20), courseCode)
            .input("semester", sql.Int, semester)
            .query(`
                INSERT INTO Enrollments (enroll_id, roll_no, section_id, course_code, semester) 
                VALUES (@enrollId, @rollNo, @sectionId, @courseCode, @semester)
            `);
    },

    updateEnrollmentSemester: async (rollNo, semester) => {
        const pool = await poolPromise;
        return pool.request()
            .input("rollNo", sql.Char(8), rollNo)
            .input("semester", sql.Int, semester)
            .query(`
                UPDATE Enrollments 
                SET semester = @semester 
                WHERE roll_no = @rollNo
            `);
    },

    deleteEnrollment: async (enrollId) => {
        const pool = await poolPromise;
        return pool.request()
            .input("enrollId", sql.Int, enrollId)
            .query(`DELETE FROM Enrollments WHERE enroll_id = @enrollId`);
    },

    // ✅ Update student name
    updateStudentName: async (rollNo, name) => {
        const pool = await poolPromise;
        return pool.request()
            .input("rollNo", sql.Char(8), rollNo)
            .input("name", sql.NVarChar(255), name)
            .query(`UPDATE Students SET name = @name WHERE roll_no = @rollNo`);
    }
};

module.exports = adminModel;
