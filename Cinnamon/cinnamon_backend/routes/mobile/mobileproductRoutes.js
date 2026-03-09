const express = require("express");
const Product = require("../../models/Product");
const router = express.Router();

// ✅ Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name email");
    res.json(products.map(p => ({
      id: p._id,
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image ? `http://localhost:5000${p.image}` : "",
      seller: p.seller?.name || "Unknown"
    })));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
