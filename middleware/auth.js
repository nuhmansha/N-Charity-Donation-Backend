const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.header("Authorization");
  console.log(authHeader, "aaaaaa");
  if (!authHeader) {
    return res.status(401).json({ msg: "Authorization denied" });
  }

  const token = authHeader.split(" ")[1]; // Assuming the token is sent as "Bearer <token>"
  console.log("Token:", token);

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "Authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Adjust based on your JWT payload structure
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
