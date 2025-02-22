const express = require("express");
const router = express.Router();
const Lead = require("../models/lead");

// ✅ Get all leads
router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create a new lead
router.post("/", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const newLead = new Lead({ name, email, phone });
    await newLead.save();
    res.status(201).json(newLead);
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete a lead by ID
router.delete("/:id", async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
