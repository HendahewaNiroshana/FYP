const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  embedding: { type: [Number] }, 
});

module.exports = mongoose.model("Document", DocumentSchema);
