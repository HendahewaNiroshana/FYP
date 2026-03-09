const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");
const upload = require("../middleware/upload");
const router = express.Router();


router.post("/", upload.single("profilePic"), async (req, res) => {
  try {
    const { username, gmail, contact, address, about, password, accountType } = req.body;
    const profilePic = req.file ? `/uploads/${req.file.filename}` : "";

    const newUser = new AdminUser({
      username,
      gmail,
      contact,
      address,
      about,
      profilePic,
      password,
      accountType: accountType || "admin", 
    });

    await newUser.save();
    res.json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const users = await AdminUser.find();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/:id", upload.single("profilePic"), async (req, res) => {
  try {
    const { username, gmail, contact, address, about, password, accountType } = req.body;
    const updateData = { username, gmail, contact, address, about, accountType };

    if (password && password !== "") updateData.password = password; 
    if (req.file) updateData.profilePic = `/uploads/${req.file.filename}`;

    const updatedUser = await AdminUser.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await AdminUser.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await AdminUser.findOne({ gmail: email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    if (user.password !== password) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.gmail, accountType: user.accountType }, 
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        gmail: user.gmail,
        contact: user.contact,
        address: user.address,
        about: user.about,
        profilePic: user.profilePic,
        accountType: user.accountType, 
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/edit-profile/:id", upload.single("profilePic"), async (req, res) => {
  try {
    const { username, contact, address, about, password } = req.body;

    const updateData = { username, contact, address, about };

    if (password) {
      updateData.password = password;
    }

    if (req.file) {
      updateData.profilePic = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await AdminUser.findByIdAndUpdate(
      req.params.id, 
      { $set: updateData }, 
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ 
      success: true, 
      message: "Profile updated successfully!", 
      user: updatedUser 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
