import React from "react";
import "./About.css";  // Optional, for styling
import Layout from "./components/Layout.jsx";

const About = () => {
  return (
    <Layout>
      <div className="about">
        <h1>About EnrollX</h1>
        <p>
          EnrollX is a seamless and efficient course registration system for students, instructors, and administrators. 
          It simplifies the process of course selection, enrollment, and management for all parties involved.
        </p>
        <p>
          Our platform is designed to provide a smooth, user-friendly experience, making the registration process as easy 
          as possible while ensuring that all your course-related data is stored securely.
        </p>
      </div>
    </Layout>
  );
};

export default About;
