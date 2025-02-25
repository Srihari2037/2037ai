const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");

router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leads" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const newLead = new Lead({ name, email, phone });
    await newLead.save();
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ message: "Error creating lead" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting lead" });
  }
});

module.exports = router;
