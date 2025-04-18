import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewCoursesTaught.css";

const ViewCoursesTaught = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  const instructorId = localStorage.getItem("instructorId"); 

  useEffect(() => {
    if (!instructorId) {
      setError("Instructor ID not found.");
      return;
    }

    axios
      .get(`/api/instructors/${instructorId}/courses`)
      .then((res) => {
        setCourses(res.data);
        setError("");
      })
      .catch((err) => {
        setError("Failed to fetch courses.");
        console.error(err);
      });
  }, [instructorId]);

  return (
    <div className="courses-taught-container">
      <h2>Courses Taught</h2>
      {error && <div className="error-message">{error}</div>}
      {courses.length > 0 ? (
        <table className="courses-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Semester</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.courseCode}>
                <td>{course.courseCode}</td>
                <td>{course.courseTitle}</td>
                <td>{course.semester}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !error && <div className="error-message">No courses found.</div>
      )}
    </div>
  );
};

export default ViewCoursesTaught;
