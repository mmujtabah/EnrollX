// update-student.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UpdateStudent.css";

export default function UpdateStudent() {
  const [studentId, setStudentId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [student, setStudent] = useState({
    name: "",
    email: "",
    department: "",
    year: "",
  });

  const navigate = useNavigate();

  const handleIdSubmit = (e) => {
    e.preventDefault();
    // Simulated check for valid student IDs
    const validIds = ["101", "202", "303"];
    if (validIds.includes(studentId)) {
      setShowForm(true);
    } else {
      alert("Student Roll Number not found. Redirecting to dashboard.");
      navigate("/admin-dashboard");
    }
  };

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated student info:", student);
    // API call can be added here
  };

  return (
    <div className="update-container">
      {!showForm ? (
        <form className="update-form" onSubmit={handleIdSubmit}>
          <h1 className="form-title">Enter Roll Number</h1>
          <input
            type="text"
            name="studentId"
            placeholder="Roll Number"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
          <button type="submit" className="btn update-btn">Verify Roll Number</button>
        </form>
      ) : (
        <>
          <h1 className="form-title">Update Student Information</h1>
          <form className="update-form" onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={student.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Email:
              <input
                type="email"
                name="email"
                value={student.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Department:
              <input
                type="text"
                name="department"
                value={student.department}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Year:
              <select
                name="year"
                value={student.year}
                onChange={handleChange}
                required
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </label>

            <button type="submit" className="btn update-btn">Update</button>
          </form>
        </>
      )}
    </div>
  );
}