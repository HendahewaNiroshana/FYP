const express = require("express");
const mongoose = require("mongoose");
const Notification = require("../models/Notification");

const router = express.Router();

// ✅ Create a new notification
router.post("/", async (req, res) => {
  try {
    const { userId, title, description, icon } = req.body;

    if (!userId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "userId, title, and description are required",
      });
    }

    const newNotification = new Notification({
      userId,
      title,
      description,
      icon: icon || "", // optional
      flag: false, // default unread
      createdAt: new Date(),
    });

    await newNotification.save();

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
    });
  } catch (err) {
    console.error("❌ Error creating notification:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Fetch notifications for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({
      $or: [
        { userId }, // string match
        { userId: new mongoose.Types.ObjectId(userId) }, // ObjectId match
      ],
    }).sort({ createdAt: -1 });

    res.json({ success: true, notifications });
  } catch (err) {
    console.error("❌ Error fetching notifications:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ✅ Mark notification as read
router.put("/read/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const notification = await Notification.findByIdAndUpdate(
      id,
      { flag: true },
      { new: true }
    );

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    res.json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (err) {
    console.error("❌ Error marking notification as read:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
