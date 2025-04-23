import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import Layout from "../components/Layout.jsx";
import "./StudentCourses.css";
import { jwtDecode } from "jwt-decode";

const getCookie = (name) => {
  const cookieArray = document.cookie.split("; ");
  for (let i = 0; i < cookieArray.length; i++) {
    const [cookieName, cookieValue] = cookieArray[i].split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
};

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = getCookie("token");
        const decoded = jwtDecode(token);
        const rollNo = decoded.rollNo;
        setStudentName(decoded.name || "Student");

        const url = `${
          import.meta.env.VITE_API_URL
        }/api/students/${rollNo}/courses`;
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch courses");

        setCourses(data);
      } catch (error) {
        console.error("❌ Error fetching courses:", error);
        setErrorMessage("Something went wrong while fetching courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <Layout>
      <div className="student-courses">
        <h1>{studentName}'s Enrolled Courses</h1>
        
        {/* Back Button */}
        <Link to="/student-dashboard" className="back-button">Back to Dashboard</Link>

        {loading ? (
          <div className="shimmer-loader">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="shimmer-card" />
            ))}
          </div>
        ) : errorMessage ? (
          <p className="error">{errorMessage}</p>
        ) : courses.length === 0 ? (
          <p>You are not enrolled in any courses.</p>
        ) : (
          <div className="courses-list">
            {courses.map((course, index) => (
              <div
                className="course-card"
                key={`${course.course_code}-${course.section_id.trim()}`}
              >
                <h2>
                  {course.course_code} <br /> {course.course_name}
                </h2>
                <p>
                  <strong>Section:</strong> {course.section_id.trim()}
                </p>
                <p>
                  <strong>Department:</strong> {course.course_dep}
                </p>
                <p>
                  <strong>Credit Hours:</strong> {course.credit_hr}
                </p>
                <p>
                  <strong>Course Type:</strong> {course.course_type}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentCourses;
