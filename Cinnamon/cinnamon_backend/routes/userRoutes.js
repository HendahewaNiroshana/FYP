const express = require("express");
const router = express.Router();
const User = require("../models/User");

// get counts
router.get("/counts", async (req, res) => {
  try {
    const userCount = await User.countDocuments({ accountType: "user" });
    const businessCount = await User.countDocuments({ accountType: "business" });
    res.json({ userCount, businessCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    const user = await User.findOne({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ],
    });
    if (!user) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).send(error);
  }
});

// get all users
router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get all pending business requests
router.get("/pending", async (req, res) => {
  try {
    const pendingUsers = await User.find({ accountType: "pending" });
    res.json({ success: true, users: pendingUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Approve a user as business
router.put("/approve/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { accountType: "business" },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get single user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
//find account
router.post("/add", async (req, res) => {
  try {
    const { reportedAccountName, reportingUserEmail, reason, description } = req.body;

    const fromUser = await User.findOne({ email: reportingUserEmail });
    
   
    const targetUser = await User.findOne({ name: reportedAccountName });

    if (!targetUser) {
      return res.status(404).json({ 
        success: false, 
        message: "User Not Found." 
      });
    }

    if (!fromUser) {
      return res.status(404).json({ 
        success: false, 
        message: "Reporting user not found." 
      });
    }

    const newReport = new Report({
      reportedAccount: targetUser._id, 
      reportingUser: fromUser._id,
      reason: reason,
      description: description,
      status: "unread"
    });

    await newReport.save();
    res.json({ success: true, message: "Reported successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


module.exports = router;
