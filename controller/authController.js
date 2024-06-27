const bcrypt = require("bcrypt");
const User = require("../model/UserSchema");
const sendMail = require("../util/nodemailer");

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
      await sendMail(email, otp);

      req.session.otp = otp;
      req.session.email = email;

      res
        .status(201)
        .json({ msg: "User registered successfully.Otp send to email" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  },
  otpPost: async (req, res) => {
    const { otp } = req.body;
    const { email, otp: sessionOtp } = req.session;

    if (!email || !sessionOtp) {
      return res
        .status(400)
        .json({ msg: "OTP session expired. Please try again." });
    }
    if (otp === sessionOtp) {
      await User.updateOne({ email }, { isVerified: true });
      req.session.otp = null;
      req.session.email = null;

      res
        .status(200)
        .json({ msg: "OTP verified successfully. User is now verified." });
    } else {
      res.status(400).json({ msg: "Invalid OTP. Please try again." });
    }
  },
};
