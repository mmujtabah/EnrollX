CREATE DATABASE EnrollX;
GO 
USE EnrollX;

CREATE TABLE Students (
    roll_no CHAR(8) PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(50) NOT NULL,
    current_semester INT CHECK (current_semester >= 1 AND current_semester <= 8) NOT NULL DEFAULT 1
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
    course_type VARCHAR(10) CHECK (course_type IN ('Elective', 'Core')) NOT NULL,
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

CREATE TABLE Admin(
    admin_id CHAR(9) PRIMARY KEY,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(50) NOT NULL,
);


GO
CREATE PROCEDURE REGISTER_STUDENT
    @rollNo CHAR(8),  
    @email VARCHAR(50),                   
    @password VARCHAR(100),
    @name VARCHAR(50),
    @current_semester INT
AS
BEGIN
    INSERT INTO Students (name, roll_no, email, password, current_semester) 
    VALUES (@name, @rollNo, @email, @password, @current_semester)
END

GO
CREATE PROCEDURE UPDATE_PASSWORD
    @rollNo CHAR(8), 
    @password VARCHAR(100)
AS
BEGIN
    UPDATE Students SET password = @password 
    WHERE roll_no = @rollNo
END

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
        SELECT current_semester
        FROM Students
        WHERE roll_no = @rollNo
    )
    ORDER BY c.course_semester
END

GO
CREATE PROCEDURE ENROLL_STUDENT
    @rollNo CHAR(8),
    @courseCode VARCHAR(9),
    @sectionId CHAR(9)
AS
BEGIN
    DECLARE @courseType VARCHAR(10)
    DECLARE @prevSectionId CHAR(9)
    DECLARE @prevSectionChar CHAR(1)
    DECLARE @newSectionChar CHAR(1)
    DECLARE @availableSeats INT

    SELECT @courseType = course_type 
    FROM Courses 
    WHERE course_code = @courseCode

    SELECT @availableSeats = available_seats 
    FROM Course_Sections 
    WHERE section_id = @sectionId

    IF @availableSeats IS NULL
    BEGIN
        RAISERROR('Invalid section ID.', 16, 1)
        RETURN
    END

    IF @availableSeats <= 0
    BEGIN
        RAISERROR('No seats available in this section.', 16, 1)
        RETURN
    END

    IF @courseType = 'Core'
    BEGIN
        SELECT TOP 1 @prevSectionId = E.section_id
        FROM Enrollments E
        JOIN Courses C ON E.course_code = C.course_code
        WHERE E.roll_no = @rollNo AND C.course_type = 'Core'
        ORDER BY E.semester DESC

        SET @prevSectionChar = RIGHT(@prevSectionId, 1)
        SET @newSectionChar = RIGHT(@sectionId, 1)

        IF @prevSectionChar <> @newSectionChar
        BEGIN
            RAISERROR('Section mismatch. You must enroll in the same section group as your previous core course.', 16, 1)
            RETURN
        END
    END

    INSERT INTO Enrollments (roll_no, course_code, section_id) 
    VALUES (@rollNo, @courseCode, @sectionId)

    UPDATE Course_Sections
    SET available_seats = available_seats - 1
    WHERE section_id = @sectionId
END

GO
CREATE PROCEDURE CHECK_STUDENT
    @rollNo CHAR(8),
    @name VARCHAR(50) OUTPUT,
    @email VARCHAR(50) OUTPUT,
    @status BIT OUTPUT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Students WHERE roll_no = @rollNo)
    BEGIN
        SELECT @name = name, @email = email FROM Students WHERE roll_no = @rollNo
        SET @status = 1
    END
    ELSE
    BEGIN
        SET @name = NULL
        SET @email = NULL
        SET @status = 0
    END
END


SELECT * FROM Registration_Period 
WHERE GETDATE() BETWEEN start_datetime AND end_datetime 
AND is_active = 1


GO
CREATE PROCEDURE GET_CREDITHR
    @rollNo CHAR(8)
AS
BEGIN
    SELECT SUM(C.credit_hr) AS totalCredits 
    FROM Enrollments E 
    JOIN Courses C ON E.course_code = C.course_code 
    WHERE E.roll_no = @rollNo
END

GO
CREATE PROCEDURE INCREMENT_SEM
AS
BEGIN
    UPDATE Students
    SET current_semester = current_semester + 1
    WHERE current_semester < 8
END

GO
CREATE PROCEDURE GET_REGISTERED_STUDENTS
    @instructorId CHAR(9),
    @courseCode VARCHAR(9),
    @sectionId CHAR(9)
AS 
BEGIN
    SELECT cs.instructor_id, s.roll_no, s.name, cs.course_code, cs.section_id
    FROM Course_Sections cs 
    JOIN Enrollments e ON cs.section_id = e.section_id
    JOIN Students s ON e.roll_no = s.roll_no
    WHERE cs.instructor_id = @instructorId 
      AND cs.course_code = @courseCode
      AND cs.section_id = @sectionId
END


GO
CREATE PROCEDURE GET_TEACHER_ASSISTANTS
    @instructorId CHAR(9),
    @courseCode VARCHAR(9),
    @sectionId CHAR(9)
AS
BEGIN
    SELECT 
        i.id AS instructor_id, 
        i.name AS instructor_name, 
        ta.roll_no AS ta_roll_no, 
        s.name AS ta_name, 
        cs.course_code, 
        cs.section_id
    FROM Students s 
    JOIN TA ta ON s.roll_no = ta.roll_no
    JOIN Course_Section_TA cst ON ta.roll_no = cst.TA_roll_no
    JOIN Course_Sections cs ON cs.section_id = cst.section_id
    JOIN Instructors i ON i.id = cs.instructor_id
    WHERE cs.instructor_id = @instructorId 
      AND cs.course_code = @courseCode
      AND cs.section_id = @sectionId
END


GO 
CREATE PROCEDURE GET_COURSES_TEACHING
    @instructorId CHAR(9)
AS
BEGIN
    SELECT DISTINCT cs.course_code, c.course_name, cs.section_id
    FROM Course_Sections cs
    JOIN Courses c ON cs.course_code = c.course_code
    WHERE cs.instructor_id = @instructorId
END


GO
CREATE PROCEDURE GET_INSTRUCTOR_DETAILS
    @id CHAR(9),
    @email VARCHAR(50) OUTPUT,
    @name VARCHAR(50) OUTPUT,
    @status BIT OUTPUT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Instructors WHERE id = @id)
    BEGIN
        SELECT @email = email, @name = name
        FROM Instructors
        WHERE id = @id
        SET @status = 1
    END
    ELSE
    BEGIN
        SET @email = NULL
        SET @name = NULL
        SET @status = 0
    END
END

GO
CREATE PROCEDURE UPDATE_INSTRUCTOR
    @id CHAR(9),
    @email VARCHAR(50), 
    @name VARCHAR(50)
AS
BEGIN
    UPDATE Instructors 
    SET email = @email, password = @password, name = @name 
    WHERE id = @id
END

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
