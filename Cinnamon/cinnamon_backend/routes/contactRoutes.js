const express = require("express");
const ContactMessage = require("../models/ContactMessage");
const Notification = require("../models/Notification");
const User = require("../models/User");


const router = express.Router();

// POST: Save message
router.post("/", async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const newMessage = new ContactMessage({ userId, message });
    await newMessage.save();

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.get("/all", async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .populate("userId", "name accountType email")
      .sort({ time: -1 });

    res.json({ success: true, messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.post("/reply/:id", async (req, res) => {
  try {
    const { reply } = req.body;
    const messageId = req.params.id;

    if (!reply) {
      return res.status(400).json({ success: false, message: "Reply text is required" });
    }

    const message = await ContactMessage.findById(messageId).populate("userId");

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    // ✅ Mark as replied
    message.replied = true;
    await message.save();

    // Save reply as a notification only
    const newNotification = new Notification({
      userId: message.userId._id,
      title: "Admin Support",
      description: reply,
      icon: "https://www.iconpacks.net/icons/2/free-customer-support-icon-1709-thumb.png",
    });

    await newNotification.save();

    res.json({ success: true, message: "Reply sent and saved as notification!" });
  } catch (err) {
    console.error("Error sending reply:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



module.exports = router;
