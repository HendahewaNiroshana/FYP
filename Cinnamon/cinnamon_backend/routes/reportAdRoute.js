const express = require("express");
const router = express.Router();
const Report = require("../models/ReportAdvertisement");

// Add report
router.post("/report", async (req, res) => {
  try {
    const { adId, userId, description } = req.body;
    const newReport = new Report({ adId, userId, description });
    await newReport.save();
    res.status(200).json({ success: true, message: "Report submitted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error submitting report" });
  }
});

//  Get all reports for Admin
router.get("/reports/all", async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("adId", "title imageUrl") 
      .populate("userId", "name email")    
      .sort({ createdAt: -1 });

    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



module.exports = router;