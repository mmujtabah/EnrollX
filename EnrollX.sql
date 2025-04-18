CREATE DATABASE EnrollX;
GO 
USE EnrollX;

CREATE TABLE Students (
    roll_no CHAR(8) PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE Instructors (
    id CHAR(9) PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE Courses (
    course_code VARCHAR(9) PRIMARY KEY,
    course_name VARCHAR(50) UNIQUE NOT NULL,
    course_dep VARCHAR(50) NOT NULL,
    credit_hr INT CHECK (credit_hr >= 1 AND credit_hr <= 3) NOT NULL,
    course_type VARCHAR(10) CHECK (course_type IN ('elective', 'core')) NOT NULL,
    course_semester INT CHECK(course_semester >= 1 AND course_semester <= 8) NOT NULL
);

CREATE TABLE Course_Sections (
    section_id CHAR(9),
    course_code VARCHAR(9),
    instructor_id CHAR(9),
    max_capacity INT CHECK (max_capacity > 0) NOT NULL,
    PRIMARY KEY (section_id, course_code),
    FOREIGN KEY (course_code) REFERENCES Courses(course_code) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES Instructors(id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
);

CREATE TABLE TA (
    roll_no CHAR(8) PRIMARY KEY,
    batch INT NOT NULL,
    FOREIGN KEY (roll_no) REFERENCES Students(roll_no) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

CREATE TABLE Enrollments (
    enroll_id INT IDENTITY(1,1) PRIMARY KEY,
    roll_no CHAR(8), 
    section_id CHAR(9),
    course_code VARCHAR(9),
    semester INT CHECK (semester >= 1 AND semester <= 8) NOT NULL,
    enroll_datetime DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (roll_no) REFERENCES Students(roll_no) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (section_id, course_code) REFERENCES Course_Sections(section_id, course_code) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

CREATE TABLE Course_Section_TA (
    section_id CHAR(9),
    course_code VARCHAR(9),
    TA_roll_no CHAR(8), 
    PRIMARY KEY (section_id, course_code, TA_roll_no),
    FOREIGN KEY (section_id, course_code) REFERENCES Course_Sections(section_id, course_code) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (TA_roll_no) REFERENCES TA(roll_no) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

CREATE TABLE Registration_Period (
    period_id CHAR(9) PRIMARY KEY,
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME NOT NULL,
    is_active BIT DEFAULT 0
);

-- Admin Controlled Queries
GO
CREATE PROCEDURE REGISTER_STUDENT
    @rollNo CHAR(8),  
    @email VARCHAR(50),                   
    @password VARCHAR(100),
    @name VARCHAR(50)
AS
BEGIN
    INSERT INTO Students (name, roll_no, email, password) 
    VALUES (@name, @rollNo, @email, @password)
END

EXEC REGISTER_STUDENT @name = 'Ahmed Ali', @rollNo = '23L0500', @email = '23l0500@lhr.nu.edu.pk', @password = '12345678'
EXEC REGISTER_STUDENT @name = 'Ali Ahmed', @rollNo = '23L0501', @email = '23l0501@lhr.nu.edu.pk', @password = '1234567890'
EXEC REGISTER_STUDENT @name = 'Jahangir Ahmed', @rollNo = '23L0502', @email = '23l0502@lhr.nu.edu.pk', @password = '123456789'

GO
CREATE PROCEDURE GET_STUDENT_ROLLNO
    @rollNo CHAR(8)
AS
BEGIN
    SELECT * FROM Students 
    WHERE roll_no = @rollNo
END

EXEC GET_STUDENT_ROLLNO @rollNO = '23L0500'

GO
CREATE PROCEDURE UPDATE_PASSWORD
    @rollNo CHAR(8), 
    @password VARCHAR(100)
AS
BEGIN
    UPDATE Students SET password = @password 
    WHERE roll_no = @rollNo
END

EXEC UPDATE_PASSWORD @rollNo = '23L0500', @password = '!@#123456!@#'

GO
CREATE PROCEDURE GET_ENROLLED_COURSES
    @rollNo CHAR(8)
AS
BEGIN
    SELECT E.section_id, E.course_code, C.course_name, C.course_dep, C.credit_hr, C.course_type
    FROM Enrollments E
    JOIN Courses C ON E.course_code = C.course_code
    WHERE E.roll_no = @rollNo
END

EXEC GET_ENROLLED_COURSES @rollNo = '23L0500'

GO 
CREATE PROCEDURE GET_COURSES_OFFERED
    @rollNo CHAR(8)
AS
BEGIN
    SELECT c.course_code, c.course_name, c.course_dep, c.credit_hr, c.course_type, c.course_semester
    FROM Courses c
    JOIN Course_Sections cs ON c.course_code = cs.course_code
    JOIN Registration_Period rp ON GETDATE() BETWEEN rp.start_datetime AND rp.end_datetime AND rp.is_active = 1
    WHERE c.course_semester = (
        SELECT MAX(e.semester) + 1
        FROM Enrollments e
        WHERE e.roll_no = @rollNo
    )
    ORDER BY c.course_semester
END


SELECT * FROM Registration_Period 
WHERE GETDATE() BETWEEN start_datetime AND end_datetime AND is_active = 1

GO
CREATE PROCEDURE CHECK_STUDENT
    @rollNo CHAR(8)
AS
BEGIN
    SELECT * FROM Students 
    WHERE roll_no = @rollNo
END

EXEC CHECK_STUDENT @rollNo = '23L0500'

GO
CREATE PROCEDURE CHECK_COURSE 
    @courseCode VARCHAR(9)
AS 
BEGIN
    SELECT * FROM Courses 
    WHERE course_code = @courseCode
END

EXEC CHECK_COURSE @courseCode = 'CS1001'
 
GO
CREATE PROCEDURE CHECK_ENROLLMENT
    @rollNo CHAR(8),
    @courseCode VARCHAR(9)
AS
BEGIN
    SELECT * FROM Enrollments 
    WHERE roll_no = @rollNo AND course_code = @courseCode
END

EXEC CHECK_ENROLLMENT @rollNo = '23L0500', @courseCode = 'CS1001'

GO
CREATE PROCEDURE DELETE_ENROLLMENT
    @rollNo CHAR(8),
    @courseCode VARCHAR(9)
AS
BEGIN
    DELETE FROM Enrollments
    WHERE roll_no = @rollNo AND course_code = @courseCode
END

EXEC DELETE_ENROLLMENT @rollNo = '23L0500', @courseCode = 'CS1001'

SELECT * FROM Registration_Period 
WHERE GETDATE() BETWEEN start_datetime AND end_datetime 
AND is_active = 1

GO
CREATE PROCEDURE GET_COURSE_TYPE
    @courseCode VARCHAR(9)
AS 
BEGIN
    SELECT course_type 
    FROM Courses 
    WHERE course_code = @courseCode
END

EXEC GET_COURSE_TYPE @courseCode = 'CS1001'

GO
CREATE PROCEDURE GET_SECTION
    @rollNo CHAR(8)
AS 
BEGIN
    SELECT TOP 1 section_id 
    FROM Enrollments E
    JOIN Courses C ON E.course_code = C.course_code
    WHERE E.roll_no = @rollNo AND C.course_type = 'core'
END

GO
CREATE PROCEDURE GET_CR_HR
    @rollNo CHAR(8)
AS
BEGIN
    SELECT SUM(C.credit_hr) AS totalCredits 
    FROM Enrollments E 
    JOIN Courses C ON E.course_code = C.course_code 
    WHERE E.roll_no = @rollNo
END

EXEC GET_CR_HR @rollNo = '23L0500'

GO
CREATE PROCEDURE GET_COURSE_CR_HR
    @courseCode VARCHAR(9)
AS 
BEGIN 
    SELECT credit_hr 
    FROM Courses 
    WHERE course_code = @courseCode
END

EXEC GET_COURSE_CR_HR @courseCode = 'CS1001'

GO
CREATE PROCEDURE NEXT_SEM 
    @rollNo CHAR(8)
AS
BEGIN
    SELECT MAX(semester) + 1 AS nextSemester 
    FROM Enrollments 
    WHERE roll_no = @rollNo
END

EXEC NEXT_SEM @rollNo = '23L0500'

GO
CREATE PROCEDURE ENROLL_STUDENT
    @rollNo CHAR(8),
    @courseCode VARCHAR(9),
    @sectionId CHAR(9),
    @semester INT
AS
BEGIN
    INSERT INTO Enrollments (roll_no, course_code, section_id, semester) 
    VALUES (@rollNo, @courseCode, @sectionId, @semester)
END

-- Instructors Queries

GO
CREATE PROCEDURE GET_REGISTERED_STUDENTS
    @instructorId CHAR(9),
    @courseCode VARCHAR(9)
AS 
BEGIN
    SELECT cs.instructor_id, s.roll_no, s.name, cs.course_code, cs.section_id
    FROM Course_Sections cs 
    JOIN Enrollments e ON cs.section_id = e.section_id
    JOIN Students s ON e.roll_no = s.roll_no
    WHERE cs.instructor_id = @instructorId 
    AND cs.course_code = @courseCode
END

GO
CREATE PROCEDURE GET_TEACHER_ASSISTANTS
    @instructorId CHAR(9),
    @courseCode VARCHAR(9)
AS
BEGIN
    SELECT i.id AS instructor_id, i.name AS instructor_name, 
    ta.roll_no AS ta_roll_no, s.name AS ta_name, cs.course_code, cs.section_id
    FROM Students s 
    JOIN TA ta ON s.roll_no = ta.roll_no
    JOIN Course_Section_TA cst ON ta.roll_no = cst.TA_roll_no
    JOIN Course_Sections cs ON cs.section_id = cst.section_id
    JOIN Instructors i ON i.id = cs.instructor_id
    WHERE cs.instructor_id = @instructorId 
    AND cs.course_code = @courseCode
END

GO 
CREATE PROCEDURE GET_COURSES_TAUGHT
    @instructorId CHAR(9)
AS
BEGIN
    SELECT DISTINCT cs.course_code, c.course_name, cs.section_id
    FROM Course_Sections cs
    JOIN Courses c ON cs.course_code = c.course_code
    WHERE cs.instructor_id = @instructorId
END

-- Admin Queries (CRUD OPERATIONS)

SELECT * FROM Students

SELECT * FROM Instructors

GO
CREATE PROCEDURE ADD_INSTRUCTOR
    @id CHAR(9),
    @email VARCHAR(50), 
    @password VARCHAR(100),
    @name VARCHAR(50)
AS
BEGIN
    INSERT INTO Instructors (id, email, password, name) 
    VALUES (@id, @email, @password, @name)
END

EXEC ADD_INSTRUCTOR @id = 'ID0000001', @email = 'john.doe@example.com', @password = '12345678', @name = 'John Doe'

GO
CREATE PROCEDURE UPDATE_INSTRUCTOR
    @id CHAR(9),
    @email VARCHAR(50), 
    @password VARCHAR(100),
    @name VARCHAR(50)
AS
BEGIN
    UPDATE Instructors 
    SET email = @email, password = @password, name = @name 
    WHERE id = @id
END

EXEC UPDATE_INSTRUCTOR @id = 'ID0000001', @email = 'john.adams.doe@example.com', @password = '87654321', @name = 'John Adams'

GO
CREATE PROCEDURE DELETE_INSTRUCTOR 
    @id CHAR(9)
AS
BEGIN
    DELETE FROM Instructors 
    WHERE id = @id
END

EXEC DELETE_INSTRUCTOR @id = 'ID0000001'

SELECT * FROM Courses

GO
CREATE PROCEDURE ADD_COURSE
    @courseCode VARCHAR(9),
    @courseName VARCHAR(50),
    @courseDep VARCHAR(50),
    @creditHr INT,
    @courseType VARCHAR(10),
    @courseSemester INT
AS
BEGIN
    INSERT INTO Courses (course_code, course_name, course_dep, credit_hr, course_type, course_semester) 
    VALUES (@courseCode, @courseName, @courseDep, @creditHr, @courseType, @courseSemester)
END

EXEC ADD_COURSE @courseCode = 'CS1001', @courseName = 'PF', @courseDep = 'CS', @creditHr = 3, @courseType = 'core', @courseSemester = 1

GO 
CREATE PROCEDURE UPDATE_COURSE
    @courseCode VARCHAR(9),
    @courseName VARCHAR(50),
    @courseDep VARCHAR(50),
    @courseSemester INT
AS 
BEGIN 
    UPDATE Courses 
    SET course_name = @courseName, course_dep = @courseDep, course_semester = @courseSemester
    WHERE course_code = @courseCode
END

EXEC UPDATE_COURSE @courseCode = 'CS1001', @courseName = 'Intro to ICT', @courseDep = 'CSE', @courseSemester = 1

GO 
CREATE PROCEDURE DELETE_COURSE 
    @course_code VARCHAR(9)
AS
BEGIN
    DELETE FROM Courses WHERE course_code = @course_code
END

INSERT INTO Course_Sections(section_id, course_code, instructor_id, max_capacity)
VALUES ('LHRBSCS4A','CS1001','ID0000001',25)

GO 
CREATE PROCEDURE ADD_ENROLLMENTS 
    @rollNo CHAR(8), 
    @sectionId CHAR(9),
    @courseCode VARCHAR(9),
    @semester INT
AS
BEGIN
    INSERT INTO Enrollments (roll_no, section_id, course_code, semester) 
    VALUES  (@rollNo, @sectionId, @courseCode, @semester)
END

EXEC ADD_ENROLLMENTS @roLLNo = '23L0500', @sectionId = 'LHRBSCS4A', @courseCode = 'CS1001', @semester = 4

GO 
CREATE PROCEDURE UPDATE_ENROLLMENTS
    @rollNo CHAR(8), 
    @semester INT   
AS
BEGIN
    UPDATE Enrollments 
    SET semester = @semester 
    WHERE roll_no = @rollNo
END

EXEC UPDATE_ENROLLMENTS @rollNo = '23L0500', @semester = 3

GO 
CREATE PROCEDURE DELETE_ENROLLMENTS
    @enrollId INT
AS
BEGIN
    DELETE FROM Enrollments WHERE enroll_id = @enrollId
END


GO
CREATE PROCEDURE UPDATE_STUDENTS
    @rollNo CHAR(8),
    @name VARCHAR(50)
AS
BEGIN
    UPDATE Students 
    SET name = @name 
    WHERE roll_no = @rollNo
END

EXEC UPDATE_STUDENTS @rollNo = '23L0500', @name = 'Ahmed Ali Khan'