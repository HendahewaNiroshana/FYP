const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Advertisement", adSchema);
