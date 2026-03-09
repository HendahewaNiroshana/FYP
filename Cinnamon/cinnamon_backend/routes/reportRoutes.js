const router = require("express").Router();
const Report = require("../models/Report");
const User = require("../models/User");

router.post("/add", async (req, res) => {
  try {
    const { reportedAccountName, reportingUserEmail, reason, description } = req.body;

    const targetUser = await User.findOne({ name: reportedAccountName });
    if (!targetUser) {
      return res.status(404).json({ 
        success: false, 
        message: "User Not Founded." 
      });
    }

    const fromUser = await User.findOne({ email: reportingUserEmail });
    if (!fromUser) {
      return res.status(404).json({ 
        success: false, 
        message: "Your Email not Founded. Please Login Again." 
      });
    }

    const newReport = new Report({
      reportedAccount: targetUser._id, 
      reportingUser: fromUser._id,
      reason,
      description,
      status: "unread",
      createdAt: new Date()
    });

    await newReport.save();
    res.json({ success: true, message: "Report submitted successfully!" });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reportedAccount", "name email accountType")
      .populate("reportingUser", "name email");
    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put("/status/:id", async (req, res) => {
  try {
    await Report.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.json({ success: true, message: "Status updated" });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

router.put("/suspend/:userId", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, { accountType: "suspended" });
    res.json({ success: true, message: "Account suspended successfully" });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;