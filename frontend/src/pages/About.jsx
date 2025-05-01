import React from "react";
import "./About.css";
import Layout from "./components/Layout.jsx";

const About = () => {
  return (
    <Layout>
      <div className="about-container">
        <div className="about-header">
          <h1>About EnrollX</h1>
          <p className="tagline">Smarter, Faster, Simpler Course Registration</p>
        </div>

        <div className="about-description">
          <p>
            EnrollX is a seamless and efficient course registration system for students, instructors, and administrators.
            It simplifies the process of course selection, enrollment, and management for all parties involved.
          </p>
          <p>
            Our platform offers a smooth, user-friendly experience, ensuring secure storage of your course-related data,
            while keeping the registration process as intuitive as possible.
          </p>
        </div>

        <div className="team-section">
          <h2>Meet the Creators</h2>
          <div className="team-cards">
            <div className="team-member">
              <h3>Mujtaba</h3>
              <p>Backend & Auth Flow</p>
            </div>
            <div className="team-member">
              <h3>Harris</h3>
              <p>Frontend & UI Design</p>
            </div>
            <div className="team-member">
              <h3>Shafan</h3>
              <p>Database & API Integration</p>
            </div>
          </div>
          <p className="team-credit">Project proudly built by <strong>ColdBlooded</strong>.</p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
