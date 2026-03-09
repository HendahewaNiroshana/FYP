const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();
//mern
const authRoutes = require("./routes/authRoutes");
const adRoutes = require("./routes/adRoutes");
const chatRoutes = require("./routes/chatRoutes");
const productRoutes = require("./routes/products");
const commentRoutes = require("./routes/comments");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const adminUserRoutes = require("./routes/adminUsers");
const addrating = require("./routes/ads");
const emailRoutes = require("./routes/email");
const notificationRoutes = require("./routes/notificationRoutes");
const contactmessage = require("./routes/contactRoutes");
const predictionRoute = require("./routes/prediction.Route");
const reportRoute = require("./routes/reportRoutes");
const adminDashboard = require("./routes/adminDashboardRoute");
const addreportsRoute = require("./routes/reportAdRoute");
const salereportRoute = require("./routes/salereportRoutes");


//mobile
const mobileAuthRoutes = require("./routes/mobile/mobileAuthRoutes");
const mobileproductRoutes = require("./routes/mobile/mobileproductRoutes");
const mobileadRoutes = require("./routes/mobile/mobileadRoutes");
const mobileorderRoutes = require("./routes/mobile/mobileorderRoutes");


const app = express();
const PORT = process.env.PORT || 5000;

//mern
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin-users", adminUserRoutes);
app.use("/api/ads-rating", addrating);
app.use("/api/email", emailRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/contact", contactmessage);
app.use("/api/prediction", predictionRoute);
app.use("/api/reports", reportRoute);
app.use("/api/admindashboard", adminDashboard);
app.use("/api/adsreport", addreportsRoute);
app.use("/api/sale-reports", salereportRoute);


//mobile
app.use("/api/mobile-auth", mobileAuthRoutes);
app.use("/api/m-products" , mobileproductRoutes);
app.use("/api/m-ads" , mobileadRoutes);
app.use("/api/m-orders", mobileorderRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error(err));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
