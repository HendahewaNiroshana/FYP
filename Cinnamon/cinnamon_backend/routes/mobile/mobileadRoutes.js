const express = require("express");
const Advertisement = require("../../models/Advertisement");
const router = express.Router();

// ✅ Get all ads
router.get("/", async (req, res) => {
  try {
    const ads = await Advertisement.find();
    res.json(ads.map(a => ({
      id: a._id,
      title: a.title,
      description: a.description,
      imageUrl: a.imageUrl ? `http://localhost:5000${a.imageUrl}` : "",
    })));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
