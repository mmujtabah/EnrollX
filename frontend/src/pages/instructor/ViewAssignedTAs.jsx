import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import "./ViewAssignedTAs.css"; 

const ViewAssignedTAs = () => {
  const [tas, setTAs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTAs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/instructors/assigned-tas`,
          { withCredentials: true }
        );
        setTAs(res.data.tas || []);
      } catch (err) {
        console.error("Error fetching TAs:", err);
        setError("Failed to load assigned TAs.");
      } finally {
        setLoading(false);
      }
    };

    fetchTAs();
  }, []);

  return (
    <Layout>
      <div className="assigned-tas-container">
        <h2>🎓 Assigned TAs</h2>

        {loading ? (
          <p>Loading teaching assistants...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : tas.length === 0 ? (
          <p>No teaching assistants assigned.</p>
        ) : (
          <table className="tas-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
              </tr>
            </thead>
            <tbody>
              {tas.map((ta, index) => (
                <tr key={index}>
                  <td>{ta.rollNo}</td>
                  <td>{ta.name}</td>
                  <td>{ta.email}</td>
                  <td>{ta.course || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default ViewAssignedTAs;
