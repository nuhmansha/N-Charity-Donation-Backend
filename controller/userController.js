const User = require("../model/UserSchema");
const jwt = require("jsonwebtoken");

module.exports = {
  userHomeGet: async (req, res) => {
    console.log("Reached userHomeGet"); // Ensure this message logs

    try {
      const token = req.headers.authorization.split(" ")[1];
      console.log(token, "home");

      // Verify and decode JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      // Fetch user from database
      const user = await User.findById(decoded.user.id).select("-password");
      console.log(user);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      res.status(500).send("Server error");
    }
  },
};
