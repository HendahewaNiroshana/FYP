const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Otp = require("../models/Otp");
const sendEmail = require("../utils/sendEmail");
const upload = require("../middleware/upload");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

//  Register 
router.post("/register", upload.single("userProfilePic"), async (req, res) => {
  try {
    const userData = req.body;

    if (req.file) {
      userData.userProfilePic = "/uploads/" + req.file.filename; 
    }

    const user = new User(userData);
    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

//  Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    if (user.accountType === "suspended") {
      return res.status(403).json({ 
        success: false, 
        message: "Your account has been suspended by the admin. Please contact support." 
      });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: "1d" }
    );

    res.json({ success: true, token, user }); 

  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Sent OTP
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Email address not found." });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await Otp.findOneAndUpdate({ email }, { otp }, { upsert: true, new: true });

  const message = `Your Cinnamon Bridge OTP code: ${otp}`;
  const success = await sendEmail(email, "Password Reset OTP", message);

  if (success) res.json({ success: true, message: "OTP sent successfully." });
  else res.status(500).json({ message: "Failed to send email." });
});

// Password Reset 
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const validOtp = await Otp.findOne({ email, otp });
  if (!validOtp) return res.status(400).json({ message: "Invalid or expired OTP code." });

  await User.findOneAndUpdate({ email }, { password: newPassword });
  
  await Otp.deleteOne({ email }); 

  res.json({ success: true, message: "Password updated successfully!" });
});


//  Update user
router.put("/update/:id", upload.single("userProfilePic"), async (req, res) => {
  try {
    const { name, email, contact, address } = req.body;
    
    let updateData = { name, email, contact, address };

    if (req.file) {
      updateData.userProfilePic = "/uploads/" + req.file.filename;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { $set: updateData }, 
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("Backend Update Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Request Business Account
router.put("/request-business/:id", upload.single("businessBR"), async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      businessName, 
      businessLocation, 
      businessContact, 
      website, 
      link1, 
      link2, 
      link3 
    } = req.body;

    const updateData = {
      businessName,
      businessLocation,
      businessContact,
      website,
      link1,
      link2,
      link3,
      accountType: "pending",
    };

    if (req.file) {
      updateData.businessBR = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});



module.exports = router;
