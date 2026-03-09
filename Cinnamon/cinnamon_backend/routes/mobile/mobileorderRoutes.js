const express = require("express");
const Order = require("../../models/Order");
const Product = require("../../models/Product");
const router = express.Router();

// ✅ Place an order
router.post("/", async (req, res) => {
  try {
    const { productId, name, address, phone, quantity, paymentType } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(400).json({ message: "Invalid product" });

    const totalPrice = product.price * (quantity || 1);

    const order = new Order({
      productId,
      name,
      address,
      phone,
      quantity,
      totalPrice,
      paymentType,
    });

    await order.save();
    res.json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("productId", "name price image");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
