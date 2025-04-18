const express = require("express"); 
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const studentRoutes = require("./routes/studentRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes"); // ✅ Add this

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Match frontend origin
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/students", studentRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api", authRoutes); // ✅ Mount the auth-check route

// ✅ Test Route
app.get("/", (req, res) => res.send("🚀 Server is running!"));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
