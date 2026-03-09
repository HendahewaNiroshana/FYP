const express = require("express");
const User = require("../../models/User"); 
const upload = require("../../middleware/upload");
const router = express.Router();

// 📌 Register (plain password save)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing user
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      name,
      email,
      password, // ⚠ plain text (not recommended for production)
    });

    await user.save();

    res.json({
      message: "Registration successful",
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Check if account type is "business"
    if (user.accountType !== "business") {
      return res.status(403).json({ message: "Only business accounts can log in" });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userProfilePic: user.userProfilePic || "",
        accountType: user.accountType,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



// ✅ Get user by ID
router.get("/get/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Update user by ID
router.put("/updateById/:id", upload.single("userProfilePic"), async (req, res) => {
  try {
    const updates = req.body;

    if (req.file) {
      updates.userProfilePic = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
