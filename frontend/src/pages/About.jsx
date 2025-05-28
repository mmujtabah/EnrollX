import React from "react";
import "./About.css";
import Layout from "./components/Layout.jsx";

const About = () => {
  return (
    <Layout>
      <div className="about-container">
        <div className="about-header">
          <h1>About EnrollX</h1>
          <p className="tagline">Smarter, Faster, Simpler Course Registration System</p>
        </div>

        <div className="about-description">
          <p>
            EnrollX is your go-to platform for efficient course registration – no more long queues,
            chaotic spreadsheets, or last-minute panic enrollments. Whether you're a student,
            instructor, or admin, we've built this with you in mind.
          </p>
          <p>
            With a clean interface, secure architecture, and blazing-fast performance,
            EnrollX makes selecting and managing courses feel less like a chore and more like... well, slightly less of a chore.
          </p>
        </div>

        <div className="team-section">
          <h2>Meet the Creators</h2>
          <div className="team-cards">
            <div className="team-member">
              <h3>Mujtaba</h3>
              <p>Backend & Auth Flow – makes sure your data is safe and sound (mostly).</p>
            </div>
            <div className="team-member">
              <h3>Harris</h3>
              <p>Frontend & UI Design – turning wireframes into wow-frames.</p>
            </div>
            <div className="team-member">
              <h3>Shafan</h3>
              <p>Database & API Integration – speaks fluent SQL and whispers to servers.</p>
            </div>
            <div className="team-member">
              <h3>ChatGPT</h3>
              <p>
                Debug Therapist & Late-Night Coding Partner – provided by OpenAI. May not sleep,
                but definitely ships clean code and existential jokes at 3 AM.
              </p>
            </div>
          </div>
          <p className="team-credit">
            This project is proudly built by <strong>ColdBlooded</strong> – powered by teamwork, determination,
            and occasional AI intervention.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
