const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  accountType: { type: String, enum: ["user", "pending", "business"], required: true },
  name: String,
  email: { type: String, unique: true, required: true },
  contact: String,
  address: String,
  userProfilePic: String,
  businessName: String,
  businessLocation: String,
  businessContact: String,
  website: String,
  link1: String,
  link2: String,
  link3: String,
  businessBR: String, 
  password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);