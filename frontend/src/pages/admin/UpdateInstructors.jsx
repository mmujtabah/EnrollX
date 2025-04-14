// update-instructor.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UpdateInstructors.css";

export default function UpdateInstructor() {
  const [instructorId, setInstructorId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [instructor, setInstructor] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
  });

  const navigate = useNavigate();

  const handleIdSubmit = (e) => {
    e.preventDefault();
    // Simulate a check for existing ID (replace this with a real API call)
    const existingIds = ["123", "456", "789"];
    if (existingIds.includes(instructorId)) {
      setShowForm(true);
    } else {
      alert("Instructor ID not found. Redirecting to dashboard.");
      navigate("/admin-dashboard");
    }
  };

  const handleChange = (e) => {
    setInstructor({ ...instructor, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated instructor info:", instructor);
    // Backend call can go here
  };

  return (
    <div className="update-container">
      {!showForm ? (
        <form className="update-form" onSubmit={handleIdSubmit}>
          <h1 className="form-title">Enter Instructor ID</h1>
          <input
            type="text"
            name="instructorId"
            placeholder="Instructor ID"
            value={instructorId}
            onChange={(e) => setInstructorId(e.target.value)}
            required
          />
          <button type="submit" className="btn update-btn">Verify ID</button>
        </form>
      ) : (
        <>
          <h1 className="form-title">Update Instructor Information</h1>
          <form className="update-form" onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={instructor.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Email:
              <input
                type="email"
                name="email"
                value={instructor.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Department:
              <input
                type="text"
                name="department"
                value={instructor.department}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Designation:
              <input
                type="text"
                name="designation"
                value={instructor.designation}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit" className="btn update-btn">Update</button>
          </form>
        </>
      )}
    </div>
  );
}
