const express = require("express");
const router = express.Router();
const User = require("../models/User");
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

//  Update user
router.put("/update/:id", upload.single("userProfilePic"), async (req, res) => {
  try {
    const updates = req.body;

    if (req.file) {
      updates.userProfilePic = "/uploads/" + req.file.filename;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!user) return res.json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    res.json({ success: false, message: err.message });
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
