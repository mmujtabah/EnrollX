import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    rollNo: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/forgot-password`,
        formData
      );
      alert(res.data.message);
    } catch (err) {
      console.error("Error:", err);
      alert("Error: " + err.response?.data?.error || "Password reset failed.");
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleReset}>
        <input type="text" name="rollNo" placeholder="Roll No" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
