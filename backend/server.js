const express = require("express");
const cors = require("cors");
require("dotenv").config();

const studentRoutes = require("./routes/studentRoutes");
const instructorRoutes = require("./routes/instructorRoutes")
const adminRoutes = require("./routes/adminRoutes")

const app = express();

// ✅ Middleware
app.use(
    cors({
      origin: "http://localhost:5173", // ✅ Set frontend URL, not '*'
      credentials: true, // ✅ Allow credentials (cookies, headers)
    })
  );
app.use(express.json());

// ✅ Routes
app.use("/api/students", studentRoutes);
app.use("/api/instructors", instructorRoutes)
app.use("/api/admins", adminRoutes)

// ✅ Test Route
app.get("/", (req, res) => res.send("🚀 Server is running!"));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
