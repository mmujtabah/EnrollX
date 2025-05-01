import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";  // Import toast
import "react-toastify/dist/ReactToastify.css";  // Import the styles
import "./StudentLogin.css";
import Layout from "../components/Layout.jsx";

const Login = () => {
  const [formData, setFormData] = useState({
    rollNo: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/students/login`,
        formData,
        { withCredentials: true }
      );
      
      // Ensure that res.data.message exists
      console.log(res.data.message);  // Log the message to check

      // Replace alert with toast
      toast.success(res.data.message); // Success toast

      // Add a delay before navigating
      setTimeout(() => {
        navigate("/student-dashboard");
      }, 1000); // 1 second delay before redirecting
    } catch (err) {
      console.error("Login failed", err);
      
      // Replace alert with error toast
      toast.error("Error: " + (err.response?.data?.error || "Invalid credentials.")); // Error toast
    }
  };

  return (
    <Layout>
      {/* Make sure ToastContainer is in the right place */}
      <ToastContainer position="top-right" autoClose={3000} />  {/* ToastContainer for toast notifications */}
      
      <div className="login-container">
        <div className="login-box">
          <h2>Student Login</h2>
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <input
                type="text"
                name="rollNo"
                placeholder="Enter your Roll Number"
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Enter your Password"
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="login-btn">Login</button>
          </form>
          <div className="forgot-password">
            <a href="/student-forgot-password">Forgot Password?</a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
