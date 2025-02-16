const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  product: { type: String, required: true },
}, { timestamps: true });

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;