const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { spawn } = require("child_process");

router.get("/product/:productId", async (req, res) => {
  try {
    const orders = await Order.find({
      productId: req.params.productId,
      status: "Delivered" 
    }).sort({ createdAt: 1 });

    const monthly = {};
    orders.forEach(o => {
      const key = `${o.createdAt.getFullYear()}-${o.createdAt.getMonth() + 1}`;
      monthly[key] = (monthly[key] || 0) + o.quantity;
    });

    const salesArray = Object.values(monthly);

    const py = spawn("python", ["python/predict.py", JSON.stringify(salesArray)]);

    py.stdout.on("data", data => {
      res.json({
        success: true,
        orders: orders || [],
        prediction: Number(data.toString()) || 0
      });
    });

    py.stderr.on("data", err => {
      console.error("Python error:", err.toString());
      res.json({
        success: true,
        orders: orders || [],
        prediction: 0
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      orders: [],
      prediction: 0
    });
  }
});

router.get("/overall-stats", async (req, res) => {
  try {
    const orders = await Order.find({ status: "Delivered" }).populate('productId');
    
    const productStats = {};
    orders.forEach(o => {
      const pid = o.productId?._id;
      if (!pid) return;
      if (!productStats[pid]) {
        productStats[pid] = { name: o.productId.name, price: o.productId.price, sales: [] };
      }
      productStats[pid].sales.push(o.quantity);
    });

    let totalRevenue = 0;
    let bestProduct = { name: "No Data", prediction: 0 };

    const productList = Object.values(productStats);
    
    for (let prod of productList) {
      const salesArray = prod.sales;
      let pred = salesArray.length > 0 ? Math.max(...salesArray) + 1 : 0; 

      totalRevenue += (pred * prod.price);
      if (pred > bestProduct.prediction) {
        bestProduct = { name: prod.name, prediction: pred };
      }
    }

    res.json({
      success: true,
      bestProduct,
      totalRevenue
    });
  } catch (err) {
    console.error("Backend Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


router.get("/sales-chart-data", async (req, res) => {
  try {
    const orders = await Order.find({ status: "Delivered" }).sort({ createdAt: 1 });

    const monthlySales = {};

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      monthlySales[monthYear] = (monthlySales[monthYear] || 0) + order.quantity;
    });

    const chartFormatData = Object.keys(monthlySales).map(key => ({
      name: key, 
      sales: monthlySales[key] 
    }));

    res.json({
      success: true,
      data: chartFormatData
    });

  } catch (err) {
    console.error("Chart Data Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;