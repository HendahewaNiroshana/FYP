const express = require("express");
const sendEmail = require("../utils/sendEmail");
const router = express.Router();

// POST /api/email/send
router.post("/send", async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const result = await sendEmail(to, subject, message);

    if (result) {
      res.json({ success: true, message: "Email sent successfully!" });
    } else {
      res.status(500).json({ success: false, message: "Failed to send email" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



module.exports = router;
