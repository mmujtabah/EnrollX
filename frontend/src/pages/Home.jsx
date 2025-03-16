import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      {/* Navigation Bar */}
      <header className="navbar">
        <div className="logo">
          <h2>EnrollX</h2>
        </div>
        <nav className="nav-links">
          <Link to="/" className="nav-btn">Home</Link>
          <Link to="/about" className="nav-btn">About</Link>
          <Link to="/contact" className="nav-btn">Contact</Link> {/* Added Contact link */}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to <span className="highlight">EnrollX</span></h1>
          <p>A seamless and efficient course registration system for students, teachers, and administrators.</p>
        </div>

        {/* Buttons */}
        <div className="buttons">
          <Link to="/student-home" className="btn student">🎓 Student Portal</Link>
          <Link to="/portal/teacher" className="btn teacher">🏫 Teacher Portal</Link>
          <Link to="/portal/admin" className="btn admin">⚙️ Admin Portal</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
