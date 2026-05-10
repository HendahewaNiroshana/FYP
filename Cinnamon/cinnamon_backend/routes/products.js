const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const User = require("../models/User");
const upload = require("../middleware/upload");

router.get("/seller/:sellerId", async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.sellerId });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, stock, sellerId } = req.body;

    const seller = await User.findById(sellerId);
    if (!seller || seller.accountType !== "business") {
      return res.json({ success: false, message: "නිෂ්පාදන ඇතුළත් කළ හැක්කේ ව්‍යාපාරික ගිණුම්වලට පමණි." });
    }

    let imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const product = new Product({
      name,
      description,
      price,
      stock,
      image: imagePath,
      seller: seller._id,
    });

    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//  (Update)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//  (Delete)
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "නිෂ්පාදනය සාර්ථකව මකා දමන ලදී." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name");
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/product/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'name email');
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "name email")
      .populate("comments.user", "name"); 

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 👍 Like Logic 
router.post("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false });

    product.dislikedBy = product.dislikedBy.filter(id => id.toString() !== userId);

    const alreadyLiked = product.likedBy.find(id => id.toString() === userId);
    if (alreadyLiked) {
      product.likedBy = product.likedBy.filter(id => id.toString() !== userId);
    } else {
      product.likedBy.push(userId);
    }

    await product.save();
    res.json({ 
      success: true, 
      likes: product.likedBy.length, 
      dislikes: product.dislikedBy.length 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 👎 Dislike Logic 
router.post("/:id/dislike", async (req, res) => {
  try {
    const { userId } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false });

    product.likedBy = product.likedBy.filter(id => id.toString() !== userId);

    const alreadyDisliked = product.dislikedBy.find(id => id.toString() === userId);
    if (alreadyDisliked) {
      product.dislikedBy = product.dislikedBy.filter(id => id.toString() !== userId);
    } else {
      product.dislikedBy.push(userId);
    }

    await product.save();
    res.json({ 
      success: true, 
      likes: product.likedBy.length, 
      dislikes: product.dislikedBy.length 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//  Comment 
router.post("/:id/comment", async (req, res) => {
  try {
    const { userId, text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: "Comment cannot be empty" });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false });

    product.comments.push({ user: userId, text });
    await product.save();

    const updatedProduct = await Product.findById(req.params.id).populate("comments.user", "name");
    res.json({ success: true, comments: updatedProduct.comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;