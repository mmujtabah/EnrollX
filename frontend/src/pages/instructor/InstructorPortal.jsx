import React from "react";
import { Link } from "react-router-dom"; // For navigation
import './InstructorPortal.css'; 
import Layout from "../components/Layout.jsx";

const InstructorPortal = () => {
  return (
    <Layout>
      <div className="instructor-portal">
        <h1>Welcome to the Instructor Portal</h1>
        <p>
          This is the instructor portal. You can log in to manage your courses,
          view registered students, assign teaching assistants, and more.
        </p>
        <div className="student-portal-actions">
          <Link to="/instructor-login" className="btn instructor-btn login-btn">
            Login
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default InstructorPortal;
