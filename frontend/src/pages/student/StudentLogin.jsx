import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

      alert(res.data.message);
      navigate("/student-dashboard");
    } catch (err) {
      console.error("Login failed", err);
      alert("Error: " + (err.response?.data?.error || "Invalid credentials."));
    }
  };

  return (
    <Layout>
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
