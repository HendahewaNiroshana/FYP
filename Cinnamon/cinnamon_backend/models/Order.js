const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  name: String,
  address: String,
  phone: String,
  quantity: Number,
  totalPrice: Number,
  paymentType: { type: String, enum: ["Cash on Delivery", "Card Payment"], required: true },
  paymentStatus: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
  status: {
    type: String,
    enum: ["Pending", "Packed", "On Delivery", "Delivered"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
