const mongoose = require("mongoose");

const ReportadvertismentSchema = new mongoose.Schema({
  adId: { type: mongoose.Schema.Types.ObjectId, ref: "Advertisement", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ReportAdvertisment", ReportadvertismentSchema);