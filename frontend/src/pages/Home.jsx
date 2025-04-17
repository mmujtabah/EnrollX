// src/pages/Home.js
import { Link } from 'react-router-dom';
import React from "react";
import Layout from "./components/Layout.jsx";
import "./Home.css";

const Home = () => {
  return (
    <Layout>
      <div className="home">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>Welcome to <span className="highlight">EnrollX</span></h1>
            <p>A seamless and efficient course registration system for students, instructors, and administrators.</p>
          </div>

          {/* Buttons */}
          <div className="buttons">
            <Link to="/student-portal" className="btn student">🎓 Student Portal</Link>
            <Link to="/instructor-login" className="btn instructor">🏫 Instructor Portal</Link>
            <Link to="/admin-login" className="btn admin">⚙️ Admin Portal</Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
