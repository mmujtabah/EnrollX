import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import './StudentHome.css'; // Import the CSS file for styling
import Layout from "../components/Layout.jsx";

const StudentHome = () => {
  return (
    <Layout>
    <div className="student-home">
      <h1>Welcome to the Student Portal</h1>
      <p>
        This is the student home page. Here you can find your course
        registration details, assignments, and other resources.
      </p>
      <div className="student-home-actions">
        {/* Navigation Links */}
        <Link to="/student-register" className="btn student-btn register-btn">
          Register
        </Link>
        <Link to="/student-login" className="btn student-btn login-btn">
          Login
        </Link>
      </div>
    </div>
    </Layout>
  );
};

export default StudentHome;
