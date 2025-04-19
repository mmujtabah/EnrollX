const jwt = require("jsonwebtoken");

// Middleware to verify token from cookies
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Access Denied. Token missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};

// Role-based access control 
const verifyRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied, insufficient role" });
    }

    next();
  };
};

module.exports = { verifyToken, verifyRole };
