import React, { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout"; // Import Layout component with Navbar
import "./InstructorForgotPassword.css"; // Reusing same styles

const InstructorForgotPassword = () => {
  const [formData, setFormData] = useState({
    instructorId: "",
    email: "",
  });
  const [loading, setLoading] = useState(false); // To handle loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/instructors/forgot-password`,
        formData
      );
      alert(res.data.message);
    } catch (err) {
      console.error("Error:", err);
      alert("Error: " + (err.response?.data?.error || "Password reset failed."));
    }
    setLoading(false); // End loading
  };

  return (
    <Layout>
      <div className="forgot-password-container">
        <div className="forgot-password-box">
          <h2>Instructor Forgot Password</h2>
          <form className="forgot-password-form" onSubmit={handleReset}>
            <div className="input-group">
              <input
                type="text"
                name="instructorId"
                placeholder="Enter your Instructor ID"
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="forgot-password-btn" disabled={loading}>
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </form>
          <div className="back-to-login">
            <a href="/instructor-login">Back to Login</a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InstructorForgotPassword;
