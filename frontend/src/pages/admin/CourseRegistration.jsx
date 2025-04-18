// course-registration.js
import React, { useState, useEffect } from "react";
import "./UpdateStudent.css";

export default function CourseRegistration() {
  const [days, setDays] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [registrationStarted, setRegistrationStarted] = useState(false);

  const handleStart = (e) => {
    e.preventDefault();
    if (!days || isNaN(days)) return;
    const end = new Date();
    end.setDate(end.getDate() + parseInt(days));
    setEndDate(end);
    setRegistrationStarted(true);
  };

  useEffect(() => {
    if (!registrationStarted) return;
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, [registrationStarted]);

  const getRemainingDays = () => {
    if (!endDate) return 0;
    const diff = Math.max(endDate - currentDate, 0);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="update-container">
      {!registrationStarted ? (
        <form className="update-form" onSubmit={handleStart}>
          <h1 className="form-title">Start Course Registration</h1>
          <input
            type="number"
            placeholder="Enter number of days"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            required
          />
          <button type="submit" className="btn update-btn">Start Registration</button>
        </form>
      ) : (
        <div className="update-form">
          <h1 className="form-title">Course Registration Ongoing</h1>
          <p>Registration will end on: <strong>{endDate.toDateString()}</strong></p>
          <p>Remaining Days: <strong>{getRemainingDays()}</strong></p>
        </div>
      )}
    </div>
  );
}
