const express = require("express");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");
const Lead = require("../models/Lead");
const router = express.Router();

// Create a new lead
router.post("/", authenticateUser, authorizeRole(['admin', 'user']), async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all leads
router.get("/", authenticateUser, authorizeRole(['admin', 'user']), async (req, res) => {
  try {
    const leads = await Lead.find();
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single lead by ID
router.get("/:id", authenticateUser, authorizeRole(['admin', 'user']), async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a lead by ID
router.put("/:id", authenticateUser, authorizeRole(['admin']), async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.status(200).json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a lead by ID
router.delete("/:id", authenticateUser, authorizeRole(['admin']), async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;