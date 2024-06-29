const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

// Define your routes here
router.post("/signup", authController.userSignupPost);
router.post("/verifyotp", authController.otpPost);

module.exports = router;
