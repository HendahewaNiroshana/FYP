const router = require("express").Router();
const User = require("../models/User");
const ContactMessage = require("../models/ContactMessage");
const Report = require("../models/Report");
const AdReport = require("../models/ReportAdvertisement");

router.get("/dashboard-stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const businessRequests = await User.countDocuments({ accountType: "pending" });
    const businessUsers = await User.countDocuments({ accountType: "business" });
    const normalUsers = await User.countDocuments({ accountType: "user" });
    const addReportsCount = await AdReport.countDocuments();

    const unreadMessages = await ContactMessage.countDocuments({ replied: false });

    const newReports = await Report.countDocuments({ status: "unread" });

    res.json({
      success: true,
      stats: {
        totalUsers,
        businessRequests,
        businessUsers,
        normalUsers,
        unreadMessages,
        newReports,
        trafficToday: "12.4k", 
        notifications: "7 New" ,
        addReports: addReportsCount,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/dashboard-charts", async (req, res) => {
  try {
    const monthlyGrowth = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const businessCount = await User.countDocuments({ accountType: "business", businessName: { $exists: true, $ne: "" } });
    const normalCount = await User.countDocuments({ accountType: "user", businessName: { $exists: false } });
    const pendingCount = await User.countDocuments({ accountType: "pending" });

    res.json({
      success: true,
      chartData: {
        monthly: monthlyGrowth,
        distribution: { businessCount, normalCount, pendingCount }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;