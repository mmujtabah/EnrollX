import React, { useState } from "react";
import axios from "axios";
import "./Register.css"; 
import Layout from "../components/Layout.jsx";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/students/register`,
        formData,
        { withCredentials: true }
      );
      alert(res.data.message);
    } catch (err) {
      console.error("Registration failed", err);
      alert("Error: " + err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <Layout>
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        <form onSubmit={handleRegister} className="register-form">
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              name="rollNo"
              placeholder="Roll Number"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="register-btn">Register</button>
        </form>
      </div>
    </div>
    </Layout>
  );
};

export default Register;
