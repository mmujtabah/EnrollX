const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Fix: Ensure proper CORS configuration
app.use(cors({ 
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true 
}));

app.use(express.json()); // Parse JSON request bodies

// Test Route to check if server is running
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Fix: Ensure the route file exists
app.use("/api/auth", require("./api/routes/auth"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
