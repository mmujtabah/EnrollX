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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Clean and format the Roll Number
    let formattedRollNo = formData.rollNo.trim().replace(/\s+/g, "").normalize("NFKC");
    formattedRollNo = formattedRollNo.replace(/l/g, "L"); // Convert lowercase "l" to uppercase "L"
    // Set the cleaned roll number back to the formData
    setFormData({ ...formData, rollNo: formattedRollNo });

    // Create the final data object
    const finalData = { ...formData, rollNo: formattedRollNo };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/students/register`,
        finalData,
        { withCredentials: true }
      );

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("❌ Registration failed:", err);
      console.log("❌ Backend Response:", err.response?.data);
      alert(err.response?.data?.message || "❌ Something went wrong!");
      document.querySelector("input[name='name']").focus();
    } finally {
      setLoading(false);
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
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                name="rollNo"
                placeholder="Roll Number (e.g., 23L-0545)"
                minLength={8}
                maxLength={8}
                value={formData.rollNo}
                onChange={handleChange}
                required
                pattern="^(2[0-9]|30)L-[0-9]{4}$"
                title="Roll number must be in the format: 23L-0545"
                disabled={loading}
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              className="register-btn" 
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
