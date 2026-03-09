const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

// 🔹 Add a comment
router.post("/:productId", async (req, res) => {
  try {
    const { userId, text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: "Text is required" });

    const comment = new Comment({
      product: req.params.productId,
      user: userId,
      text,
    });

    await comment.save();
    res.json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔹 Get all comments for product
router.get("/:productId", async (req, res) => {
  try {
    const comments = await Comment.find({ product: req.params.productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
