const express = require("express");
const router = express.Router();
const Advertisement = require("../models/Advertisement");
const upload = require("../middleware/upload");

// ✅ Get all ads
router.get("/", async (req, res) => {
  const ads = await Advertisement.find().populate("userId", "name email");
  res.json(ads);
});

// ✅ Get ads by user
router.get("/user/:id", async (req, res) => {
  const ads = await Advertisement.find({ userId: req.params.id });
  res.json(ads);
});

// ✅ Add new ad with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const newAd = new Advertisement({
      title: req.body.title,
      description: req.body.description,
      userId: req.body.userId,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : "" // ✅ Save relative path
    });

    await newAd.save();
    res.json({ success: true, ad: newAd });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// ✅ Get single ad
router.get("/:id", async (req, res) => {
  const ad = await Advertisement.findById(req.params.id);
  res.json(ad);
});


// ✅ Update ad
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedAd = await Advertisement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ success: true, ad: updatedAd });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// ✅ Delete ad by ID
router.delete("/:id", async (req, res) => {
  try {
    const ad = await Advertisement.findByIdAndDelete(req.params.id);
    if (!ad) {
      return res.status(404).json({ success: false, message: "Advertisement not found" });
    }
    res.json({ success: true, message: "Advertisement deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
