const express = require('express');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');  // Correct path
const router = express.Router();

// Example of a protected route
router.get('/profile', authenticateUser, (req, res) => {
  res.json({ message: "This is a protected profile route", user: req.user });
});

// Another protected route example
router.get('/dashboard', authenticateUser, (req, res) => {
  res.json({ message: "This is a protected dashboard route" });
});

// Example of role-based access (optional)
router.get('/admin', authenticateUser, authorizeRole(['admin']), (req, res) => {
  res.json({ message: "This is an admin-only route" });
});

module.exports = router;