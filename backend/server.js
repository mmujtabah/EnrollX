const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS Configuration
app.use(cors({ 
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true 
}));

app.use(express.json()); // Parse JSON request bodies

// Debugging: Log all incoming requests
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// ✅ Use the simplified studentRoutes.js
app.use("/api/students", require("./api/studentRoutes"));

// Handle unknown routes
app.use("*", (req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
