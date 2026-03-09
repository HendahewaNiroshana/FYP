const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const Notification = require("../models/Notification"); 
const sendEmail = require("../utils/sendEmail");

router.post("/", async (req, res) => {
  try {
    const { userId, productId, name, address, phone, quantity, totalPrice, paymentType } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Not enough stock available!" });
    }

    const newOrder = new Order({
      userId,
      productId,
      sellerId: product.seller,
      name,
      address,
      phone,
      quantity,
      totalPrice,
      paymentType,
      paymentStatus: paymentType === "Card Payment" ? "Paid" : "Pending"
    });

    await newOrder.save();

    product.stock -= quantity;
    await product.save();

    res.json({ success: true, order: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("productId", "title description imageUrl price") 
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("productId", "title description imageUrl price");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("productId", "title");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    const buyerEmail = order.userId.email;
    const buyerName = order.userId.name;
    const productTitle = order.productId.title;

    const subject = `Your Order Status Updated: ${status}`;
    const message = `
Hi ${buyerName},

Your order has been updated.

🆕 Current Status: ${status}

Thank you for shopping with Cinnamon Bridge!
    `;

    await sendEmail(buyerEmail, subject, message);

    
    const notification = new Notification({
      userId: order.userId._id,
      title: "Order Status Updated",
      description: `Your order is now "${status}".`,
      icon: "https://cdn-icons-png.flaticon.com/512/7274/7274757.png", 
      flag: false, 
    });

    await notification.save();

    res.json({
      success: true,
      message: "✅ Order status updated, email sent, and notification created.",
      order,
    });
  } catch (err) {
    console.error("❌ Error updating order status:", err);
    res.status(500).json({ success: false, message: "Server error while updating order status" });
  }
});



router.get("/seller/:sellerId", async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.params.sellerId })
      .populate("productId", "title description imageUrl price")
      .populate("userId", "name email") 
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.error("Error fetching seller orders:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/userget/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId })
      .populate("productId")
      .sort({ createdAt: -1 }); 

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/seller-stats/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;
    const sId = new mongoose.Types.ObjectId(sellerId);

    const oneYearAgo = new Date();
    oneYearAgo.setMonth(oneYearAgo.getMonth() - 11);
    oneYearAgo.setDate(1); 

    const monthlySales = await Order.aggregate([
      { 
        $match: { 
          sellerId: sId, 
          status: "Delivered",
          createdAt: { $gte: oneYearAgo } 
        } 
      },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" }, 
            month: { $month: "$createdAt" } 
          },
          totalAmount: { $sum: "$totalPrice" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } } 
    ]);

    const productSales = await Order.aggregate([
      { $match: { sellerId: sId } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.name",
          count: { $sum: "$quantity" }
        }
      }
    ]);

    res.json({ success: true, monthlySales, productSales });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
