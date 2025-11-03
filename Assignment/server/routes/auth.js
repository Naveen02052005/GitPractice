const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
    successRedirect: "http://localhost:3000",
  })
);

router.get("/me", (req, res) => {
  if (req.user) return res.json(req.user);
  res.status(401).json({ message: "Not authenticated" });
});

router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).send(err);
    res.redirect("http://localhost:3000");
  });
});

module.exports = router;
