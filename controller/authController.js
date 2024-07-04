const User = require("../model/UserSchema");
const sendMail = require("../util/nodemailer");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

module.exports = {
  userSignupPost: async (req, res, next) => {
    console.log("Signup request received");

    try {
      const { name, email, number, password } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      user = new User({
        name,
        email,
        number,
        password: hashedPassword,
      });

      await user.save();

      // Send confirmation email
      const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
      req.session.otp = otp;
      req.session.email = email;
      console.log("Generated OTP:", otp, "for email:", email);
      console.log("Session after signup:", req.session.otp, req.session.email);
      await sendMail(email, otp);

      res
        .status(201)
        .json({ msg: "User registered successfully. OTP sent to email" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  },

  otpPost: async (req, res) => {
    const { otp } = req.body;

    try {
      const sessionEmail = req.session.email;
      const sessionOtp = req.session.otp;
      console.log("Received OTP:", otp);
      console.log("Session:", req.session);
      console.log("Stored email and OTP:", sessionEmail, sessionOtp);

      if (!sessionEmail || !sessionOtp) {
        return res
          .status(400)
          .json({ msg: "OTP session expired. Please try again." });
      }

      if (otp === sessionOtp.toString()) {
        // Update user verification status
        await User.updateOne({ email: sessionEmail }, { isVerified: true });

        // Clear session variables
        req.session.otp = null;
        req.session.email = null;

        res.status(200).json({
          msg: "OTP verified successfully. User is now verified.",
        });
      } else {
        res.status(400).json({ msg: "Invalid OTP. Please try again." });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      res.status(500).send("Server error");
    }
  },
  loginPost: async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }
      console.log(isMatch);

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

    } catch (error) {
      console.error("Login error:", error.message);
      res.status(500).send("Server error");
    }
  },
};
