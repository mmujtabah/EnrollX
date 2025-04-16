// admin-dashboard.js
import React from "react";
import "./AdminDashboard.css";
import { Link } from "react-router-dom"


export default function AdminDashboard() {
  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>Admin Dashboard</h2>
        <div className="nav-links">
          <a href="#overview" className="nav-btn">Overview</a>
          <a href="#users" className="nav-btn">Users</a>
          <a href="#reports" className="nav-btn">Reports</a>
          <a href="#settings" className="nav-btn">Settings</a>
        </div>
      </nav>

      <section className="admin-hero">
        <div className="admin-cards">
          <div className="admin-card users">
            <Link to="/admin-update-student" className="studentupdate">
            <h3>Update Student/s Data</h3>
            </Link>
            <p></p>
          </div>
          <div className="admin-card reports">
            <Link to="/admin-update-instructors" className="instructorupdate">
            <h3>Update Instructor/s Data</h3>
            </Link>
            <p></p>
          </div>
          <div className="admin-card active">
            <Link to="/admin-course-registration" className="courseregistration">
            <h3>Start Course Registration</h3>
            </Link>
            <p></p>
          </div>
        </div>

        <div className="admin-content">
          <h1>Welcome, Admin</h1>
          <p>Manage Students, Instructors and Courses, all in one place.</p>
        </div>
      </section>
    </div>
  );
}
