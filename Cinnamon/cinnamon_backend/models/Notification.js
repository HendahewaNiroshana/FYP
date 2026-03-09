const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String, // e.g. image URL or icon path
      default: "",
    },
    flag: {
      type: Boolean,
      default: false, // false = unread, true = read
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
