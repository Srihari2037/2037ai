const express = require("express");
const passport = require("passport");

const router = express.Router();

// ✅ Google OAuth Login Route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// ✅ Google OAuth Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.FRONTEND_URL || "http://localhost:3000",
    failureRedirect: "/login-failed",
  })
);

// ✅ Logout Route (Express 4+ fix)
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect(process.env.FRONTEND_URL || "http://localhost:3000");
    });
  });
});

module.exports = router;
