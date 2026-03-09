const mongoose = require("mongoose");

const adInteractionSchema = new mongoose.Schema({
  adId: { type: mongoose.Schema.Types.ObjectId, ref: "Advertisement", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  like: { type: Boolean, default: null }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AdInteraction", adInteractionSchema);