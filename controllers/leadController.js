const Lead = require("../models/lead");

// ✅ Get all leads
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leads" });
  }
};
