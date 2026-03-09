const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    gmail: { type: String, required: true, unique: true },
    contact: { type: String },
    address: { type: String },
    profilePic: { type: String }, 
    about: { type: String },
    password: { type: String, required: true },
    accountType: { 
      type: String, 
      enum: ["superadmin", "admin", "editor", "viewer"], 
      default: "admin" 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminUser", adminUserSchema);
