const express = require("express");
const Advertisement = require("../models/Advertisement");
const AdInteraction = require("../models/AdInteraction");
const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) return res.status(404).json({ success: false, message: "Ad not found" });

    const interactions = await AdInteraction.find({ adId: ad._id }).populate("userId", "name");
    res.json({ success: true, ad, interactions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/:id/interact", async (req, res) => {
  try {
    const { userId, comment, rating, like } = req.body;
    const adId = req.params.id;

    if (comment && comment.trim() !== "") {
      const newComment = new AdInteraction({
        adId,
        userId,
        comment,
      });
      await newComment.save();
      return res.json({ success: true, message: "Comment added!" });
    }

    let interaction = await AdInteraction.findOne({ 
        adId, 
        userId, 
        comment: { $exists: false } 
    });

    if (interaction) {
      if (rating !== undefined) interaction.rating = rating;
      if (like !== undefined) interaction.like = like;
      await interaction.save();
    } else {
      interaction = new AdInteraction({ adId, userId, rating, like });
      await interaction.save();
    }

    res.json({ success: true, message: "Preference updated!" });
  } catch (err) {
    console.error("Interaction Error:", err);
    res.status(500).json({ success: false, message: "Server error during interaction" });
  }
});

// PUT /api/ads/:id
router.put("/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) return res.status(404).json({ success: false, message: "Ad not found" });

    if (title) ad.title = title;
    if (description) ad.description = description;

    await ad.save();
    res.json({ success: true, ad });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


module.exports = router;
