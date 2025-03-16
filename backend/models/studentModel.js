const { sql, poolPromise } = require('../api/db');

const getStudentByEmail = async (email) => {
    const pool = await poolPromise;
    const result = await pool
        .request()
        .input('email', sql.VarChar, email)
        .query("SELECT * FROM Students WHERE email = @email");
    return result.recordset[0];
};

const updateStudentPassword = async (email, newPassword) => {
    const pool = await poolPromise;
    await pool
        .request()
        .input('email', sql.VarChar, email)
        .input('password', sql.VarChar, newPassword)
        .query("UPDATE Students SET password = @password WHERE email = @email");
};

module.exports = { getStudentByEmail, updateStudentPassword };
