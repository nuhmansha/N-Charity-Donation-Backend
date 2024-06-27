const express = require('express');
const router = express.Router();
const authController = require("../controller/authController")

// Define your routes here
router.post('/signup',authController.userSignupPost);
router.post('/verify-otp',authController.otpPost)

module.exports = router;


