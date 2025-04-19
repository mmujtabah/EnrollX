import React, { useEffect, useState } from "react";
import "./InstructorDashboard.css"; // Reuse styles
import Layout from "../components/Layout.jsx";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const getCookie = (name) => {
  const cookieArray = document.cookie.split("; ");
  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].split("=");
    if (cookie[0] === name) {
      return cookie[1];
    }
  }
  return null;
};

const InstructorDashboard = () => {
  const [animate, setAnimate] = useState(false);
  const [instructorName, setInstructorName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setInstructorName(decodedToken.name || "Instructor");
      } catch (error) {
        console.error("Token decoding error:", error);
      }
    }

    const timeout = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/instructor-login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Layout>
      <div className="student-dashboard">
        <h1>Instructor Dashboard</h1>
        <p>Welcome, {instructorName || "Instructor"}! Manage your teaching responsibilities below.</p>

        <div className="dashboard-cards">
          <Link to="/instructor-registered-students" className={`dashboard-card ${animate ? "dashboard-card-animated" : ""}`}>
            <h2>📋 Registered Students</h2>
            <p>View students enrolled in your courses.</p>
          </Link>

          <Link to="/instructor-tas" className={`dashboard-card ${animate ? "dashboard-card-animated" : ""}`}>
            <h2>🧑‍🏫 Teaching Assistants</h2>
            <p>See the list of assigned TAs.</p>
          </Link>

          <Link to="/instructor-courses" className={`dashboard-card ${animate ? "dashboard-card-animated" : ""}`}>
            <h2>📚 Courses Taught</h2>
            <p>Details of the courses you are teaching.</p>
          </Link>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </Layout>
  );
};

export default InstructorDashboard;
