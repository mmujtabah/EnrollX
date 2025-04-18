const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

// Route to check if user is authenticated
router.get("/auth-check", verifyToken, (req, res) => {
  res.json({ message: "✅ Authenticated" });
});

// Route to log out user and clear token cookie
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax", // or "None" if you're using HTTPS + cross-site
    secure: false, // set to true in production with HTTPS
  });
  res.json({ message: "✅ Logged out and token cleared" });
});


module.exports = router;
