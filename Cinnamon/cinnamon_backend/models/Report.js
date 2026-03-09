const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reportedAccount: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reportingUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["unread", "reject", "accept"], 
    default: "unread" 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Report", reportSchema);