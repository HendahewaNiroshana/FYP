const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/Order");

router.get("/seller-detailed-report/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;
    const sId = new mongoose.Types.ObjectId(sellerId);

    const report = await Order.aggregate([
      { $match: { sellerId: sId } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          monthlyTotalSales: { $sum: "$totalPrice" },
          orders: {
            $push: {
              _id: "$_id",
              productName: "$productInfo.name",
              customerName: "$name",
              quantity: "$quantity",
              totalPrice: "$totalPrice",
              status: "$status",
              date: "$createdAt"
            }
          }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } } 
    ]);

    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;