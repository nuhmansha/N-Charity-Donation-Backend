const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  number: { type: String, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
});
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
